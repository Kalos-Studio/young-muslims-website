"use client";

import { useMotionValueEvent, useScroll } from "motion/react";
import { useLayoutEffect, useRef } from "react";

import {
  HERO_BLOB,
  HERO_PHOTO_BLOB,
  PALE_BLOB,
} from "@/components/site/hero-wave";
import { readLengthToken } from "@/lib/motion-tokens";
import { REDUCED_MOTION } from "@/lib/shape-motion";
import { cn } from "@/lib/utils";

import styles from "./neighbornets-section.module.css";

/** The bigger copy behind moves this much more than the Obsidian edge. */
const BACK_DEPTH = 1.5;

/*
 * The caps, back copies first. `edge` is -1 for the top and 1 for the
 * bottom (which is the top cap turned 180deg).
 */
const CAPS = [
  { edge: -1, back: true },
  { edge: 1, back: true },
  { edge: -1, back: false },
  { edge: 1, back: false },
] as const;

/**
 * The section's dark background shape and its bigger copy behind, as the
 * show-you section's blob and its Twilight rims: an Obsidian body with an
 * organic cap at each end, and behind each cap the same shape, bigger and
 * offset, in Landing Twilight. The edges are the hero wave's own pair
 * (HeroWave: the photo blob for the bigger copy, the pale blob for the
 * Obsidian edge) in their 246-unit frame, pressed into
 * `--neighbornets-edge-height`; the bottom cap is the top one turned round.
 * Each cap draws far past its frame into the body, further than its drift,
 * so the body's straight edges never show however the caps move. The Warm Snow above and below is
 * the section's own background, matching its neighbours.
 *
 * Parallax, from one scroll-linked value (0 as the section's top enters the
 * viewport, 1 as its bottom leaves), written straight to translate3d (one
 * layer per cap): over the first half the top edge rises
 * `--neighbornets-edge-drift`, over the second the bottom edge falls by the
 * same, and the bigger copies move half as much again, so the pair parts as
 * it breathes. The edges only ever move outward, into the headroom kept for
 * them (`--neighbornets-edge-headroom`, the section's own padding). Under
 * reduced motion nothing moves.
 */
export function NeighborNetsBackdrop() {
  const ref = useRef<HTMLDivElement>(null);
  const capRefs = useRef<(HTMLDivElement | null)[]>([]);
  const driftRef = useRef<number | null>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const apply = (progress: number) => {
    const drift = driftRef.current;
    if (drift === null) return;
    const topOut = Math.min(1, Math.max(0, progress * 2));
    const bottomOut = Math.min(1, Math.max(0, progress * 2 - 1));
    CAPS.forEach((cap, index) => {
      const element = capRefs.current[index];
      if (!element) return;
      const out = cap.edge === -1 ? topOut : bottomOut;
      const y = cap.edge * out * drift * (cap.back ? BACK_DEPTH : 1);
      element.style.transform = `translate3d(0, ${y.toFixed(2)}px, 0)`;
    });
  };

  useLayoutEffect(() => {
    if (window.matchMedia(REDUCED_MOTION).matches) return;
    const measure = () => {
      driftRef.current = readLengthToken("--neighbornets-edge-drift", 16);
      apply(scrollYProgress.get());
    };
    measure();
    window.addEventListener("resize", measure);
    const caps = capRefs.current;
    return () => {
      window.removeEventListener("resize", measure);
      driftRef.current = null;
      caps.forEach((cap) => {
        if (cap) cap.style.transform = "";
      });
    };
  }, [scrollYProgress]);

  useMotionValueEvent(scrollYProgress, "change", apply);

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0"
    >
      <div className={cn("bg-brand-obsidian", styles.body)} />
      {CAPS.map((cap, index) => {
        const id = `neighbornets-edge-${index}`;
        return (
          <div
            key={id}
            ref={(element) => {
              capRefs.current[index] = element;
            }}
            className={cn(
              styles.cap,
              cap.edge === -1 ? styles.capTop : styles.capBottom,
            )}
          >
            <svg
              viewBox="0 984 1440 246"
              preserveAspectRatio="none"
              className={cn(
                styles.capShape,
                cap.edge === 1 && styles.capTurned,
              )}
            >
              <defs>
                <mask
                  id={id}
                  maskUnits="userSpaceOnUse"
                  x="0"
                  y="900"
                  width="1440"
                  height="1100"
                >
                  <rect x="0" y="900" width="1440" height="1100" fill="white" />
                  <path
                    d={HERO_BLOB}
                    transform={cap.back ? HERO_PHOTO_BLOB : PALE_BLOB}
                    fill="black"
                  />
                </mask>
              </defs>
              {/* Runs 754 units past the frame into the body (196px at the
                  shallowest frame, past the furthest drift, 165px). */}
              <rect
                x="0"
                y="984"
                width="1440"
                height="1000"
                mask={`url(#${id})`}
                className={
                  cap.back ? "fill-landing-twilight" : "fill-brand-obsidian"
                }
              />
            </svg>
          </div>
        );
      })}
    </div>
  );
}
