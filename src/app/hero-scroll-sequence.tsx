"use client";

import { useRef } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from "motion/react";

import { PersonOutline } from "@/components/wireframe/person-outline";

const PHOTOS = [
  {
    left: "4%",
    top: "16%",
    width: "clamp(7rem, 14vw, 13rem)",
    aspect: "4 / 5",
    rotate: -8,
    revealAt: 0.08,
    travel: 44,
    tone: "border-brand-royal bg-brothers-slate text-brothers-midnight",
  },
  {
    left: "22%",
    top: "7%",
    width: "clamp(6rem, 11vw, 10rem)",
    aspect: "1 / 1",
    rotate: 6,
    revealAt: 0.12,
    travel: -36,
    tone: "border-landing-cyan bg-brand-warm-snow text-brand-royal",
  },
  {
    right: "20%",
    top: "8%",
    width: "clamp(7rem, 12vw, 11rem)",
    aspect: "5 / 6",
    rotate: -5,
    revealAt: 0.1,
    travel: -48,
    tone: "border-brand-jade bg-sisters-buttercup text-sisters-forest",
  },
  {
    right: "4%",
    top: "18%",
    width: "clamp(7.5rem, 15vw, 14rem)",
    aspect: "4 / 5",
    rotate: 7,
    revealAt: 0.14,
    travel: 38,
    tone: "border-brand-royal bg-brothers-sky text-brothers-midnight",
  },
  {
    left: "5%",
    bottom: "12%",
    width: "clamp(8rem, 16vw, 15rem)",
    aspect: "3 / 2",
    rotate: 5,
    revealAt: 0.16,
    travel: -34,
    tone: "border-brand-jade bg-sisters-brass text-sisters-forest",
  },
  {
    left: "25%",
    bottom: "5%",
    width: "clamp(6rem, 11vw, 10rem)",
    aspect: "1 / 1",
    rotate: -7,
    revealAt: 0.21,
    travel: 42,
    tone: "border-landing-cyan bg-landing-blush text-brand-obsidian",
  },
  {
    right: "24%",
    bottom: "5%",
    width: "clamp(6.5rem, 12vw, 11rem)",
    aspect: "1 / 1",
    rotate: 8,
    revealAt: 0.18,
    travel: 32,
    tone: "border-brand-royal bg-brand-warm-snow text-brand-jade",
  },
  {
    right: "5%",
    bottom: "13%",
    width: "clamp(8rem, 16vw, 15rem)",
    aspect: "3 / 2",
    rotate: -6,
    revealAt: 0.23,
    travel: -44,
    tone: "border-brand-jade bg-sisters-forest text-sisters-buttercup",
  },
] as const;

function FloatingPhoto({
  photo,
  progress,
  reduceMotion,
}: {
  photo: (typeof PHOTOS)[number];
  progress: MotionValue<number>;
  reduceMotion: boolean | null;
}) {
  const y = useTransform(
    progress,
    [photo.revealAt, 1],
    [photo.travel, photo.travel * -0.2],
  );

  return (
    <motion.div
      aria-hidden
      className={`absolute hidden overflow-hidden rounded-2xl border-4 shadow-2xl sm:flex ${photo.tone}`}
      style={{
        left: "left" in photo ? photo.left : undefined,
        right: "right" in photo ? photo.right : undefined,
        top: "top" in photo ? photo.top : undefined,
        bottom: "bottom" in photo ? photo.bottom : undefined,
        width: photo.width,
        aspectRatio: photo.aspect,
        rotate: photo.rotate,
        opacity: 1,
        scale: 1,
        y: reduceMotion ? 0 : y,
      }}
    >
      <div className="flex h-full w-full items-center justify-center bg-current/5">
        <PersonOutline className="h-1/2 w-1/2 opacity-70" />
      </div>
    </motion.div>
  );
}

