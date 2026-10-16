"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";

import closeIcon from "../../../design-assets/figma/stories/close.svg";
import mustafaWave from "../../../design-assets/figma/stories/mustafa-wave-front.svg";
import quoteMark from "../../../design-assets/figma/stories/quote-mark.svg";
import rahmahWave from "../../../design-assets/figma/stories/rahmah-wave-front.svg";
import { StoriesHero, StoriesCta } from "./stories-sections";
import styles from "./stories.module.css";
import { PORTRAIT_SLOTS, portraitSlug } from "./portrait-slots";
import { usePortraitField } from "./use-portrait-field";
import galleryMarkLeft from "../../../design-assets/figma/stories-redesign/d7f59.svg";
import galleryMarkRight from "../../../design-assets/figma/stories-redesign/e2a16.svg";
import { STORIES, getStoryBySlug, type Story } from "@/lib/stories";
import { useStoryPageNavigation } from "@/components/site/story-page-transition";

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

const PORTRAIT_ACCENTS = [
  "var(--color-brand-royal)",
  "var(--color-sisters-brass)",
  "var(--color-brand-jade)",
  "var(--color-landing-cyan)",
  "var(--color-brothers-sky)",
  "var(--color-sisters-buttercup)",
] as const;

function PortraitSelector() {
  const { viewportRef, suppressClickRef } = usePortraitField();
  const navigateToStory = useStoryPageNavigation();

  return (
    <section
      data-header-theme="light"
      aria-labelledby="stories-heading"
      className={styles.gallery}
    >
      <div className={styles.galleryHeading}>
        <h2
          id="stories-heading"
          tabIndex={-1}
          className="text-landing-section font-extrabold outline-none"
        >
          <span>Pick someone.</span> <span>Get their story.</span>
        </h2>
        <p className="mt-4 text-landing-copy font-medium">
          Every person here found something at Young Muslims worth talking
          about. Select any one to see their experience.
        </p>
      </div>
      <div
        ref={viewportRef}
        className={styles.galleryViewport}
        role="region"
        aria-label="Community portraits. Move your cursor or drag to explore. Use arrow keys to pan, or Tab to select a story."
        onClickCapture={(event) => {
          if (suppressClickRef.current && event.detail !== 0) {
            event.preventDefault();
            event.stopPropagation();
            suppressClickRef.current = false;
          }
        }}
        tabIndex={0}
      >
        <div className={styles.portraitField}>
          <Image src={galleryMarkLeft} alt="" className={styles.markLeft} />
          <Image src={galleryMarkRight} alt="" className={styles.markRight} />
          {PORTRAIT_SLOTS.map((slot, index) => {
            const story = STORIES.find((entry) => entry.slug === slot.slug);
            const portraitImage =
              story?.slug === "rahmah-k"
                ? slot.image
                : (story?.portrait ?? slot.image);
            const accent = PORTRAIT_ACCENTS[index % PORTRAIT_ACCENTS.length];
            const backdrop = (
              <span
                aria-hidden="true"
                className={styles.portraitBackdrop}
                style={{
                  backgroundColor: accent,
                  maskImage: `url(${portraitImage.src})`,
                  rotate: `${story?.rotation ?? 0}deg`,
                }}
              />
            );
            const geometry = {
              left: `${slot.x / 14.4}%`,
              top: `${(slot.y - 556) / 6.61}%`,
              width: `${slot.width / 14.4}%`,
              height: `${slot.height / 6.61}%`,
            };
            return (
              <Link
                key={slot.id}
                data-portrait={index}
                href={`/stories/${portraitSlug(slot)}`}
                onNavigate={(event) => {
                  const bounds = document
                    .querySelector<HTMLElement>(`[data-portrait="${index}"]`)
                    ?.getBoundingClientRect();
                  if (!bounds) return;
                  navigateToStory(
                    `/stories/${portraitSlug(slot)}`,
                    portraitImage.src,
                    accent,
                    bounds,
                    event,
                  );
                }}
                aria-label={
                  story
                    ? `Read ${story.name}'s story`
                    : `Read community story ${index + 1}`
                }
                className={`${styles.portrait} ${styles.selectable}`}
                style={geometry}
              >
                {backdrop}
                <Image
                  src={portraitImage}
                  alt=""
                  fill
                  sizes="(max-width: 767px) 120px, 170px"
                  className="object-contain"
                  style={{ transform: `rotate(${story?.rotation ?? 0}deg)` }}
                />
              </Link>
            );
          })}
        </div>
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
              style={{ rotate: `${story.heroRotation ?? 0}deg` }}
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
  const panelRef = useRef<HTMLElement>(null);
  const didHandleLandingArrival = useRef(false);
  const [selectedStory, setSelectedStory] = useState<Story | null>(() =>
    getStoryBySlug(initialSlug),
  );

  const revealPanel = useCallback((focus = true) => {
    window.requestAnimationFrame(() => {
      panelRef.current?.scrollIntoView({ behavior: "auto", block: "start" });
      if (focus) panelRef.current?.focus({ preventScroll: true });
    });
  }, []);

  useEffect(() => {
    const handlePopState = () => {
      const params = new URLSearchParams(window.location.search);
      setSelectedStory(getStoryBySlug(params.get("story")));
    };

    window.addEventListener("popstate", handlePopState);
    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);

  useEffect(() => {
    if (fromLanding && selectedStory && !didHandleLandingArrival.current) {
      didHandleLandingArrival.current = true;
      revealPanel(false);
    }
  }, [fromLanding, revealPanel, selectedStory]);

  const closeStory = useCallback(() => {
    setSelectedStory(null);
    window.history.pushState(null, "", "/stories");
    window.requestAnimationFrame(() => {
      document.getElementById("stories-heading")?.focus();
    });
  }, []);

  return (
    <>
      <StoriesHero />
      <PortraitSelector />

      <div aria-live="polite" className="sr-only">
        {selectedStory ? `${selectedStory.name}'s story selected.` : ""}
      </div>

      {selectedStory ? (
        <ExpandedStoryPanel
          story={selectedStory}
          panelRef={panelRef}
          onClose={closeStory}
        />
      ) : null}

      <StoriesCta />
    </>
  );
}
