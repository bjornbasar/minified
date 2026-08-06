// renderHome() / renderDoc() → full HTML strings.
//
// One shell serves both page kinds: the palette :root blocks are generated from the
// token maps below, the layout CSS is shared, and each page kind adds its own block
// (HOME_CSS / DOC_CSS). Structure follows the sibling `sloth` repo's proven pattern
// (sloth/render.mjs) — same CSS vocabulary, different palette and information
// architecture — so the two sites read as relatives without sharing a build.

import { site, nav, hero, services, approach, work, stack, contact, footer } from './content.mjs';

// --- brand: minified.work = Selesnya (G/W) per the domain→MTG palette mapping. ---
// Accent pairing is the one already proven in Ayula's branded zone-404 page
// (light #0F766E / dark #14b8a6) over the shared warm brand neutrals. `muted` is
// deliberately darker than the brand's #8A7168 so small text clears WCAG AA on cream.
const PALETTE = {
  light: {
    bg: '#FDF4EE', surface: '#FFFFFF', 'surface-2': '#F5EBE3',
    border: '#E0D8CE', 'border-strong': '#CFC4B7',
    text: '#2A1D17', muted: '#6E5A52',
    accent: '#0F766E', 'accent-soft': '#0F766E14', 'accent-line': '#0F766E33',
    // Text drawn ON the accent (the primary button). Must be contrast-checked per
    // theme: white clears AA on the darker light-mode teal, but would fail on the
    // brighter dark-mode teal — which takes near-black instead.
    'on-accent': '#FFFFFF',
    shadow: '0 1px 2px rgba(42,29,23,.05), 0 10px 30px rgba(42,29,23,.07)',
    grad: 'linear-gradient(155deg,#0D9488,#5FBFA9 55%,#F2E6DA)',
  },
  dark: {
    bg: '#0E1514', surface: '#16201F', 'surface-2': '#1D2A28',
    border: '#2A3937', 'border-strong': '#3C4E4B',
    text: '#E9E4DE', muted: '#9DAAA7',
    accent: '#14B8A6', 'accent-soft': '#14B8A61c', 'accent-line': '#14B8A63a',
    'on-accent': '#0E1514',
    shadow: '0 1px 2px rgba(0,0,0,.4), 0 12px 34px rgba(0,0,0,.45)',
    grad: 'linear-gradient(155deg,#14B8A6,#0D9488 55%,#5FBFA9)',
  },
};

const FONTS = {
  serif: '"Iowan Old Style", "Palatino Linotype", Palatino, "Book Antiqua", Georgia, serif',
  sans: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
  mono: 'ui-monospace, "JetBrains Mono", "SFMono-Regular", "SF Mono", Menlo, Consolas, monospace',
};

const toks = (m) => Object.entries(m).map(([k, v]) => `--${k}:${v};`).join(' ');

// Media query is the default signal; the [data-theme] blocks let the header toggle
// win in BOTH directions (a viewer on a dark OS can force light, and vice versa).
function paletteCss() {
  const fonts = `--serif:${FONTS.serif}; --sans:${FONTS.sans}; --mono:${FONTS.mono};`;
  return `  :root { ${toks(PALETTE.light)} ${fonts} }
  @media (prefers-color-scheme: dark) { :root { ${toks(PALETTE.dark)} } }
  :root[data-theme="light"] { ${toks(PALETTE.light)} }
  :root[data-theme="dark"] { ${toks(PALETTE.dark)} }`;
}

