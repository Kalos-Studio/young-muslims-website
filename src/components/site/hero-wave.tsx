import { cn } from "@/lib/utils";

import { HeroWaveDrift } from "./hero-wave-drift";
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
 * the hero, and its Warm Snow drifts as it scrolls past (HeroWaveBand).
 */
export function HeroWave({ className }: { className?: string }) {
  return (
    <HeroWaveBand
      id="landing"
      viewBox={[0, 986, 1440, 244]}
      photo={{ d: HERO_BLOB, transform: HERO_PHOTO_BLOB }}
      pale={{ d: HERO_BLOB, transform: PALE_BLOB }}
      className={cn(styles.wave, className)}
    />
  );
}

/** A blob placed in a wave band's Figma page coordinates. */
type Blob = { d: string; transform: string };

/*
 * A hero's wave front overhangs its band by this share of the band's
 * height (the band clips it): more than `--hero-wave-drift-share` (0.24),
 * the most it rises, so its foot never lifts off the band's foot, even with
 * sub-pixel rounding on dense screens.
 */
const FRONT_OVERHANG = 0.3;

/**
 * A hero's bottom wave band (Figma page coordinates `viewBox`, stretched to
 * the band's box): clear above the photo blob's edge, so the hero shows
 * through; a pale band down to the pale blob's edge; Warm Snow below. It
 * moves with the content after the hero, so it cannot misalign with it.
 *
 * Figma's colours in two layers, so the band drifts: the Landing Pale below
 * the photo's edge (static, moving with the page) and the Warm Snow below
 * the pale edge (HeroWaveDrift: a composited, paint-contained layer that
 * rises from its Figma place and settles back to it by the end of the
 * hand-off, so the pale band breathes). It never sinks below its place, so
 * the pale shape never reaches the band's foot (where the clip would cut
 * it flat against the section's background); it overhangs the band's foot
 * by more than it rises (FRONT_OVERHANG, clipped by the band), so no seam
 * opens there; and it rises less than the band's thinnest point (38% of
 * its height or more on every hero), so Warm Snow never crosses onto the
 * photo. Every hero's wave is built so, full height (the landing's) or
 * short.
 */
