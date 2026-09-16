import type { Metadata } from "next";

// WIREFRAME: this whole page is scaffolding. See WIREFRAME.md.
import { Annotate } from "@/components/wireframe/annotate";
import { Frame } from "@/components/wireframe/frame";
import { PageFrame } from "@/components/wireframe/page-frame";
import { Lorem, Text } from "@/components/wireframe/text";
import { PersonOutline } from "@/components/wireframe/person-outline";

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

      <Annotate className="mt-24">
        <Text as="h2">Leadership</Text>
        <div className="mt-8 grid grid-cols-[1fr_1px_1fr] gap-x-12">
          <div>
            <Text as="h3">Brothers</Text>
            <div className="mt-6 grid grid-cols-4 gap-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="h-[90px] text-muted-foreground">
                  <PersonOutline />
                </div>
              ))}
            </div>
          </div>
          <div className="bg-border" />
          <div>
            <Text as="h3">Sisters</Text>
            <div className="mt-6 grid grid-cols-4 gap-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="h-[90px] text-muted-foreground">
                  <PersonOutline />
                </div>
              ))}
            </div>
          </div>
        </div>
      </Annotate>

      <Annotate className="mt-24">
        <Text as="h2">FAQ</Text>
        <div className="mt-10 grid grid-cols-2 gap-12">
          <div>
            <Text as="h3">For Members</Text>
            <ul className="mt-6 divide-y divide-border border-t border-border">
              {Array.from({ length: 5 }).map((_, i) => (
                <li key={i} className="flex items-center justify-between py-4">
                  <span className="text-sm text-muted-foreground">
                    Question
                  </span>
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="shrink-0 text-muted-foreground"
                    aria-hidden
                  >
                    <path d="M4 6l4 4 4-4" />
                  </svg>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <Text as="h3">For Parents</Text>
            <ul className="mt-6 divide-y divide-border border-t border-border">
              {Array.from({ length: 5 }).map((_, i) => (
                <li key={i} className="flex items-center justify-between py-4">
                  <span className="text-sm text-muted-foreground">
                    Question
                  </span>
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="shrink-0 text-muted-foreground"
                    aria-hidden
                  >
                    <path d="M4 6l4 4 4-4" />
                  </svg>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Annotate>
    </PageFrame>
  );
}
