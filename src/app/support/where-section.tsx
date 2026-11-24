import Image, { type StaticImageData } from "next/image";

import { ScrollDrift } from "@/components/site/scroll-drift";
import { TextReveal } from "@/components/site/text-reveal";
import { cn } from "@/lib/utils";

import leadership from "../../../design-assets/figma/support/where/leadership.webp";
import neighbornets from "../../../design-assets/figma/support/where/neighbornets.webp";
import retreats from "../../../design-assets/figma/support/where/retreats.webp";
import service from "../../../design-assets/figma/support/where/service.webp";
import { WhereMotion } from "./where-motion";
import styles from "./where-section.module.css";
import {
  LEADERSHIP_SHAPE,
  NEIGHBORNETS_SHAPE,
  RETREATS_SHAPE,
  SERVICE_SHAPE,
} from "./where-shapes";

type Item = {
  title: string;
  description: string;
  photo: StaticImageData;
  alt: string;
  /** How far it drifts towards the cursor, times the pointer-drift token. */
  depth: number;
  /**
   * The photo's width on phones (Figma's 280-294; 533 on tablet, 450 on
   * desktop), on its
   * layer, so it may overhang the item's 10px padding as Figma's does.
   */
  photoClassName: string;
  /**
   * The item's place: below tablet and on tablet one centred column; from
   * desktop the zigzag (left, right, left, right), each from its nearer
   * edge of the 1440 column and pulled up beside the one before.
   */
  className: string;
  shape: { viewBox: string; d: string };
  /** The shape's box from the item's top left, per frame. */
  shapeClassName: string;
};

/* Figma's items, top to bottom (each frame's own offsets and sizes). */
const ITEMS: Item[] = [
  {
    title: "NeighborNets",
    description:
      "Keeping 200+ weekly gatherings running across the country, the heart of everything YM does.",
    photo: neighbornets,
    alt: "Young Muslim sisters gathered outdoors, smiling",
    depth: 0.9,
    photoClassName: "w-73.5",
    className: "xl:ml-22.5 xl:self-start",
    shape: NEIGHBORNETS_SHAPE,
    shapeClassName:
      "-top-8.5 -left-15.75 h-105 w-105.75 md:-top-24.75 md:-left-28.25 md:h-190.5 md:w-192 xl:-top-19 xl:-left-13 xl:h-166 xl:w-167",
  },
  {
    title: "Retreats & Conferences",
    description:
      "The getaways and weekend gatherings where friendships deepen and young Muslims grow.",
    photo: retreats,
    alt: "Friends playing ball in a park on a retreat",
    depth: 1.15,
    photoClassName: "w-73.25",
    className: "mt-26 md:mt-33.5 xl:-mt-97.25 xl:mr-22.5 xl:self-end",
    shape: RETREATS_SHAPE,
    shapeClassName:
      "-top-14.25 -left-20.25 h-107.25 w-114.25 md:-top-23.5 md:-left-25.75 md:h-175.5 md:w-187.25 xl:-top-20 xl:-left-19.25 xl:h-156.75 xl:w-167",
  },
  {
    title: "Leadership & Mentorship",
    description:
      "Training the next generation of peer leaders — the brothers and sisters who run it all.",
    photo: leadership,
    alt: "A warm embrace between two Muslim sisters at a convention",
    depth: 0.8,
    photoClassName: "w-70.5",
    className: "mt-20.5 md:mt-16.25 xl:-mt-4.25 xl:ml-25 xl:self-start",
    shape: LEADERSHIP_SHAPE,
    shapeClassName:
      "-top-8 -left-12.75 h-107.75 w-99.5 md:-top-12.25 md:-left-18.5 md:h-189.75 md:w-175.25 xl:-top-20.25 xl:-left-18.25 xl:h-180.75 xl:w-167",
  },
  {
    title: "Advocacy & Service",
    description:
      "Mobilizing young Muslims to show up for their communities and speak up on the issues that matter.",
    photo: service,
    alt: "Young Muslims gathered in the street for a community service day",
    depth: 1.05,
    photoClassName: "w-70",
    className: "mt-20.5 md:mt-16.25 xl:-mt-111.75 xl:mr-25 xl:self-end",
    shape: SERVICE_SHAPE,
    shapeClassName:
      "-top-10 -left-8 h-99.5 w-98.75 md:-top-17.75 md:-left-25.75 md:h-185.25 md:w-183.75 xl:-top-20.5 xl:-left-16.75 xl:h-168.25 xl:w-167",
  },
];

