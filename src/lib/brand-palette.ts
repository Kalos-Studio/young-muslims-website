/*
 * The brand palette as runtime colours, and a contrast check for text on
 * them. Shared by the page transition (its cover colours) and the landing
 * stories snippet (its hover pops and story overlays). Browser-only helpers
 * (they read the tokens from the root): call them from effects or handlers.
 *
 * Each colour carries its token (read at runtime for its luminance) and the
 * Tailwind classes that paint it, spelled out so Tailwind generates them.
 */
export const BRAND_COLORS = [
  {
    name: "obsidian",
    token: "--color-brand-obsidian",
    bg: "bg-brand-obsidian",
    fill: "fill-brand-obsidian",
  },
  {
    name: "warm-snow",
    token: "--color-brand-warm-snow",
    bg: "bg-brand-warm-snow",
    fill: "fill-brand-warm-snow",
  },
  {
    name: "royal",
    token: "--color-brand-royal",
    bg: "bg-brand-royal",
    fill: "fill-brand-royal",
  },
  {
    name: "jade",
    token: "--color-brand-jade",
    bg: "bg-brand-jade",
    fill: "fill-brand-jade",
  },
  {
    name: "pure-white",
    token: "--color-brand-pure-white",
    bg: "bg-brand-pure-white",
    fill: "fill-brand-pure-white",
  },
  {
    name: "midnight",
    token: "--color-brothers-midnight",
    bg: "bg-brothers-midnight",
    fill: "fill-brothers-midnight",
  },
  {
    name: "slate",
    token: "--color-brothers-slate",
    bg: "bg-brothers-slate",
    fill: "fill-brothers-slate",
  },
  {
    name: "sky",
    token: "--color-brothers-sky",
    bg: "bg-brothers-sky",
    fill: "fill-brothers-sky",
  },
  {
    name: "forest",
    token: "--color-sisters-forest",
    bg: "bg-sisters-forest",
    fill: "fill-sisters-forest",
  },
  {
    name: "brass",
    token: "--color-sisters-brass",
    bg: "bg-sisters-brass",
    fill: "fill-sisters-brass",
  },
  {
    name: "buttercup",
    token: "--color-sisters-buttercup",
    bg: "bg-sisters-buttercup",
    fill: "fill-sisters-buttercup",
  },
] as const;

export type BrandColor = (typeof BRAND_COLORS)[number];

/**
 * WCAG relative luminance of a colour token. The token's value can be in any
 * CSS colour form (production CSS shortens `#ffffff` to `#fff`), so it is
 * normalised to `#rrggbb` through a canvas context's `fillStyle` first.
 */
export function tokenLuminance(token: string) {
  const value = getComputedStyle(document.documentElement)
    .getPropertyValue(token)
    .trim();
  const context = document.createElement("canvas").getContext("2d");
  if (context) context.fillStyle = value;
  const normalised = String(context?.fillStyle ?? "");
  const hex = normalised.match(/^#([\da-f]{2})([\da-f]{2})([\da-f]{2})$/i);
  const channels = hex
    ? hex.slice(1).map((part) => Number.parseInt(part, 16))
    : [0, 0, 0];
  const [r, g, b] = channels.map((channel) => {
    const c = channel / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/**
 * Whether Obsidian (rather than Warm Snow or white) is the legible text
 * colour on `color`: its luminance is above `--page-transition-contrast-
 * threshold` (0.195, where both have equal contrast; at least 5.3:1 either
 * way across the palette).
 */
export function needsDarkText(color: BrandColor) {
  const threshold = Number.parseFloat(
    getComputedStyle(document.documentElement).getPropertyValue(
      "--page-transition-contrast-threshold",
    ),
  );
  return (
    tokenLuminance(color.token) > (Number.isNaN(threshold) ? 0.195 : threshold)
  );
}

/*
 * The hover-pop colours (the landing stories snippet's and the Stories
 * gallery's): the brand palette less Warm Snow and white, which would vanish
 * against those Warm Snow sections.
 */
export const POP_COLORS = BRAND_COLORS.filter(
  (color) => color.name !== "warm-snow" && color.name !== "pure-white",
);

/** A random pop colour, never `last` (the one that shape showed last). */
export function pickPopColor(last: BrandColor | undefined) {
  const choices = POP_COLORS.filter((color) => color !== last);
  return choices[Math.floor(Math.random() * choices.length)];
}

/** The palette colour named `name` (a `BrandColor["name"]`), if any. */
export function brandColorNamed(name: string | null | undefined) {
  return BRAND_COLORS.find((color) => color.name === name);
}
