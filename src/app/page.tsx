import type { Metadata } from "next";
import Link from "next/link";

import { BelongingPortraitOrbit } from "./belonging-portrait-orbit";
import { EverywhereSection } from "./everywhere-section";
import { HeroVideo } from "./hero-video";
import { HighlightReelMarquee } from "./highlight-reel-section";

// WIREFRAME: media remains represented by placeholders while the landing-page
// visual system, hierarchy, and approved copy come from Figma. See WIREFRAME.md.
import { cn } from "@/lib/utils";
import { Annotate } from "@/components/wireframe/annotate";
import { Frame } from "@/components/wireframe/frame";
import { PageFrame } from "@/components/wireframe/page-frame";
import { PersonOutline } from "@/components/wireframe/person-outline";

export const metadata: Metadata = {
  title: "Young Muslims",
  description:
    "A nationwide brotherhood and sisterhood, built on real friendships and a shared Deen.",
};

const POINTS = [
  {
    title: "Your people, every week",
    body: "Brotherhood and sisterhood come first. Weekly NeighborNets, halaqas, and pickup games. The friendships are the foundation for everything else.",
    media: "Image of a weekly NeighborNet",
  },
  {
    title: "Become who you're meant to be",
    body: "Leadership workshops, career support, and the space to lead, speak, and build things you never would have on your own.",
    media: "Image of youth leading together",
  },
  {
    title: "Guidance that actually lands",
    body: "Peer-led mentorship from people your own age who get it. Real conversations, not lectures from across a generational gap.",
    media: "Image of peer-led mentorship",
  },
  {
    title: "Turn belonging into impact",
    body: "Feeding the hungry, relief work, and local service. Showing up for your community, together.",
    media: "Image of local service",
  },
] as const;

function PointCard({
  title,
  body,
  media,
}: {
  title: string;
  body: string;
  media: string;
}) {
  return (
    <article className="min-h-[482px] overflow-hidden rounded-card bg-landing-blush text-landing-card-ink">
      <Frame
        label={media}
        className="h-[234px] border-0 bg-brand-warm-snow/50 text-brand-obsidian/60"
      />
      <div className="px-7 py-8">
        <h3 className="text-card-title font-semibold">{title}</h3>
        <p className="mt-4 text-body font-normal">{body}</p>
      </div>
    </article>
  );
}

function PortraitPlaceholder({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "flex shrink-0 items-center justify-center rounded-full border-4 border-brand-jade bg-muted text-muted-foreground",
        className,
      )}
      aria-label="Portrait image placeholder"
    >
      <PersonOutline className="h-1/2 w-1/2" />
    </div>
  );
}

