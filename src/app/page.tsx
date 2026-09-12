import type { Metadata } from "next";

// WIREFRAME: this whole page is scaffolding. Building the real landing page
// means replacing the sections below with real components; the route, the
// metadata and the nav entry pointing here are already correct. See WIREFRAME.md.
import { Annotate } from "@/components/wireframe/annotate";
import { Frame } from "@/components/wireframe/frame";
import { PageFrame } from "@/components/wireframe/page-frame";
import { TextSlot } from "@/components/wireframe/text-slot";

export const metadata: Metadata = {
  title: "Young Muslims",
  description: "By the youth, for the youth.",
};

export default function Home() {
  return (
    <PageFrame label="Landing">
      {/* Hero. A video loop plays behind the headline, so the headline slot is
          drawn on the filled block rather than beside it. */}
      <Annotate
        note="background video clips of people having fun"
        align="center"
      >
        <Frame
          variant="fill"
          label="Background video loop"
          className="min-h-[34rem] px-16"
        >
          <div className="flex w-full flex-col items-center gap-10">
            <p className="text-[0.625rem] font-medium tracking-[0.3em] text-background/50 uppercase">
              Background video loop
            </p>
            <TextSlot
              label="H1"
              size="h1"
              lines={2}
              align="center"
              tone="dark"
              className="max-w-xl"
            />
          </div>
        </Frame>
      </Annotate>

      {/* The line under the hero. Three terms inside it are emphasised, which is
          a type decision rather than a layout one, so it gets its own slot. */}
      <Annotate className="mt-24">
        <TextSlot
          label="Tagline · three emphasised terms"
          size="h2"
          lines={1}
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
