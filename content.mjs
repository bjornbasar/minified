// Source of truth for the Minified.Work studio site (www.minified.work).
// render.mjs turns this into dist/index.html; the legal pages come from
// content/*.md via legal.mjs. Nothing here is hand-edited in dist/.
//
// VOICE: "we" — the studio. Minified.Work is a *brand*, not a registered
// company, and it is a one-person studio. `site.behind` says so explicitly on
// the page, so the plural voice never reads as a claim of a team.
//
// HONESTY RULES for anything added here (they are the reason this file has a
// comment block instead of just data):
//   - No clients, testimonials, logos, awards, headcount, or years-in-business.
//   - Every project shown is our own; `work.note` states that on the page.
//   - Not trading yet → no pricing, rates, SLAs, or availability promises.

export const site = {
  name: 'Minified.Work',
  domain: 'www.minified.work',
  canonical: 'https://www.minified.work/',
  email: 'bjorn@minified.work',
  github: 'https://github.com/bjornbasar',
  location: 'Aotearoa New Zealand',
  analytics: 'https://otso.minified.work/count',
  title: 'Minified.Work — software studio',
  description:
    'Minified.Work is an independent software studio in Aotearoa New Zealand. We build full-stack products, the platforms they run on, and the frameworks underneath — small enough to understand, owned outright.',
  // Named, linked, and unambiguous — the "we" is one engineer.
  behind: {
    html: 'Minified.Work is the studio name of <b>Bjorn Basar</b>, a full-stack engineer with two decades in software — fifteen years of PHP, the rest Node.js and TypeScript. It is a one-person studio, so the person you talk to is the person who builds it. <a href="https://bjorn.basar.co.nz/">More about Bjorn →</a>',
  },
};

export const nav = [
  { href: '#services', label: 'Services' },
  { href: '#approach', label: 'Approach' },
  { href: '#work', label: 'Work' },
  { href: '#contact', label: 'Contact' },
];

export const hero = {
  eyebrow: 'Software studio · Aotearoa New Zealand',
  h1: 'Software small enough to understand, and yours to own.',
  tag: 'We build full-stack products, the platforms they run on, and the frameworks underneath — end to end, with <b>few dependencies</b> and every layer documented. Not a prototype you have to rebuild.',
  ctaPrimary: { href: '#contact', label: 'Start a conversation' },
  ctaSecondary: { href: '#work', label: 'See what we\'ve built' },
};

// ---- Services: capability, described honestly. No pricing (not trading). ----
export const services = {
  head: 'What we do',
  lead: 'Four kinds of work, all of it the same discipline applied at a different layer.',
  items: [
    {
      name: 'Full-stack product build',
      blurb:
        'An idea to working software in production — not a demo that needs rewriting. Next.js and React on the front, PHP or Node.js behind it, PostgreSQL underneath, deployed on a pipeline with tests and monitoring from the first commit.',
      stack: 'Next.js · React · TypeScript · PHP 8.4 · Node.js · PostgreSQL · Prisma',
    },
    {
      name: 'Platform &amp; DevOps',
      blurb:
        'The layer that decides whether shipping is routine or an event. Config-as-code provisioning, container builds, CI/CD that tests before it deploys, metrics and log aggregation with alerting that means something, TLS and reverse proxying, secrets encrypted at rest.',
      stack: 'Docker · Ansible · CI/CD · Prometheus / Grafana / Loki · nginx · SOPS + age',
    },
    {
      name: 'Frameworks &amp; legacy rescue',
      blurb:
        'For a codebase nobody left behind can explain. We cut the dependency surface, make the architecture legible, get tests around the parts that matter, and write down the decisions — so the next person inherits a system instead of a mystery.',
      stack: 'PHP · architecture review · dependency reduction · test coverage · ADRs',
    },
    {
      name: 'Self-hosting &amp; leaving SaaS',
      blurb:
        'When renting stops making sense. We move workloads onto infrastructure you control, with the backups, monitoring, and documented runbooks that make owning it safer than renting it — and we run our own stack this way, so none of it is theoretical.',
      stack: 'migration planning · Docker · backups + restore drills · monitoring · runbooks',
    },
  ],
};