// --- shared shell CSS: header, footer, page frame, section headings ---
const SHELL_CSS = `
  * { box-sizing: border-box; }
  html { scroll-behavior: smooth; }
  @media (prefers-reduced-motion: reduce) { html { scroll-behavior: auto; } * { transition: none !important; animation: none !important; } }
  body { margin: 0; background: var(--bg); color: var(--text); font-family: var(--sans); font-size: 17px; line-height: 1.6; -webkit-font-smoothing: antialiased; }
  .wrap { max-width: 980px; margin: 0 auto; padding: 0 clamp(1.2rem, 5vw, 2.5rem); }
  a { color: var(--accent); text-underline-offset: 3px; }
  .skip { position: absolute; left: -9999px; }
  .skip:focus { left: 1rem; top: .6rem; z-index: 50; background: var(--surface); border: 1px solid var(--accent); border-radius: 8px; padding: .5rem .8rem; }
  header.top { position: sticky; top: 0; z-index: 20; backdrop-filter: blur(8px); background: color-mix(in srgb, var(--bg) 86%, transparent); border-bottom: 1px solid var(--border); }
  .top .wrap { display: flex; align-items: center; gap: 1rem; justify-content: space-between; height: 72px; }
  /* Brand lockup: one vendored SVG, themed by CSS. The .lm-* classes override the
     SVG's own presentation-attribute fills (CSS wins), so the wordmark follows the
     palette while the teal mark tile stays brand-fixed in both themes. */
  .brand { display: flex; align-items: center; text-decoration: none; }
  .brand svg { height: 34px; width: auto; display: block; }
  .brand .lm-word { fill: var(--text); }
  .brand .lm-tld { fill: var(--accent); }
  .navwrap { display: flex; align-items: center; gap: 1.3rem; }
  .topnav { display: flex; gap: 1.3rem; }
  .topnav a { font-family: var(--mono); font-size: .74rem; letter-spacing: .06em; text-transform: uppercase; color: var(--muted); text-decoration: none; }
  .topnav a:hover { color: var(--accent); }
  @media (max-width: 720px) { .topnav { display: none; } }
  .themetoggle { background: none; border: 1px solid var(--border); border-radius: 8px; color: var(--muted); cursor: pointer; font: inherit; font-size: .95rem; line-height: 1; padding: .45rem .55rem; }
  .themetoggle:hover { color: var(--accent); border-color: var(--accent-line); }
  section { padding: clamp(2.5rem, 6vw, 4rem) 0; border-top: 1px solid var(--border); }
  .sec-head { font-family: var(--mono); font-size: .74rem; letter-spacing: .2em; text-transform: uppercase; color: var(--muted); margin: 0 0 1.2rem; display: flex; align-items: center; gap: .8rem; }
  .sec-head::after { content: ""; flex: 1; height: 1px; background: var(--border); }
  h2 { font-family: var(--serif); font-weight: 600; font-size: clamp(1.6rem, 4vw, 2.1rem); letter-spacing: -.01em; margin: 0 0 1rem; text-wrap: balance; }
  .lead { max-width: 62ch; color: var(--muted); font-size: 1.05rem; margin: 0 0 2rem; }
  .lead b { color: var(--text); font-weight: 600; }
  footer { border-top: 1px solid var(--border); padding: 2.2rem 0 3rem; font-family: var(--mono); font-size: .76rem; color: var(--muted); }
  footer .frow { display: flex; flex-wrap: wrap; gap: .7rem 1.4rem; align-items: baseline; justify-content: space-between; }
  footer a { color: var(--muted); text-decoration: none; border-bottom: 1px solid var(--border); }
  footer a:hover { color: var(--accent); border-color: var(--accent-line); }
  footer .flinks { display: flex; flex-wrap: wrap; gap: 1.1rem; }
  a:focus-visible, button:focus-visible { outline: 2px solid var(--accent); outline-offset: 3px; border-radius: 4px; }`;