/* Shown 280-294 wide on phones, 533 on tablet, 450 on desktop. */
const SIZES = "(width >= 80rem) 450px, (width >= 48rem) 533px, 294px";

/**
 * The Support page's fourth section, "Where your support goes." (Figma
 * 446:2062, tablet 447:2578, mobile 447:3069; DESIGN-SYSTEM.md, "Support
 * where your support goes"). Warm Snow.
 *
 * The centred heading (TextReveal), then four items, each a photo in its
 * organic shape over a centred title (Boldonse, uppercase) and line: one centred column on
 * phones and tablet, a zigzag from desktop. Behind each photo a pale shape
 * drifting with the scroll (ScrollDrift, paint-contained); each photo grows
 * in as it enters view and, with a fine pointer, trails the cursor
 * (WhereMotion).
 *
 * Rhythm (mobile / tablet / desktop): the heading 43 / 81 / 81 below the
 * section's top, the first item 69 / 125 / 167 under it; then each item's
 * margin keeps its top where its frame puts it (the frames kept the item
 * tops when the titles became Boldonse): 104 / 82 / 82 on phones, 134 / 65
 * / 65 on tablet, and on desktop the right-hand items pulled up (389, 447)
 * beside the left and the third 17; 73 / 200 / 81 under the last.
 */
export function WhereSection() {
  return (
    <section
      aria-labelledby="where-title"
      className="relative overflow-x-clip pt-10.75 pb-18.25 md:pt-20.25 md:pb-50 xl:pb-20.25"
    >
      <WhereMotion />
      <div className="mx-auto max-w-360 px-8 md:px-16 xl:px-0">
        <TextReveal>
          <h2
            id="where-title"
            className="text-center text-mobile-section font-extrabold md:text-tablet-section xl:text-landing-section"
          >
            Where your support goes.
          </h2>
        </TextReveal>
        <ul className="mt-17.25 flex flex-col items-center md:mt-31.25 xl:mt-41.75">
          {ITEMS.map((item) => (
            <li
              key={item.title}
              className={cn(
                "relative flex w-full max-w-74 flex-col items-center gap-12 p-2.5 text-center md:w-135.75 md:max-w-none",
                item.className,
              )}
            >
              <ScrollDrift
                token="--support-where-shape-drift"
                fallback={96}
                className={cn(
                  "pointer-events-none absolute",
                  styles.shape,
                  item.shapeClassName,
                )}
              >
                <svg
                  aria-hidden="true"
                  viewBox={item.shape.viewBox}
                  preserveAspectRatio="none"
                  className="size-full fill-landing-pale"
                >
                  <path d={item.shape.d} />
                </svg>
              </ScrollDrift>
              <div
                data-where="photo"
                data-depth={item.depth}
                className={cn(
                  "relative shrink-0 md:w-133.25 xl:w-112.5",
                  styles.pointer,
                  item.photoClassName,
                )}
              >
                <Image
                  data-where="photo-art"
                  src={item.photo}
                  alt={item.alt}
                  sizes={SIZES}
                  className="h-auto w-full"
                />
              </div>
              <div className="relative flex w-full flex-col gap-8">
                <h3 className="font-display text-item-display-mobile uppercase md:text-item-display">
                  {item.title}
                </h3>
                <p className="text-article-title font-medium md:text-landing-copy">
                  {item.description}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
