import { getImageProps } from "next/image";
import type { ReactNode } from "react";

import { GrainFilter } from "@/components/site/grain-filter";
import {
  StickyHero,
  stickyHeroMediaClassName,
} from "@/components/site/sticky-hero";
import { cn } from "@/lib/utils";

import heroDesktop from "../../../design-assets/figma/stories/hero/hero-desktop.jpg";
import heroMobile from "../../../design-assets/figma/stories/hero/hero-mobile.jpg";
import heroTablet from "../../../design-assets/figma/stories/hero/hero-tablet.jpg";
import styles from "./stories-hero.module.css";

const ALT =
  "Young Muslims sisters at a Young Muslims booth, two holding up the letters YM";

/**
 * The photo, art-directed: each frame's crop of the sisters with the YM
 * letters (scripts/stories-hero-assets.mjs), desktop from `xl`, tablet from
 * `md`, mobile below. It covers the hero and carries the site's film grain.
 */
function HeroPhoto() {
  const common = { alt: ALT, sizes: "100vw", loading: "eager" as const };
  const {
    props: { srcSet: desktop },
  } = getImageProps({ ...common, src: heroDesktop });
  const {
    props: { srcSet: tablet },
  } = getImageProps({ ...common, src: heroTablet });
  const {
    props: { srcSet: mobile, ...img },
  } = getImageProps({ ...common, src: heroMobile });
  return (
    <picture>
      <source media="(width >= 80rem)" srcSet={desktop} />
      <source media="(width >= 48rem)" srcSet={tablet} />
      <source srcSet={mobile} />
      <img
        {...img}
        alt={ALT}
        fetchPriority="high"
        className={cn(stickyHeroMediaClassName, styles.grain)}
      />
    </picture>
  );
}

/**
 * The Stories hero (Figma 401:3520, tablet 414:316, mobile 414:791): the
 * landing hero's sticky shell (StickyHero) with a photo, as the NeighborNets
 * hero. The sisters with the YM letters fill the viewport under the site's
 * film grain and the light Obsidian tint, with "THIS IS YOUNG MUSLIMS" and
 * its subline centred over them. The rest of the page scrolls up over the
 * pinned hero behind this page's own wave (StoriesHeroWave), and the header
 * scrim follows StickyHero's `data-header-hero` marker.
 */
export function StoriesHero({ children }: { children: ReactNode }) {
  return (
    <StickyHero
      label="This is Young Muslims"
      wave="stories"
      media={
        <>
          <GrainFilter id="stories-hero-grain" />
          <HeroPhoto />
          {/* A light Obsidian tint keeps the white title legible over the
              busy, colourful photo, as on the other heroes. */}
          <div aria-hidden className="absolute inset-0 bg-brand-obsidian/25" />
        </>
      }
      overlay={
        <div className="mx-auto flex w-full max-w-360 flex-col items-center gap-3 px-8 text-center text-brand-pure-white md:px-16 xl:gap-4 xl:px-20">
          <h1
            id="stories-title"
            className="font-display text-mobile-display text-balance xl:text-landing-display short:text-mobile-display"
          >
            THIS IS YOUNG MUSLIMS
          </h1>
          <p className="max-w-3xl text-nav font-semibold text-balance md:text-body xl:text-landing-hero-subtitle">
            Real brothers and sisters, real stories.
          </p>
        </div>
      }
    >
      {children}
    </StickyHero>
  );
}
