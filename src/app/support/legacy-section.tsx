import Image from "next/image";

import { ScrollDrift } from "@/components/site/scroll-drift";
import { TextReveal } from "@/components/site/text-reveal";
import { MaterialIcon } from "@/components/ui/material-icon";
import { cn } from "@/lib/utils";

import poster from "../../../design-assets/figma/support/legacy/legacy-poster.jpg";
import { LegacyLettering } from "./legacy-lettering";
import { YM_MARK, YM_ROUND_MARK } from "./legacy-monograms";
import styles from "./legacy-section.module.css";
import { SupportFormLink } from "./support-form-link";

/**
 * The Support page's third section, "Built over generations. Still
 * growing." (Figma 446:2011, tablet 447:2546, mobile 447:3037;
 * DESIGN-SYSTEM.md, "Support legacy"). Warm Snow.
 *
 * The heading (TextReveal) and a "Support" button back up to the hero's
 * donation form (SupportFormLink); under them, the video's block: the
 * landing's three rows of lettering drifting with the scroll behind it
 * (LegacyLettering), and the video itself, for now a placeholder (see
 * VideoPlaceholder). Behind everything, the two YM monograms at 4%, Royal
 * top right and Jade bottom left, drifting with the scroll (ScrollDrift).
 *
 * Vertical rhythm, Figma's own (mobile / tablet / desktop): the heading
 * 67 / 152 / 152 below the section's top, the video 64 / 103 / 170 below
 * the button, and 463 / 486 / 281 under it (the frames' heights).
 */
export function LegacySection() {
  return (
    <section
      aria-labelledby="legacy-title"
      className="relative overflow-x-clip pt-16.75 pb-115.75 md:pt-38 md:pb-121.5 xl:pb-70.25"
    >
      {/* The monograms, in the 1440 column, behind the content. */}
      <div aria-hidden className="absolute inset-0 mx-auto max-w-360">
        <ScrollDrift
          token="--support-legacy-mark-drift"
          fallback={128}
          className={cn(
            "absolute top-24 -right-12.5 md:top-12.5 md:-right-13.25 xl:top-66.5 xl:right-4.5",
            styles.mark,
          )}
        >
          <svg
            viewBox="0 0 310.6 310.6"
            className="size-60.75 fill-brand-royal/4 md:size-77.75"
          >
            <path d={YM_MARK} />
          </svg>
        </ScrollDrift>
        <ScrollDrift
          token="--support-legacy-mark-drift"
          fallback={128}
          className={cn(
            "absolute bottom-18.75 -left-3.75 md:bottom-21 md:left-0 xl:bottom-14 xl:left-4.25",
            styles.mark,
          )}
        >
          <svg
            viewBox="0 0 310.6 310.6"
            className="size-60.75 fill-brand-jade/4 md:size-77.75"
          >
            {YM_ROUND_MARK.map((d) => (
              <path key={d.slice(0, 16)} d={d} />
            ))}
          </svg>
        </ScrollDrift>
      </div>

      <div className="relative mx-auto max-w-360 px-8 md:px-16 xl:px-22.5">
        <div className="flex max-w-160 flex-col items-start gap-8 xl:max-w-262">
          <TextReveal>
            <h2
              id="legacy-title"
              className="text-mobile-section font-extrabold md:text-tablet-section xl:text-landing-section"
            >
              Built over generations. Still growing.
            </h2>
          </TextReveal>
          <SupportFormLink />
        </div>
      </div>

      <div className="relative mt-16 md:mt-25.75 xl:mt-42.5">
        <LegacyLettering />
        <div className="relative mx-auto max-w-360 px-8 md:px-16 xl:px-0">
          <VideoPlaceholder />
        </div>
      </div>
    </section>
  );
}

/**
 * PLACEHOLDER for the film "This is Young Muslims: A Legacy for
 * Generations" (Figma 446:2033), until Young Muslims supply it: the poster
 * (the crowd at a gathering) under Figma's 40% dark overlay, the play mark
 * centred, and "COMING SOON" over the title at the bottom left. It is not a
 * control (nothing plays yet). Swap it for the real video, keeping this box
 * and its sizes: 833 x 529 centred on desktop, 624 x 396 at the column's
 * left on tablet, the column's width x 397 on phones.
 */
function VideoPlaceholder() {
  return (
    <figure className="relative h-99.25 w-full overflow-hidden bg-brand-obsidian md:h-99 md:w-156 xl:mx-auto xl:h-132.25 xl:w-208.25">
      <Image
        src={poster}
        alt="Hundreds of young Muslims gathered around a circle of friends in a conference hall"
        sizes="(width >= 80rem) 833px, (width >= 48rem) 624px, 100vw"
        className="absolute inset-0 size-full object-cover"
      />
      <div aria-hidden className="absolute inset-0 bg-brand-obsidian/40" />
      <MaterialIcon
        aria-hidden
        name="play_arrow"
        size={100}
        className="absolute top-1/2 left-1/2 -translate-1/2 text-brand-pure-white"
      />
      <figcaption className="absolute bottom-5.75 left-4.5 flex flex-col gap-1.5 pr-4.5 text-brand-pure-white md:bottom-7.25 md:left-7.5 xl:bottom-10 xl:left-10 xl:gap-2">
        <span className="text-article-meta font-extrabold xl:text-body">
          COMING SOON
        </span>
        <span className="text-landing-copy font-semibold md:text-lead xl:text-mobile-display">
          This is Young Muslims: A Legacy for Generations
        </span>
      </figcaption>
    </figure>
  );
}
