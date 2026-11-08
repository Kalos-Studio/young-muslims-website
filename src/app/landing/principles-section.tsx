import { getImageProps, type StaticImageData } from "next/image";

import { TextReveal } from "@/components/site/text-reveal";
import { StandardButton } from "@/components/ui/standard-button";
import { cn } from "@/lib/utils";

import diversityDesktop from "../../../design-assets/figma/landing-2026/principles/diversity-desktop.jpg";
import diversityMobile from "../../../design-assets/figma/landing-2026/principles/diversity-mobile.jpg";
import impactDesktop from "../../../design-assets/figma/landing-2026/principles/impact-desktop.jpg";
import impactMobile from "../../../design-assets/figma/landing-2026/principles/impact-mobile.jpg";
import sustainabilityDesktop from "../../../design-assets/figma/landing-2026/principles/sustainability-desktop.jpg";
import sustainabilityMobile from "../../../design-assets/figma/landing-2026/principles/sustainability-mobile.jpg";
import tarbiyyahDesktop from "../../../design-assets/figma/landing-2026/principles/tarbiyyah-desktop.jpg";
import tarbiyyahMobile from "../../../design-assets/figma/landing-2026/principles/tarbiyyah-mobile.jpg";
import { PrinciplesMotion } from "./principles-motion";
import styles from "./principles-section.module.css";

type Principle = {
  title: string;
  description: string;
  /** Pre-cropped to the 1440 x 1024 frame (tablet and desktop). */
  desktop: StaticImageData;
  /** Pre-cropped to the 360 x 808 frame. */
  mobile: StaticImageData;
  /** The description's measure from `md` (Figma 428; 465 for Diversity, which needs 480 to keep its two lines without Figma's -2% tracking). */
  measure: string;
};

const PRINCIPLES: Principle[] = [
  {
    title: "TARBIYYAH",
    description:
      "Growth rooted in Deen. Everything we do is meant to bring young Muslims closer to their faith and to their best selves.",
    desktop: tarbiyyahDesktop,
    mobile: tarbiyyahMobile,
    measure: "md:max-w-107",
  },
  {
    title: "DIVERSITY",
    description:
      "Every background, every level of practice, every kind of person. The average member is just a young Muslim looking for their people.",
    desktop: diversityDesktop,
    mobile: diversityMobile,
    measure: "md:max-w-120",
  },
  {
    title: "SUSTAINABILITY",
    description:
      "Built to last. Peer-led leadership that renews itself, so Young Muslims is here for the next generation too.",
    desktop: sustainabilityDesktop,
    mobile: sustainabilityMobile,
    measure: "md:max-w-107",
  },
  {
    title: "SOCIETAL IMPACT",
    description:
      "Faith turned outward. Service, relief, and advocacy that makes a real difference beyond our own walls.",
    desktop: impactDesktop,
    mobile: impactMobile,
    measure: "md:max-w-107",
  },
];

const PANEL_POSITION = [
  styles.panel0,
  styles.panel1,
  styles.panel2,
  styles.panel3,
];

const HEADING = "What we’re built on.";
const SUBLINE =
  "The friendships are real. So is the foundation underneath them. These are what shape everything about Young Muslims.";

/** The heading block's place and type, shared by its two copies. */
const HEADING_BLOCK =
  "absolute inset-x-0 top-19 px-8 text-center md:top-22 xl:top-21";
const HEADING_TEXT = "mx-auto max-w-134.5";

/** The photo, art-directed: the mobile crop below `md`, the desktop one from it. */
function PanelPhoto({ principle }: { principle: Principle }) {
  const common = { alt: "", sizes: "100vw" };
  const {
    props: { srcSet: desktop },
  } = getImageProps({ ...common, src: principle.desktop });
  const {
    props: { srcSet: mobile, ...img },
  } = getImageProps({ ...common, src: principle.mobile });
  return (
    <picture>
      <source media="(width >= 48rem)" srcSet={desktop} />
      <source srcSet={mobile} />
      <img
        {...img}
        alt=""
        loading="lazy"
        decoding="async"
        className="absolute inset-0 size-full object-cover"
      />
    </picture>
  );
}

