"use client";

import { useRef } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "motion/react";

const RESTING_OFFSET = "calc(var(--spacing) * 0)";
const FORWARD_OFFSET = "calc(var(--spacing) * 20)";
const REVERSE_OFFSET = "calc(var(--spacing) * -20)";
const MARQUEE_COPY =
  "Tarbiyyah. Community Service. Peer-led. Advocacy. Brotherhood. Sisterhood.";
const SECOND_ROW_COPY =
  "Advocacy. Brotherhood. Sisterhood. Tarbiyyah. Community Service. Peer-led.";

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
      : [FORWARD_OFFSET, RESTING_OFFSET, REVERSE_OFFSET],
  );
  const rightwardX = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    shouldReduceMotion
      ? [RESTING_OFFSET, RESTING_OFFSET, RESTING_OFFSET]
      : [REVERSE_OFFSET, RESTING_OFFSET, FORWARD_OFFSET],
  );

  return (
    <div
      ref={scrollTargetRef}
      aria-hidden
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      <div className="pointer-events-none absolute inset-x-0 top-show-marquee-top flex flex-col gap-show-marquee-row-gap overflow-hidden font-display text-marquee whitespace-nowrap text-brand-warm-snow">
        <motion.div
          className="-ml-show-marquee-first-offset flex gap-8"
          style={{ x: leftwardX }}
        >
          <span className="shrink-0">{MARQUEE_COPY}</span>
          <span className="shrink-0">{MARQUEE_COPY}</span>
        </motion.div>
        <motion.div
          className="-ml-show-marquee-second-offset flex gap-8 text-marquee-outline"
          style={{ x: rightwardX }}
        >
          <span className="shrink-0">{SECOND_ROW_COPY}</span>
          <span className="shrink-0">{SECOND_ROW_COPY}</span>
        </motion.div>
        <motion.div
          className="ml-show-marquee-third-offset flex gap-6"
          style={{ x: leftwardX }}
        >
          <span className="shrink-0">{MARQUEE_COPY}</span>
          <span className="shrink-0">{MARQUEE_COPY}</span>
        </motion.div>
      </div>
    </div>
  );
}
