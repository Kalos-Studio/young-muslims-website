"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";
import {
  type MotionValue,
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
} from "motion/react";

import { AnimatedCtaLabel } from "@/components/ui/animated-arrow";

import principleDiversity from "../../design-assets/figma/landing-2026/new-sections/208-3-source-03.jpeg";
import principleImpact from "../../design-assets/figma/landing-2026/new-sections/208-3-source-04.jpeg";
import principleSustainability from "../../design-assets/figma/landing-2026/new-sections/208-3-source-09.jpeg";
import principleTarbiyyah from "../../design-assets/figma/landing-2026/new-sections/208-3-source-01.jpeg";

const INTRO_SCROLL_VIEWPORTS = 1;
const SCROLL_VIEWPORTS_PER_PRINCIPLE = 2;
const REVEAL_SCROLL_VIEWPORTS = 1;
const FINAL_EDGE_CURVE =
  "M 0 350 C 175 45 345 40 520 300 C 705 555 845 105 1000 275";

function shapeCurveAt(reveal: number, width: number, height: number) {
  const remaining = 1 - Math.max(0, Math.min(1, reveal));
  const x = (value: number) => Number((value * width).toFixed(5));
  const y = (value: number) => Number((value * height * remaining).toFixed(5));
  return `M 0 ${y(0.16)} C ${x(0.22)} ${y(0.04)} ${x(0.32)} ${y(0.02)} ${x(0.5)} ${y(0.1)} C ${x(0.69)} ${y(0.18)} ${x(0.78)} ${y(0.02)} ${x(1)} ${y(0.08)}`;
}

function shapeClipAt(reveal: number) {
  return `${shapeCurveAt(reveal, 1, 1)} L 1 1 L 0 1 Z`;
}

function shapeOutlineAt(reveal: number) {
  return shapeCurveAt(reveal, 1000, 1000 / 0.18);
}

const PRINCIPLES = [
  {
    title: "TARBIYYAH",
    description:
      "Growth rooted in Deen. Everything we do is meant to bring young Muslims closer to their faith and to their best selves.",
    image: principleTarbiyyah,
    imageClass:
      "absolute top-0 left-[-3.95%] h-[101.17%] w-[107.9%] max-w-none",
    echoes: [
      { title: "SUSTAINABILITY", level: 1 },
      { title: "DIVERSITY", level: 2 },
    ],
  },
  {
    title: "DIVERSITY",
    description:
      "Every background, every level of practice, every kind of person. The average member is just a young Muslim looking for their people.",
    image: principleDiversity,
    imageClass:
      "absolute top-[-2.93%] left-[-4.89%] h-[102.93%] w-[109.78%] max-w-none",
    echoes: [
      { title: "SOCIETAL IMPACT", level: 1 },
      { title: "SUSTAINABILITY", level: 2 },
    ],
  },
  {
    title: "SUSTAINABILITY",
    description:
      "Built to last. Peer-led leadership that renews itself, so Young Muslims is here for the next generation too.",
    image: principleSustainability,
    imageClass:
      "absolute top-[-26.95%] left-[-18.43%] h-[128.32%] w-[136.86%] max-w-none",
    echoes: [{ title: "SOCIETAL IMPACT", level: 2 }],
  },
  {
    title: "SOCIETAL IMPACT",
    description:
      "Faith turned outward. Service, relief, and advocacy that makes a real difference beyond our own walls.",
    image: principleImpact,
    imageClass:
      "absolute top-[-20.09%] left-[-12.08%] h-[120.06%] w-[128.05%] max-w-none",
    echoes: [],
  },
] as const;

type Principle = (typeof PRINCIPLES)[number];

const TOTAL_SCROLL_VIEWPORTS =
  INTRO_SCROLL_VIEWPORTS + PRINCIPLES.length * SCROLL_VIEWPORTS_PER_PRINCIPLE;

function ShapeOutline({
  y,
  path,
  opacity,
  zIndex,
  stroke,
}: {
  y: MotionValue<string>;
  path: MotionValue<string>;
  opacity: MotionValue<number>;
  zIndex: number;
  stroke: string;
}) {
  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0"
      style={{ y, opacity, zIndex }}
    >
      <svg
        viewBox="0 0 1000 1000"
        preserveAspectRatio="none"
        className="absolute inset-x-0 top-0 h-[18%] w-full overflow-visible"
      >
        <motion.path
          d={path}
          fill="none"
          stroke={stroke}
          strokeWidth="2"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
    </motion.div>
  );
}

