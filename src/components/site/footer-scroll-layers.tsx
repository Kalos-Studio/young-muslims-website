"use client";

import { type MotionValue, useMotionValueEvent } from "motion/react";
import { useLayoutEffect, useRef } from "react";

import { readLengthToken } from "@/lib/motion-tokens";
import { REDUCED_MOTION } from "@/lib/shape-motion";
import { cn } from "@/lib/utils";

import { FOOTER_SHAPES } from "./footer-shapes";
import styles from "./site-footer.module.css";

const TAGLINE_COPY = "FOR THE YOUTH. BY THE YOUTH.";
const TAGLINE_REPETITIONS = 5;

type Metrics = { shapeDrift: number; marqueeDrift: number };

/**
 * The footer's scroll-linked layers, driven by the footer's own scroll
 * progress (`progress`, SiteFooter's `useScroll`: 0 as the footer's top
 * enters the viewport, 1 when it is fully in view at the page's foot). They
 * only read the scroll and only write transforms on their own layers: no
 * listeners, no layout, nothing the Easter egg reads.
 *
 * They live in the footer's dark surface: one organic shape whose wavy top
 * is its own edge, rising above the footer's box (the box is unchanged), and
 * the clip for everything here, so the shapes rise into the wave.
 *
 * - Shapes: the blue pair slides in from the left and the green pair from
 *   the right, from `--footer-shape-drift` out to their places as the footer
 *   comes into view; scrolling back up sends them out again. Smaller on
 *   tablet and mobile (`--footer-shape-unit`).
 * - Tagline marquee (the show-you marquee's mechanic): one row of "FOR THE
 *   YOUTH. BY THE YOUTH." drifts `--footer-marquee-drift` in all, half
 *   either side of its place.
 *
 * Under reduced motion nothing moves: the shapes sit in place, the tagline
 * is still. The DOM is the same either way.
 */
export function FooterScrollLayers({
  progress,
}: {
  progress: MotionValue<number>;
}) {
  const blueRef = useRef<HTMLDivElement>(null);
  const greenRef = useRef<HTMLDivElement>(null);
  const marqueeRef = useRef<HTMLDivElement>(null);
  const metricsRef = useRef<Metrics | null>(null);

  const apply = (value: number) => {
    const metrics = metricsRef.current;
    if (!metrics) return;
    const p = Math.min(1, Math.max(0, value));
    const out = (1 - p) * metrics.shapeDrift;
    if (blueRef.current)
      blueRef.current.style.transform = `translate3d(${(-out).toFixed(1)}px, 0, 0)`;
    if (greenRef.current)
      greenRef.current.style.transform = `translate3d(${out.toFixed(1)}px, 0, 0)`;
    if (marqueeRef.current)
      marqueeRef.current.style.transform = `translate3d(${((p - 0.5) * metrics.marqueeDrift).toFixed(1)}px, 0, 0)`;
  };

  useLayoutEffect(() => {
    if (window.matchMedia(REDUCED_MOTION).matches) return;
    const layers = [blueRef.current, greenRef.current, marqueeRef.current];
    const measure = () => {
      metricsRef.current = {
        shapeDrift: readLengthToken("--footer-shape-drift", 96),
        marqueeDrift: readLengthToken("--footer-marquee-drift", 480),
      };
      apply(progress.get());
    };
    measure();
    window.addEventListener("resize", measure);
    return () => {
      window.removeEventListener("resize", measure);
      metricsRef.current = null;
      layers.forEach((layer) => {
        if (layer) layer.style.transform = "";
      });
    };
  }, [progress]);

  useMotionValueEvent(progress, "change", apply);

  return (
    <div
      aria-hidden="true"
      className={cn("pointer-events-none bg-brand-obsidian", styles.surface)}
    >
      <div className={styles.box}>
        {/* Each pair: the bigger shape in the brand colour, the smaller one
          over it under 10% Warm Snow; smaller on tablet and mobile. */}
        <div>
          <div ref={greenRef} className={cn("absolute inset-0", styles.pair)}>
            <svg
              viewBox={FOOTER_SHAPES.green.viewBox}
              preserveAspectRatio="none"
              className={cn(styles.shape, styles.green)}
            >
              <path d={FOOTER_SHAPES.green.path} className="fill-brand-jade" />
            </svg>
            <svg
              viewBox={FOOTER_SHAPES.greenLight.viewBox}
              preserveAspectRatio="none"
              className={cn(styles.shape, styles.greenLight)}
            >
              <path
                d={FOOTER_SHAPES.greenLight.path}
                className="fill-brand-jade"
              />
              <path
                d={FOOTER_SHAPES.greenLight.path}
                className="fill-brand-warm-snow/10"
              />
            </svg>
          </div>
          <div ref={blueRef} className={cn("absolute inset-0", styles.pair)}>
            <svg
              viewBox={FOOTER_SHAPES.blue.viewBox}
              preserveAspectRatio="none"
              className={cn(styles.shape, styles.blue)}
            >
              <path d={FOOTER_SHAPES.blue.path} className="fill-brand-royal" />
            </svg>
            <svg
              viewBox={FOOTER_SHAPES.blueLight.viewBox}
              preserveAspectRatio="none"
              className={cn(styles.shape, styles.blueLight)}
            >
              <path
                d={FOOTER_SHAPES.blueLight.path}
                className="fill-brand-royal"
              />
              <path
                d={FOOTER_SHAPES.blueLight.path}
                className="fill-brand-warm-snow/10"
              />
            </svg>
          </div>
        </div>

        {/* The tagline: faint (Warm Snow at 12%, as in Figma), across the
          middle, centred and drifting. */}
        <div className="absolute inset-x-0 top-126 overflow-hidden md:top-75.75 xl:top-72.5">
          <div className="flex justify-center">
            <div
              ref={marqueeRef}
              className={cn(
                "flex w-max shrink-0 gap-8 font-display text-footer-tagline-mobile whitespace-nowrap text-brand-warm-snow/12 uppercase md:text-footer-tagline-tablet xl:text-footer-tagline",
                styles.marquee,
              )}
            >
              {Array.from({ length: TAGLINE_REPETITIONS }, (_, index) => (
                <span key={index} className="shrink-0">
                  {TAGLINE_COPY}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
