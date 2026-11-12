"use client";

import { useMotionValueEvent, useScroll } from "motion/react";
import { useLayoutEffect, useRef } from "react";

import { readLengthToken } from "@/lib/motion-tokens";
import {
  armShapeEntrances,
  REDUCED_MOTION,
  trackPointerDrift,
} from "@/lib/shape-motion";

/**
 * The "Built by the youth" section's motion. It fills the section (an
 * invisible layer, the scroll target) and drives what the server rendered,
 * found by `data-youth`:
 *
 * - `shape`: the pale background shape rises `--youth-shape-drift` across
 *   the section's scroll (0 as its top enters the viewport, 1 as its bottom
 *   leaves), from its Figma place, so its top edge reaches further up into
 *   Mission & Vision. Scroll-linked, written straight to a compositor-only
 *   transform (the show-you and generation sections' mechanic; Lenis
 *   already smooths the scroll). It only rises, so its foot never drops
 *   below the section.
 * - `face-art`: each face grows in as it fades in, once, as it enters view,
 *   one stagger after the last (the shared shape entrance).
 * - `face`: with a fine pointer, and while the section is on screen, each
 *   face's pointer layer drifts towards the cursor by `--youth-pointer-drift`
 *   times its `data-depth` (the shared cursor drift), eased by a compositor
 *   transition. Nothing follows a touch.
 *
 * Under reduced motion nothing moves: the shape at its Figma place, the
 * faces simply present.
 */
export function YouthMotion() {
  const targetRef = useRef<HTMLDivElement>(null);
  const shapeRef = useRef<HTMLElement | null>(null);
  const driftRef = useRef<number | null>(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start end", "end start"],
  });

  const apply = (progress: number) => {
    const shape = shapeRef.current;
    const drift = driftRef.current;
    if (!shape || drift === null) return;
    const y = -Math.min(1, Math.max(0, progress)) * drift;
    shape.style.transform = `translate3d(0, ${y.toFixed(2)}px, 0)`;
  };

  useLayoutEffect(() => {
    const section = targetRef.current?.parentElement;
    if (!section || window.matchMedia(REDUCED_MOTION).matches) return;
    const all = (name: string) => [
      ...section.querySelectorAll<HTMLElement>(`[data-youth="${name}"]`),
    ];
    shapeRef.current = all("shape")[0] ?? null;
    const measure = () => {
      driftRef.current = readLengthToken("--youth-shape-drift", 96);
      apply(scrollYProgress.get());
    };
    measure();
    window.addEventListener("resize", measure);
    const disarm = armShapeEntrances(all("face-art"), {
      duration: "--duration-youth-face",
      fromScale: "--youth-face-from-scale",
      easing: "--ease-youth-face",
      stagger: "--duration-youth-face-stagger",
    });
    const stopPointer = trackPointerDrift(
      section,
      all("face").map((face) => ({
        element: face,
        depth: Number(face.dataset.depth ?? 1),
      })),
      "--youth-pointer-drift",
    );
    return () => {
      window.removeEventListener("resize", measure);
      disarm?.();
      stopPointer();
      driftRef.current = null;
      if (shapeRef.current) shapeRef.current.style.transform = "";
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
