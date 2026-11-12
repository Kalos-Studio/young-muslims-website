import Image, { getImageProps, type StaticImageData } from "next/image";

import { GrainFilter } from "@/components/site/grain-filter";
import { TextReveal } from "@/components/site/text-reveal";
import { cn } from "@/lib/utils";

import brothersAwardDesktop from "../../../design-assets/figma/about/leadership/brothers-award-desktop.jpg";
import brothersAwardMobile from "../../../design-assets/figma/about/leadership/brothers-award-mobile.jpg";
import brothersAwardTablet from "../../../design-assets/figma/about/leadership/brothers-award-tablet.jpg";
import leadersLakeDesktop from "../../../design-assets/figma/about/leadership/leaders-lake-desktop.jpg";
import leadersLakeMobile from "../../../design-assets/figma/about/leadership/leaders-lake-mobile.jpg";
import leadersLakeTablet from "../../../design-assets/figma/about/leadership/leaders-lake-tablet.jpg";
import sistersYmcDesktop from "../../../design-assets/figma/about/leadership/sisters-ymc-desktop.jpg";
import sistersYmcMobile from "../../../design-assets/figma/about/leadership/sisters-ymc-mobile.jpg";
import sistersYmcTablet from "../../../design-assets/figma/about/leadership/sisters-ymc-tablet.jpg";
import { LeadershipPanel } from "./leadership-panel";
import styles from "./leadership-section.module.css";

type Group = {
  heading: string;
  text: string;
  alt: string;
  photo: {
    desktop: StaticImageData;
    tablet: StaticImageData;
    mobile: StaticImageData;
  };
  /** Figma's narrower heading measure from desktop (390 of 458). */
  narrow?: boolean;
};

/* YM's copy, verbatim, with its photo. */
const GROUPS: Group[] = [
  {
    heading: "We don’t just build members. We build leaders.",
    text: "Young Muslims is where a lot of young Muslims lead something for the first time; run a halaqa, organize an event, mentor someone younger, carry real responsibility. They learn by doing, with the room to try, stumble, and grow.",
    alt: "Young Muslims brothers sitting on the grass by a lake around a speaker",
    photo: {
      desktop: leadersLakeDesktop,
      tablet: leadersLakeTablet,
      mobile: leadersLakeMobile,
    },
  },
  {
    heading: "And it doesn’t stop at Young Muslims.",
    text: "The brothers and sisters who come through here go on to become torchbearers of Islamic work across America. Leaders in their masajid, their campuses, their communities, and other organizations doing the work. Young Muslims is where they find their footing. Where they go next is the whole point.",
    alt: "Three sisters in Young Muslims Conference vests, smiling",
    photo: {
      desktop: sistersYmcDesktop,
      tablet: sistersYmcTablet,
      mobile: sistersYmcMobile,
    },
    narrow: true,
  },
  {
    heading: "We lead the next generation.",
    text: "Our members mentor and facilitate the development of the next generation of young Muslims — proactive, engaged, and ready to be a positive force in society. That’s the real impact: not just the friendships formed, but the leaders they produce.",
    alt: "Three brothers holding an award in front of flags",
    photo: {
      desktop: brothersAwardDesktop,
      tablet: brothersAwardTablet,
      mobile: brothersAwardMobile,
    },
    narrow: true,
  },
];

/**
 * A photo filling the pinned panel, art-directed: Figma's desktop crop from
 * `xl`, its tablet crop from `md` (the panel only shows from `md`).
 */
function PanelPhoto({ group }: { group: Group }) {
  const common = { alt: group.alt, sizes: "50vw" };
  const {
    props: { srcSet: desktop },
  } = getImageProps({ ...common, src: group.photo.desktop });
  const {
    props: { srcSet: tablet, ...img },
  } = getImageProps({ ...common, src: group.photo.tablet });
  return (
    <picture>
      <source media="(width >= 80rem)" srcSet={desktop} />
      <source srcSet={tablet} />
      <img
        {...img}
        alt={group.alt}
        className={cn("absolute inset-0 size-full object-cover", styles.grain)}
      />
    </picture>
  );
}

/**
 * The About page's leadership section, under "Built by the youth" (Figma
 * 530:273, tablet 595:2007, mobile 596:2674; DESIGN-SYSTEM.md, "About
 * leadership"): three groups, each a heading and its paragraph, each with
 * a photo.
 *
 * Tablet and desktop: two halves. The left is a full-height panel, sticky
 * (not fixed: the footer's Easter egg transforms the page), pinned while
 * the section scrolls by; the right holds the three groups, a viewport
 * tall each, their text centred in it. As each group's text first appears
 * at the viewport's bottom edge, its photo sweeps in over the last in the
 * panel
 * (LeadershipPanel, BlobReveal: slower and gentler here, a fresh shape each
 * swap). The last group's block is `--leadership-hold` taller, its text
 * pinned at the centre, so the last photo and its text hold together for
 * that much scroll before the section releases: 3.75 viewports in all.
 *
 * Phones: Figma's stacked banners, each photo (360 x 483, full width) and
 * then its text; nothing pins or swaps.
 *
 * Text reveals as it scrolls in (TextReveal). Server-rendered; only the
 * panel's swaps run client-side.
 */
export function LeadershipSection() {
  return (
    <section
      aria-label="Building leaders"
      className="relative text-brand-obsidian md:grid md:grid-cols-2"
    >
      <GrainFilter id="leadership-grain" />
      <div aria-hidden="true" className="hidden md:block">
        <LeadershipPanel
          className={styles.panel}
          photos={GROUPS.map((group) => (
            <PanelPhoto key={group.heading} group={group} />
          ))}
        />
      </div>
      <div className="pb-18 md:pb-0">
        {GROUPS.map((group, index) => {
          const last = index === GROUPS.length - 1;
          return (
            <div
              key={group.heading}
              className={cn(
                "md:pr-16 md:pl-14.5 xl:pr-0 xl:pl-20",
                index > 0 && "mt-16 md:mt-0",
                last ? styles.last : "md:h-dvh",
              )}
            >
              <div
                className={cn(
                  "md:flex md:h-dvh md:items-center",
                  last && "md:sticky md:top-0",
                )}
              >
                <Image
                  src={group.photo.mobile}
                  alt={group.alt}
                  sizes="100vw"
                  className={cn("h-auto w-full md:hidden", styles.grain)}
                />
                <div
                  data-leadership-text
                  className="mt-10 px-8 md:mt-0 md:px-0 xl:max-w-114.5"
                >
                  <TextReveal>
                    <h2
                      className={cn(
                        "max-w-48.5 text-lead font-bold md:max-w-54 md:text-card-title xl:max-w-none xl:text-mobile-display",
                        group.narrow &&
                          "max-w-none md:max-w-none xl:max-w-97.5",
                      )}
                    >
                      {group.heading}
                    </h2>
                    <p className="mt-4 text-body font-medium md:text-article-title xl:text-landing-copy">
                      {group.text}
                    </p>
                  </TextReveal>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
