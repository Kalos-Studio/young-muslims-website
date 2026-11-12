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
 * page top): each blob's rotated origin from the node metadata. The pale
 * blob is exported too, for the NeighborNet switcher's layered edges.
 */
export const PALE_BLOB = `matrix(${ROTATION} -377.2776 -1322.5624)`;
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

/**
 * The NeighborNets hero's blob (Figma 301:2108 and 301:2118; vendored as
 * design-assets/figma/neighbornets/hero/shape.svg): one path, the pale band
 * at full size and the photo at 0.9486 of it, both turned 9.31deg. A
 * different blob from the landing hero's, so it has its own wave.
 */
const NEIGHBORNETS_HERO_BLOB =
  "M1485.74 2510.72C789.144 2459.35 287.299 2016.26 91.8084 1353.46C12.91 1086.27 -62.2927 828.694 80.3525 562.061C347.535 62.7939 924.029 268.635 1371.18 198.605C1815.56 128.944 2333.67 -110.157 2846.78 59.8375C3312.41 214.126 3615.81 581.278 3797.44 1021.97C3908.86 1292.3 3975.01 1638.57 3822.94 1907.98C3640.2 2231.89 3143.53 2339.62 2802.07 2356.43C2358.98 2378.42 1941.58 2544.16 1485.74 2510.72Z";
/*
 * Placements in Figma page coordinates (the BG frame sits 47.76 above the
 * page top, as on the landing hero): each copy centred on its container's
 * centre, then turned.
 */
const NEIGHBORNETS_PALE_BLOB =
  "translate(610 -22.1015) rotate(9.31) translate(-1955.94 -1257.58)";
const NEIGHBORNETS_PHOTO_BLOB =
  "translate(620.5 -85.8115) rotate(9.31) scale(0.9486) translate(-1955.94 -1257.58)";

/**
 * The NeighborNets hero's bottom wave band, built as HeroWave is: clear
 * above the photo blob's edge (the hero shows through), the Landing Pale
 * band down to the pale blob's edge, and Warm Snow below. The edges span
 * Figma page y 1019-1212, so the band is y 1015-1215 at full width, scaled
 * with `--neighbornets-hero-wave-height`.
 */
export function NeighborNetsHeroWave({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden
      viewBox="0 1015 1440 200"
      preserveAspectRatio="none"
      className={cn(styles.waveNeighborNets, className)}
    >
      <defs>
        <mask
          id="neighbornets-hero-wave-photo"
          maskUnits="userSpaceOnUse"
          x="0"
          y="1015"
          width="1440"
          height="206"
        >
          <rect x="0" y="1015" width="1440" height="206" fill="white" />
          <path
            d={NEIGHBORNETS_HERO_BLOB}
            transform={NEIGHBORNETS_PHOTO_BLOB}
            fill="black"
          />
        </mask>
      </defs>
      <g mask="url(#neighbornets-hero-wave-photo)">
        {/* Runs a few units past the band so no hairline of the hero can
            show where the band meets the section below. */}
        <rect
          x="0"
          y="1015"
          width="1440"
          height="206"
          className="fill-brand-warm-snow"
        />
        <path
          d={NEIGHBORNETS_HERO_BLOB}
          transform={NEIGHBORNETS_PALE_BLOB}
          className="fill-landing-pale"
        />
      </g>
    </svg>
  );
}

/**
 * The Stories hero's blob (Figma 402:3972 and 402:4389; vendored as
 * design-assets/figma/stories/hero/shape.svg): one path, 4236 x 1993, the
 * pale band and the photo both at full size, the photo 109 units higher,
 * both flipped upright (Figma's 180deg turn with a mirror). A third blob,
 * so it has its own wave.
 */
const STORIES_HERO_BLOB =
  "M3768.55 1636.89C3625.15 1750.89 3457.41 1847.63 3277.19 1917.13C3122.13 1976.96 2935.77 2010.45 2760.66 1983.66C2589.65 1957.61 2449.11 1878.29 2285.25 1836.76C1729.66 1696.42 695.787 2086.5 78.6158 1359.62C-306.17 551.775 740.381 -135.816 2804.85 22.9846C3417.72 70.1634 4219 371.543 4235.57 821.751C4246.21 1108.25 4057.19 1407.39 3768.76 1636.89H3768.55Z";
