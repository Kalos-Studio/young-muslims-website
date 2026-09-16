import type { Metadata } from "next";

// WIREFRAME: this whole page is scaffolding. Building the real landing page
// means replacing the sections below with real components; the route, the
// metadata and the nav entry pointing here are already correct. See WIREFRAME.md.
import { cn } from "@/lib/utils";
import { Annotate } from "@/components/wireframe/annotate";
import { Frame } from "@/components/wireframe/frame";
import { PageFrame } from "@/components/wireframe/page-frame";
import { PersonOutline } from "@/components/wireframe/person-outline";
import { Lorem, Text } from "@/components/wireframe/text";

export const metadata: Metadata = {
  title: "Young Muslims",
  description: "By the youth, for the youth.",
};

/**
 * WIREFRAME: a diagonal band of cut-out portraits.
 *
 * The band is rotated and each portrait counter-rotated by the same amount,
 * which puts the faces on a diagonal line while keeping every face upright.
 * Rotating only the row would tip all the faces with it.
 *
 * Sizes and gaps are hardcoded and uneven on purpose. An even row of same-sized
 * circles reads as an avatar list; the mock is a collage, which means a few
 * large faces, several small ones, and irregular clustering with real gaps. The
 * values are fixed rather than random so the client reviews one arrangement
 * instead of a new one per reload.
 *
 * The band is wider than the viewport and the section clips it, so it runs off
 * both edges rather than starting and stopping inside the page.
 */
const BAND = [
  { size: "7rem", gap: "0rem", drop: "0.5rem" },
  { size: "4.5rem", gap: "2.5rem", drop: "-1.25rem" },
  { size: "9rem", gap: "1rem", drop: "1rem" },
  { size: "5rem", gap: "4rem", drop: "-0.75rem" },
  { size: "6.5rem", gap: "1.25rem", drop: "0.75rem" },
  { size: "4rem", gap: "3.5rem", drop: "-1rem" },
  { size: "8rem", gap: "1rem", drop: "0.25rem" },
  { size: "5.5rem", gap: "3rem", drop: "-0.5rem" },
];

