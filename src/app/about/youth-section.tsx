import Image, { type StaticImageData } from "next/image";

import { TextReveal } from "@/components/site/text-reveal";
import { cn } from "@/lib/utils";

import brotherBeanie from "../../../design-assets/figma/about/youth/brother-beanie.webp";
import brotherBeard from "../../../design-assets/figma/about/youth/brother-beard.webp";
import brotherCurls from "../../../design-assets/figma/about/youth/brother-curls.webp";
import brotherSide from "../../../design-assets/figma/about/youth/brother-side.webp";
import sisterExpo from "../../../design-assets/figma/about/youth/sister-expo.webp";
import sisterFloralHijab from "../../../design-assets/figma/about/youth/sister-floral-hijab.webp";
import sisterFlowers from "../../../design-assets/figma/about/youth/sister-flowers.webp";
import sisterPinkHijab from "../../../design-assets/figma/about/youth/sister-pink-hijab.webp";
import { YouthMotion } from "./youth-motion";
import styles from "./youth-section.module.css";

/*
 * The pale background shape (Figma 534:315; vendored as
 * design-assets/figma/about/youth/shape.svg). Figma fills it #F9F3ED, which
 * has no token; it uses Landing Pale, the site's pale shape colour.
 */
const SHAPE =
  "M 539.0022039228443 1589.563502520742 C 652.6059280122362 1582.87875479967 766.5432997592679 1605.9411792620933 868.452520496444 1656.633849590901 C 1129.741080591214 1786.6521884492968 1441.7065052058642 1732.2828547444046 1637.7286252742888 1460.2136324578235 C 1709.4549001092732 1360.72230442926 1806.5745636851805 1284.4049526691583 1919.9555408934962 1237.8345473087534 C 2416.136513064933 1033.9497584178068 2284.2675128623046 140.8675067112054 1458.1902417586475 162.0358733878168 C 1346.591282085591 164.93259717892468 1237.7763344652853 139.4190784086519 1138.8742656634436 87.72369957406829 C 111.98571564243093 -448.3930344524075 -502.3652863696293 1650.5061144853469 539.0022039228443 1589.563502520742 Z";

type Face = {
  src: StaticImageData;
  alt: string;
  /** How far it drifts towards the cursor, times `--youth-pointer-drift`. */
  depth: number;
  /**
   * Its box per frame (mobile, then `md:` tablet, `xl:` desktop): Figma's
   * render box, from the nearer side (left, right, or the centre with a
   * negative margin), the top faces from the top and the lower ones from
   * the section's foot, so they keep their distance from the text.
   */
  className: string;
};

/* Figma's faces, top to bottom. Tablet and phones show six. */
const FACES: Face[] = [
  {
    src: brotherCurls,
    alt: "A young brother with curly hair and glasses, smiling",
    depth: 0.9,
    className:
      "top-39.5 left-0 w-35 md:top-34 md:w-47.5 xl:top-23.5 xl:left-42.5 xl:w-55.25",
  },
  {
    src: sisterPinkHijab,
    alt: "A sister in a pink hijab, smiling on stage",
    depth: 1.2,
    className:
      "top-7.75 left-1/2 -ml-8.25 w-31.5 md:top-34 md:-ml-23 md:w-42.75 xl:top-9.5 xl:-ml-21.75 xl:w-49.75",
  },
  {
    src: brotherSide,
    alt: "A brother with glasses looking to the side, smiling",
    depth: 0.7,
    className:
      "top-48.75 right-6.75 w-30 md:top-45.75 md:right-6 md:w-40.75 xl:top-35.75 xl:right-15.25 xl:w-47.25",
  },
  {
    src: sisterExpo,
    alt: "A sister in a patterned hijab at a convention",
    depth: 1,
    className:
      "bottom-60.5 left-0 w-30.25 md:bottom-53.5 md:w-40.75 xl:top-115.75 xl:bottom-auto xl:left-12.75 xl:w-47.5",
  },
  {
    src: brotherBeard,
    alt: "A bearded brother with glasses, smiling",
    depth: 0.8,
    className: "hidden xl:block xl:top-121.75 xl:right-18.25 xl:w-49.75",
  },
  {
    src: sisterFlowers,
    alt: "A sister in a pink hijab and glasses, smiling among flowers",
    depth: 1.1,
    className: "hidden xl:block xl:bottom-68.5 xl:left-27.5 xl:w-42.5",
  },
  {
    src: sisterFloralHijab,
    alt: "A sister in a floral red hijab and glasses, smiling",
    depth: 0.75,
    className:
      "bottom-26.75 left-1/2 -ml-8.5 w-31.5 md:bottom-44.25 md:-ml-24.25 md:w-42.75 xl:bottom-75.25 xl:-ml-32.75 xl:w-49.75",
  },
  {
    src: brotherBeanie,
    alt: "A brother in a grey NY beanie, smiling",
    depth: 1.05,
    className:
      "bottom-60.5 right-3.25 w-34 md:bottom-53.25 md:right-4 md:w-46 xl:bottom-64.25 xl:right-48.75 xl:w-53.5",
  },
];

