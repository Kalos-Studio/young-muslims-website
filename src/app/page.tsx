import type { Metadata } from "next";
import Link from "next/link";

import { HeroScrollSequence } from "./hero-scroll-sequence";
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

const BAND = [
  { size: "7rem", gap: "0rem", drop: "0.5rem", tone: "border-brand-royal" },
  {
    size: "4.5rem",
    gap: "2.5rem",
    drop: "-1.25rem",
    tone: "border-brand-jade",
  },
  { size: "9rem", gap: "1rem", drop: "1rem", tone: "border-landing-cyan" },
  {
    size: "5rem",
    gap: "4rem",
    drop: "-0.75rem",
    tone: "border-brand-royal",
  },
  {
    size: "6.5rem",
    gap: "1.25rem",
    drop: "0.75rem",
    tone: "border-brand-jade",
  },
  {
    size: "4rem",
    gap: "3.5rem",
    drop: "-1rem",
    tone: "border-landing-cyan",
  },
  {
    size: "8rem",
    gap: "1rem",
    drop: "0.25rem",
    tone: "border-brand-royal",
  },
  {
    size: "5.5rem",
    gap: "3rem",
    drop: "-0.5rem",
    tone: "border-brand-jade",
  },
] as const;

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

function PortraitBand({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "flex w-[130%] -translate-x-[12%] -rotate-6 items-center justify-center",
        className,
      )}
      aria-label="Portrait image placeholders"
    >
      {BAND.map((portrait, index) => (
        <div
          key={index}
          className={cn(
            "flex shrink-0 rotate-6 items-center justify-center rounded-full border-4 bg-muted text-muted-foreground",
            portrait.tone,
          )}
          style={{
            width: portrait.size,
            height: portrait.size,
            marginLeft: portrait.gap,
            marginTop: portrait.drop,
          }}
        >
          <PersonOutline className="h-1/2 w-1/2" />
        </div>
      ))}
    </div>
  );
}

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
            note: "As the visitor scrolls, the full-screen community video shrinks into a centered frame while moments from Young Muslims appear behind it.",
          },
        ]}
      >
        <HeroScrollSequence />
      </Annotate>

      <Annotate
        bleed
        note="Portrait photography will animate into view in a circular motion. The placeholders preserve the intended composition."
      >
        <section
          data-header-theme="light"
          className="relative min-h-[1611px] w-full overflow-hidden bg-brand-warm-snow"
        >
          <PortraitBand className="absolute top-40" />
          <div className="absolute top-[664px] left-1/2 w-full max-w-[784px] -translate-x-1/2 text-center">
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
          <PortraitBand className="absolute bottom-32" />
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

      <Annotate note="Metrics will count upward, and the final globe will show Young Muslims communities across America.">
        <section
          data-header-theme="light"
          className="min-h-[1962px] pt-[280px] text-center"
        >
          <div className="mx-auto min-h-[219px] w-full max-w-[560px]">
            <h2 className="text-section font-extrabold">
              And it&apos;s not just here.
              <br />
              It&apos;s everywhere.
            </h2>
            <p className="mt-8 text-lead font-medium">
              What started as a few friends in one city is now a network that
              spans the country.
            </p>
          </div>
          <div className="mt-[171px] grid grid-cols-3 gap-10">
            {[
              ["200+", "NeighborNets"],
              ["26", "states"],
              ["10,000s", "of young Muslims"],
            ].map(([number, label]) => (
              <div key={label} className="min-h-[133px]">
                <p className="font-display text-stat font-normal">{number}</p>
                <p className="mt-2 text-lead font-medium">{label}</p>
              </div>
            ))}
          </div>
          <Annotate bleed className="mt-[35px]">
            <Frame
              label="Interactive 3D globe placeholder"
              detail="Fixed on the United States, showing where the NeighborNets are"
              className="h-[681px] w-full rounded-card border border-brand-obsidian/10 bg-muted text-brand-obsidian"
            />
          </Annotate>
          <div className="mt-[70px] flex items-center justify-center gap-12">
            <PortraitPlaceholder className="size-28" />
            <p className="max-w-[560px] text-lead font-medium">
              Wherever you go, there&apos;s a Young Muslim. A brother or sister
              in a city you&apos;ve never been to, dealing with the same things
              you are.
            </p>
            <PortraitPlaceholder className="size-28 border-landing-cyan" />
          </div>
        </section>
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
