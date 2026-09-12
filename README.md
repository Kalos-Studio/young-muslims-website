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
currently serve separate live sites. Those will be taken down and redirected to
`youngmuslims.com` at the DNS level.

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

### SEO (will be addressed later, but we should expect it to come at the end)

- [ ] Set the production domain and canonical URL handling.
- [ ] Pick the canonical host and 301 the other to it. Bare
      `youngmuslims.com` is the modern convention and the suggested default;
      Netlify DNS handles apex domains natively. Either way users never type
      `www`, since the one we don't pick redirects to the one we do.
- [ ] 301 redirect `ymsite.com` and `ymsisters.com` to `youngmuslims.com` at the
      DNS/host level, once those sites are taken down.
- [ ] Page metadata: titles, descriptions, canonical tags.
- [ ] sitemap.xml and robots.txt.
- [ ] Structured data (Organization / NGO schema).
- [ ] Google Search Console and Bing Webmaster verification.

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
