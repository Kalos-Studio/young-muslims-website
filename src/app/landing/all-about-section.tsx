import Image, { type StaticImageData } from "next/image";

import { TextReveal } from "@/components/site/text-reveal";
import { textRevealUnit } from "@/components/site/text-reveal-unit";
import { StandardButton } from "@/components/ui/standard-button";
import { cn } from "@/lib/utils";

import markMonogram from "../../../design-assets/figma/landing-2026/all-about/mark-monogram.svg";
import markYm from "../../../design-assets/figma/landing-2026/all-about/mark-ym.svg";
import tileBecome from "../../../design-assets/figma/landing-2026/all-about/tile-become.jpg";
import tileImpact from "../../../design-assets/figma/landing-2026/all-about/tile-impact.jpg";
import tilePeople from "../../../design-assets/figma/landing-2026/all-about/tile-people.jpg";
import tileYouth from "../../../design-assets/figma/landing-2026/all-about/tile-youth.jpg";
import { AllAboutMotion } from "./all-about-motion";
import styles from "./all-about-section.module.css";

type TileContent = {
  title: string;
  body: string;
  image: StaticImageData;
  /** The title's wrap width, from Figma (174 / 198 / 249 units). */
  titleWidth: string;
  /** Where the text block sits: its bottom (and left) inset in Figma. */
  textPosition: string;
};

/*
 * The four tiles (298 x 482). On mobile they fill the content width at that
 * locked ratio (296 x 479 at 360, 366 x 592 at 430), up to 384 wide, so the
 * photos never change proportion. Each photo is vendored pre-cropped to its Figma frame crop, so it simply covers the tile. Their
 * text sits 37 units above the tile's foot (33 on tile 4), 28 in from the
 * left (27 on mobile, as in the 296-wide mobile tiles; 25 on desktop tile 2).
 */
const TILES = {
  people: {
    title: "Your people, every week",
    body: "Brotherhood and sisterhood come first. Weekly NeighborNets, halaqas, and pickup games. The friendships are the foundation for everything else.",
    image: tilePeople,
    titleWidth: "w-43.5",
    textPosition: "bottom-9.25",
  },
  youth: {
    title: "Run by the youth",
    body: "Every NeighborNet, halaqa, and event is led end to end by young people themselves. Not adults running a program for teens. Teens building it for each other. That’s not a detail — it’s the whole model.",
    image: tileYouth,
    titleWidth: "w-49.5",
    textPosition: "bottom-9.25 xl:left-6.25",
  },
  become: {
    title: "Become who you're meant to be",
    body: "Leadership workshops, career support, and the space to lead, speak, and build things you never would have on your own.",
    image: tileBecome,
    titleWidth: "w-62.25",
    textPosition: "bottom-9.25",
  },
  impact: {
    title: "Turn belonging into impact",
    body: "Feeding the hungry, relief work, and local service. Showing up for your community, together.",
    image: tileImpact,
    titleWidth: "w-49.5",
    textPosition: "bottom-8.25",
  },
} satisfies Record<string, TileContent>;

/** A static informational tile: photo, bottom gradient, title and body. */
function Tile({ tile }: { tile: TileContent }) {
  return (
    <article className="relative mx-auto aspect-all-about-tile w-full max-w-96 shrink-0 overflow-hidden text-brand-pure-white md:mx-0 md:aspect-auto md:h-120.5 md:w-74.5">
      <Image
        src={tile.image}
        alt=""
        fill
        sizes="(width >= 48rem) 298px, (width >= 28rem) 384px, 100vw"
        className="object-cover"
      />
      {/* Figma's overlay: clear at 9.5%, 48% Obsidian at 110%. */}
      <div
        aria-hidden="true"
        className="from-9.5% absolute inset-0 bg-linear-to-b from-transparent to-brand-obsidian/48 to-110%"
      />
      <div className={cn("absolute left-6.75 md:left-7", tile.textPosition)}>
        <h3 className={cn("text-card-title font-semibold", tile.titleWidth)}>
          {tile.title}
        </h3>
        <p className="mt-4.75 w-62.25 text-body font-medium">{tile.body}</p>
      </div>
    </article>
  );
}

