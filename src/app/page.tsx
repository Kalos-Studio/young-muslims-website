import type { Metadata } from "next";

import { AllAboutSection } from "./landing/all-about-section";
import { BelongingSection } from "./landing/belonging-section";
import { ChapterFinderSection } from "./landing/chapter-finder-section";
import { EverywhereSection } from "./landing/everywhere-section";
import { LandingHero } from "./landing/landing-hero";
import { LandingCtaSection } from "./landing/landing-new-sections";
import { PeopleStoriesSection } from "./landing/people-stories-section";
import { ShowYouSection } from "./landing/show-you-section";
import { PrinciplesSection } from "./landing/principles-section";
import { WordOnTheStreetSection } from "./landing/word-on-the-street-section";

// WIREFRAME: ContentFrame only supplies the prototype's shared content width.
// The page imagery and layout below follow the approved Figma composition.
import { ContentFrame } from "@/components/wireframe/content-frame";
import { PageFrame } from "@/components/wireframe/page-frame";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
  title: "Young Muslims",
  description:
    "A nationwide brotherhood and sisterhood, built on real friendships and a shared Deen.",
};

export default function Home() {
  return (
    <PageFrame className="overflow-x-clip" data-landing-page="true">
      {/* Every section after the hero scrolls up over the pinned hero. */}
      <LandingHero>
        <BelongingSection />

        <ShowYouSection />

        <AllAboutSection />

        <PrinciplesSection />

        <EverywhereSection />

        <ContentFrame bleed>
          <PeopleStoriesSection />
        </ContentFrame>

        <ChapterFinderSection />
        <WordOnTheStreetSection />
        <LandingCtaSection />
      </LandingHero>
    </PageFrame>
  );
}
