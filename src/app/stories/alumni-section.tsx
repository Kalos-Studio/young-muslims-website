import Image from "next/image";
import Link from "next/link";

import { TextReveal } from "@/components/site/text-reveal";
import { MaterialIcon } from "@/components/ui/material-icon";
import { cn } from "@/lib/utils";

import { StreetCardsMotion } from "../landing/street-cards-motion";
import street from "../landing/word-on-the-street-section.module.css";
import { ALUMNI, type Alumnus } from "./alumni";

/* The landing "Word on the street" cards' blobs, in turn along the row. */
const BLOBS = [
  street.maskMentalHealth,
  street.maskJudgementStigma,
  street.maskRamadanGuide,
] as const;

const SIZES = "(width >= 48rem) 285px, 133px";

/**
 * One team member: the whole card links to their story page (the alumni
 * variant), through the page transition, its cover in Royal (the tag's
 * colour). The photo rests in an organic blob and, on hover (fine pointer)
 * or keyboard focus, grows into the full square under a 32% Obsidian
 * overlay and "View ↗": the landing blog cards' hover, their CSS reused
 * as is (word-on-the-street-section.module.css).
 */
function AlumnusCard({ alumnus, index }: { alumnus: Alumnus; index: number }) {
  return (
    <li className="md:w-71.25">
      <Link
        href={`/stories/${alumnus.slug}`}
        data-transition-color="royal"
        aria-label={`${alumnus.name}, ${alumnus.role}, ${alumnus.tag}: read ${alumnus.gender === "sister" ? "her" : "his"} story`}
        className={cn(
          "flex items-start gap-6 outline-none focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-royal md:block",
          street.card,
        )}
      >
        <div
          data-street="art"
          className="relative h-32.75 w-33.25 shrink-0 md:h-70.5 md:w-71.25"
        >
          <Image
            src={alumnus.card}
            alt=""
            sizes={SIZES}
            className="absolute inset-0 size-full object-cover"
          />
          <div
            aria-hidden="true"
            className={cn(
              "absolute inset-0 bg-brand-obsidian/32",
              street.overlay,
            )}
          />
          {/* Clipped a pixel outside the photo, as the landing's cards
              (word-on-the-street-section.tsx), so no hairline of photo
              shows along the box's edge. */}
          <div
            aria-hidden="true"
            className="absolute -inset-px overflow-hidden"
          >
            <div
              className={cn(
                "absolute inset-0 bg-brand-warm-snow",
                street.frame,
                BLOBS[index % BLOBS.length],
              )}
            />
          </div>
          <span
            aria-hidden="true"
            className={cn(
              "absolute inset-0 flex items-center justify-center gap-1 text-landing-copy font-bold text-brand-pure-white",
              street.label,
            )}
          >
            View
            <MaterialIcon name="arrow_outward" />
          </span>
        </div>
        <div className="md:mt-6">
          <p className="inline-block bg-brand-royal px-1.5 py-1 text-article-meta font-semibold text-brand-pure-white">
            {alumnus.tag}
          </p>
          <h3 className="mt-3 text-article-title font-bold text-brand-obsidian">
            {alumnus.name}
          </h3>
          <p className="mt-2 text-nav font-medium text-caption">
            {alumnus.role}
          </p>
        </div>
      </Link>
    </li>
  );
}

/**
 * The Stories page's "Or hear from the Young Muslims team" section, under
 * the gallery (Figma 587:1538, tablet 593:1673, mobile 593:1733;
 * DESIGN-SYSTEM.md, "Stories alumni").
 *
 * The heading and its subline (TextReveal), then the team's cards (alumni.ts;
 * today only Muneeb): from tablet, cards 285 wide, left-aligned and 40
 * apart, wrapping as they run out of room (Figma's single card sits at the
 * left inset, 90 / 64, capped at 1440; more fill in beside it, four to a
 * row on desktop, two on tablet, with no empty columns); on mobile one per
 * row, the photo (133 x 131) beside the text.
 *
 * Server-rendered; the hover is CSS, and only the cards' staggered entrance
 * (the shared shape motion) runs client-side (StreetCardsMotion).
 */
export function AlumniSection() {
  return (
    <section
      aria-labelledby="alumni-heading"
      className="bg-brand-warm-snow text-brand-obsidian"
    >
      <div className="mx-auto max-w-360 px-8 pt-12.5 pb-19.75 md:px-16 md:pt-22 md:pb-34.75 xl:px-22.5 xl:pt-19.5 xl:pb-31">
        <TextReveal>
          <h2
            id="alumni-heading"
            className="text-mobile-section font-extrabold md:text-landing-section"
          >
            Or hear from the Young Muslims team.
          </h2>
          <p className="mt-4 text-body font-medium md:text-article-title xl:text-landing-copy">
            Learn a bit about where the people that run Young Muslims came from.
          </p>
        </TextReveal>

        <StreetCardsMotion
          stagger="--duration-stories-alumni-stagger"
          className="mt-12 flex flex-col gap-10 md:mt-17 md:flex-row md:flex-wrap md:gap-x-10 md:gap-y-14"
        >
          {ALUMNI.map((alumnus, index) => (
            <AlumnusCard key={alumnus.slug} alumnus={alumnus} index={index} />
          ))}
        </StreetCardsMotion>
      </div>
    </section>
  );
}