/**
 * The landing page's "This is what we're all about" section (Figma 58:120,
 * tablet 279:262, mobile 295:1165). It follows the dark "show you" section,
 * whose blob's bottom wave hangs over this section's top (drawn by that
 * section, above this one).
 *
 * The copy sits on the left; the four tiles stand in two offset columns on
 * the right: tiles 1 and 3, then tiles 2 and 4 starting 90 lower. On tablet
 * the copy sits above the two columns; on mobile the tiles stack in reading
 * order 1, 3, 2, 4, as in the mobile frame. Two faint watermarks (the YM
 * monogram in Royal, the "ym" roundel in Jade, both at 4%) sit behind.
 *
 * The scroll motion (desktop: pinned copy, counter-moving columns, drifting
 * watermarks; tablet: depth parallax; mobile: none) is in AllAboutMotion.
 *
 * Vertical rhythm: the copy starts 535 down on every tier, clear of the
 * show-you rim's full drift (the tablet and mobile frames' 309 / 267 assumed
 * a shallower wave and would sit under it), and more on screens wider than
 * 1440, where that rim scales up (section.module.css). Below the copy the
 * frames' spacing holds: tiles 84 / 94 under it on mobile / tablet (beside
 * it on desktop), and 209 / 199 / 174 under the last tile, giving
 * 2149 / 1835px on tablet / desktop up to 1440 wide (mobile follows its
 * tiles: 3128px at 360). Content follows the 360, 768 and
 * 1440 frames and centres beyond them; the background is full-bleed.
 */
export function AllAboutSection() {
  return (
    <section
      aria-labelledby="all-about-heading"
      className="relative overflow-clip bg-brand-warm-snow"
    >
      <AllAboutMotion>
        {/* The watermarks, placed in the frame's box. */}
        <div
          aria-hidden="true"
          className={cn(
            "pointer-events-none absolute inset-0 mx-auto max-w-90 md:max-w-192 xl:max-w-360",
            styles.marks,
          )}
        >
          <div
            data-all-about="mark"
            className="absolute top-165 left-20.5 size-77.75 md:top-142.25 md:left-101.5 md:size-86.5 md:will-change-transform xl:top-94.75 xl:right-5.75 xl:left-auto xl:size-106.5"
          >
            <Image src={markMonogram} alt="" className="size-full" />
          </div>
          <div
            data-all-about="mark"
            className="absolute top-695.5 -left-10.25 size-78.25 md:top-441.25 md:left-6 md:size-87.5 md:will-change-transform xl:top-318.5 xl:left-4.25 xl:size-106.5"
          >
            <Image src={markYm} alt="" className="size-full" />
          </div>
        </div>

        <div
          className={cn(
            "relative mx-auto flex flex-col px-8 pb-52.25 md:max-w-192 md:px-16 md:pb-49.75 xl:max-w-360 xl:flex-row xl:gap-x-12 xl:pr-17.75 xl:pb-43.5 xl:pl-22.5",
            styles.content,
          )}
        >
          {/* On desktop this column spans the tiles, so the copy can stay
              pinned until the section ends. */}
          <div className="xl:max-w-134.5 xl:flex-1">
            <div data-all-about="intro" className="xl:motion-safe:sticky">
              <TextReveal className="text-brand-obsidian">
                <h2
                  id="all-about-heading"
                  className="text-mobile-section font-extrabold md:text-landing-section"
                >
                  This is what we&rsquo;re all about.
                </h2>
                <p className="mt-4 text-body font-medium md:text-landing-copy">
                  It starts as a hangout. It turns into brotherhood, sisterhood,
                  and a reason to show up for something bigger than yourself.
                </p>
                <StandardButton
                  href="/about"
                  label="About us"
                  {...textRevealUnit}
                  className="mt-8"
                />
              </TextReveal>
            </div>
          </div>

          <div className="mt-21 flex flex-col gap-11.5 md:mt-23.5 md:flex-row md:items-start md:gap-11 xl:mt-0 xl:ml-auto xl:gap-13.25">
            <div
              data-all-about="column-a"
              className="flex flex-col gap-11.5 md:gap-18 md:will-change-transform"
            >
              <Tile tile={TILES.people} />
              <Tile tile={TILES.become} />
            </div>
            <div
              data-all-about="column-b"
              className="flex flex-col gap-11.5 md:mt-22.5 md:gap-18 md:will-change-transform"
            >
              <Tile tile={TILES.youth} />
              <Tile tile={TILES.impact} />
            </div>
          </div>
        </div>
      </AllAboutMotion>
    </section>
  );
}
