"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";
import {
  motion,
  type MotionValue,
  useAnimationFrame,
  useInView,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
} from "motion/react";

import { AnimatedCtaLabel } from "@/components/ui/animated-arrow";
import { STORIES, type Story } from "@/lib/stories";
import {
  LandingStoryDialog,
  type StorySelection,
} from "./landing-story-dialog";

const PORTRAIT_SLUGS = [
  "a-place-to-be-known",
  "brotherhood-in-the-everyday",
  "growing-by-serving",
  "the-seat-they-saved",
  "rahmah-k",
  "mustafa-r",
];
const PORTRAITS = PORTRAIT_SLUGS.map((slug) =>
  STORIES.find((story) => story.slug === slug)!,
);
const ORBIT_DURATION_MS = 42_000;

function OrbitPortrait({
  story,
  index,
  phase,
  isVisible,
  reduceMotion,
  onSelect,
}: {
  story: Story;
  index: number;
  phase: MotionValue<number>;
  isVisible: boolean;
  reduceMotion: boolean;
  onSelect: (story: Story, trigger: HTMLButtonElement) => void;
}) {
  const angle = (index * Math.PI) / 3 - Math.PI / 6;
  const left = useTransform(
    phase,
    (value) => `${50 + Math.cos(angle + value) * 33}%`,
  );
  const top = useTransform(
    phase,
    (value) => `${50 + Math.sin(angle + value) * 33}%`,
  );

  return (
    <motion.div
      className="absolute aspect-square w-[clamp(112px,23vw,170px)] xl:w-[224px]"
      style={{ left, top, x: "-50%", y: "-50%" }}
    >
      <motion.div
        initial={false}
        animate={{ opacity: isVisible ? 1 : 0, scale: isVisible ? 1 : 0.72 }}
        transition={{
          duration: reduceMotion ? 0 : 0.65,
          delay: reduceMotion ? 0 : index * 0.07,
        }}
        className="size-full"
      >
        <button
          type="button"
          className="group relative block size-full cursor-pointer rounded-full outline-none focus-visible:ring-4 focus-visible:ring-brand-royal focus-visible:ring-offset-4 focus-visible:ring-offset-brand-warm-snow"
          aria-label={`Read ${story.name}'s story`}
          aria-haspopup="dialog"
          tabIndex={isVisible ? 0 : -1}
          onClick={(event) => onSelect(story, event.currentTarget)}
        >
          <span
            className="absolute inset-0"
            style={{ transform: `rotate(${story.rotation ?? 0}deg)` }}
          >
            <span
              aria-hidden="true"
              className="absolute inset-0 opacity-0 transition-[opacity,scale] duration-300 group-hover:scale-[1.12] group-hover:opacity-100 group-focus-visible:scale-[1.12] group-focus-visible:opacity-100 motion-reduce:transition-none"
              style={{
                backgroundColor:
                  story.theme === "brothers"
                    ? "var(--color-brand-royal)"
                    : "var(--color-brand-jade)",
                maskImage: `url(${story.portrait.src})`,
                maskSize: "contain",
                maskRepeat: "no-repeat",
                maskPosition: "center",
              }}
            />
            <Image
              src={story.portrait}
              alt=""
              fill
              sizes="(max-width: 1279px) 170px, 224px"
              className="pointer-events-none object-contain drop-shadow-[0_18px_28px_rgba(23,23,37,0.12)]"
            />
          </span>
        </button>
      </motion.div>
    </motion.div>
  );
}

export function PeopleStoriesSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();
  const sectionEntered = useInView(sectionRef, { once: true, amount: 0.2 });
  const sectionIsVisible = useInView(sectionRef, { margin: "100px 0px" });
  const [selection, setSelection] = useState<StorySelection | null>(null);
  const [hasKeyboardFocus, setHasKeyboardFocus] = useState(false);
  const phase = useMotionValue(0);
  const previousScrollProgress = useRef<number | null>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    const previous = previousScrollProgress.current;
    previousScrollProgress.current = latest;
    if (
      previous === null ||
      !window.matchMedia("(max-width: 767px)").matches ||
      !sectionIsVisible ||
      !sectionEntered ||
      reduceMotion ||
      selection ||
      hasKeyboardFocus
    ) {
      return;
    }

    phase.set(phase.get() - (latest - previous) * Math.PI * 1.5);
  });

  // Accumulate active time so a popup or offscreen pause never resets the orbit.
  useAnimationFrame((_, delta) => {
    if (
      sectionIsVisible &&
      sectionEntered &&
      !reduceMotion &&
      !selection &&
      !hasKeyboardFocus
    ) {
      phase.set(
        (phase.get() -
          (Math.min(delta, 64) / ORBIT_DURATION_MS) * Math.PI * 2) %
          (Math.PI * 2),
      );
    }
  });

  return (
    <section
      ref={sectionRef}
      data-header-theme="light"
      aria-labelledby="people-stories-heading"
      className="relative h-[734px] w-full overflow-hidden bg-brand-warm-snow text-center md:h-[886px] xl:h-[1327px]"
    >
      <div
        className="absolute top-1/2 left-1/2 aspect-square w-[calc(100vw+120px)] max-w-[1140px] -translate-x-1/2 -translate-y-1/2"
        onFocusCapture={(event) => {
          if ((event.target as HTMLElement).matches(":focus-visible")) {
            setHasKeyboardFocus(true);
          }
        }}
        onBlurCapture={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget))
            setHasKeyboardFocus(false);
        }}
      >
        {PORTRAITS.map((story, index) => (
          <OrbitPortrait
            key={story.slug}
            story={story}
            index={index}
            phase={phase}
            isVisible={Boolean(sectionEntered)}
            reduceMotion={Boolean(reduceMotion)}
            onSelect={(selectedStory, trigger) => {
              const { left, top, width, height } =
                trigger.getBoundingClientRect();
              setSelection({
                story: selectedStory,
                trigger,
                bounds: { left, top, width, height },
              });
            }}
          />
        ))}
      </div>
      <div className="pointer-events-none absolute top-1/2 left-1/2 z-20 w-[calc(100%-4rem)] max-w-[590px] -translate-x-1/2 -translate-y-1/2">
        <motion.div
          className="flex flex-col items-center gap-8"
          initial={false}
          animate={{
            opacity: sectionEntered ? 1 : 0,
            y: sectionEntered ? 0 : 32,
          }}
          transition={{ duration: reduceMotion ? 0 : 0.7 }}
        >
          <h2
            id="people-stories-heading"
            className="text-[30px] leading-normal font-extrabold tracking-[-0.02em] text-brand-obsidian md:text-[36px] xl:text-landing-section xl:leading-[1.2]"
          >
            But a number can&apos;t show you what it actually feels like.
            <br />
            <span className="text-landing-cyan">The people can</span>.
          </h2>
          <Link
            href="/stories"
            className="ym-cta-trigger pointer-events-auto inline-flex w-full items-center justify-center gap-2 bg-brand-royal px-6 py-4 text-nav font-bold text-brand-pure-white transition-colors hover:bg-brand-royal/80 focus-visible:ring-2 focus-visible:ring-brand-royal focus-visible:ring-offset-2 focus-visible:ring-offset-brand-warm-snow focus-visible:outline-none sm:w-auto"
          >
            <AnimatedCtaLabel label="View Stories" />
          </Link>
        </motion.div>
      </div>
      {selection && (
        <LandingStoryDialog
          selection={selection}
          onClose={() => {
            setSelection(null);
            setHasKeyboardFocus(false);
          }}
        />
      )}
    </section>
  );
}
