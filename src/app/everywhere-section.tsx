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
      <p className="font-display text-[32px] leading-normal font-normal tracking-[-0.02em] md:text-landing-stat">
        <span
          ref={numberRef}
          aria-label={`${numberFormatter.format(target)}${suffix}`}
        >
          {numberFormatter.format(target)}
          {suffix}
        </span>
      </p>
      <p className="text-lg leading-normal font-semibold tracking-[-0.02em] md:text-landing-stat-label md:font-medium">
        {label}
      </p>
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
      className="relative h-[1471px] w-full overflow-hidden bg-brand-warm-snow md:h-[1615px]"
    >
      <div className="absolute top-0 left-1/2 h-full w-[360px] -translate-x-1/2 md:w-[1440px]">
        <motion.div
          initial={false}
          animate={{
            opacity: reduceMotion || headingIsRevealed ? 1 : 0,
            y: reduceMotion || headingIsRevealed ? 0 : 32,
          }}
          transition={{ duration: 0.65, ease: [0.19, 1, 0.22, 1] }}
          className="absolute top-[41px] left-1/2 w-[296px] -translate-x-1/2 text-center text-brand-obsidian md:top-[95px] md:w-[440px]"
        >
          <h2 className="text-[30px] leading-normal font-extrabold tracking-[-0.02em] md:text-landing-section">
            And it&apos;s not just here. It&apos;s{" "}
            <span className="text-landing-cyan">everywhere</span>.
          </h2>
          <p className="mt-4 text-base leading-normal font-medium tracking-[-0.02em] md:text-landing-copy">
            What started as a few friends in one city is now a network that
            spans the country.
          </p>
        </motion.div>

        <div
          ref={metricsRef}
          className="absolute top-[281px] left-0 h-[358px] w-full md:top-[485px] md:h-[121px]"
        >
          {METRICS.map((metric, index) => (
            <CountUpMetric
              key={metric.label}
              {...metric}
              isActive={metricsAreVisible}
              reduceMotion={reduceMotion}
              className={
                index === 0
                  ? "left-1/2 -translate-x-1/2 md:left-[181px] md:translate-x-0"
                  : index === 1
                    ? "top-[152px] left-1/2 -translate-x-1/2 md:top-0 md:left-[669px] md:translate-x-0"
                    : "top-[304px] left-1/2 -translate-x-1/2 md:top-0 md:left-[1001px] md:translate-x-0"
              }
            />
          ))}
        </div>

        <div
          role="img"
          aria-label="Map showing Young Muslims NeighborNet communities across the United States"
          className="absolute top-[705px] left-1/2 h-[795px] w-[1440px] origin-top -translate-x-1/2 scale-[0.339] md:top-[654px] md:left-0 md:translate-x-0 md:scale-100"
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
            className="absolute top-[178px] left-[261px] h-[205px] w-[215px] max-w-none md:top-[109px] md:left-[1025px] md:h-auto md:w-auto"
          />
          <Image
            src={topPhoto}
            alt=""
            className="absolute top-[204px] left-[288px] h-[153px] w-[160px] object-contain md:top-[144px] md:left-[1061px] md:h-[202px] md:w-[211px]"
          />
        </motion.div>

        <motion.div
          className="absolute inset-0"
          style={{ y: bottomLeftPortraitY }}
        >
          <div className="absolute top-[1192px] left-[-113px] h-[272px] w-[269px] md:top-[1375px] md:left-[79px] md:h-[371px] md:w-[366px]">
            <Image
              src={bottomLeftShell}
              alt=""
              className="absolute top-1/2 left-1/2 h-[277px] w-[263px] -translate-x-1/2 -translate-y-1/2 -rotate-30"
            />
          </div>
          <div className="absolute top-[1224px] left-[-82px] h-[210px] w-[207px] md:top-[1388px] md:left-[122px] md:h-[285px] md:w-[282px]">
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
            className="absolute top-[1234px] left-[262px] h-[209px] w-[203px] max-w-none md:top-[1301px] md:left-[1071px] md:h-auto md:w-auto"
          />
          <Image
            src={bottomRightPhoto}
            alt=""
            className="absolute top-[1255px] left-[283px] h-[167px] w-[163px] object-contain md:top-[1328px] md:left-[1098px] md:h-[217px] md:w-[211px]"
          />
        </motion.div>

        <p className="absolute top-[1016px] left-1/2 w-[296px] -translate-x-1/2 text-center text-base leading-normal font-medium tracking-[-0.02em] text-brand-obsidian md:top-[1406px] md:w-[560px] md:text-landing-copy">
          Wherever you go, there&apos;s a Young Muslim. A brother or sister in a
          city you&apos;ve never been to, dealing with the same things you are
        </p>
        <Link
          href="/neighbornets"
          className="absolute top-[1134px] left-1/2 inline-flex w-[296px] -translate-x-1/2 justify-center bg-brand-royal px-6 py-4 text-nav font-bold whitespace-nowrap text-brand-pure-white transition-colors hover:bg-brand-royal/80 focus-visible:ring-2 focus-visible:ring-brand-royal focus-visible:ring-offset-2 focus-visible:ring-offset-brand-warm-snow focus-visible:outline-none md:top-[1511px] md:w-auto"
        >
          Discover NeighborNets
        </Link>
      </div>
    </section>
  );
}
