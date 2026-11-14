import type { Metadata } from "next";

import { ClosingCta } from "@/components/site/closing-cta";

import ctaDesktop from "../../../design-assets/figma/about/cta/sisters-festival-desktop.jpg";
import ctaMobile from "../../../design-assets/figma/about/cta/sisters-festival-mobile.jpg";
import ctaTablet from "../../../design-assets/figma/about/cta/sisters-festival-tablet.jpg";
import { AboutHero } from "./about-hero";
import { GenerationSection } from "./generation-section";
import { MissionVisionSection } from "./mission-vision-section";
import { YouthSection } from "./youth-section";
import { LeadershipSection } from "./leadership-section";
import { StatsSection } from "./stats-section";
import { HistorySection } from "./history-section";
import { TwoSidesSection } from "./two-sides-section";
import { ShuraSection } from "./shura-section";
import { PartnersSection } from "./partners-section";
import { FaqSection } from "./faq-section";

export const metadata: Metadata = {
  alternates: { canonical: "/about" },
  title: "Who We Are",
  description:
    "From local NeighborNets to national advocacy: how Young Muslims develops faith, builds leaders, and contributes to the Islamic movement.",
};

export default function AboutPage() {
  return (
    <main data-photo-hero-page className="bg-background text-foreground">
      <AboutHero>
        {/* The page slides up over the pinned hero, so it is opaque. */}
        <div className="bg-background">
          <GenerationSection />

          <MissionVisionSection />

          <YouthSection />

          <LeadershipSection />

          <StatsSection />

          <HistorySection />

          <TwoSidesSection />

          <ShuraSection />

          <PartnersSection />

          <FaqSection />

          <ClosingCta
            image={ctaDesktop}
            artDirection={{ tablet: ctaTablet, mobile: ctaMobile }}
            alt="Three Young Muslims sisters smiling together on a hay ride at a fall festival"
          />
        </div>
      </AboutHero>
    </main>
  );
}
