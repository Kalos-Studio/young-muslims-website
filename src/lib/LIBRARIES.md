# Libraries and tooling

This file records why each major dependency exists, where it is used, and how
to decide whether it belongs in new work. `package.json` and `bun.lock` remain
the source of truth for installed versions.

Use Bun for dependency management:

```bash
bun add <package>
bun add --dev <package>
bun remove <package>
```

Do not use npm, pnpm, or Yarn in this repository. Update this file whenever a
library is added, removed, or given a materially different responsibility.

## Application foundation

| Library                                            | Purpose                                                                                           | Status and guidance                                                                                                                                                                                              |
| -------------------------------------------------- | ------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [Next.js](https://nextjs.org/docs)                 | Application framework, App Router, routing, metadata, server rendering, images, fonts, and builds | Core. Pages and layouts should remain Server Components unless interactivity requires a smaller Client Component boundary. Read the matching guide in `node_modules/next/dist/docs/` before using a Next.js API. |
| [React](https://react.dev)                         | Component model and React Server Components                                                       | Core. Prefer server-rendered content. Use `'use client'` only at the narrow entry point that needs state, effects, event handlers, or browser APIs.                                                              |
| [React DOM](https://react.dev/reference/react-dom) | Browser rendering and portals                                                                     | Core. Used directly by the map component for marker and popup portals.                                                                                                                                           |
| [TypeScript](https://www.typescriptlang.org/docs/) | Static types for application and configuration code                                               | Core development dependency. Run `bun run typecheck` after meaningful code changes.                                                                                                                              |

## Styling and interface primitives

| Library                                                                           | Purpose                                                       | Status and guidance                                                                                                                                                                                                            |
| --------------------------------------------------------------------------------- | ------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| [Tailwind CSS](https://tailwindcss.com/docs)                                      | Utility classes, responsive styles, and design tokens         | Core. This project uses Tailwind 4 CSS-first configuration in `src/app/globals.css`; do not add `tailwind.config.ts`.                                                                                                          |
| [`@tailwindcss/postcss`](https://tailwindcss.com/docs/installation/using-postcss) | Compiles Tailwind through PostCSS                             | Build tooling. It is configured in `postcss.config.mjs`.                                                                                                                                                                       |
| [shadcn](https://ui.shadcn.com)                                                   | Component registry tooling and shared Tailwind styles         | Installed and its CSS is imported by `src/app/globals.css`. Registry components are copied into the repository and become source we own; shadcn is not a runtime component API.                                                |
| [Base UI](https://base-ui.com/react/overview/quick-start)                         | Accessible, unstyled primitives for complex controls          | Installed but not currently imported in `src/`. Prefer it when a new dialog, menu, popover, tabs, tooltip, or similar interaction needs complete keyboard and focus behavior. Do not use it for simple semantic HTML controls. |
| [Class Variance Authority](https://cva.style/docs)                                | Typed component variants                                      | Used by shared UI and wireframe components such as `src/components/ui/button.tsx`. Use it when a reusable component has meaningful visual variants, not for one-off class lists.                                               |
| [`cn`](https://www.npmjs.com/package/cn)                                          | Combines conditional class names                              | Used directly and re-exported from `src/lib/utils.ts`. Use it when class names are conditional or passed in by a caller.                                                                                                       |
| [Lucide React](https://lucide.dev/guide/packages/lucide-react)                    | Interface icons                                               | Used in navigation, map controls, and detail panels. Icons should support a text label or have an accessible name when used alone.                                                                                             |
| [`tw-animate-css`](https://github.com/Wombosvideo/tw-animate-css)                 | Small CSS animation utilities used by shadcn-style components | Imported globally. Use for small, self-contained state transitions when a JavaScript animation library is unnecessary.                                                                                                         |

The website's colors, typography, and token rules are documented separately in
[`DESIGN-SYSTEM.md`](DESIGN-SYSTEM.md).

## Motion, transitions, and carousels

Choose the smallest tool that fully expresses the interaction.

| Need                                                                               | Preferred tool                     |
| ---------------------------------------------------------------------------------- | ---------------------------------- |
| Color, opacity, shadow, or small transform on hover/focus                          | CSS and Tailwind                   |
| Component entrance/exit, scroll reveal, stagger, drag, spring, or layout animation | Motion                             |
| Touch-friendly image or card carousel                                              | Embla Carousel                     |
| Shared elements or directional transitions between routes                          | React and Next.js View Transitions |
| Long, tightly choreographed timelines or advanced scroll scenes                    | Evaluate GSAP before installing it |

### Motion

[Motion for React](https://motion.dev/docs/react) is installed for sliding
panels, content reveals, gestures, layout animation, and coordinated component
transitions. It is available but is not yet imported by a production component.

Use a Client Component when the animation needs hooks, gestures, state, or
`AnimatePresence`:

```tsx
"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
```

For a simple Motion element that does not need client-only hooks, Motion also
provides a server-compatible import that avoids turning the importing component
into a Client Component:

```tsx
import * as motion from "motion/react-client";
```

Animation must respect the user's reduced-motion preference. Prefer opacity or
an immediate state change when `useReducedMotion()` is true. Avoid animating a
large page subtree when a small animated component boundary will do.

### Embla Carousel

[Embla Carousel](https://www.embla-carousel.com/docs/v8/get-started/react) is
installed for touch-friendly sliders, including the planned About image rotation
and Blog featured-post carousel. It is available but is not yet imported by a
production component.

Embla is a hook and belongs in a Client Component:

```tsx
"use client";

import useEmblaCarousel from "embla-carousel-react";
```

Carousels must retain usable previous and next controls, keyboard access,
visible focus states, and meaningful image alternative text. Do not autoplay by
default. If autoplay is approved, provide a pause control and install the Embla
autoplay plugin separately rather than building an unmanaged timer.

### Route transitions

Next.js 16 supports React's `ViewTransition` patterns in the App Router. Use
them for route-to-route continuity and shared-element transitions instead of
forcing route lifecycles through Motion. Read
`node_modules/next/dist/docs/01-app/02-guides/view-transitions.md` before
implementation because this Next.js version may differ from examples found
online.

GSAP is not installed. Add it only when an approved design requires timelines
or scroll choreography that Motion and CSS cannot express cleanly.

## Maps and geospatial data

| Library                                                          | Purpose                                  | Status and guidance                                                                                                                                                      |
| ---------------------------------------------------------------- | ---------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| [MapLibre GL JS](https://maplibre.org/maplibre-gl-js/docs/)      | Interactive NeighborNets map             | Used by `src/components/ui/map.tsx` and `src/lib/maplibre-worker.ts`. Import `@/lib/maplibre-worker` before the map component so the self-hosted worker is used.         |
| [`@types/geojson`](https://www.npmjs.com/package/@types/geojson) | TypeScript types for GeoJSON data        | Used for NeighborNets point data and map component types.                                                                                                                |
| [mapcn](https://mapcn.dev)                                       | Source of the shadcn-style map component | Not an installed runtime dependency. `src/components/ui/map.tsx` is vendored source owned by this repository. Re-adding it may overwrite local changes; see `README.md`. |

## Review and prototype tooling

| Library                                                 | Purpose                                              | Status and guidance                                                                                                                                                                |
| ------------------------------------------------------- | ---------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [Agentation](https://github.com/benjitaylor/agentation) | On-page feedback annotations during wireframe review | Temporary wireframe dependency. Its loading and environment gates are documented in `WIREFRAME.md`. Remove it using that file's checklist when the wireframe review workflow ends. |

## Code quality

| Library                                                                                      | Purpose                                      | Status and guidance                                                                                |
| -------------------------------------------------------------------------------------------- | -------------------------------------------- | -------------------------------------------------------------------------------------------------- |
| [ESLint](https://eslint.org/docs/latest/) and `eslint-config-next`                           | Static analysis and Next.js rules            | Run with `bun run lint`.                                                                           |
| [Prettier](https://prettier.io/docs/)                                                        | Code formatting                              | Run with `bun run format`; CI can check with `bun run format:check`.                               |
| [`prettier-plugin-tailwindcss`](https://github.com/tailwindlabs/prettier-plugin-tailwindcss) | Canonical Tailwind class ordering            | Loaded through the Prettier configuration.                                                         |
| `@types/node`, `@types/react`, and `@types/react-dom`                                        | Type declarations for Node.js and React APIs | Development-only typing support. Keep their major versions aligned with the corresponding runtime. |

## Adding another library

Before adding a dependency:

1. Confirm the capability is not already provided by the platform, React,
   Next.js, CSS, or an installed library.
2. Check accessibility, reduced-motion behavior, bundle impact, maintenance,
   licensing, and compatibility with the project's exact React and Next.js
   versions.
3. Install it with Bun and commit both `package.json` and `bun.lock`.
4. Keep Client Component boundaries narrow.
5. Add its purpose, ownership, import pattern, and removal conditions here.