// ---- Approach: the principles, stated as trade-offs rather than slogans. ----
export const approach = {
  head: 'How we work',
  lead: 'A short list, because these are the ones we actually hold to when it costs something.',
  items: [
    {
      name: 'Legibility over cleverness',
      blurb:
        'Code that fits in your head beats code that shows off. A clever abstraction saves an afternoon and costs a year of onboarding — we take the plain version and the comment that explains why.',
    },
    {
      name: 'Few dependencies',
      blurb:
        'Every dependency is a future upgrade, audit, and breaking change. We add one when it earns its place. Our own PHP framework has <b>zero runtime dependencies</b> — proof the bar can be that high.',
    },
    {
      name: 'Tests first',
      blurb:
        'Written before the code, run on every push, blocking the deploy when they fail. Not for a coverage badge — so a change on a Friday is boring.',
    },
    {
      name: 'Decisions written down',
      blurb:
        'Architecture decision records for the choices, reading guides that trace a codebase from entry point to response, and docs updated in the same commit as the change. The question gets answered once.',
    },
    {
      name: 'Automate the toil once',
      blurb:
        'A day spent automating a chore beats doing it by hand every week for a year. Every project we run ships through a pipeline we built precisely so that shipping stops being interesting.',
    },
  ],
};

// ---- Work: OUR OWN software. The note is not optional — see honesty rules. ----
export const work = {
  head: 'Selected work',
  note:
    'Everything below we designed and built ourselves — our own products and infrastructure, run in production. <b>No client work is shown here.</b> It is the portfolio of a studio that builds its own tools, and every open-source piece is public and readable.',
  groups: [
    {
      heading: 'A framework, and the applications on it',
      blurb:
        'A from-scratch PHP microframework with zero runtime dependencies, its companion packages, and real applications built on top to prove it holds up under production use.',
      projects: [
        {
          name: 'karhu',
          flag: 'open source',
          flagship: true,
          blurb:
            'An attribute-routed PHP 8.3+ microframework in roughly 1,200 lines with no runtime dependencies: its own PSR-shaped request/response layer, a reflection-based auto-wiring container, an onion middleware pipeline, and a CLI. Architecture decisions captured as ADRs; built test-first to PHPStan level 8.',
          stack: 'PHP 8.3+ · zero runtime deps · attribute routing · auto-wiring DI · PHPUnit · PHPStan L8',
          links: [{ label: 'GitHub →', href: 'https://github.com/bjornbasar/karhu' }],
        },
        {
          name: 'karhu-db · -queue · -view',
          flag: 'open source',
          blurb:
            'The companion packages: a thin PDO wrapper with an active-record base, a database-backed queue and worker, and a template-engine bridge for Twig and Plates — each small, focused, and independently composable.',
          stack: 'PHP 8.3+ · PDO · database-backed queue · Twig / Plates · Packagist',
          links: [{ label: 'karhu-db →', href: 'https://github.com/bjornbasar/karhu-db' }],
        },
        {
          name: 'mishka',
          flag: 'open source',
          blurb:
            'The flagship proof — a family-hub web app (shared calendar, chores, lists, web-push reminders) that exercises the framework under real load: session auth, recurring events, a queue-backed notification pipeline, and background workers.',
          stack: 'PHP 8.4 · karhu · PostgreSQL · Twig · web-push · queue worker',
          links: [{ label: 'GitHub →', href: 'https://github.com/bjornbasar/mishka' }],
        },
        {
          name: 'istrbuddy',
          flag: 'open source',
          blurb:
            'A deliberately minimal issue tracker, and the counterpoint to mishka: the same framework wired with a fraction of the surface area — a roughly 67-line application/framework seam — showing it scales down as cleanly as it scales up.',
          stack: 'karhu · karhu-db · SQLite',
          links: [{ label: 'GitHub →', href: 'https://github.com/bjornbasar/istrbuddy' }],
        },
      ],
    },
    {
      heading: 'Product applications',
      blurb:
        'Product-shaped work on Next.js (App Router), Prisma, and PostgreSQL — self-hosted, and used daily rather than demoed.',
      projects: [
        {
          name: 'hartza',
          flag: 'in-house product',
          blurb:
            'A household budgeting app built on cash-flow forecasting — descriptive, not prescriptive: where you are, and where you may be. Recurring income and bills with skippable occurrences, monthly budget-versus-actual reconciliation, and multi-user households.',
          stack: 'Next.js 16 · React · Prisma · PostgreSQL · NextAuth · Tailwind',
        },
        {
          name: 'artio',
          flag: 'in-house product',
          blurb:
            'A trading-card-game collection manager and deck builder: price tracking, deck import and export, a disk-caching image proxy, camera-OCR card scanning, and in-browser playtesting. A workspaces monorepo with a clock-driven cron worker and hand-rolled JWT auth.',
          stack: 'Next.js 15 · Prisma 6 · PostgreSQL · monorepo (app + worker) · jose JWT · OCR',
        },
        {
          name: 'kuma',
          flag: 'in-house product',
          blurb:
            'A recipe manager: save recipes, import from a URL or a photo via OCR, tag-filter the collection, and cook in a full-screen step-by-step mode, with PDF export.',
          stack: 'Next.js 16 · Prisma · PostgreSQL · OCR · PDF export',
        },
      ],
    },
    {
      heading: 'Platform &amp; tooling',
      blurb:
        'The infrastructure everything above ships through — a small fleet of machines provisioned and deployed as code, monitored, and fronted by a single reverse proxy. We run it, so we know what it costs to run.',
      projects: [
        {
          name: 'the platform',
          flag: 'self-hosted',
          blurb:
            'A multi-host homelab run as a platform: config-as-code provisioning, a CI/CD pipeline that tests, builds, deploys, and reports to chat, a metrics-and-logs stack with alerting, encrypted secrets, a private container registry, and TLS termination for every service. Every project we ship goes through it.',
          stack: 'Ansible · Docker · private registry · Prometheus / Grafana / Loki · nginx · SOPS + age · Cloudflare',
        },
        {
          name: 'wojtek',
          flag: 'in-house tool',
          blurb:
            'A chat-ops bot that operates the whole platform from Telegram and Slack — containers, deploys, disk, DNS — reaching each host\'s container API over authenticated SSH. A long-lived, async-native service.',
          stack: 'Node.js 26 ESM · Fastify 5 · Telegram / Slack · SSH · Docker Engine API',
        },
        {
          name: 'sleuth',
          flag: 'in-house tool',
          blurb:
            'A code-tour hub: reading-guide maps that trace each codebase from entry point to response, single-sourced from per-repo Markdown and continuously deployed. It is how we make "decisions written down" something you can actually read.',
          stack: 'static (nginx) · Node build · CI-generated · access-controlled',
        },
      ],
    },
  ],
};

