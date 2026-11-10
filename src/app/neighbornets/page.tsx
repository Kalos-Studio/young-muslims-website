import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import chapterCtaShape from "../../../design-assets/figma/neighbornets/2026-page/2e336.png";
import { AnimatedCtaLabel } from "@/components/ui/animated-arrow";
import {
  ChapterImageGrid,
  NeighborNetExplainer,
  OtherWaysSection,
} from "./chapter-page-sections";
import { NeighborNetsFinder } from "./map-finder";
import { NeighborNetsHero } from "./neighbornets-hero";
import { NeighborNetsMap } from "./neighbornets-map";
import { NeighborNetsMapSearch } from "./neighbornets-map-search";

export const metadata: Metadata = {
  alternates: { canonical: "/neighbornets" },
  title: "Join a NeighborNet",
  description:
    "Find a Young Muslims neighbornet near you: brothers' and sisters' circles across the United States.",
};

function ChapterCtaSection() {
  return (
    <section className="relative h-[560px] w-full overflow-hidden bg-brand-warm-snow md:h-[723px]">
      <div className="absolute inset-x-0 bottom-0 h-[55%] bg-brand-obsidian" />
      <div className="absolute top-0 left-1/2 h-full w-[1720px] -translate-x-1/2 md:top-[-79px] md:h-[756px] md:w-[2311px] md:rotate-[3.7deg]">
        <Image
          src={chapterCtaShape}
          alt="Young Muslim women gathered beside a lake"
          fill
          sizes="(max-width: 767px) 1720px, 2311px"
          className="object-contain"
        />
      </div>

      <div className="relative z-10 mx-auto flex h-full max-w-[1182px] flex-col justify-center gap-8 px-6 pt-10 md:flex-row md:items-center md:justify-between md:gap-16 md:px-0 md:pt-0">
        <h2 className="max-w-[692px] text-[30px] leading-[1.2] font-extrabold tracking-[-0.02em] text-brand-warm-snow md:text-landing-section">
          Seeking the pleasure of Allah (SWT) by empowering Muslim youth.
        </h2>

        <div className="flex w-full shrink-0 flex-col gap-5 md:mr-[97px] md:w-[312px] md:gap-8">
          <Link
            href="/about"
            className="ym-cta-trigger flex h-[61px] items-center gap-3 bg-brand-warm-snow px-[31px] text-[18px] font-bold tracking-[-0.02em] text-brand-obsidian transition-colors hover:bg-brand-pure-white focus-visible:ring-2 focus-visible:ring-brand-pure-white focus-visible:ring-offset-2 focus-visible:ring-offset-brand-obsidian focus-visible:outline-none"
          >
            <AnimatedCtaLabel label="Get involved" textClassName="flex-1" />
          </Link>
          <Link
            href="/support"
            className="ym-cta-trigger flex h-[61px] items-center gap-3 border border-brand-warm-snow px-[31px] text-[18px] font-bold tracking-[-0.02em] text-brand-warm-snow transition-colors hover:bg-brand-warm-snow hover:text-brand-obsidian focus-visible:ring-2 focus-visible:ring-brand-warm-snow focus-visible:ring-offset-2 focus-visible:ring-offset-brand-obsidian focus-visible:outline-none"
          >
            <AnimatedCtaLabel label="Support us" textClassName="flex-1" />
          </Link>
        </div>
      </div>
    </section>
  );
}

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
        <ChapterImageGrid />
        <OtherWaysSection />
        <ChapterCtaSection />
      </NeighborNetsHero>
    </main>
  );
}
