#!/usr/bin/env bash
# minified local CI/CD deploy — renders the studio site, runs the build-assertion
# gate, builds MULTI-ARCH (amd64 + arm64, legacy of when this ran on arm64 Hurska),
# pushes the local registry (:latest + :sha- for rollback), redeploys Bosco, then a
# best-effort PUBLIC ghcr copy (this repo is public — its only cloud path).
#
# Runs on Ruxa via `git push den main` (post-receive) or by hand from the checkout.
# The site is entirely self-contained: unlike sleuth, build.mjs reads nothing outside
# this tree, so no CI_NODE_MOUNTS are needed.
set -euo pipefail
source "${CI_LIB:-/data/git/ci-lib.sh}"

BOSCO="ubuntu@192.168.4.34"
BOSCO_DIR="/data/minified"
IMG="$REGISTRY/minified"

ci_trap "→ Bosco (www.minified.work)"
ci_lock
ci_ensure_buildx

# The test gate: build.mjs renders dist/, test.mjs asserts the output's shape —
# pages emitted, no dead anchors, required meta present, and the legal pages still
# making the claims they're supposed to. A failure here stops the deploy.
ci_log "render + verify (npm ci → build.mjs → test.mjs, in node:26)"
ci_node sh -c 'npm ci --no-audit --no-fund && node build.mjs && node test.mjs'

ci_log "build + push multi-arch: $IMG (:latest + :sha-$CI_SHA)"
docker buildx build --builder multiarch --platform linux/amd64,linux/arm64 \
  -t "$IMG:latest" -t "$IMG:sha-$CI_SHA" --push .

ci_log "sync compose + redeploy on Bosco"
rsync -a docker-compose.yml "$BOSCO:$BOSCO_DIR/"
ssh "$BOSCO" "cd $BOSCO_DIR && docker compose pull && docker compose up -d --remove-orphans && docker image prune -f"

# Post-deploy smoke test: all three pages, from the host itself. `-f` makes a
# non-2xx fail the deploy rather than reporting a green that isn't.
ci_log "smoke-test the deployed container"
for P in / /terms/ /privacy/; do
  ssh "$BOSCO" "curl -sf -o /dev/null -w 'minified $P → HTTP %{http_code}\n' http://localhost:8093$P"
done

# Best-effort PUBLIC ghcr copy (non-fatal; Bosco pulls the LOCAL registry).
ci_log "ghcr copy (best-effort, public)"
docker buildx build --builder multiarch --platform linux/amd64,linux/arm64 \
  -t "$GHCR_NS/minified:latest" --push . \
  || ci_log "⚠ ghcr copy failed (non-fatal; deploy already done)"
