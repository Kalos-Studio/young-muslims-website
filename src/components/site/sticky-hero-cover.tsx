"use client";

import { useEffect, useRef } from "react";

/**
 * Placed right after the hero's bottom wave. Once it has scrolled above the
 * viewport, the content fully covers the pinned hero, so the hero is marked
 * `data-covered` (which hides it) and its playing videos are paused; they
 * resume when it comes back into view. Without this the hero, pinned for the
 * whole page, keeps decoding and compositing a full-screen video behind
 * everything below it.
 */
export function StickyHeroCover() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const sentinel = ref.current;
    const hero = sentinel
      ?.closest("[data-sticky-hero-root]")
      ?.querySelector<HTMLElement>("[data-sticky-hero]");
    if (!sentinel || !hero) return;
    const paused = new Set<HTMLVideoElement>();

    const observer = new IntersectionObserver(([entry]) => {
      const covered = !entry.isIntersecting && entry.boundingClientRect.top < 0;
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
    });
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, []);

  return <div ref={ref} aria-hidden="true" />;
}
