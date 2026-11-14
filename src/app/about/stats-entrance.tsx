"use client";

import { type ComponentProps, useLayoutEffect, useRef } from "react";

import { readTimeToken } from "@/components/site/blob-reveal";
import { readLengthToken } from "@/lib/motion-tokens";
import {
  onEnter,
  pausedAnimation,
  readRootToken,
  REDUCED_MOTION,
} from "@/lib/shape-motion";

/**
 * The About stats' metric list, with its entrance: as the first metric
 * comes into view, each metric (its items, top to bottom) grows from
 * `--about-stat-from-scale` and slides in `--about-stat-shift` from the
 * right as it fades in, one `--duration-about-stat-stagger` after the last
 * (the Everywhere stats' staggered pattern). Opacity and transform only,
 * on the compositor; once. Under reduced motion nothing is created and the
 * metrics simply show; the DOM is the same either way.
 */
export function StatsEntrance({ children, ...props }: ComponentProps<"ul">) {
  const ref = useRef<HTMLUListElement>(null);

  useLayoutEffect(() => {
    const list = ref.current;
    if (!list || window.matchMedia(REDUCED_MOTION).matches) return;
    const items = [...list.children] as HTMLElement[];
    const scale = readRootToken("--about-stat-from-scale", "0.92");
    const shift = readLengthToken("--about-stat-shift", 24);
    const stagger = readTimeToken("--duration-about-stat-stagger", 180);
    const options = {
      duration: readTimeToken("--duration-about-stat", 700),
      easing: readRootToken("--ease-about-stat", "ease-out"),
    };
    const animations = items.map((item, index) =>
      pausedAnimation(
        item,
        [
          {
            opacity: 0,
            transform: `translate3d(${shift}px, 0, 0) scale(${scale})`,
          },
          { opacity: 1, transform: "translate3d(0, 0, 0) scale(1)" },
        ],
        { ...options, delay: index * stagger },
      ),
    );
    const observer = items[0]
      ? onEnter(items[0], () => animations.forEach((a) => a.play()))
      : null;
    return () => {
      observer?.disconnect();
      animations.forEach((animation) => animation.cancel());
    };
  }, []);

  return (
    <ul ref={ref} {...props}>
      {children}
    </ul>
  );
}