export function HeroScrollSequence() {
  const sectionRef = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  const headlineOpacity = useTransform(scrollYProgress, [0, 0.16], [1, 0]);
  const headlineY = useTransform(scrollYProgress, [0, 0.18], [0, -48]);
  const videoScale = useTransform(scrollYProgress, [0.02, 0.72], [1, 0.25]);
  const videoY = useTransform(scrollYProgress, [0.02, 0.72], ["0vh", "20vh"]);
  const videoRadius = useTransform(
    scrollYProgress,
    [0.02, 0.68],
    ["0px", "24px"],
  );
  const videoShadow = useTransform(
    scrollYProgress,
    [0.12, 0.72],
    ["0 0 0 rgba(0, 0, 0, 0)", "0 32px 90px rgba(0, 0, 0, 0.48)"],
  );
  const videoLabelOpacity = useTransform(
    scrollYProgress,
    [0.02, 0.18],
    [0.6, 0],
  );
  const closingCopyOpacity = useTransform(
    scrollYProgress,
    [0.68, 0.84, 0.98],
    [0, 1, 1],
  );
  const closingCopyY = useTransform(scrollYProgress, [0.68, 0.86], [28, 0]);

  return (
    <section
      ref={sectionRef}
      data-header-theme="dark"
      aria-label="Young Muslims community introduction"
      className="relative h-[150svh] min-h-[1100px] w-full bg-landing-blush text-brand-warm-snow motion-reduce:h-[100svh] motion-reduce:min-h-[760px]"
    >
      <div className="sticky top-0 h-[100svh] min-h-[760px] overflow-hidden bg-landing-blush motion-reduce:relative">
        <div className="absolute inset-0 z-10">
          {PHOTOS.map((photo, index) => (
            <FloatingPhoto
              key={index}
              photo={photo}
              progress={scrollYProgress}
              reduceMotion={reduceMotion}
            />
          ))}
        </div>

        <div className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center overflow-hidden">
          <motion.div
            aria-hidden
            className="relative size-[100vmax] shrink-0 overflow-hidden bg-brothers-midnight will-change-transform"
            style={{
              scale: reduceMotion ? 1 : videoScale,
              y: reduceMotion ? 0 : videoY,
              borderRadius: reduceMotion ? 0 : videoRadius,
              boxShadow: reduceMotion ? "none" : videoShadow,
            }}
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(74,144,217,0.42),transparent_34%),radial-gradient(circle_at_72%_68%,rgba(57,116,81,0.48),transparent_38%),linear-gradient(135deg,#16294f,#171725_68%)]" />
            <motion.p
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-sm font-medium whitespace-nowrap text-brand-warm-snow/60"
              style={{ opacity: reduceMotion ? 0.6 : videoLabelOpacity }}
            >
              Full-bleed community video placeholder
            </motion.p>
          </motion.div>
        </div>

        <motion.div
          className="pointer-events-none absolute inset-0 z-30 flex flex-col items-center justify-center px-6 text-center"
          style={{
            opacity: reduceMotion ? 1 : headlineOpacity,
            y: reduceMotion ? 0 : headlineY,
          }}
        >
          <div className="flex w-full max-w-[983px] flex-col items-center gap-4">
            <h1 className="font-display text-display font-normal md:whitespace-nowrap">
              FOR THE YOUTH. BY THE YOUTH.
            </h1>
            <p className="w-full max-w-[893px] text-lead font-semibold md:whitespace-nowrap">
              A nationwide brotherhood and sisterhood, built on real friendships
              and a shared Deen.
            </p>
          </div>
        </motion.div>

        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-8 z-30 hidden text-center text-sm font-semibold tracking-wide text-brand-obsidian/65 sm:block"
          style={{
            opacity: reduceMotion ? 0 : closingCopyOpacity,
            y: reduceMotion ? 0 : closingCopyY,
          }}
        >
          The moments make the community.
        </motion.div>
      </div>
    </section>
  );
}
