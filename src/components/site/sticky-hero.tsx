import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

import {
  AboutHeroWave,
  HeroWave,
  NeighborNetsHeroWave,
  StoriesHeroWave,
  SupportHeroWave,
} from "./hero-wave";
import { StickyHeroCover } from "./sticky-hero-cover";
import { StickyHeroFit } from "./sticky-hero-fit";
import { StickyHeroTint } from "./sticky-hero-tint";
import styles from "./sticky-hero.module.css";

/** Classes for hero media (a video or image) so it covers the hero. */
export const stickyHeroMediaClassName =
  "absolute inset-0 size-full object-cover";

/**
 * The site's hero pattern. The hero is a panel 85% of the viewport tall
 * (`--sticky-hero-height`, so a sliver of the next section shows under it
 * at load; `fullHeight` for the full viewport, the landing's and the
 * Store's) that stays pinned at the top while the rest of the page scrolls
 * up over it: the page slides over the hero, and the hero never moves.
 *
 * Pass the page's remaining content as children. The shell wraps it so it
 * sits above the hero and begins with the bottom wave (HeroWave), whose top
 * hump peeks above the fold at load. As the page scrolls, the wave rises
 * over the pinned hero like a mask line.
 *
 * It uses `position: sticky`, not `fixed`: the footer Easter egg transforms
 * the page wrapper, which would make a fixed element move with it, and a
 * sticky hero keeps its height in the layout so no spacer is needed. Scrolling
 * is native, so Lenis needs nothing special.
 *
 * A short hero (the default; not `fullHeight`) is finished for being in
 * view whole: the content after it rises by its wave's `--*-hero-rise`
 * (not the peek), so the wave's clear part always lies over the photo and
 * the hero's foot never shows as a cut edge; and the hero dims as the page
 * covers it (StickyHeroTint, up to `--sticky-hero-tint-max`). Every hero's
 * wave, full height or short, drifts as it scrolls past (HeroWaveBand).
 *
 * Once the page has scrolled past the hero's wave, the hero is fully covered:
 * StickyHeroCover hides it and pauses its videos until it comes back, so it
 * costs nothing while the rest of the page scrolls.
 *
 * The header scrim is driven by an invisible marker the hero's height that scrolls
 * normally and carries `data-header-hero`; the pinned hero itself is always in
 * view, so it cannot be the sentinel.
 */
export function StickyHero({
  label,
  media,
  overlay,
  wave = "landing",
  holdThroughFooter = false,
  fit = false,
  fullHeight = false,
  children,
}: {
  /** Accessible name for the hero region. */
  label: string;
  /** Full-bleed media; give it `stickyHeroMediaClassName`. */
  media: ReactNode;
  /** Content centred over the media, such as the page title. */
  overlay?: ReactNode;
  /**
   * The bottom wave: the landing hero's blob (default), the NeighborNets
   * hero's, the Stories hero's or the About hero's, each with its own band
   * height and peek; or `"none"`, when the content after the hero brings its
   * own wavy top (the Store page's closing CTA): it follows the hero
   * directly, with nothing peeking at load.
   */
  wave?: "landing" | "neighbornets" | "stories" | "about" | "support" | "none";
  /**
   * Keep the hero pinned while the footer scrolls up too, for a page whose
   * content after the hero is shorter than the viewport (the Store page):
   * otherwise the hero is released, part of it still showing, as soon as
   * that content ends.
   */
  holdThroughFooter?: boolean;
  /**
   * For a hero whose overlay is too tall for some viewports (the Support
   * page's, which holds the donation form): the hero is at least the hero
   * height (`--sticky-hero-height`) tall, grows to its overlay, and is pinned by its foot (StickyHeroFit):
   * at the top when it fits, as every other hero; taller, it scrolls until
   * its foot reaches the viewport's foot and pins there, so nothing in it
   * is ever cut off and the page still rises over it. The header's scrim
   * marker takes the hero's height.
   */
  fit?: boolean;
  /**
   * The full viewport (100dvh) instead of the shorter default
   * (`--sticky-hero-height`, 85dvh): for the landing's video hero and the
   * Store's split, which fill the screen by design.
   */
  fullHeight?: boolean;
  /** The rest of the page. */
  children: ReactNode;
}) {
  return (
    <div
      data-sticky-hero-root
      className={cn(
        "relative isolate",
        holdThroughFooter && styles.holdThroughFooter,
      )}
    >
      <div
        data-header-hero
        aria-hidden
        className={cn(
          "pointer-events-none absolute inset-x-0 top-0",
          fullHeight ? "h-dvh" : styles.height,
        )}
      />
      <section
        aria-label={label}
        data-sticky-hero
        className={cn(
          "z-0 w-full overflow-hidden bg-brand-obsidian data-covered:invisible",
          fit
            ? cn(styles.fit, fullHeight && "min-h-dvh")
            : cn("sticky top-0", fullHeight ? "h-dvh" : styles.height),
        )}
      >
        {fit ? <StickyHeroFit /> : null}
        {media}
        {overlay ? (
          <div
            className={cn(
              "relative flex items-center justify-center",
              fit ? (fullHeight ? "min-h-dvh" : styles.fitOverlay) : "h-full",
            )}
          >
            {overlay}
          </div>
        ) : null}
        {fullHeight ? null : (
          <StickyHeroTint
            className={cn(
              "pointer-events-none absolute inset-0 bg-brand-obsidian",
              styles.tint,
            )}
          />
        )}
      </section>
      <div
        className={cn(
          styles.following,
          wave === "neighbornets" && styles.followingNeighborNets,
          wave === "stories" && styles.followingStories,
          wave === "about" && styles.followingAbout,
          wave === "support" && styles.followingSupport,
          wave === "none" && styles.followingFlush,
          !fullHeight &&
            {
              landing: styles.riseLanding,
              neighbornets: styles.riseNeighborNets,
              stories: styles.riseStories,
              about: styles.riseAbout,
              support: styles.riseSupport,
              none: undefined,
            }[wave],
        )}
      >
        {wave === "none" ? null : wave === "neighbornets" ? (
          <NeighborNetsHeroWave />
        ) : wave === "stories" ? (
          <StoriesHeroWave />
        ) : wave === "about" ? (
          <AboutHeroWave />
        ) : wave === "support" ? (
          <SupportHeroWave />
        ) : (
          <HeroWave />
        )}
        {/* The cover sentinel goes after the hero's wave, where the content
            is opaque. With no wave, the content's own top is clear above its
            wavy edge (ClosingCta's overHero), so the hero still shows there
            after that top has passed: the sentinel goes after the content,
            so the hero is hidden only once it has all scrolled past. */}
        {wave === "none" ? null : <StickyHeroCover />}
        {children}
        {wave === "none" ? <StickyHeroCover /> : null}
      </div>
    </div>
  );
}
