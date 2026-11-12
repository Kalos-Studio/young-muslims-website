import Image from "next/image";

import { TextReveal } from "@/components/site/text-reveal";
import { textRevealUnit } from "@/components/site/text-reveal-unit";
import { MaterialIcon } from "@/components/ui/material-icon";
import { StandardButton } from "@/components/ui/standard-button";
import { cn } from "@/lib/utils";

import { STREET_ARTICLES, type StreetArticle } from "./street-articles";
import { StreetCardsMotion } from "./street-cards-motion";
import styles from "./word-on-the-street-section.module.css";

const MASKS: Record<StreetArticle["slug"], string> = {
  "mental-health": styles.maskMentalHealth,
  "judgement-stigma": styles.maskJudgementStigma,
  "ramadan-guide": styles.maskRamadanGuide,
};

const SIZES = "(width >= 80rem) 378px, (width >= 48rem) 50vw, 100vw";

/**
 * One article: the whole card is a link to the report's PDF (new tab). The
 * photo rests in its organic blob; on hover (fine pointer) or keyboard focus
 * the blob grows into the full square. The photo never moves: over it sits
 * a Warm Snow frame with the blob cut out, and the frame scales up from the
 * blob's centre until the hole clears the box (which clips it), a plain
 * compositor transform. The 32% Obsidian overlay (under the frame, so only
 * the revealed photo darkens) and "Read article ↗" fade in with it. Under
 * reduced motion the square appears at once.
 */
function ArticleCard({ article }: { article: StreetArticle }) {
  return (
    <li>
      <a
        href={article.href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`${article.title} (PDF, opens in a new tab)`}
        className={cn(
          "block outline-none focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-royal",
          styles.card,
        )}
      >
        <div data-street="art" className="relative">
          <Image
            src={article.photo}
            alt=""
            sizes={SIZES}
            className="block h-auto w-full"
          />
          <div
            aria-hidden="true"
            className={cn(
              "absolute inset-0 bg-brand-obsidian/32",
              styles.overlay,
            )}
          />
          {/* Warm Snow with the blob cut out: the photo shows through the
              hole, and scaling the frame grows the hole into the square.
              The frame is clipped a pixel outside the photo, not at its
              edge: at a fractional position the photo's last row of pixels
              is then wholly under the frame (two edges clipped on the same
              row let a hairline of photo through), and the frame's own
              clipped edge falls on Warm Snow. */}
          <div
            aria-hidden="true"
            className="absolute -inset-px overflow-hidden"
          >
            <div
              className={cn(
                "absolute inset-0 bg-brand-warm-snow",
                styles.frame,
                MASKS[article.slug],
              )}
            />
          </div>
          <span
            aria-hidden="true"
            className={cn(
              "absolute inset-0 flex items-center justify-center gap-1 text-landing-copy font-bold text-brand-pure-white",
              styles.label,
            )}
          >
            Read article
            <MaterialIcon name="arrow_outward" />
          </span>
        </div>
        <h3 className="mt-6 text-article-title font-semibold text-brand-obsidian">
          {article.title}
        </h3>
        <p className="mt-1.5 text-article-meta font-medium text-brand-jade">
          {article.date}
          <span aria-hidden="true" className="px-1.5">
            •
          </span>
          {article.author}
        </p>
        <p className="mt-3 text-nav font-medium text-caption">
          {article.description}
        </p>
      </a>
    </li>
  );
}

/**
 * The landing page's "Word on the street" blog snippet (Figma 270:289,
 * tablet 280:735, mobile 297:1394; hover 270:511).
 *
 * "Word on the street." and its subline (TextReveal) with "View latest"
 * (StandardButton, to /blog) beside them from tablet and under them on
 * mobile, then the three article cards (street-articles.ts): a row of three
 * on desktop (378 wide, 68 apart), two columns on tablet, one on mobile.
 * Content caps at 1440 (Figma's 90 / 80 insets); mobile keeps the 32px
 * gutters, the content spanning the full width between them.
 *
 * Server-rendered; the hover is CSS, and only the cards' entrance (the
 * shared shape motion) runs client-side (StreetCardsMotion).
 */
export function WordOnTheStreetSection() {
  return (
    <section
      aria-labelledby="street-heading"
      className="bg-brand-warm-snow text-brand-obsidian"
    >
      <div className="mx-auto max-w-360 px-8 pt-20.5 pb-24 md:px-16 md:pt-24 md:pb-28 xl:pt-32.25 xl:pr-20 xl:pb-40 xl:pl-22.5">
        <TextReveal className="flex flex-col gap-8 md:flex-row md:items-end">
          <div className="md:flex-1">
            <h2
              id="street-heading"
              className="text-mobile-section font-extrabold md:text-landing-section"
            >
              Word on the street.
            </h2>
            <p className="mt-4 text-body font-medium md:text-landing-copy">
              Straight from the NeighborNets &mdash; what&rsquo;s happening,
              what&rsquo;s coming up, and what we&rsquo;re thinking about.
            </p>
          </div>
          <StandardButton
            href="/blog"
            label="View latest"
            {...textRevealUnit}
          />
        </TextReveal>

        <StreetCardsMotion className="mt-16 grid grid-cols-1 gap-y-13 md:mt-17 md:grid-cols-2 md:gap-x-17 md:gap-y-17 xl:grid-cols-3">
          {STREET_ARTICLES.map((article) => (
            <ArticleCard key={article.slug} article={article} />
          ))}
        </StreetCardsMotion>
      </div>
    </section>
  );
}
