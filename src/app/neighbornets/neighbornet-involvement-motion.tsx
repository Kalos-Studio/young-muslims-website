"use client";

import { type ComponentProps, useLayoutEffect, useRef } from "react";

import { armShapeEntrances, REDUCED_MOTION } from "@/lib/shape-motion";

/**
 * "Other ways to get involved."'s card list, with the photo-blobs'
 * entrance: each blob (and its word) grows from
 * `--neighbornets-involved-from-scale` as it fades in, once, as it enters
 * view, one at a time left to right (`--duration-neighbornets-involved-
 * stagger` apart; stacked on phones, each as it arrives) (the shared shape motion, lib/shape-motion.ts, as the landing's
 * everywhere, stories and street sections). It finds the blobs by
 * `data-involved="art"`. Under reduced motion nothing is created; the DOM is
 * the same either way, so the server and client agree.
 */
export function NeighborNetInvolvementMotion({
  children,
  ...props
}: ComponentProps<"ul">) {
  const ref = useRef<HTMLUListElement>(null);

  useLayoutEffect(() => {
    const list = ref.current;
    if (!list || window.matchMedia(REDUCED_MOTION).matches) return;
    return armShapeEntrances(
      [...list.querySelectorAll('[data-involved="art"]')],
      {
        duration: "--duration-neighbornets-involved",
        fromScale: "--neighbornets-involved-from-scale",
        easing: "--ease-neighbornets-involved",
        stagger: "--duration-neighbornets-involved-stagger",
      },
    );
  }, []);

  return (
    <ul ref={ref} {...props}>
      {children}
    </ul>
  );
}