// ---- Capabilities: the tools, roughly by how much we reach for them. ----
export const stack = {
  head: 'What we work with',
  lead: 'Day-to-day tools, roughly ordered by how often we reach for them.',
  tags: [
    { t: 'PHP 8.4', emph: true }, { t: 'Next.js', emph: true }, { t: 'React' },
    { t: 'Node.js', emph: true }, { t: 'TypeScript', emph: true }, { t: 'Fastify' },
    { t: 'PostgreSQL', emph: true }, { t: 'Prisma' }, { t: 'SQLite' }, { t: 'Twig' },
    { t: 'Docker', emph: true }, { t: 'Ansible', emph: true }, { t: 'CI/CD', emph: true },
    { t: 'nginx' }, { t: 'Prometheus / Grafana' }, { t: 'Loki' }, { t: 'SOPS / age' },
    { t: 'PHPUnit' }, { t: 'Vitest' }, { t: 'Cloudflare' }, { t: 'self-hosting' },
  ],
};

export const contact = {
  head: 'Get in touch',
  h2: 'Tell us what you\'re building.',
  lead:
    'Whether it\'s a product to build, a platform to straighten out, or a codebase nobody can explain any more — if it\'s the kind of thing you\'d want to understand and own, we\'d like to hear about it.',
  // Not trading yet: this is the honest framing, and it replaces any pricing,
  // availability, or turnaround claim. Do not soften it into a sales promise.
  caveat:
    'We\'re a small studio and we take on work selectively, so we can\'t promise capacity — but every enquiry gets a straight answer either way.',
};

export const footer = {
  tagline: 'Built &amp; self-hosted in Aotearoa New Zealand.',
  links: [
    { href: '/terms/', label: 'Terms' },
    { href: '/privacy/', label: 'Privacy' },
    { href: 'https://bjorn.basar.co.nz/', label: 'Bjorn Basar ↗', external: true },
  ],
};
