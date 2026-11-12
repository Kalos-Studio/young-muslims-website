"use client";

import { type ComponentProps, useLayoutEffect, useRef } from "react";

import { armShapeEntrances, REDUCED_MOTION } from "@/lib/shape-motion";

/**
 * The article list, with the cards' entrance: each card's photo grows from
 * `--street-card-from-scale` as it fades in, once, as it enters view (the
 * shared shape motion, lib/shape-motion.ts). It finds the photos by
 * `data-street="art"`. With `stagger` (a time token), cards that enter view
 * together come in one at a time, in order (the Stories alumni row). Under
 * reduced motion nothing is created; the DOM is the same either way, so the
 * server and client agree.
 */
export function StreetCardsMotion({
  stagger,
  children,
  ...props
}: ComponentProps<"ul"> & { stagger?: string }) {
  const ref = useRef<HTMLUListElement>(null);

  useLayoutEffect(() => {
    const list = ref.current;
    if (!list || window.matchMedia(REDUCED_MOTION).matches) return;
    return armShapeEntrances(
      [...list.querySelectorAll('[data-street="art"]')],
      {
        duration: "--duration-street-card",
        fromScale: "--street-card-from-scale",
        easing: "--ease-street",
        stagger,
      },
    );
  }, [stagger]);

  return (
    <ul ref={ref} {...props}>
      {children}
    </ul>
  );
}
