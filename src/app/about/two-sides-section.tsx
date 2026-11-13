import Image, { type StaticImageData } from "next/image";

import { GrainFilter } from "@/components/site/grain-filter";
import { TextReveal } from "@/components/site/text-reveal";
import { cn } from "@/lib/utils";

import brothersMark from "../../../design-assets/figma/about/two-sides/brothers-mark.svg";
import brothersStandalone from "../../../design-assets/figma/about/two-sides/brothers-standalone.png";
import sistersMark from "../../../design-assets/figma/about/two-sides/sisters-mark.svg";
import sistersStandalone from "../../../design-assets/figma/about/two-sides/sisters-standalone.svg";
import brothersLetters from "../../../design-assets/figma/about/two-sides/brothers-letters.svg";
import brothersMonogram from "../../../design-assets/figma/about/two-sides/brothers-monogram.svg";
import brothersPhoto1 from "../../../design-assets/figma/about/two-sides/brothers-photo-1.webp";
import brothersPhoto2 from "../../../design-assets/figma/about/two-sides/brothers-photo-2.webp";
import brothersPhoto3 from "../../../design-assets/figma/about/two-sides/brothers-photo-3.webp";
import brothersPhoto4 from "../../../design-assets/figma/about/two-sides/brothers-photo-4.webp";
import brothersWordmark from "../../../design-assets/figma/about/two-sides/brothers-wordmark.svg";
import sistersLetters from "../../../design-assets/figma/about/two-sides/sisters-letters.svg";
import sistersMonogram from "../../../design-assets/figma/about/two-sides/sisters-monogram.svg";
import sistersPhoto1 from "../../../design-assets/figma/about/two-sides/sisters-photo-1.webp";
import sistersPhoto2 from "../../../design-assets/figma/about/two-sides/sisters-photo-2.webp";
import sistersPhoto3 from "../../../design-assets/figma/about/two-sides/sisters-photo-3.webp";
import sistersPhoto4 from "../../../design-assets/figma/about/two-sides/sisters-photo-4.webp";
import sistersWordmark from "../../../design-assets/figma/about/two-sides/sisters-wordmark.svg";
import styles from "./two-sides-section.module.css";
import { TwoSidesScrub } from "./two-sides-scrub";

type Side = {
  key: "brothers" | "sisters";
  label: string;
  letters: StaticImageData;
  monogram: StaticImageData;
  wordmark: StaticImageData;
  /** The wordmark's box in the logo's 485 x 261 frame (Figma 542:75 / 542:180). */
  wordmarkBox: string;
  /**
   * The four photos, top left, top right, bottom left, bottom right: each
   * its box in the logo's frame and where it starts, 60% of the way back
   * to the wordmark's centre.
   */
  photos: { src: StaticImageData; box: string; from: string }[];
};

/* Figma's hover frames, measured from each logo's top left. */
const SIDES: Side[] = [
  {
    key: "brothers",
    label: "Young Muslims Brothers",
    letters: brothersLetters,
    monogram: brothersMonogram,
    wordmark: brothersWordmark,
    wordmarkBox: "top-22 left-8.75 w-103.25",
    photos: [
      {
        src: brothersPhoto1,
        box: "-top-9.25 left-3 h-30.25 w-45.25",
        from: "translate-x-21 translate-y-16",
      },
      {
        src: brothersPhoto2,
        box: "-top-10.25 left-73.25 h-31.25 w-47",
        from: "-translate-x-21.75 translate-y-16.5",
      },
      {
        src: brothersPhoto3,
        box: "top-45.25 left-8.75 h-31.25 w-41.5",
        from: "translate-x-18.5 -translate-y-17",
      },
      {
        src: brothersPhoto4,
        box: "top-49 left-70.75 h-31.75 w-47.5",
        from: "-translate-x-20.5 -translate-y-19.25",
      },
    ],
  },
  {
    key: "sisters",
    label: "Young Muslims Sisters",
    letters: sistersLetters,
    monogram: sistersMonogram,
    wordmark: sistersWordmark,
    wordmarkBox: "top-19.75 left-24.25 w-73.75",
    photos: [
      {
        src: sistersPhoto1,
        box: "-top-15.5 -left-9.25 h-42.75 w-32",
        from: "translate-x-32.5 translate-y-14.75",
      },
      {
        src: sistersPhoto2,
        box: "-top-15.5 left-75.75 h-31.5 w-47",
        from: "-translate-x-23 translate-y-18",
      },
      {
        src: sistersPhoto3,
        box: "top-44 -left-6.5 h-31.25 w-42",
        from: "translate-x-28 -translate-y-17.5",
      },
      {
        src: sistersPhoto4,
        box: "top-45.25 left-81 h-38 w-52.25",
        from: "-translate-x-27.5 -translate-y-20.25",
      },
    ],
  },
];

/**
 * One side: its Young Muslims logo, the letters and the monogram stacked
 * (two layers, so the scroll sequence can later fade the letters and move
 * the monogram), and, over it, the hover reveal: the side's wordmark and
 * four photos, laid out in the logo's 485 x 261 Figma frame and scaled
 * with the logo (0.59 below `xl`). The reveal is decorative.
 */
