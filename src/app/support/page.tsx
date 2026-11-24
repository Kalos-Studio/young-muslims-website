import type { Metadata } from "next";

import { ClosingCta } from "@/components/site/closing-cta";

import ctaDesktop from "../../../design-assets/figma/support/cta/brothers-magnolia-desktop.jpg";
import ctaMobile from "../../../design-assets/figma/support/cta/brothers-magnolia-mobile.jpg";
import ctaTablet from "../../../design-assets/figma/support/cta/brothers-magnolia-tablet.jpg";

import { LegacySection } from "./legacy-section";
import { SupportHero } from "./support-hero";
import { WhereSection } from "./where-section";
import { WhyItMatters } from "./why-it-matters";

export const metadata: Metadata = {
  alternates: { canonical: "/support" },
  title: "Support",
  description: "Give to the work, and see where it goes.",
};

export default function SupportPage() {
  return (
    <main
      data-support-page
      className="overflow-clip bg-background text-foreground"
    >
      <SupportHero>
        <WhyItMatters />

        <LegacySection />

        <WhereSection />

        <ClosingCta
          image={ctaDesktop}
          artDirection={{ tablet: ctaTablet, mobile: ctaMobile }}
          getInvolvedHref="/neighbornets"
          supportHref="top"
          alt="A crowd of young Muslim brothers laughing together under a magnolia tree in bloom"
        />
      </SupportHero>
    </main>
  );
}
