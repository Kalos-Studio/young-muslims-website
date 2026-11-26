"use client";

import { useEffect, useRef } from "react";

import { REDUCED_MOTION } from "@/lib/shape-motion";

/**
 * A short hero's scroll-linked dimming (StickyHero without `fullHeight`):
 * an Obsidian layer over the whole hero whose opacity follows how much of
 * the hero the page has covered, from none at load (only the wave's rise
 * over it) to `--sticky-hero-tint-max` once `END` of the rest is covered,
 * so the hero recedes as the page envelops it without ever going black.
 * Only its opacity changes (a composited layer, no repaint). It takes no
 * pointer events, so the Support form under it stays usable. Under reduced
 * motion it stays clear.
 */
const END = 0.85;

export function StickyHeroTint({ className }: { className: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const tint = ref.current;
    const hero = tint?.closest<HTMLElement>("[data-sticky-hero]");
    const following = hero?.nextElementSibling as HTMLElement | null;
    if (!tint || !hero || !following) return;
    if (window.matchMedia(REDUCED_MOTION).matches) return;
    let max = 0.35;
    let rise = 0;
    const measure = () => {
      const value = Number.parseFloat(
        getComputedStyle(document.documentElement).getPropertyValue(
          "--sticky-hero-tint-max",
        ),
      );
      max = Number.isNaN(value) ? 0.35 : value;
      rise = -Number.parseFloat(getComputedStyle(following).marginTop) || 0;
    };
    let frame = 0;
    const apply = () => {
      frame = 0;
      const heroBox = hero.getBoundingClientRect();
      const covered = heroBox.bottom - following.getBoundingClientRect().top;
      const span = (heroBox.height - rise) * END;
      const progress = span > 0 ? (covered - rise) / span : 0;
      const opacity = Math.min(1, Math.max(0, progress)) * max;
      tint.style.opacity = opacity.toFixed(3);
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(apply);
    };
    const onResize = () => {
      measure();
      schedule();
    };
    measure();
    apply();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", onResize);
      if (frame) cancelAnimationFrame(frame);
      tint.style.opacity = "";
    };
  }, []);

  return <div ref={ref} aria-hidden="true" className={className} />;
}
