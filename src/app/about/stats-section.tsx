import { getImageProps } from "next/image";

import { GrainFilter } from "@/components/site/grain-filter";
import { ScrollDrift } from "@/components/site/scroll-drift";
import { TextReveal } from "@/components/site/text-reveal";
import { MaterialIcon } from "@/components/ui/material-icon";
import { cn } from "@/lib/utils";

import celebrationDesktop from "../../../design-assets/figma/about/stats/celebration-desktop.jpg";
import celebrationMobile from "../../../design-assets/figma/about/stats/celebration-mobile.jpg";
import celebrationTablet from "../../../design-assets/figma/about/stats/celebration-tablet.jpg";
import { StatsEntrance } from "./stats-entrance";
import styles from "./stats-section.module.css";

/* Verbatim; `plus` adds Figma's "+" (Material Symbols "add"). */
const METRICS = [
  { value: "200", plus: true, label: "NeighborNets" },
  { value: "26", plus: false, label: "States" },
  { value: "10,000", plus: true, label: "Youth served" },
  { value: "30", plus: true, label: "Years" },
] as const;

/**
 * The photo, art-directed (scripts/about-stats-assets.mjs): each frame's
 * crop, black and white with Figma's contrast, at the drifting layer's
 * shape; desktop from `xl`, tablet from `md`, mobile below.
 */
function StatsPhoto() {
  const common = {
    alt: "Young Muslims brothers lifting one of their own into the air in celebration",
    sizes: "100vw",
  };
  const {
    props: { srcSet: desktop },
  } = getImageProps({ ...common, src: celebrationDesktop });
  const {
    props: { srcSet: tablet },
  } = getImageProps({ ...common, src: celebrationTablet });
  const {
    props: { srcSet: mobile, ...img },
  } = getImageProps({ ...common, src: celebrationMobile });
  return (
    <picture>
      <source media="(width >= 80rem)" srcSet={desktop} />
      <source media="(width >= 48rem)" srcSet={tablet} />
      <source srcSet={mobile} />
      <img
        {...img}
        alt={common.alt}
        className={cn("absolute inset-0 size-full object-cover", styles.grain)}
      />
    </picture>
  );
}

/**
 * The About page's stats, under the leadership section (Figma 534:2641,
 * tablet 595:2037, mobile 596:2700; DESIGN-SYSTEM.md, "About stats"): a
 * full-bleed black-and-white photo under a 48% Obsidian scrim, drifting
 * with the scroll (ScrollDrift, as the closing CTA's photo), and, in a
 * column from 936 / 410 / 32 of the frame, "Three decades. One movement."
 * (TextReveal) over four metrics. The metrics enter one after another,
 * growing and sliding in from the right as they fade in (StatsEntrance).
 *
 * Vertical rhythm (top / heading to metrics / between metrics / foot),
 * Figma's own: mobile 117 / 58 / 53 / 96, tablet 117 / 84 / 51 / 120,
 * desktop 117 / 74 / 40 / 85 (a 958 / 1024 / 1024 section).
 */
export function StatsSection() {
  return (
    <section
      aria-labelledby="about-stats-heading"
      className="relative overflow-hidden bg-brand-obsidian text-brand-warm-snow"
    >
      <GrainFilter id="about-stats-grain" />
      <ScrollDrift
        token="--about-stats-drift"
        fallback={96}
        className={styles.photo}
      >
        <StatsPhoto />
      </ScrollDrift>
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-about-stats-scrim"
      />
      <div className="relative mx-auto max-w-360 px-8 pt-29.25 pb-24 md:px-0 md:pb-30 md:pl-102.5 xl:pb-21.25 xl:pl-234">
        <TextReveal>
          <h2
            id="about-stats-heading"
            className="max-w-62.5 text-mobile-section font-extrabold md:max-w-75 md:text-landing-section xl:max-w-82"
          >
            Three decades. One movement.
          </h2>
        </TextReveal>
        <StatsEntrance className="mt-14.5 flex flex-col items-start gap-13.25 md:mt-21 md:gap-12.75 xl:mt-18.5 xl:gap-10">
          {METRICS.map((metric) => (
            <li key={metric.label} className="origin-left">
              <p className="flex items-center font-display text-landing-stat xl:text-stat">
                {metric.value}
                {metric.plus && (
                  <>
                    <MaterialIcon aria-hidden="true" name="add" size={60} />
                    <span className="sr-only">+</span>
                  </>
                )}
              </p>
              <p className="text-article-title font-semibold md:text-landing-copy xl:text-landing-stat-label">
                {metric.label}
              </p>
            </li>
          ))}
        </StatsEntrance>
      </div>
    </section>
  );
}
