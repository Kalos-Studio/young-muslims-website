"use client";

import Lenis from "lenis";
import { useEffect, type ReactNode } from "react";

const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

/**
 * App-wide smooth scrolling.
 *
 * Lenis drives the real window scroll position: there is no wrapper element
 * and nothing is transformed. Every `scroll` event, `window.scrollY` read and
 * Motion `useScroll` in the app (the header contrast controller, the footer
 * Easter egg, the landing and About scroll scenes) therefore stays in sync
 * without subscribing to Lenis. Do not rewrite them onto a Lenis event source.
 *
 * This renders no DOM of its own, so it can wrap the root layout's tree
 * without changing layout or turning any child into a Client Component.
 *
 * Intentional choices, each verified against lenis@1.3.26:
 * - `prevent` skips Lenis while `<html>` has `overflow: hidden`. Lenis scrolls
 *   with `window.scrollTo`, which ignores that lock, so without this the page
 *   would scroll behind EntryAnimation and the open menu. It is the same flag
 *   the footer checks before playing the Easter egg. Lenis only calls `prevent`
 *   for nodes below `<html>`, which is every real wheel target.
 * - `naiveDimensions` reads the live `scrollHeight`. The root layout sets
 *   `html` to `h-full`, so the `html` box never resizes when the page grows and
 *   Lenis's ResizeObserver would leave the scroll limit stale, stopping wheel
 *   scrolling short of the footer after route changes or lazy content.
 * - `allowNestedScroll` hands wheel and touch input to any scrollable
 *   `overflow: auto|scroll` descendant. This covers the story dialog's inner
 *   scroller (`overscroll-contain`) while it has something to scroll.
 * - `lenis/dist/lenis.css` is deliberately not imported. It sets
 *   `html, body { height: auto }`, which would break the full-height flex
 *   layout that keeps the footer at the bottom of short pages.
 * - Reduced motion: Lenis is never created, so scrolling stays native. The
 *   preference is watched, matching the footer, so toggling it takes effect
 *   without a reload.
 *
 * TODO(data-lenis-prevent): wheel and touch input over the map
 * (`components/ui/map.tsx`) and over modal scroll containers is not handed
 * back to the element by `allowNestedScroll` (the map is not an overflow
 * scroller, and a modal with nothing to scroll falls through). When the map
 * and the story dialog are rebuilt against Figma, add `data-lenis-prevent` to
 * them. Until then, wheel-zooming the map also scrolls the page.
 */
/** The live Lenis instance, or null under reduced motion or before mount. */
let activeLenis: Lenis | null = null;

/**
 * Pauses smooth scrolling: cancels any in-flight momentum and blocks wheel
 * input. Used by the page transition instead of the `<html>` overflow flag,
 * which Base UI's menu scroll lock also writes. No-op without Lenis.
 */
export function stopSmoothScroll() {
  activeLenis?.stop();
}

/**
 * Resumes smooth scrolling, re-synced to the real scroll position (so it
 * picks up a scroll-to-top that happened while stopped). No-op without Lenis.
 */
export function startSmoothScroll() {
  activeLenis?.start();
}

export function SmoothScrollProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    const media = window.matchMedia(REDUCED_MOTION_QUERY);
    let lenis: Lenis | null = null;
    let frame: number | undefined;

    const tick = (time: number) => {
      lenis?.raf(time);
      frame = window.requestAnimationFrame(tick);
    };

    const start = () => {
      if (lenis) return;
      lenis = new Lenis({
        autoRaf: false,
        allowNestedScroll: true,
        naiveDimensions: true,
        prevent: () => document.documentElement.style.overflow === "hidden",
      });
      activeLenis = lenis;
      frame = window.requestAnimationFrame(tick);
    };

    const stop = () => {
      if (frame !== undefined) window.cancelAnimationFrame(frame);
      frame = undefined;
      lenis?.destroy();
      lenis = null;
      activeLenis = null;
    };

    const sync = () => (media.matches ? stop() : start());

    sync();
    media.addEventListener("change", sync);

    return () => {
      media.removeEventListener("change", sync);
      stop();
    };
  }, []);

  return <>{children}</>;
}
