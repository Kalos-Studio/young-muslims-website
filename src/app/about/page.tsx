import type { Metadata } from "next";

// WIREFRAME: this whole page is scaffolding. See WIREFRAME.md.
import { Annotate } from "@/components/wireframe/annotate";
import { Frame } from "@/components/wireframe/frame";
import { PageFrame } from "@/components/wireframe/page-frame";

export const metadata: Metadata = {
  title: "About · Young Muslims",
  description: "What Young Muslims is and who it's for.",
};

export default function AboutPage() {
  return (
    <PageFrame className="pt-16">
      <Annotate note="summarize down with a good header">
        <div className="grid grid-cols-2 items-start gap-14">
          <Frame
            variant="fill"
            label="Rotating images of people"
            detail="Cycles through photos of members while the copy stays put"
            className="aspect-square"
          />

          <div className="flex flex-col gap-5">
            <Frame
              label="Section header"
              detail="The one line that says what YM is, pulled out of the copy below"
              className="px-8 py-10"
            />
            <Frame
              label="What Young Muslims is"
              detail="Not a program you attend — a friend group you belong to. Thousands of young adults who hang out every week."
              className="min-h-[11rem] px-8 py-8"
            />
            <Frame
              label="What a NeighborNet is"
              detail="The weekly hangouts, and what members actually call them"
              className="min-h-[9rem] px-8 py-8"
            />
            <Frame
              label="Where it leads"
              detail="Those friendships turning into service, relief work and advocacy"
              className="min-h-[9rem] px-8 py-8"
            />
          </div>
        </div>
      </Annotate>
    </PageFrame>
  );
}