function HeroWaveBand({
  id,
  viewBox: [x, y, width, height],
  photo,
  pale,
  className,
}: {
  id: string;
  viewBox: [number, number, number, number];
  photo: Blob;
  pale: Blob;
  className: string;
}) {
  // Each fill runs a few units past the band so no hairline of the hero
  // can show where the band meets the section below.
  const fillHeight = height + 6;
  const frontHeight = height * (1 + FRONT_OVERHANG);
  return (
    <div aria-hidden className={cn(className, styles.waveBand)}>
      <svg
        viewBox={`${x} ${y} ${width} ${height}`}
        preserveAspectRatio="none"
        className={styles.waveBack}
      >
        <defs>
          <mask
            id={`${id}-hero-wave-photo`}
            maskUnits="userSpaceOnUse"
            x={x}
            y={y}
            width={width}
            height={fillHeight}
          >
            <rect x={x} y={y} width={width} height={fillHeight} fill="white" />
            <path d={photo.d} transform={photo.transform} fill="black" />
          </mask>
        </defs>
        <rect
          x={x}
          y={y}
          width={width}
          height={fillHeight}
          mask={`url(#${id}-hero-wave-photo)`}
          className="fill-landing-pale"
        />
      </svg>
      <HeroWaveDrift className={styles.waveFront}>
        <svg
          viewBox={`${x} ${y} ${width} ${frontHeight}`}
          preserveAspectRatio="none"
          className={styles.waveFrontArt}
        >
          <defs>
            <mask
              id={`${id}-hero-wave-pale`}
              maskUnits="userSpaceOnUse"
              x={x}
              y={y}
              width={width}
              height={frontHeight + 6}
            >
              <rect
                x={x}
                y={y}
                width={width}
                height={frontHeight + 6}
                fill="white"
              />
              <path d={pale.d} transform={pale.transform} fill="black" />
            </mask>
          </defs>
          <rect
            x={x}
            y={y}
            width={width}
            height={frontHeight + 6}
            mask={`url(#${id}-hero-wave-pale)`}
            className="fill-brand-warm-snow"
          />
        </svg>
      </HeroWaveDrift>
    </div>
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
 * It drifts as HeroWaveBand's do.
 */
export function NeighborNetsHeroWave({ className }: { className?: string }) {
  return (
    <HeroWaveBand
      id="neighbornets"
      viewBox={[0, 1015, 1440, 200]}
      photo={{ d: NEIGHBORNETS_HERO_BLOB, transform: NEIGHBORNETS_PHOTO_BLOB }}
      pale={{ d: NEIGHBORNETS_HERO_BLOB, transform: NEIGHBORNETS_PALE_BLOB }}
      className={cn(styles.waveNeighborNets, className)}
    />
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
 * It drifts as HeroWaveBand's do.
 */
export function StoriesHeroWave({ className }: { className?: string }) {
  return (
    <HeroWaveBand
      id="stories"
      viewBox={[0, 1011, 1440, 160]}
      photo={{ d: STORIES_HERO_BLOB, transform: STORIES_PHOTO_BLOB }}
      pale={{ d: STORIES_HERO_BLOB, transform: STORIES_PALE_BLOB }}
      className={cn(styles.waveStories, className)}
    />
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
 * It drifts as HeroWaveBand's do.
 */
export function AboutHeroWave({ className }: { className?: string }) {
  return (
    <HeroWaveBand
      id="about"
      viewBox={[0, 965, 1440, 150]}
      photo={{ d: ABOUT_HERO_BLOB, transform: ABOUT_PHOTO_BLOB }}
      pale={{ d: ABOUT_HERO_BLOB, transform: ABOUT_PALE_BLOB }}
      className={cn(styles.waveAbout, className)}
    />
  );
}

/**
 * The Support hero's two blobs (Figma 442:1750, the pale band, and 442:1752,
 * the photo): two paths, not one scaled, each in the hero's BG frame (1440
 * x 1024, its foot the hero's) as Figma places it, turned 0.265deg.
 */
const SUPPORT_PALE_BLOB_PATH =
  "M3256.7 277.086C2875.149 330.317 2558.481 153.325 2171.031 74.677C-288.832 -424.893 -623.701 1745.452 990.478 1749.445C1118.055 1735.871 1221.87 1730.148 1330.572 1702.468C1561.289 1643.516 1810.882 1648.839 2037.049 1717.773C2147.605 1751.441 2250.914 1783.912 2314.112 1801.877C4885.036 2531.269 5757.516 -71.973 3256.7 277.219V277.086Z";
const SUPPORT_PHOTO_BLOB_PATH =
  "M3098.645 263.639C2735.611 314.286 2434.312 145.884 2065.665 71.052C-274.815 -404.272 -593.432 1660.742 942.408 1664.54C1063.793 1651.625 1162.57 1646.18 1265.996 1619.844C1485.516 1563.752 1722.996 1568.817 1938.186 1634.405C2043.376 1666.439 2141.672 1697.334 2201.803 1714.428C4647.954 2408.421 5478.09 -68.48 3098.645 263.765V263.639Z";
const SUPPORT_TURN = "0.99998933 0.00462293 -0.00462293 0.99998933";
const SUPPORT_PALE_BLOB = `matrix(${SUPPORT_TURN} -2460.071 -737.238)`;
const SUPPORT_PHOTO_BLOB = `matrix(${SUPPORT_TURN} -2344.879 -736.706)`;

/**
 * The Support hero's bottom wave band, built as HeroWave is: clear above
 * the photo blob's edge (the hero shows through), the Landing Pale band down
 * to the pale blob's edge, and Warm Snow below. The photo's edge runs from
 * BG y 984 (at the right) to 1115 (mid-width) and the pale band's from 1099
 * to 1209, so the band is y 980-1213 at full width, scaled with
 * `--support-hero-wave-height`; it peeks 44 units above the hero's foot
 * (`--support-hero-peek`).
 * It drifts as HeroWaveBand's do.
 */
export function SupportHeroWave({ className }: { className?: string }) {
  return (
    <HeroWaveBand
      id="support"
      viewBox={[0, 980, 1440, 233]}
      photo={{ d: SUPPORT_PHOTO_BLOB_PATH, transform: SUPPORT_PHOTO_BLOB }}
      pale={{ d: SUPPORT_PALE_BLOB_PATH, transform: SUPPORT_PALE_BLOB }}
      className={cn(styles.waveSupport, className)}
    />
  );
}
