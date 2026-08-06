// The legal pages. Each entry pairs a Markdown source in content/ with the page
// metadata; build.mjs renders them through renderDoc() in render.mjs.
//
// The Markdown files are the SOURCE OF TRUTH for the wording — edit those, never
// the generated HTML. They are deliberately readable as plain Markdown too (they
// render fine on GitHub), so the published terms and the repo never diverge.
//
// `updated` is shown in the page header and asserted by test.mjs; keep it in step
// with the "Last updated" line inside the Markdown itself when the wording changes.

export const docs = [
  {
    slug: 'terms',
    source: 'content/terms.md',
    title: 'Terms of Use — Minified.Work',
    description:
      'The terms governing use of www.minified.work: what the site is, permitted use, intellectual property, liability, and New Zealand governing law.',
    updated: '6 August 2026',
  },
  {
    slug: 'privacy',
    source: 'content/privacy.md',
    title: 'Privacy Policy — Minified.Work',
    description:
      'What www.minified.work collects and why: server logs, cookieless self-hosted analytics, no accounts or payments, and your access and correction rights under the New Zealand Privacy Act 2020.',
    updated: '6 August 2026',
  },
];
