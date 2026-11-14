import Image, { type StaticImageData } from "next/image";

import { TextReveal } from "@/components/site/text-reveal";
import { textRevealUnit } from "@/components/site/text-reveal-unit";
import { StandardButton } from "@/components/ui/standard-button";
import { cn } from "@/lib/utils";

import icna from "../../../design-assets/figma/about/partners/icna.webp";
import americanMuslimsForPalestine from "../../../design-assets/figma/about/partners/american-muslims-for-palestine.svg";
import icnaCouncilForSocialJustice from "../../../design-assets/figma/about/partners/icna-council-for-social-justice.webp";
import familyYouthInstitute from "../../../design-assets/figma/about/partners/family-youth-institute.webp";
import helpingHand from "../../../design-assets/figma/about/partners/helping-hand.webp";
import usCouncilOfMuslimOrganizations from "../../../design-assets/figma/about/partners/us-council-of-muslim-organizations.webp";
import yaqeenInstitute from "../../../design-assets/figma/about/partners/yaqeen-institute.webp";
import qalam from "../../../design-assets/figma/about/partners/qalam.webp";
import oaktreeInstitute from "../../../design-assets/figma/about/partners/oaktree-institute.webp";
import muslimAllianceForBlackLives from "../../../design-assets/figma/about/partners/muslim-alliance-for-black-lives.webp";
import msaNational from "../../../design-assets/figma/about/partners/msa-national.webp";
import khalilCenter from "../../../design-assets/figma/about/partners/khalil-center.webp";
import icnaRelief from "../../../design-assets/figma/about/partners/icna-relief.webp";
import { PartnersMarquee } from "./partners-marquee";
import styles from "./partners-section.module.css";

/*
 * The partners, in Figma's order, each at its Figma height per breakpoint
 * (1440 frame; tablet and phone frames scale the row by 0.7326 and 0.5233);
 * widths follow from each logo's own proportions (scripts/about-partners-
 * assets.mjs crops them to Figma's boxes).
 */
const PARTNERS: { name: string; logo: StaticImageData; height: string }[] = [
  {
    name: "Islamic Circle of North America (ICNA)",
    logo: icna,
    height: "h-17.25 md:h-24 xl:h-33",
  },
  {
    name: "American Muslims for Palestine (AMP)",
    logo: americanMuslimsForPalestine,
    height: "h-17 md:h-23.75 xl:h-32.5",
  },
  {
    name: "ICNA Council for Social Justice",
    logo: icnaCouncilForSocialJustice,
    height: "h-12.25 md:h-17.25 xl:h-23.5",
  },
  {
    name: "The Family & Youth Institute",
    logo: familyYouthInstitute,
    height: "h-17 md:h-23.75 xl:h-32.5",
  },
  {
    name: "Helping Hand for Relief and Development",
    logo: helpingHand,
    height: "h-12.25 md:h-17.25 xl:h-23.5",
  },
  {
    name: "US Council of Muslim Organizations",
    logo: usCouncilOfMuslimOrganizations,
    height: "h-16.75 md:h-23.5 xl:h-32",
  },
  {
    name: "Yaqeen Institute for Islamic Research",
    logo: yaqeenInstitute,
    height: "h-8.25 md:h-11.75 xl:h-16",
  },
  { name: "Qalam", logo: qalam, height: "h-10 md:h-14 xl:h-19" },
  {
    name: "Oaktree Institute",
    logo: oaktreeInstitute,
    height: "h-15 md:h-21 xl:h-28.5",
  },
  {
    name: "Muslim Alliance for Black Lives",
    logo: muslimAllianceForBlackLives,
    height: "h-11.25 md:h-15.75 xl:h-21.5",
  },
  {
    name: "MSA National",
    logo: msaNational,
    height: "h-12.5 md:h-17.5 xl:h-24",
  },
  {
    name: "Khalil Center",
    logo: khalilCenter,
    height: "h-9.5 md:h-13.25 xl:h-18",
  },
  {
    name: "ICNA Relief",
    logo: icnaRelief,
    height: "h-9.25 md:h-12.75 xl:h-17.5",
  },
];

/** One copy of the row: every logo, each followed by the gap. */
function LogoSet({ copy }: { copy: number }) {
  return (
    <ul
      aria-hidden={copy > 0 || undefined}
      className="flex shrink-0 items-center"
    >
      {PARTNERS.map((partner) => (
        <li
          key={partner.name}
          className="mr-10.5 shrink-0 md:mr-14.75 xl:mr-20"
        >
          <Image
            src={partner.logo}
            alt={copy > 0 ? "" : partner.name}
            sizes="(width >= 80rem) 440px, (width >= 48rem) 323px, 231px"
            className={cn("w-auto", partner.height)}
          />
        </li>
      ))}
    </ul>
  );
}

/**
 * The About page's partners section, after the Shura (Figma 544:653,
 * tablet 596:2430, mobile 596:3377; DESIGN-SYSTEM.md, "About partners"):
 * the heading on the left and the subline with a "Contact us" button on
 * the right (stacked on phones; one TextReveal), over a full-bleed row of
 * the 13 partners' logos that drifts left forever, on its own (not with
 * the scroll): two copies of the row side by side, the track moving by
 * one copy a loop (CSS), paused off screen (PartnersMarquee). Under reduced
 * motion the row rests at Figma's place.
 */
export function PartnersSection() {
  return (
    <section
      aria-labelledby="partners-heading"
      className="bg-brand-warm-snow pt-14 pb-19.75 text-brand-obsidian md:pt-14.75 md:pb-18.75 xl:pt-20 xl:pb-32"
    >
      <TextReveal className="mx-auto grid max-w-360 gap-4 px-8 md:grid-cols-2 md:gap-8 md:px-16 xl:px-20">
        <h2
          id="partners-heading"
          className="text-mobile-section font-extrabold md:text-landing-section"
        >
          Our Partners are what drive our movement forward.
        </h2>
        <div>
          <p className="text-body font-medium md:text-article-title xl:text-landing-copy">
            We work alongside the organizations building the future of the
            Muslim community — in service, education, and relief.
          </p>
          <StandardButton
            href="/contact"
            label="Contact us"
            {...textRevealUnit}
            className="mt-8"
          />
        </div>
      </TextReveal>

      <PartnersMarquee
        label="Our partners"
        className="mt-18.75 md:mt-25 xl:mt-26.75"
        trackClassName={styles.track}
      >
        <LogoSet copy={0} />
        <LogoSet copy={1} />
      </PartnersMarquee>
    </section>
  );
}
