import Image from "next/image";

import { GrainFilter } from "@/components/site/grain-filter";
import { TeamCardText } from "@/components/site/team-card-text";
import { TextReveal } from "@/components/site/text-reveal";
import { textRevealUnit } from "@/components/site/text-reveal-unit";
import { StandardButton } from "@/components/ui/standard-button";
import { cn } from "@/lib/utils";

import { StreetCardsMotion } from "../landing/street-cards-motion";
import { SHURA, type ShuraMember } from "./shura";
import { ShuraColumnsDrift } from "./shura-columns-drift";
import styles from "./shura-section.module.css";

const PLACEHOLDERS = {
  royal: "bg-brand-royal",
  jade: "bg-brand-jade",
} as const;

/**
 * One Shura member: the photo (285 x 282 from tablet; 130 square on
 * phones, beside the text) and the shared team card text, its tag in 24%
 * Obsidian. Not a link. A member without a photo shows Figma's Royal or
 * Jade block (shura.ts: swap in their photo when YM sends it).
 */
function MemberCard({ member }: { member: ShuraMember }) {
  const { photo } = member;
  return (
    <li
      className={cn(
        "flex items-start gap-4 md:block md:w-71.25 md:even:translate-y-12.25",
        styles.card,
      )}
    >
      <div
        data-street="art"
        className="relative size-32.5 shrink-0 md:h-70.5 md:w-71.25"
      >
        {"placeholder" in photo ? (
          <div
            className={cn(
              "absolute inset-0",
              PLACEHOLDERS[photo.placeholder],
              styles.grain,
            )}
          />
        ) : (
          <Image
            src={photo}
            alt=""
            sizes="(width >= 48rem) 285px, 130px"
            className={cn(
              "absolute inset-0 size-full object-cover",
              styles.grain,
            )}
          />
        )}
      </div>
      <TeamCardText
        tag={member.tag}
        name={member.name}
        role={member.role}
        tone="muted"
        className="min-w-0 flex-1 md:mt-6"
      />
    </li>
  );
}

/**
 * The About page's "The Young Muslims team." section, the National Shura,
 * after "Two sides. One mission." (Figma 542:174, tablet 596:2123, mobile
 * 596:2778; DESIGN-SYSTEM.md, "About Shura").
 *
 * The heading, paragraph and a "Contact us" button (TextReveal: it rises in
 * as it enters view, which, arriving into the "Two sides" section's empty,
 * releasing stage, is the handoff from its monograms), then the 23 members'
 * cards (shura.ts), coming in one at a time as they enter view (the shared
 * card entrance, as the Stories alumni row's): four columns on desktop and
 * two on tablet, 285 wide and 46 apart, centred, every second column 49
 * lower (a translate, so rows keep Figma's pitch); one per row on phones,
 * the photo beside the text.
 *
 * From tablet the columns drift at their own scroll-linked rates
 * (ShuraColumnsDrift), for depth. The header sits close under the "Two
 * sides" section, overlapping it: while that section pins, this one is
 * pulled up over the end of its runway and slides over its sticky stage
 * (shura-section.module.css), the header rising in as it enters
 * (`startAtEdge`) while the monograms are still leaving.
 *
 * Server-rendered; only the entrances and the drift run client-side, and
 * under reduced motion everything is simply there and still.
 */
export function ShuraSection() {
  return (
    <section
      aria-labelledby="shura-heading"
      className={cn(
        "relative bg-brand-warm-snow text-brand-obsidian",
        styles.section,
      )}
    >
      <GrainFilter id="shura-grain" />
      <ShuraColumnsDrift />
      <div
        className={cn(
          "mx-auto max-w-360 px-8 pt-9.25 pb-20.25 md:px-16 md:pt-10 md:pb-19 xl:pt-12 xl:pb-28",
          styles.inner,
        )}
      >
        <TextReveal startAtEdge className="mx-auto max-w-196 text-center">
          <h2
            id="shura-heading"
            className="text-mobile-section font-extrabold md:text-landing-section"
          >
            The <br className="md:hidden" />
            Young Muslims team.
          </h2>
          <p className="mt-4 text-body font-medium md:text-article-title xl:text-landing-copy">
            Young Muslims is led by its National Shura. A body of young leaders
            elected from across the country who guide the organization’s
            direction, all while staying rooted in the NeighborNets they came
            from.
          </p>
          <StandardButton
            href="/contact"
            label="Contact us"
            {...textRevealUnit}
            className="mt-8"
          />
        </TextReveal>

        <StreetCardsMotion
          data-shura="grid"
          stagger="--duration-about-shura-stagger"
          className="mt-17.75 flex flex-col gap-8.5 md:mx-auto md:mt-22.75 md:grid md:w-fit md:grid-cols-2 md:gap-x-11.5 md:gap-y-22.25 xl:mt-14.5 xl:grid-cols-4 xl:gap-y-20.75"
        >
          {SHURA.map((member) => (
            <MemberCard key={member.name} member={member} />
          ))}
        </StreetCardsMotion>
      </div>
    </section>
  );
}
