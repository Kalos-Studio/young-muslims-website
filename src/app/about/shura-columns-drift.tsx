"use client";

import { useMotionValueEvent, useScroll } from "motion/react";
import { useLayoutEffect, useRef } from "react";

import { readLengthToken } from "@/lib/motion-tokens";

/** Tablet and desktop, motion allowed: phones have one column, nothing to drift against. */
const DRIFT_QUERY =
  "(prefers-reduced-motion: no-preference) and (width >= 48rem)";

type Parts = {
  cards: HTMLElement[];
  columns: number;
  /** Each column's total drift across the section's pass, in px. */
  drifts: number[];
  /** The progress at which the section's top meets the viewport's top. */
  anchor: number;
};

/**
 * The Shura grid's column parallax. It fills the section (an invisible
 * layer, the scroll target) and drifts each column of cards
 * (`data-shura="grid"`'s children, by their column in the grid) at its own
 * scroll-linked rate: over the section's whole pass through the viewport
 * (its top entering at the foot to its foot leaving at the top), column n
 * travels up by `--about-shura-column-drift-n`, anchored so the cards sit
 * in Figma's place as the section's top reaches the viewport's top (where
 * the first row is first seen whole): a little low as they come in from
 * the "Two sides" handoff, rising past their place as the grid scrolls on. The 49px offset of every
 * second column is CSS `translate`; this writes `transform`
 * (translate3d), so the two add up. One write per card, only when its
 * column's value changes. Phones (one column) and reduced motion: nothing.
 */
export function ShuraColumnsDrift() {
  const targetRef = useRef<HTMLDivElement>(null);
  const partsRef = useRef<Parts | null>(null);
  const written = useRef<string[]>([]);
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start end", "end start"],
  });

  const apply = (progress: number) => {
    const parts = partsRef.current;
    if (!parts) return;
    const values = parts.drifts.map(
      (drift) =>
        `translate3d(0, ${((parts.anchor - progress) * drift).toFixed(2)}px, 0)`,
    );
    parts.cards.forEach((card, index) => {
      const column = index % parts.columns;
      if (written.current[index] === values[column]) return;
      written.current[index] = values[column];
      card.style.transform = values[column];
    });
  };

  useLayoutEffect(() => {
    const section = targetRef.current?.parentElement;
    const grid = section?.querySelector<HTMLElement>('[data-shura="grid"]');
    if (!section || !grid) return;
    const query = window.matchMedia(DRIFT_QUERY);

    const clear = () => {
      for (const card of partsRef.current?.cards ?? [])
        card.style.transform = "";
      written.current = [];
      partsRef.current = null;
    };

    const arm = () => {
      clear();
      if (!query.matches) return;
      const columns = getComputedStyle(grid)
        .gridTemplateColumns.split(" ")
        .filter(Boolean).length;
      // Progress runs over the section's height plus the viewport's.
      const height = section.getBoundingClientRect().height;
      partsRef.current = {
        anchor: window.innerHeight / (height + window.innerHeight),
        cards: [...grid.children] as HTMLElement[],
        columns,
        drifts: Array.from({ length: columns }, (_, column) =>
          readLengthToken(`--about-shura-column-drift-${column + 1}`, 64),
        ),
      };
      apply(scrollYProgress.get());
    };
    arm();
    query.addEventListener("change", arm);
    window.addEventListener("resize", arm);
    return () => {
      query.removeEventListener("change", arm);
      window.removeEventListener("resize", arm);
      clear();
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
