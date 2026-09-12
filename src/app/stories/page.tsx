import type { Metadata } from "next";

// WIREFRAME: this whole page is scaffolding. See WIREFRAME.md.
import { Annotate } from "@/components/wireframe/annotate";
import { Frame } from "@/components/wireframe/frame";
import { PageFrame } from "@/components/wireframe/page-frame";

export const metadata: Metadata = {
  title: "Stories · Young Muslims",
  description: "The impact YM has had on people, in their words.",
};

/**
 * WIREFRAME: the scattered field of portraits.
 *
 * Positions are hardcoded percentages rather than randomised, so the layout is
 * the same every render and the client is looking at one arrangement instead of
 * a new one each reload. Sizes vary because the Figma frame does — the
 * scattering is the idea, not a grid.
 */
const portraits = [
  { left: "4%", top: "2%", size: "10rem" },
  { left: "26%", top: "0%", size: "8.5rem" },
  { left: "58%", top: "6%", size: "9.5rem" },
  { left: "40%", top: "16%", size: "11rem" },
  { left: "10%", top: "26%", size: "9rem" },
  { left: "68%", top: "30%", size: "8rem" },
  { left: "34%", top: "44%", size: "9.5rem" },
  { left: "6%", top: "54%", size: "10.5rem" },
  { left: "60%", top: "58%", size: "9rem" },
];

export default function StoriesPage() {
  return (
    <PageFrame className="pt-16">
      <Annotate note="Muneeb's 'product of YM' idea, broadened to include current members too. Stories of the impact YM has had on people, closer to case studies.">
        <div className="relative h-[46rem] w-full">
          {portraits.map((portrait) => (
            <div
              key={`${portrait.left}-${portrait.top}`}
              className="absolute flex items-center justify-center rounded-full bg-wf-fill-muted text-center text-xs text-background"
              style={{
                left: portrait.left,
                top: portrait.top,
                width: portrait.size,
                height: portrait.size,
              }}
            >
              Portrait
            </div>
          ))}
        </div>
      </Annotate>

      <Annotate
        note="Scroll stop — clicking a portrait above lands you here on that person's story"
        className="mt-8"
      >
        <div className="grid grid-cols-[minmax(0,5fr)_minmax(0,7fr)] items-stretch">
          <Frame
            variant="muted"
            label="Portrait of the person whose story this is"
            className="aspect-[4/5]"
          />
          <Frame
            variant="fill"
            label="Full story"
            detail="A paragraph or two in their own words, closer to a case study than a testimonial"
            className="px-12"
          />
        </div>
      </Annotate>
    </PageFrame>
  );
}
