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
    <PageFrame className="bg-brand-warm-snow pt-16 pb-20 text-brand-obsidian">
      <Annotate>
        <div className="grid grid-cols-2 gap-8">
          <div className="rounded-card bg-brand-royal p-8 text-brand-pure-white">
            <Text as="h2" tone="dark">
              Our mission
            </Text>
            <Lorem paragraphs={2} tone="dark" className="mt-6" />
          </div>
          <div className="rounded-card bg-brand-jade p-8 text-brand-pure-white">
            <Text as="h2" tone="dark">
              Our vision
            </Text>
            <Lorem paragraphs={2} tone="dark" className="mt-6" />
          </div>
        </div>
      </Annotate>

      <Annotate
        className="mt-20"
        note="on scroll, the image swaps to match the event type in view: conferences show a conference photo, retreats show a retreat photo, etc."
        placement="top-right"
      >
        <Text as="h2" className="text-brand-jade">
          Conferences and retreats
        </Text>
        <div className="mt-8 flex flex-col divide-y divide-brand-obsidian/10">
          <div className="grid grid-cols-2 items-start gap-8 py-16">
            <Frame
              variant="fill"
              label="Event image: conferences"
              className="aspect-video rounded-media bg-brothers-slate text-brothers-midnight"
            />
            <div className="rounded-card bg-muted p-8">
              <Text as="h3" className="text-brand-royal">
                Conferences
              </Text>
              <Lorem paragraphs={2} className="mt-4" />
            </div>
          </div>
          <div className="grid grid-cols-2 items-start gap-8 py-16">
            <Frame
              variant="fill"
              label="Event image: retreats"
              className="aspect-video rounded-media bg-sisters-brass text-sisters-forest"
            />
            <div className="rounded-card bg-muted p-8">
              <Text as="h3" className="text-brand-jade">
                Retreats
              </Text>
              <Lorem paragraphs={2} className="mt-4" />
            </div>
          </div>
          <div className="grid grid-cols-2 items-start gap-8 py-16">
            <Frame
              variant="fill"
              label="Event image: events"
              className="aspect-video rounded-media bg-landing-blush text-brand-obsidian"
            />
            <div className="rounded-card bg-muted p-8">
              <Text as="h3" className="text-brand-royal">
                Events
              </Text>
              <Lorem paragraphs={2} className="mt-4" />
            </div>
          </div>
        </div>
      </Annotate>

      <Annotate className="mt-20">
        <div className="rounded-card bg-brand-obsidian p-8 text-brand-pure-white">
          <Text as="h2" tone="dark">
            Leadership
          </Text>
          <div className="mt-8 grid grid-cols-2 divide-x divide-brand-pure-white/20">
            <div>
              <Text as="h3" tone="dark">
                Brothers
              </Text>
              <div className="mt-6 grid grid-cols-4 gap-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div
                    key={i}
                    className="flex size-20 items-center justify-center rounded-full bg-brothers-slate text-brothers-midnight"
                  >
                    <PersonOutline className="size-12" />
                  </div>
                ))}
              </div>
            </div>
            <div className="pl-8">
              <Text as="h3" tone="dark">
                Sisters
              </Text>
              <div className="mt-6 grid grid-cols-4 gap-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div
                    key={i}
                    className="flex size-20 items-center justify-center rounded-full bg-sisters-brass text-sisters-forest"
                  >
                    <PersonOutline className="size-12" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Annotate>

      <Annotate className="mt-20">
        <Text as="h2" className="text-brand-royal">
          FAQ
        </Text>
        <div className="mt-8 grid grid-cols-2 gap-8">
          <div className="rounded-card bg-muted p-8">
            <Text as="h3" className="text-brand-jade">
              For Youth
            </Text>
            <ul className="mt-6 divide-y divide-border border-t border-border">
              {Array.from({ length: 5 }).map((_, i) => (
                <li key={i} className="flex items-center justify-between py-4">
                  <span className="text-body text-muted-foreground">
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
          <div className="rounded-card bg-muted p-8">
            <Text as="h3" className="text-brand-jade">
              For Parents
            </Text>
            <ul className="mt-6 divide-y divide-border border-t border-border">
              {Array.from({ length: 5 }).map((_, i) => (
                <li key={i} className="flex items-center justify-between py-4">
                  <span className="text-body text-muted-foreground">
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
