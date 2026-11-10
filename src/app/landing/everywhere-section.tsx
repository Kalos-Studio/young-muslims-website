import Image, { type StaticImageData } from "next/image";

import { HERO_BLOB, HERO_PHOTO_BLOB } from "@/components/site/hero-wave";
import { TextReveal } from "@/components/site/text-reveal";
import { textRevealUnit } from "@/components/site/text-reveal-unit";
import { MaterialIcon } from "@/components/ui/material-icon";
import { StandardButton } from "@/components/ui/standard-button";
import { cn } from "@/lib/utils";

import mapImage from "../../../design-assets/figma/landing-2026/everywhere/map.jpg";
import markerJade from "../../../design-assets/figma/landing-2026/everywhere/marker-jade.svg";
import markerRoyal from "../../../design-assets/figma/landing-2026/everywhere/marker-royal.svg";
import shapeBottomLeft from "../../../design-assets/figma/landing-2026/everywhere/shape-bottom-left.webp";
import shapeBottomRight from "../../../design-assets/figma/landing-2026/everywhere/shape-bottom-right.webp";
import shapeTopLeft from "../../../design-assets/figma/landing-2026/everywhere/shape-top-left.webp";
import shapeTopRight from "../../../design-assets/figma/landing-2026/everywhere/shape-top-right.webp";
import { MARKERS } from "./everywhere-markers";
import { EverywhereMotion } from "./everywhere-motion";
import styles from "./everywhere-section.module.css";

const REPORT_URL =
  "https://ymsite.com/wp-content/uploads/2026/02/YM-Annual-Report-2025-FINAL.pdf";

/*
 * The four shape-photos (each a tinted rim and a masked group photo,
 * composited by scripts/everywhere-assets.mjs). Desktop places them as in
 * Figma (73:164), anchored to the screen's corners; tablet (0.72x) and
 * mobile (0.6x) follow their frames' placements, bleeding off the sides.
 * `depth` scales each one's scroll and pointer drift.
 */
const SHAPES: {
  image: StaticImageData;
  depth: number;
  className: string;
}[] = [
  {
    image: shapeTopLeft,
    depth: 0.9,
    className:
      "top-93.75 -left-31.75 w-50 md:top-11 md:-left-23 md:w-60 xl:top-29.75 xl:left-24 xl:w-83",
  },
  {
    image: shapeTopRight,
    depth: 0.6,
    className:
      "top-47 -right-27.25 w-52 md:top-13 md:-right-25.75 md:w-62.5 xl:top-29 xl:right-25 xl:w-86.75",
  },
  {
    image: shapeBottomLeft,
    depth: 1,
    className:
      "bottom-28 -left-25.5 w-51.25 md:bottom-21.25 md:-left-24.5 md:w-61.5 xl:bottom-14.5 xl:left-18.5 xl:w-85.5",
  },
  {
    image: shapeBottomRight,
    depth: 0.75,
    className:
      "bottom-13.25 -right-17.25 w-46.75 md:bottom-14.5 md:-right-8 md:w-56 xl:bottom-6.25 xl:right-21.5 xl:w-77.75",
  },
];

/* On desktop the middle stat sits at Figma's unequal gaps (323 and 223). */
const STATS = [
  { number: "200", plus: true, label: "NeighborNets", className: "" },
  {
    number: "26",
    plus: false,
    label: "States",
    className: "xl:mr-55.75 xl:ml-80.75",
  },
  {
    number: "10,000s",
    plus: false,
    label: "Of young Muslims",
    className: "",
  },
] as const;

/**
 * The section's top edge: the hero blob's organic edge (Figma 27:253, as in
 * HeroWave) pressed into a shallow band, so the hand-off from the dark
 * principles section above is a gentle curve rather than a sweep. Warm Snow
 * below the edge, transparent above it (the section above shows through).
 * The edge spans y 986-1083 of the hero band across 1440 units.
 */
function EverywhereWave() {
  return (
    <svg
      aria-hidden
      viewBox="0 984 1440 101"
      preserveAspectRatio="none"
      className={cn(styles.wave, "absolute inset-x-0 bottom-full")}
    >
      <defs>
        <mask
          id="everywhere-wave-edge"
          maskUnits="userSpaceOnUse"
          x="0"
          y="984"
          width="1440"
          height="105"
        >
          <rect x="0" y="984" width="1440" height="105" fill="white" />
          <path d={HERO_BLOB} transform={HERO_PHOTO_BLOB} fill="black" />
        </mask>
      </defs>
      {/* Runs a few units past the band so no hairline of the section above
          shows where it meets this one. */}
      <rect
        x="0"
        y="984"
        width="1440"
        height="105"
        mask="url(#everywhere-wave-edge)"
        className="fill-brand-warm-snow"
      />
    </svg>
  );
}

