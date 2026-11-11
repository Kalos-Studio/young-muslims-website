import type { Metadata } from "next";

import { ClosingCta } from "@/components/site/closing-cta";
import sistersAtTheLake from "../../../design-assets/figma/neighbornets/2026-page/cta-sisters-lake.jpg";

import { NeighborNetsFinder } from "./map-finder";
import { NeighborNetBranding } from "./neighbornet-branding";
import { NeighborNetExplainer } from "./neighbornet-explainer";
import { NeighborNetInvolvement } from "./neighbornet-involvement";
import { NeighborNetsHero } from "./neighbornets-hero";
import { NeighborNetsMap } from "./neighbornets-map";
import { NeighborNetsMapSearch } from "./neighbornets-map-search";

export const metadata: Metadata = {
  alternates: { canonical: "/neighbornets" },
  title: "Join a NeighborNet",
  description:
    "Find a Young Muslims neighbornet near you: brothers' and sisters' circles across the United States.",
};

export default function NeighborNetsPage() {
  return (
    <main
      data-neighbornets-page
      className="w-full overflow-x-clip bg-brand-warm-snow text-brand-obsidian"
    >
      <NeighborNetsHero>
        {/* The finder (Figma 301:2121, 371:394): the heading and the search
            over the map (Figma's vertical rhythm; the search 60px under the
            heading from md, 32px on phones). The section clips the map's
            hover lens, and the heading's block (Figma's "Top", 334:2) lies
            over it, Warm Snow fading out at its foot, so the zoomed map
            slides under the heading. The finder joins the search to the
            map. */}
        <NeighborNetsFinder>
          <section
            aria-labelledby="find-neighbornet-heading"
            className="relative w-full overflow-clip bg-brand-warm-snow pb-24 xl:pb-71.5"
          >
            <div className="relative z-10 bg-linear-to-b from-brand-warm-snow from-83% to-transparent">
              <div className="mx-auto w-full max-w-360 px-8 pt-25 pb-12 md:px-16 xl:px-22.5 xl:pb-31.5">
                <h2
                  id="find-neighbornet-heading"
                  className="text-mobile-section font-extrabold text-brand-obsidian md:text-landing-section"
                >
                  Find a NeighborNet near you.
                </h2>
                <p className="mt-4 text-body font-medium text-brand-obsidian md:text-landing-copy">
                  Search your city, or select a state to see where Young Muslims
                  meets.
                </p>
                <NeighborNetsMapSearch />
              </div>
            </div>
            <div className="mx-auto mt-4 w-full max-w-360 xl:mt-8.25">
              <NeighborNetsMap />
            </div>
          </section>
        </NeighborNetsFinder>

        <NeighborNetExplainer />
        <NeighborNetBranding />
        <NeighborNetInvolvement />
        <ClosingCta
          image={sistersAtTheLake}
          alt="Young Muslims sisters gathered for a group photo by a lake, many making peace signs"
        />
      </NeighborNetsHero>
    </main>
  );
}
