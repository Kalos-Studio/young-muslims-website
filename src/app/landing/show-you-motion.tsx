"use client";

import { useMotionValueEvent, useScroll } from "motion/react";
import Image from "next/image";
import { useEffect, useRef } from "react";

import { readLengthToken } from "@/lib/motion-tokens";
import { cn } from "@/lib/utils";

import marqueeRow from "../../../design-assets/figma/landing-2026/show-you/marquee-row.svg";
import marqueeRowOutline from "../../../design-assets/figma/landing-2026/show-you/marquee-row-outline.svg";
import {
  BLOB_BOTTOM_OBSIDIAN,
  BLOB_BOTTOM_TWILIGHT,
  BLOB_TOP_OBSIDIAN,
  BLOB_TOP_TWILIGHT,
} from "./show-you-blob";
import styles from "./show-you-section.module.css";

/** The Twilight rims move this much more than the Obsidian outline. */
const RIM_DEPTH = 1.5;
/** Tiles per marquee row: enough to cover a 2560px screen while drifting. */
const TILES = 5;

const ROWS = [
  { tile: marqueeRow, row: styles.rowTop, tiles: styles.tile, direction: -1 },
  {
    tile: marqueeRowOutline,
    row: styles.rowMiddle,
    tiles: styles.tileOutline,
    direction: 1,
  },
  {
    tile: marqueeRow,
    row: styles.rowBottom,
    tiles: styles.tile,
    direction: -1,
  },
] as const;

/*
 * The blob's caps. Each is its own layer, moved by the GPU compositor only
 * (translate3d), so scrolling never repaints them. `edge` is -1 for the top
 * edge and 1 for the bottom one; the outline breathes: as the page scrolls
 * down the top edge rises and the bottom edge falls.
 */
const CAPS = [
  {
    d: BLOB_TOP_TWILIGHT,
    fill: "fill-landing-twilight",
    edge: -1,
    depth: RIM_DEPTH,
  },
  { d: BLOB_TOP_OBSIDIAN, fill: "fill-brand-obsidian", edge: -1, depth: 1 },
  {
    d: BLOB_BOTTOM_TWILIGHT,
    fill: "fill-landing-twilight",
    edge: 1,
    depth: RIM_DEPTH,
  },
  { d: BLOB_BOTTOM_OBSIDIAN, fill: "fill-brand-obsidian", edge: 1, depth: 1 },
] as const;

/**
 * The "show you" section's moving parts: the dark blob's organic outline and
 * the three rows of background lettering (BROTHERHOOD. SISTERHOOD. COMMUNITY
 * SERVICE. TARBIYYAH.). It fills the section and uses it as the scroll
 * target.
 *
 * The blob is one contained shape: the section's Obsidian body plus a top cap
 * and a bottom cap whose organic contours come from Figma's waves around the
 * section (see show-you-blob.ts), each with a Landing Twilight rim behind it.
 * The caps reach 140 units back into the section, more than they ever move,
 * so the body's straight edges never show; the rims reach 64 (top) and 134
 * (bottom, where Figma's shape curves back into the section at the far
 * left), so theirs stay hidden behind the Obsidian although they move
 * further.
 *
 * Parallax, from one scroll-linked value (0 as the section's top enters the
 * viewport, 1 as its bottom leaves), written straight to compositor-only
 * transforms (no per-frame CSS transitions; Lenis already smooths the
 * scroll):
 * - The blob breathes outward from its Figma shape: over the first half of
 *   the section's scroll (while its top edge is on screen) the top edge rises
 *   by `--show-edge-drift`, and over the second half (while its bottom edge
 *   is on screen) the bottom edge falls by the same; the rims move half as
 *   much again. Scrolling back reverses it. The edges only ever move outward,
 *   so the organic outline never dips into the section, where the body's
 *   straight edge would show.
 * - The marquee rows drift `--show-marquee-drift` row heights in all, half
 *   either side of their Figma places (reached when the section is centred):
 *   the top and bottom rows left as the page scrolls down, the middle row
 *   right.
 * Under reduced motion nothing moves; everything sits at its Figma place.
 */
export function ShowYouMotion() {
  const targetRef = useRef<HTMLDivElement>(null);
  const rowRefs = useRef<(HTMLDivElement | null)[]>([]);
  const capRefs = useRef<(HTMLDivElement | null)[]>([]);
  const metricsRef = useRef<{ drift: number; edge: number } | null>(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start end", "end start"],
  });

  const apply = (progress: number) => {
    const metrics = metricsRef.current;
    if (!metrics) return;
    // -0.5 to 0.5 across the section; 0 when it is centred in the viewport.
    const centred = Math.min(1, Math.max(0, progress)) - 0.5;
    ROWS.forEach((row, index) => {
      const element = rowRefs.current[index];
      if (!element) return;
      const x = row.direction * centred * metrics.drift;
      element.style.transform = `translate3d(${x.toFixed(2)}px, 0, 0)`;
    });
    // Each edge's share of its outward move: the top edge over the first
    // half of the scroll, the bottom edge over the second.
    const topOut = Math.min(1, Math.max(0, progress * 2));
    const bottomOut = Math.min(1, Math.max(0, progress * 2 - 1));
    CAPS.forEach((cap, index) => {
      const element = capRefs.current[index];
      if (!element) return;
      const out = cap.edge === -1 ? topOut : bottomOut;
      const y = cap.edge * out * metrics.edge * cap.depth;
      element.style.transform = `translate3d(0, ${y.toFixed(2)}px, 0)`;
    });
  };

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const measure = () => {
      const rowHeight = rowRefs.current[0]?.offsetHeight ?? 0;
      const drift = Number.parseFloat(
        getComputedStyle(document.documentElement).getPropertyValue(
          "--show-marquee-drift",
        ),
      );
      metricsRef.current = {
        drift: rowHeight * (Number.isNaN(drift) ? 6 : drift),
        edge: readLengthToken("--show-edge-drift", 24),
      };
      apply(scrollYProgress.get());
    };
    measure();
    window.addEventListener("resize", measure);
    return () => {
      window.removeEventListener("resize", measure);
      metricsRef.current = null;
    };
  }, [scrollYProgress]);

  useMotionValueEvent(scrollYProgress, "change", apply);

  return (
    <div
      ref={targetRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0"
    >
      {CAPS.map((cap, index) => {
        const top = cap.edge === -1;
        return (
          <div
            key={index}
            ref={(element) => {
              capRefs.current[index] = element;
            }}
            className={cn(styles.cap, top ? styles.capTop : styles.capBottom)}
          >
            <svg
              viewBox={top ? "-720 -460 1440 600" : "-720 -140 1440 520"}
              preserveAspectRatio={top ? "xMidYMax slice" : "xMidYMin slice"}
              className={cn(
                "block h-auto w-full",
                top ? styles.capTopShape : styles.capBottomShape,
              )}
            >
              <path className={cap.fill} d={cap.d} />
            </svg>
          </div>
        );
      })}

      {/* The lettering, clipped to the section's sides. */}
      <div className="absolute inset-0 overflow-x-clip">
        {/* Rows start 380 / 367 / 143 below the card's top (Figma y 570 /
            603 / 501 in the three frames; desktop moves up with the card). */}
        <div className="absolute top-142.5 left-1/2 flex flex-col md:top-150.75 xl:top-104.75">
          {ROWS.map((row, index) => (
            <div
              key={index}
              ref={(element) => {
                rowRefs.current[index] = element;
              }}
              className={cn(styles.row, row.row)}
            >
              {Array.from({ length: TILES }, (_, tile) => (
                <Image key={tile} src={row.tile} alt="" className={row.tiles} />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
