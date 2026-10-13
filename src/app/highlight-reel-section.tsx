"use client";

import Image from "next/image";
import { useRef } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "motion/react";

import belongingWaveObsidian from "../../design-assets/figma/landing-2026/belonging-wave-obsidian.svg";

const TRAVEL_DISTANCE = 800;
const MARQUEE_COPY = "Sisterhood. Brotherhood. Community Service. Tarbiyyah.";
const MARQUEE_REPETITIONS = 5;

export function HighlightReelIncomingShape() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const riseY = useTransform(
    scrollYProgress,
    [0.48, 0.9],
    shouldReduceMotion ? [0, 0] : [0, -760],
  );

  return (
    <div
      ref={sectionRef}
      className="pointer-events-none absolute inset-0 z-[1] overflow-hidden"
      aria-hidden="true"
    >
      <div className="absolute top-[1712.19px] left-[calc(50%-115.01px)] flex h-[1772.44px] w-[2786.86px] -translate-x-1/2 -translate-y-1/2 items-center justify-center md:top-[1375px] md:left-[-781px] md:translate-x-0 md:translate-y-0">
        <motion.div style={{ y: riseY }}>
          <div className="rotate-[-9.8deg]">
            <Image
              src={belongingWaveObsidian}
              alt=""
              className="block max-w-none"
            />
          </div>
        </motion.div>
      </div>
    </div>
  );
}

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
      <div className="absolute inset-x-0 top-[330px] flex flex-col gap-2 font-display text-[30px] leading-[1.05] whitespace-nowrap uppercase md:top-[501px] md:gap-[19px] md:text-marquee md:leading-none">
        <motion.div
          className="-ml-[400px] flex w-max gap-6 text-brand-warm-snow md:-ml-[1200px] md:gap-8"
          style={{ x: leftwardX }}
        >
          {Array.from({ length: MARQUEE_REPETITIONS }).map((_, index) => (
            <span key={index} className="shrink-0">
              {MARQUEE_COPY}
            </span>
          ))}
        </motion.div>
        <motion.div
          className="-ml-[1000px] flex w-max gap-6 text-landing-marquee-outline md:-ml-[1700px] md:gap-8"
          style={{ x: rightwardX }}
        >
          {Array.from({ length: MARQUEE_REPETITIONS }).map((_, index) => (
            <span key={index} className="shrink-0">
              {MARQUEE_COPY}
            </span>
          ))}
        </motion.div>
        <motion.div
          className="-ml-[600px] flex w-max gap-6 text-brand-warm-snow md:-ml-[1000px] md:gap-8"
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
