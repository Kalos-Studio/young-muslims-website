"use client";

import { useLayoutEffect, useRef } from "react";

/**
 * StickyHero's `fit`: pins a hero that may be taller than the viewport by
 * its bottom. It measures the hero and writes its sticky `top`, the
 * viewport's height less the hero's, or 0 when the hero fits: a hero that
 * fits pins at the top as every other hero does; a taller one scrolls until
 * its foot reaches the viewport's foot and pins there, so all of it is seen
 * before the page rises over it. Until this runs (or without script) the
 * hero is a plain section (sticky-hero.module.css), never cut off.
 *
 * It also sizes the header's scrim marker to the hero, so the scrim comes
 * on as the hero is covered, not a viewport in. It measures again whenever
 * the hero's size or the viewport's changes, including the resize iOS
 * Safari fires as its toolbar collapses or returns, so the hero's foot
 * stays at the viewport's foot.
 */
export function StickyHeroFit() {
  const ref = useRef<HTMLSpanElement>(null);

  useLayoutEffect(() => {
    const hero = ref.current?.closest<HTMLElement>("[data-sticky-hero]");
    const marker = hero
      ?.closest("[data-sticky-hero-root]")
      ?.querySelector<HTMLElement>("[data-header-hero]");
    if (!hero) return;

    const measure = () => {
      const height = hero.offsetHeight;
      const top = Math.min(0, Math.round(window.innerHeight - height));
      hero.style.top = `${top}px`;
      hero.dataset.pinned = "";
      if (marker) marker.style.height = `${height}px`;
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(hero);
    window.addEventListener("resize", measure);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", measure);
      hero.style.top = "";
      delete hero.dataset.pinned;
      if (marker) marker.style.height = "";
    };
  }, []);

  return <span ref={ref} hidden />;
}
