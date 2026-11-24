"use client";

import { useMotionValueEvent, useScroll } from "motion/react";
import Image from "next/image";
import { useEffect, useRef } from "react";

import { cn } from "@/lib/utils";

import marqueeRow from "../../../design-assets/figma/support/legacy/marquee-row-obsidian.svg";
import marqueeRowOutline from "../../../design-assets/figma/support/legacy/marquee-row-outline-obsidian.svg";
import showYou from "../landing/show-you-section.module.css";
import styles from "./legacy-section.module.css";

/** Tiles per row: enough to cover a 2560px screen while drifting. */
const TILES = 5;

const ROWS = [
  { tile: marqueeRow, row: showYou.rowTop, tiles: showYou.tile, direction: -1 },
  {
    tile: marqueeRowOutline,
    row: showYou.rowMiddle,
    tiles: showYou.tileOutline,
    direction: 1,
  },
  {
    tile: marqueeRow,
    row: showYou.rowBottom,
    tiles: showYou.tile,
    direction: -1,
  },
] as const;

/**
 * The legacy section's three rows of lettering (BROTHERHOOD. SISTERHOOD.
 * COMMUNITY SERVICE. TARBIYYAH.) behind the video, in Obsidian: the landing
 * "show you" section's rows (its tiles, recoloured, its row and tile
 * geometry, show-you-section.module.css, and its row heights and drift,
 * `--show-marquee-row-height` and `--show-marquee-drift`), and its motion:
 * one scroll-linked value (0 as the video's block enters the viewport, 1 as
 * it leaves) written straight to each row's translate3d, the top and bottom
 * rows drifting left and the middle row right as the page scrolls down,
 * half the drift either side of their Figma places (reached with the block
 * centred). Under reduced motion they rest at those places.
 *
 * It fills its (positioned) parent, the video's block, as the scroll
 * target; the rows hang from the block's top, the frames' offsets
 * (legacy-section.module.css).
 */
export function LegacyLettering() {
  const targetRef = useRef<HTMLDivElement>(null);
  const rowRefs = useRef<(HTMLDivElement | null)[]>([]);
  const driftRef = useRef<number | null>(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start end", "end start"],
  });

  const apply = (progress: number) => {
    const drift = driftRef.current;
    if (drift === null) return;
    const centred = Math.min(1, Math.max(0, progress)) - 0.5;
    ROWS.forEach((row, index) => {
      const element = rowRefs.current[index];
      if (!element) return;
      const x = row.direction * centred * drift;
      element.style.transform = `translate3d(${x.toFixed(2)}px, 0, 0)`;
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
      driftRef.current = rowHeight * (Number.isNaN(drift) ? 6 : drift);
      apply(scrollYProgress.get());
    };
    measure();
    window.addEventListener("resize", measure);
    return () => {
      window.removeEventListener("resize", measure);
      driftRef.current = null;
    };
  }, [scrollYProgress]);

  useMotionValueEvent(scrollYProgress, "change", apply);

  return (
    <div
      ref={targetRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0"
    >
      {/* Rows start 318 / 96 / 155 below the video's top (Figma). */}
      <div
        className={cn(
          "absolute top-79.5 left-1/2 flex flex-col md:top-24 xl:top-38.75",
          styles.lettering,
        )}
      >
        {ROWS.map((row, index) => (
          <div
            key={index}
            ref={(element) => {
              rowRefs.current[index] = element;
            }}
            className={cn(showYou.row, row.row)}
          >
            {Array.from({ length: TILES }, (_, tile) => (
              <Image key={tile} src={row.tile} alt="" className={row.tiles} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