/*
 * Placements in Figma page coordinates (the BG frame sits 47.76 above the
 * page top, as on the other heroes): each copy's box 1508 left of the page,
 * flipped vertically about its own height.
 */
const STORIES_PALE_BLOB = "translate(-1508 1168.04) scale(1 -1)";
const STORIES_PHOTO_BLOB = "translate(-1508 1058.94) scale(1 -1)";

/**
 * The Stories hero's bottom wave band, built as HeroWave is: clear above
 * the photo blob's edge (the hero shows through), the Landing Pale band down
 * to the pale blob's edge, and Warm Snow below. The edges span Figma page y
 * 1015-1168, so the band is y 1011-1171 at full width, scaled with
 * `--stories-hero-wave-height`.
 */
export function StoriesHeroWave({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden
      viewBox="0 1011 1440 160"
      preserveAspectRatio="none"
      className={cn(styles.waveStories, className)}
    >
      <defs>
        <mask
          id="stories-hero-wave-photo"
          maskUnits="userSpaceOnUse"
          x="0"
          y="1011"
          width="1440"
          height="166"
        >
          <rect x="0" y="1011" width="1440" height="166" fill="white" />
          <path
            d={STORIES_HERO_BLOB}
            transform={STORIES_PHOTO_BLOB}
            fill="black"
          />
        </mask>
      </defs>
      <g mask="url(#stories-hero-wave-photo)">
        {/* Runs a few units past the band so no hairline of the hero can
            show where the band meets the section below. */}
        <rect
          x="0"
          y="1011"
          width="1440"
          height="166"
          className="fill-brand-warm-snow"
        />
        <path
          d={STORIES_HERO_BLOB}
          transform={STORIES_PALE_BLOB}
          className="fill-landing-pale"
        />
      </g>
    </svg>
  );
}

/**
 * The About hero's blob (Figma 509:510 and 507:7; vendored as
 * design-assets/figma/about/hero/shape.svg): one path, 3840.75 x 2006.1,
 * the pale band at full size and the photo at 0.957 of it, both turned
 * 11.43deg (the landing hero's turn, but a different blob), so it has its
 * own wave.
 */
const ABOUT_HERO_BLOB =
  "M3840.6 1157.54C2796.59 1867.57 2395.39 1691.78 1612.63 1906.57C867.104 2089.32 -3.19301 2075.64 0.00880837 1386.23C20.8206 -403.146 3868.25 -439.586 3840.6 1157.54Z";
/*
 * Placements in Figma page coordinates (the BG frame sits 47.76 above the
 * page top, as on the other heroes): each copy centred on its rotated box's
 * centre, then turned.
 */
const ABOUT_PALE_BLOB =
  "translate(1209.524 279.088) rotate(11.43) translate(-1920.375 -1003.05)";
const ABOUT_PHOTO_BLOB =
  "translate(1218.06 236.84) rotate(11.43) scale(0.957026) translate(-1920.375 -1003.05)";

/**
 * The About hero's bottom wave band, built as HeroWave is: clear above the
 * photo blob's edge (the hero shows through), the Landing Pale band down to
 * the pale blob's edge, and Warm Snow below. The edges span Figma page y
 * 969-1111, so the band is y 965-1115 at full width, scaled with
 * `--about-hero-wave-height`.
 */
export function AboutHeroWave({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden
      viewBox="0 965 1440 150"
      preserveAspectRatio="none"
      className={cn(styles.waveAbout, className)}
    >
      <defs>
        <mask
          id="about-hero-wave-photo"
          maskUnits="userSpaceOnUse"
          x="0"
          y="965"
          width="1440"
          height="156"
        >
          <rect x="0" y="965" width="1440" height="156" fill="white" />
          <path d={ABOUT_HERO_BLOB} transform={ABOUT_PHOTO_BLOB} fill="black" />
        </mask>
      </defs>
      <g mask="url(#about-hero-wave-photo)">
        {/* Runs a few units past the band so no hairline of the hero can
            show where the band meets the section below. */}
        <rect
          x="0"
          y="965"
          width="1440"
          height="156"
          className="fill-brand-warm-snow"
        />
        <path
          d={ABOUT_HERO_BLOB}
          transform={ABOUT_PALE_BLOB}
          className="fill-landing-pale"
        />
      </g>
    </svg>
  );
}
