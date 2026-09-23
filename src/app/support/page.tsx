import type { Metadata } from "next";

// WIREFRAME: this whole page is scaffolding. See WIREFRAME.md.
import { cn } from "@/lib/utils";
import { Annotate } from "@/components/wireframe/annotate";
import { Frame } from "@/components/wireframe/frame";
import { Lorem, Text } from "@/components/wireframe/text";
import { PageFrame } from "@/components/wireframe/page-frame";
import { PersonOutline } from "@/components/wireframe/person-outline";

export const metadata: Metadata = {
  title: "Support",
  description: "Give to the work, and see where it goes.",
};

const amounts = ["$40", "$100", "$200", "$1,000", "$2,500", "$5,000"];

/**
 * WIREFRAME: the donation widget.
 *
 * Drawn out rather than left as a labelled box because its height and density
 * drive the whole row beside it — the image next to it has to be roughly this
 * tall, and that is only obvious once the controls are on the page.
 *
 * This will be a Fundraise Up embed, so none of this markup survives; we do not
 * control the internals, only the column it sits in.
 */
function DonationWidget() {
  return (
    <div className="flex flex-col gap-4 rounded-card border border-border bg-brand-pure-white p-8">
      <p className="text-body text-muted-foreground">
        Fundraise Up embed. We control the column, not the internals
      </p>

      <div className="grid grid-cols-2 gap-2">
        <div className="rounded-pill bg-brand-royal px-6 py-4 text-center text-nav font-bold text-brand-pure-white">
          One time
        </div>
        <div className="rounded-pill border border-border px-6 py-4 text-center text-nav font-bold text-muted-foreground">
          Monthly
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2">
        {amounts.map((amount, index) => (
          <div
            key={amount}
            className={cn(
              "rounded-media border px-4 py-4 text-center text-nav",
              index === 0
                ? "border-brand-royal font-bold text-brand-royal"
                : "border-border text-muted-foreground",
            )}
          >
            {amount}
          </div>
        ))}
      </div>

      <div className="rounded-media border border-border px-4 py-4 text-body text-muted-foreground">
        Custom amount
      </div>

      <div className="flex items-center gap-2 text-body text-muted-foreground">
        <span className="size-4 shrink-0 rounded-sm border border-border" />
        Dedicate this donation
      </div>
      <p className="text-body text-brand-royal underline">Add comment</p>

      <div className="rounded-pill bg-brand-royal px-6 py-4 text-center text-nav font-bold text-brand-pure-white">
        Donate and support
      </div>
    </div>
  );
}

/**
 * WIREFRAME: the recent supporters list. Names are anonymised per Omar's note —
 * that is a real decision about what this component may display, not a
 * placeholder, so it is worth showing in the shape it will actually take.
 */
function RecentSupporters() {
  const supporters = [
    { place: "Texas", amount: "$40", when: "4 hours ago" },
    { place: "New Jersey", amount: "$17", when: "5 hours ago" },
    { place: "Illinois", amount: "$125", when: "6 hours ago" },
    { place: "California", amount: "$25", when: "8 hours ago" },
    { place: "Georgia", amount: "$60", when: "9 hours ago" },
    { place: "New York", amount: "$10", when: "12 hours ago" },
  ];

  return (
    <div className="flex flex-col overflow-hidden rounded-card border border-border bg-brand-pure-white">
      <div className="flex flex-col gap-4 border-b border-border p-8">
        <p className="text-body font-medium">Your share could raise over $77</p>
        <div className="rounded-pill bg-brand-jade px-6 py-4 text-center text-nav font-bold text-brand-pure-white">
          Share
        </div>
      </div>

      <div className="flex flex-col gap-4 p-8">
        <p className="text-body font-medium">Recent supporters</p>
        {supporters.map((supporter) => (
          <div key={supporter.place} className="flex items-center gap-3">
            <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-landing-blush text-brand-jade">
              <PersonOutline className="h-1/2 w-1/2" />
            </span>
            <span className="flex flex-col">
              <span className="text-body">
                An anonymous supporter from {supporter.place}
              </span>
              <span className="text-xs text-muted-foreground">
                {supporter.amount}, {supporter.when}
              </span>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function SupportPage() {
  return (
    <PageFrame className="bg-brand-warm-snow pt-16 pb-20 text-brand-obsidian">
      <Annotate>
        <Text as="h1" className="text-brand-royal">
          Placeholder YM mission heading
        </Text>
        <Lorem paragraphs={2} className="mt-5 max-w-3xl" />
      </Annotate>

      <Annotate className="mt-16">
        <div className="grid grid-cols-3 items-stretch gap-4">
          <Frame
            variant="muted"
            label="Full-bleed image"
            className="col-span-2 rounded-card bg-brothers-slate text-brothers-midnight"
          />
          <DonationWidget />
        </div>
      </Annotate>

      {/* The left column is not a profile of one person — it is the argument
          for giving, which is a different job and a different shape. Two notes
          because the row makes a different point in each column. */}
      <Annotate className="mt-16">
        <div className="grid grid-cols-3 items-stretch gap-4">
          {/* A note per column, each sitting on the column it is about. */}
          <Annotate
            bleed
            className="col-span-2"
            placement="bottom-right"
            note="include something about advocacy"
          >
            <div className="flex h-full flex-col justify-center rounded-card bg-landing-blush px-16 py-16">
              <Text as="h2" className="text-brand-jade">
                Placeholder heading: the case for giving
              </Text>
              <Lorem paragraphs={2} className="mt-5" />
            </div>
          </Annotate>

          <Annotate
            bleed
            placement="top-right"
            note="anonymize supporter names, e.g. “an anonymous person from X state”"
          >
            <RecentSupporters />
          </Annotate>
        </div>
      </Annotate>

      <Annotate className="mt-8">
        <Text as="h2" className="text-brand-royal">
          Where Your Support Goes
        </Text>
        <div className="mt-8 grid grid-cols-3 gap-6">
          <div>
            <Frame
              variant="muted"
              label="Advocacy"
              className="aspect-video w-full rounded-media bg-brothers-slate text-brothers-midnight"
            />
            <Lorem paragraphs={1} className="mt-3" />
          </div>
          <div>
            <Frame
              variant="muted"
              label="Community Work"
              className="aspect-video w-full rounded-media bg-sisters-brass text-sisters-forest"
            />
            <Lorem paragraphs={1} className="mt-3" />
          </div>
          <div>
            <Frame
              variant="muted"
              label="Dawah"
              className="aspect-video w-full rounded-media bg-brand-jade text-brand-pure-white"
            />
            <Lorem paragraphs={1} className="mt-3" />
          </div>
        </div>
      </Annotate>
    </PageFrame>
  );
}
