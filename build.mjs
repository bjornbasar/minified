// Render the site to dist/ — the whole build.
//
//   dist/index.html          ← content.mjs        (renderHome)
//   dist/terms/index.html    ← content/terms.md   (renderDoc)
//   dist/privacy/index.html  ← content/privacy.md (renderDoc)
//   dist/{favicon.*,apple-touch-icon.png,assets/og.png,robots.txt,sitemap.xml}
//
// dist/ is a GENERATED artifact (git-ignored). Edit content.mjs, content/*.md,
// legal.mjs, or render.mjs — never dist/.
//
// Directory-per-page (terms/index.html) rather than terms.html so the public URLs
// are /terms/ and /privacy/ with no extension. nginx serves the directory index;
// see nginx.conf for the `absolute_redirect off` that keeps the trailing-slash
// redirect on the right scheme and host behind the reverse proxy.

import { mkdirSync, writeFileSync, copyFileSync, readFileSync } from 'node:fs';
import { marked, Renderer } from 'marked';
import { site } from './content.mjs';
import { docs } from './legal.mjs';
import { renderHome, renderDoc, setBrandSvg } from './render.mjs';

const SELF = new URL('.', import.meta.url).pathname;
const read = (p) => readFileSync(`${SELF}${p}`, 'utf8');
const out = (p, s) => writeFileSync(`${SELF}dist/${p}`, s);

// --- Markdown → HTML ----------------------------------------------------------

// GitHub-compatible heading slugs: lowercase, drop punctuation, spaces → hyphens.
// The in-document "Contents" lists in the legal Markdown are written against this
// exact scheme, and test.mjs asserts every in-page href resolves to an emitted id —
// so a divergence here fails the build rather than shipping dead anchors.
function slug(raw) {
  return raw
    .toLowerCase()
    .replace(/<[^>]*>/g, '')      // strip inline HTML
    .replace(/[*_`]/g, '')        // strip Markdown emphasis markers
    .trim()
    .replace(/[^\w\s-]/g, '')     // drop remaining punctuation
    .replace(/\s+/g, '-');
}

function mdRenderer() {
  const r = new Renderer();
  const seen = new Map();

  // Headings carry stable ids so the Contents lists and deep links work.
  r.heading = (text, level, raw) => {
    let id = slug(raw ?? text);
    // Dedupe the way GitHub does (`foo`, `foo-1`), in case two headings collide.
    if (seen.has(id)) {
      const n = seen.get(id) + 1;
      seen.set(id, n);
      id = `${id}-${n}`;
    } else {
      seen.set(id, 0);
    }
    return `<h${level} id="${id}">${text}</h${level}>\n`;
  };

  // Off-site links open in a new tab and drop the referrer window handle.
  // In-page (#…) and same-site (/…) links stay in place.
  r.link = (href, title, text) => {
    const t = title ? ` title="${title}"` : '';
    const external = /^https?:\/\//i.test(href) && !href.includes(site.domain);
    const rel = external ? ' target="_blank" rel="noopener"' : '';
    return `<a href="${href}"${t}${rel}>${text}</a>`;
  };

  // Wrap tables so a wide table scrolls in its own box — the page body must never
  // scroll horizontally on a phone.
  r.table = (header, body) =>
    `<div class="tablewrap"><table>\n<thead>\n${header}</thead>\n<tbody>${body}</tbody>\n</table></div>\n`;

  return r;
}

const toHtml = (md) => marked.parse(md, { gfm: true, renderer: mdRenderer() });

// --- build --------------------------------------------------------------------

mkdirSync(`${SELF}dist/assets`, { recursive: true });

// The brand lockup is inlined into the header of every page (one fewer request,
// and its wordmark can then follow the palette via CSS).
setBrandSvg(read('assets/brand/lockup.svg'));

out('index.html', renderHome());
console.log('built dist/index.html');

for (const doc of docs) {
  mkdirSync(`${SELF}dist/${doc.slug}`, { recursive: true });
  const html = renderDoc(doc, toHtml(read(doc.source)));
  out(`${doc.slug}/index.html`, html);
  console.log(`built dist/${doc.slug}/index.html — from ${doc.source}`);
}

// Static assets. Favicons sit at the root because that is where browsers and
// crawlers look for them unprompted.
for (const f of ['favicon.svg', 'favicon.ico', 'apple-touch-icon.png']) {
  copyFileSync(`${SELF}assets/${f}`, `${SELF}dist/${f}`);
}
copyFileSync(`${SELF}assets/og.png`, `${SELF}dist/assets/og.png`);

// robots + sitemap: this is a public business site, so it should be indexable and
// say so explicitly rather than leave crawlers guessing.
const pages = ['', ...docs.map((d) => `${d.slug}/`)];
out('robots.txt', `User-agent: *
Allow: /

Sitemap: ${site.canonical}sitemap.xml
`);
out('sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages.map((p) => `  <url><loc>${site.canonical}${p}</loc></url>`).join('\n')}
</urlset>
`);
console.log(`built dist/robots.txt + dist/sitemap.xml (${pages.length} urls) + favicons + og.png`);