// --- home-page CSS: hero, service/work cards, principles, stack tags, contact ---
const HOME_CSS = `
  .hero { padding: clamp(3.2rem, 9vw, 6rem) 0 clamp(2rem, 5vw, 3rem); border-top: 0; }
  .eyebrow { font-family: var(--mono); font-size: .74rem; letter-spacing: .22em; text-transform: uppercase; color: var(--accent); margin: 0 0 1.2rem; }
  .hero h1 { font-family: var(--serif); font-weight: 600; font-size: clamp(2.5rem, 6.6vw, 4.3rem); line-height: 1.04; letter-spacing: -.02em; margin: 0 0 1.3rem; text-wrap: balance; max-width: 22ch; }
  .hero .tag { font-size: clamp(1.1rem, 2.4vw, 1.4rem); line-height: 1.45; max-width: 46ch; margin: 0 0 2.2rem; }
  .hero .tag b { color: var(--accent); font-weight: 600; }
  .cta { display: flex; flex-wrap: wrap; gap: .8rem; }
  .cta a { font-family: var(--mono); font-size: .84rem; text-decoration: none; border-radius: 8px; padding: .7rem 1.1rem; border: 1px solid var(--border-strong); color: var(--text); transition: border-color .15s, color .15s, background .15s; }
  .cta a.primary { background: var(--accent); border-color: var(--accent); color: var(--on-accent); }
  .cta a:hover { border-color: var(--accent); color: var(--accent); }
  .cta a.primary:hover { color: var(--on-accent); filter: brightness(1.08); }
  /* The "who's behind it" band — names the person behind the plural voice. */
  .behind { border-top: 1px solid var(--border); padding: clamp(1.6rem, 4vw, 2.2rem) 0; }
  .behind p { margin: 0; max-width: 74ch; color: var(--muted); font-size: 1rem; }
  .behind b { color: var(--text); font-weight: 600; }
  .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 1rem; }
  /* Services are a fixed 2×2 above the breakpoint: with four items, auto-fill gives
     three across and leaves the fourth stranded on its own row. */
  @media (min-width: 760px) { .grid.two { grid-template-columns: repeat(2, 1fr); } }
  .svc { background: var(--surface); border: 1px solid var(--border); border-radius: 12px; padding: 1.3rem 1.35rem; display: flex; flex-direction: column; transition: border-color .16s, transform .16s, box-shadow .16s; }
  .svc:hover { border-color: var(--accent-line); transform: translateY(-2px); box-shadow: var(--shadow); }
  .svc .num { font-family: var(--mono); font-size: .68rem; letter-spacing: .12em; color: var(--accent); margin-bottom: .55rem; }
  .svc h3 { font-family: var(--serif); font-weight: 600; font-size: 1.24rem; margin: 0 0 .55rem; }
  .svc p { font-size: .95rem; line-height: 1.55; margin: 0 0 1rem; flex: 1; }
  .svc .tech { font-family: var(--mono); font-size: .68rem; line-height: 1.5; color: var(--muted); padding-top: .8rem; border-top: 1px dashed var(--border); }
  .principles { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 1.7rem; counter-reset: p; }
  .principles li { counter-increment: p; padding-left: 3rem; position: relative; max-width: 70ch; }
  .principles li::before { content: counter(p, decimal-leading-zero); position: absolute; left: 0; top: .1rem; font-family: var(--mono); font-size: .78rem; color: var(--accent); border: 1px solid var(--accent-line); border-radius: 6px; padding: .15rem .4rem; }
  .principles h3 { font-family: var(--serif); font-weight: 600; font-size: 1.2rem; margin: 0 0 .35rem; }
  .principles p { margin: 0; color: var(--muted); font-size: .98rem; }
  .principles p b { color: var(--text); font-weight: 600; }
  .work-note { color: var(--muted); font-size: .98rem; max-width: 70ch; margin: 0 0 2.4rem; padding: 1rem 1.1rem; background: var(--surface-2); border: 1px solid var(--border); border-radius: 10px; }
  .work-note b { color: var(--text); font-weight: 600; }
  .group { margin-bottom: 2.6rem; }
  .group > h3 { font-family: var(--serif); font-weight: 600; font-size: 1.35rem; margin: 0 0 .4rem; }
  .group > .blurb { color: var(--muted); font-size: .96rem; margin: 0 0 1.2rem; max-width: 68ch; }
  .card { background: var(--surface); border: 1px solid var(--border); border-radius: 12px; padding: 1.15rem 1.2rem; display: flex; flex-direction: column; transition: border-color .16s, transform .16s, box-shadow .16s; }
  .card:hover { border-color: var(--accent-line); transform: translateY(-2px); box-shadow: var(--shadow); }
  .card .cn { display: flex; align-items: baseline; justify-content: space-between; gap: .5rem; margin-bottom: .5rem; }
  .card h4 { font-family: var(--serif); font-weight: 600; font-size: 1.18rem; margin: 0; }
  .card .flag { font-family: var(--mono); font-size: .6rem; letter-spacing: .1em; text-transform: uppercase; color: var(--muted); border: 1px solid var(--border); border-radius: 4px; padding: .1rem .35rem; white-space: nowrap; }
  .card p { font-size: .92rem; line-height: 1.55; margin: 0 0 .9rem; flex: 1; }
  .card .tech { font-family: var(--mono); font-size: .68rem; color: var(--muted); margin-bottom: .7rem; }
  .card .links { display: flex; gap: 1rem; font-family: var(--mono); font-size: .74rem; }
  .card .links a { text-decoration: none; }
  .card .links a:hover { text-decoration: underline; }
  .card.flagship { position: relative; overflow: hidden; grid-column: 1 / -1; background: var(--accent-soft); border-color: var(--accent-line); }
  .card.flagship::before { content: ""; position: absolute; top: 0; left: 0; right: 0; height: 3px; background: var(--grad); }
  .card.flagship h4 { font-size: 1.5rem; }
  .card.flagship p { font-size: 1rem; max-width: 72ch; }
  .tags { display: flex; flex-wrap: wrap; gap: .5rem; }
  .tags span { font-family: var(--mono); font-size: .74rem; background: var(--surface); border: 1px solid var(--border); border-radius: 999px; padding: .3rem .7rem; }
  .tags span b { color: var(--accent); font-weight: 600; }
  .contact .lead { margin-bottom: 1rem; }
  .caveat { max-width: 62ch; font-size: .95rem; color: var(--muted); padding-left: 1rem; border-left: 2px solid var(--accent-line); margin: 0 0 1.6rem; }
  .contact-links { display: flex; flex-wrap: wrap; gap: .8rem; }
  .contact-links a { font-family: var(--mono); font-size: .84rem; text-decoration: none; border: 1px solid var(--border-strong); border-radius: 8px; padding: .6rem .95rem; color: var(--text); transition: border-color .15s, color .15s; }
  .contact-links a:hover { border-color: var(--accent); color: var(--accent); }`;

