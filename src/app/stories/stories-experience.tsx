"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

import closeIcon from "../../../design-assets/figma/stories/close.svg";
import mustafaWave from "../../../design-assets/figma/stories/mustafa-wave-front.svg";
import quoteMark from "../../../design-assets/figma/stories/quote-mark.svg";
import rahmahWave from "../../../design-assets/figma/stories/rahmah-wave-front.svg";
import { STORIES, getStoryBySlug, type Story } from "@/lib/stories";

const THEME = {
  brothers: {
    background: "bg-brand-royal",
    text: "text-brand-royal",
    ring: "focus-visible:ring-brand-royal",
    color: "var(--color-brand-royal)",
    wave: mustafaWave,
  },
  sisters: {
    background: "bg-brand-jade",
    text: "text-brand-jade",
    ring: "focus-visible:ring-brand-jade",
    color: "var(--color-brand-jade)",
    wave: rahmahWave,
  },
} as const;

const POSITIONS = [
  "top-[4%] left-[2%] md:top-[5%] md:left-[6%]",
  "top-[2%] left-[38%] md:left-[42%]",
  "top-[8%] right-[-10%] md:right-[5%]",
  "bottom-[4%] left-[-10%] md:bottom-[8%] md:left-[8%]",
  "bottom-[1%] left-[37%] md:left-[42%]",
  "right-[-12%] bottom-[8%] md:right-[4%] md:bottom-[11%]",
] as const;

type Expansion = {
  id: number;
  story: Story;
  bounds: { left: number; top: number; width: number; height: number };
};

function ExpansionOverlay({
  expansion,
  onComplete,
}: {
  expansion: Expansion;
  onComplete: (id: number) => void;
}) {
  const theme = THEME[expansion.story.theme];

  return (
    <motion.div
      key={expansion.id}
      className="pointer-events-none fixed z-[60] overflow-hidden text-brand-pure-white"
      style={{ backgroundColor: theme.color }}
      initial={{
        left: expansion.bounds.left,
        top: expansion.bounds.top,
        width: expansion.bounds.width,
        height: expansion.bounds.height,
        borderRadius: "58% 42% 55% 45% / 47% 58% 42% 53%",
      }}
      animate={{
        left: 0,
        top: 0,
        width: "100vw",
        height: "100dvh",
        borderRadius: "0% 0% 0% 0% / 0% 0% 0% 0%",
      }}
      exit={{ opacity: 0, transition: { duration: 0.12 } }}
      transition={{ duration: 0.82, ease: [0.22, 1, 0.36, 1] }}
      onAnimationComplete={() => onComplete(expansion.id)}
      aria-hidden="true"
    >
      <Image
        src={expansion.story.overviewImage ?? expansion.story.heroImage}
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover opacity-80"
      />
      <motion.div
        className="absolute inset-0"
        style={{ backgroundColor: theme.color }}
        initial={{ clipPath: "ellipse(42% 18% at 50% 112%)" }}
        animate={{ clipPath: "ellipse(105% 78% at 50% 105%)" }}
        transition={{ duration: 0.68, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
      />
      <motion.blockquote
        className="absolute bottom-[14%] left-1/2 w-[min(82vw,720px)] -translate-x-1/2 text-center text-[clamp(1.25rem,3vw,2rem)] font-bold tracking-[-0.02em]"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.34 }}
      >
        “{expansion.story.quote}”
      </motion.blockquote>
    </motion.div>
  );
}

