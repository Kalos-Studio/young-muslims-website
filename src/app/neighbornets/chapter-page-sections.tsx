import Image from "next/image";
import Link from "next/link";
import { AnimatedCtaLabel } from "@/components/ui/animated-arrow";

import eventArt from "../../../design-assets/figma/neighbornets/2026-page/3d762.png";
import retreatArt from "../../../design-assets/figma/neighbornets/2026-page/77d81.png";
import conferenceArt from "../../../design-assets/figma/neighbornets/2026-page/ff281.png";

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