// --- legal-page CSS: long-form prose rendered from Markdown ---
const DOC_CSS = `
  .doc { padding: clamp(2.2rem, 6vw, 3.4rem) 0 1rem; }
  .doc-back { font-family: var(--mono); font-size: .74rem; letter-spacing: .06em; text-transform: uppercase; color: var(--muted); text-decoration: none; }
  .doc-back:hover { color: var(--accent); }
  .doc-body { max-width: 74ch; padding-bottom: 3rem; }
  .doc-body h1 { font-family: var(--serif); font-weight: 600; font-size: clamp(2.1rem, 5vw, 3rem); line-height: 1.1; letter-spacing: -.02em; margin: 1.4rem 0 .8rem; text-wrap: balance; }
  .doc-body h2 { font-family: var(--serif); font-weight: 600; font-size: 1.45rem; margin: 2.6rem 0 .8rem; scroll-margin-top: 90px; }
  .doc-body h3 { font-family: var(--serif); font-weight: 600; font-size: 1.15rem; margin: 1.8rem 0 .5rem; scroll-margin-top: 90px; }
  .doc-body p { margin: 0 0 1.1rem; }
  .doc-body ul, .doc-body ol { margin: 0 0 1.2rem; padding-left: 1.4rem; }
  .doc-body li { margin: 0 0 .5rem; }
  .doc-body li::marker { color: var(--muted); }
  .doc-body strong { font-weight: 600; }
  .doc-body hr { border: 0; border-top: 1px solid var(--border); margin: 2.4rem 0; }
  .doc-body a { text-underline-offset: 3px; }
  .doc-body code { font-family: var(--mono); font-size: .88em; background: var(--surface-2); border: 1px solid var(--border); border-radius: 4px; padding: .08em .35em; }
  /* Tables scroll inside their own box so the page body never scrolls sideways. */
  .doc-body .tablewrap { overflow-x: auto; margin: 0 0 1.4rem; }
  .doc-body table { border-collapse: collapse; width: 100%; font-size: .95rem; }
  .doc-body th, .doc-body td { text-align: left; vertical-align: top; padding: .6rem .8rem; border: 1px solid var(--border); }
  .doc-body th { background: var(--surface-2); font-weight: 600; }
  /* The intro block: the "Effective / Last updated" line straight after the h1. */
  .doc-body h1 + p { color: var(--muted); font-family: var(--mono); font-size: .8rem; letter-spacing: .04em; }
  /* The in-page "Contents" list — compact, so it reads as navigation not prose. */
  .doc-body h2#contents + ol { font-size: .95rem; }
  .doc-body h2#contents + ol li { margin-bottom: .3rem; }
  .doc-note { max-width: 74ch; margin: 0 0 3rem; padding: .9rem 1.1rem; background: var(--surface-2); border: 1px solid var(--border); border-left: 2px solid var(--accent-line); border-radius: 10px; font-size: .93rem; color: var(--muted); }`;

