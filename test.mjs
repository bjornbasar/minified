// Build assertions — the test gate ci/deploy.sh runs before it builds an image.
//
// A static site has no runtime to unit-test, so what's worth guarding is the shape
// of the OUTPUT: that every page got emitted, that nothing shipped with a dead
// anchor or an unresolved placeholder, that the required meta is present, and that
// the promises the legal pages make about themselves still hold.
//
// Run AFTER build.mjs (`node build.mjs && node test.mjs`). Exits non-zero on the
// first failure summary, so a broken build never reaches the registry.

import { readFileSync, existsSync, statSync } from 'node:fs';
import { site } from './content.mjs';
import { docs } from './legal.mjs';

const SELF = new URL('.', import.meta.url).pathname;
const fails = [];
const checks = { pass: 0 };

function ok(cond, label) {
  if (cond) checks.pass++;
  else fails.push(label);
}

const read = (p) => readFileSync(`${SELF}dist/${p}`, 'utf8');

// --- every artifact exists and is non-trivial ---------------------------------

const PAGES = [
  { file: 'index.html', name: 'home', url: '/' },
  ...docs.map((d) => ({ file: `${d.slug}/index.html`, name: d.slug, url: `/${d.slug}/`, doc: d })),
];
const ASSETS = ['favicon.svg', 'favicon.ico', 'apple-touch-icon.png', 'assets/og.png', 'robots.txt', 'sitemap.xml'];

// robots.txt is legitimately tiny; everything else should be substantial.
const MIN_BYTES = { 'robots.txt': 40 };
for (const a of [...PAGES.map((p) => p.file), ...ASSETS]) {
  const path = `${SELF}dist/${a}`;
  ok(existsSync(path), `missing artifact: dist/${a}`);
  if (existsSync(path)) {
    const min = MIN_BYTES[a] ?? 200;
    ok(statSync(path).size > min, `suspiciously small artifact: dist/${a} (< ${min}B)`);
  }
}

const html = Object.fromEntries(PAGES.filter((p) => existsSync(`${SELF}dist/${p.file}`)).map((p) => [p.name, read(p.file)]));

// --- per-page shell + meta ----------------------------------------------------

