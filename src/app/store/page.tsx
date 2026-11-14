import type { Metadata } from "next";

import { ClosingCta } from "@/components/site/closing-cta";

import ctaDesktop from "../../../design-assets/figma/store/cta/sisters-boardwalk-desktop.jpg";
import ctaMobile from "../../../design-assets/figma/store/cta/sisters-boardwalk-mobile.jpg";
import ctaTablet from "../../../design-assets/figma/store/cta/sisters-boardwalk-tablet.jpg";
import { StoreSplit } from "./store-split";

export const metadata: Metadata = {
  alternates: { canonical: "/store" },
  title: "Store",
  description: "Explore the Young Muslims brothers’ and sisters’ stores.",
};

/**
 * The Store page (DESIGN-SYSTEM.md, "Store split"): the brothers' and
 * sisters' stores in a pinned split hero, the closing CTA (Figma 456:3355)
 * scrolling up over it, then the shared footer from the root layout.
 */
export default function StorePage() {
  return (
    <main data-store-page>
      <h1 className="sr-only">Young Muslims Store</h1>
      <StoreSplit>
        <ClosingCta
          image={ctaDesktop}
          artDirection={{ tablet: ctaTablet, mobile: ctaMobile }}
          overHero
          alt="Young Muslims sisters smiling together for a group photo on a boardwalk by a lake"
        />
      </StoreSplit>
    </main>
  );
}
