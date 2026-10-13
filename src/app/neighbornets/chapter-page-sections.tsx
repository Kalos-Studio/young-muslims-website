import Image, { type StaticImageData } from "next/image";
import Link from "next/link";
import { AnimatedCtaLabel } from "@/components/ui/animated-arrow";

import collageLogo from "../../../design-assets/figma/neighbornets/2026-page/a0c41.svg";
import collageTopLeft from "../../../design-assets/figma/neighbornets/2026-page/abef6.jpg";
import collageTopMiddle from "../../../design-assets/figma/neighbornets/2026-page/e1518.png";
import collageTopRight from "../../../design-assets/figma/neighbornets/2026-page/24e0e.jpg";
import collageBottomLeft from "../../../design-assets/figma/neighbornets/2026-page/695b1.png";
import collageBottomMiddle from "../../../design-assets/figma/neighbornets/2026-page/94a21.jpg";
import collageBottomRight from "../../../design-assets/figma/neighbornets/2026-page/8cd27.png";
import tile01 from "../../../design-assets/figma/neighbornets/2026-page/3b4cd.png";
import tile02 from "../../../design-assets/figma/neighbornets/2026-page/f29fa.png";
import tile03 from "../../../design-assets/figma/neighbornets/2026-page/4f0d3.png";
import tile04 from "../../../design-assets/figma/neighbornets/2026-page/ffac9.png";
import tile05 from "../../../design-assets/figma/neighbornets/2026-page/33797.png";
import tile06 from "../../../design-assets/figma/neighbornets/2026-page/59811.png";
import tile07 from "../../../design-assets/figma/neighbornets/2026-page/2d29c.png";
import tile08 from "../../../design-assets/figma/neighbornets/2026-page/ca616.png";
import tile09 from "../../../design-assets/figma/neighbornets/2026-page/f62af.png";
import tile10 from "../../../design-assets/figma/neighbornets/2026-page/2efe7.png";
import tile11 from "../../../design-assets/figma/neighbornets/2026-page/6364f.png";
import tile12 from "../../../design-assets/figma/neighbornets/2026-page/d3926.png";
import tile13 from "../../../design-assets/figma/neighbornets/2026-page/234fa.png";
import tile14 from "../../../design-assets/figma/neighbornets/2026-page/2a722.png";
import tile15 from "../../../design-assets/figma/neighbornets/2026-page/ec2af.png";
import tile16 from "../../../design-assets/figma/neighbornets/2026-page/d68e7.png";
import tile17 from "../../../design-assets/figma/neighbornets/2026-page/a1f98.png";
import tile18 from "../../../design-assets/figma/neighbornets/2026-page/2666e.png";
import tile19 from "../../../design-assets/figma/neighbornets/2026-page/03266.png";
import tile20 from "../../../design-assets/figma/neighbornets/2026-page/241bd.png";
import tile21 from "../../../design-assets/figma/neighbornets/2026-page/5e320.png";
import tile22 from "../../../design-assets/figma/neighbornets/2026-page/3fb20.png";
import tile23 from "../../../design-assets/figma/neighbornets/2026-page/0e843.png";
import tile24 from "../../../design-assets/figma/neighbornets/2026-page/cd6a3.png";
import tile25 from "../../../design-assets/figma/neighbornets/2026-page/c13d5.png";
import eventArt from "../../../design-assets/figma/neighbornets/2026-page/3d762.png";
import retreatArt from "../../../design-assets/figma/neighbornets/2026-page/77d81.png";
import conferenceArt from "../../../design-assets/figma/neighbornets/2026-page/ff281.png";

