import type { Metadata } from "next";

// WIREFRAME: this whole page is scaffolding. Building the real landing page
// means replacing the sections below with real components; the route, the
// metadata and the nav entry pointing here are already correct. See WIREFRAME.md.
import { Annotate } from "@/components/wireframe/annotate";
import { Frame } from "@/components/wireframe/frame";
import { PageFrame } from "@/components/wireframe/page-frame";

export const metadata: Metadata = {
  title: "Young Muslims",
  description: "By the youth, for the youth.",
};

export default function Home() {
  return (
    <PageFrame>
      {/* Full-page hero. Overlay layout rather than the note rail, so the video
          block can run the full width of the window the way it will in the
          real thing. `100dvh - 6rem` is the viewport minus the sticky header. */}
      <Annotate
        overlay
        note="background video loop with footage of people having fun — brothers' videos and sisters' videos interlooped"
      >
        <section className="flex min-h-[calc(100dvh-6rem)] w-full flex-col items-center justify-center gap-10 bg-wf-fill px-10 py-20">
          <p className="text-sm text-background/60">
            Video loop plays full-bleed behind everything in this block
          </p>

          <div className="border border-dashed border-background/40 px-12 py-14 text-center">
            <p className="text-5xl leading-[1.1] font-semibold text-background">
              For the youth,
              <br />
              By the youth
            </p>
            <p className="mt-8 text-sm text-background/60">
              H1, overlaid on the video
            </p>
          </div>
        </section>
      </Annotate>

      <Annotate className="mt-24">
        <Frame
          label="Tagline / intro text"
          detail="e.g. “Built on brotherhood, sisterhood, and Deen.”"
          className="px-8 py-12"
        />
      </Annotate>

      <Annotate
        note="Some messaging surrounding this about YM mission/vision"
        className="mt-10"
        align="center"
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
