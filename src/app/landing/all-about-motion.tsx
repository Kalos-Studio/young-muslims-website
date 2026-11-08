"use client";

import { useMotionValueEvent, useScroll } from "motion/react";
import { type ReactNode, useEffect, useRef } from "react";

import { readLengthToken } from "@/lib/motion-tokens";

type Motion =
  | {
      tier: "desktop";
      columnA: HTMLElement;
      columnB: HTMLElement;
      marks: HTMLElement[];
      rise: number;
      tuck: number;
      settle: number;
      markDrift: number;
    }
  | {
      tier: "tablet";
      columns: HTMLElement[];
      marks: HTMLElement[];
      cardDrift: number;
      markDrift: number;
    };

function moveY(element: HTMLElement, y: number) {
  element.style.transform = `translate3d(0, ${y.toFixed(2)}px, 0)`;
}

/**
 * The "all about" section's scroll motion. It wraps the section's content
 * and finds its moving parts by `data-all-about`: the copy (`intro`), the two
 * tile columns (`column-a`, `column-b`) and the watermarks (`mark`).
 *
 * Everything comes from one scroll-linked value (0 as the section's top
 * enters the viewport, 1 as its bottom leaves; 0.5 when it is centred, where
 * every layer sits at its Figma place), written straight to compositor-only
 * transforms (translate3d on layers promoted with will-change; no per-frame
 * CSS transitions, since Lenis already smooths the scroll). Three tiers:
 *
 * - **Desktop** (from `xl`): the copy is `position: sticky` (never fixed:
 *   the footer Easter egg transforms the page wrapper). It scrolls normally
 *   until its centre reaches the viewport's centre, pins there, and is
 *   released when its column (as tall as the tiles) ends. The sticky `top`
 *   is measured here, (viewport height - copy height) / 2. The columns move
 *   against each other: the left one rises `--all-about-column-rise` either
 *   side of its place; the right one descends from `--all-about-column-tuck`
 *   above it (under the blob's bottom wave as the section enters) to
 *   `--all-about-column-settle` below it. The watermarks rise
 *   `--all-about-mark-drift` in all.
 * - **Tablet** (`md` to `xl`): no pin and no opposing motion. The tiles and
 *   watermarks both lag the scroll, the watermarks twice as far
 *   (`--all-about-tablet-card-drift`, `--all-about-tablet-mark-drift`), for
 *   depth.
 * - **Mobile**, and reduced motion at any width: nothing moves or pins;
 *   everything sits at its Figma place.
 */
export function AllAboutMotion({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const motionRef = useRef<Motion | null>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const apply = (progress: number) => {
    const motion = motionRef.current;
    if (!motion) return;
    // -0.5 to 0.5 across the section; 0 when it is centred in the viewport.
    const centred = Math.min(1, Math.max(0, progress)) - 0.5;
    if (motion.tier === "desktop") {
      moveY(motion.columnA, -2 * centred * motion.rise);
      moveY(
        motion.columnB,
        2 * centred * (centred < 0 ? motion.tuck : motion.settle),
      );
      for (const mark of motion.marks) moveY(mark, -centred * motion.markDrift);
    } else {
      for (const column of motion.columns)
        moveY(column, centred * motion.cardDrift);
      for (const mark of motion.marks) moveY(mark, centred * motion.markDrift);
    }
  };

  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const find = (name: string) =>
      root.querySelector<HTMLElement>(`[data-all-about="${name}"]`);
    const intro = find("intro");
    const columnA = find("column-a");
    const columnB = find("column-b");
    const marks = [
      ...root.querySelectorAll<HTMLElement>('[data-all-about="mark"]'),
    ];
    if (!intro || !columnA || !columnB) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const desktop = window.matchMedia("(width >= 80rem)");
    const tablet = window.matchMedia("(width >= 48rem)");

    const setup = () => {
      for (const element of [columnA, columnB, ...marks])
        element.style.transform = "";
      intro.style.top = "";
      motionRef.current = null;
      if (reduced.matches || !tablet.matches) return;
      if (desktop.matches) {
        const viewport = document.documentElement.clientHeight;
        intro.style.top = `${Math.max(0, (viewport - intro.offsetHeight) / 2)}px`;
        motionRef.current = {
          tier: "desktop",
          columnA,
          columnB,
          marks,
          rise: readLengthToken("--all-about-column-rise", 180),
          tuck: readLengthToken("--all-about-column-tuck", 440),
          settle: readLengthToken("--all-about-column-settle", 160),
          markDrift: readLengthToken("--all-about-mark-drift", 96),
        };
      } else {
        motionRef.current = {
          tier: "tablet",
          columns: [columnA, columnB],
          marks,
          cardDrift: readLengthToken("--all-about-tablet-card-drift", 64),
          markDrift: readLengthToken("--all-about-tablet-mark-drift", 128),
        };
      }
      apply(scrollYProgress.get());
    };

    setup();
    // The copy's height (fonts, wrapping) and the viewport both set the pin.
    const observer = new ResizeObserver(setup);
    observer.observe(intro);
    window.addEventListener("resize", setup);
    for (const query of [reduced, desktop, tablet])
      query.addEventListener("change", setup);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", setup);
      for (const query of [reduced, desktop, tablet])
        query.removeEventListener("change", setup);
      motionRef.current = null;
    };
  }, [scrollYProgress]);

  useMotionValueEvent(scrollYProgress, "change", apply);

  return (
    <div ref={ref} className="relative">
      {children}
    </div>
  );
}
