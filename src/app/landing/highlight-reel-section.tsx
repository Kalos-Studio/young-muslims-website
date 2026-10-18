"use client";

import { useRef, type ReactNode } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "motion/react";

const TRAVEL_DISTANCE = 800;
const MARQUEE_COPY = "Sisterhood. Brotherhood. Community Service. Tarbiyyah.";
const MARQUEE_REPETITIONS = 5;

export function HighlightReelMarquee({
  rows,
}: {
  rows?: [ReactNode, ReactNode, ReactNode];
} = {}) {
  const scrollTargetRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: scrollTargetRef,
    offset: ["start end", "end start"],
  });

  const leftwardX = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    shouldReduceMotion
      ? [0, 0, 0]
      : [0, -TRAVEL_DISTANCE / 2, -TRAVEL_DISTANCE],
  );
  const rightwardX = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    shouldReduceMotion ? [0, 0, 0] : [0, TRAVEL_DISTANCE / 2, TRAVEL_DISTANCE],
  );

  return (
    <div
      ref={scrollTargetRef}
      aria-hidden="true"
      className="pointer-events-none absolute top-0 left-1/2 h-full w-screen -translate-x-1/2 overflow-hidden"
    >
      <div
        className={
          rows
            ? "absolute top-2/3 left-1/2 flex -translate-x-1/2 flex-col items-center gap-4 lg:top-1/2 lg:gap-6"
            : "absolute inset-x-0 top-148 flex flex-col gap-2 font-display text-[30px] leading-[1.05] whitespace-nowrap uppercase xl:top-[421px] xl:gap-[19px] xl:text-marquee xl:leading-none"
        }
      >
        <motion.div
          className={
            rows
              ? "flex w-max gap-6"
              : "-ml-[400px] flex w-max gap-6 text-brand-warm-snow md:-ml-[1200px] md:gap-8"
          }
          style={{ x: leftwardX }}
        >
          {Array.from({ length: MARQUEE_REPETITIONS }).map((_, index) => (
            <span key={index} className="block shrink-0">
              {rows ? rows[0] : MARQUEE_COPY}
            </span>
          ))}
        </motion.div>
        <motion.div
          className={
            rows
              ? "flex w-max gap-6"
              : "-ml-[1000px] flex w-max gap-6 text-landing-marquee-outline md:-ml-[1700px] md:gap-8"
          }
          style={{ x: rightwardX }}
        >
          {Array.from({ length: MARQUEE_REPETITIONS }).map((_, index) => (
            <span key={index} className="block shrink-0">
              {rows ? rows[1] : MARQUEE_COPY}
            </span>
          ))}
        </motion.div>
        <motion.div
          className={
            rows
              ? "flex w-max gap-6"
              : "-ml-[600px] flex w-max gap-6 text-brand-warm-snow md:-ml-[1000px] md:gap-8"
          }
          style={{ x: leftwardX }}
        >
          {Array.from({ length: MARQUEE_REPETITIONS }).map((_, index) => (
            <span key={index} className="block shrink-0">
              {rows ? rows[2] : MARQUEE_COPY}
            </span>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
