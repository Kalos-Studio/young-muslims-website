import Image, { getImageProps } from "next/image";

import { ClosingCta } from "@/components/site/closing-cta";
import { ScrollDrift } from "@/components/site/scroll-drift";
import { TextReveal } from "@/components/site/text-reveal";
import { StandardButton } from "@/components/ui/standard-button";
import { cn } from "@/lib/utils";

import markBrother from "../../../design-assets/figma/landing-2026/all-about/mark-monogram.svg";
import markSister from "../../../design-assets/figma/landing-2026/all-about/mark-ym.svg";
import ctaPhoto from "../../../design-assets/figma/stories/story-page/cta-brothers-lift.jpg";
import quoteMark from "../../../design-assets/figma/stories/story-page/quote-mark.svg";
import { StoryAccordion } from "./story-accordion";
import type { StoryPage as Story } from "./story-pages";
import styles from "./story-page.module.css";

const BANDS = [styles.band0, styles.band1, styles.band2, styles.band3] as const;

/**
 * The headline: its two lines, the last word in Landing Cyan (its closing
 * punctuation in Obsidian).
 */
function Headline({ lines }: { lines: Story["headline"] }) {
  const [first, last] = lines;
  const match = last.match(/^(.*?)(\S+?)([.!?’”]*)$/);
  const [, lead, accent, close] = match ?? ["", "", last, ""];
  return (
    <>
      <span className="block">{first}</span>{" "}
      <span className="block">
        {lead}
        <span className="text-landing-cyan">{accent}</span>
        {close}
      </span>
    </>
  );
}

/** The hero photo, art-directed: each frame's crop of it. */
function HeroPhoto({ story }: { story: Story }) {
  const common = { alt: story.photoAlt, sizes: "100vw" };
  const {
    props: { srcSet: desktop },
  } = getImageProps({ ...common, src: story.photo.desktop });
  const {
    props: { srcSet: tablet },
  } = getImageProps({ ...common, src: story.photo.tablet });
  const {
    props: { srcSet: mobile, ...img },
  } = getImageProps({ ...common, src: story.photo.mobile });
  return (
    <picture>
      <source media="(width >= 80rem)" srcSet={desktop} />
      <source media="(width >= 48rem)" srcSet={tablet} />
      <source srcSet={mobile} />
      <img
        {...img}
        alt={story.photoAlt}
        fetchPriority="high"
        loading="eager"
        className="absolute inset-0 size-full object-cover"
      />
    </picture>
  );
}

/**
 * A story page (Figma 413:69, tablet 414:1264, mobile 414:1418;
 * DESIGN-SYSTEM.md, "Story pages"), the same template for every person in
 * the Stories gallery:
 *
 * - **Hero:** on Warm Snow, "All Stories" (back to /stories) and the
 *   headline (Boldonse, its last word in Landing Cyan); below them the
 *   person's photo, full-bleed, in a band between organic shapes parting to
 *   show it (one of four), drifting with the scroll (ScrollDrift), shaded
 *   under the pull-quote, the big quote mark and the attribution in white.
 * - **Story:** the narrative and three accordions (how they started, the
 *   turning point, where they are now), over a faint watermark that drifts
 *   with the scroll: the sisters' "ym" roundel or the brothers' monogram.
 * - The closing CTA with this page's photo; the site footer follows.
 */
export function StoryPage({ story }: { story: Story }) {
  const pronoun = story.gender === "sister" ? "she" : "he";
  return (
    <main
      data-stories-page
      className="w-full bg-brand-warm-snow text-brand-obsidian"
    >
      <section
        aria-labelledby="story-title"
        className="relative h-239.5 overflow-clip md:h-256 xl:h-245.25"
      >
        <div className={cn("absolute inset-0", styles.band, BANDS[story.band])}>
          <ScrollDrift
            token="--story-hero-drift"
            fallback={96}
            className={styles.photo}
          >
            <HeroPhoto story={story} />
          </ScrollDrift>
          <div aria-hidden className={cn("absolute inset-0", styles.shade)} />
        </div>

        <div className="relative mx-auto flex max-w-360 flex-col items-start gap-5.75 px-8 pt-30.5 md:gap-10 md:px-16 md:pt-36.75 xl:flex-row xl:justify-between xl:px-20 xl:pt-40.5">
          <StandardButton
            href="/stories"
            label="All Stories"
            tone="ink"
            direction="back"
            className="w-auto xl:mt-3"
          />
          <TextReveal
            as="h1"
            id="story-title"
            className="font-display text-lead md:w-130 md:text-mobile-display xl:w-162.5 xl:text-landing-section xl:leading-19.25"
          >
            <Headline lines={story.headline} />
          </TextReveal>
        </div>

        <figure className="absolute inset-x-8 top-174.75 text-brand-pure-white md:inset-x-auto md:top-145.75 md:left-4/7 md:w-74.75 xl:top-134.75 xl:w-130">
          <Image
            src={quoteMark}
            alt=""
            className="absolute -top-18.75 -left-6 h-auto w-36.5 md:-left-10 xl:-top-28 xl:-left-18.75 xl:w-51"
          />
          <blockquote className="relative text-article-title font-bold md:text-landing-copy xl:text-mobile-display">
            {story.quote}
          </blockquote>
          <figcaption className="relative mt-5.5 text-nav font-extrabold md:mt-8 md:text-body xl:text-landing-copy">
            — {story.name}, YM {story.city}
          </figcaption>
        </figure>
      </section>

      <section
        aria-label={`${story.name}’s story`}
        className="relative overflow-clip pt-5 pb-27.5 md:pt-13.5 md:pb-29.75 xl:pt-13.75 xl:pb-39"
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 mx-auto max-w-360"
        >
          <ScrollDrift
            token="--story-watermark-drift"
            fallback={128}
            className={cn(
              "absolute -top-10 -left-8 size-99.5 md:-top-18.5 md:-left-41.5 md:size-154.25 xl:top-13.75 xl:-left-4.5 xl:size-138.5",
              styles.watermark,
            )}
          >
            <Image
              src={story.gender === "sister" ? markSister : markBrother}
              alt=""
              className="size-full"
            />
          </ScrollDrift>
        </div>
        <div className="relative mx-auto max-w-360 px-8 md:px-16 xl:px-20">
          <div className="text-body md:text-article-title xl:ml-auto xl:w-152.5 xl:text-landing-copy">
            <div className="flex flex-col gap-5 font-medium md:gap-5.5 xl:gap-6">
              {story.narrative.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
            <div className="mt-18 flex flex-col gap-10">
              <StoryAccordion title={`How ${pronoun} started`}>
                {story.started}
              </StoryAccordion>
              <div aria-hidden className="h-px bg-border" />
              <StoryAccordion title="The turning point">
                {story.turningPoint}
              </StoryAccordion>
              <div aria-hidden className="h-px bg-border" />
              <StoryAccordion title={`Where ${pronoun} is now`}>
                {story.now}
              </StoryAccordion>
            </div>
          </div>
        </div>
      </section>

      <ClosingCta
        image={ctaPhoto}
        alt="Young Muslims brothers lifting a brother into the air at an event"
      />
    </main>
  );
}