/**
 * The landing page's "everywhere" impact section (Figma 73:164; the tablet
 * 279:437 and mobile 296:1237 frames' layouts, with the desktop content).
 *
 * The heading and subline, three stats (200+ NeighborNets, 26 States,
 * 10,000s of young Muslims; a row from tablet, a column on mobile), a static
 * map of the US on the globe with 85 NeighborNet markers (Royal for
 * brothers, Jade for sisters) fading into Warm Snow, four shape-photos round
 * the edges, and a closing line with "See our impact", which opens the
 * annual report. Its top edge is a subtle wave over the principles section.
 *
 * Motion (EverywhereMotion): the shapes grow and fade in, drift with scroll
 * and, with a fine pointer, towards the cursor; the stats rise in one by
 * one; the map fades and grows in, then the markers pin on left to right.
 * Under reduced motion everything is simply in place. The DOM is the same
 * either way, so the server and client agree.
 *
 * Vertical rhythm (heading top / stats / map / closing / foot): mobile
 * 41 / 250 (three, 68 apart) / 705 / 1016 / 296 under the button; tablet
 * 151 / 358 / 467 / 1161 / 269; desktop 232 / 533 / 702 / 1477 (over the
 * map's fade) / 55: Figma's frames, 1663px tall on desktop.
 */
export function EverywhereSection() {
  return (
    <EverywhereMotion
      aria-labelledby="everywhere-heading"
      className="relative z-10 overflow-x-clip bg-brand-warm-snow"
    >
      <EverywhereWave />

      <div className="relative mx-auto flex max-w-360 flex-col items-center px-8 pt-10.25 pb-74 text-center text-brand-obsidian md:px-16 md:pt-37.75 md:pb-67.25 xl:px-20 xl:pt-58 xl:pb-13.75">
        <TextReveal className="w-full md:max-w-110">
          <h2
            id="everywhere-heading"
            className="text-mobile-section font-extrabold md:text-landing-section"
          >
            And it&apos;s not just here. It&apos;s{" "}
            <span className="text-landing-cyan">everywhere</span>.
          </h2>
          <p className="mt-4 text-body font-medium md:text-landing-copy">
            What started as a few friends in one city is now a network that
            spans the country.
          </p>
        </TextReveal>

        <ul className="mt-20.75 flex flex-col items-center gap-17 md:mt-11.75 md:w-full md:flex-row md:items-start md:justify-between md:gap-0 xl:mt-35.25 xl:w-auto xl:justify-center">
          {STATS.map((stat) => (
            <li
              key={stat.label}
              data-everywhere="stat"
              className={cn("flex flex-col items-center", stat.className)}
            >
              <span className="flex items-center font-display text-mobile-display text-brand-royal xl:text-stat">
                {stat.number}
                {stat.plus ? (
                  <>
                    {/* A "+" in Boldonse below xl; Figma's add icon from it
                        (the "+" stays for screen readers). */}
                    <span className="xl:sr-only">+</span>
                    <span aria-hidden className="hidden xl:block">
                      <MaterialIcon name="add" size={60} />
                    </span>
                  </>
                ) : null}
              </span>
              <span className="text-body font-semibold xl:text-lead">
                {stat.label}
              </span>
            </li>
          ))}
        </ul>

        <div
          data-everywhere="map"
          className={cn("relative mt-17.25 md:mt-6.5 xl:mt-9", styles.map)}
        >
          <Image
            src={mapImage}
            alt="Map of the United States marking Young Muslims NeighborNets across 26 states, coast to coast."
            fill
            sizes="(width >= 80rem) 1440px, (width >= 48rem) 1211px, 488px"
            className="object-cover"
          />
          <div aria-hidden="true">
            {MARKERS.map((marker, index) => (
              <span
                key={index}
                data-everywhere="marker"
                className={cn(styles.marker, marker.position)}
              >
                <Image
                  src={marker.kind === "royal" ? markerRoyal : markerJade}
                  alt=""
                  className="block size-full"
                />
              </span>
            ))}
          </div>
          {/* Figma's fade into Warm Snow, over the map and its markers. */}
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-linear-to-b from-transparent from-60% to-brand-warm-snow"
          />
        </div>

        <TextReveal className="relative mt-10.5 flex w-full flex-col items-center md:mt-6.5 md:max-w-140 xl:-mt-5">
          <p className="text-body font-medium md:text-landing-copy">
            Wherever you go, there&apos;s a Young Muslim. A brother or sister in
            a city you&apos;ve never been to, dealing with the same things you
            are.
          </p>
          <StandardButton
            href={REPORT_URL}
            label="See our impact"
            target="_blank"
            rel="noopener noreferrer"
            {...textRevealUnit}
            className="mt-8"
          />
        </TextReveal>
      </div>

      {/* The shape-photos, above the map's fade, as in Figma. */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        {SHAPES.map((shape, index) => (
          <div
            key={index}
            data-everywhere="shape"
            data-depth={shape.depth}
            className={cn("absolute", styles.parallax, shape.className)}
          >
            <div data-everywhere="shape-pointer" className={styles.pointer}>
              <Image
                data-everywhere="shape-art"
                src={shape.image}
                alt=""
                sizes="(width >= 80rem) 350px, 260px"
                className="h-auto w-full"
              />
            </div>
          </div>
        ))}
      </div>
    </EverywhereMotion>
  );
}
