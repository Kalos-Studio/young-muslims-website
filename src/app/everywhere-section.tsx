"use client";

import Image from "next/image";
import Link from "next/link";
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

import bottomLeftShell from "../../design-assets/figma/landing-2026/everywhere-bottom-left-shell.svg";
import bottomRightPhoto from "../../design-assets/figma/landing-2026/everywhere-bottom-right-photo.png";
import bottomRightShell from "../../design-assets/figma/landing-2026/everywhere-bottom-right-shell.svg";
import globe from "../../design-assets/figma/landing-2026/everywhere-globe.svg";
import mapCanada from "../../design-assets/figma/landing-2026/everywhere-map/canada.svg";
import mapMexico from "../../design-assets/figma/landing-2026/everywhere-map/mexico.svg";
import mapUs from "../../design-assets/figma/landing-2026/everywhere-map/us.svg";
import mapUsMask from "../../design-assets/figma/landing-2026/everywhere-map/us-mask.svg";
import leftPhoto from "../../design-assets/figma/landing-2026/everywhere-left-photo.png";
import topPhoto from "../../design-assets/figma/landing-2026/everywhere-top-photo.png";
import topShell from "../../design-assets/figma/landing-2026/everywhere-top-shell.svg";

const METRICS = [
  { target: 200, suffix: "+", label: "NeighborNets" },
  { target: 26, suffix: "", label: "states" },
  { target: 10_000, suffix: "s", label: "of young Muslims" },
] as const;

const MAP_GLOWS = [
  {
    className: "top-[176px] left-[333px] size-[57px] bg-brand-jade/75",
    x: [0, 9, -5, 0],
    y: [0, -7, 5, 0],
    duration: 15,
  },
  {
    className: "top-[344px] left-[311px] size-[68px] bg-brand-royal/80",
    x: [0, -8, 7, 0],
    y: [0, 8, -4, 0],
    duration: 17,
  },
  {
    className: "top-[410px] left-[410px] size-[56px] bg-brand-royal/80",
    x: [0, 8, -6, 0],
    y: [0, -5, 7, 0],
    duration: 14,
  },
  {
    className: "top-[461px] left-[367px] size-[61px] bg-brand-jade/75",
    x: [0, -7, 6, 0],
    y: [0, 6, -7, 0],
    duration: 18,
  },
  {
    className: "top-[480px] left-[450px] size-[48px] bg-brand-jade/70",
    x: [0, 6, -4, 0],
    y: [0, -8, 5, 0],
    duration: 16,
  },
  {
    className: "top-[444px] left-[682px] size-[48px] bg-brand-jade/65",
    x: [0, -6, 8, 0],
    y: [0, 5, -6, 0],
    duration: 19,
  },
  {
    className: "top-[496px] left-[673px] size-[97px] bg-brand-jade/65",
    x: [0, 10, -7, 0],
    y: [0, -6, 7, 0],
    duration: 21,
  },
  {
    className: "top-[547px] left-[676px] size-[116px] bg-brand-royal/55",
    x: [0, -9, 10, 0],
    y: [0, 7, -5, 0],
    duration: 23,
  },
  {
    className: "top-[251px] left-[730px] size-[73px] bg-brand-royal/80",
    x: [0, 7, -8, 0],
    y: [0, -6, 8, 0],
    duration: 16,
  },
  {
    className: "top-[329px] left-[732px] size-[61px] bg-brand-jade/70",
    x: [0, -8, 6, 0],
    y: [0, 7, -5, 0],
    duration: 18,
  },
  {
    className: "top-[304px] left-[822px] size-[80px] bg-brand-jade/65",
    x: [0, 9, -6, 0],
    y: [0, -5, 8, 0],
    duration: 20,
  },
  {
    className: "top-[376px] left-[855px] size-[76px] bg-brand-jade/75",
    x: [0, -6, 8, 0],
    y: [0, 8, -6, 0],
    duration: 17,
  },
  {
    className: "top-[415px] left-[825px] size-[72px] bg-brand-royal/70",
    x: [0, 7, -7, 0],
    y: [0, -7, 6, 0],
    duration: 22,
  },
  {
    className: "top-[276px] left-[1003px] size-[93px] bg-brand-royal/80",
    x: [0, -9, 7, 0],
    y: [0, 6, -8, 0],
    duration: 19,
  },
  {
    className: "top-[337px] left-[970px] size-[78px] bg-brand-jade/65",
    x: [0, 8, -6, 0],
    y: [0, -8, 6, 0],
    duration: 21,
  },
  {
    className: "top-[397px] left-[940px] size-[70px] bg-brand-royal/75",
    x: [0, -7, 9, 0],
    y: [0, 6, -5, 0],
    duration: 18,
  },
  {
    className: "top-[464px] left-[893px] size-[88px] bg-brand-royal/70",
    x: [0, 8, -8, 0],
    y: [0, -5, 7, 0],
    duration: 20,
  },
  {
    className: "top-[515px] left-[946px] size-[112px] bg-brand-royal/55",
    x: [0, -9, 7, 0],
    y: [0, 8, -6, 0],
    duration: 24,
  },
];

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

        <div
          role="img"
          aria-label="Map showing Young Muslims NeighborNet communities across the United States"
          className="absolute top-[654px] left-0 h-[795px] w-[1440px]"
        >
          <Image
            src={globe}
            alt=""
            className="absolute inset-x-0 top-0 max-w-none"
          />
          <div
            className="pointer-events-none absolute inset-0 overflow-hidden rounded-[16px]"
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

            <div
              aria-hidden="true"
              className="absolute inset-0"
              style={{
                maskImage: `url("${mapUsMask.src}")`,
                maskPosition: "-259px -375px",
                maskRepeat: "no-repeat",
                maskSize: "1330.06px 964.254px",
                WebkitMaskImage: `url("${mapUsMask.src}")`,
                WebkitMaskPosition: "-259px -375px",
                WebkitMaskRepeat: "no-repeat",
                WebkitMaskSize: "1330.06px 964.254px",
              }}
            >
              {MAP_GLOWS.map((glow, index) => (
                <motion.span
                  key={`${glow.className}-${index}`}
                  className={`absolute rounded-full mix-blend-multiply blur-xl ${glow.className}`}
                  animate={
                    reduceMotion
                      ? undefined
                      : {
                          x: glow.x,
                          y: glow.y,
                          scale: [1, 1.08, 0.96, 1],
                        }
                  }
                  transition={{
                    duration: glow.duration,
                    ease: "easeInOut",
                    repeat: Infinity,
                  }}
                >
                  <span
                    className={`absolute inset-[14%] rounded-full opacity-90 mix-blend-multiply blur-lg ${
                      glow.className.includes("bg-brand-jade")
                        ? "bg-brand-royal/90"
                        : "bg-brand-jade/90"
                    }`}
                  />
                  <span className="everywhere-map-hotspot-core absolute inset-[30%] rounded-full mix-blend-multiply" />
                </motion.span>
              ))}
            </div>
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
        <Link
          href="/neighbornets"
          className="absolute top-[1511px] left-1/2 -translate-x-1/2 bg-brand-royal px-6 py-4 text-nav font-bold whitespace-nowrap text-brand-pure-white transition-colors hover:bg-brand-royal/80 focus-visible:ring-2 focus-visible:ring-brand-royal focus-visible:ring-offset-2 focus-visible:ring-offset-brand-warm-snow focus-visible:outline-none"
        >
          Discover NeighborNets
        </Link>
      </div>
    </section>
  );
}
