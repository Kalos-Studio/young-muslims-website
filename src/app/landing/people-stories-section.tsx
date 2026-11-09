import { TextReveal } from "@/components/site/text-reveal";
import { textRevealUnit } from "@/components/site/text-reveal-unit";
import { StandardButton } from "@/components/ui/standard-button";

import { PeopleStoriesField } from "./people-stories-field";

/**
 * The landing page's stories snippet (Figma 84:219, tablet 279:507, mobile
 * 296:1295): "But a number can't show you what it actually feels like. The
 * people can." and "View Stories" (to /stories), with six floating headshots
 * around it (PeopleStoriesField), each opening its person's story over the
 * page. The stories are placeholders (story-snippets.ts).
 *
 * The field follows the frames (360 x 734, 768 x 886, 1440 x 1114), centred
 * and capped at their widths; the background is full-bleed. On mobile three
 * headshots sit above the copy and three below.
 */
export function PeopleStoriesSection() {
  return (
    <section
      aria-labelledby="people-stories-heading"
      className="relative overflow-x-clip bg-brand-warm-snow"
    >
      <div className="relative mx-auto h-183.5 max-w-90 md:h-221.5 md:max-w-192 xl:h-278.5 xl:max-w-360">
        <div className="absolute inset-x-0 top-60 px-8 md:top-84.75 md:px-0 xl:top-119.25">
          <TextReveal className="mx-auto flex max-w-147.25 flex-col items-center text-center">
            <h2
              id="people-stories-heading"
              className="text-mobile-section font-extrabold text-brand-obsidian md:text-landing-section"
            >
              But a number can&rsquo;t show you what it actually feels like.
              <br />
              <span className="text-landing-cyan">The people can</span>.
            </h2>
            <StandardButton
              href="/stories"
              label="View Stories"
              {...textRevealUnit}
              className="mt-8"
            />
          </TextReveal>
        </div>
        <PeopleStoriesField />
      </div>
    </section>
  );
}
