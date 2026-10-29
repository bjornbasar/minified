# minified — the Minified.Work studio site

The studio front door at **[www.minified.work](https://www.minified.work)**: what Minified.Work does, the work it has built, and the Terms and Privacy pages.

Sibling of [`sloth`](../sloth) — same static-build pattern, different subject. `sloth` presents **Bjorn the person** (`sloth.minified.work`, `bjorn.basar.co.nz`); this presents **the studio**.

> **Minified.Work is a brand, not a registered company**, and it is a one-person studio. The site says so on the page, and the copy carries no clients, testimonials, headcount, or pricing. See *Content rules* below before editing.

## Pages

| URL | Source |
|-----|--------|
| `/` | [`content.mjs`](content.mjs) → `renderHome()` |
| `/terms/` | [`content/terms.md`](content/terms.md) → `renderDoc()` |
| `/privacy/` | [`content/privacy.md`](content/privacy.md) → `renderDoc()` |

The legal documents are **Markdown source of truth** — they render as readable Markdown here in the repo and as HTML on the site, so the published wording and the source can't drift apart.

## Build

```bash
npm ci
npm run build      # node build.mjs → dist/
npm test           # node test.mjs  → build assertions (the CI gate)
```

`dist/` is **generated** (git-ignored) — never hand-edit it.

```
minified/
├── content.mjs        # studio copy: hero, services, principles, work, stack, contact
├── legal.mjs          # legal-page metadata (slug, source, title, effective date)
├── content/*.md       # the Terms and Privacy wording
├── render.mjs         # shared shell + palette + layout CSS; renderHome / renderDoc
├── build.mjs          # writes dist/ (pages, favicons, og.png, robots.txt, sitemap.xml)
├── test.mjs           # 157 build assertions — runs in CI before the image build
├── assets/            # brand/lockup.svg (CSS-themed), favicons, og card
├── nginx.conf         # absolute_redirect off + cache headers (see Trailing slashes)
├── Dockerfile         # nginx:alpine
├── docker-compose.yml # Bosco, :8093
└── ci/deploy.sh       # git push den main → build → test → registry → Bosco
```

## Design

**Selesnya (green/white)** — minified.work's colour identity in the [domain → MTG palette mapping](../logos), which keeps it distinct from `sloth` (purple) and `basar` (blue). Accent `#0F766E` light / `#14B8A6` dark, over the shared warm brand neutrals; the pairing is the one already used by Ayula's branded minified.work 404 page.

The header lockup is [`assets/brand/lockup.svg`](assets/brand/lockup.svg) — a vendored copy of [`logos/minified.work/minified-lockup-wide.svg`](../logos/minified.work) with the two wordmark paths tagged `.lm-word` / `.lm-tld`, so CSS themes them from the palette (CSS beats the SVG's presentation-attribute fills) while the teal mark tile stays brand-fixed. That's why only one lockup file is needed instead of a light and a reversed one.

Favicons and `assets/og.png` are **committed, pre-rasterised** artefacts — `rsvg-convert` isn't available in the `node:26-alpine` build container. To regenerate after a logo change:

```bash
rsvg-convert -w 180 -h 180 assets/favicon.svg -o assets/apple-touch-icon.png
rsvg-convert -w  32 -h  32 assets/favicon.svg -o /tmp/f32.png
rsvg-convert -w  16 -h  16 assets/favicon.svg -o /tmp/f16.png && convert /tmp/f16.png /tmp/f32.png assets/favicon.ico
rsvg-convert -w 1200 -h 630 assets/og.svg -o assets/og.png
```

## Content rules

`content.mjs` carries these as a comment block because they're the reason the copy reads the way it does, and `test.mjs` enforces the load-bearing ones:

- **No clients, testimonials, logos, awards, headcount, or years-in-business.** Nothing on the page may imply a track record the studio doesn't have.
- **Every project shown is our own** — the "Selected work" note states that explicitly, and a test asserts it stays there.
- **Not trading** → no pricing, rates, SLAs, or availability promises.
- **The "we" must stay attributed.** The band under the hero names Bjorn and links to `bjorn.basar.co.nz`; tests fail if either disappears.

The privacy policy's factual claims were verified against the running stack, and tests pin the ones that could silently rot — the **14-day** log retention (Ayula's `logrotate`, `rotate 14`), the analytics provider, and the honest Do-Not-Track disclosure (GoatCounter's `count.js` does **not** check DNT, so the page says so rather than claiming a courtesy it doesn't extend).

## Trailing slashes

`/terms/` and `/privacy/` are directory indexes, so a request for `/terms` gets a 301 adding the slash. [`nginx.conf`](nginx.conf) sets `absolute_redirect off` — without it that `Location` is built from what nginx knows about itself, which behind Ayula means `http://<host>:8093/terms/`: wrong scheme, wrong port, internal address. The single-page `sloth`/`sleuth` siblings never hit this, which is why they carry no `nginx.conf`.

## Hosting

`nginx:alpine` on **Bosco** (x86_64, moved off Hurska 2026-10-23) at `:8093`, reverse-proxied by **Ayula** as `https://www.minified.work` (`*.minified.work` Cloudflare Origin cert; the name rides the wildcard). Ayula intercepts 404s and serves the branded minified.work page.

Bosco's static-site ports: `8091` sloth · `8092` basar · `8093` minified · `8094` basar-cv · `8095` family-map · `8096` diana-cv · `8097` mrs-peopsquik · `8098` twobots (sleuth moved to Lumra `:8090` alongside the `*-docs` sites).

## Deploy

```bash
git push den main     # → post-receive on Ruxa → ci/deploy.sh
```

Build → test gate → multi-arch image → local registry `192.168.4.9:5000` (`:latest` + `:sha-<short>`) → redeploy Bosco → smoke-test all three pages → best-effort public `ghcr.io/bjornbasar/minified` copy. Rollback = repin the compose `image:` to a prior `:sha-`.

## Analytics

Cookieless, self-hosted **GoatCounter** at [traffic.bjornbasar.com](https://traffic.bjornbasar.com) — a silent beacon, no visitor badge. Each page pins its own `path` (`/`, `/terms/`, `/privacy/`) so its rows stay separable from `sloth`'s on the shared instance.

---

*Locale: en-NZ. Part of the [`github.com/bjornbasar`](https://github.com/bjornbasar) projects.*
