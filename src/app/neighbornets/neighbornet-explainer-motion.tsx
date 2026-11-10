"use client";

import { useMotionValueEvent, useScroll } from "motion/react";
import { useEffect, useRef, type ReactNode } from "react";

import { readLengthToken } from "@/lib/motion-tokens";
import { REDUCED_MOTION, trackPointerDrift } from "@/lib/shape-motion";

import styles from "./neighbornet-explainer.module.css";

/** The cursor drift's depth per row: the bottom row trails less. */
const ROW_DEPTHS = [1, 0.6];

/**
 * "What's a NeighborNet?"'s motion. It renders the section and finds its
 * parts by `data-explainer`. Three motions, each on its own layer, so they
 * compose rather than fight, and all on the compositor:
 *
 * - **Loop** (CSS, the photo tracks): the top row drifts right and the
 *   bottom row left, forever, by one copy of the row a loop. Paused while
 *   the section is off screen (the `paused` class, from an observer here).
 * - **Cursor drift** (each row, around its track): with a fine pointer, the
 *   shared shape drift (lib/shape-motion.ts `trackPointerDrift`, as the
 *   landing's everywhere and stories sections): each row's layer moves
 *   toward the cursor and a CSS transition eases it there; the track's loop
 *   runs inside it, so the drift is an offset added to the loop.
 * - **Watermark parallax** (the logo): one scroll-linked value (0 as the
 *   section's top enters the viewport, 1 as its bottom leaves; Lenis already
 *   smooths the scroll), written straight to its transform: it moves
 *   `--neighbornets-explainer-watermark-drift` in all, down as the page
 *   scrolls down, so it lags behind the photos.
 *
 * Under reduced motion nothing moves: the rows rest at Figma's places, the
 * watermark too.
 */
export function NeighborNetExplainerMotion({
  className,
  labelledBy,
  children,
}: {
  className: string;
  labelledBy: string;
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
      ...section.querySelectorAll<HTMLElement>('[data-explainer="row"]'),
    ];
    const stopDrift = trackPointerDrift(
      section,
      rows.map((element, index) => ({
        element,
        depth: ROW_DEPTHS[index] ?? 1,
      })),
      "--neighbornets-explainer-pointer-drift",
    );

    watermarkRef.current = section.querySelector<HTMLElement>(
      '[data-explainer="watermark"]',
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
  }, [scrollYProgress]);

  useMotionValueEvent(scrollYProgress, "change", apply);

  return (
    <section
      ref={sectionRef}
      aria-labelledby={labelledBy}
      className={className}
    >
      {children}
    </section>
  );
}