function PrincipleContent({ principle }: { principle: Principle }) {
  return (
    <div className="absolute top-1/2 left-1/2 h-[808px] min-h-screen w-full min-w-[360px] -translate-x-1/2 -translate-y-1/2 md:h-[1024px] md:min-w-[1440px]">
      <Image
        src={principle.image}
        alt=""
        fill
        sizes="100vw"
        className="object-cover md:hidden"
      />
      <Image
        src={principle.image}
        alt=""
        sizes="1540px"
        className={`${principle.imageClass} hidden md:block`}
      />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(191,206,219,0)_9.5%,rgba(23,23,37,0.48)_109.91%)]" />

      <div className="absolute top-[229px] left-1/2 z-10 h-[414px] w-[296px] -translate-x-1/2 text-center text-brand-pure-white md:top-[366px] md:w-[560px]">
        {principle.echoes.map((echo) => (
          <p
            key={echo.title}
            className="absolute left-1/2 -translate-x-1/2 font-display whitespace-nowrap text-transparent"
            style={{
              top: `${82 + (echo.level - 1) * 83}px`,
              fontSize:
                echo.level === 1
                  ? "clamp(24px, 3.125vw, 45.026px)"
                  : "clamp(27px, 3.498vw, 50.377px)",
              letterSpacing: "-0.02em",
              opacity: echo.level * 0.16,
              WebkitTextStroke: "1px rgba(255,255,255,0.9)",
            }}
          >
            {echo.title}
          </p>
        ))}
        <p className="absolute top-[254px] left-1/2 -translate-x-1/2 font-display text-[30px] tracking-[-0.02em] whitespace-nowrap md:text-[54px]">
          {principle.title}
        </p>
        <p className="absolute top-[361px] left-1/2 w-[296px] -translate-x-1/2 text-base font-medium tracking-[-0.02em] md:w-[465px]">
          {principle.description}
        </p>
      </div>

      <Link
        href="/about"
        className="ym-cta-trigger absolute top-[671px] left-1/2 z-10 inline-flex w-[296px] -translate-x-1/2 items-center justify-center gap-2 border border-brand-warm-snow px-6 py-4 text-nav font-bold text-brand-warm-snow transition-colors hover:bg-brand-warm-snow hover:text-brand-obsidian focus-visible:ring-2 focus-visible:ring-brand-warm-snow focus-visible:ring-offset-2 focus-visible:ring-offset-brand-obsidian focus-visible:outline-none md:top-[788px] md:w-auto"
      >
        <AnimatedCtaLabel label="Learn more" />
      </Link>
    </div>
  );
}

function PrincipleSection({ principle }: { principle: Principle }) {
  return (
    <section
      data-header-theme="dark"
      className="relative h-[808px] w-full overflow-hidden bg-brand-obsidian md:h-screen md:min-h-[860px]"
    >
      <PrincipleContent principle={principle} />
    </section>
  );
}

function RevealingPrinciple({
  principle,
  index,
  progress,
}: {
  principle: Principle;
  index: number;
  progress: MotionValue<number>;
}) {
  const revealStart =
    (INTRO_SCROLL_VIEWPORTS + index * SCROLL_VIEWPORTS_PER_PRINCIPLE) /
    TOTAL_SCROLL_VIEWPORTS;
  const revealEnd =
    (INTRO_SCROLL_VIEWPORTS +
      index * SCROLL_VIEWPORTS_PER_PRINCIPLE +
      REVEAL_SCROLL_VIEWPORTS) /
    TOTAL_SCROLL_VIEWPORTS;
  const panelY = useTransform(
    progress,
    [revealStart, revealEnd],
    ["100%", "0%"],
  );
  const contentY = useTransform(
    progress,
    [revealStart, revealEnd],
    ["-100%", "0%"],
  );
  const clipPathD = useTransform(progress, (value) =>
    shapeClipAt((value - revealStart) / (revealEnd - revealStart)),
  );
  const outlinePath = useTransform(progress, (value) =>
    shapeOutlineAt((value - revealStart) / (revealEnd - revealStart)),
  );
  const outlineOpacity = useTransform(
    progress,
    [revealStart, revealEnd],
    [1, 0],
  );
  const zIndex = index * 3 + 1;
  const clipId = `stand-on-reveal-${index}`;

  return (
    <>
      <svg aria-hidden="true" className="absolute size-0">
        <defs>
          <clipPath id={clipId} clipPathUnits="objectBoundingBox">
            <motion.path d={clipPathD} />
          </clipPath>
        </defs>
      </svg>
      <motion.div
        data-principle-panel={index}
        className="absolute inset-0 overflow-hidden bg-brand-obsidian"
        style={{ y: panelY, clipPath: `url(#${clipId})`, zIndex }}
      >
        <motion.div className="absolute inset-0" style={{ y: contentY }}>
          <PrincipleContent principle={principle} />
        </motion.div>
      </motion.div>
      <ShapeOutline
        y={panelY}
        path={outlinePath}
        opacity={outlineOpacity}
        zIndex={zIndex + 1}
        stroke="#FCFAF8"
      />
    </>
  );
}