for (const p of PAGES) {
  const h = html[p.name];
  if (!h) continue;
  const at = (label) => `${p.name}: ${label}`;

  ok(/<title>[^<]{10,}<\/title>/.test(h), at('missing or too-short <title>'));
  ok(/<meta name="description" content="[^"]{40,}"/.test(h), at('missing or too-short meta description'));
  ok(h.includes(`<link rel="canonical" href="${site.canonical}${p.url.slice(1)}">`), at(`canonical should be ${site.canonical}${p.url.slice(1)}`));
  ok(h.includes('rel="icon"') && h.includes('apple-touch-icon'), at('missing favicon links'));
  ok(/<meta property="og:image" content="https:\/\//.test(h), at('missing absolute og:image'));
  ok(h.includes('lang="en-NZ"'), at('missing en-NZ lang (locale rule)'));

  // Shared shell must actually be shared.
  ok(h.includes('class="brand"') && h.includes('<svg'), at('brand lockup not inlined'));
  ok(h.includes('id="theme"'), at('theme toggle missing'));
  ok(h.includes('<footer>'), at('footer missing'));
  ok(h.includes('href="/terms/"') && h.includes('href="/privacy/"'), at('footer legal links missing'));
  ok(h.includes('traffic.bjornbasar.com/count.js'), at('analytics beacon missing'));
  ok(h.includes('id="main"'), at('no #main target for the skip link'));

  // Nothing half-rendered: no leftover template markers or stringified objects.
  ok(!/\{\{|\}\}|\$\{|undefined|\[object Object\]|NaN/.test(h), at('unresolved placeholder / undefined in output'));
}

// --- internal links and anchors resolve --------------------------------------

// Every href="#…" must match an id="…" on the same page, and every internal
// href="/…" must match a page we actually emit. Dead anchors are the failure mode
// most likely to slip through on a hand-written Contents list.
const emittedPaths = new Set(['/', ...docs.map((d) => `/${d.slug}/`)]);

for (const p of PAGES) {
  const h = html[p.name];
  if (!h) continue;
  const ids = new Set([...h.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]));

  for (const m of h.matchAll(/href="#([^"]+)"/g)) {
    ok(ids.has(m[1]), `${p.name}: dead in-page anchor #${m[1]}`);
  }
  for (const m of h.matchAll(/href="(\/[^"#]*)"/g)) {
    const target = m[1];
    if (target.startsWith('/assets/') || /\.(png|svg|ico|xml|txt)$/.test(target)) continue;
    // "/#services" style links from the legal pages point at home anchors.
    ok(emittedPaths.has(target), `${p.name}: link to unemitted page ${target}`);
  }
  for (const m of h.matchAll(/href="\/#([^"]+)"/g)) {
    ok(new Set([...html.home.matchAll(/\sid="([^"]+)"/g)].map((x) => x[1])).has(m[1]),
      `${p.name}: link to home anchor #${m[1]} that home does not define`);
  }
}

// --- home page: the sections the nav promises + the honesty guardrails --------

if (html.home) {
  for (const id of ['services', 'approach', 'work', 'stack', 'contact']) {
    ok(html.home.includes(`id="${id}"`), `home: missing section #${id}`);
  }
  ok(html.home.includes(site.email), 'home: contact email missing');

  // These are content guardrails, not cosmetics: the page must keep saying who is
  // behind the plural "we", and must keep stating that the work shown is our own.
  ok(/Bjorn Basar/.test(html.home), 'home: the "who is behind it" attribution is gone');
  ok(/bjorn\.basar\.co\.nz/.test(html.home), 'home: link to the personal site is gone');
  ok(/No client work is shown here/i.test(html.home), 'home: the "no client work" disclosure is gone');
}

// --- legal pages: keep the promises they make about themselves ----------------

for (const d of docs) {
  const h = html[d.slug];
  if (!h) continue;
  const at = (label) => `${d.slug}: ${label}`;

  ok(/<h1 id="[^"]+">/.test(h), at('no <h1> — Markdown did not render'));
  ok(h.includes(d.updated), at(`"last updated" date ${d.updated} not on the page`));
  ok(/<h2 id="contents">/.test(h), at('no Contents section'));
  ok((h.match(/<h2 id="/g) || []).length >= 8, at('suspiciously few sections — Markdown truncated?'));
  ok(h.includes('New Zealand'), at('no New Zealand reference — the jurisdiction rewrite regressed'));

  // The Shopify boilerplate this content replaced must never come back. Note the
  // Google Analytics test targets AFFIRMATIVE use only — the privacy policy names
  // GA deliberately, to say it is not used.
  ok(!/shopify/i.test(h), at('Shopify reference is back'));
  ok(!/we (also )?use google analytics/i.test(h), at('affirmative Google Analytics use is back'));
  ok(!/Philippines/i.test(h), at('the Philippines governing-law artefact is back'));
  ok(!/Return Policy|Returns Policy/i.test(h), at('returns-policy reference is back (not trading)'));
}

// The privacy policy is only accurate while these specific claims hold. Each one
// was verified against the running stack; if the stack changes, this fails loudly
// rather than letting the page quietly lie.
if (html.privacy) {
  ok(/14 days/.test(html.privacy), 'privacy: the 14-day log retention claim is gone (verified against Ayula logrotate)');
  ok(/GoatCounter/.test(html.privacy), 'privacy: analytics provider not named');
  ok(/Privacy Act 2020/.test(html.privacy), 'privacy: no Privacy Act 2020 rights section');
  ok(/privacy\.org\.nz/.test(html.privacy), 'privacy: no Privacy Commissioner complaint route');
  ok(/Do Not Track/i.test(html.privacy), 'privacy: the honest Do-Not-Track disclosure is gone');
  ok(/no cookies|sets no cookies/i.test(html.privacy), 'privacy: the cookie statement is gone');
}

if (html.terms) {
  ok(/Consumer Guarantees Act 1993/.test(html.terms), 'terms: non-excludable NZ rights clause is gone');
  ok(/laws of New Zealand|governed by the \*\*laws of New Zealand/.test(html.terms), 'terms: NZ governing law is gone');
  ok(!/\bprice|pricing|payment details\b/i.test(html.terms.replace(/limited to \*\*NZ\$100\*\*|NZ\$100/g, '')),
    'terms: pricing/payment language present, but the studio is not trading');
}

// --- sitemap + robots agree with what we built --------------------------------

if (existsSync(`${SELF}dist/sitemap.xml`)) {
  const sm = read('sitemap.xml');
  for (const u of emittedPaths) {
    ok(sm.includes(`${site.canonical}${u.slice(1)}`), `sitemap: missing ${u}`);
  }
}
if (existsSync(`${SELF}dist/robots.txt`)) {
  ok(read('robots.txt').includes('Sitemap:'), 'robots.txt: no Sitemap line');
}

// --- report -------------------------------------------------------------------

if (fails.length) {
  console.error(`\n✗ ${fails.length} failed check${fails.length === 1 ? '' : 's'} (${checks.pass} passed):\n`);
  for (const f of fails) console.error(`  · ${f}`);
  console.error('');
  process.exit(1);
}
console.log(`✓ all ${checks.pass} build checks passed`);
