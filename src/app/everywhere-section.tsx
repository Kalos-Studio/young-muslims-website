"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import {
  animate,
  motion,
  useInView,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
} from "motion/react";

import globe from "../../design-assets/figma/landing-2026/everywhere-globe.svg";
import mapCanada from "../../design-assets/figma/landing-2026/everywhere-map/canada.svg";
import mapMexico from "../../design-assets/figma/landing-2026/everywhere-map/mexico.svg";
import mapUs from "../../design-assets/figma/landing-2026/everywhere-map/us.svg";
import bottomLeftShell from "../../design-assets/figma/landing-2026/everywhere-bottom-left-shell.svg";
import bottomRightPhoto from "../../design-assets/figma/landing-2026/everywhere-bottom-right-photo.png";
import bottomRightShell from "../../design-assets/figma/landing-2026/everywhere-bottom-right-shell.svg";
import leftPhoto from "../../design-assets/figma/landing-2026/everywhere-left-photo.png";
import topPhoto from "../../design-assets/figma/landing-2026/everywhere-top-photo.png";
import topShell from "../../design-assets/figma/landing-2026/everywhere-top-shell.svg";

const METRICS = [
  { target: 200, suffix: "+", label: "NeighborNets" },
  { target: 26, suffix: "", label: "states" },
  { target: 10_000, suffix: "s", label: "of young Muslims" },
] as const;

const numberFormatter = new Intl.NumberFormat("en-US");

function CountUpMetric({
  target,
  suffix,
  label,
  isActive,
  reduceMotion,
  className,
}: {
  target: number;
  suffix: string;
  label: string;
  isActive: boolean;
  reduceMotion: boolean | null;
  className?: string;
}) {
  const numberRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const element = numberRef.current;
    if (!element) return;

    const setNumber = (value: number) => {
      element.textContent = `${numberFormatter.format(Math.round(value))}${suffix}`;
    };

    if (reduceMotion) {
      setNumber(target);
      return;
    }

    if (!isActive) {
      setNumber(0);
      return;
    }

    const controls = animate(0, target, {
      duration: 1.5,
      onUpdate: setNumber,
    });

    return () => controls.stop();
  }, [isActive, reduceMotion, suffix, target]);

  return (
    <div
      className={`absolute top-0 text-center text-brand-obsidian ${className ?? ""}`}
    >
      <p className="font-display text-landing-stat font-normal">
        <span
          ref={numberRef}
          aria-label={`${numberFormatter.format(target)}${suffix}`}
        >
          {numberFormatter.format(target)}
          {suffix}
        </span>
      </p>
      <p className="text-landing-stat-label font-medium">{label}</p>
    </div>
  );
}

export function EverywhereSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const metricsRef = useRef<HTMLDivElement>(null);
  const [headingIsRevealed, setHeadingIsRevealed] = useState(false);
  const metricsAreVisible = useInView(metricsRef, { once: true });
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    if (latest > 0.08 && !headingIsRevealed) setHeadingIsRevealed(true);
  });

  const topPortraitY = useTransform(
    scrollYProgress,
    [0, 1],
    reduceMotion ? [0, 0] : [80, -80],
  );
  const bottomLeftPortraitY = useTransform(
    scrollYProgress,
    [0, 1],
    reduceMotion ? [0, 0] : [70, -70],
  );
  const bottomRightPortraitY = useTransform(
    scrollYProgress,
    [0, 1],
    reduceMotion ? [0, 0] : [-60, 60],
  );

  return (
    <section
      ref={sectionRef}
      data-header-theme="light"
      className="relative h-[1615px] w-full overflow-hidden bg-brand-warm-snow"
    >
      <div className="absolute top-0 left-1/2 h-full w-[1440px] -translate-x-1/2">
        <motion.div
          initial={false}
          animate={{
            opacity: reduceMotion || headingIsRevealed ? 1 : 0,
            y: reduceMotion || headingIsRevealed ? 0 : 32,
          }}
          transition={{ duration: 0.65, ease: [0.19, 1, 0.22, 1] }}
          className="absolute top-[95px] left-1/2 w-[440px] -translate-x-1/2 text-center text-brand-obsidian"
        >
          <h2 className="text-landing-section font-extrabold">
            And it&apos;s not just here. It&apos;s{" "}
            <span className="text-landing-cyan">everywhere</span>.
          </h2>
          <p className="mt-4 text-landing-copy font-medium">
            What started as a few friends in one city is now a network that
            spans the country.
          </p>
        </motion.div>

        <div
          ref={metricsRef}
          className="absolute top-[485px] left-0 h-[121px] w-full"
        >
          {METRICS.map((metric, index) => (
            <CountUpMetric
              key={metric.label}
              {...metric}
              isActive={metricsAreVisible}
              reduceMotion={reduceMotion}
              className={
                index === 0
                  ? "left-[181px]"
                  : index === 1
                    ? "left-[669px]"
                    : "left-[1001px]"
              }
            />
          ))}
        </div>

        <Image
          src={globe}
          alt=""
          className="absolute top-[654px] left-0 max-w-none"
        />
        <div
          className="pointer-events-none absolute top-[654px] left-0 h-[795px] w-[1440px] overflow-hidden rounded-[16px]"
          style={{ clipPath: "circle(725px at 720px 756.85px)" }}
        >
          <div className="absolute top-[-875px] left-[-632px] h-[1891px] w-[2522px]">
            <Image
              src={mapCanada}
              alt=""
              className="absolute top-[245px] left-[898px] max-w-none"
            />
            <Image
              src={mapUs}
              alt=""
              className="absolute top-[500px] left-[373px] max-w-none"
            />
            <Image
              src={mapMexico}
              alt=""
              className="absolute top-[1330px] left-[1021px] max-w-none"
            />
          </div>
        </div>

        <motion.div className="absolute inset-0" style={{ y: topPortraitY }}>
          <Image
            src={topShell}
            alt=""
            className="absolute top-[109px] left-[1025px] max-w-none"
          />
          <Image
            src={topPhoto}
            alt=""
            className="absolute top-[144px] left-[1061px] h-[202px] w-[211px] object-contain"
          />
        </motion.div>

        <motion.div
          className="absolute inset-0"
          style={{ y: bottomLeftPortraitY }}
        >
          <div className="absolute top-[1375px] left-[79px] h-[371px] w-[366px]">
            <Image
              src={bottomLeftShell}
              alt=""
              className="absolute top-1/2 left-1/2 h-[277px] w-[263px] -translate-x-1/2 -translate-y-1/2 -rotate-30"
            />
          </div>
          <div className="absolute top-[1388px] left-[122px] h-[285px] w-[282px]">
            <Image
              src={leftPhoto}
              alt=""
              className="absolute top-1/2 left-1/2 h-[213px] w-[202px] -translate-x-1/2 -translate-y-1/2 -rotate-30 object-contain"
            />
          </div>
        </motion.div>

        <motion.div
          className="absolute inset-0"
          style={{ y: bottomRightPortraitY }}
        >
          <Image
            src={bottomRightShell}
            alt=""
            className="absolute top-[1301px] left-[1071px] max-w-none"
          />
          <Image
            src={bottomRightPhoto}
            alt=""
            className="absolute top-[1328px] left-[1098px] h-[217px] w-[211px] object-contain"
          />
        </motion.div>

        <p className="absolute top-[1406px] left-1/2 w-[560px] -translate-x-1/2 text-center text-landing-copy font-medium text-brand-obsidian">
          Wherever you go, there&apos;s a Young Muslim. A brother or sister in a
          city you&apos;ve never been to, dealing with the same things you are
        </p>
      </div>
    </section>
  );
}
