# the static tier — Code Tour (seven repos, two shapes)

> A **reading-guide map** covering the **seven** static sites Bosco serves (moved off Hurska 2026-10-23, alongside sleuth's move to Lumra), and a **reference appendix** — outside the eleven-tour sequence. They split cleanly into two shapes, and the split is the tour: **three have a build step and four have none.** The first three are three answers to *"what is a build step actually for?"* The other four answer a question the first three never have to ask: *if there is no build, where does enforcement go?*
>
> **How to use it:** §0 the common shape of the three; §1 minified (Markdown → legal pages); §2 sloth (one source, many domains); §3 family-map (generating a map you can't buy); §4 the four with no build step, and what their deploys assert instead; §5 what the tier shares with the rest of the set; §6 exercises.
>
> The eighth static site is [sleuth](../sleuth/CODE-TOUR.md) — this hub — which has its own tour.

---

## 0. The common shape

The three build-step repos are the same four moving parts, and no framework:

```
content.mjs   ← the words and data, as JS values
render.mjs    ← functions that turn those values into an HTML string
build.mjs     ← writes dist/, copies assets
dist/         ← GENERATED, gitignored — never edit it
ci/deploy.sh  ← nginx:alpine image → local registry → Bosco
```

**Why a build at all, when the output is one HTML file?** Because in each case something is *derived* — a legal page from Markdown, five domain variants from one template, a map projection from raw geodata. Deriving it at build time means the derivation is reviewable in git and the served bytes are dumb. There is no runtime, so there is nothing to exploit and nothing to keep up.

Each ships through [the CI loop](../ci/CODE-TOUR.md), and each is fronted by [Ayula](../ansible/CODE-TOUR.md) with a branded 404. If you've read the `ci` appendix, note that all three are subject to `ci_assert_cache_busted` — the gate that exists because one of these sites shipped a broken stylesheet nobody could see.

---

## 1. minified — Markdown as the source of legal record

[build.mjs](build.mjs) renders three pages: the home page from [content.mjs](content.mjs), and **`/terms/` + `/privacy/` from Markdown files** via [legal.mjs](legal.mjs).

**The decision worth naming:** the legal text lives as **Markdown, not HTML**. Terms and a privacy policy are documents that get *amended* — by you, occasionally, under mild pressure, and often not in a code editor. Keeping them as prose means a change is a prose diff rather than a hunt through `<p>` tags, and the rendering stays consistent because it's applied uniformly at build time.

There's a fleet-wide consequence you've already seen: **that same privacy page is served on six vhosts** from a single file at Ayula, mounted same-domain at `/privacy/` so the link is never cross-domain. One document, one source, many hosts.

[test.mjs](test.mjs) is the site's own check — `node test.mjs`, no framework.

---

## 2. sloth — one content source, several public faces

[sloth](https://github.com/bjornbasar/sloth) is the portfolio, and its build has the most interesting structure of the three: [variants.mjs](https://github.com/bjornbasar/sloth/blob/main/variants.mjs) defines **variants**, and [build.mjs](https://github.com/bjornbasar/sloth/blob/main/build.mjs) renders *every* variant into `dist/<variant>/index.html`.

One content source, two builds, distinct audiences: the **personal** face and the **professional** one. That's why `bjorn.basar.co.nz` and `bjornbasar.com` can serve a byte-identical page while `sloth.minified.work` serves a different presentation of the same underlying material.

**The pattern:** this is the static-site equivalent of a template method — the *content* and the *renderer* are shared, and a variant supplies only what differs. Adding a face is a data edit, not a fork. **Gotcha:** the inverse is also true — an edit to shared content changes every face at once, so "just tweak the wording on the professional one" is a variant change, not a content change.

*(Read the header comment critically: it names two domains — `bjorn-christian.basar.co.nz` and `bio.bjornbasar.com` — that were retired in July. A build script's comments rot exactly like a tour's do.)*

---

## 3. family-map — generating what you can't download

[family-map](https://github.com/bjornbasar/family-map) is the one with real computation in it, and its header comment explains why in a way worth quoting almost directly:

> The map is generated here rather than shipped as a finished SVG, because the page needs a **Pacific-centred** projection, and you cannot reliably re-centre a pre-made world SVG — **its paths tear at the antimeridian**.

So the build starts from **Natural Earth GeoJSON** (public domain) and projects it itself. That's the whole justification for a build step: the artifact you want does not exist as a download, and the naive transformation of a nearby artifact is broken in a specific, visible way.

**The second decision:** [test.mjs](https://github.com/bjornbasar/family-map/blob/main/test.mjs) enforces that **no personal data** is present in the output. A family places-map is exactly the kind of page where a home address could slip in, so the constraint is executable rather than remembered — the same instinct as `ci_assert_cache_busted`, applied to privacy instead of caching.

---

## 4. The other four — no build step, so the deploy carries the weight

[basar-cv](https://github.com/bjornbasar/basar-cv), [diana-cv](https://github.com/bjornbasar/diana-cv), [mrs-peopsquik](https://github.com/bjornbasar/mrs-peopsquik) and
[twobots](https://github.com/bjornbasar/twobots) have **no `content.mjs`, no `render.mjs`, no `build.mjs`, and no
`package.json`**. Each is a hand-authored `index.html` in an nginx image. Reading them after the
first three is worthwhile precisely because the machinery is gone: whatever still has to be
guaranteed has nowhere to live but `ci/deploy.sh`, so these four are the clearest statement in the
estate of *what a deploy is for*.

**The Markdown here is provenance, not input** — the sharp contrast with §1. Each repo carries a
`cv.md` / `profile.md` / `content.md` beside its HTML and **none of it is ever rendered**; it is the
record of where the page came from. The Dockerfile's `COPY` list is an **allowlist** so those files
never enter the image, and the deploy then proves it on the wire:

```
for LEAK in /cv.md /README.md /original/screenshot-2026-08-07.png; do
  [ "$CODE" = "404" ] || ci_die "provenance file $LEAK is being SERVED (HTTP $CODE)"
```

An allowlist is a *claim*; the 404 sweep is the *proof*. The comment says why the proof is a
separate step: "a regression in the Dockerfile's allowlist would otherwise publish them silently."

### Four kinds of assertion the build-step sites never need

**a. Absence, proven on the wire.** No static site serves a phone number (policy, 2026-08-07),
asserted by regex against the deployed page — with the reason attached: *"a CV is exactly the page
where one creeps back in."* mrs-peopsquik gives follower counts the same treatment, because they
were a **deliberate omission** (a static page cannot keep them current), and a deliberate omission
is indistinguishable from an oversight six months later. **You cannot unit-test an omission** —
there is no function to call. Only the response can answer, which is why these live in the deploy
rather than a test file.

**b. Presence of things that fail silently.** mrs-peopsquik asserts one font face returns 200,
because diana-cv shipped with a linked `fonts.css` whose `url()`s were document-relative: every
face 404'd and the page fell back to system fonts, *"invisible unless you look for it."* Same
family as a SMART exporter reporting "unavailable" as healthy — the failure rendered as a page that
looked fine.

**c. A caching mistake that cannot be undone from the server.** `/assets/` is served
`max-age=2592000` while the page itself is `no-cache`, so a stylesheet edit **reaches nobody unless
its URL changes too** — and there is no Cloudflare API token here to purge with. So a pre-deploy
gate asserts the `?v=` token still matches the file's bytes. This is
[lokys](../lokys/CODE-TOUR.md)' service-worker assertion in different clothes, and the shared rule
is worth naming: **an assertion earns its place by irreversibility, not by likelihood.**

**d. Claims about the outside world** — [twobots](https://github.com/bjornbasar/twobots) only, and the most interesting gate
in the estate. The page advertises `composer` commands, so the deploy checks they actually work,
with three decisions worth studying:

- **`require` and `create-project` are checked by one rule**, so there is no special case to
  forget: publish the package and the line passes, don't and the deploy fails.
- **HTTP 200 is not sufficient.** Composer's default `minimum-stability` is `stable`, so a package
  with only `dev-*` versions resolves on Packagist *and still fails to install*. The gate asserts
  at least one non-dev version — the obvious check would have passed while the advertised command
  was broken.
- **A definitive 404 is fatal; a transport failure is a warning.** This is the estate's first gate
  that can fail on a third party's availability, and a Packagist outage must not turn an unrelated
  commit red in `#duskana`. Separating "the claim is false" from "I could not check the claim" is
  the whole design.

twobots also encodes a legal obligation: a signup CTA solicits an email and a password, and under
the Privacy Act 2020 you must say what you collect **at the point of collection** — so a "sign up"
link is only honest once that app has a privacy policy, and the deploy asserts the policy answers
before the invitation ships. Its contrast check pins the orange pip at 3.33:1 as **ornament only,
never a text colour**, naming exactly where that breaks: "adding `<code>` spans."

### Where an assertion belongs is decided by what it is about

twobots' Packagist and contrast gates run **on Ruxa against the built `index.html`**, not through
`ssh $HURSKA curl` like the 404 sweep and the font check. The comment gives the rule: *"A Packagist
lookup has nothing to do with what nginx serves, and a broken install line should fail BEFORE a
multi-arch image is built and pushed."*

So a claim about **content** is a pre-deploy gate and fails cheaply; a claim about **what the server
actually returns** — headers, absent paths, resolving assets — must be a smoke test, because the
origin is the only thing that can answer it. Three of these four carry the same `max-age` trap (basar-cv, alone, has no
cached-asset gate) and one had a real font regression — each caught on the side of the line it
belongs to.

---

## 5. What the static tier shares with the rest of the set

- **Derivation belongs at build time** — the same instinct as karhu's route cache (reflect once, ship a table) and paddington's provisioned dashboards (a file, not a click).
- **Constraints as executable checks** — `test.mjs`'s no-personal-data rule, and the CI cache-buster gate, are both "write the rule down as a failure" rather than "remember the rule".
- **Generated artifacts are gitignored** — `dist/` is never committed. If you find yourself editing `dist/index.html`, you're editing the output of a program.

---

## 6. Active-recall exercises

1. **Each build derives something.** Name the derivation in each of the three, and say what would be lost by hand-maintaining the output instead.
2. **You change a sentence in sloth's shared content.** List every public URL that changes. Now change it for one face only — what do you edit instead?
3. **Why is the privacy page a Markdown file** rather than HTML, given the output is HTML either way? Give the answer in terms of who edits it and when.
4. **The map tears at the antimeridian** if you re-centre a finished SVG. Explain the failure geometrically, then say why generating from GeoJSON avoids it.
5. **`dist/` is gitignored in all three.** What would go wrong if it weren't — think about diffs, merges, and what CI would then be able to skip.
6. **A `cv.md` starts being served.** Two independent things had to go wrong. Name both, say which one the deploy detects, and explain why the detection is a separate step from the mechanism meant to prevent it (§4).
7. **You remove the follower-count assertion** on the grounds that nobody would add one back. Argue the other side using only what the repo tells you, then name the class of requirement that can *only* be enforced at deploy time.
8. **A package the twobots page advertises resolves on Packagist with HTTP 200, and `composer require` still fails.** Explain precisely why, and why the gate needed a second condition to catch it (§4d).
9. **Packagist is down for twenty minutes** while you push an unrelated typo fix. What does the deploy do, and what would the naive implementation have done to `#duskana`?
10. **You edit a stylesheet in mrs-peopsquik and deploy successfully. Nobody sees the change.** Trace the caching path, name the gate that exists to prevent it, and explain why no amount of server-side fixing recovers a visitor who already loaded the old URL.
11. **Sort every assertion in §4 into "pre-deploy gate" or "smoke test"** and state the rule you used. Which one moves if the page begins advertising an npm package instead of a composer one?

---

*Tour covers the static tier @ `a3864a9` — the three build-step repos (minified, plus [sloth](https://github.com/bjornbasar/sloth) and [family-map](https://github.com/bjornbasar/family-map)) and the four without one ([basar-cv](https://github.com/bjornbasar/basar-cv), [diana-cv](https://github.com/bjornbasar/diana-cv), [mrs-peopsquik](https://github.com/bjornbasar/mrs-peopsquik), [twobots](https://github.com/bjornbasar/twobots)). All private except minified and twobots. The eighth static site, [sleuth](../sleuth/CODE-TOUR.md), has its own tour. A reference appendix — the eleven-tour sequence ends at [karu](../karu/CODE-TOUR.md). Ships via [the CI loop](../ci/CODE-TOUR.md); fronted by Ayula.*
