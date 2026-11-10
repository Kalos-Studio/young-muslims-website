import Image, { type StaticImageData } from "next/image";
import Link from "next/link";
import { AnimatedCtaLabel } from "@/components/ui/animated-arrow";
import { ChapterImageMarquee } from "./chapter-image-marquee";

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

const chapterTileRows: StaticImageData[][] = [
  [tile01, tile02, tile03, tile04, tile05, tile06, tile07, tile08, tile09],
  [tile10, tile09, tile11, tile12, tile13, tile14, tile15, tile16, tile17],
  [tile18, tile17, tile19, tile20, tile21, tile22, tile23, tile24, tile25],
];

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

export function ChapterImageGrid() {
  return <ChapterImageMarquee rows={chapterTileRows} />;
}

export function OtherWaysSection() {
  return (
    <section
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
