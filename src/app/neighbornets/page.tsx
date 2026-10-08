import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import chapterCtaPhoto from "../../../design-assets/figma/neighbornets/footer-lakeside.jpg";
import chapterHero from "../../../design-assets/figma/neighbornets/find-nn-hero.jpg";
import ctaArrowDark from "../../../design-assets/figma/landing-2026/new-sections/cta-arrow-dark.svg";
import ctaArrowLight from "../../../design-assets/figma/landing-2026/new-sections/cta-arrow-light.svg";
import { LandingFooter } from "../landing-new-sections";
import { brotherLocations } from "@/generated/brother-neighbornets";
import { sisterLocations } from "@/generated/sister-neighbornets";
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
  basemap: "streets",
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
      className="relative h-[723px] w-full overflow-hidden bg-brand-warm-snow"
    >
      <div className="absolute top-[352px] right-0 bottom-0 left-0 bg-brand-obsidian" />

      <svg aria-hidden="true" className="absolute size-0">
        <defs>
          <clipPath
            id="chapter-cta-photo-clip"
            clipPathUnits="objectBoundingBox"
          >
            <path d="M0 .13 C.23 .035 .7 .015 1 .12 L1 .86 C.69 .98 .31 .985 0 .88Z" />
          </clipPath>
        </defs>
      </svg>

      <div className="chapter-cta-photo absolute inset-0">
        <Image
          src={chapterCtaPhoto}
          alt="Young Muslim women gathered beside a lake"
          fill
          unoptimized
          sizes="100vw"
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-brand-obsidian/30" />
      </div>

      <div className="absolute top-0 left-1/2 h-full w-[1440px] -translate-x-1/2">
        <h2 className="absolute top-[314px] left-[129px] w-[692px] text-landing-section font-extrabold text-brand-warm-snow">
          Seeking the pleasure of Allah (SWT) by empowering Muslim youth.
        </h2>

        <div className="absolute top-[285px] left-[902px] flex w-[312px] flex-col gap-8">
          <Link
            href="/about"
            className="flex h-[61px] items-center gap-3 bg-brand-warm-snow px-[31px] text-[18px] font-bold tracking-[-0.02em] text-brand-obsidian transition-colors hover:bg-brand-pure-white focus-visible:ring-2 focus-visible:ring-brand-pure-white focus-visible:ring-offset-2 focus-visible:ring-offset-brand-obsidian focus-visible:outline-none"
          >
            <span className="flex-1">Get involved</span>
            <Image src={ctaArrowDark} alt="" />
          </Link>
          <Link
            href="/support"
            className="flex h-[61px] items-center gap-3 border border-brand-warm-snow px-[31px] text-[18px] font-bold tracking-[-0.02em] text-brand-warm-snow transition-colors hover:bg-brand-warm-snow hover:text-brand-obsidian focus-visible:ring-2 focus-visible:ring-brand-warm-snow focus-visible:ring-offset-2 focus-visible:ring-offset-brand-obsidian focus-visible:outline-none"
          >
            <span className="flex-1">Support us</span>
            <Image src={ctaArrowLight} alt="" />
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
        className="relative h-[1007px] w-full overflow-hidden bg-brand-obsidian"
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

        <div className="absolute top-[458px] left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-4 text-center text-brand-pure-white">
          <h1 className="font-display text-landing-stat whitespace-nowrap uppercase">
            Find your NeighborNet
          </h1>
          <p className="text-landing-copy font-semibold whitespace-nowrap">
            There&apos;s one near you, meeting every week. Find it, walk in, and
            you&apos;re in. That&apos;s really all it takes.
          </p>
        </div>

        <svg
          aria-hidden="true"
          viewBox="0 0 1440 170"
          preserveAspectRatio="none"
          className="absolute right-0 bottom-[-1px] left-0 h-[170px] w-full text-brand-warm-snow"
        >
          <path
            d="M0 32C345 119 1028 126 1440 78V170H0V32Z"
            fill="currentColor"
          />
        </svg>
      </section>

      <section
        data-header-theme="light"
        className="relative h-[1727px] w-full overflow-hidden bg-brand-warm-snow"
      >
        <div className="absolute top-[334px] left-1/2 w-[1260px] -translate-x-1/2">
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

      <ChapterCtaSection />
      <LandingFooter />
    </main>
  );
}
