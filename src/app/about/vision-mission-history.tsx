"use client";

import { useEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useInView,
  useReducedMotion,
} from "motion/react";

import { PersonOutline } from "@/components/wireframe/person-outline";
import { cn } from "@/lib/utils";

const chapters = [
  {
    title: "Vision",
    copy: "American Muslim youth collectively contributing to the betterment of society with God-consciousness and a firm understanding of their Muslim identity.",
    imageLabel: "Vision image: young Muslims looking toward what comes next",
    visualClass: "bg-brand-royal text-brand-pure-white",
  },
  {
    title: "Mission",
    copy: "Young Muslims seeks the pleasure of Allah (SWT) by empowering Muslim youth through companionship, mentorship, education, and service.",
    imageLabel: "Mission image: a local NeighborNet gathering",
    visualClass: "bg-brand-jade text-brand-pure-white",
  },
  {
    title: "Our History",
    copy: "As Muslim youth groups in the early 90s were popping up across the country in northern New Jersey, New York City, and Chicago, a unifying effort was made in order to establish a national network. Out of these collections of youth groups, Young Muslims was born. Our first charter and national coordinator were established in 1995.",
    imageLabel: "History image: an early Young Muslims gathering",
    visualClass: "bg-brothers-slate text-brothers-midnight",
  },
] as const;

function ChapterVisual({
  index,
  compact = false,
}: {
  index: number;
  compact?: boolean;
}) {
  const chapter = chapters[index];

  return (
    <div
      role="img"
      aria-label={chapter.imageLabel}
      className={cn(
        "relative isolate h-full min-h-72 w-full overflow-hidden rounded-media",
        chapter.visualClass,
      )}
    >
      <div className="absolute inset-0 [background-image:linear-gradient(to_right,currentColor_1px,transparent_1px),linear-gradient(to_bottom,currentColor_1px,transparent_1px)] [background-size:48px_48px] opacity-20" />

      {index === 0 ? (
        <div className="absolute inset-0 flex items-center justify-center gap-4">
          {[-10, 8, -4].map((offset, personIndex) => (
            <div
              key={offset}
              className="flex size-28 items-center justify-center rounded-full border-2 border-current/35 bg-brand-pure-white/15 backdrop-blur-sm"
              style={{ transform: `translateY(${offset * 2}px)` }}
            >
              <PersonOutline className="size-16" />
              <span className="sr-only">Person {personIndex + 1}</span>
            </div>
          ))}
        </div>
      ) : null}

      {index === 1 ? (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative flex size-72 items-center justify-center rounded-full border-2 border-current/30">
            <div className="flex size-28 items-center justify-center rounded-full bg-brand-pure-white/15 backdrop-blur-sm">
              <PersonOutline className="size-16" />
            </div>
            {[0, 90, 180, 270].map((rotation) => (
              <div
                key={rotation}
                className="absolute top-1/2 left-1/2 flex size-16 items-center justify-center rounded-full border border-current/30 bg-brand-pure-white/10"
                style={{
                  transform: `translate(-50%, -50%) rotate(${rotation}deg) translateY(-136px) rotate(-${rotation}deg)`,
                }}
              >
                <PersonOutline className="size-9" />
              </div>
            ))}
          </div>
        </div>
      ) : null}

      {index === 2 ? (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="rotate-[-4deg] rounded-card border-8 border-brand-warm-snow bg-brand-obsidian px-12 py-14 text-center text-brand-warm-snow shadow-2xl">
            <p className="font-display text-display">1990</p>
            <p className="mt-3 text-sm font-semibold">The story begins</p>
          </div>
        </div>
      ) : null}

      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-brand-obsidian/65 to-transparent px-6 pt-20 pb-6 text-brand-pure-white">
        <p className="text-sm font-medium">{chapter.imageLabel}</p>
        {!compact ? (
          <p className="mt-1 text-xs text-brand-pure-white/65">
            Image placeholder
          </p>
        ) : null}
      </div>
    </div>
  );
}

function ScrollChapter({
  index,
  onActive,
}: {
  index: number;
  onActive: (index: number) => void;
}) {
  const ref = useRef<HTMLElement>(null);
  const isActive = useInView(ref, { margin: "-42% 0px -42% 0px" });
  const chapter = chapters[index];

  useEffect(() => {
    if (isActive) onActive(index);
  }, [index, isActive, onActive]);

  return (
    <section
      ref={ref}
      aria-labelledby={`about-chapter-${index}`}
      className="flex min-h-[82vh] flex-col justify-center py-20 first:pt-8 last:pb-8 lg:min-h-[92vh] lg:py-28"
    >
      <div className="mb-8 h-[58vh] lg:hidden">
        <ChapterVisual index={index} compact />
      </div>
      <p className="text-sm font-semibold text-muted-foreground">
        {String(index + 1).padStart(2, "0")}
      </p>
      <h2
        id={`about-chapter-${index}`}
        className="mt-5 text-section font-extrabold text-brand-obsidian"
      >
        {chapter.title}
      </h2>
      <p className="mt-8 max-w-md text-lead font-medium text-muted-foreground">
        {chapter.copy}
      </p>
    </section>
  );
}

export function VisionMissionHistory() {
  const [activeIndex, setActiveIndex] = useState(0);
  const shouldReduceMotion = useReducedMotion();

  return (
    <div className="grid items-start gap-10 lg:grid-cols-[minmax(0,1.28fr)_minmax(22rem,0.72fr)] lg:gap-16">
      <div className="sticky top-24 hidden h-[calc(100vh-8rem)] max-h-[46rem] lg:block">
        <AnimatePresence initial={false} mode="sync">
          <motion.div
            key={activeIndex}
            className="absolute inset-0"
            initial={
              shouldReduceMotion
                ? { opacity: 1 }
                : { opacity: 0, scale: 1.015, filter: "blur(10px)" }
            }
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            exit={
              shouldReduceMotion
                ? { opacity: 0 }
                : { opacity: 0, scale: 0.99, filter: "blur(10px)" }
            }
            transition={{ duration: shouldReduceMotion ? 0 : 0.45 }}
          >
            <ChapterVisual index={activeIndex} />
          </motion.div>
        </AnimatePresence>
      </div>

      <div>
        {chapters.map((chapter, index) => (
          <ScrollChapter
            key={chapter.title}
            index={index}
            onActive={setActiveIndex}
          />
        ))}
      </div>
    </div>
  );
}
