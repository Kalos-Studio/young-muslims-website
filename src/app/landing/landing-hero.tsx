import type { ReactNode } from "react";

import {
  StickyHero,
  stickyHeroMediaClassName,
} from "@/components/site/sticky-hero";

/**
 * The landing hero (Figma 26:195): the hero video with "FOR THE YOUTH. BY
 * THE YOUTH." and its subline centred over it. The rest of the landing page
 * is passed as children and scrolls up over the pinned hero.
 *
 * The video is encoded from the 4K master per
 * design-assets/video-source/README.md: 1280px for phones, 1920px otherwise,
 * with the first frame as the poster.
 */
export function LandingHero({ children }: { children: ReactNode }) {
  return (
    <StickyHero
      label="Young Muslims community introduction"
      media={
        <>
          <video
            aria-hidden="true"
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            poster="/videos/young-muslims-hero-poster.webp"
            tabIndex={-1}
            className={stickyHeroMediaClassName}
          >
            <source
              media="(max-width: 767px)"
              src="/videos/young-muslims-hero-mobile.mp4"
              type="video/mp4"
            />
            <source
              src="/videos/young-muslims-hero-desktop.mp4"
              type="video/mp4"
            />
          </video>
          {/* A light Obsidian tint keeps the white title legible over
              bright footage. */}
          <div aria-hidden className="absolute inset-0 bg-brand-obsidian/25" />
        </>
      }
      overlay={
        <div className="mx-auto flex w-full max-w-360 flex-col items-center gap-3 px-8 text-center text-brand-pure-white md:gap-4 md:px-16 xl:px-20">
          <h1 className="font-display text-mobile-display text-balance md:text-landing-display">
            FOR THE YOUTH. BY THE YOUTH.
          </h1>
          <p className="max-w-3xl text-nav font-semibold text-balance md:text-landing-hero-subtitle">
            A nationwide brotherhood and sisterhood, built on real friendships
            and a shared Deen.
          </p>
        </div>
      }
    >
      {children}
    </StickyHero>
  );
}
