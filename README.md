# young-muslims-website

Young Muslims' official website.

## Stack

- [Next.js](https://nextjs.org) 16.3 (App Router)
- React 19.2
- TypeScript
- [Tailwind CSS](https://tailwindcss.com) 4
- [Bun](https://bun.sh) as the package manager and script runner
- Hosted on [Netlify](https://netlify.com)

## Getting started

Requires [Bun](https://bun.sh). This project does not use npm, yarn, or pnpm.

```bash
bun install
bun run dev
```

The dev server runs at http://localhost:3000.

Other scripts:

```bash
bun run build         # production build
bun run start         # serve the production build locally
bun run lint          # eslint
bun run typecheck     # next typegen && tsc --noEmit
bun run format        # prettier --write
bun run format:check  # prettier --check, for CI
```

`typecheck` runs `next typegen` first because Next generates the route and
layout types that `tsc` needs; plain `tsc --noEmit` fails without them.

Prettier runs with `prettier-plugin-tailwindcss`, which sorts utility classes
into a canonical order. Run `bun run format` before committing so class-order
churn stays out of diffs.

## Wireframe prototype

The site is currently a black-and-white wireframe. **[WIREFRAME.md](WIREFRAME.md)
says which code is real and which is scaffolding** — read it before changing
anything under `src/`, and follow its removal checklist when the wireframe comes
out.

## Decisions

Recorded here so they do not get relitigated. Change them deliberately.

**Production domain is `youngmuslims.com`.** `ymsite.com` and `ymsisters.com`
currently serve separate live sites. Their URLs will be mapped to relevant
replacements on `youngmuslims.com` using permanent HTTP redirects at the host or
CDN, with DNS pointing to that infrastructure. See [SEO-CHECKLIST.md](SEO-CHECKLIST.md)
for migration dependencies and verification.

**English only.** The site will never be localized, so there is no locale
segment in the URL structure and no i18n tooling.

**Server rendered, mostly static.** Pages are React Server Components that
build to static HTML at deploy time. This is the App Router default and it is
what we want: search crawlers and, more importantly, the link unfurlers behind
Facebook, LinkedIn, X, WhatsApp, iMessage, and Slack do not execute JavaScript,
so page content and Open Graph tags have to be present in the HTML the server
sends. Static HTML also gives us the best Largest Contentful Paint.

Interactivity is opted into per component with `"use client"`. Third-party
widgets such as Fundraise Up and embedded forms are client-side by nature, which
is fine, because nothing inside them needs to be indexed. Avoid putting
`"use client"` at the top of a page or layout file, which quietly turns the
whole subtree into a client-rendered app and undoes the above.

**Hosted on Netlify**, using the Netlify Next.js runtime.

**Maps use [mapcn](https://mapcn.dev) on top of MapLibre GL.** mapcn is a
shadcn-style registry, so `src/components/ui/map.tsx` is vendored source we own
rather than a dependency we import from. Re-adding it with
`bunx shadcn@latest add @mapcn/map` overwrites that file, which is why it is
excluded from eslint and Prettier: any local formatting would be churn.

MapLibre's web worker is served from our own origin rather than the unpkg CDN
mapcn defaults to. `scripts/copy-maplibre-worker.mjs` copies it out of
node_modules into `public/` on postinstall, and `src/lib/maplibre-worker.ts`
points MapLibre at that copy. Import `@/lib/maplibre-worker` before the map
component in any module that uses it, or the CDN fallback wins and the map
silently renders no tiles wherever unpkg is unreachable.

US state polygons live at `public/us-states.geojson` for the same reason: a map
of our own chapters should not depend on a third party staying up. The data is
derived from US Census cartographic boundary files, which are public domain.

## To dos

### Integrations

- [ ] Fundraise Up. Embed the widget snippet, wire donate links, decide
      which pages get a donate CTA. No API keys or server work required.
- [ ] Embedded form platform. Pick the vendor, then embed.
- [ ] CMS. Between Sanity, Payload, and Contentful.

### SEO

[SEO-CHECKLIST.md](SEO-CHECKLIST.md) is the source of truth for SEO to-dos,
dependencies, owners, acceptance criteria, and tests before and after deployment.
SEO work starts during development. Public indexing remains disabled until the
launch requirements in that tracker are satisfied.

Production indexing is now enabled in `netlify.toml` for all eight inventoried
pages. It requires `NODE_ENV=production`, `CONTEXT=production`, and
`SITE_INDEXABLE=true` together. Local development, branch deploys, and previews
remain non-indexable, even if they inherit the opt-in. Change the production
opt-in to `false` and rebuild to disable indexing intentionally.

Each page has its own canonical URL. `src/lib/seo.ts` lists the sitemap paths;
update it when adding pages. Production publishes all eight URLs at `/sitemap.xml`
and advertises it in `/robots.txt`. Other builds publish an empty sitemap and a
`noindex, nofollow` response header. Crawling stays allowed so crawlers can read
the non-indexing directives.

To simulate production locally, build with
`CONTEXT=production SITE_INDEXABLE=true bun run build`. To test preview isolation,
build with `CONTEXT=deploy-preview SITE_INDEXABLE=true bun run build`. Rebuild
between modes; prerendered metadata reflects the build environment. Validate
Netlify's actual headers and alternate host behavior after deploying; configuring
indexability does not submit the site to search engines or guarantee indexing.

After building, run `node scripts/check-indexing.mjs production` or
`node scripts/check-indexing.mjs preview` for the matching mode. This checks
generated HTML for all eight pages, canonical URLs, sitemap contents, robots,
and the configured response-header manifest.

### Branding and sharing

- [ ] Design an Open Graph image for link sharing, covering the sizes each
      platform expects.
- [ ] Design a favicon and produce the full icon set (browser tab, iOS
      home screen, Android, web app manifest).

### Foundations

- [ ] Site structure and navigation.
- [ ] Accessibility pass (WCAG AA).
- [ ] Analytics, and a consent banner if one is needed.
- [ ] Security headers, including a CSP once the vendor list is settled.
