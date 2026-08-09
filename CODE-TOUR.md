# the static tier — Code Tour (minified · sloth · family-map)

> A **reading-guide map** covering **three** repos that look alike and aren't, and a **reference appendix** — outside the ten-tour sequence. Each is "a static site built by a small Node script", and each solves a different problem with that shape. Read them as three answers to *"what is a build step actually for?"*
>
> **How to use it:** §0 the common shape; §1 minified (Markdown → legal pages); §2 sloth (one source, many domains); §3 family-map (generating a map you can't buy); §4 what they share with the rest of the set; §5 exercises.

---

## 0. The common shape

All three are the same four moving parts, and no framework:

```
content.mjs   ← the words and data, as JS values
render.mjs    ← functions that turn those values into an HTML string
build.mjs     ← writes dist/, copies assets
dist/         ← GENERATED, gitignored — never edit it
ci/deploy.sh  ← nginx:alpine image → local registry → Hurska
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

## 4. What the static tier shares with the rest of the set

- **Derivation belongs at build time** — the same instinct as karhu's route cache (reflect once, ship a table) and paddington's provisioned dashboards (a file, not a click).
- **Constraints as executable checks** — `test.mjs`'s no-personal-data rule, and the CI cache-buster gate, are both "write the rule down as a failure" rather than "remember the rule".
- **Generated artifacts are gitignored** — `dist/` is never committed. If you find yourself editing `dist/index.html`, you're editing the output of a program.

---

## 5. Active-recall exercises

1. **Each build derives something.** Name the derivation in each of the three, and say what would be lost by hand-maintaining the output instead.
2. **You change a sentence in sloth's shared content.** List every public URL that changes. Now change it for one face only — what do you edit instead?
3. **Why is the privacy page a Markdown file** rather than HTML, given the output is HTML either way? Give the answer in terms of who edits it and when.
4. **The map tears at the antimeridian** if you re-centre a finished SVG. Explain the failure geometrically, then say why generating from GeoJSON avoids it.
5. **`dist/` is gitignored in all three.** What would go wrong if it weren't — think about diffs, merges, and what CI would then be able to skip.

---

*Tour covers the static tier @ `a3864a9` (minified, plus [sloth](https://github.com/bjornbasar/sloth) and [family-map](https://github.com/bjornbasar/family-map), which are private). A reference appendix — the ten-tour sequence ends at [koda-blast](../koda-blast/CODE-TOUR.md). Ships via [the CI loop](../ci/CODE-TOUR.md); fronted by Ayula.*
