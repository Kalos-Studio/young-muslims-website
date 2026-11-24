"use client";

import type { MouseEvent } from "react";

import { smoothScrollTo } from "@/components/site/smooth-scroll-provider";
import { StandardButton } from "@/components/ui/standard-button";

/**
 * "Support": a StandardButton back up to the donation form in the hero
 * (#donate, its Warm Snow box). The hero is pinned (StickyHero), so the
 * form's place on the page is read from the hero's own layout, not the
 * pinned box: the page scrolls (Lenis's easing; a jump under reduced
 * motion) to where the box is centred in the viewport, clamped to the hero's
 * runway (0 when the hero fits the viewport; up to its foot-pin when it is
 * taller), so the whole form is in view. From the keyboard it then moves
 * focus into the form. Without script it is a plain link to #donate.
 */
export function SupportFormLink({ className }: { className?: string }) {
  const onClick = (event: MouseEvent<HTMLAnchorElement>) => {
    const box = document.getElementById("donate");
    const hero = box?.closest<HTMLElement>("[data-sticky-hero]");
    const root = hero?.closest<HTMLElement>("[data-sticky-hero-root]");
    if (!box || !hero || !root) return;
    event.preventDefault();
    const fromKeyboard = event.detail === 0;
    const heroTop = root.getBoundingClientRect().top + window.scrollY;
    const boxRect = box.getBoundingClientRect();
    const boxInHero = boxRect.top - hero.getBoundingClientRect().top;
    const runway = Math.max(0, hero.offsetHeight - window.innerHeight);
    const centred = boxInHero + boxRect.height / 2 - window.innerHeight / 2;
    const top = heroTop + Math.min(runway, Math.max(0, centred));
    smoothScrollTo(top, () => {
      if (fromKeyboard) box.querySelector("iframe")?.focus();
    });
  };

  return (
    <StandardButton
      label="Support"
      href="#donate"
      onClick={onClick}
      className={className}
    />
  );
}