const collagePhotos = [
  {
    image: collageTopLeft,
    alt: "Young Muslim standing beside a red car",
    position: "md:top-[44px] md:left-[-239px] md:w-[540px]",
  },
  {
    image: collageTopMiddle,
    alt: "Friends reaching their hands together outdoors",
    position: "md:top-[44px] md:left-[400px] md:w-[524px]",
  },
  {
    image: collageTopRight,
    alt: "Young Muslims gathered for a group photo",
    position: "md:top-[44px] md:left-[1023px] md:w-[540px]",
  },
  {
    image: collageBottomLeft,
    alt: "Young Muslim women together at a community gathering",
    position: "md:top-[492px] md:left-[-448px] md:w-[524px]",
  },
  {
    image: collageBottomMiddle,
    alt: "Young Muslims talking at an event",
    position: "md:top-[492px] md:left-[227px] md:w-[540px]",
  },
  {
    image: collageBottomRight,
    alt: "Young Muslim women seated together for a halaqa",
    position: "md:top-[492px] md:left-[918px] md:w-[524px]",
  },
] as const;

const chapterTileRows: StaticImageData[][] = [
  [tile01, tile02, tile03, tile04, tile05, tile06, tile07, tile08, tile09],
  [tile10, tile09, tile11, tile12, tile13, tile14, tile15, tile16, tile17],
  [tile18, tile17, tile19, tile20, tile21, tile22, tile23, tile24, tile25],
];

const rowPositions = [
  "top-0",
  "top-[223px] md:top-[360px]",
  "top-[446px] md:top-[720px]",
] as const;

const involvementCards = [
  {
    title: "Events",
    image: eventArt,
    description:
      "Game nights, service projects, and community hangouts. One-off ways to meet Young Muslims and see what it’s like, no commitment required.",
  },
  {
    title: "Retreats",
    image: retreatArt,
    description:
      "Getaways with your NeighborNet and beyond: archery, campfire halaqas, and the kind of bonding that only happens away from everything else.",
  },
  {
    title: "Conferences",
    image: conferenceArt,
    description:
      "Weekend-long gatherings that bring young Muslims together from across the country: workshops, speakers, and a few thousand new friends.",
  },
] as const;

export function NeighborNetExplainer() {
  return (
    <section
      data-header-theme="light"
      aria-labelledby="neighbornet-explainer-heading"
      className="overflow-hidden bg-brand-warm-snow pt-20 pb-28 md:pt-[103px] md:pb-[124px]"
    >
      <h2
        id="neighbornet-explainer-heading"
        className="px-5 text-center text-[32px] leading-[1.2] font-extrabold tracking-[-0.02em] md:text-landing-section"
      >
        What&apos;s a NeighborNet?
      </h2>

      <div className="relative mx-auto mt-14 grid max-w-[1440px] grid-cols-2 gap-4 px-4 md:mt-[99px] md:block md:h-[875px] md:overflow-hidden md:px-0">
        <Image
          src={collageLogo}
          alt=""
          className="pointer-events-none absolute top-1/2 left-1/2 hidden w-[1442px] max-w-none -translate-x-1/2 -translate-y-1/2 md:block"
        />
        {collagePhotos.map(({ image, alt, position }) => (
          <div
            key={alt}
            className={`relative aspect-[3/2] min-w-0 overflow-hidden md:absolute md:aspect-auto md:h-[360px] ${position}`}
          >
            <Image
              src={image}
              alt={alt}
              fill
              sizes="(max-width: 767px) 50vw, 540px"
              className="object-cover"
            />
          </div>
        ))}
      </div>

      <div className="mx-auto mt-14 flex max-w-[872px] flex-col items-center px-6 text-center text-base leading-normal font-medium tracking-[-0.02em] md:mt-[69px] md:px-0 md:text-[20px]">
        <p>
          A NeighborNet is your local Young Muslims. A group of brothers or
          sisters who meet every week to hang out, grow, and build real
          friendships rooted in Deen.
        </p>
        <p className="mt-7">
          It&apos;s not a class you attend or a lecture you sit through.
          It&apos;s grabbing food, playing ball, and talking through what&apos;s
          actually going on in your life, with people who get it. Some weeks
          there&apos;s a halaqa, some weeks there&apos;s a bonfire. Every week,
          there are your people.
        </p>
        <p className="mt-7">
          There are 200+ NeighborNets across the country, each run by the youth,
          for the youth. Find yours, show up once, and see what it&apos;s about.
        </p>
        <Link
          href="mailto:expansion@ymsite.com?subject=Start%20a%20NeighborNet"
          className="ym-cta-trigger mt-[60px] inline-flex min-h-12 w-full items-center justify-center gap-2 bg-brand-royal px-6 py-4 text-center text-sm font-bold tracking-[-0.02em] text-brand-pure-white transition-colors hover:bg-brand-obsidian focus-visible:ring-2 focus-visible:ring-brand-royal focus-visible:ring-offset-2 focus-visible:outline-none sm:w-auto"
        >
          <span className="inline-flex items-center gap-2 sm:hidden">
            <AnimatedCtaLabel label="Start a NeighborNet" />
          </span>
          <span className="hidden items-center gap-2 sm:inline-flex">
            <AnimatedCtaLabel label="Don't have a NN near you? Start one here" />
          </span>
        </Link>
      </div>
    </section>
  );
}