export default function Home() {
  return (
    <PageFrame className="overflow-x-clip" data-landing-page="true">
      <Annotate
        bleed
        notes={[
          {
            placement: "top-left",
            note: (
              <>
                <span className="block font-bold">READ THIS FIRST</span>
                <span className="mt-3 block">
                  Colors, typography, hierarchy, and approved copy now follow
                  the landing-page design. Photography and video remain labelled
                  placeholders until final media is supplied.
                </span>
              </>
            ),
          },
          {
            placement: "center-left",
            note: "This full-screen placeholder represents a future looping community video. It remains fixed within the hero and does not respond to scrolling.",
          },
        ]}
      >
        <HeroVideo />
      </Annotate>

      <Annotate
        bleed
        note="Twenty-six interlocking portraits form a continuous ring around the copy. The connected composition drifts gently while several portraits remain cropped by the viewport."
      >
        <section
          data-header-theme="light"
          className="relative h-[1264px] w-full overflow-hidden bg-brand-warm-snow"
        >
          <div className="absolute inset-x-0 -top-40 h-[1611px]">
            <BelongingPortraitOrbit />
          </div>
          <div className="absolute top-[504px] left-1/2 w-full max-w-[784px] -translate-x-1/2 text-center">
            <h2 className="text-section font-extrabold text-brand-jade">
              More than a program.
              <br />A place to belong.
            </h2>
            <p className="mt-[43px] text-lead font-medium text-brand-obsidian">
              Young Muslims is the nation&apos;s largest Muslim youth
              organization, but that&apos;s not how members describe it. To
              them, it&apos;s the people they see every week, the ones who
              became a second family. Across the country, Young Muslims turns
              everyday friendship into a stronger Deen, a stronger self, and a
              lifetime of brotherhood and sisterhood.
            </p>
          </div>
        </section>
      </Annotate>

      <Annotate
        bleed
        note="The highlight reel will autoplay without sound. Selecting it will open the full video in an overlay."
      >
        <section
          data-header-theme="dark"
          className="relative min-h-[899px] w-full overflow-hidden bg-brand-obsidian px-16 pt-[100px] text-brand-warm-snow"
        >
          <h2 className="mx-auto max-w-[784px] text-center text-section font-extrabold whitespace-nowrap">
            But it&apos;s easier to just{" "}
            <span className="text-landing-cyan">show you</span>.
          </h2>
          <HighlightReelMarquee />
          <div className="relative mt-[104px]">
            <Frame
              label="Highlight reel video placeholder"
              detail="Autoplaying without sound, with a play control"
              className="relative z-10 mr-10 ml-auto h-[529px] w-[833px] rounded-media border border-brand-warm-snow/20 bg-brothers-midnight text-brand-warm-snow shadow-2xl"
            />
          </div>
        </section>
      </Annotate>

      <Annotate
        bleed
        placement="top-right"
        note="The introduction stays fixed while the four image cards move at different speeds during scroll."
      >
        <section
          data-header-theme="dark"
          className="grid min-h-[1386px] w-full grid-cols-2 items-start gap-16 bg-brand-obsidian px-20 pt-[130px] pb-[130px] text-brand-warm-snow"
        >
          <div className="sticky top-36 mt-[331px] w-full max-w-[560px]">
            <h2 className="text-section font-extrabold">
              So what are we
              <br />
              actually all about?
            </h2>
            <p className="mt-8 text-lead font-medium">
              Everything at Young Muslims starts with the people. From there, it
              grows.
            </p>
            <Link
              href="/about"
              className="mt-8 inline-flex rounded-pill bg-brand-royal px-6 py-4 text-nav font-bold text-brand-pure-white outline-none hover:bg-brand-royal/80 focus-visible:ring-2 focus-visible:ring-brand-pure-white focus-visible:ring-offset-2 focus-visible:ring-offset-brand-obsidian"
            >
              About us
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-7">
            <div className="flex flex-col gap-[72px]">
              <PointCard {...POINTS[0]} />
              <PointCard {...POINTS[1]} />
            </div>
            <div className="mt-[90px] flex flex-col gap-[72px]">
              <PointCard {...POINTS[2]} />
              <PointCard {...POINTS[3]} />
            </div>
          </div>
        </section>
      </Annotate>

      <Annotate note="Once this section fills the viewport, the heading appears, the metrics count upward, and youth portraits move at different speeds as the visitor scrolls.">
        <EverywhereSection>
          <Annotate bleed className="mt-[35px]">
            <Frame
              label="Interactive 3D globe placeholder"
              detail="Fixed on the United States, showing where the NeighborNets are"
              className="h-[681px] w-full rounded-card border border-brand-obsidian/10 bg-muted text-brand-obsidian"
            />
          </Annotate>
        </EverywhereSection>
      </Annotate>

      <Annotate>
        <section
          data-header-theme="light"
          className="relative min-h-[1038px] overflow-hidden text-center"
        >
          <PortraitPlaceholder className="absolute top-10 left-[8%] size-40 border-brand-royal" />
          <PortraitPlaceholder className="absolute top-0 left-[43%] size-36 border-brand-jade" />
          <PortraitPlaceholder className="absolute top-16 right-[9%] size-36 border-landing-cyan" />
          <PortraitPlaceholder className="absolute bottom-16 left-[14%] size-36 border-brand-jade" />
          <PortraitPlaceholder className="absolute bottom-0 left-[45%] size-40 border-landing-cyan" />
          <PortraitPlaceholder className="absolute right-[12%] bottom-20 size-44 border-brand-royal" />
          <div className="absolute top-1/2 left-1/2 w-full max-w-[784px] -translate-x-1/2 -translate-y-1/2 text-section font-extrabold">
            <p>A number can&apos;t show you what it actually feels like.</p>
            <p className="text-landing-cyan">The people can.</p>
          </div>
        </section>
      </Annotate>
    </PageFrame>
  );
}
