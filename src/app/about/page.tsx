import type { Metadata } from "next";

// WIREFRAME: this whole page is scaffolding. See WIREFRAME.md.
import { Annotate } from "@/components/wireframe/annotate";
import { Frame } from "@/components/wireframe/frame";
import { PageFrame } from "@/components/wireframe/page-frame";
import { Lorem, Text } from "@/components/wireframe/text";

export const metadata: Metadata = {
  title: "About",
  description: "What Young Muslims is and who it's for.",
};

export default function AboutPage() {
  return (
    <PageFrame className="pt-16">
      <Annotate note="summarize down with a good header">
        <div className="grid grid-cols-2 items-start gap-16">
          <Frame
            variant="fill"
            label="Rotating images of people"
            detail="Cycles through photos of members while the copy stays put"
            className="aspect-square"
          />

          <div className="flex flex-col gap-12">
            <div>
              <Text
                as="h2"
                example="Young Muslims isn't a program you attend. It's a friend group you belong to."
              >
                Placeholder section header
              </Text>
              <Lorem paragraphs={1} className="mt-5" />
            </div>

            <div>
              <Text as="h3">Placeholder heading: what a NeighborNet is</Text>
              <Lorem paragraphs={1} className="mt-4" />
            </div>

            <div>
              <Text as="h3">
                Placeholder heading: service, relief work, advocacy
              </Text>
              <Lorem paragraphs={1} className="mt-4" />
            </div>
          </div>
        </div>
      </Annotate>
    </PageFrame>
  );
}
