"use client";

import { useMotionValueEvent, useScroll } from "motion/react";
import { useEffect, useRef, type ReactNode } from "react";

import { readLengthToken } from "@/lib/motion-tokens";
import { REDUCED_MOTION, trackPointerDrift } from "@/lib/shape-motion";

import styles from "./photo-marquee.module.css";

/**
 * The NeighborNets page's photo marquees' motion ("What's a NeighborNet?",
 * the NeighborNet branding rows). It renders the section and finds its parts
 * by `data-marquee`. Up to three motions, each on its own layer, so they
 * compose rather than fight, and all on the compositor:
 *
 * - **Loop** (CSS, each row's track, from its section's module): the row
 *   drifts one way forever, by one copy of the row a loop. Paused while the
 *   section is off screen (the shared module's `paused` class, from an
 *   observer here).
 * - **Cursor drift** (each row, around its track): with a fine pointer, the
 *   shared shape drift (lib/shape-motion.ts `trackPointerDrift`, as the
 *   landing's everywhere and stories sections): each row's layer moves
 *   toward the cursor, `depths` of `--neighbornets-marquee-pointer-drift`,
 *   and a CSS transition eases it there; the track's loop runs inside it,
 *   so the drift is an offset added to the loop. `level` rows (flush ones)
 *   drift only sideways, so no seam ever opens between them. Sideways the
 *   tracks reach thousands of pixels past both edges (four copies, started a
 *   loop out), far beyond the drift's reach. Touch gets the loop alone.
 * - **Watermark parallax** (a `data-marquee="watermark"` element, if any):
 *   one scroll-linked value (0 as the section's top enters the viewport, 1
 *   as its bottom leaves; Lenis already smooths the scroll), written
 *   straight to its transform: it moves `--neighbornets-explainer-watermark-
 *   drift` in all, down as the page scrolls down, so it lags behind the
 *   photos.
 *
 * Under reduced motion nothing moves: rows and watermark rest at Figma's
 * places.
 */
export function PhotoMarqueeMotion({
  className,
  labelledBy,
  label,
  depths,
  level = false,
  children,
}: {
  className: string;
  /** The section's heading's id, or */
  labelledBy?: string;
  /** its name, when it has no heading. */
  label?: string;
  /** Each row's share of the cursor drift, top to bottom. */
  depths: readonly number[];
  /**
   * Rows drift only sideways (flush rows: a vertical drift would open
   * Warm Snow seams between them and at the section's edges).
   */
  level?: boolean;
  children: ReactNode;
}) {
  const sectionRef = useRef<HTMLElement>(null);
  const watermarkRef = useRef<HTMLElement | null>(null);
  const driftRef = useRef(0);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const apply = (progress: number) => {
    const watermark = watermarkRef.current;
    if (!watermark || !driftRef.current) return;
    const centred = Math.min(1, Math.max(0, progress)) - 0.5;
    watermark.style.transform = `translate3d(0, ${(centred * driftRef.current).toFixed(2)}px, 0)`;
  };

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    // Loops run only while the section is (nearly) on screen.
    const visibility = new IntersectionObserver(
      ([entry]) =>
        section.classList.toggle(styles.paused, !entry.isIntersecting),
      { rootMargin: "200px 0px" },
    );
    visibility.observe(section);
    if (window.matchMedia(REDUCED_MOTION).matches)
      return () => visibility.disconnect();

    const rows = [
      ...section.querySelectorAll<HTMLElement>('[data-marquee="row"]'),
    ];
    const stopDrift = trackPointerDrift(
      section,
      rows.map((element, index) => ({
        element,
        depth: depths[index] ?? 1,
      })),
      "--neighbornets-marquee-pointer-drift",
      { axes: level ? "x" : "both" },
    );

    watermarkRef.current = section.querySelector<HTMLElement>(
      '[data-marquee="watermark"]',
    );
    const measure = () => {
      driftRef.current = readLengthToken(
        "--neighbornets-explainer-watermark-drift",
        80,
      );
      apply(scrollYProgress.get());
    };
    measure();
    window.addEventListener("resize", measure);

    return () => {
      visibility.disconnect();
      stopDrift();
      window.removeEventListener("resize", measure);
      driftRef.current = 0;
      if (watermarkRef.current) watermarkRef.current.style.transform = "";
      watermarkRef.current = null;
    };
  }, [scrollYProgress, depths, level]);

  useMotionValueEvent(scrollYProgress, "change", apply);

  return (
    <section
      ref={sectionRef}
      aria-labelledby={labelledBy}
      aria-label={label}
      className={className}
    >
      {children}
    </section>
  );
}
