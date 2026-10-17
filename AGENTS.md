<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Building on the existing site

The site is being developed into the production design on top of an earlier
wireframe. Follow `DESIGN-SYSTEM.md` for current visual rules. Some temporary
scaffolding remains; consult `WIREFRAME.md` when modifying or removing it, but
do not apply its historical wireframe-only styling rules to production work.
Preserve working routes, shared components, and functionality as scaffolding
is replaced.

# Keep the shared footer on every page

Every existing and future page must inherit `SiteFooter` and `FooterPageStage`
from the root layout, including the bottom-edge Easter egg animation. Do not
replace them with page-specific footers or introduce route allowlists for the
animation. Preserve reduced-motion handling. When changing page scrolling or
the shared footer, run `bun run test:footer` against the local dev server.

# Design-system lock

Never use a font, color, type size, spacing value, radius, shadow, animation,
or other visual value that is not already exposed by the project's Tailwind
theme and permitted by `DESIGN-SYSTEM.md`.

The approved desktop website values come from the Young Muslims Website Figma
file, node `26:188`. Treat the role tokens documented in `DESIGN-SYSTEM.md` as
the reviewed code translation of that frame; do not reinterpret its raw layer
values at individual call sites.

- Use existing semantic Tailwind utilities first, then approved brand
  utilities when the design explicitly calls for them.
- Never use arbitrary Tailwind values or properties (`[...]`), raw color
  literals, inline visual styles, or ad hoc CSS variables to bypass the theme.
- Never add or load another font. The only approved families are Figtree
  (`font-sans` / `font-heading`) and Boldonse (`font-display`).
- Do not extend or change the theme merely to satisfy a one-off design choice.
  If the approved tokens cannot express a requested design, stop and ask for
  explicit approval to update the design system first.

Run `bun run lint:tokens` after visual changes and before completing the task.
GitHub Actions runs the same check. Existing violations are tracked in
`scripts/design-token-baseline.json`; do not add new violations to the baseline
to make the check pass. See `scripts/design-tokens.md` for scope and limitations.
