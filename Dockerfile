# nginx serving the built studio site (www.minified.work).
#
# `dist/` must already be rendered — run `node build.mjs` first (ci/deploy.sh does
# this in a node:26 container before the image build, the same as the sloth/sleuth
# siblings). Built multi-arch on Ruxa (amd64 + arm64), pushed to 192.168.4.9:5000,
# pulled on Hurska (Pi, arm64). Fronted by Ayula as https://www.minified.work.
FROM nginx:alpine

# Links the public ghcr package back to this repo — manual/Ruxa pushes don't
# auto-link the way a GITHUB_TOKEN Actions push does, so it's set explicitly.
LABEL org.opencontainers.image.source=https://github.com/bjornbasar/minified
LABEL org.opencontainers.image.description="Minified.Work — studio site (www.minified.work)"

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY dist/ /usr/share/nginx/html/

EXPOSE 80
