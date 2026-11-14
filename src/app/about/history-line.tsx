"use client";

import { useMotionValueEvent, useScroll } from "motion/react";
import { useLayoutEffect, useRef, useState } from "react";

import { readTimeToken } from "@/components/site/blob-reveal";
import { cn } from "@/lib/utils";
import {
  onEnter,
  pausedAnimation,
  readRootToken,
  REDUCED_MOTION,
} from "@/lib/shape-motion";

type ScrollOffset = NonNullable<
  NonNullable<Parameters<typeof useScroll>[0]>["offset"]
>;

/**
 * The "How it started." timeline's line (a grey track, an Obsidian fill)
 * and the section's choreography, which it drives from where it sits,
 * finding what the server rendered by `data-history`:
 *
 * 1. `front-1995` fades in as it comes into view;
 * 2. then, once that has finished, `watermark-1995` (the big pale 1995)
 *    fades in;
 * 3. the line's fill follows the scroll (scaleY, on the
 *    compositor): empty as the track's top reaches
 *    `--about-history-line-start` down the viewport, full as its foot
 *    reaches `--about-history-line-end`; it empties again on the way up;
 * 4. the first time it is full, the four `digit`s (2, 0, 2, 6) fade in one
 *    after another, `--duration-about-history-digit-stagger` apart;
 * 5. once the last has finished, `watermark-2026` fades in.
 *
 * Each fade runs once (the line alone follows the scroll both ways). The
 * background years also drift with the scroll (ScrollDrift, in the
 * section). Under reduced motion nothing is created: everything shows, the
 * line full, as the server rendered it.
 */
export function HistoryLine({ className }: { className?: string }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const fillRef = useRef<HTMLDivElement>(null);
  const gateRef = useRef<(() => void) | null>(null);
  const [start, end] = useOffsets();
  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: [`start ${start}`, `end ${end}`] as ScrollOffset,
  });

  const apply = (progress: number) => {
    const fill = fillRef.current;
    if (!fill || !gateRef.current) return;
    const amount = Math.min(1, Math.max(0, progress));
    fill.style.transform = `scaleY(${amount.toFixed(4)})`;
    if (amount >= 1) {
      gateRef.current();
    }
  };

  useLayoutEffect(() => {
    const section = trackRef.current?.closest("section");
    if (!section || window.matchMedia(REDUCED_MOTION).matches) return;
    const one = (name: string) =>
      section.querySelector<HTMLElement>(`[data-history="${name}"]`);
    const all = (name: string) => [
      ...section.querySelectorAll<HTMLElement>(`[data-history="${name}"]`),
    ];
    const easing = readRootToken("--ease-about-history", "ease-out");
    const fade = readTimeToken("--duration-about-history-fade", 700);
    const fadeIn = (element: Element, options: KeyframeAnimationOptions) =>
      pausedAnimation(element, [{ opacity: 0 }, { opacity: 1 }], {
        easing,
        ...options,
      });

    const front = one("front-1995");
    const watermark1995 = one("watermark-1995");
    const watermark2026 = one("watermark-2026");
    const digits = all("digit");
    if (!front || !watermark1995 || !watermark2026) return;

    // 1 then 2: the front 1995, then its background year.
    const frontIn = fadeIn(front, { duration: fade });
    const watermark1995In = fadeIn(watermark1995, { duration: fade });
    frontIn.finished.then(
      () => watermark1995In.play(),
      () => undefined,
    );
    const frontObserver = onEnter(front, () => frontIn.play());

    // 4 then 5: the digits one by one, then their background year.
    const stagger = readTimeToken(
      "--duration-about-history-digit-stagger",
      300,
    );
    const digitIns = digits.map((digit, index) =>
      fadeIn(digit, {
        duration: readTimeToken("--duration-about-history-digit", 600),
        delay: index * stagger,
      }),
    );
    const watermark2026In = fadeIn(watermark2026, { duration: fade });
    let gated = false;
    gateRef.current = () => {
      if (gated) return;
      gated = true;
      digitIns.forEach((animation) => animation.play());
      Promise.all(digitIns.map((animation) => animation.finished)).then(
        () => watermark2026In.play(),
        () => undefined,
      );
    };

    // 3: the line, empty until the scroll fills it.
    apply(scrollYProgress.get());

    const animations = [frontIn, watermark1995In, ...digitIns, watermark2026In];
    const fill = fillRef.current;
    return () => {
      frontObserver.disconnect();
      gateRef.current = null;
      animations.forEach((animation) => animation.cancel());
      if (fill) fill.style.transform = "";
    };
  }, [scrollYProgress]);

  useMotionValueEvent(scrollYProgress, "change", apply);

  return (
    <div
      ref={trackRef}
      aria-hidden="true"
      className={cn(
        "relative h-18 w-0.5 overflow-hidden rounded-full bg-about-history-track",
        className,
      )}
    >
      <div
        ref={fillRef}
        className="absolute inset-0 origin-top rounded-full bg-brand-obsidian"
      />
    </div>
  );
}

/** The line's fill range (tokens), read once on the client. */
function useOffsets(): [string, string] {
  const [offsets] = useState<[string, string]>(() =>
    typeof window === "undefined"
      ? ["90%", "50%"]
      : [
          readRootToken("--about-history-line-start", "90%"),
          readRootToken("--about-history-line-end", "50%"),
        ],
  );
  return offsets;
}
