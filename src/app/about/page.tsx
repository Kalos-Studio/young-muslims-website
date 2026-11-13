import type { Metadata } from "next";
import { AboutHero } from "./about-hero";
import { GenerationSection } from "./generation-section";
import { MissionVisionSection } from "./mission-vision-section";
import { YouthSection } from "./youth-section";
import { LeadershipSection } from "./leadership-section";
import { StatsSection } from "./stats-section";
import { HistorySection } from "./history-section";
import { TwoSidesSection } from "./two-sides-section";
import { ShuraSection } from "./shura-section";

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
        </div>
      </AboutHero>
    </main>
  );
}
