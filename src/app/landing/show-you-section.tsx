import { TextReveal } from "@/components/site/text-reveal";

import { ShowYouMotion } from "./show-you-motion";
import { ShowYouReel } from "./show-you-reel";

/**
 * The landing page's dark "show you" section (Figma 53:73, tablet 279:208,
 * mobile 294:1136): the warm-to-dark handoff. An Obsidian blob, its wavy top
 * edge rising out of the belonging section and its wavy bottom edge hanging
 * over the cards section, holds "But it's easier to just show you.", rows of
 * background lettering and the highlight-reel card.
 *
 * It is the page's first deliberate parallax moment: the lettering and the
 * blob's edges drift with scroll (ShowYouMotion). The card plays the reel in
 * place (ShowYouReel). The section sits above its neighbours so its edges
 * can overlap them; it clips sideways only.
 *
 * Vertical rhythm per frame (heading top / gap to card / space under it):
 * mobile 51 / 67 / 221, tablet 51 / 137 / 262, desktop 202 / 108 / 200.
 * On desktop the card sits 200 to the right of centre, as in Figma; on wide
 * screens (from `2xl`) it centres, and the stage spans the viewport, as the
 * approved wide-screen layout (checked by `bun run test:responsive`) requires.
 * The heading and card have fixed widths, so nothing grows past 1440.
 */
export function ShowYouSection() {
  return (
    <section
      aria-labelledby="show-you-heading"
      className="relative z-20 overflow-x-clip bg-brand-obsidian"
    >
      <ShowYouMotion />
      <div className="relative flex w-full flex-col items-center px-8 pt-12.75 pb-55.25 md:px-16 md:pb-65.5 xl:px-20 xl:pt-50.5 xl:pb-50">
        <TextReveal
          as="h2"
          id="show-you-heading"
          className="px-2 text-center text-mobile-section font-extrabold text-brand-warm-snow md:px-0 md:text-landing-section"
        >
          But it&apos;s easier to just show you.
        </TextReveal>
        <div className="mt-16.75 w-full md:mt-34.25 md:w-156 xl:mt-27 xl:w-208.25 xl:translate-x-50 2xl:translate-x-0">
          <ShowYouReel />
        </div>
      </div>
    </section>
  );
}
