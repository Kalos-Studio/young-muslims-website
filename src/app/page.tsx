import type { Metadata } from "next";
import Image, { type StaticImageData } from "next/image";
import Link from "next/link";

import { AnimatedCtaLabel } from "@/components/ui/animated-arrow";

import cardDecorBottom from "../../design-assets/figma/landing-2026/card-decor-bottom.svg";
import cardDecorTop from "../../design-assets/figma/landing-2026/card-decor-top.svg";
import cardLeadership from "../../design-assets/figma/landing-2026/card-guidance-source.jpeg";
import cardGuidance from "../../design-assets/figma/landing-2026/card-guidance.png";
import cardService from "../../design-assets/figma/landing-2026/card-impact-source.jpeg";
import cardPeople from "../../design-assets/figma/landing-2026/card-people.jpeg";
import { AllAboutScrollStage } from "./landing/all-about-scroll-stage";
import { BelongingSection } from "./landing/belonging-section";
import { ChapterFinderSection } from "./landing/chapter-finder-section";
import { EverywhereSection } from "./landing/everywhere-section";
import { LandingHero } from "./landing/landing-hero";
import { LandingCtaSection } from "./landing/landing-new-sections";
import { PeopleStoriesSection } from "./landing/people-stories-section";
import { ShowYouSection } from "./landing/show-you-section";
import { WhatWeStandOnSection } from "./landing/what-we-stand-on-section";
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
      className={`all-about-card absolute h-[482px] w-[296px] overflow-hidden text-brand-pure-white md:w-[298px] ${className}`}
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
      className={`all-about-card absolute h-[482px] w-[296px] overflow-hidden px-7 md:w-[298px] ${image ? "text-brand-pure-white" : "bg-landing-blush text-landing-card-ink"} ${className}`}
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
      {/* Every section after the hero scrolls up over the pinned hero. */}
      <LandingHero>
        <BelongingSection />

        <ShowYouSection />

        <ContentFrame bleed>
          <section className="relative h-[3026px] w-full overflow-clip bg-brand-warm-snow xl:h-[1835px]">
            <div className="relative z-10 h-full">
              <AllAboutScrollStage
                decorations={
                  <>
                    <Image
                      src={cardDecorTop}
                      alt=""
                      className="absolute top-[392px] left-[193px] h-[200px] w-[200px] xl:-top-[26px] xl:left-[1111px] xl:h-auto xl:w-auto"
                    />
                    <Image
                      src={cardDecorBottom}
                      alt=""
                      className="all-about-yms-mark absolute top-[2780px] left-[-41px] h-[200px] w-[200px] xl:top-[1052px] xl:left-[17px] xl:h-auto xl:w-auto"
                    />
                  </>
                }
                intro={
                  <>
                    <h2 className="text-[30px] leading-normal font-extrabold tracking-[-0.02em] md:text-landing-section md:leading-[1.2]">
                      This is what we&apos;re all about.
                    </h2>
                    <p className="mt-4 text-base leading-normal font-medium tracking-[-0.02em] md:text-landing-copy md:leading-[1.2]">
                      It starts as a hangout. It turns into brotherhood,
                      sisterhood, and a reason to show up for something bigger
                      than yourself.
                    </p>
                    <Link
                      href="/about"
                      className="ym-cta-trigger mt-8 inline-flex w-full items-center justify-center gap-2 bg-brand-royal px-6 py-4 text-nav font-bold text-brand-pure-white outline-none hover:bg-brand-royal/80 focus-visible:ring-2 focus-visible:ring-brand-royal focus-visible:ring-offset-2 focus-visible:ring-offset-brand-warm-snow md:w-auto"
                    >
                      <AnimatedCtaLabel label="About us" />
                    </Link>
                  </>
                }
                cards={[
                  <PhotoCard
                    key={POINTS[0].title}
                    point={POINTS[0]}
                    image={cardPeople}
                    className="top-[751px] left-8 xl:top-[130px] xl:left-[720px]"
                    crop="people"
                  />,
                  <SolidCard
                    key={POINTS[1].title}
                    point={POINTS[1]}
                    image={cardLeadership}
                    className="top-[1265px] left-8 xl:top-[632px] xl:left-[720px]"
                  />,
                  <PhotoCard
                    key={POINTS[2].title}
                    point={POINTS[2]}
                    image={cardGuidance}
                    className="top-[1779px] left-8 xl:top-[220px] xl:left-[1038px]"
                    crop="guidance"
                  />,
                  <SolidCard
                    key={POINTS[3].title}
                    point={POINTS[3]}
                    image={cardService}
                    className="top-[2293px] left-8 xl:top-[722px] xl:left-[1038px]"
                  />,
                ]}
              />
            </div>
          </section>
        </ContentFrame>

        <WhatWeStandOnSection />

        <ContentFrame bleed>
          <EverywhereSection />
        </ContentFrame>

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
