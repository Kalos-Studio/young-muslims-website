import type { Metadata } from "next";

import { AllAboutSection } from "./landing/all-about-section";
import { BelongingSection } from "./landing/belonging-section";
import { EverywhereSection } from "./landing/everywhere-section";
import { LandingHero } from "./landing/landing-hero";
import { NeighborNetsSection } from "./landing/neighbornets-section";
import { PeopleStoriesSection } from "./landing/people-stories-section";
import { ShowYouSection } from "./landing/show-you-section";
import { PrinciplesSection } from "./landing/principles-section";
import { WordOnTheStreetSection } from "./landing/word-on-the-street-section";

import { ClosingCta } from "@/components/site/closing-cta";
import { JsonLd } from "@/components/site/json-ld";
import { PageFrame } from "@/components/wireframe/page-frame";
import { siteJsonLd } from "@/lib/seo";

import ymatxRailing from "../../design-assets/figma/landing-2026/cta/ymatx-railing.jpg";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
  title: { absolute: "Young Muslims" },
  description:
    "A nationwide brotherhood and sisterhood, built on real friendships and a shared Deen.",
};

export default function Home() {
  return (
    <PageFrame className="overflow-x-clip" data-landing-page="true">
      <JsonLd data={siteJsonLd} />
      {/* Every section after the hero scrolls up over the pinned hero. */}
      <LandingHero>
        <BelongingSection />

        <ShowYouSection />

        <AllAboutSection />

        <PrinciplesSection />

        <EverywhereSection />

        <PeopleStoriesSection />

        <NeighborNetsSection />

        <WordOnTheStreetSection />
        <ClosingCta
          image={ymatxRailing}
          alt="Young Muslims brothers in YMATX shirts at a railing, looking out over the city"
          imageFocus="low"
        />
      </LandingHero>
    </PageFrame>
  );
}
