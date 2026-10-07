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

import principleDiversity from "../../design-assets/figma/landing-2026/new-sections/208-3-source-03.jpeg";
import principleImpact from "../../design-assets/figma/landing-2026/new-sections/208-3-source-04.jpeg";
import principleSustainability from "../../design-assets/figma/landing-2026/new-sections/208-3-source-09.jpeg";
import principleTarbiyyah from "../../design-assets/figma/landing-2026/new-sections/208-3-source-01.jpeg";

const INTRO_SCROLL_VIEWPORTS = 1;
const SCROLL_VIEWPORTS_PER_PRINCIPLE = 3;
const REVEAL_SCROLL_VIEWPORTS = 1;

const PRINCIPLES = [
  {
    title: "TARBIYYAH",
    description:
      "Growth rooted in Deen. Everything we do is meant to bring young Muslims closer to their faith and to their best selves.",
    image: principleTarbiyyah,
    imageClass:
      "absolute top-0 left-[-3.95%] h-[101.17%] w-[107.9%] max-w-none",
    echoes: ["SOCIETAL IMPACT", "SUSTAINABILITY", "DIVERSITY"],
  },
  {
    title: "DIVERSITY",
    description:
      "Every background, every level of practice, every kind of person. The average member is just a young Muslim looking for their people.",
    image: principleDiversity,
    imageClass:
      "absolute top-[-2.93%] left-[-4.89%] h-[102.93%] w-[109.78%] max-w-none",
    echoes: ["SOCIETAL IMPACT", "SUSTAINABILITY"],
  },
  {
    title: "SUSTAINABILITY",
    description:
      "Built to last. Peer-led leadership that renews itself, so Young Muslims is here for the next generation too.",
    image: principleSustainability,
    imageClass:
      "absolute top-[-26.95%] left-[-18.43%] h-[128.32%] w-[136.86%] max-w-none",
    echoes: ["SOCIETAL IMPACT"],
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

function PrincipleContent({ principle }: { principle: Principle }) {
  return (
    <div className="absolute top-1/2 left-1/2 h-[1024px] w-full min-w-[1440px] -translate-x-1/2 -translate-y-1/2">
      <Image
        src={principle.image}
        alt=""
        sizes="1540px"
        className={principle.imageClass}
      />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(191,206,219,0)_9.5%,rgba(23,23,37,0.48)_109.91%)]" />

      <div className="absolute top-[366px] left-1/2 z-10 h-[414px] w-[560px] -translate-x-1/2 text-center text-brand-pure-white">
        {principle.echoes.map((echo, echoIndex) => (
          <p
            key={echo}
            className="absolute left-1/2 -translate-x-1/2 font-display whitespace-nowrap text-transparent"
            style={{
              top: `${82 + echoIndex * 83}px`,
              fontSize: `${45 + echoIndex * 2.7}px`,
              letterSpacing: "-0.02em",
              opacity: 0.16 + echoIndex * 0.16,
              WebkitTextStroke: "1px rgba(255,255,255,0.9)",
            }}
          >
            {echo}
          </p>
        ))}
        <p className="absolute top-[254px] left-1/2 -translate-x-1/2 font-display text-[54px] tracking-[-0.02em] whitespace-nowrap">
          {principle.title}
        </p>
        <p className="absolute top-[361px] left-1/2 w-[465px] -translate-x-1/2 text-base font-medium tracking-[-0.02em]">
          {principle.description}
        </p>
      </div>

      <Link
        href="/about"
        className="absolute top-[788px] left-1/2 z-10 -translate-x-1/2 border border-brand-warm-snow px-6 py-4 text-nav font-bold text-brand-warm-snow transition-colors hover:bg-brand-warm-snow hover:text-brand-obsidian focus-visible:ring-2 focus-visible:ring-brand-warm-snow focus-visible:ring-offset-2 focus-visible:ring-offset-brand-obsidian focus-visible:outline-none"
      >
        Learn more
      </Link>
    </div>
  );
}

function PrincipleSection({ principle }: { principle: Principle }) {
  return (
    <section
      data-header-theme="dark"
      className="relative h-screen min-h-[860px] w-full overflow-hidden bg-brand-obsidian"
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

  return (
    <motion.div
      className="absolute inset-0 overflow-hidden bg-brand-obsidian will-change-transform"
      style={{ y: panelY, zIndex: index + 1 }}
    >
      <motion.div
        className="absolute inset-0 will-change-transform"
        style={{ y: contentY }}
      >
        <PrincipleContent principle={principle} />
      </motion.div>
    </motion.div>
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
    ["calc(100vh - 132px)", "0px"],
  );
  const headingOpacity = useTransform(
    scrollYProgress,
    [0, introEnd * 0.65],
    [0, 1],
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
          className="flex min-h-screen items-start justify-center px-6 pt-[132px] text-center text-brand-obsidian"
        >
          <div className="w-[538px] max-w-full">
            <h2 className="text-landing-section font-extrabold">
              What we stand on.
            </h2>
            <p className="mt-4 text-landing-copy font-medium">
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
      className="relative h-[1400vh] w-full bg-brand-warm-snow"
    >
      <div className="sticky top-0 h-screen min-h-[860px] w-full overflow-hidden bg-brand-warm-snow">
        <motion.div
          data-over-image={headingOnImage ? "true" : "false"}
          className={`what-we-stand-on-heading absolute top-[132px] left-1/2 z-20 w-[538px] max-w-[calc(100%-48px)] -translate-x-1/2 text-center transition-colors duration-300 ${headingOnImage ? "text-brand-warm-snow" : "text-brand-obsidian"}`}
          style={{ opacity: headingOpacity, y: headingY }}
        >
          <h2 className="text-landing-section font-extrabold">
            What we stand on.
          </h2>
          <p className="mt-4 text-landing-copy font-medium">
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
      </div>
    </section>
  );
}
