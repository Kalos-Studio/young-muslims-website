import { getImageProps } from "next/image";

import { ScrollDrift } from "@/components/site/scroll-drift";
import { TextReveal } from "@/components/site/text-reveal";

import photoDesktop from "../../../design-assets/figma/support/why/why-desktop.jpg";
import photoMobile from "../../../design-assets/figma/support/why/why-mobile.jpg";
import photoTablet from "../../../design-assets/figma/support/why/why-tablet.jpg";
import { SupporterFeed } from "./supporter-feed";
import styles from "./why-it-matters.module.css";

const ALT =
  "Young Muslims brothers throwing one of their own into the air at a gathering";

/*
 * Both waves are one blob (Figma 446:1851, the top, and 446:1853, the
 * bottom, mirrored), Warm Snow, each placed as its frame places it (the
 * node's relative transform, in section px). Their places differ only
 * across: the frames shift them to keep the photo's window on the action.
 */
const BLOB =
  "M274.31 778.756C426.117 837.756 619.931 860.837 794.202 828.04C935.633 801.426 1057.12 745.076 1200.36 721.995C1432.76 684.546 1684.7 739.954 1919.91 708.805C2129.84 681.013 2306.13 579.737 2357.3 457.499C2408.48 335.26 2332.12 197.89 2167.92 116.515C2033.44 49.9204 1854.94 22.4227 1680.36 8.11448C1145.26 -35.6934 -192.193 89.9599 23.2788 579.56C59.5433 662.053 153.73 731.769 274.511 778.698L274.31 778.756Z";
const TOP = "0.99913514 0.04158185 -0.04158185 0.99913514";
const BOTTOM = "0.98775601 -0.15600671 -0.15600671 -0.98775601";

/*
 * Each frame's view of the band (section y 540 to 1180, where both waves'
 * edges lie), centred on the frame and as wide as its range's widest
 * screen (desktop 1440, scaled up past it; tablet 1280; mobile 768), with
 * the waves' placements. `slice` keeps them at their size, centred.
 */
const WAVES = [
  {
    className: "md:hidden",
    viewBox: "-204 540 768 640",
    top: -1141.9454,
    bottom: -1014.4822,
  },
  {
    className: "max-md:hidden xl:hidden",
    viewBox: "-256 540 1280 640",
    top: -911.9454,
    bottom: -742.4822,
  },
  {
    className: "max-xl:hidden",
    viewBox: "0 540 1440 640",
    top: -532.0564,
    bottom: -470.3233,
  },
];

/**
 * The photo, art-directed (scripts/support-why-assets.mjs): each frame's
 * crop of the drifting layer, Figma's grain baked in; desktop from `xl`,
 * tablet from `md`, mobile below. It covers the layer.
 */
function WhyPhoto() {
  const common = { alt: ALT, sizes: "100vw" };
  const {
    props: { srcSet: desktop },
  } = getImageProps({ ...common, src: photoDesktop });
  const {
    props: { srcSet: tablet },
  } = getImageProps({ ...common, src: photoTablet });
  const {
    props: { srcSet: mobile, ...img },
  } = getImageProps({ ...common, src: photoMobile });
  return (
    <picture>
      <source media="(width >= 80rem)" srcSet={desktop} />
      <source media="(width >= 48rem)" srcSet={tablet} />
      <source srcSet={mobile} />
      <img
        {...img}
        alt={ALT}
        className="absolute inset-0 size-full object-cover"
      />
    </picture>
  );
}

/**
 * The Support page's second section, "Why it matters." (Figma 415:1602,
 * tablet 447:2464, mobile 447:2957; DESIGN-SYSTEM.md, "Support why it
 * matters"), rising over the pinned hero on its Warm Snow (SupportHero).
 *
 * The heading (TextReveal) and two paragraphs at the left of the column;
 * under them, the full-bleed photo between two Warm Snow waves, drifting in
 * its band as it scrolls (ScrollDrift: a layer taller than the band, so
 * neither wave edge ever opens a gap); under that, the supporters row,
 * looping on its own (SupporterFeed).
 *
 * Vertical rhythm, Figma's own (mobile / tablet / desktop): the copy 77 /
 * 97 / 88 below the hero's wave band, the band 70 / 107 / 90 below the
 * copy, the supporters 40 below the band, and 67 under them.
 */
export function WhyItMatters() {
  return (
    <section
      aria-labelledby="why-title"
      className="pt-19.25 pb-16.75 md:pt-24.25 xl:pt-22"
    >
      <div className="mx-auto max-w-360 px-8 md:px-16 xl:px-22.5">
        <div className="flex max-w-160 flex-col gap-4 xl:max-w-262">
          <TextReveal>
            <h2
              id="why-title"
              className="text-mobile-section font-extrabold md:text-landing-section"
            >
              Why it matters.
            </h2>
          </TextReveal>
          <div className="text-body font-medium md:text-article-title xl:text-landing-copy">
            <p>
              Young Muslims isn’t funded by a big institution or a membership
              fee. It runs on people who believe young Muslims deserve a place
              to belong — and who make sure that place exists for the next
              generation.
            </p>
            {/* Figma's blank line between the paragraphs. */}
            <p className="mt-4.75 md:mt-5.5 xl:mt-6">
              Your gift isn’t going to overhead. It’s going to the Friday night
              that becomes someone’s second family, the retreat where a kid
              finds his footing, the conference where a thousand young Muslims
              realize they’re not alone. It’s going to the next one.
            </p>
          </div>
        </div>
      </div>
      <div
        className={`relative mt-17.5 overflow-hidden md:mt-26.75 xl:mt-22.5 ${styles.band}`}
      >
        <ScrollDrift
          token="--support-why-drift"
          fallback={96}
          className={styles.photo}
        >
          <WhyPhoto />
        </ScrollDrift>
        {WAVES.map((wave) => (
          <svg
            key={wave.viewBox}
            aria-hidden
            viewBox={wave.viewBox}
            preserveAspectRatio="xMidYMid slice"
            className={`pointer-events-none absolute inset-0 size-full fill-brand-warm-snow ${wave.className}`}
          >
            <path d={BLOB} transform={`matrix(${TOP} ${wave.top} -223)`} />
            <path
              d={BLOB}
              transform={`matrix(${BOTTOM} ${wave.bottom} 2078.9146)`}
            />
          </svg>
        ))}
      </div>
      <SupporterFeed className="mt-10" />
    </section>
  );
}
