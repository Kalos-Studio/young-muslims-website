import Image, { type StaticImageData } from "next/image";

import { StandardButton } from "@/components/ui/standard-button";
import { TextReveal } from "@/components/site/text-reveal";
import { textRevealUnit } from "@/components/site/text-reveal-unit";
import { cn } from "@/lib/utils";

import logo from "../../../design-assets/figma/neighbornets/2026-page/a0c41.svg";
import carPhoto from "../../../design-assets/figma/neighbornets/2026-page/abef6.jpg";
import handsPhoto from "../../../design-assets/figma/neighbornets/2026-page/e1518.png";
import groupPhoto from "../../../design-assets/figma/neighbornets/2026-page/24e0e.jpg";
import gatheringPhoto from "../../../design-assets/figma/neighbornets/2026-page/695b1.png";
import talkingPhoto from "../../../design-assets/figma/neighbornets/2026-page/94a21.jpg";
import halaqaPhoto from "../../../design-assets/figma/neighbornets/2026-page/8cd27.png";
import styles from "./neighbornet-explainer.module.css";
import { PhotoMarqueeMotion } from "./photo-marquee-motion";
import marquee from "./photo-marquee.module.css";

type Photo = { image: StaticImageData; alt: string; wide: boolean };

/** Figma 332:10's rows, left to right (540 wide, or 524). */
const ROWS: {
  photos: Photo[];
  track: string;
  gap: string;
}[] = [
  {
    track: styles.trackTop,
    gap: styles.gapTop,
    photos: [
      {
        image: carPhoto,
        alt: "Young Muslim standing beside a red car",
        wide: true,
      },
      {
        image: handsPhoto,
        alt: "Friends making heart shapes with their hands against the sky",
        wide: false,
      },
      {
        image: groupPhoto,
        alt: "Young Muslims gathered for a group photo",
        wide: true,
      },
    ],
  },
  {
    track: styles.trackBottom,
    gap: styles.gapBottom,
    photos: [
      {
        image: gatheringPhoto,
        alt: "Young Muslim women together at a community gathering",
        wide: false,
      },
      {
        image: talkingPhoto,
        alt: "Young Muslims talking at an event",
        wide: true,
      },
      {
        image: halaqaPhoto,
        alt: "Young Muslim women seated together for a halaqa",
        wide: false,
      },
    ],
  },
];

/** The cursor drift's share per row: the bottom row trails less. */
const ROW_DEPTHS = [1, 0.6];

/** Copies of each row in its track: one loop's move never shows an end. */
const COPIES = 4;

/**
 * "What's a NeighborNet?" (Figma 332:10, tablet 374:709, mobile 401:1856),
 * below the map: the heading, two rows of photos looping in opposite
 * directions over the faint YOUNG MUSLIMS watermark (full-bleed), the copy,
 * and a standard button to start a NeighborNet. The motion (the loops, the
 * cursor drift, the watermark's parallax) is PhotoMarqueeMotion;
 * the text uses the site's text reveal.
 */
export function NeighborNetExplainer() {
  return (
    <PhotoMarqueeMotion
      labelledBy="neighbornet-explainer-heading"
      depths={ROW_DEPTHS}
      className="overflow-x-clip bg-brand-warm-snow pt-25.75 pb-42.75 md:pb-36 xl:pb-33.5"
    >
      <TextReveal className="mx-auto w-full max-w-360 px-8 text-center md:px-16 xl:px-22.5">
        <h2
          id="neighbornet-explainer-heading"
          className="text-mobile-section font-extrabold text-brand-obsidian md:text-landing-section"
        >
          What&rsquo;s a NeighborNet?
        </h2>
      </TextReveal>

      <div className={cn("mt-17.75 md:mt-25 xl:mt-35.75", styles.marquee)}>
        <div aria-hidden className={styles.watermarkLine}>
          <Image
            src={logo}
            alt=""
            data-marquee="watermark"
            className={cn("h-auto w-full", styles.watermark)}
          />
        </div>
        {ROWS.map((row, rowIndex) => (
          <div
            key={rowIndex}
            data-marquee="row"
            className={cn(marquee.row, styles.row)}
          >
            <div className={cn(marquee.track, row.track)}>
              {Array.from({ length: COPIES }, (_, copy) =>
                row.photos.map((photo) => (
                  <div
                    key={`${copy}-${photo.image.src}`}
                    aria-hidden={copy > 0 || undefined}
                    className={cn(
                      styles.photo,
                      photo.wide ? styles.wide : styles.narrow,
                      row.gap,
                    )}
                  >
                    <Image
                      src={photo.image}
                      alt={copy === 0 ? photo.alt : ""}
                      fill
                      sizes="(min-width: 80rem) 540px, (min-width: 48rem) 370px, 300px"
                      className="object-cover"
                    />
                  </div>
                )),
              )}
            </div>
          </div>
        ))}
      </div>

      <TextReveal className="mx-auto mt-15.25 flex w-full max-w-360 flex-col items-center px-8 text-center md:mt-23.75 md:px-16 xl:mt-23 xl:max-w-218 xl:px-0">
        <div className="flex flex-col gap-5 text-body font-medium text-brand-obsidian md:gap-6 md:text-landing-copy">
          <p>
            A NeighborNet is your local Young Muslims. A group of brothers or
            sisters who meet every week to hang out, grow, and build real
            friendships rooted in Deen.
          </p>
          <p>
            It&rsquo;s not a class you attend or a lecture you sit through.
            It&rsquo;s grabbing food, playing ball, and talking through
            what&rsquo;s actually going on in your life, with people who get it.
            Some weeks there&rsquo;s a halaqa, some weeks there&rsquo;s a
            bonfire. Every week, there are your people.
          </p>
          <p>
            There are 200+ NeighborNets across the country, each run by the
            youth, for the youth. Find yours, show up once, and see what
            it&rsquo;s about.
          </p>
        </div>
        <StandardButton
          href="/contact"
          label="Don’t have a NN near you? Start one here"
          {...textRevealUnit}
          className="mt-8 xl:mt-15"
        />
      </TextReveal>
    </PhotoMarqueeMotion>
  );
}
