import { TextReveal } from "@/components/site/text-reveal";
import { textRevealUnit } from "@/components/site/text-reveal-unit";
import { StandardButton } from "@/components/ui/standard-button";
import { cn } from "@/lib/utils";

import { BelongingRing } from "./belonging-ring";
import styles from "./belonging-section.module.css";

/**
 * The space at the foot of the section for the waves into the dark "show
 * you" section below. The dark section draws those waves (its wavy top edge,
 * Figma 165:1221 and 165:1223) over this band, so the blob's outline can
 * drift with scroll as one shape.
 */
function BelongingWaveBand() {
  return (
    <div
      aria-hidden="true"
      className={cn("pointer-events-none relative", styles.waveBand)}
    >
      {/* Backs the wave's bottom edge, which can fall on a fractional pixel,
          so no Warm Snow hairline shows against the next section. */}
      <div className="absolute inset-x-0 bottom-0 h-0.5 bg-brand-obsidian" />
    </div>
  );
}

/**
 * The landing page's second section, "More than a program" (Figma 37:19,
 * tablet 279:150, mobile 294:1078). It follows the hero, so it rides up over
 * it behind the hero's wave. The copy sits in the middle of an oval ring of
 * faces that swirls in and drifts with scroll (BelongingRing); the copy
 * itself uses the site's text reveal.
 */
export function BelongingSection() {
  return (
    <section
      aria-labelledby="belonging-heading"
      className="relative overflow-clip bg-brand-warm-snow"
    >
      <div
        className={cn(
          "relative flex items-center justify-center",
          styles.stage,
        )}
      >
        <BelongingRing />
        <TextReveal className="relative z-10 mx-auto flex w-full max-w-360 flex-col items-center px-8 text-center md:px-16 xl:px-20">
          <h2
            id="belonging-heading"
            className="text-mobile-section font-extrabold text-brand-jade md:text-landing-section"
          >
            More than a program.
            <br />A place to belong.
          </h2>
          <p className="mt-6 text-body font-medium text-brand-obsidian md:max-w-146 md:text-landing-copy xl:max-w-196">
            Young Muslims is the nation&apos;s largest Muslim youth
            organization, but that&apos;s not how members describe it. To them,
            it&apos;s the people they see every week, the ones who became a
            second family. Across the country, Young Muslims turns everyday
            friendship into a stronger Deen, a stronger self, and a lifetime of
            brotherhood and sisterhood.
          </p>
          <StandardButton
            href="/about"
            label="Who We Are"
            {...textRevealUnit}
            className="mt-6 md:mt-8"
          />
        </TextReveal>
      </div>
      <BelongingWaveBand />
    </section>
  );
}
