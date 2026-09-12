import type { Metadata } from "next";

// WIREFRAME: this whole page is scaffolding. See WIREFRAME.md.
import { Annotate } from "@/components/wireframe/annotate";
import { Frame } from "@/components/wireframe/frame";
import { PageFrame } from "@/components/wireframe/page-frame";

export const metadata: Metadata = {
  title: "Support · Young Muslims",
  description: "Give to the work, and see where it goes.",
};

export default function SupportPage() {
  return (
    <PageFrame className="pt-16">
      <Annotate note="include something about advocacy">
        <div className="flex flex-col gap-4">
          <Frame
            variant="fill"
            label="Hero with tagline"
            className="min-h-[9rem]"
          />
          <Frame
            variant="fill"
            label="YM mission"
            detail="What the money actually goes to: service, relief work, advocacy"
            className="min-h-[9rem]"
          />
        </div>
      </Annotate>

      {/* The donation widget is Fundraise Up, which is a third-party embed, so
          it is a fixed-width column beside the image rather than something we
          lay out ourselves. */}
      <Annotate className="mt-4">
        <div className="grid grid-cols-[minmax(0,1fr)_22rem] items-stretch">
          <Frame
            variant="muted"
            label="Full-bleed image"
            className="aspect-[4/3]"
          />
          <Frame
            variant="outline"
            label="Donation widget"
            detail="Fundraise Up embed: one-time / monthly, preset amounts, dedicate, comment, donate"
            className="px-8"
          />
        </div>
      </Annotate>

      <Annotate
        note="anonymize supporter names — “an anonymous person from X state”"
        className="mt-4"
      >
        <div className="grid grid-cols-[minmax(0,1fr)_22rem] items-stretch">
          <Frame
            variant="muted"
            label="Story"
            detail="One person's story, tying the giving back to a name"
            className="aspect-[4/3]"
          />
          <Frame
            variant="outline"
            label="Recent supporters"
            detail="A running list of recent gifts, plus a share prompt above it"
            className="px-8"
          />
        </div>
      </Annotate>
    </PageFrame>
  );
}
