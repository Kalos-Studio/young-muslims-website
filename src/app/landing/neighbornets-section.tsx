import { TextReveal } from "@/components/site/text-reveal";
import { textRevealUnit } from "@/components/site/text-reveal-unit";
import { StandardButton } from "@/components/ui/standard-button";
import { cn } from "@/lib/utils";

import { NeighborNetsBackdrop } from "./neighbornets-backdrop";
import { NeighborNetSwitcher } from "./neighbornet-switcher";
import styles from "./neighbornets-section.module.css";

/**
 * The landing page's "Let's find your story" NeighborNet switcher (Figma
 * 251:509, tablet 279:645, mobile 296:1365).
 *
 * The backdrop (NeighborNetsBackdrop) is the section's dark organic shape
 * with its bigger copy behind, parallaxing, on the Warm Snow of its
 * neighbours. Over it: the heading and subline (TextReveal), five
 * NeighborNet names in Boldonse (the selected one in its highlight colour),
 * "View all NeighborNets", and the selected NeighborNet's photo tile (its
 * city, state and "Visit") on its own organic shape. The content is masked
 * to the shape's edges, so the tile's shape never shows past them. The
 * NeighborNets are one swappable array (neighbornets.ts); the switching and
 * the tile's motion are NeighborNetSwitcher's.
 *
 * Vertical rhythm, from the shape's top (heading top / tile / names /
 * button / foot): desktop 166 / 278 / 384, 127 apart / 1033 / 244 (Figma's
 * frame, less the 24px its edge sat below the section's top); tablet
 * 156 / 303 / 476, 182 apart / 1377 / 110; mobile 136 / 359 / one name step
 * (424) apart over the tile / 2578 / 118. The section adds the edges' drift
 * room (`--neighbornets-edge-headroom`) above and below the shape.
 */
export function NeighborNetsSection() {
  return (
    <section
      aria-labelledby="neighbornets-heading"
      className={cn(
        "relative overflow-clip bg-brand-warm-snow text-brand-warm-snow",
        styles.section,
      )}
    >
      <div className="relative">
        <NeighborNetsBackdrop />
        <div
          className={cn(
            "relative pt-34 pb-29.5 md:pt-39 md:pb-27.5 xl:pt-41.5 xl:pb-61",
            styles.content,
          )}
        >
          <NeighborNetSwitcher
            intro={
              <TextReveal className="max-w-74 md:max-w-134.5">
                <h2
                  id="neighbornets-heading"
                  className="text-mobile-section font-extrabold md:text-landing-section"
                >
                  Let&rsquo;s find your story.
                </h2>
                <p className="mt-4 text-body font-medium md:text-landing-copy">
                  There&rsquo;s a NeighborNet near you. Find it, and just show
                  up &mdash; someone&rsquo;s saving you a seat.
                </p>
              </TextReveal>
            }
            viewAll={
              <TextReveal>
                <StandardButton
                  href="/neighbornets"
                  label="View all NeighborNets"
                  tone="dark"
                  {...textRevealUnit}
                />
              </TextReveal>
            }
          />
        </div>
      </div>
    </section>
  );
}
