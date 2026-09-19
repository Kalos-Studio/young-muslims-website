import type { Metadata } from "next";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Design system",
  description: "Young Muslims website design tokens and component reference.",
  robots: { index: false, follow: false },
};

const brandColors = [
  {
    name: "Deep Obsidian",
    token: "brand-obsidian",
    value: "#171725",
    usage: "General dark foundation and text",
    swatch: "bg-brand-obsidian",
    ink: "text-brand-warm-snow",
  },
  {
    name: "Warm Snow",
    token: "brand-warm-snow",
    value: "#FCFAF8",
    usage: "General light foundation",
    swatch: "bg-brand-warm-snow",
    ink: "text-brand-obsidian",
  },
  {
    name: "Royal Blue",
    token: "brand-royal",
    value: "#234080",
    usage: "General and Brothers accent",
    swatch: "bg-brand-royal",
    ink: "text-brand-warm-snow",
  },
  {
    name: "Jade Foliage",
    token: "brand-jade",
    value: "#397451",
    usage: "General and Sisters accent",
    swatch: "bg-brand-jade",
    ink: "text-brand-warm-snow",
  },
] as const;

const brothersColors = [
  {
    name: "Midnight Blue",
    token: "brothers-midnight",
    value: "#16294F",
    swatch: "bg-brothers-midnight",
    ink: "text-brand-pure-white",
  },
  {
    name: "Cool Slate",
    token: "brothers-slate",
    value: "#99ADC8",
    swatch: "bg-brothers-slate",
    ink: "text-brothers-midnight",
  },
  {
    name: "Royal Blue",
    token: "brand-royal",
    value: "#234080",
    swatch: "bg-brand-royal",
    ink: "text-brand-pure-white",
  },
  {
    name: "Sky Blue",
    token: "brothers-sky",
    value: "#4A90D9",
    swatch: "bg-brothers-sky",
    ink: "text-brothers-midnight",
  },
  {
    name: "Pure White",
    token: "brand-pure-white",
    value: "#FFFFFF",
    swatch: "bg-brand-pure-white",
    ink: "text-brothers-midnight",
  },
] as const;

const sistersColors = [
  {
    name: "Deep Forest Green",
    token: "sisters-forest",
    value: "#043222",
    swatch: "bg-sisters-forest",
    ink: "text-brand-pure-white",
  },
  {
    name: "Warm Brass",
    token: "sisters-brass",
    value: "#D8AA45",
    swatch: "bg-sisters-brass",
    ink: "text-sisters-forest",
  },
  {
    name: "Jade Foliage",
    token: "brand-jade",
    value: "#397451",
    swatch: "bg-brand-jade",
    ink: "text-brand-pure-white",
  },
  {
    name: "Buttercup Yellow",
    token: "sisters-buttercup",
    value: "#EBD255",
    swatch: "bg-sisters-buttercup",
    ink: "text-sisters-forest",
  },
  {
    name: "Pure White",
    token: "brand-pure-white",
    value: "#FFFFFF",
    swatch: "bg-brand-pure-white",
    ink: "text-sisters-forest",
  },
] as const;

const landingColors = [
  {
    name: "Landing Cyan",
    token: "landing-cyan",
    value: "#23B8C0",
    usage: "Highlighted words on the homepage",
    swatch: "bg-landing-cyan",
    ink: "text-brand-obsidian",
  },
  {
    name: "Landing Blush",
    token: "landing-blush",
    value: "#E3D6D6",
    usage: "Homepage story-card surfaces",
    swatch: "bg-landing-blush",
    ink: "text-brand-obsidian",
  },
] as const;

const typeScale = [
  {
    name: "Display",
    token: "text-display font-display",
    sample: "For the youth, by the youth.",
    className: "font-display text-display",
  },
  {
    name: "Heading 1",
    token: "text-h1 font-display",
    sample: "A nationwide community",
    className: "font-display text-h1 font-normal",
  },
  {
    name: "Heading 2",
    token: "text-h2 font-heading",
    sample: "Built on real friendship",
    className: "font-heading text-h2 font-bold",
  },
  {
    name: "Heading 3",
    token: "text-h3 font-heading",
    sample: "Find your NeighborNet",
    className: "font-heading text-h3 font-semibold",
  },
  {
    name: "Heading 4",
    token: "text-h4 font-heading",
    sample: "Showing up for one another",
    className: "font-heading text-h4 font-semibold",
  },
] as const;

function SectionHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <div className="grid gap-5 border-t border-border pt-8 md:grid-cols-[14rem_1fr]">
      <p className="text-sm font-semibold text-muted-foreground">{eyebrow}</p>
      <div className="max-w-3xl">
        <h2 className="text-h2 font-bold">{title}</h2>
        <p className="mt-4 max-w-2xl leading-7 text-muted-foreground">
          {description}
        </p>
      </div>
    </div>
  );
}