function Panel({ principle, index }: { principle: Principle; index: number }) {
  return (
    <article
      data-principles="panel"
      aria-labelledby={`principle-${index}`}
      className={cn(
        "relative h-dvh min-h-202 overflow-clip bg-brand-obsidian text-brand-warm-snow md:min-h-256",
        styles.panel,
        PANEL_POSITION[index],
      )}
    >
      <div
        data-principles="photo"
        aria-hidden="true"
        className={cn("absolute inset-0", styles.photo)}
      >
        <PanelPhoto principle={principle} />
        {/* Figma's overlay: clear at 9.5%, 48% Obsidian at 110%. */}
        <div className="from-9.5% absolute inset-0 bg-linear-to-b from-transparent to-brand-obsidian/48 to-110%" />
      </div>
      {/* Darkens the strip the panel collapses to, so its word reads over
          the photo's lightest part. Pinned layout only. */}
      <div
        data-principles="scrim"
        aria-hidden="true"
        className={cn(
          "absolute inset-x-0 top-0 hidden bg-brand-obsidian/40 opacity-0",
          styles.scrim,
        )}
      />

      {/* Word, description and button, anchored above the panel's foot as
          in Figma (--principles-content-bottom). */}
      <div
        className={cn(
          "absolute inset-x-0 flex flex-col items-center px-8 text-center",
          styles.content,
        )}
      >
        <h3
          id={`principle-${index}`}
          data-principles="word"
          className={cn(
            "font-display text-mobile-section whitespace-nowrap md:text-stat",
            styles.word,
          )}
        >
          {principle.title}
        </h3>
        <div
          data-principles="fade"
          className={cn("flex w-full flex-col items-center", styles.fade)}
        >
          <p
            className={cn(
              "mt-4 max-w-74 text-body font-medium md:mt-0.75",
              principle.measure,
            )}
          >
            {principle.description}
          </p>
          <StandardButton
            href="/about"
            label="Learn more"
            tone="dark"
            className="mt-9.75 md:mt-5.75"
          />
        </div>
      </div>

      {index === 0 ? (
        /* The heading's Warm Snow copy, in the first panel: as the panel
           rises it uncovers this copy over the Obsidian one, so the heading
           turns light where the photo reaches it with no repaint. It is
           held in place against the panel's movement. Pinned layout only. */
        <div
          data-principles="heading-copy"
          aria-hidden="true"
          className={cn(HEADING_BLOCK, "hidden", styles.headingCopy)}
        >
          <div className={HEADING_TEXT}>
            <p className="text-mobile-section font-extrabold md:text-landing-section">
              {HEADING}
            </p>
            <p className="mt-4 text-body font-medium md:text-landing-copy">
              {SUBLINE}
            </p>
          </div>
        </div>
      ) : null}
    </article>
  );
}

/**
 * The landing page's "What we're built on" principles section (Figma 208:3,
 * tablet 279:334, mobile 295:1194; the scroll mechanic follows storyboard
 * 572:434, adapted per client feedback).
 *
 * Four full-viewport principles (Tarbiyyah, Diversity, Sustainability,
 * Societal Impact): a photo under Figma's dark overlay, the principle word in
 * Boldonse, a description and a dark-tone "Learn more" StandardButton to
 * /about. The heading and subline open the section, in TextReveal; the
 * principle words have no TextReveal (the scroll is their entrance).
 *
 * Pinned (principles-motion.tsx): the section pins and scroll scrubs the
 * reveal. Each principle rises to full; as the next rises over it, it is
 * left as a strip at the top showing its word over a slice of its photo,
 * and the strips accumulate, so by the end all four words are on screen.
 * Under reduced motion and on short viewports it is a plain stack of the
 * four panels instead. Both layouts come from this one server-rendered DOM
 * (see the CSS module), so nothing differs between server and client.
 */
export function PrinciplesSection() {
  return (
    <PrinciplesMotion
      aria-labelledby="principles-heading"
      className={cn("relative bg-brand-warm-snow", styles.section)}
    >
      <div data-principles="stage" className={cn("relative", styles.stage)}>
        <div
          className={cn(
            HEADING_BLOCK,
            "z-10 text-brand-warm-snow",
            styles.heading,
          )}
        >
          <TextReveal className={HEADING_TEXT}>
            <h2
              id="principles-heading"
              className="text-mobile-section font-extrabold md:text-landing-section"
            >
              {HEADING}
            </h2>
            <p className="mt-4 text-body font-medium md:text-landing-copy">
              {SUBLINE}
            </p>
          </TextReveal>
        </div>
        {PRINCIPLES.map((principle, index) => (
          <Panel key={principle.title} principle={principle} index={index} />
        ))}
      </div>
    </PrinciplesMotion>
  );
}
