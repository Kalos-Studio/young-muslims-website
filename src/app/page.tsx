import type { Metadata } from "next";
import Image, { type StaticImageData } from "next/image";
import Link from "next/link";

import cardDecorBottom from "../../design-assets/figma/landing-2026/card-decor-bottom.svg";
import cardDecorTop from "../../design-assets/figma/landing-2026/card-decor-top.svg";
import cardWaveObsidian from "../../design-assets/figma/landing-2026/card-wave-obsidian.svg";
import cardWavePale from "../../design-assets/figma/landing-2026/belonging-wave-pale-lower.svg";
import cardLeadership from "../../design-assets/figma/landing-2026/card-guidance-source.jpeg";
import cardGuidance from "../../design-assets/figma/landing-2026/card-guidance.png";
import cardService from "../../design-assets/figma/landing-2026/card-impact-source.jpeg";
import cardPeople from "../../design-assets/figma/landing-2026/card-people.jpeg";
import belongingWaveObsidian from "../../design-assets/figma/landing-2026/belonging-wave-obsidian.svg";
import belongingWavePale from "../../design-assets/figma/landing-2026/belonging-wave-pale.svg";
import highlightPlay from "../../design-assets/figma/landing-2026/highlight-play.svg";
import highlightReel from "../../design-assets/figma/landing-2026/highlight-reel.png";
import { AllAboutScrollStage } from "./all-about-scroll-stage";
import { BelongingPortraitOrbit } from "./belonging-portrait-orbit";
import { ChapterFinderSection } from "./chapter-finder-section";
import { EverywhereSection } from "./everywhere-section";
import { HeroVideo } from "./hero-video";
import { HighlightReelMarquee } from "./highlight-reel-section";
import { LandingCtaSection, LandingFooter } from "./landing-new-sections";
import { PeopleStoriesSection } from "./people-stories-section";
import { WhatWeStandOnSection } from "./what-we-stand-on-section";
import { WordOnTheStreetSection } from "./word-on-the-street-section";

// WIREFRAME: annotations remain available while the landing page is reviewed.
// The page imagery and layout below now follow the approved Figma composition.
// See WIREFRAME.md.
import { Annotate } from "@/components/wireframe/annotate";
import { PageFrame } from "@/components/wireframe/page-frame";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
  title: "Young Muslims",
  description:
    "A nationwide brotherhood and sisterhood, built on real friendships and a shared Deen.",
};

const POINTS = [
  {
    title: "Your people, every week",
    body: "Brotherhood and sisterhood come first. Weekly NeighborNets, halaqas, and pickup games. The friendships are the foundation for everything else.",
  },
  {
    title: "Become who you're meant to be",
    body: "Leadership workshops, career support, and the space to lead, speak, and build things you never would have on your own.",
  },
  {
    title: "Guidance that actually lands",
    body: "Peer-led mentorship from people your own age who get it. Real conversations, not lectures from across a generational gap.",
  },
  {
    title: "Turn belonging into impact",
    body: "Feeding the hungry, relief work, and local service. Showing up for your community, together.",
  },
] as const;

const PHOTO_CROP_CLASSES = {
  people:
    "absolute -top-[12.24%] -left-[86.14%] h-[112.24%] w-[272.29%] max-w-none",
  guidance: "absolute top-0 -left-[83.28%] h-[99.99%] w-[197.74%] max-w-none",
} as const;

