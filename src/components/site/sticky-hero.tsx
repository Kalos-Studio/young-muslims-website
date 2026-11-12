import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

import {
  AboutHeroWave,
  HeroWave,
  NeighborNetsHeroWave,
  StoriesHeroWave,
} from "./hero-wave";
import { StickyHeroCover } from "./sticky-hero-cover";
import styles from "./sticky-hero.module.css";

/** Classes for hero media (a video or image) so it covers the hero. */
export const stickyHeroMediaClassName =
  "absolute inset-0 size-full object-cover";

/**
 * The site's hero pattern. The hero is a full-viewport (100dvh) panel that
 * stays pinned at the top while the rest of the page scrolls up over it: the
 * page slides over the hero, and the hero never moves.
 *
 * Pass the page's remaining content as children. The shell wraps it so it
 * sits above the hero and begins with the bottom wave (HeroWave), whose top
 * hump peeks above the fold at load. As the page scrolls, the wave rises
 * over the pinned hero like a mask line.
 *
 * It uses `position: sticky`, not `fixed`: the footer Easter egg transforms
 * the page wrapper, which would make a fixed element move with it, and a
 * sticky hero keeps its 100dvh in the layout so no spacer is needed. Scrolling
 * is native, so Lenis needs nothing special.
 *
 * Once the page has scrolled past the hero's wave, the hero is fully covered:
 * StickyHeroCover hides it and pauses its videos until it comes back, so it
 * costs nothing while the rest of the page scrolls.
 *
 * The header scrim is driven by an invisible 100dvh marker that scrolls
 * normally and carries `data-header-hero`; the pinned hero itself is always in
 * view, so it cannot be the sentinel.
 */
export function StickyHero({
  label,
  media,
  overlay,
  wave = "landing",
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
   * height and peek.
   */
  wave?: "landing" | "neighbornets" | "stories" | "about";
  /** The rest of the page. */
  children: ReactNode;
}) {
  return (
    <div data-sticky-hero-root className="relative isolate">
      <div
        data-header-hero
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-dvh"
      />
      <section
        aria-label={label}
        data-sticky-hero
        className="sticky top-0 z-0 h-dvh w-full overflow-hidden bg-brand-obsidian data-covered:invisible"
      >
        {media}
        {overlay ? (
          <div className="relative flex h-full items-center justify-center">
            {overlay}
          </div>
        ) : null}
      </section>
      <div
        className={cn(
          styles.following,
          wave === "neighbornets" && styles.followingNeighborNets,
          wave === "stories" && styles.followingStories,
          wave === "about" && styles.followingAbout,
        )}
      >
        {wave === "neighbornets" ? (
          <NeighborNetsHeroWave />
        ) : wave === "stories" ? (
          <StoriesHeroWave />
        ) : wave === "about" ? (
          <AboutHeroWave />
        ) : (
          <HeroWave />
        )}
        <StickyHeroCover />
        {children}
      </div>
    </div>
  );
}