function ColorCard({
  color,
  className,
}: {
  color: {
    name: string;
    token: string;
    value: string;
    usage?: string;
    swatch: string;
    ink: string;
  };
  className?: string;
}) {
  return (
    <article
      className={cn(
        "flex min-h-72 flex-col justify-between border border-border p-6",
        color.swatch,
        color.ink,
        className,
      )}
    >
      <div>
        <h3 className="text-h4 font-bold">{color.name}</h3>
        {color.usage ? (
          <p className="mt-2 max-w-48 text-sm opacity-75">{color.usage}</p>
        ) : null}
      </div>
      <div className="font-mono text-xs">
        <p>{color.value}</p>
        <p className="mt-1 opacity-75">{color.token}</p>
      </div>
    </article>
  );
}

export default function DesignSystemPage() {
  return (
    <main>
      <section className="grid min-h-[44rem] grid-cols-1 lg:grid-cols-2">
        <div className="flex flex-col justify-between bg-brand-obsidian p-10 text-brand-warm-snow md:p-16">
          <p className="text-sm font-semibold">Young Muslims</p>
          <div className="max-w-3xl py-24">
            <h1 className="font-display text-display">Website design system</h1>
            <p className="mt-8 max-w-xl text-lg leading-8 text-brand-warm-snow/70">
              The production reference for brand color, typography, semantic
              tokens, and shared interface states.
            </p>
          </div>
          <p className="text-sm text-brand-warm-snow/60">
            Figma brand kit translated into Tailwind CSS 4
          </p>
        </div>

        <div className="grid min-h-96 grid-cols-2">
          <div className="bg-brand-royal" />
          <div className="bg-brand-jade" />
          <div className="bg-brand-warm-snow" />
          <div className="bg-brand-obsidian" />
        </div>
      </section>

      <div className="mx-auto max-w-[90rem] space-y-32 px-10 py-32">
        <section>
          <SectionHeading
            eyebrow="01 / Color foundations"
            title="One shared identity, with room for both sides"
            description="Warm Snow and Deep Obsidian form the general foundation. Royal Blue and Jade Foliage connect the Brothers and Sisters identities to the whole organization."
          />

          <div className="mt-16 grid md:grid-cols-2 lg:grid-cols-4">
            {brandColors.map((color) => (
              <ColorCard key={color.token} color={color} />
            ))}
          </div>

          <div className="mt-16 grid gap-12 xl:grid-cols-2">
            <div>
              <div className="mb-5 flex items-end justify-between gap-4">
                <h3 className="text-h3 font-semibold">Brothers palette</h3>
                <p className="text-sm text-muted-foreground">
                  Dark colors may carry text
                </p>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-5">
                {brothersColors.map((color) => (
                  <ColorCard
                    key={color.token}
                    color={color}
                    className="min-h-56 p-4"
                  />
                ))}
              </div>
            </div>

            <div>
              <div className="mb-5 flex items-end justify-between gap-4">
                <h3 className="text-h3 font-semibold">Sisters palette</h3>
                <p className="text-sm text-muted-foreground">
                  Bright colors are fills and accents
                </p>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-5">
                {sistersColors.map((color) => (
                  <ColorCard
                    key={color.token}
                    color={color}
                    className="min-h-56 p-4"
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="mt-16">
            <div className="mb-5 flex items-end justify-between gap-4">
              <h3 className="text-h3 font-semibold">Landing-page accents</h3>
              <p className="text-sm text-muted-foreground">
                Exact values from the approved website frame
              </p>
            </div>
            <div className="grid max-w-2xl grid-cols-2">
              {landingColors.map((color) => (
                <ColorCard
                  key={color.token}
                  color={color}
                  className="min-h-56"
                />
              ))}
            </div>
          </div>
        </section>

        <section>
          <SectionHeading
            eyebrow="02 / Semantic tokens"
            title="Components speak in roles, not raw colors"
            description="Most product UI should use semantic names. Brand primitives are reserved for prescribed identity treatments and deliberate art direction."
          />

          <div className="mt-16 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            <div className="flex min-h-56 flex-col justify-between border border-border bg-background p-6 text-foreground">
              <p className="text-h4 font-bold">Background</p>
              <p className="font-mono text-xs">bg-background</p>
            </div>
            <div className="flex min-h-56 flex-col justify-between bg-primary p-6 text-primary-foreground">
              <p className="text-h4 font-bold">Primary</p>
              <p className="font-mono text-xs">bg-primary</p>
            </div>
            <div className="flex min-h-56 flex-col justify-between bg-secondary p-6 text-secondary-foreground">
              <p className="text-h4 font-bold">Secondary</p>
              <p className="font-mono text-xs">bg-secondary</p>
            </div>
            <div className="flex min-h-56 flex-col justify-between bg-accent p-6 text-accent-foreground">
              <p className="text-h4 font-bold">Accent</p>
              <p className="font-mono text-xs">bg-accent</p>
            </div>
            <div className="flex min-h-40 flex-col justify-between bg-muted p-6 text-muted-foreground">
              <p className="text-h4 font-bold">Muted</p>
              <p className="font-mono text-xs">bg-muted</p>
            </div>
            <div className="flex min-h-40 flex-col justify-between bg-destructive p-6 text-destructive-foreground">
              <p className="text-h4 font-bold">Destructive</p>
              <p className="font-mono text-xs">bg-destructive</p>
            </div>
            <div className="flex min-h-40 flex-col justify-between border-4 border-ring bg-background p-6 text-foreground">
              <p className="text-h4 font-bold">Focus ring</p>
              <p className="font-mono text-xs">border-ring</p>
            </div>
            <div className="flex min-h-40 flex-col justify-between border border-border bg-card p-6 text-card-foreground">
              <p className="text-h4 font-bold">Border</p>
              <p className="font-mono text-xs">border-border</p>
            </div>
          </div>
        </section>

        <section>
          <SectionHeading
            eyebrow="03 / Typography"
            title="Boldonse makes the statement. Figtree does the work."
            description="The display face is reserved for high-impact moments. Figtree handles supporting headings, body copy, navigation, labels, and interface controls."
          />

          <div className="mt-16 divide-y divide-border border-y border-border">
            {typeScale.map((type) => (
              <div
                key={type.name}
                className="grid gap-8 py-10 md:grid-cols-[14rem_1fr] md:items-baseline"
              >
                <div>
                  <p className="font-semibold">{type.name}</p>
                  <p className="mt-2 font-mono text-xs text-muted-foreground">
                    {type.token}
                  </p>
                </div>
                <p className={type.className}>{type.sample}</p>
              </div>
            ))}

            <div className="grid gap-8 py-10 md:grid-cols-[14rem_1fr] md:items-start">
              <div>
                <p className="font-semibold">Body</p>
                <p className="mt-2 font-mono text-xs text-muted-foreground">
                  text-base font-sans font-medium
                </p>
              </div>
              <div className="max-w-2xl space-y-5 text-base leading-7 font-medium">
                <p>
                  Young Muslims is a nationwide network built through ordinary,
                  consistent friendship. Members meet locally, grow together,
                  and turn those relationships into service for their
                  communities.
                </p>
                <p className="text-sm text-muted-foreground">
                  Supporting text uses the same typeface at a smaller size and
                  lower visual emphasis.
                </p>
              </div>
            </div>
          </div>

          <p className="mt-5 text-sm text-muted-foreground">
            The font families are approved. The responsive size scale remains
            provisional until the website designs define mobile and desktop
            behavior.
          </p>
        </section>

        <section>
          <SectionHeading
            eyebrow="04 / Components"
            title="Shared controls inherit the same decisions"
            description="These are the current shared button variants. This surface makes token changes and interaction states visible before they spread across the site."
          />

          <div className="mt-16 grid gap-10 border border-border bg-card p-8 md:p-12">
            <div>
              <p className="mb-5 text-sm font-semibold text-muted-foreground">
                Variants
              </p>
              <div className="flex flex-wrap gap-4">
                <Button>Primary action</Button>
                <Button variant="secondary">Secondary action</Button>
                <Button variant="outline">Outline action</Button>
                <Button variant="ghost">Ghost action</Button>
                <Button variant="destructive">Destructive action</Button>
                <Button variant="link">Text link</Button>
              </div>
            </div>

            <div>
              <p className="mb-5 text-sm font-semibold text-muted-foreground">
                Sizes and states
              </p>
              <div className="flex flex-wrap items-center gap-4">
                <Button size="xs">Extra small</Button>
                <Button size="sm">Small</Button>
                <Button>Default</Button>
                <Button size="lg">Large</Button>
                <Button disabled>Disabled</Button>
              </div>
            </div>
          </div>
        </section>

        <section>
          <SectionHeading
            eyebrow="05 / Usage rules"
            title="Constraints make the system useful"
            description="The design system reduces guesswork only when production work consistently uses it."
          />

          <ol className="mt-16 grid gap-px bg-border md:grid-cols-2">
            {[
              "Use semantic tokens before reaching for a brand primitive.",
              "Do not add raw hex colors inside page or component classes.",
              "Reserve Boldonse for expressive, primary display headlines.",
              "Do not create new heading sizes without updating the shared scale.",
              "Keep Brothers and Sisters accents within their approved contexts.",
              "Treat focus, errors, borders, and disabled states as functional UI.",
            ].map((rule, index) => (
              <li key={rule} className="flex gap-5 bg-background p-8">
                <span className="font-mono text-sm text-muted-foreground">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <p className="max-w-md font-medium">{rule}</p>
              </li>
            ))}
          </ol>
        </section>
      </div>
    </main>
  );
}
