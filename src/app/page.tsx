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
import closing01 from "../../design-assets/figma/landing-2026/closing-01.png";
import closing02 from "../../design-assets/figma/landing-2026/closing-02.png";
import closing03 from "../../design-assets/figma/landing-2026/closing-03.png";
import closing04 from "../../design-assets/figma/landing-2026/closing-04.png";
import closing05 from "../../design-assets/figma/landing-2026/closing-05.png";
import closing06 from "../../design-assets/figma/landing-2026/closing-06.png";
import highlightPlay from "../../design-assets/figma/landing-2026/highlight-play.svg";
import highlightReel from "../../design-assets/figma/landing-2026/highlight-reel.png";
import { BelongingPortraitOrbit } from "./belonging-portrait-orbit";
import { EverywhereSection } from "./everywhere-section";
import { HeroVideo } from "./hero-video";
import { HighlightReelMarquee } from "./highlight-reel-section";

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
      className={`absolute h-[482px] w-[298px] overflow-hidden rounded-card text-brand-pure-white ${className}`}
    >
      {crop ? (
        <Image
          src={image}
          alt=""
          sizes={crop === "people" ? "812px" : "590px"}
          className={PHOTO_CROP_CLASSES[crop]}
        />
      ) : (
        <Image src={image} alt="" fill sizes="298px" className="object-cover" />
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
      className={`absolute h-[482px] w-[298px] overflow-hidden rounded-card px-7 ${image ? "text-brand-pure-white" : "bg-landing-blush text-landing-card-ink"} ${className}`}
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

function ClosingPortrait({
  image,
  className,
}: {
  image: StaticImageData;
  className: string;
}) {
  return (
    <div className={`absolute ${className}`} aria-hidden="true">
      <Image src={image} alt="" fill sizes="220px" className="object-contain" />
    </div>
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
          className="relative h-[1830px] w-full overflow-hidden bg-brand-warm-snow"
        >
          <div className="pointer-events-none absolute top-[1281px] left-[-873px] z-0 flex h-[1880px] w-[2956px] rotate-[-9.8deg] items-center justify-center">
            <Image
              src={belongingWavePale}
              alt=""
              className="block max-w-none"
            />
          </div>
          <div className="pointer-events-none absolute top-[1375px] left-[-781px] z-[1] flex h-[1772px] w-[2787px] rotate-[-9.8deg] items-center justify-center">
            <Image
              src={belongingWaveObsidian}
              alt=""
              className="block max-w-none"
            />
          </div>
          <div className="relative z-10 h-full">
            <BelongingPortraitOrbit />
          </div>
          <div className="absolute top-[743px] left-1/2 z-20 w-full max-w-[784px] -translate-x-1/2 text-center">
            <h2 className="text-landing-section font-extrabold text-brand-jade">
              More than a program.
              <br />A place to belong.
            </h2>
            <p className="mt-[43px] text-landing-copy font-medium text-brand-obsidian">
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
          className="relative h-[899px] w-full overflow-hidden bg-brand-obsidian"
        >
          <div className="absolute top-0 left-1/2 h-full w-[1440px] -translate-x-1/2">
            <h2 className="absolute top-[113px] left-1/2 w-[784px] -translate-x-1/2 text-center text-landing-section font-extrabold text-brand-warm-snow">
              But it&apos;s easier to just show you.
            </h2>
            <HighlightReelMarquee />
            <div className="absolute top-[269px] left-[503px] h-[529px] w-[833px] overflow-hidden rounded-media shadow-2xl">
              <Image
                src={highlightReel}
                alt="Young Muslims gathered together"
                fill
                sizes="833px"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-brand-obsidian/35" />
              <Image
                src={highlightPlay}
                alt=""
                className="absolute top-1/2 left-1/2 h-[88px] w-[88px] -translate-x-1/2 -translate-y-1/2"
              />
              <div className="absolute right-12 bottom-12 left-12 text-brand-pure-white">
                <p className="text-base font-extrabold">30 SECOND WATCH</p>
                <p className="mt-2 text-[32px] leading-tight font-semibold">
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
          className="relative h-[1791px] w-full overflow-hidden bg-brand-warm-snow"
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
          <div className="absolute top-[405px] left-1/2 z-10 h-full w-[1440px] -translate-x-1/2">
            <Image
              src={cardDecorTop}
              alt=""
              className="absolute -top-[26px] left-[1111px]"
            />
            <Image
              src={cardDecorBottom}
              alt=""
              className="absolute top-[1052px] left-[17px]"
            />

            <div className="absolute top-[130px] left-[90px] w-[474px] text-brand-obsidian">
              <h2 className="text-landing-section font-extrabold">
                This is what we&apos;re
                <br />
                all about.
              </h2>
              <p className="mt-8 text-landing-copy font-medium">
                It starts as a hangout. It turns into brotherhood, sisterhood,
                and a reason to show up for something bigger than yourself.
              </p>
              <Link
                href="/about"
                className="mt-8 inline-flex rounded-pill bg-brand-royal px-6 py-4 text-nav font-bold text-brand-pure-white outline-none hover:bg-brand-royal/80 focus-visible:ring-2 focus-visible:ring-brand-royal focus-visible:ring-offset-2 focus-visible:ring-offset-brand-warm-snow"
              >
                About Us
              </Link>
            </div>

            <PhotoCard
              point={POINTS[0]}
              image={cardPeople}
              className="top-[130px] left-[720px]"
              crop="people"
            />
            <SolidCard
              point={POINTS[1]}
              image={cardLeadership}
              className="top-[684px] left-[720px]"
            />
            <PhotoCard
              point={POINTS[2]}
              image={cardGuidance}
              className="top-[220px] left-[1071px]"
              crop="guidance"
            />
            <SolidCard
              point={POINTS[3]}
              image={cardService}
              className="top-[774px] left-[1071px]"
            />
          </div>
        </section>
      </Annotate>

      <Annotate
        bleed
        note="Once this section fills the viewport, the heading appears and the metrics count upward."
      >
        <EverywhereSection />
      </Annotate>

      <Annotate bleed>
        <section
          data-header-theme="light"
          className="relative h-[1038px] w-full overflow-hidden bg-brand-warm-snow text-center"
        >
          <div className="absolute top-0 left-1/2 h-full w-[1440px] -translate-x-1/2">
            <ClosingPortrait
              image={closing01}
              className="top-[123px] left-[1093px] h-[170px] w-[177px]"
            />
            <ClosingPortrait
              image={closing02}
              className="top-[587px] left-[130px] h-[196px] w-[198px]"
            />
            <ClosingPortrait
              image={closing03}
              className="top-[763px] left-[599px] h-[193px] w-[203px]"
            />
            <ClosingPortrait
              image={closing04}
              className="top-[160px] left-[140px] h-[193px] w-[216px]"
            />
            <ClosingPortrait
              image={closing05}
              className="top-[78px] left-[619px] h-[197px] w-[183px]"
            />
            <ClosingPortrait
              image={closing06}
              className="top-[545px] left-[1080px] h-[196px] w-[221px] rotate-[165deg]"
            />
            <div className="absolute top-[422px] left-1/2 w-[784px] -translate-x-1/2 text-section font-extrabold text-brand-obsidian">
              <p>
                But a number can&apos;t show you what it actually feels like.
              </p>
              <p className="text-landing-cyan">The people can.</p>
            </div>
          </div>
        </section>
      </Annotate>
    </PageFrame>
  );
}
