import { cn } from "@/lib/utils";

import styles from "./sticky-hero.module.css";

/**
 * The organic blob behind the hero's bottom edge, from Figma 27:253 (vendored
 * as design-assets/figma/landing-2026/hero-wave-blob.svg). The photo blob,
 * 27:251, is the same path at 0.811688 scale. Both are exported so other
 * hand-offs (the landing "everywhere" section's top edge) share the edge.
 */
export const HERO_BLOB =
  "M3251.94 1440.02C3228.09 2458.61 2229.74 1857.34 1561.72 2199.16C654.313 2663.84 -3.75896 2367.49 0.0161593 1554.64C24.5544 -555.136 3284.54 -443.083 3251.94 1440.02Z";
/** Both blobs are rotated 11.43 degrees. */
const ROTATION = "0.9801598191 0.1982086748 -0.1982086748 0.9801598191";
/*
 * Placements in Figma page coordinates (the BG frame sits 47.76 above the
 * page top): each blob's rotated origin from the node metadata.
 */
const PALE_BLOB = `matrix(${ROTATION} -377.2776 -1322.5624)`;
export const HERO_PHOTO_BLOB = `matrix(${ROTATION} -122.2947 -985.8739) scale(0.811688)`;

/**
 * The hero's bottom wave band: transparent above the photo blob's edge (the
 * hero shows through), the Landing Pale band down to the pale blob's edge,
 * and Warm Snow below. It spans Figma page y 986-1230 at full width and
 * scales with `--hero-wave-height`. It moves with the content that follows
 * the hero, so it is a single shape with nothing to align.
 */
export function HeroWave({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden
      viewBox="0 986 1440 244"
      preserveAspectRatio="none"
      className={cn(styles.wave, className)}
    >
      <defs>
        <mask
          id="hero-wave-photo"
          maskUnits="userSpaceOnUse"
          x="0"
          y="986"
          width="1440"
          height="250"
        >
          <rect x="0" y="986" width="1440" height="250" fill="white" />
          <path d={HERO_BLOB} transform={HERO_PHOTO_BLOB} fill="black" />
        </mask>
      </defs>
      <g mask="url(#hero-wave-photo)">
        {/* Runs a few units past the band so no hairline of the hero can
            show where the band meets the section below. */}
        <rect
          x="0"
          y="986"
          width="1440"
          height="250"
          className="fill-brand-warm-snow"
        />
        <path
          d={HERO_BLOB}
          transform={PALE_BLOB}
          className="fill-landing-pale"
        />
      </g>
    </svg>
  );
}
