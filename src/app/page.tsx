import type { Metadata } from "next";

// WIREFRAME: this whole page is scaffolding. Building the real landing page
// means replacing the sections below with real components; the route, the
// metadata and the nav entry pointing here are already correct. See WIREFRAME.md.
import { Annotate } from "@/components/wireframe/annotate";
import { Frame } from "@/components/wireframe/frame";
import { PageFrame } from "@/components/wireframe/page-frame";
import { Text } from "@/components/wireframe/text";

export const metadata: Metadata = {
  title: "Young Muslims",
  description: "By the youth, for the youth.",
};

export default function Home() {
  return (
    <PageFrame>
      {/* Full-page hero. Bleeds, so the video block runs the full width of the
          window the way it will in the real thing. `100dvh - 6rem` is the
          viewport minus the sticky header. */}
      {/* Two notes, each anchored to what it is about: the nav note sits top
          right, directly under the nav it explains, and the video note sits at
          the bottom of the block the video fills. */}
      <Annotate
        bleed
        placement="top-right"
        note="Nav is anchored on putting the primary information at the first degree. Someone landing here is working out who we are, what we do, why we matter, and whether this is real. Everything else goes in the menu."
      >
        <Annotate
          bleed
          placement="bottom-left"
          note="background video loop with footage of people having fun, brothers' videos and sisters' videos interlooped"
        >
          <section className="flex min-h-[calc(100dvh-6rem)] w-full flex-col items-center justify-center gap-12 bg-wf-fill px-10 py-20 text-center">
            <p className="text-sm text-background/50">
              Video loop plays full-bleed behind everything in this block
            </p>

            <h1 className="text-7xl leading-[1.05] font-semibold tracking-tight text-background">
              For the youth,
              <br />
              By the youth
            </h1>

            <p className="text-sm text-background/50">
              H1, overlaid on the video
            </p>
          </section>
        </Annotate>
      </Annotate>

      <Annotate className="mt-20">
        <Text as="h2" example="Built on brotherhood, sisterhood, and Deen.">
          Placeholder tagline / intro text
        </Text>
      </Annotate>

      <Annotate
        note="Some messaging surrounding this about YM mission/vision"
        className="mt-20"
      >
        <Frame
          variant="fill"
          label="Highlight reel video"
          className="aspect-video w-full"
        />
      </Annotate>
    </PageFrame>
  );
}
