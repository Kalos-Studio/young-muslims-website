"use client";

import { useEffect, useRef } from "react";

/**
 * Placed right after the hero's bottom wave. Once it has scrolled above the
 * viewport, the content fully covers the pinned hero, so the hero is marked
 * `data-covered` (which hides it) and its playing videos are paused; they
 * resume when it comes back into view. Without this the hero, pinned for the
 * whole page, keeps decoding and compositing a full-screen video behind
 * everything below it.
 *
 * The observer's root runs far below the viewport (ROOT_MARGIN), so the
 * sentinel intersects it whenever it is not above the viewport's top:
 * covered and uncovered are then the two sides of one crossing, and a jump
 * from far down straight to the top (scrollTo, an anchor, back-to-top)
 * still reports it. Against the viewport alone, such a jump goes from
 * "above" to "below", not intersecting either side, so no callback fired
 * and the hero stayed hidden, its video paused.
 */
const ROOT_MARGIN = "0px 0px 100000px 0px";

export function StickyHeroCover() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const sentinel = ref.current;
    const hero = sentinel
      ?.closest("[data-sticky-hero-root]")
      ?.querySelector<HTMLElement>("[data-sticky-hero]");
    if (!sentinel || !hero) return;
    const paused = new Set<HTMLVideoElement>();

    const observer = new IntersectionObserver(
      (entries) => {
        // Only the latest position matters (a jump can queue several).
        const entry = entries[entries.length - 1];
        if (!entry) return;
        const covered =
          !entry.isIntersecting && entry.boundingClientRect.top < 0;
        if (covered) {
          hero.dataset.covered = "";
          for (const video of hero.querySelectorAll("video")) {
            if (!video.paused) {
              video.pause();
              paused.add(video);
            }
          }
        } else {
          delete hero.dataset.covered;
          for (const video of paused) void video.play().catch(() => undefined);
          paused.clear();
        }
      },
      { rootMargin: ROOT_MARGIN },
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, []);

  return <div ref={ref} aria-hidden="true" />;
}
