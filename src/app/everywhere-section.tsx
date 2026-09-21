"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import {
  animate,
  motion,
  useInView,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from "motion/react";

import { PersonOutline } from "@/components/wireframe/person-outline";

const RESTING_OFFSET = "calc(var(--spacing) * 0)";
const LEFT_PORTRAIT_START = "calc(var(--spacing) * 20)";
const LEFT_PORTRAIT_END = "calc(var(--spacing) * -20)";
const RIGHT_PORTRAIT_START = "calc(var(--spacing) * -12)";
const RIGHT_PORTRAIT_END = "calc(var(--spacing) * 12)";
const COUNT_UP_DURATION_SECONDS = 1.5;

const METRICS = [
  { target: 200, suffix: "+", label: "NeighborNets" },
  { target: 26, suffix: "", label: "states" },
  { target: 10_000, suffix: "s", label: "of young Muslims" },
] as const;

const numberFormatter = new Intl.NumberFormat("en-US");

function CountUpMetric({
  isActive,
  target,
  suffix,
  label,
  reduceMotion,
}: {
  isActive: boolean;
  target: number;
  suffix: string;
  label: string;
  reduceMotion: boolean | null;
}) {
  const numberRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const numberElement = numberRef.current;

    if (!numberElement) return;

    const setNumber = (value: number) => {
      numberElement.textContent = `${numberFormatter.format(Math.round(value))}${suffix}`;
    };

    if (reduceMotion) {
      setNumber(target);
      return;
    }

    if (!isActive) {
      setNumber(0);
      return;
    }

    const countAnimation = animate(0, target, {
      duration: COUNT_UP_DURATION_SECONDS,
      onUpdate: setNumber,
    });

    return () => countAnimation.stop();
  }, [isActive, reduceMotion, suffix, target]);

  return (
    <div className="min-h-[133px]">
      <p className="font-display text-stat font-normal">
        <span
          ref={numberRef}
          aria-label={`${numberFormatter.format(target)}${suffix}`}
        >
          {numberFormatter.format(target)}
          {suffix}
        </span>
      </p>
      <p className="mt-2 text-lead font-medium">{label}</p>
    </div>
  );
}

function YouthPortrait({
  className,
  y,
}: {
  className?: string;
  y: MotionValue<string>;
}) {
  return (
    <motion.div
      className={`flex size-28 shrink-0 items-center justify-center rounded-full border-4 border-brand-jade bg-muted text-muted-foreground ${className ?? ""}`}
      style={{ y }}
      aria-label="Portrait image placeholder"
    >
      <PersonOutline className="h-1/2 w-1/2" />
    </motion.div>
  );
}

export function EverywhereSection({ children }: { children: ReactNode }) {
  const sectionRef = useRef<HTMLElement>(null);
  const metricsRef = useRef<HTMLDivElement>(null);
  const [headingIsRevealed, setHeadingIsRevealed] = useState(false);
  const reduceMotion = useReducedMotion();
  const metricsAreVisible = useInView(metricsRef, { once: true });
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    if (latest > 0 && !headingIsRevealed) {
      setHeadingIsRevealed(true);
    }
  });

  const leftPortraitY = useTransform(
    scrollYProgress,
    [0, 1],
    reduceMotion
      ? [RESTING_OFFSET, RESTING_OFFSET]
      : [LEFT_PORTRAIT_START, LEFT_PORTRAIT_END],
  );
  const rightPortraitY = useTransform(
    scrollYProgress,
    [0, 1],
    reduceMotion
      ? [RESTING_OFFSET, RESTING_OFFSET]
      : [RIGHT_PORTRAIT_START, RIGHT_PORTRAIT_END],
  );

  return (
    <section
      ref={sectionRef}
      data-header-theme="light"
      className="min-h-[1962px] pt-[280px] text-center"
    >
      <motion.div
        className="mx-auto min-h-[219px] w-full max-w-[560px]"
        initial={false}
        animate={{ opacity: reduceMotion || headingIsRevealed ? 1 : 0 }}
      >
        <h2 className="text-section font-extrabold">
          And it&apos;s not just here.
          <br />
          It&apos;s everywhere.
        </h2>
        <p className="mt-8 text-lead font-medium">
          What started as a few friends in one city is now a network that spans
          the country.
        </p>
      </motion.div>

      <div ref={metricsRef} className="mt-[171px] grid grid-cols-3 gap-10">
        {METRICS.map((metric) => (
          <CountUpMetric
            key={metric.label}
            isActive={metricsAreVisible}
            target={metric.target}
            suffix={metric.suffix}
            label={metric.label}
            reduceMotion={reduceMotion}
          />
        ))}
      </div>

      {children}

      <div className="mt-[70px] flex items-center justify-center gap-12">
        <YouthPortrait y={leftPortraitY} />
        <p className="max-w-[560px] text-lead font-medium">
          Wherever you go, there&apos;s a Young Muslim. A brother or sister in a
          city you&apos;ve never been to, dealing with the same things you are.
        </p>
        <YouthPortrait y={rightPortraitY} className="border-landing-cyan" />
      </div>
    </section>
  );
}
