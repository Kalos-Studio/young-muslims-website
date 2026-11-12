import Image, { type StaticImageData } from "next/image";

import { GrainFilter } from "@/components/site/grain-filter";
import { TextReveal } from "@/components/site/text-reveal";
import { cn } from "@/lib/utils";

import brothersBasketball from "../../../design-assets/figma/about/generation/brothers-basketball.webp";
import brothersBlossoms from "../../../design-assets/figma/about/generation/brothers-blossoms.webp";
import brothersConference from "../../../design-assets/figma/about/generation/brothers-conference.webp";
import brothersStreet from "../../../design-assets/figma/about/generation/brothers-street.webp";
import sistersBeach from "../../../design-assets/figma/about/generation/sisters-beach.webp";
import sistersHeart from "../../../design-assets/figma/about/generation/sisters-heart.webp";
import sistersHearts from "../../../design-assets/figma/about/generation/sisters-hearts.webp";
import sistersLakeside from "../../../design-assets/figma/about/generation/sisters-lakeside.webp";
import { GenerationDrift } from "./generation-drift";
import styles from "./generation-section.module.css";

type Blob = { src: StaticImageData; alt: string };

/* Figma's rows, left to right (scripts/about-generation-assets.mjs). */
const TOP: Blob[] = [
  {
    src: sistersLakeside,
    alt: "Young Muslims sisters gathered on a wooden lakeside deck",
  },
  {
    src: brothersStreet,
    alt: "A large group of Young Muslims brothers posing on a city street",
  },
  {
    src: sistersHeart,
    alt: "Two sisters by a river making a heart with their hands",
  },
  {
    src: brothersBasketball,
    alt: "Brothers playing basketball on an outdoor court",
  },
];
const BOTTOM: Blob[] = [
  { src: sistersBeach, alt: "Two sisters smiling together on a rocky beach" },
  {
    src: brothersConference,
    alt: "Two brothers with conference lanyards talking",
  },
  {
    src: brothersBlossoms,
    alt: "A group of brothers under cherry blossoms",
  },
  {
    src: sistersHearts,
    alt: "Sisters making hearts with their hands against the sky",
  },
];
/* Copies of each row's four: the Figma copy is the second, so there is a
   whole copy either side of it to drift into. */
const COPIES = 3;
const FIGMA_COPY = 1;
/* Shown one row high: 296 / 242 / 159 tall, at most 1.1 times as wide. */
const SIZES = "(width >= 80rem) 330px, (width >= 48rem) 270px, 180px";

/**
 * One row of blob photos, repeated so it never shows an end. `direction`:
 * -1 drifts left as the page scrolls down, 1 right (GenerationDrift). Only
 * the Figma copy is announced; the repeats are hidden from assistive tech.
 */
function BlobRow({
  blobs,
  direction,
  className,
}: {
  blobs: Blob[];
  direction: -1 | 1;
  className: string;
}) {
  return (
    <div data-generation-row={direction} className={cn(styles.row, className)}>
      {Array.from({ length: COPIES }, (_, copy) =>
        blobs.map((blob, index) => (
          <Image
            key={`${copy}-${index}`}
            src={blob.src}
            alt={copy === FIGMA_COPY ? blob.alt : ""}
            aria-hidden={copy === FIGMA_COPY ? undefined : true}
            sizes={SIZES}
            data-generation-blob
            className={styles.blob}
          />
        )),
      )}
    </div>
  );
}

/**
 * The About page's "A generation to believe in" section, under the hero
 * (Figma 507:33, tablet 595:1963, mobile 596:2628; DESIGN-SYSTEM.md, "About
 * generation"): Warm Snow, it receives the hero's wave. A row of organic
 * blob photos, the heading and its subline (TextReveal), and a second row,
 * each row bleeding off both sides.
 *
 * The rows drift with the scroll, the top one left and the bottom one
 * right, and each photo grows in as it enters view (GenerationDrift, the
 * only client part). Vertical rhythm (top / row to text / text to row /
 * bottom): mobile 73 / 73 / 73 / 95, tablet 129 / 129 / 129 / 110, desktop
 * 90 / 90 / 90 / 116; Figma's gaps around the text, the top matched to them.
 */
export function GenerationSection() {
  return (
    <section
      aria-labelledby="generation-heading"
      className="relative overflow-x-clip bg-brand-warm-snow pt-18.25 pb-23.75 text-brand-obsidian md:pt-32.25 md:pb-27.5 xl:pt-22.5 xl:pb-29"
    >
      <GrainFilter id="generation-grain" />
      <GenerationDrift />
      <BlobRow blobs={TOP} direction={-1} className={styles.rowTop} />
      <div className="mx-auto my-18.25 max-w-360 px-8 text-center md:my-32.25 md:px-16 xl:my-22.5 xl:px-20">
        <TextReveal>
          <h2
            id="generation-heading"
            className="text-mobile-section font-extrabold md:text-landing-section"
          >
            A generation to believe in.
          </h2>
          <p className="mx-auto mt-4 max-w-136 text-body font-medium md:text-article-title xl:text-landing-copy">
            Young Muslims is the largest Muslim youth organization in North
            America. A grassroots movement developing the next generation of
            young Muslims, by young Muslims, since 1995.
          </p>
        </TextReveal>
      </div>
      <BlobRow blobs={BOTTOM} direction={1} className={styles.rowBottom} />
    </section>
  );
}