/* Shown 126-221 wide. */
const SIZES = "(width >= 80rem) 225px, (width >= 48rem) 190px, 140px";

/**
 * The About page's "Built by the youth. Run by the youth." section, under
 * Mission & Vision (Figma 529:233, tablet 595:1993, mobile 596:2662;
 * DESIGN-SYSTEM.md, "About built by the youth").
 *
 * A large pale organic shape behind it all, its top reaching up into
 * Mission & Vision (which sits above it), and rising further as the page
 * scrolls; the heading and the NeighborNet model's three paragraphs centred
 * (TextReveal); eight portraits in organic shapes around them (six on
 * tablet and phones, as in Figma), each growing in as it enters view and,
 * with a fine pointer, trailing the cursor (YouthMotion, the only client
 * part).
 *
 * The shape and faces are placed in the centred 1440 column from desktop
 * (full width below), the shape bleeding off both sides; the section clips
 * sideways only.
 */
export function YouthSection() {
  return (
    <section
      aria-labelledby="youth-heading"
      className="relative overflow-x-clip text-brand-obsidian"
    >
      <YouthMotion />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 right-0 left-0 mx-auto max-w-360"
      >
        <svg
          data-youth="shape"
          viewBox="0 0 2210 1724"
          className={cn("fill-landing-pale", styles.shape)}
        >
          <path d={SHAPE} />
        </svg>
      </div>
      <div className="pointer-events-none absolute inset-y-0 right-0 left-0 mx-auto max-w-360">
        {FACES.map((face) => (
          <div
            key={face.alt}
            data-youth="face"
            data-depth={face.depth}
            className={cn("absolute", styles.pointer, face.className)}
          >
            <Image
              data-youth="face-art"
              src={face.src}
              alt={face.alt}
              sizes={SIZES}
              className="h-auto w-full"
            />
          </div>
        ))}
      </div>
      <div className="relative mx-auto max-w-360 px-8 pt-87.5 pb-101 text-center md:px-16 md:pt-105.5 md:pb-119 xl:px-20 xl:pt-95 xl:pb-146.5">
        <TextReveal className="mx-auto max-w-196">
          <h2
            id="youth-heading"
            className="text-mobile-section font-extrabold md:text-landing-section"
          >
            Built by the youth. Run by the youth.
          </h2>
          <p className="mt-4 text-body font-medium md:text-article-title xl:text-landing-copy">
            At the heart of Young Muslims is the NeighborNet. A local group of
            brothers or sisters who meet every week to build real friendships
            rooted in Deen. There are 200+ of them across the country, and every
            single one is led by young people themselves.
          </p>
          <p className="mt-5 text-body font-medium md:mt-5.5 md:text-article-title xl:mt-6 xl:text-landing-copy">
            That’s not a detail, it’s the whole model. The halaqas, the events,
            the mentorship, the leadership: all of it is run end to end by the
            youth, for the youth. A teenager won’t always open up to a lecture
            from across a generational gap. But to someone their own age, who’s
            walked the same path? That’s where the real growth happens.
          </p>
          <p className="mt-5 text-body font-medium md:mt-5.5 md:text-article-title xl:mt-6 xl:text-landing-copy">
            It’s why Young Muslims works. And it’s why the young people who come
            through it don’t just belong — they lead.
          </p>
        </TextReveal>
      </div>
    </section>
  );
}
