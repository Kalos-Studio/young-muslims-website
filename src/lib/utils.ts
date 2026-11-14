import { createCn } from "cn/config";

/**
 * The website's type roles: every `--text-*` font size defined in the
 * `@theme` blocks of `src/app/globals.css` (documented in DESIGN-SYSTEM.md,
 * "Typography"). `bun run lint:tokens` checks that this list matches
 * globals.css, so add a role here when you add one there.
 */
export const TYPE_SIZE_TOKENS = [
  "display",
  "section",
  "lead",
  "card-title",
  "article-title",
  "article-meta",
  "cta",
  "body",
  "nav",
  "stat",
  "marquee",
  "footer-tagline",
  "footer-tagline-tablet",
  "footer-tagline-mobile",
  "footer-legal",
  "mobile-display",
  "tablet-display",
  "mobile-section",
  "landing-display",
  "landing-section",
  "landing-hero-subtitle",
  "landing-copy",
  "landing-stat",
  "landing-stat-label",
] as const;

/**
 * Joins class names and resolves Tailwind conflicts (clsx + tailwind-merge,
 * via the `cn` package).
 *
 * The merger only knows Tailwind's built-in sizes (`text-sm` and so on), so
 * out of the box it reads a custom size such as `text-nav` as a text colour
 * and drops it when a real colour such as `text-brand-obsidian` is in the
 * same call. Registering the type roles as font sizes keeps both: a size
 * still replaces a size, and a colour still replaces a colour.
 */
export const cn = createCn({
  extend: { classGroups: { "font-size": [{ text: [...TYPE_SIZE_TOKENS] }] } },
});
