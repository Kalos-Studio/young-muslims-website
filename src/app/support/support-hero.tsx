import { getImageProps } from "next/image";
import type { ReactNode } from "react";

import { FundraiseUpDonationForm } from "@/components/fundraise-up/donation-form";
import {
  StickyHero,
  stickyHeroMediaClassName,
} from "@/components/site/sticky-hero";
import { cn } from "@/lib/utils";

import heroDesktop from "../../../design-assets/figma/support/hero/hero-desktop.jpg";
import heroMobile from "../../../design-assets/figma/support/hero/hero-mobile.jpg";
import heroTablet from "../../../design-assets/figma/support/hero/hero-tablet.jpg";
import styles from "./support-hero.module.css";

const ALT = "Young Muslims sisters embracing in a group hug beside a lake";

/**
 * The photo, art-directed: each frame's crop of the sisters by the lake
 * (scripts/support-hero-assets.mjs), desktop from `xl`, tablet from `md`,
 * mobile below. It covers the hero.
 */
function HeroPhoto() {
  const common = { alt: ALT, sizes: "100vw", loading: "eager" as const };
  const {
    props: { srcSet: desktop },
  } = getImageProps({ ...common, src: heroDesktop });
  const {
    props: { srcSet: tablet },
  } = getImageProps({ ...common, src: heroTablet });
  const {
    props: { srcSet: mobile, ...img },
  } = getImageProps({ ...common, src: heroMobile });
  return (
    <picture>
      <source media="(width >= 80rem)" srcSet={desktop} />
      <source media="(width >= 48rem)" srcSet={tablet} />
      <source srcSet={mobile} />
      <img
        {...img}
        alt={ALT}
        fetchPriority="high"
        className={stickyHeroMediaClassName}
      />
    </picture>
  );
}

/**
 * The Support hero (Figma 415:1573, tablet 447:2198, mobile 447:2755;
 * DESIGN-SYSTEM.md, "Support hero"): the site's sticky shell (StickyHero)
 * with the sisters by the lake under Figma's 32% Obsidian tint, its own wave
 * (SupportHeroWave) handing off to the page below.
 *
 * Over it, the copy and the live Fundraise Up donation form. Desktop: the
 * copy in a 631 column at the left, a little above centre, and the form in
 * its Warm Snow box at the right. Tablet and phones: stacked, the
 * copy (left on tablet, centred on phones) above the box, in a 640 column
 * (tablet) or between the 32px gutters (phones); the box hugs the form.
 *
 * The box is our frame, hugging the form inside it: Fundraise Up's, its look
 * set in their dashboard, at most 376 wide (their cap). The iframe is
 * clipped 12px all round (its card's inset and any border), so our box is
 * the one visible frame.
 *
 * The overlay holds a form, so it is taller than short screens: `fit`
 * pins the hero by its foot there, once the whole form has been seen.
 */
export function SupportHero({ children }: { children: ReactNode }) {
  return (
    <StickyHero
      label="Support Young Muslims"
      wave="support"
      fit
      media={
        <>
          <HeroPhoto />
          {/* Figma's tint over the photo (its second fill: Obsidian 32%),
              keeping the white copy legible. */}
          <div aria-hidden className="absolute inset-0 bg-brand-obsidian/32" />
        </>
      }
      overlay={
        <div
          className={cn(
            "mx-auto flex w-full max-w-360 flex-col items-center gap-9 px-8 pt-26 md:gap-18 md:px-16 md:pt-30.25 xl:flex-row xl:justify-between xl:gap-0 xl:pt-24.25 xl:pr-28 xl:pl-22.25",
            styles.overlay,
          )}
        >
          <div className="flex w-full max-w-160 flex-col gap-3 text-center text-brand-pure-white md:text-left xl:mb-31 xl:w-157.75 xl:max-w-none xl:gap-4">
            <h1
              id="support-title"
              className="font-display text-mobile-display xl:text-landing-display"
            >
              YOUR SUPPORT <br className="max-md:hidden" />
              REACHES THE NEXT ONE
            </h1>
            <p className="text-nav font-semibold md:text-body xl:text-landing-hero-subtitle">
              Every NeighborNet, every retreat, every young Muslim who walks in
              and finds their people — it runs on support like yours.
            </p>
          </div>
          {/* The box's place: the copy's column when stacked (left on
              tablet, centred on phones), the right side from desktop. */}
          <div className="w-full max-w-160 xl:w-96 xl:max-w-none">
            {/* The box hugs the form. Fundraise Up's iframe is 100% of the
                width it is given, between 286 and its 376 cap (inline,
                !important), and draws its card 8px inside it (bordered,
                when its dashboard sets a border). The window below is the
                iframe less 12px on every side, so no card border can show,
                and the box is that window plus its 16px padding: 384 wide
                at most (376 - 24 + 32), so the iframe sits at its cap with
                nothing beside it, and narrower screens narrow both
                together. If Fundraise Up's cap changes, so must max-w-96. */}
            <div
              id="donate"
              className="mx-auto w-full max-w-96 scroll-mt-40 bg-brand-warm-snow p-4 md:mx-0"
            >
              <div className="overflow-hidden">
                <div className="-m-3">
                  <FundraiseUpDonationForm />
                </div>
              </div>
            </div>
          </div>
        </div>
      }
    >
      <div className="bg-background">{children}</div>
    </StickyHero>
  );
}
