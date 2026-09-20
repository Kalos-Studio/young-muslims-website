@AGENTS.md

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
