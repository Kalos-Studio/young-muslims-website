import type { Metadata } from "next";
import Link from "next/link";

// WIREFRAME: this whole page is scaffolding. See WIREFRAME.md.
import { Annotate } from "@/components/wireframe/annotate";
import { PageFrame } from "@/components/wireframe/page-frame";
import { PersonOutline } from "@/components/wireframe/person-outline";
import { cn } from "@/lib/utils";

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
  { position: "top-0 left-0", size: "size-40", tone: "bg-brand-royal" },
  { position: "top-0 left-1/4", size: "size-32", tone: "bg-brand-jade" },
  { position: "top-4 right-20", size: "size-36", tone: "bg-brothers-slate" },
  { position: "top-36 left-1/3", size: "size-44", tone: "bg-sisters-brass" },
  { position: "top-64 left-20", size: "size-36", tone: "bg-landing-blush" },
  { position: "top-72 right-0", size: "size-32", tone: "bg-brand-royal" },
  { position: "bottom-40 left-1/3", size: "size-36", tone: "bg-brand-jade" },
  { position: "bottom-0 left-0", size: "size-40", tone: "bg-sisters-brass" },
  { position: "right-20 bottom-0", size: "size-36", tone: "bg-brothers-slate" },
];

export default function StoriesPage() {
  return (
    <PageFrame className="bg-brand-warm-snow pt-16 pb-20 text-brand-obsidian">
      {/* The header does the work of saying these are members, not models, so
          the portraits below it need no caption. */}
      <Annotate>
        <h1 className="max-w-3xl font-display text-display font-normal text-brand-jade">
          Stories of real Young Muslims
        </h1>
      </Annotate>

      <Annotate
        className="mt-14"
        note="Muneeb's 'product of YM' idea, broadened to include current members too. Stories of the impact YM has had on people, closer to case studies."
      >
        <div className="relative min-h-screen w-full">
          {portraits.map((portrait, index) => (
            <div
              key={index}
              className={cn(
                "absolute flex items-center justify-center rounded-full border-4 border-brand-pure-white text-brand-pure-white",
                portrait.position,
                portrait.size,
                portrait.tone,
              )}
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
        <div
          id="example-story"
          className="grid scroll-mt-36 grid-cols-2 items-stretch overflow-hidden rounded-card"
        >
          <div className="flex aspect-square items-center justify-center bg-landing-blush text-brand-royal">
            <PersonOutline className="h-2/5 w-2/5" />
          </div>

          {/* WIREFRAME: invented, and only here so the client can see the shape
              and length of a story. Not drafted copy; the real ones get
              written with the people in them. */}
          <div className="flex flex-col justify-center gap-6 bg-brothers-midnight px-16 py-16 text-brand-pure-white">
            <p className="text-body text-brothers-slate">
              Rough example, invented. Shows the length and tone a story runs
              to, not final copy
            </p>
            <p className="text-card-title font-semibold">
              Amina from Richardson, TX
            </p>
            <p className="max-w-2xl text-body font-medium text-brand-pure-white/80">
              She moved for work in the middle of a semester and knew exactly
              nobody. For the first two months she went to the masjid on Fridays
              and left as soon as the khutbah ended, because staying meant
              standing in a room full of people who already knew each other.
              Someone she half-recognised from work mentioned a Thursday hangout
              a few streets over. She said yes and then spent the rest of the
              week looking for a reason not to go.
            </p>
            <p className="max-w-2xl text-body font-medium text-brand-pure-white/80">
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
              className="mt-4 self-start rounded-pill border border-brand-pure-white px-6 py-4 text-nav font-bold text-brand-pure-white outline-none hover:bg-brand-pure-white hover:text-brothers-midnight focus-visible:ring-2 focus-visible:ring-brand-pure-white focus-visible:ring-offset-2 focus-visible:ring-offset-brothers-midnight"
            >
              Join a NeighborNet
            </Link>
          </div>
        </div>
      </Annotate>
    </PageFrame>
  );
}
