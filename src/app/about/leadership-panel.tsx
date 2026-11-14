"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

import {
  BLOB_REVEAL_SHAPE_COUNT,
  BlobReveal,
} from "@/components/site/blob-reveal";
import { readRootToken } from "@/lib/shape-motion";
import { cn } from "@/lib/utils";

/** A random curated blob shape (1-based), never `previous`. */
function freshShape(previous: number) {
  const pick = 1 + Math.floor(Math.random() * (BLOB_REVEAL_SHAPE_COUNT - 1));
  return pick >= previous ? pick + 1 : pick;
}

/**
 * The leadership section's pinned image panel (tablet and desktop): its
 * photos stacked, each in a BlobReveal layer. It watches the section's text
 * groups (`data-leadership-text`): the moment a group's text first enters
 * the viewport from the bottom (its top edge crossing the bottom edge,
 * moved by `--leadership-trigger-offset`), its photo sweeps in over the
 * last behind an organic blob edge (BlobReveal run in reverse: from
 * uncovered to covering, rising from the bottom, as the page scrolls up);
 * scrolling back, once that text has left again below the bottom edge, it
 * sweeps out, uncovering the one before. Before the first group's text
 * appears the panel is empty. A group counts once its text is in view or
 * has scrolled above it, and photos follow the groups in order, so a fast
 * scroll can never show them out of sequence.
 *
 * Every sweep, in or out, takes a random curated blob shape, never the
 * same as the sweep before it. The sweep's pace is the section's
 * (`className` sets it: leadership-section.module.css).
 *
 * Watched with one IntersectionObserver over the viewport, so nothing runs
 * per scroll frame; only the masks animate. Under reduced
 * motion BlobReveal completes instantly, so the photos swap at the same
 * points without the sweep.
 */
export function LeadershipPanel({
  photos,
  className,
}: {
  photos: ReactNode[];
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  // The server render's shapes; each swap picks fresh ones on the client.
  const [state, setState] = useState(() => ({
    active: 0,
    shapes: photos.map((_, index) => index + 1),
    last: 0,
  }));

  useEffect(() => {
    const section = ref.current?.closest("section");
    if (!section) return;
    const marks = [
      ...section.querySelectorAll<HTMLElement>("[data-leadership-text]"),
    ];
    // Positive: the trigger fires that far before the text reaches the
    // bottom edge; negative: that far after.
    const offset = readRootToken("--leadership-trigger-offset", "0px");
    const passed = marks.map(() => false);
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const index = marks.indexOf(entry.target as HTMLElement);
          // In view, or already scrolled above it.
          passed[index] =
            entry.isIntersecting || entry.boundingClientRect.top < 0;
        }
        const count = passed.findIndex((value) => !value);
        const next = count === -1 ? passed.length : count;
        setState((current) => {
          if (next === current.active) return current;
          // The layers changing state this swap: sweeping in going down,
          // out going up. Each gets a shape unlike the sweep before.
          const shapes = [...current.shapes];
          let last = current.last;
          const [from, to] =
            next > current.active
              ? [current.active, next]
              : [next, current.active];
          for (let layer = from; layer < to; layer++) {
            last = freshShape(last);
            shapes[layer] = last;
          }
          return { active: next, shapes, last };
        });
      },
      { rootMargin: `0px 0px ${offset} 0px`, threshold: 0 },
    );
    for (const mark of marks) observer.observe(mark);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={cn("sticky top-0 h-dvh overflow-hidden", className)}
    >
      {photos.map((photo, index) => (
        <BlobReveal
          key={index}
          aria-hidden={index + 1 > state.active ? true : undefined}
          revealing={index + 1 > state.active}
          origin="top"
          shape={state.shapes[index]}
          className="absolute inset-0"
        >
          {photo}
        </BlobReveal>
      ))}
    </div>
  );
}