// --- head/meta + shell ---------------------------------------------------------

// Self-hosted GoatCounter (cookieless). `path` is pinned per page so the two legal
// pages are separable in the dashboard from sloth's rows on the same instance.
const beacon = (path) => `
<!-- Analytics: self-hosted GoatCounter (privacy-friendly, cookieless). See /privacy/. -->
<script data-goatcounter="${site.analytics}" data-goatcounter-settings='{"path":"${path}"}' data-cfasync="false" async src="//otso.minified.work/count.js"></script>`;

// Theme toggle: flips the [data-theme] attribute the palette blocks key off and
// remembers the choice. Set before paint in <head> to avoid a flash of the wrong
// theme; the button only swaps the attribute.
const THEME_INIT = `<script>try{var t=localStorage.getItem('mw-theme');if(t)document.documentElement.dataset.theme=t;}catch(e){}</script>`;
const THEME_JS = `
  (function () {
    var btn = document.getElementById('theme');
    if (!btn) return;
    var root = document.documentElement;
    var dark = function () {
      return root.dataset.theme
        ? root.dataset.theme === 'dark'
        : window.matchMedia('(prefers-color-scheme: dark)').matches;
    };
    var paint = function () { btn.textContent = dark() ? '☀' : '☾'; btn.setAttribute('aria-label', dark() ? 'Switch to light theme' : 'Switch to dark theme'); };
    paint();
    btn.addEventListener('click', function () {
      var next = dark() ? 'light' : 'dark';
      root.dataset.theme = next;
      try { localStorage.setItem('mw-theme', next); } catch (e) {}
      paint();
    });
  })();`;

function head({ title, description, canonical, pageCss, ogImage = '/assets/og.png' }) {
  return `<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${title}</title>
<meta name="description" content="${description}">
<link rel="canonical" href="${canonical}">
<meta property="og:type" content="website">
<meta property="og:site_name" content="${site.name}">
<meta property="og:title" content="${title}">
<meta property="og:description" content="${description}">
<meta property="og:url" content="${canonical}">
<meta property="og:image" content="https://${site.domain}${ogImage}">
<meta name="twitter:card" content="summary_large_image">
<link rel="icon" href="/favicon.ico" sizes="any">
<link rel="icon" type="image/svg+xml" href="/favicon.svg">
<link rel="apple-touch-icon" href="/apple-touch-icon.png">
<meta name="theme-color" content="#0D9488">
${THEME_INIT}
<style>
${paletteCss()}
${SHELL_CSS}
${pageCss}
</style>`;
}

// `prefix` makes the nav work from both / and /terms/ — the home anchors need a
// leading "/" once the page isn't the home page.
function header(prefix) {
  const links = nav.map((n) => `<a href="${prefix}${n.href}">${n.label}</a>`).join('\n        ');
  return `<header class="top">
    <div class="wrap">
      <a class="brand" href="${prefix || '#top'}" aria-label="${site.name} — home">${BRAND_SVG}</a>
      <div class="navwrap">
        <nav class="topnav">
        ${links}
        </nav>
        <button class="themetoggle" id="theme" type="button" aria-label="Switch theme">☾</button>
      </div>
    </div>
  </header>`;
}

function footerHtml() {
  const links = footer.links
    .map((l) => `<a href="${l.href}"${l.external ? ' target="_blank" rel="noopener"' : ''}>${l.label}</a>`)
    .join('\n          ');
  return `<footer>
    <div class="wrap frow">
      <span>© <span id="yr">2026</span> ${site.name} · ${footer.tagline}</span>
      <span class="flinks">
          ${links}
      </span>
    </div>
  </footer>`;
}

function page({ title, description, canonical, pageCss, gcPath, main }) {
  const prefix = canonical === site.canonical ? '' : '/';
  return `<!doctype html>
<html lang="en-NZ">
<head>
${head({ title, description, canonical, pageCss })}
</head>
<body>
<a class="skip" href="#main">Skip to content</a>
${header(prefix)}
${main}
${footerHtml()}
<script>
  try { document.getElementById('yr').textContent = new Date().getFullYear(); } catch (e) {}
${THEME_JS}
</script>${beacon(gcPath)}
</body>
</html>`;
}

