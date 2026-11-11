import type { Metadata } from "next";

import { ClosingCta } from "@/components/site/closing-cta";

import ctaPhoto from "../../../design-assets/figma/stories/cta-celebrating.webp";
import { AlumniSection } from "./alumni-section";
import { StoriesGallery } from "./stories-gallery";
import { StoriesHero } from "./stories-hero";

export const metadata: Metadata = {
  alternates: { canonical: "/stories" },
  title: "Stories",
  description: "The impact YM has had on people, in their words.",
};

export default function StoriesPage() {
  return (
    <main data-stories-page className="w-full bg-brand-warm-snow">
      <StoriesHero>
        {/* The page slides up over the pinned hero, so it is opaque. */}
        <div className="bg-brand-warm-snow">
          <StoriesGallery />
          <AlumniSection />
          <ClosingCta
            image={ctaPhoto}
            alt="Young Muslims celebrating together"
          />
        </div>
      </StoriesHero>
    </main>
  );
}
