"use client";

import { useRef } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "motion/react";

export function HeroFollowupCurve() {
  const curveRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: curveRef,
    offset: ["start end", "start start"],
  });
  const y = useTransform(
    scrollYProgress,
    [0, 1],
    reduceMotion ? [0, 0] : [0, -28],
  );

  return (
    <div
      ref={curveRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-x-0 top-0 z-[1] h-[160px] bg-[#f7f3f0] md:h-[200px]"
    >
      <motion.svg
        className="absolute top-[76px] left-0 h-[160px] w-full text-brand-warm-snow md:top-[96px] md:h-[180px]"
        viewBox="0 0 1440 160"
        preserveAspectRatio="none"
        style={{ y }}
      >
        <path
          d="M0 36C240 72 480 72 720 36S1200 0 1440 36V160H0Z"
          fill="currentColor"
        />
      </motion.svg>
    </div>
  );
}
