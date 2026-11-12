"use client";

import { useMotionValueEvent, useScroll } from "motion/react";
import { useLayoutEffect, useRef } from "react";

import { armShapeEntrances, REDUCED_MOTION } from "@/lib/shape-motion";

/**
 * The "A generation to believe in" section's motion. It fills the section
 * (an invisible layer, the scroll target) and drives the two rows of blob
 * photos the server rendered, found by `data-generation-row` (its value the
 * direction: -1 drifts left as the page scrolls down, 1 right).
 *
 * Scroll-linked, as the show-you section's lettering (show-you-motion.tsx):
 * one value across the section's scroll (0 as its top enters the viewport,
 * 1 as its bottom leaves), written straight to compositor-only transforms,
 * no per-frame CSS transitions (Lenis already smooths the scroll), so the
 * rows move only while the page scrolls and stop when it stops. Each row
 * travels `--generation-drift` row heights in all, half either side of its
 * Figma place, reached when the section is centred.
 *
 * Each photo also enters once as it comes into view, growing in as it
 * fades in (the shared shape motion, lib/shape-motion.ts).
 *
 * Under reduced motion nothing moves: the rows sit at their Figma places and
 * the photos simply show.
 */
export function GenerationDrift() {
  const targetRef = useRef<HTMLDivElement>(null);
  const rowsRef = useRef<HTMLElement[]>([]);
  const driftRef = useRef<number | null>(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start end", "end start"],
  });

  const apply = (progress: number) => {
    const drift = driftRef.current;
    if (drift === null) return;
    // -0.5 to 0.5 across the section; 0 when it is centred in the viewport.
    const centred = Math.min(1, Math.max(0, progress)) - 0.5;
    for (const row of rowsRef.current) {
      const x = Number(row.dataset.generationRow) * centred * drift;
      row.style.transform = `translate3d(${x.toFixed(2)}px, 0, 0)`;
    }
  };

  useLayoutEffect(() => {
    const section = targetRef.current?.parentElement;
    if (!section || window.matchMedia(REDUCED_MOTION).matches) return;
    rowsRef.current = [
      ...section.querySelectorAll<HTMLElement>("[data-generation-row]"),
    ];
    const measure = () => {
      const rowHeight = rowsRef.current[0]?.offsetHeight ?? 0;
      const drift = Number.parseFloat(
        getComputedStyle(document.documentElement).getPropertyValue(
          "--generation-drift",
        ),
      );
      driftRef.current = rowHeight * (Number.isNaN(drift) ? 1.5 : drift);
      apply(scrollYProgress.get());
    };
    measure();
    window.addEventListener("resize", measure);
    const disarm = armShapeEntrances(
      [...section.querySelectorAll("[data-generation-blob]")],
      {
        duration: "--duration-generation-blob",
        fromScale: "--generation-blob-from-scale",
        easing: "--ease-generation-blob",
      },
    );
    return () => {
      window.removeEventListener("resize", measure);
      disarm?.();
      driftRef.current = null;
    };
  }, [scrollYProgress]);

  useMotionValueEvent(scrollYProgress, "change", apply);

  return (
    <div
      ref={targetRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0"
    />
  );
}