function PhotoCard({
  point,
  image,
  className,
  crop,
}: {
  point: (typeof POINTS)[number];
  image: StaticImageData;
  className: string;
  crop?: keyof typeof PHOTO_CROP_CLASSES;
}) {
  return (
    <article
      className={`all-about-card absolute h-[482px] w-[296px] overflow-hidden rounded-card text-brand-pure-white md:w-[298px] ${className}`}
    >
      {crop ? (
        <Image
          src={image}
          alt=""
          sizes={crop === "people" ? "812px" : "590px"}
          className={PHOTO_CROP_CLASSES[crop]}
        />
      ) : (
        <Image
          src={image}
          alt=""
          fill
          sizes="(max-width: 767px) 296px, 298px"
          className="object-cover"
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-brand-obsidian/10 to-brand-obsidian/90" />
      <div className="absolute right-7 bottom-8 left-7">
        <h3 className="text-card-title font-semibold">{point.title}</h3>
        <p className="mt-5 text-body font-normal">{point.body}</p>
      </div>
    </article>
  );
}

function SolidCard({
  point,
  className,
  image,
}: {
  point: (typeof POINTS)[number];
  className: string;
  image?: StaticImageData;
}) {
  return (
    <article
      className={`all-about-card absolute h-[482px] w-[296px] overflow-hidden rounded-card px-7 md:w-[298px] ${image ? "text-brand-pure-white" : "bg-landing-blush text-landing-card-ink"} ${className}`}
    >
      {image ? (
        <>
          <Image
            src={image}
            alt=""
            className={
              point.title === "Become who you're meant to be"
                ? "absolute top-[-105.51%] left-[-112.75%] h-[291.28%] w-[314.12%] max-w-none"
                : "absolute inset-0 h-full w-full object-cover"
            }
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-brand-obsidian/10 to-brand-obsidian/90" />
        </>
      ) : null}
      <div className="absolute right-7 bottom-8 left-7">
        <h3 className="text-card-title font-semibold">{point.title}</h3>
        <p className="mt-5 text-body font-normal">{point.body}</p>
      </div>
    </article>
  );
}

export default function Home() {
  return (
    <PageFrame className="overflow-x-clip" data-landing-page="true">
      <Annotate
        bleed
        notes={[
          {
            placement: "top-left",
            note: (
              <>
                <span className="block font-bold">READ THIS FIRST</span>
                <span className="mt-3 block">
                  The landing page now follows the updated Figma composition,
                  imagery, colors, typography, hierarchy, and approved copy.
                </span>
              </>
            ),
          },
          {
            placement: "center-left",
            note: "The supplied community video autoplays silently on a loop behind the hero copy. It remains fixed within the hero and does not respond to scrolling.",
          },
        ]}
      >
        <HeroVideo />
      </Annotate>

      <Annotate
        bleed
        note="The updated portraits follow a continuous elliptical orbit, respond subtly to the pointer, and remain intentionally cropped at the viewport edges."
      >
        <section
          data-header-theme="light"
          className="relative h-[1298px] w-full overflow-hidden bg-brand-warm-snow md:h-[1830px]"
        >
          <div className="pointer-events-none absolute top-[1060px] left-1/2 z-0 flex h-[470px] w-[739px] -translate-x-1/2 rotate-[-9.8deg] items-center justify-center md:top-[1281px] md:left-[-873px] md:h-[1880px] md:w-[2956px] md:translate-x-0">
            <Image
              src={belongingWavePale}
              alt=""
              className="block max-w-none"
            />
          </div>
          <div className="pointer-events-none absolute top-[1110px] left-1/2 z-[1] flex h-[443px] w-[697px] -translate-x-1/2 rotate-[-9.8deg] items-center justify-center md:top-[1375px] md:left-[-781px] md:h-[1772px] md:w-[2787px] md:translate-x-0">
            <Image
              src={belongingWaveObsidian}
              alt=""
              className="block max-w-none"
            />
          </div>
          <div className="relative z-10 h-full">
            <BelongingPortraitOrbit />
          </div>
          <div className="absolute top-[487px] left-1/2 z-20 w-[290px] -translate-x-1/2 text-center md:top-[743px] md:w-full md:max-w-[784px]">
            <h2 className="text-[30px] leading-normal font-extrabold tracking-[-0.02em] text-brand-jade md:text-landing-section">
              More than a program.
              <br />A place to belong.
            </h2>
            <p className="mt-6 text-base leading-normal font-medium tracking-[-0.02em] text-brand-obsidian md:mt-[43px] md:text-landing-copy">
              Young Muslims is the nation&apos;s largest Muslim youth
              organization, but that&apos;s not how members describe it. To
              them, it&apos;s the people they see every week, the ones who
              became a second family. Across the country, Young Muslims turns
              everyday friendship into a stronger Deen, a stronger self, and a
              lifetime of brotherhood and sisterhood.
            </p>
          </div>
        </section>
      </Annotate>

      <Annotate
        bleed
        note="Selecting the highlight reel will open the full video in an overlay once the final video interaction is connected."
      >
        <section
          data-header-theme="dark"
          className="relative h-[808px] w-full overflow-hidden bg-brand-obsidian md:h-[899px]"
        >
          <div className="absolute top-0 left-1/2 h-full w-[360px] -translate-x-1/2 md:w-[1440px]">
            <h2 className="absolute top-[51px] left-1/2 w-[274px] -translate-x-1/2 text-center text-[30px] leading-normal font-extrabold tracking-[-0.02em] text-brand-warm-snow md:top-[113px] md:w-[784px] md:text-landing-section">
              But it&apos;s easier to just show you.
            </h2>
            <HighlightReelMarquee />
            <div className="absolute top-[190px] left-8 h-[397px] w-[296px] overflow-hidden rounded-media shadow-2xl md:top-[269px] md:left-[503px] md:h-[529px] md:w-[833px]">
              <Image
                src={highlightReel}
                alt="Young Muslims gathered together"
                fill
                sizes="(max-width: 767px) 296px, 833px"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-brand-obsidian/35" />
              <Image
                src={highlightPlay}
                alt=""
                className="absolute top-1/2 left-1/2 h-[66px] w-[66px] -translate-x-1/2 -translate-y-1/2 md:h-[88px] md:w-[88px]"
              />
              <div className="absolute right-6 bottom-6 left-6 text-brand-pure-white md:right-12 md:bottom-12 md:left-12">
                <p className="text-xs font-extrabold md:text-base">
                  30 SECOND WATCH
                </p>
                <p className="mt-1 text-xl leading-tight font-semibold md:mt-2 md:text-[32px]">
                  Young Muslims Highlight Reel
                </p>
              </div>
            </div>
          </div>
        </section>
      </Annotate>

      <Annotate
        bleed
        placement="top-right"
        note="The introduction stays fixed while the four cards move at different speeds during scroll."
      >
        <section
          data-header-theme="light"
          className="relative h-[2873px] w-full overflow-clip bg-brand-warm-snow md:h-[1791px]"
        >
          <div
            className="pointer-events-none absolute top-0 left-1/2 z-0 h-full -translate-x-1/2 overflow-hidden"
            style={{ width: "max(100vw, 1440px)" }}
          >
            <div
              className="absolute top-[-1208px] z-10 flex h-[1453px] w-[2154px] items-center justify-center"
              style={{ left: "calc(max(100vw, 1440px) / 2 - 1175px)" }}
            >
              <div className="rotate-[3.2deg]">
                <Image
                  src={cardWaveObsidian}
                  alt=""
                  className="block h-[1339px] w-[2082px] max-w-none"
                />
              </div>
            </div>
            <div
              className="absolute top-[-1213px] z-0 flex h-[1593px] w-[2361px] items-center justify-center"
              style={{ left: "calc(max(100vw, 1440px) / 2 - 1283px)" }}
            >
              <div className="rotate-[3.2deg]">
                <Image
                  src={cardWavePale}
                  alt=""
                  className="block h-[1468px] w-[2283px] max-w-none"
                />
              </div>
            </div>
          </div>
          <div className="relative z-10 h-full">
            <AllAboutScrollStage
              decorations={
                <>
                  <Image
                    src={cardDecorTop}
                    alt=""
                    className="absolute top-[392px] left-[193px] h-[200px] w-[200px] md:-top-[26px] md:left-[1111px] md:h-auto md:w-auto"
                  />
                  <Image
                    src={cardDecorBottom}
                    alt=""
                    className="absolute top-[2627px] left-[-41px] h-[200px] w-[200px] md:top-[1052px] md:left-[17px] md:h-auto md:w-auto"
                  />
                </>
              }
              intro={
                <>
                  <h2 className="text-[30px] leading-normal font-extrabold tracking-[-0.02em] md:text-landing-section">
                    This is what we&apos;re
                    <br />
                    all about.
                  </h2>
                  <p className="mt-4 text-base leading-normal font-medium tracking-[-0.02em] md:mt-8 md:text-landing-copy">
                    It starts as a hangout. It turns into brotherhood,
                    sisterhood, and a reason to show up for something bigger
                    than yourself.
                  </p>
                  <Link
                    href="/about"
                    className="mt-8 inline-flex w-full justify-center rounded-pill bg-brand-royal px-6 py-4 text-nav font-bold text-brand-pure-white outline-none hover:bg-brand-royal/80 focus-visible:ring-2 focus-visible:ring-brand-royal focus-visible:ring-offset-2 focus-visible:ring-offset-brand-warm-snow md:w-auto"
                  >
                    About Us
                  </Link>
                </>
              }
              cards={[
                <PhotoCard
                  key={POINTS[0].title}
                  point={POINTS[0]}
                  image={cardPeople}
                  className="top-[130px] left-8 md:left-[720px]"
                  crop="people"
                />,
                <SolidCard
                  key={POINTS[1].title}
                  point={POINTS[1]}
                  image={cardLeadership}
                  className="top-[684px] left-8 md:left-[720px]"
                />,
                <PhotoCard
                  key={POINTS[2].title}
                  point={POINTS[2]}
                  image={cardGuidance}
                  className="top-[220px] left-8 md:left-[1071px]"
                  crop="guidance"
                />,
                <SolidCard
                  key={POINTS[3].title}
                  point={POINTS[3]}
                  image={cardService}
                  className="top-[774px] left-8 md:left-[1071px]"
                />,
              ]}
            />
          </div>
        </section>
      </Annotate>

      <WhatWeStandOnSection />

      <Annotate
        bleed
        note="Once this section fills the viewport, the heading appears and the metrics count upward."
      >
        <EverywhereSection />
      </Annotate>

      <Annotate
        bleed
        note="The heading reveals first. Once it reaches the center, the portraits appear and begin orbiting. Hovering a portrait reveals a cursor-reactive shape, and selecting it opens a full-screen view."
      >
        <PeopleStoriesSection />
      </Annotate>

      <ChapterFinderSection />
      <WordOnTheStreetSection />
      <LandingCtaSection />
      <LandingFooter />
    </PageFrame>
  );
}
