import { getImageProps } from "next/image";
import type { ReactNode } from "react";

import { GrainFilter } from "@/components/site/grain-filter";
import {
  StickyHero,
  stickyHeroMediaClassName,
} from "@/components/site/sticky-hero";
import { cn } from "@/lib/utils";

import heroDesktop from "../../../design-assets/figma/neighbornets/hero/hero-desktop.jpg";
import heroMobile from "../../../design-assets/figma/neighbornets/hero/hero-mobile.jpg";
import heroTablet from "../../../design-assets/figma/neighbornets/hero/hero-tablet.jpg";
import styles from "./neighbornets-hero.module.css";

const ALT =
  "Young Muslims brothers gathered on a sports field, smiling at the camera";

/**
 * The photo, art-directed: each frame's crop of the group on the field
 * (scripts/neighbornets-hero-assets.mjs), desktop from `xl`, tablet from
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
 * The NeighborNets ("Find a Chapter") hero (Figma 301:2068, tablet 374:247,
 * mobile 401:1230): the landing hero's sticky shell (StickyHero) with a
 * photo instead of a video. The group on the field fills the viewport under
 * the site's film grain and the landing hero's light Obsidian tint, with
 * "FIND YOUR NEIGHBORNET" and its subline centred over it. The rest of the
 * page scrolls up over the pinned hero behind this page's own wave (its own
 * blob, NeighborNetsHeroWave), and the header scrim follows StickyHero's
 * `data-header-hero` marker.
 */
export function NeighborNetsHero({ children }: { children: ReactNode }) {
  return (
    <StickyHero
      label="Find your NeighborNet"
      wave="neighbornets"
      media={
        <>
          <GrainFilter id="neighbornets-hero-grain" />
          <HeroPhoto />
          {/* A light Obsidian tint keeps the white title legible over the
              bright field, as on the landing hero. */}
          <div aria-hidden className="absolute inset-0 bg-brand-obsidian/25" />
        </>
      }
      overlay={
        <div className="mx-auto flex w-full max-w-360 flex-col items-center gap-3 px-8 text-center text-brand-pure-white md:px-16 xl:gap-4 xl:px-20">
          <h1 className="font-display text-mobile-display text-balance xl:text-landing-display short:text-mobile-display">
            FIND YOUR NEIGHBORNET
          </h1>
          <p className="max-w-3xl text-nav font-semibold text-balance md:text-body xl:text-landing-hero-subtitle">
            There&rsquo;s one near you, meeting every week. Find it, walk in,
            and you&rsquo;re in. That&rsquo;s really all it takes.
          </p>
        </div>
      }
    >
      {children}
    </StickyHero>
  );
}
