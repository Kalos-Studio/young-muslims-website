import type { Metadata } from "next";
import Link from "next/link";

// WIREFRAME: this whole page is scaffolding. See WIREFRAME.md.
import { Annotate } from "@/components/wireframe/annotate";
import { PageFrame } from "@/components/wireframe/page-frame";
import { PersonOutline } from "@/components/wireframe/person-outline";

export const metadata: Metadata = {
  title: "Stories",
  description: "The impact YM has had on people, in their words.",
};

/**
 * WIREFRAME: the scattered field of portraits.
 *
 * Positions are hardcoded percentages rather than randomised, so the layout is
 * the same every render and the client reviews one arrangement instead of a new
 * one each reload. Sizes vary because the Figma frame does — the scattering is
 * the idea, not a grid.
 */
const portraits = [
  { left: "3%", top: "1%", size: "10rem" },
  { left: "25%", top: "0%", size: "8.5rem" },
  { left: "57%", top: "5%", size: "9.5rem" },
  { left: "39%", top: "15%", size: "11rem" },
  { left: "9%", top: "25%", size: "9rem" },
  { left: "70%", top: "28%", size: "8rem" },
  { left: "33%", top: "43%", size: "9.5rem" },
  { left: "5%", top: "53%", size: "10.5rem" },
  { left: "61%", top: "56%", size: "9rem" },
];

export default function StoriesPage() {
  return (
    <PageFrame className="pt-16">
      {/* The header does the work of saying these are members, not models, so
          the portraits below it need no caption. */}
      <Annotate>
        <h1 className="max-w-3xl text-5xl leading-tight font-semibold tracking-tight">
          Stories of real Young Muslims
        </h1>
      </Annotate>

      <Annotate
        className="mt-14"
        note="Muneeb's 'product of YM' idea, broadened to include current members too. Stories of the impact YM has had on people, closer to case studies."
      >
        <div className="relative h-[46rem] w-full">
          {portraits.map((portrait) => (
            <div
              key={`${portrait.left}-${portrait.top}`}
              className="absolute flex items-center justify-center rounded-full bg-muted text-wf-fill-muted"
              style={{
                left: portrait.left,
                top: portrait.top,
                width: portrait.size,
                height: portrait.size,
              }}
            >
              <PersonOutline className="h-1/2 w-1/2" />
            </div>
          ))}
        </div>
      </Annotate>

      {/* The scroll stop. Clicking a portrait above lands the reader here. */}
      <Annotate
        note="Scroll stop. Clicking a portrait above lands you on that person's story"
        className="mt-16"
      >
        <div className="grid grid-cols-[minmax(0,5fr)_minmax(0,7fr)] items-stretch">
          <div className="flex aspect-[4/5] items-center justify-center bg-muted text-wf-fill-muted">
            <PersonOutline className="h-2/5 w-2/5" />
          </div>

          {/* WIREFRAME: invented, and only here so the client can see the shape
              and length of a story. Not drafted copy; the real ones get
              written with the people in them. */}
          <div className="flex flex-col justify-center gap-5 bg-wf-fill px-14 py-16 text-background">
            <p className="text-sm text-background/50">
              Rough example, invented. Shows the length and tone a story runs
              to, not final copy
            </p>
            <p className="text-3xl font-semibold">Amina from Richardson, TX</p>
            <p className="max-w-2xl text-base leading-relaxed text-background/80">
              She moved for work in the middle of a semester and knew exactly
              nobody. For the first two months she went to the masjid on Fridays
              and left as soon as the khutbah ended, because staying meant
              standing in a room full of people who already knew each other.
              Someone she half-recognised from work mentioned a Thursday hangout
              a few streets over. She said yes and then spent the rest of the
              week looking for a reason not to go.
            </p>
            <p className="max-w-2xl text-base leading-relaxed text-background/80">
              She went. It was eight people, a lot of food, and a conversation
              that ran past midnight about things she had not said out loud to
              anyone in a year. Three years on, those are the people she calls
              first when something goes wrong, and she now runs the NeighborNet
              she walked into, which currently meets in her living room because
              it outgrew the last place.
            </p>

            {/* The story is the argument; this is what to do about it. Inside
                the card rather than after it, so the call to action arrives
                while the story is still in view. */}
            <Link
              href="/neighbornets"
              className="mt-4 self-start rounded-md border border-background px-6 py-3 text-sm font-medium text-background underline-offset-4 outline-none hover:underline focus-visible:ring-2 focus-visible:ring-background focus-visible:ring-offset-2 focus-visible:ring-offset-wf-fill"
            >
              Join a NeighborNet
            </Link>
          </div>
        </div>
      </Annotate>
    </PageFrame>
  );
}