// The vendored lockup, inlined so it themes with CSS and costs no extra request.
// build.mjs injects it (it reads assets/brand/lockup.svg) — see setBrandSvg().
let BRAND_SVG = '';
export function setBrandSvg(svg) { BRAND_SVG = svg.trim(); }

// --- home ---------------------------------------------------------------------

const svcCard = (s, i) => `        <div class="svc">
          <div class="num">${String(i + 1).padStart(2, '0')}</div>
          <h3>${s.name}</h3>
          <p>${s.blurb}</p>
          <div class="tech">${s.stack}</div>
        </div>`;

const principle = (p) => `      <li>
        <h3>${p.name}</h3>
        <p>${p.blurb}</p>
      </li>`;

const workCard = (p) => {
  const links = p.links?.length
    ? `\n          <div class="links">${p.links.map((l) => `<a href="${l.href}" target="_blank" rel="noopener">${l.label}</a>`).join('')}</div>`
    : '';
  return `        <div class="card${p.flagship ? ' flagship' : ''}">
          <div class="cn"><h4>${p.name}</h4><span class="flag">${p.flag}</span></div>
          <p>${p.blurb}</p>
          <div class="tech">${p.stack}</div>${links}
        </div>`;
};

const workGroup = (g) => `    <div class="group">
      <h3>${g.heading}</h3>
      <p class="blurb">${g.blurb}</p>
      <div class="grid">
${g.projects.map(workCard).join('\n')}
      </div>
    </div>`;

export function renderHome() {
  const main = `<main class="wrap" id="main">

  <section class="hero" id="top">
    <p class="eyebrow">${hero.eyebrow}</p>
    <h1>${hero.h1}</h1>
    <p class="tag">${hero.tag}</p>
    <div class="cta">
      <a class="primary" href="${hero.ctaPrimary.href}">${hero.ctaPrimary.label}</a>
      <a href="${hero.ctaSecondary.href}">${hero.ctaSecondary.label}</a>
    </div>
  </section>

  <div class="behind">
    <p>${site.behind.html}</p>
  </div>

  <section id="services">
    <p class="sec-head">${services.head}</p>
    <p class="lead">${services.lead}</p>
    <div class="grid two">
${services.items.map(svcCard).join('\n')}
    </div>
  </section>

  <section id="approach">
    <p class="sec-head">${approach.head}</p>
    <p class="lead">${approach.lead}</p>
    <ol class="principles">
${approach.items.map(principle).join('\n')}
    </ol>
  </section>

  <section id="work">
    <p class="sec-head">${work.head}</p>
    <p class="work-note">${work.note}</p>
${work.groups.map(workGroup).join('\n\n')}
  </section>

  <section id="stack">
    <p class="sec-head">${stack.head}</p>
    <p class="lead">${stack.lead}</p>
    <div class="tags">${stack.tags.map((s) => `<span>${s.emph ? `<b>${s.t}</b>` : s.t}</span>`).join('')}</div>
  </section>

  <section id="contact" class="contact">
    <p class="sec-head">${contact.head}</p>
    <h2>${contact.h2}</h2>
    <p class="lead">${contact.lead}</p>
    <p class="caveat">${contact.caveat}</p>
    <div class="contact-links">
      <a href="mailto:${site.email}">✉ ${site.email}</a>
      <a href="${site.github}" target="_blank" rel="noopener">↗ github.com/bjornbasar</a>
    </div>
  </section>
</main>`;

  return page({
    title: site.title,
    description: site.description,
    canonical: site.canonical,
    pageCss: HOME_CSS,
    gcPath: '/',
    main,
  });
}

// --- legal pages --------------------------------------------------------------

export function renderDoc(doc, bodyHtml) {
  const main = `<main class="wrap" id="main">
  <div class="doc">
    <a class="doc-back" href="/">← ${site.name}</a>
  </div>
  <article class="doc-body">
${bodyHtml}
  </article>
  <p class="doc-note">This document is maintained as Markdown in the site's public repository, so the published wording and its source are always the same text. Last updated ${doc.updated}.</p>
</main>`;

  return page({
    title: doc.title,
    description: doc.description,
    canonical: `${site.canonical}${doc.slug}/`,
    pageCss: DOC_CSS,
    gcPath: `/${doc.slug}/`,
    main,
  });
}