function PortraitSelector({
  selectedStory,
  onSelect,
}: {
  selectedStory: Story | null;
  onSelect: (story: Story, trigger: HTMLButtonElement) => void;
}) {
  return (
    <section
      aria-labelledby="stories-heading"
      className="relative min-h-[720px] overflow-hidden bg-brand-warm-snow px-6 py-16 text-brand-obsidian md:min-h-[820px] md:px-20 md:py-20"
    >
      <div className="relative mx-auto min-h-[590px] max-w-[1280px] md:min-h-[660px]">
        <div className="absolute top-1/2 left-1/2 z-10 w-[min(82vw,650px)] -translate-x-1/2 -translate-y-1/2 text-center">
          <p className="mb-4 text-nav font-bold text-brand-royal">
            Real people, real belonging
          </p>
          <h1
            id="stories-heading"
            tabIndex={-1}
            className="text-[40px] leading-normal font-extrabold tracking-[-0.02em] text-brand-obsidian md:text-section"
          >
            Stories of real Young Muslims
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-body font-medium text-brand-obsidian/70">
            Choose a portrait to meet the people behind the numbers.
          </p>
        </div>

        {STORIES.map((story, index) => {
          const isSelected = story.slug === selectedStory?.slug;
          const theme = THEME[story.theme];
          return (
            <button
              key={story.slug}
              type="button"
              aria-label={`Show ${story.name}'s story`}
              aria-pressed={isSelected}
              aria-controls="selected-story"
              onClick={(event) => onSelect(story, event.currentTarget)}
              className={`group absolute size-[132px] cursor-pointer rounded-[58%_42%_55%_45%/47%_58%_42%_53%] transition-transform duration-300 outline-none hover:scale-105 focus-visible:ring-4 focus-visible:ring-offset-4 focus-visible:ring-offset-brand-warm-snow md:size-[190px] ${POSITIONS[index]} ${theme.ring}`}
            >
              <span
                aria-hidden="true"
                className={`absolute -inset-2 -z-10 rounded-[44%_56%_38%_62%/60%_42%_58%_40%] transition-all duration-300 group-hover:-inset-5 group-focus-visible:-inset-5 ${theme.background} ${isSelected ? "-inset-5 opacity-100" : "opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100"}`}
              />
              <Image
                src={story.portrait}
                alt=""
                fill
                sizes="(max-width: 767px) 132px, 190px"
                className="object-contain drop-shadow-[0_16px_24px_rgba(23,23,37,0.16)]"
                style={{ transform: `rotate(${story.rotation ?? 0}deg)` }}
              />
              <span className="sr-only">
                {isSelected ? "Selected" : "Not selected"}
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}

function ExpandedStoryPanel({
  story,
  panelRef,
  onClose,
}: {
  story: Story;
  panelRef: React.RefObject<HTMLElement | null>;
  onClose: () => void;
}) {
  const theme = THEME[story.theme];

  return (
    <section
      ref={panelRef}
      id="selected-story"
      tabIndex={-1}
      aria-labelledby="selected-story-title"
      className="scroll-mt-[123px] outline-none"
    >
      <article
        className={`relative min-h-[808px] overflow-hidden text-brand-pure-white md:min-h-[1024px] xl:min-h-[1228px] ${theme.background}`}
      >
        {story.overviewImage ? (
          <div className="absolute inset-0 overflow-hidden">
            <Image
              src={story.overviewImage}
              alt={story.heroAlt}
              priority
              sizes="(max-width: 767px) 223vw, (max-width: 1279px) 117vw, 1644px"
              className="absolute top-[-46.37%] left-[-32.48%] h-[149.02%] w-[223.01%] max-w-none md:top-[-39.34%] md:left-0 md:h-[131.62%] md:w-[117.01%] xl:top-[-65.07%] xl:h-[200.81%] xl:w-[114.18%]"
            />
          </div>
        ) : (
          <div className="absolute inset-x-0 top-0 h-[43%] overflow-hidden md:h-[45%] xl:h-[52%]">
            <Image
              src={story.heroImage}
              alt={story.heroAlt}
              fill
              priority
              sizes="100vw"
              className="object-cover object-center"
            />
          </div>
        )}

        <Image
          src={theme.wave}
          alt=""
          className="pointer-events-none absolute top-[31%] left-1/2 h-[66%] w-[175%] max-w-none -translate-x-1/2 md:top-[32%] md:h-[72%] md:w-[150%] xl:top-[38%] xl:h-[78%] xl:w-[135%]"
        />

        <button
          type="button"
          onClick={onClose}
          aria-label="Close selected story"
          className="absolute top-8 right-8 z-20 grid size-12 cursor-pointer place-items-center bg-brand-pure-white text-brand-obsidian transition-transform outline-none hover:rotate-90 focus-visible:ring-4 focus-visible:ring-brand-pure-white focus-visible:ring-offset-2 focus-visible:ring-offset-brand-obsidian md:top-12 md:right-16"
        >
          <Image src={closeIcon} alt="" />
        </button>

        <div className="absolute inset-x-0 top-[47%] z-10 mx-auto flex max-w-[1280px] flex-col px-8 pb-12 md:top-[51%] md:px-16 xl:top-[57%] xl:grid xl:grid-cols-[520px_1fr] xl:gap-20 xl:px-10">
          <div className="relative text-center xl:text-left">
            <Image
              src={quoteMark}
              alt=""
              className="absolute -top-12 -left-4 h-auto w-36 opacity-100 md:-top-20 md:w-48"
            />
            <blockquote
              id="selected-story-title"
              className="relative text-[16px] leading-normal font-bold tracking-[-0.02em] md:text-[24px] xl:text-[32px]"
            >
              {story.quote}
            </blockquote>
          </div>

          <div className="mt-9 text-center xl:mt-0 xl:text-left">
            {story.editorialDraft ? (
              <p className="mb-3 text-xs font-bold">Editorial draft</p>
            ) : null}
            <p className="text-[14px] leading-normal font-medium tracking-[-0.02em] md:text-[18px] xl:text-[20px]">
              {story.summary}
            </p>
            <p className="mt-6 text-[12px] font-extrabold tracking-[-0.02em] md:text-[18px] xl:text-[20px]">
              {story.name}, {story.chapter}
            </p>
            <Link
              href={`/stories/${story.slug}`}
              className={`mt-7 inline-flex w-full justify-center bg-brand-warm-snow px-6 py-4 text-nav font-bold transition-transform outline-none hover:-translate-y-0.5 focus-visible:ring-4 focus-visible:ring-brand-pure-white focus-visible:ring-offset-2 focus-visible:ring-offset-brand-obsidian md:w-auto ${theme.text}`}
            >
              View the full story
            </Link>
          </div>
        </div>
      </article>
    </section>
  );
}

export function StoriesExperience({
  initialSlug,
  fromLanding,
}: {
  initialSlug: string | null;
  fromLanding: boolean;
}) {
  const reduceMotion = useReducedMotion();
  const panelRef = useRef<HTMLElement>(null);
  const expansionId = useRef(0);
  const panelPositionTimer = useRef<number | null>(null);
  const didHandleLandingArrival = useRef(false);
  const [selectedStory, setSelectedStory] = useState<Story | null>(() =>
    getStoryBySlug(initialSlug),
  );
  const [expansion, setExpansion] = useState<Expansion | null>(null);

  const revealPanel = useCallback((focus = true) => {
    window.requestAnimationFrame(() => {
      panelRef.current?.scrollIntoView({ behavior: "auto", block: "start" });
      if (focus) panelRef.current?.focus({ preventScroll: true });
    });
  }, []);

  useEffect(() => {
    const handlePopState = () => {
      if (panelPositionTimer.current) {
        window.clearTimeout(panelPositionTimer.current);
      }
      const params = new URLSearchParams(window.location.search);
      setSelectedStory(getStoryBySlug(params.get("story")));
      setExpansion(null);
    };

    window.addEventListener("popstate", handlePopState);
    return () => {
      window.removeEventListener("popstate", handlePopState);
      if (panelPositionTimer.current) {
        window.clearTimeout(panelPositionTimer.current);
      }
    };
  }, []);

  useEffect(() => {
    if (fromLanding && selectedStory && !didHandleLandingArrival.current) {
      didHandleLandingArrival.current = true;
      revealPanel(false);
    }
  }, [fromLanding, revealPanel, selectedStory]);

  const selectStory = useCallback(
    (story: Story, trigger: HTMLButtonElement) => {
      const url = `/stories?story=${story.slug}`;
      window.history.pushState(null, "", url);
      setSelectedStory(story);

      if (reduceMotion) {
        setExpansion(null);
        revealPanel();
        return;
      }

      const rect = trigger.getBoundingClientRect();
      expansionId.current += 1;
      const nextExpansionId = expansionId.current;
      setExpansion({
        id: nextExpansionId,
        story,
        bounds: {
          left: rect.left,
          top: rect.top,
          width: rect.width,
          height: rect.height,
        },
      });

      if (panelPositionTimer.current) {
        window.clearTimeout(panelPositionTimer.current);
      }
      panelPositionTimer.current = window.setTimeout(() => {
        if (nextExpansionId === expansionId.current) revealPanel(false);
      }, 360);
    },
    [reduceMotion, revealPanel],
  );

  const finishExpansion = useCallback((id: number) => {
    if (id !== expansionId.current) return;
    if (panelPositionTimer.current) {
      window.clearTimeout(panelPositionTimer.current);
      panelPositionTimer.current = null;
    }
    setExpansion(null);
    window.requestAnimationFrame(() => {
      panelRef.current?.focus({ preventScroll: true });
    });
  }, []);

  const closeStory = useCallback(() => {
    expansionId.current += 1;
    if (panelPositionTimer.current) {
      window.clearTimeout(panelPositionTimer.current);
      panelPositionTimer.current = null;
    }
    setExpansion(null);
    setSelectedStory(null);
    window.history.pushState(null, "", "/stories");
    window.requestAnimationFrame(() => {
      document.getElementById("stories-heading")?.focus();
    });
  }, []);

  return (
    <>
      <PortraitSelector selectedStory={selectedStory} onSelect={selectStory} />

      <div aria-live="polite" className="sr-only">
        {selectedStory ? `${selectedStory.name}'s story selected.` : ""}
      </div>

      {selectedStory ? (
        <ExpandedStoryPanel
          story={selectedStory}
          panelRef={panelRef}
          onClose={closeStory}
        />
      ) : (
        <section className="bg-brand-obsidian px-6 py-24 text-center text-brand-warm-snow md:px-20">
          <h2 className="text-section font-extrabold">
            Every story starts by showing up.
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-lead font-medium">
            Select a portrait above, or find the NeighborNet closest to you.
          </p>
          <Link
            href="/neighbornets"
            className="mt-8 inline-flex rounded-pill border border-brand-warm-snow px-6 py-4 text-nav font-bold outline-none hover:bg-brand-warm-snow hover:text-brand-obsidian focus-visible:ring-2 focus-visible:ring-brand-warm-snow focus-visible:ring-offset-2 focus-visible:ring-offset-brand-obsidian"
          >
            Find a NeighborNet
          </Link>
        </section>
      )}

      <AnimatePresence initial={false}>
        {expansion ? (
          <ExpansionOverlay
            expansion={expansion}
            onComplete={finishExpansion}
          />
        ) : null}
      </AnimatePresence>
    </>
  );
}
