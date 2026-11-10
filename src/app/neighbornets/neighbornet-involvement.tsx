import Image, { type StaticImageData } from "next/image";

import { TextReveal } from "@/components/site/text-reveal";
import { textRevealUnit } from "@/components/site/text-reveal-unit";
import { StandardButton } from "@/components/ui/standard-button";

import eventsArt from "../../../design-assets/figma/neighbornets/2026-page/3d762.png";
import retreatsArt from "../../../design-assets/figma/neighbornets/2026-page/77d81.png";
import conferencesArt from "../../../design-assets/figma/neighbornets/2026-page/ff281.png";
import { NeighborNetInvolvementMotion } from "./neighbornet-involvement-motion";

const CARDS: { title: string; art: StaticImageData; description: string }[] = [
  {
    title: "Events",
    art: eventsArt,
    description:
      "Game nights, service projects, and community hangouts. One-off ways to meet Young Muslims and see what it’s like, no commitment required.",
  },
  {
    title: "Retreats",
    art: retreatsArt,
    description:
      "Getaways with your NeighborNet and beyond: archery, campfire halaqas, and the kind of bonding that only happens away from everything else.",
  },
  {
    title: "Conferences",
    art: conferencesArt,
    description:
      "Weekend-long gatherings that bring young Muslims together from across the country: workshops, speakers, and a few thousand new friends.",
  },
];

/**
 * "Other ways to get involved." (Figma 372:91, tablet 374:766, mobile
 * 401:1909), below the NeighborNet branding rows: the heading, its line and
 * a standard button to get in touch, then three cards, each a group photo
 * clipped to an organic blob (Figma's own export) with its word in Boldonse
 * over it, and a line about it below. Three in a row on desktop, two and one
 * centred on tablets, stacked on phones. The text uses the site's text
 * reveal; the blobs expand and fade in as they enter view
 * (NeighborNetInvolvementMotion).
 */
export function NeighborNetInvolvement() {
  return (
    <section
      aria-labelledby="other-ways-heading"
      className="bg-brand-warm-snow pt-19.25 pb-31 md:pt-16.75 md:pb-33.5 xl:pt-20.5 xl:pb-37.5"
    >
      <TextReveal className="mx-auto flex w-full max-w-360 flex-col items-center px-8 text-center md:px-16 xl:px-22.5">
        <h2
          id="other-ways-heading"
          className="text-mobile-section font-extrabold text-brand-obsidian md:text-landing-section"
        >
          Other ways to get involved.
        </h2>
        <p className="mt-4 text-body font-medium text-brand-obsidian md:text-landing-copy">
          Can&rsquo;t make it to a weekly NeighborNet? There&rsquo;s more than
          one way in.
        </p>
        <StandardButton
          href="/contact"
          label="Get in touch"
          {...textRevealUnit}
          className="mt-8 xl:mt-15"
        />
      </TextReveal>

      <NeighborNetInvolvementMotion className="mx-auto mt-14.75 flex w-full max-w-360 flex-col items-center gap-15 px-8 md:mt-26.25 md:max-w-192 md:flex-row md:flex-wrap md:justify-center md:gap-x-16 md:gap-y-18.75 md:px-16 xl:mt-36.5 xl:max-w-360 xl:flex-nowrap xl:gap-x-17 xl:px-22.5">
        {CARDS.map(({ title, art, description }) => (
          <li
            key={title}
            className="flex w-full max-w-74 flex-col items-center md:w-72 xl:w-94.5 xl:max-w-none"
          >
            <div
              data-involved="art"
              className="relative h-71 w-72 xl:h-93.25 xl:w-94.5"
            >
              <Image
                src={art}
                alt=""
                fill
                sizes="(min-width: 80rem) 378px, 288px"
                className="object-contain"
              />
              <h3 className="absolute inset-0 flex items-center justify-center font-display text-mobile-display text-brand-pure-white uppercase">
                {title}
              </h3>
            </div>
            <p className="mt-4.5 text-center text-body font-medium text-brand-obsidian xl:mt-6">
              {description}
            </p>
          </li>
        ))}
      </NeighborNetInvolvementMotion>
    </section>
  );
}