function PortraitBand({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "flex w-[130%] -translate-x-[12%] -rotate-6 items-center justify-center",
        className,
      )}
    >
      {BAND.map((portrait, index) => (
        <div
          key={index}
          className="flex shrink-0 rotate-6 items-center justify-center rounded-full bg-wf-fill-muted text-background"
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

/**
 * WIREFRAME: one of the four cards in the "what YM is about" grid. Each card is
 * an example of the claim in the column beside it, so they are named rather than
 * left as four identical unknowns.
 */
function PointCard({ title }: { title: string }) {
  return (
    <div className="border border-background/30 bg-background/10 px-7 py-8">
      <Text as="h4" tone="dark">
        {title}
      </Text>
      <Lorem paragraphs={1} tone="dark" className="mt-3" />
    </div>
  );
}

export default function Home() {
  return (
    <PageFrame>
      {/* Three notes, each anchored to what it is about. The framing note is
          top left so it is the first one read: left before right, and level
          with the nav it sits under. The nav rationale is top right, against
          the nav itself. The clips note sits in the middle band on the left,
          clear of the fixed notes toggle in the bottom-left corner. */}
      <Annotate
        bleed
        notes={[
          {
            placement: "top-left",
            note: (
              <>
                {/* WIREFRAME: the one deliberate exception to the no-all-caps
                    rule, because this note has to be read before the others. */}
                <span className="block font-bold">READ THIS FIRST</span>
                <span className="mt-3 block">
                  The intention of this prototype is to map out the information
                  architecture of the Young Muslims website. It is intentionally
                  black and white so we can focus on the site map and the IA.
                </span>
                <span className="mt-3 block">
                  Styling, fonts and colors in the final version will of course
                  match the brand kit.
                </span>
              </>
            ),
          },
          {
            placement: "top-right",
            note: "Nav is anchored on putting the primary information at the first degree. Someone landing here is working out who we are, what we do, why we matter, and whether this is real. Everything else goes in the menu.",
          },
          {
            placement: "center-left",
            note: "cinematic clips of people having fun, brothers' and sisters' footage interlooped",
          },
        ]}
      >
        <section className="flex min-h-[calc(100dvh-6rem)] w-full flex-col items-center justify-center gap-6 bg-wf-fill px-16 py-24 text-center">
          <p className="text-sm text-background/50">
            Full-bleed footage behind everything in this block
          </p>
          <Text as="display" tone="dark" className="max-w-4xl">
            Placeholder hero headline
          </Text>
          <Text as="body" tone="dark" className="max-w-xl">
            Placeholder supporting line, one sentence on what YM is
          </Text>
        </section>
      </Annotate>

      {/* The collage band. Copy sits in the gap the faces leave. */}
      <Annotate bleed className="mt-0">
        <section className="w-full overflow-hidden bg-muted py-24">
          <PortraitBand />

          <div className="mx-auto max-w-2xl px-10 py-20 text-center">
            <Text as="h2" className="mx-auto">
              Placeholder, copy describing what Young Muslims is
            </Text>
            <Lorem paragraphs={1} className="mt-6" />
          </div>

          <PortraitBand />
        </section>
      </Annotate>

      {/* Video. In the mock the wordmark is set very large behind the player and
          runs off both edges, so the player reads as sitting on top of it. */}
      <Annotate bleed>
        <section className="w-full bg-wf-fill px-16 py-24">
          <Text as="h2" tone="dark" className="mx-auto max-w-3xl text-center">
            Placeholder line, transitioning from telling them into showing them
            what YM is
          </Text>

          <div className="relative mt-14 overflow-hidden">
            <p className="pointer-events-none absolute inset-0 flex items-center text-display font-semibold whitespace-nowrap text-background/15">
              Oversized wordmark behind the player
            </p>
            <Frame
              variant="muted"
              label="Highlight reel video, with a play control"
              className="relative mx-auto aspect-video w-2/3"
            />
          </div>
        </section>
      </Annotate>

      {/* What we are about: a statement on the left, the four points on the
          right, staggered so the column reads as a set rather than a list. */}
      <Annotate bleed placement="top-right">
        <section className="grid w-full grid-cols-2 items-center gap-16 bg-wf-fill px-16 py-28">
          <div>
            <Text as="h2" tone="dark">
              Placeholder, what YM is about
            </Text>
            <Lorem paragraphs={1} tone="dark" className="mt-6 max-w-md" />
            <div className="mt-8 inline-block rounded-full border border-background px-6 py-3 text-sm font-medium text-background">
              Link through to About
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="flex flex-col gap-6">
              <PointCard title="Education" />
              <PointCard title="Advocacy" />
            </div>
            {/* The offset is the whole point of the treatment in the mock. */}
            <div className="mt-16 flex flex-col gap-6">
              <PointCard title="Mentorship" />
              <PointCard title="Giving back" />
            </div>
          </div>
        </section>
      </Annotate>

      {/* Reach: the claim, the numbers behind it, then the map that makes the
          numbers concrete. */}
      <Annotate className="mt-28">
        <div className="mx-auto max-w-2xl text-center">
          <Text as="h2" className="mx-auto">
            Placeholder headline, that this is nationwide
          </Text>
          <Lorem paragraphs={1} className="mt-6" />
        </div>

        <div className="mt-20 grid grid-cols-3 gap-10 text-center">
          {["NeighborNets", "States", "Young Muslims"].map((label) => (
            <div key={label}>
              <p className="text-h1 font-semibold">[Number]</p>
              <p className="mt-2 text-sm text-muted-foreground">{label}</p>
            </div>
          ))}
        </div>

        <Annotate bleed className="mt-16">
          <Frame
            variant="muted"
            label="Interactive globe"
            detail="Fixed on the United States, showing where the nets are"
            className="aspect-[21/9] w-full"
          />
        </Annotate>

        <div className="mt-16 flex items-center justify-center gap-10">
          <div className="flex size-24 shrink-0 items-center justify-center rounded-full bg-muted text-wf-fill-muted">
            <PersonOutline className="h-1/2 w-1/2" />
          </div>
          <Text as="body" className="max-w-md text-center">
            Placeholder closing line on finding people wherever you go
          </Text>
          <div className="flex size-24 shrink-0 items-center justify-center rounded-full bg-muted text-wf-fill-muted">
            <PersonOutline className="h-1/2 w-1/2" />
          </div>
        </div>
      </Annotate>

      {/* The handoff into Stories. */}
      <Annotate className="mt-28">
        <Frame
          label="Still in progress"
          detail="More content coming"
          className="min-h-[18rem] w-full"
        />
      </Annotate>
    </PageFrame>
  );
}
