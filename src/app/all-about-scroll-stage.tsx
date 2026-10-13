"use client";

import { type ReactNode, useRef } from "react";
import {
  type MotionValue,
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "motion/react";

const CARD_MOTION = [
  { input: [0, 0.85], output: [560, -600] },
  { input: [0.05, 1], output: [620, -480] },
  { input: [0, 1], output: [300, -780] },
  { input: [0.12, 1], output: [520, -620] },
] as const;

const firstCardInitialY = CARD_MOTION[0].output[0];
const firstCardSettleProgress =
  (CARD_MOTION[0].input[1] * firstCardInitialY) /
  (firstCardInitialY - CARD_MOTION[0].output[1]);

function MovingCard({
  card,
  index,
  progress,
}: {
  card: ReactNode;
  index: number;
  progress: MotionValue<number>;
}) {
  const motionRange = CARD_MOTION[index];
  const y = useTransform(
    progress,
    [...motionRange.input],
    [...motionRange.output],
  );

  return (
    <motion.div
      className="pointer-events-none absolute inset-0 will-change-transform"
      style={{ y }}
    >
      {card}
    </motion.div>
  );
}

export function AllAboutScrollStage({
  intro,
  cards,
  decorations,
}: {
  intro: ReactNode;
  cards: readonly ReactNode[];
  decorations: ReactNode;
}) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });
  const introY = useTransform(
    scrollYProgress,
    [0, firstCardSettleProgress],
    [firstCardInitialY, 0],
  );

  const mobileStage = (
    <div className="absolute top-0 left-1/2 h-full w-[360px] -translate-x-1/2 md:hidden">
      {decorations}
      <div className="absolute top-[267px] left-8 w-[296px] text-brand-obsidian">
        {intro}
      </div>
      {cards}
    </div>
  );

  if (reduceMotion) {
    return (
      <div ref={sectionRef} className="relative h-full">
        {mobileStage}
        <div className="absolute top-[405px] left-1/2 hidden h-full w-[1440px] -translate-x-1/2 md:block">
          <div className="all-about-static-decoration contents">
            {decorations}
          </div>
          <div className="absolute top-[130px] left-[90px] w-[538px] text-brand-obsidian">
            {intro}
          </div>
          {cards}
        </div>
      </div>
    );
  }

  return (
    <div ref={sectionRef} className="relative h-full">
      {mobileStage}
      <div className="sticky top-0 hidden h-screen overflow-hidden md:block">
        <div className="absolute top-0 left-1/2 h-full w-[1440px] -translate-x-1/2">
          <div className="all-about-sticky-decoration contents">
            {decorations}
          </div>
          <motion.div
            className="absolute top-[130px] left-[90px] w-[538px] text-brand-obsidian"
            style={{ y: introY }}
          >
            {intro}
          </motion.div>
          {cards.map((card, index) => (
            <MovingCard
              key={index}
              card={card}
              index={index}
              progress={scrollYProgress}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
