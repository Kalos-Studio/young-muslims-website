import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import chapterCtaShape from "../../../design-assets/figma/neighbornets/2026-page/2e336.png";
import chapterHero from "../../../design-assets/figma/neighbornets/find-nn-hero.jpg";
import { AnimatedCtaLabel } from "@/components/ui/animated-arrow";
// WIREFRAME: Remove the temporary map review note when the map is complete.
import { MapReviewNote } from "@/components/wireframe/map-review-note";
import { brotherLocations } from "@/generated/brother-neighbornets";
import { sisterLocations } from "@/generated/sister-neighbornets";
import {
  ChapterImageGrid,
  NeighborNetExplainer,
  OtherWaysSection,
} from "./chapter-page-sections";
import { NeighborNetsMap } from "./neighbornets-map";
import { defaultSettings, type MapSettings } from "./map-options";

export const metadata: Metadata = {
  alternates: { canonical: "/neighbornets" },
  title: "Join a NeighborNet",
  description:
    "Find a Young Muslims neighbornet near you: brothers' and sisters' circles across the United States.",
};

const chapterMapSettings: MapSettings = {
  ...defaultSettings,
  basemap: "blank",
  palette: "young-muslims",
  differentiator: "color",
  markerStyle: "ring",
  infoMode: "click-popup",
};

const locations = [...brotherLocations, ...sisterLocations];

function ChapterCtaSection() {
  return (
    <section
      data-header-theme="dark"
      className="relative h-[560px] w-full overflow-hidden bg-brand-warm-snow md:h-[723px]"
    >
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
      <section
        data-header-theme="dark"
        className="relative h-[720px] w-full overflow-hidden bg-brand-obsidian md:h-svh"
      >
        <Image
          src={chapterHero}
          alt="Young Muslims standing together on a sports field"
          fill
          priority
          unoptimized
          sizes="100vw"
          className="object-cover object-[center_58%]"
        />
        <div className="absolute inset-0 bg-brand-obsidian/25" />

        <div className="absolute top-1/2 left-1/2 z-10 flex w-full max-w-[1260px] -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-4 px-5 text-center text-brand-pure-white md:px-0">
          <h1 className="font-display text-[36px] leading-[1.2] tracking-[-0.02em] uppercase sm:text-[48px] md:text-landing-stat md:whitespace-nowrap">
            Find your NeighborNet
          </h1>
          <p className="max-w-[1000px] text-base font-semibold md:text-landing-copy md:whitespace-nowrap">
            There&apos;s one near you, meeting every week. Find it, walk in, and
            you&apos;re in. That&apos;s really all it takes.
          </p>
        </div>

        <svg
          aria-hidden="true"
          viewBox="0 0 1440 170"
          preserveAspectRatio="none"
          className="absolute right-0 bottom-[-1px] left-0 h-[100px] w-full text-[#f7f3f0] md:h-[170px]"
        >
          <path
            d="M0 32C345 119 1028 126 1440 78V170H0V32Z"
            fill="currentColor"
          />
        </svg>
      </section>

      <section
        data-header-theme="light"
        className="relative w-full bg-brand-warm-snow px-5 pt-20 pb-28 md:min-h-[1727px] md:px-8 md:pt-[334px] md:pb-[286px]"
      >
        <svg
          aria-hidden="true"
          viewBox="0 0 1440 180"
          preserveAspectRatio="none"
          className="pointer-events-none absolute top-0 left-0 h-[120px] w-full text-[#f7f3f0] md:h-[180px]"
        >
          <path
            d="M0 0H1440V94C1110 30 910 8 720 80C480 155 260 172 0 126V0Z"
            fill="currentColor"
          />
        </svg>
        <div className="mx-auto w-full max-w-[1260px]">
          {/* WIREFRAME: Temporary explanation of the map prototype's scope. */}
          <MapReviewNote />
          <NeighborNetsMap
            locations={locations}
            initialSettings={chapterMapSettings}
            showDebugPanel={false}
            bare
            finder
            interactive
            layout="chapter-page"
          />
        </div>
      </section>

      <NeighborNetExplainer />
      <ChapterImageGrid />
      <OtherWaysSection />
      <ChapterCtaSection />
    </main>
  );
}