function FinalImageEdge({ progress }: { progress: MotionValue<number> }) {
  const finalImageRevealed =
    (INTRO_SCROLL_VIEWPORTS +
      (PRINCIPLES.length - 1) * SCROLL_VIEWPORTS_PER_PRINCIPLE +
      REVEAL_SCROLL_VIEWPORTS) /
    TOTAL_SCROLL_VIEWPORTS;
  const opacity = useTransform(progress, [finalImageRevealed, 1], [0, 1]);

  return (
    <motion.svg
      data-final-image-edge
      aria-hidden="true"
      viewBox="0 0 1000 1000"
      preserveAspectRatio="none"
      className="pointer-events-none absolute inset-x-0 bottom-0 z-[13] h-[18%] w-full"
      style={{ opacity }}
    >
      <path d={`${FINAL_EDGE_CURVE} L 1000 1000 L 0 1000 Z`} fill="#FCFAF8" />
      <path
        d={FINAL_EDGE_CURVE}
        fill="none"
        stroke="#171725"
        strokeWidth="2"
        vectorEffect="non-scaling-stroke"
      />
    </motion.svg>
  );
}

export function WhatWeStandOnSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [headingOnImage, setHeadingOnImage] = useState(false);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });
  const introEnd = INTRO_SCROLL_VIEWPORTS / TOTAL_SCROLL_VIEWPORTS;
  const headingY = useTransform(
    scrollYProgress,
    [0, introEnd],
    ["calc(100vh - 84px)", "0px"],
  );
  const darkHeaderStart =
    (INTRO_SCROLL_VIEWPORTS + REVEAL_SCROLL_VIEWPORTS * 0.9) /
    TOTAL_SCROLL_VIEWPORTS;

  useMotionValueEvent(scrollYProgress, "change", (progress) => {
    if (reduceMotion || !sectionRef.current) return;

    const imageHasReachedHeading = progress >= darkHeaderStart;
    sectionRef.current.dataset.headerTheme = imageHasReachedHeading
      ? "dark"
      : "light";
    setHeadingOnImage(imageHasReachedHeading);
  });

  if (reduceMotion) {
    return (
      <section ref={sectionRef} className="w-full bg-brand-warm-snow">
        <div
          data-header-theme="light"
          className="flex min-h-[808px] items-start justify-center px-8 pt-[76px] text-center text-brand-obsidian md:min-h-screen md:px-6 md:pt-[84px]"
        >
          <div className="w-[296px] max-w-full md:w-[538px]">
            <h2 className="text-[30px] leading-normal font-extrabold tracking-[-0.02em] md:text-landing-section md:leading-[1.2]">
              What we stand on.
            </h2>
            <p className="mt-4 text-base leading-normal font-medium tracking-[-0.02em] md:text-landing-copy md:leading-[1.2]">
              The friendships are real. So is the foundation underneath them.
              These are what shape everything about Young Muslims.
            </p>
          </div>
        </div>

        {PRINCIPLES.map((principle) => (
          <PrincipleSection key={principle.title} principle={principle} />
        ))}
      </section>
    );
  }

  return (
    <section
      ref={sectionRef}
      data-header-theme="light"
      className="relative w-full bg-brand-warm-snow"
      style={{ height: `${(TOTAL_SCROLL_VIEWPORTS + 1) * 100}vh` }}
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden bg-brand-warm-snow md:min-h-[860px]">
        <motion.div
          data-over-image={headingOnImage ? "true" : "false"}
          className={`what-we-stand-on-heading absolute top-[76px] left-1/2 z-[3] w-[296px] max-w-[calc(100%-64px)] -translate-x-1/2 text-center transition-colors duration-300 md:top-[84px] md:w-[538px] md:max-w-[calc(100%-48px)] ${headingOnImage ? "text-brand-warm-snow" : "text-brand-obsidian"}`}
          style={{ y: headingY }}
        >
          <h2 className="text-[30px] leading-normal font-extrabold tracking-[-0.02em] md:text-landing-section md:leading-[1.2]">
            What we stand on.
          </h2>
          <p className="mt-4 text-base leading-normal font-medium tracking-[-0.02em] md:text-landing-copy md:leading-[1.2]">
            The friendships are real. So is the foundation underneath them.
            These are what shape everything about Young Muslims.
          </p>
        </motion.div>

        {PRINCIPLES.map((principle, index) => (
          <RevealingPrinciple
            key={principle.title}
            principle={principle}
            index={index}
            progress={scrollYProgress}
          />
        ))}
        <FinalImageEdge progress={scrollYProgress} />
      </div>
    </section>
  );
}
