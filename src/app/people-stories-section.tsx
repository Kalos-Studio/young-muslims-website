"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import {
  motion,
  useInView,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "motion/react";

import { STORIES, type Story } from "@/lib/stories";

type PortraitPlacement = {
  story: Story;
  angle: number;
  width: number;
};

const STORY_BY_SLUG = new Map(STORIES.map((story) => [story.slug, story]));

const PORTRAITS: PortraitPlacement[] = [
  { story: STORY_BY_SLUG.get("a-place-to-be-known")!, angle: -34, width: 197 },
  { story: STORY_BY_SLUG.get("the-seat-they-saved")!, angle: 154, width: 220 },
  { story: STORY_BY_SLUG.get("growing-by-serving")!, angle: 91, width: 226 },
  { story: STORY_BY_SLUG.get("rahmah-k")!, angle: 211, width: 240 },
  { story: STORY_BY_SLUG.get("mustafa-r")!, angle: 270, width: 204 },
  {
    story: STORY_BY_SLUG.get("brotherhood-in-the-everyday")!,
    angle: 25,
    width: 246,
  },
];

const ACCENT_BY_THEME = {
  brothers: "var(--color-brand-royal)",
  sisters: "var(--color-brand-jade)",
} as const;

function OrbitPortrait({
  portrait,
  index,
  isVisible,
  isOrbiting,
}: {
  portrait: PortraitPlacement;
  index: number;
  isVisible: boolean;
  isOrbiting: boolean;
}) {
  const radians = (portrait.angle * Math.PI) / 180;
  const xTarget = useMotionValue(0);
  const yTarget = useMotionValue(0);
  const x = useSpring(xTarget, { stiffness: 180, damping: 18, mass: 0.45 });
  const y = useSpring(yTarget, { stiffness: 180, damping: 18, mass: 0.45 });

  return (
    <motion.div
      className="absolute"
      style={{
        left: `${50 + Math.cos(radians) * 43}%`,
        top: `${50 + Math.sin(radians) * 40}%`,
        x: "-50%",
        y: "-50%",
        width: `clamp(${Math.round(portrait.width * 0.66)}px, 16vw, ${portrait.width}px)`,
        aspectRatio: "1 / 1",
      }}
      initial={false}
      animate={{ opacity: isVisible ? 1 : 0, scale: isVisible ? 1 : 0.72 }}
      transition={{
        opacity: { duration: 0.55, delay: index * 0.08 },
        scale: {
          duration: 0.8,
          delay: index * 0.08,
          type: "spring",
          bounce: 0.18,
        },
      }}
    >
      <motion.div
        className="size-full"
        animate={{ rotate: isOrbiting ? 360 : 0 }}
        transition={
          isOrbiting
            ? { duration: 42, ease: "linear", repeat: Infinity }
            : { duration: 0 }
        }
      >
        <motion.div
          className="group relative size-full"
          onPointerMove={(event) => {
            const bounds = event.currentTarget.getBoundingClientRect();
            xTarget.set(
              ((event.clientX - bounds.left) / bounds.width - 0.5) * 28,
            );
            yTarget.set(
              ((event.clientY - bounds.top) / bounds.height - 0.5) * 22,
            );
          }}
          onPointerLeave={() => {
            xTarget.set(0);
            yTarget.set(0);
          }}
          whileHover={{ scale: 1.045 }}
          whileTap={{ scale: 0.97 }}
        >
          <motion.span
            aria-hidden="true"
            className="absolute inset-[7%] rounded-[62%_38%_57%_43%/42%_58%_42%_58%] opacity-0 transition-[opacity,transform] duration-500 ease-out group-focus-within:scale-[1.24] group-focus-within:opacity-90 group-hover:scale-[1.24] group-hover:opacity-90"
            style={{
              backgroundColor: ACCENT_BY_THEME[portrait.story.theme],
              x,
              y,
            }}
          />
          <Link
            href={`/stories?story=${portrait.story.slug}&from=landing`}
            className="absolute inset-0 z-10 cursor-pointer rounded-[58%_42%_55%_45%/47%_58%_42%_53%] outline-none focus-visible:ring-4 focus-visible:ring-brand-royal focus-visible:ring-offset-4 focus-visible:ring-offset-brand-warm-snow"
            aria-label={`Read ${portrait.story.name}'s story`}
          >
            <Image
              src={portrait.story.portrait}
              alt=""
              fill
              sizes="(max-width: 767px) 44vw, (max-width: 1023px) 24vw, 246px"
              className="pointer-events-none object-contain drop-shadow-[0_18px_28px_rgba(23,23,37,0.12)]"
              style={{
                transform: `rotate(${portrait.story.rotation ?? 0}deg)`,
              }}
            />
          </Link>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

export function PeopleStoriesSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const sectionEntered = useInView(sectionRef, { once: true, amount: 0.16 });
  const sectionIsVisible = useInView(sectionRef, { margin: "200px 0px" });
  const headingCentered = useInView(headingRef, {
    once: true,
    margin: "-34% 0px -34% 0px",
  });
  const portraitsAreVisible = reduceMotion ? sectionEntered : headingCentered;
  const isOrbiting = Boolean(
    portraitsAreVisible && sectionIsVisible && !reduceMotion,
  );

  return (
    <section
      ref={sectionRef}
      data-header-theme="light"
      aria-labelledby="people-stories-heading"
      className="relative h-[734px] w-full overflow-hidden bg-brand-warm-snow text-center md:h-[886px] xl:h-[1327px]"
    >
      <motion.div
        className="absolute top-1/2 left-1/2 h-[620px] w-[700px] -translate-x-1/2 -translate-y-1/2 md:h-[760px] md:w-[860px] xl:h-[880px] xl:w-[1180px]"
        animate={{ rotate: isOrbiting ? -360 : 0 }}
        transition={
          isOrbiting
            ? { duration: 42, ease: "linear", repeat: Infinity }
            : { duration: 0 }
        }
      >
        {PORTRAITS.map((portrait, index) => (
          <OrbitPortrait
            key={portrait.story.slug}
            portrait={portrait}
            index={index}
            isVisible={Boolean(portraitsAreVisible)}
            isOrbiting={isOrbiting}
          />
        ))}
      </motion.div>

      <motion.div
        ref={headingRef}
        className="absolute top-1/2 left-1/2 z-20 flex w-[calc(100%-4rem)] max-w-[590px] -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-8"
        initial={false}
        animate={{
          opacity: sectionEntered ? 1 : 0,
          y: sectionEntered ? 0 : 56,
          filter: sectionEntered ? "blur(0px)" : "blur(8px)",
        }}
        transition={{
          duration: reduceMotion ? 0 : 0.9,
          ease: [0.22, 1, 0.36, 1],
        }}
      >
        <h2
          id="people-stories-heading"
          className="text-[30px] leading-normal font-extrabold tracking-[-0.02em] text-brand-obsidian md:text-[36px] xl:text-landing-section"
        >
          But a number can&apos;t show you what it actually feels like.
          <br />
          <span className="text-landing-cyan">The people can</span>.
        </h2>
        <Link
          href="/stories"
          className="inline-flex w-full justify-center bg-brand-royal px-6 py-4 text-nav font-bold text-brand-pure-white transition-colors hover:bg-brand-royal/80 focus-visible:ring-2 focus-visible:ring-brand-royal focus-visible:ring-offset-2 focus-visible:ring-offset-brand-warm-snow focus-visible:outline-none sm:w-auto"
        >
          View Stories
        </Link>
      </motion.div>
    </section>
  );
}
