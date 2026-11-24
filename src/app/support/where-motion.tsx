"use client";

import { useLayoutEffect, useRef } from "react";

import {
  armShapeEntrances,
  REDUCED_MOTION,
  trackPointerDrift,
} from "@/lib/shape-motion";

/**
 * The "Where your support goes" photos' motion (About youth's faces'
 * mechanic, the shared shape motion). An invisible layer filling the
 * section; it drives what the server rendered, found by `data-where`:
 *
 * - `photo-art`: each photo grows in from `--support-where-photo-from-scale`
 *   as it fades in, once, as it enters view, one stagger after the last.
 * - `photo`: with a fine pointer, and only while the section is on screen,
 *   each photo's pointer layer drifts towards the cursor, up to
 *   `--support-where-pointer-drift` times its `data-depth` (rAF-throttled),
 *   eased by a compositor transition (where-section.module.css). Nothing
 *   follows a touch.
 *
 * The background shapes drift on their own (ScrollDrift). Under reduced
 * motion nothing moves: the photos are simply present.
 */
export function WhereMotion() {
  const ref = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const section = ref.current?.parentElement;
    if (!section || window.matchMedia(REDUCED_MOTION).matches) return;
    const all = (name: string) => [
      ...section.querySelectorAll<HTMLElement>(`[data-where="${name}"]`),
    ];
    const disarm = armShapeEntrances(all("photo-art"), {
      duration: "--duration-support-where-photo",
      fromScale: "--support-where-photo-from-scale",
      easing: "--ease-support-where-photo",
      stagger: "--duration-support-where-photo-stagger",
    });
    const stopPointer = trackPointerDrift(
      section,
      all("photo").map((photo) => ({
        element: photo,
        depth: Number(photo.dataset.depth ?? 1),
      })),
      "--support-where-pointer-drift",
    );
    return () => {
      disarm();
      stopPointer();
    };
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0"
    />
  );
}