function LogoSide({ side }: { side: Side }) {
  return (
    <div
      data-two-sides="side"
      data-side={side.key}
      className={cn("relative w-71.25 xl:w-121.25", styles.side)}
    >
      <div
        role="img"
        aria-label={side.label}
        data-two-sides="logo"
        className={cn("relative", styles.logo)}
      >
        <Image
          data-two-sides="letters"
          src={side.letters}
          alt=""
          className={cn("h-auto w-full", styles.fade)}
        />
        <Image
          data-two-sides="monogram"
          src={side.monogram}
          alt=""
          className="absolute inset-0 size-full"
        />
      </div>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-0 left-0 h-65.25 w-121.25 origin-top-left scale-59 xl:scale-100"
      >
        <Image
          src={side.wordmark}
          alt=""
          className={cn(
            "absolute h-auto",
            side.wordmarkBox,
            styles.reveal,
            styles.wordmark,
          )}
        />
        <div className="absolute inset-0">
          {side.photos.map((photo, index) => (
            <Image
              key={index}
              src={photo.src}
              alt=""
              sizes="(width >= 80rem) 210px, 125px"
              className={cn(
                "absolute object-cover",
                photo.box,
                photo.from,
                styles.reveal,
                styles.photo,
              )}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

/*
 * The scroll sequence's rigs: each monogram's in-wordmark art over its
 * standalone logo, aligned so the crossfade reads as one mark changing.
 * The standalone fades in on top while the in-wordmark art stays solid
 * under it (no washed-out half-and-half), which then drops away unseen.
 * Both arts fill their box edge to edge (the Brothers standalone trimmed
 * to its disc), so each pair shares one box: the circles match in size
 * and centre, and the two sides read the same size.
 */
const RIGS = [
  {
    key: "brothers",
    standalone: brothersStandalone,
    mark: brothersMark,
    inset: "inset-0 size-full",
  },
  {
    key: "sisters",
    standalone: sistersStandalone,
    mark: sistersMark,
    inset: "inset-0 size-full",
  },
] as const;

function Rigs() {
  return (
    <>
      {RIGS.map((rig) => (
        <div
          key={rig.key}
          aria-hidden="true"
          data-two-sides="rig"
          data-side={rig.key}
          className={styles.rig}
        >
          <Image
            data-two-sides="rig-mark"
            src={rig.mark}
            alt=""
            className={cn("absolute", rig.inset, styles.rigMark)}
          />
          <Image
            data-two-sides="rig-standalone"
            src={rig.standalone}
            alt=""
            sizes="(width >= 80rem) 960px, (width >= 48rem) 565px, 656px"
            className={cn("absolute inset-0 size-full", styles.rigStandalone)}
          />
        </div>
      ))}
    </>
  );
}

/**
 * The About page's "Two sides. One mission." section, under "How it
 * started." (Figma 536:2755, tablet 596:2101, mobile 596:2757;
 * DESIGN-SYSTEM.md, "About two sides"): the Brothers (Royal) and Sisters
 * (Jade) logos, side by side from tablet and stacked on phones, over the
 * heading and the parallel-structures paragraph (TextReveal).
 *
 * Hovering a logo (fine pointer) reveals its side: the logo dims, its
 * wordmark rises in over it and four photos come out of the wordmark to
 * the corners (CSS only, two-sides-section.module.css), while the pinned
 * sequence is in its default phase.
 *
 * Pinned (motion allowed, tall enough): the section is a one-viewport stage
 * sticky over a scroll runway, and TwoSidesScrub scrubs it: the default
 * state holds, then the copy and the letters fade, leaving the monograms
 * (their growth, the zoom out of frame and the Shura handoff come in later
 * stages). Otherwise it is the static default, as Figma's frame.
 *
 * Vertical rhythm, Figma's: top / logos / gap / text / foot 51 / 2 x 154
 * apart 60 / 60 / 240 / 75 (phones), 143 / 154 / 88 / 147 / 132 (tablet),
 * 108 / 261 / 157 / 160 / 154 (desktop).
 */
export function TwoSidesSection() {
  return (
    <section
      aria-labelledby="two-sides-heading"
      className={cn("relative text-brand-obsidian", styles.section)}
    >
      <GrainFilter id="two-sides-grain" />
      <TwoSidesScrub />
      <div data-two-sides="stage" className={styles.stage}>
        <div
          className={cn(
            "mx-auto max-w-360 px-8 pt-12.75 pb-18.75 md:px-16 md:pt-35.75 md:pb-33 xl:pt-27 xl:pb-38.5",
            styles.inner,
          )}
        >
          <div className="flex flex-col items-center gap-15 md:flex-row md:justify-center md:gap-17.5 xl:gap-29.5">
            {SIDES.map((side) => (
              <LogoSide key={side.key} side={side} />
            ))}
          </div>
          <div data-two-sides="copy" className={styles.fade}>
            <TextReveal className="mx-auto mt-15 max-w-196 text-center md:mt-22 xl:mt-39.25">
              <h2
                id="two-sides-heading"
                className="text-mobile-section font-extrabold md:text-landing-section"
              >
                Two sides. One mission.
              </h2>
              <p className="mt-4 text-body font-medium md:text-article-title xl:text-landing-copy">
                Young Muslims has always had a brothers’ side and a sisters’
                side, each with its own leadership and its own spaces — because
                the best growth happens in a community you feel at home in. The
                structures run in parallel, the mission is shared, and together
                they make up one Young Muslims.
              </p>
            </TextReveal>
          </div>
        </div>
        <Rigs />
      </div>
    </section>
  );
}
