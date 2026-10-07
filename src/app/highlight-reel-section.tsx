"use client";

import { useRef } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "motion/react";

const RESTING_OFFSET = 0;
const TRAVEL_DISTANCE = 240;
const MARQUEE_COPY = "Sisterhood. Brotherhood. Community Service. Tarbiyyah.";
const MARQUEE_REPETITIONS = 5;

export function HighlightReelMarquee() {
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
      ? [RESTING_OFFSET, RESTING_OFFSET, RESTING_OFFSET]
      : [TRAVEL_DISTANCE, RESTING_OFFSET, -TRAVEL_DISTANCE],
  );
  const rightwardX = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    shouldReduceMotion
      ? [RESTING_OFFSET, RESTING_OFFSET, RESTING_OFFSET]
      : [-TRAVEL_DISTANCE, RESTING_OFFSET, TRAVEL_DISTANCE],
  );

  return (
    <div
      ref={scrollTargetRef}
      aria-hidden="true"
      className="pointer-events-none absolute top-0 left-1/2 h-full w-screen -translate-x-1/2 overflow-hidden"
    >
      <div className="absolute inset-x-0 top-[508px] flex flex-col gap-0 font-display text-[32px] leading-[1.625] whitespace-nowrap uppercase md:top-[381px] md:text-marquee md:leading-[1.25]">
        <motion.div
          className="-ml-[70px] flex w-max gap-8 text-brand-warm-snow md:-ml-[1403px]"
          style={{ x: leftwardX }}
        >
          {Array.from({ length: MARQUEE_REPETITIONS }).map((_, index) => (
            <span key={index} className="shrink-0">
              {MARQUEE_COPY}
            </span>
          ))}
        </motion.div>
        <motion.div
          className="-ml-[624px] flex w-max gap-8 text-landing-marquee-outline md:-ml-[1638px]"
          style={{ x: rightwardX }}
        >
          {Array.from({ length: MARQUEE_REPETITIONS }).map((_, index) => (
            <span key={index} className="shrink-0">
              {MARQUEE_COPY}
            </span>
          ))}
        </motion.div>
        <motion.div
          className="-ml-[238px] flex w-max gap-8 text-brand-warm-snow md:-ml-[983px]"
          style={{ x: leftwardX }}
        >
          {Array.from({ length: MARQUEE_REPETITIONS }).map((_, index) => (
            <span key={index} className="shrink-0">
              {MARQUEE_COPY}
            </span>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