export function ChapterImageGrid() {
  return (
    <section
      aria-label="Young Muslims chapters across the country"
      className="relative h-[669px] w-full overflow-hidden bg-brand-warm-snow md:h-[1080px]"
    >
      {chapterTileRows.map((row, rowIndex) => (
        <div
          key={rowIndex}
          className={`absolute left-1/2 flex w-max -translate-x-1/2 ${rowPositions[rowIndex]}`}
        >
          {row.map((tile, tileIndex) => (
            <div
              key={`${rowIndex}-${tileIndex}`}
              className="relative h-[223px] w-[140px] shrink-0 md:h-[360px] md:w-[226px]"
            >
              <Image
                src={tile}
                alt=""
                fill
                sizes="(max-width: 767px) 140px, 226px"
                className="object-cover"
              />
            </div>
          ))}
        </div>
      ))}
    </section>
  );
}

export function OtherWaysSection() {
  return (
    <section
      data-header-theme="light"
      aria-labelledby="other-ways-heading"
      className="bg-brand-warm-snow px-5 pt-24 pb-32 md:min-h-[1087px] md:px-8 md:pt-[145px] md:pb-32"
    >
      <div className="mx-auto flex max-w-[1260px] flex-col items-center text-center">
        <h2
          id="other-ways-heading"
          className="text-[32px] leading-[1.2] font-extrabold tracking-[-0.02em] md:text-landing-section"
        >
          Other ways to get involved.
        </h2>
        <p className="mt-4 text-base font-medium tracking-[-0.02em] md:text-[20px]">
          Can&apos;t make it to a weekly NeighborNet? There&apos;s more than one
          way in.
        </p>
        <Link
          href="mailto:expansion@ymsite.com"
          className="ym-cta-trigger mt-[60px] inline-flex min-h-[51px] items-center justify-center gap-2 bg-brand-royal px-6 py-4 text-sm font-bold tracking-[-0.02em] text-brand-pure-white transition-colors hover:bg-brand-obsidian focus-visible:ring-2 focus-visible:ring-brand-royal focus-visible:ring-offset-2 focus-visible:outline-none"
        >
          <AnimatedCtaLabel label="Get in touch" />
        </Link>
      </div>

      <div className="mx-auto mt-24 grid max-w-[1290px] gap-14 md:mt-[145px] md:grid-cols-3 md:gap-[56px]">
        {involvementCards.map(({ title, image, description }) => (
          <article
            key={title}
            className="mx-auto w-full max-w-[378px] text-center"
          >
            <div className="relative aspect-[378/373] w-full">
              <Image
                src={image}
                alt=""
                fill
                sizes="(max-width: 767px) 100vw, 378px"
                className="object-contain"
              />
              <h3 className="absolute inset-0 flex items-center justify-center px-3 font-display text-[30px] leading-tight tracking-[-0.02em] text-brand-pure-white md:text-[32px]">
                {title.toUpperCase()}
              </h3>
            </div>
            <p className="mt-6 text-base leading-normal font-medium tracking-[-0.02em]">
              {description}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
