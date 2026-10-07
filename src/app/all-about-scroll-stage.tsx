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
      className="absolute inset-0 will-change-transform"
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

  if (reduceMotion) {
    return (
      <div ref={sectionRef} className="relative h-full">
        <div className="absolute top-[405px] left-1/2 h-full w-[1440px] -translate-x-1/2">
          {decorations}
          <div className="absolute top-[130px] left-[90px] w-[474px] text-brand-obsidian">
            {intro}
          </div>
          {cards}
        </div>
      </div>
    );
  }

  return (
    <div ref={sectionRef} className="relative h-full">
      <div className="sticky top-0 h-screen overflow-hidden">
        <div className="absolute top-0 left-1/2 h-full w-[1440px] -translate-x-1/2">
          {decorations}
          <div className="absolute top-1/2 left-[90px] w-[474px] -translate-y-1/2 text-brand-obsidian">
            {intro}
          </div>
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
