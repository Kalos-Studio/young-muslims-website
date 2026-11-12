import { getImageProps } from "next/image";
import type { ReactNode } from "react";

import { GrainFilter } from "@/components/site/grain-filter";
import {
  StickyHero,
  stickyHeroMediaClassName,
} from "@/components/site/sticky-hero";
import { cn } from "@/lib/utils";

import heroDesktop from "../../../design-assets/figma/about/hero/hero-desktop.jpg";
import heroMobile from "../../../design-assets/figma/about/hero/hero-mobile.jpg";
import heroTablet from "../../../design-assets/figma/about/hero/hero-tablet.jpg";
import styles from "./about-hero.module.css";

const ALT =
  "A large group of Young Muslims brothers holding up red and blue YM flags";

/**
 * The photo, art-directed: each frame's crop of the group with the YM flags
 * (scripts/about-hero-assets.mjs), desktop from `xl`, tablet from `md`,
 * mobile below. It covers the hero and carries the site's film grain.
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
 * The About ("Who we are") hero (Figma 507:3, tablet 595:1782, mobile
 * 596:2493): the site's sticky shell (StickyHero) with a photo, built as the
 * Stories and NeighborNets heroes are. The group with the YM flags fills the
 * viewport under the site's film grain and the light Obsidian tint, with
 * "ROOTED LOCALLY. GROWING TOGETHER." and its subline centred over them.
 * The rest of the page scrolls up over the pinned hero behind this page's
 * own wave (AboutHeroWave), and the header scrim follows StickyHero's
 * `data-header-hero` marker.
 */
export function AboutHero({ children }: { children: ReactNode }) {
  return (
    <StickyHero
      label="Rooted locally, growing together"
      wave="about"
      media={
        <>
          <GrainFilter id="about-hero-grain" />
          <HeroPhoto />
          {/* A light Obsidian tint keeps the white title legible over the
              busy photo, as on the other heroes. */}
          <div aria-hidden className="absolute inset-0 bg-brand-obsidian/25" />
        </>
      }
      overlay={
        <div className="mx-auto flex w-full max-w-360 flex-col items-center gap-3 px-8 text-center text-brand-pure-white md:px-16 xl:gap-4 xl:px-20">
          <h1
            id="about-title"
            className="font-display text-mobile-display text-balance xl:text-landing-display short:text-mobile-display"
          >
            ROOTED LOCALLY. <br className="max-md:hidden" />
            GROWING TOGETHER.
          </h1>
          <p className="max-w-122.5 text-nav font-semibold text-balance md:text-body xl:max-w-182 xl:text-landing-hero-subtitle">
            Young Muslims begins with a local circle of friends and grows into a
            national network of young Muslims learning their Deen, serving their
            communities, and taking part in the broader Islamic movement.
          </p>
        </div>
      }
    >
      {children}
    </StickyHero>
  );
}
