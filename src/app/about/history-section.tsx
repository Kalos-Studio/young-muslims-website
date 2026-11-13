import Image from "next/image";

import { ScrollDrift } from "@/components/site/scroll-drift";
import { TextReveal } from "@/components/site/text-reveal";
import { textRevealUnit } from "@/components/site/text-reveal-unit";
import { StandardButton } from "@/components/ui/standard-button";
import { cn } from "@/lib/utils";

import year1995 from "../../../design-assets/figma/about/history/1995.svg";
import watermark1995 from "../../../design-assets/figma/about/history/1995-watermark.svg";
import watermark2026 from "../../../design-assets/figma/about/history/2026-watermark.svg";
import digit0 from "../../../design-assets/figma/about/history/digit-0.webp";
import digit2First from "../../../design-assets/figma/about/history/digit-2-first.webp";
import digit2Second from "../../../design-assets/figma/about/history/digit-2-second.webp";
import digit6 from "../../../design-assets/figma/about/history/digit-6.webp";
import { HistoryLine } from "./history-line";
import styles from "./history-section.module.css";

/*
 * 2026, each digit a group photo with the numeral cut out of it (Figma's
 * 2x exports, 2031 / 2030 / 2029 / 2026 in the file). On phones the row
 * spans the viewport, edge to edge: each digit takes a share of it in
 * proportion to its Figma width (197 / 338 / 197 / 212), its height
 * following; from tablet the row has Figma's height and the digits their
 * own widths.
 */
const DIGITS = [
  { src: digit2First, grow: "grow-197" },
  { src: digit0, grow: "grow-338" },
  { src: digit2Second, grow: "grow-197" },
  { src: digit6, grow: "grow-212" },
];

const REPORT =
  "https://ymsite.com/wp-content/uploads/2026/02/YM-Annual-Report-2025-FINAL.pdf";

/**
 * The About page's "How it started." timeline, under the stats (Figma
 * 535:2724, tablet 596:2074, mobile 596:2730; DESIGN-SYSTEM.md, "About
 * history"): the heading, a grey 1995 over its big pale background year and
 * the founding paragraph, a line down to 2026 (four photo digits over their
 * big pale background year) and its paragraph with the annual report.
 *
 * Choreographed by HistoryLine (the only client part): the 1995 fades in,
 * then its background year; the line fills with the scroll, and full, it
 * brings the 2026 digits in one by one, then their background year. The
 * background years drift with the scroll (ScrollDrift). Under reduced
 * motion all of it simply shows.
 *
 * Each background year is 7/4 of its year's width, placed by fractions of
 * that year's box (Figma's offsets, the same at every frame), so it scales
 * with it; the section clips sideways.
 *
 * Phones: the 2026 digits span the viewport, edge to edge, and the 1995 is
 * 33/40 of that (Figma's 810 to 982), centred, so the two keep their
 * relation at every phone width; tablet and desktop keep Figma's sizes
 * (the 1995 centred on tablet too, as the 2026 is, at every tablet width).
 */
export function HistorySection() {
  return (
    <section
      aria-labelledby="history-heading"
      className="relative overflow-x-clip bg-brand-warm-snow pt-30.75 pb-23.5 text-brand-obsidian md:pt-40.25 md:pb-40.5 xl:pb-47"
    >
      <div className="relative mx-auto max-w-360">
        {/* 1995 */}
        <div className="relative">
          <TextReveal className="px-8 md:px-20 xl:absolute xl:top-0 xl:left-0">
            <h2
              id="history-heading"
              className="text-mobile-section font-extrabold md:text-landing-section"
            >
              How it started.
            </h2>
          </TextReveal>
          <div className="relative mx-auto mt-19.75 w-33/40 md:mt-31.5 md:w-131.5 xl:mt-0 xl:mr-0 xl:ml-137.5 xl:w-202.5">
            <ScrollDrift
              token="--about-history-drift"
              fallback={48}
              className={cn(
                "absolute -top-2/5 -left-3/8 w-7/4 xl:-left-1/3",
                styles.drift,
              )}
            >
              <Image
                data-history="watermark-1995"
                src={watermark1995}
                alt=""
                className="h-auto w-full"
              />
            </ScrollDrift>
            <Image
              data-history="front-1995"
              src={year1995}
              alt="1995"
              className="relative h-auto w-full"
            />
          </div>
          <TextReveal className="relative mt-18 px-8 md:mt-28.75 md:mr-16 md:ml-16.5 md:px-0 xl:mt-16 xl:mr-0 xl:ml-137.5 xl:max-w-202.5">
            <p className="text-body font-medium md:text-article-title xl:text-landing-copy">
              In the 1990s, Muslim youth leaders from across the country came
              together to talk about the future of a generation they believed
              in. Within weeks, Young Muslims was born — built from existing
              youth groups in New Jersey, New York, and Chicago.
            </p>
          </TextReveal>
        </div>

        <HistoryLine className="mx-auto mt-9.25 md:mt-5.75 xl:mt-15 xl:ml-238.25" />

        {/* 2026 */}
        <div className="relative mx-auto mt-25 flex w-full items-start gap-1.25 md:mt-45.25 md:h-76.5 md:w-fit md:gap-2.5 xl:mt-49 xl:ml-94.5 xl:h-100 xl:gap-3.25">
          <ScrollDrift
            token="--about-history-drift"
            fallback={48}
            className={cn(
              "absolute -top-7/16 -left-3/8 w-7/4 xl:-left-3/7",
              styles.drift,
            )}
          >
            <Image
              data-history="watermark-2026"
              src={watermark2026}
              alt=""
              className="h-auto w-full"
            />
          </ScrollDrift>
          <span className="sr-only">2026</span>
          {DIGITS.map(({ src, grow }, index) => (
            <Image
              key={index}
              data-history="digit"
              src={src}
              alt=""
              sizes="(width >= 80rem) 340px, (width >= 48rem) 260px, 35vw"
              className={cn(
                "relative h-auto min-w-0 basis-0 md:h-full md:w-auto md:grow-0 md:basis-auto",
                grow,
              )}
            />
          ))}
        </div>
        <TextReveal className="relative mt-16.5 px-8 md:mt-30 md:mr-16 md:ml-16.25 md:px-0 xl:mt-16 xl:mr-0 xl:ml-94.5 xl:max-w-245.5">
          <p className="text-body font-medium md:text-article-title xl:text-landing-copy">
            Thirty years later, that belief hasn’t changed. Young Muslims is
            still a grassroots movement, still run by the youth, still
            developing the next generation of American Muslims engaged in their
            communities at every level.
          </p>
          <StandardButton
            href={REPORT}
            label="Read the 2025 annual report"
            target="_blank"
            rel="noopener noreferrer"
            {...textRevealUnit}
            className="mt-8"
          />
        </TextReveal>
      </div>
    </section>
  );
}
