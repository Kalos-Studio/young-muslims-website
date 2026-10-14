"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";

import { AnimatedCtaLabel } from "@/components/ui/animated-arrow";
import { MaterialIcon } from "@/components/ui/material-icon";
import type { Story } from "@/lib/stories";

type Bounds = { left: number; top: number; width: number; height: number };
export type StorySelection = {
  story: Story;
  trigger: HTMLButtonElement;
  bounds: Bounds;
};

export function LandingStoryDialog({
  selection,
  onClose,
}: {
  selection: StorySelection;
  onClose: () => void;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const [closing, setClosing] = useState(false);
  const [destination, setDestination] = useState<Bounds>(selection.bounds);
  const [returnBounds, setReturnBounds] = useState(selection.bounds);
  const reduceMotion = useReducedMotion();
  const { story, trigger } = selection;
  const color =
    story.theme === "brothers"
      ? "var(--color-brand-royal)"
      : "var(--color-brand-jade)";

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    const updateDestination = () => {
      const width = Math.min(window.innerWidth - 32, 1040);
      const height = Math.min(window.innerHeight - 48, 720);
      setDestination({
        left: (window.innerWidth - width) / 2,
        top: (window.innerHeight - height) / 2,
        width,
        height,
      });
    };
    updateDestination();
    dialog.showModal();
    closeRef.current?.focus({ preventScroll: true });
    const previousOverflow = document.documentElement.style.overflow;
    const previousGutter = document.documentElement.style.scrollbarGutter;
    document.documentElement.style.scrollbarGutter = "stable";
    document.documentElement.style.overflow = "hidden";
    window.addEventListener("resize", updateDestination);
    return () => {
      window.removeEventListener("resize", updateDestination);
      document.documentElement.style.overflow = previousOverflow;
      document.documentElement.style.scrollbarGutter = previousGutter;
      dialog.close();
      requestAnimationFrame(() => {
        if (trigger.isConnected) trigger.focus({ preventScroll: true });
      });
    };
  }, [trigger]);

  const dismiss = () => {
    if (closing) return;
    const { left, top, width, height } = trigger.getBoundingClientRect();
    setReturnBounds({ left, top, width, height });
    setClosing(true);
  };

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby="landing-story-title"
      className="fixed inset-0 m-0 h-dvh max-h-none w-screen max-w-none overflow-hidden border-0 bg-transparent p-0 text-brand-pure-white backdrop:bg-brand-obsidian/65"
      onCancel={(event) => {
        event.preventDefault();
        dismiss();
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget) dismiss();
      }}
    >
      <motion.article
        className="absolute"
        initial={selection.bounds}
        animate={closing ? returnBounds : destination}
        transition={{
          duration: reduceMotion ? 0 : 0.55,
          delay: reduceMotion || !closing ? 0 : 0.2,
          ease: [0.22, 1, 0.36, 1],
        }}
        onAnimationComplete={() => {
          if (closing) onClose();
        }}
      >
        <motion.div
          className="absolute inset-0"
          style={{ backgroundColor: color }}
          initial={{ opacity: 0, borderRadius: "45%" }}
          animate={{
            opacity: closing ? 0 : 1,
            borderRadius: closing ? "45%" : "0%",
          }}
          transition={{ duration: reduceMotion ? 0 : 0.4 }}
        />
        <motion.div
          className="absolute inset-0"
          initial={{ opacity: 1 }}
          animate={{ opacity: closing ? 1 : 0 }}
          transition={{
            duration: reduceMotion ? 0 : 0.25,
            delay: reduceMotion || closing ? 0 : 0.35,
          }}
          aria-hidden="true"
        >
          <Image
            src={story.portrait}
            alt=""
            fill
            sizes="(max-width: 767px) 100vw, 520px"
            className="object-contain"
            style={{ transform: `rotate(${story.rotation ?? 0}deg)` }}
          />
        </motion.div>
        <motion.div
          className="relative h-full overflow-y-auto overscroll-contain"
          initial={{ opacity: 0 }}
          animate={{ opacity: closing ? 0 : 1 }}
          transition={{
            duration: reduceMotion ? 0 : 0.25,
            delay: closing || reduceMotion ? 0 : 0.35,
          }}
          inert={closing}
        >
          <div className="grid min-h-full md:grid-cols-[0.9fr_1.1fr]">
            <div className="relative min-h-[230px] md:min-h-full">
              <Image
                src={story.heroImage}
                alt={story.heroAlt}
                fill
                sizes="(max-width: 767px) 100vw, 490px"
                className={`${story.editorialDraft ? "object-contain p-8" : "object-cover"} ${story.slug === "brotherhood-in-the-everyday" ? "rotate-180" : ""}`}
              />
            </div>
            <div className="flex flex-col justify-center gap-6 p-7 text-left md:px-10 md:py-16">
              <p className="text-nav font-semibold">
                {story.name}, {story.chapter}
              </p>
              <h2 id="landing-story-title" className="text-h3 font-extrabold">
                {story.title}
              </h2>
              <blockquote className="text-xl font-semibold">
                “{story.quote}”
              </blockquote>
              <p className="text-base leading-relaxed">{story.summary}</p>
              {story.editorialDraft && (
                <p className="text-sm opacity-80">
                  Story preview. Member interview coming soon.
                </p>
              )}
              <Link
                href={`/stories?story=${story.slug}&from=landing`}
                className="ym-cta-trigger inline-flex w-fit items-center justify-center gap-2 bg-brand-warm-snow px-6 py-4 text-nav font-bold text-brand-obsidian focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
              >
                <AnimatedCtaLabel label="Read full story" />
              </Link>
            </div>
          </div>
        </motion.div>
        <button
          ref={closeRef}
          type="button"
          onClick={dismiss}
          aria-label="Close story"
          className="absolute top-3 right-3 grid size-11 cursor-pointer place-items-center bg-brand-warm-snow text-brand-obsidian focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          style={{ opacity: closing ? 0 : 1 }}
        >
          <MaterialIcon name="close" aria-hidden="true" />
        </button>
      </motion.article>
    </dialog>
  );
}
