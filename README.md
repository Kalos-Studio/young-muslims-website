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
bun run lint:tokens   # block new design-token violations
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

**The NeighborNets map is plain SVG, generated at build time.**
`scripts/neighbornets-map.mjs` projects the US Census 1:10m state boundaries
(the `us-atlas` package; public domain) and every NeighborNet's coordinates
through the same US Albers projection (`d3-geo`), into
`src/generated/neighbornets-map.ts`. Nothing is fetched at runtime and no map
library ships to the browser. Each net's city and ZIP were reverse-geocoded
once by `scripts/reverse-geocode-neighbornets.mjs` and are committed in
`data/neighbornet-places.csv`.

## To dos

### Integrations

- [ ] Fundraise Up. Embed the widget snippet, wire donate links, decide
      which pages get a donate CTA. No API keys or server work required.
- [ ] Embedded form platform. Pick the vendor, then embed.
- [x] Sanity CMS for blog publishing. Editors use [Young Muslims Studio](https://young-muslims-website.sanity.studio/). See [blog editing instructions](studio-young-muslims-website/BLOG-EDITING.md).

### Sanity configuration

The website reads `NEXT_PUBLIC_SANITY_PROJECT_ID` and `NEXT_PUBLIC_SANITY_DATASET`
from its environment. Studio uses `SANITY_STUDIO_PROJECT_ID` and
`SANITY_STUDIO_DATASET` in its own folder. Both apps have tracked `.env` files
containing public defaults only, so fresh checkouts and CI retain the current
project configuration. Use ignored `.env.local` files or hosting settings to
override them; never add secrets to the tracked files. Rebuild the relevant app
after changing these values. The website's image allowlist uses the same settings
as its content requests.

Cover images preserve the editor's crop and hotspot. The website uses Sanity's
image URL builder and adjusts the crop to the rendered card or banner dimensions.
Run `bun test scripts/sanity-image.test.ts` to check image crop behavior.

### SEO

[SEO-CHECKLIST.md](SEO-CHECKLIST.md) is the source of truth for SEO to-dos,
dependencies, owners, acceptance criteria, and tests before and after deployment.
SEO work starts during development. Public indexing remains disabled until the
launch requirements in that tracker are satisfied.

Production indexing is enabled in `netlify.toml`. It requires
`NODE_ENV=production`, `CONTEXT=production`, and `SITE_INDEXABLE=true` together
at build time. The answer is baked into the build (see `src/lib/seo.ts`) because
Netlify does not pass these variables to on-demand pages when they are served.
Local development, branch deploys, and previews remain non-indexable, even if
they inherit the opt-in. Change the production opt-in to `false` and rebuild to
disable indexing intentionally.

Each page has its own canonical URL. The sitemap (`src/app/sitemap.ts`) lists
the top-level pages in `indexablePaths` in `src/lib/seo.ts` (update it when
adding a page), finished stories in `INDEXABLE_STORY_SLUGS` in
`src/lib/stories.ts`, and blog posts with a full article body
(`isBlogPostIndexable` in `src/lib/blog.ts`). Placeholder stories and
excerpt-only posts render `noindex, follow`. Production advertises the sitemap
in `/robots.txt`. Other builds publish an empty sitemap and a
`noindex, nofollow` response header. Crawling stays allowed so crawlers can read
the non-indexing directives.

To simulate production locally, build with
`CONTEXT=production SITE_INDEXABLE=true bun run build`. To test preview isolation,
build with `CONTEXT=deploy-preview SITE_INDEXABLE=true bun run build`. Rebuild
between modes; prerendered metadata reflects the build environment. Validate
Netlify's actual headers and alternate host behavior after deploying; configuring
indexability does not submit the site to search engines or guarantee indexing.

After building, run `bun run test:seo` with the same `CONTEXT` and
`SITE_INDEXABLE` values used for the build. It starts the built site on a free
port without those variables, as Netlify serves on-demand pages, and checks every
page in the build's route manifest (dynamic routes through their prerendered
paths, and CMS blog articles through links on the public blog listing; other
dynamic routes without concrete paths fail the check): status, canonical URL, robots meta and
header, unique titles and descriptions, that the sitemap lists exactly the
indexable pages, robots.txt, the 404 response, and homepage structured data.
GitHub Actions runs it for production and preview builds (`.github/workflows/seo.yml`).

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

## Shared footer behavior

Every page inherits `SiteFooter` and `FooterPageStage` from the root layout.
Keep page content inside that shared shell: new pages must not add their own
footer or opt out of the footer stage. The bottom-edge Easter egg, including
its photo montage, applies to all routes automatically. Continuing to scroll
or swipe down at the page bottom reveals it; keyboard scrolling works too.
The animation respects reduced-motion preferences and pauses while a dialog
is open. Check this behavior when adding a page or changing its scroll layout.
With the dev server running, `bun run test:footer` checks wheel, touch, keyboard,
and reduced-motion behavior across the current routes using headless Chrome.
