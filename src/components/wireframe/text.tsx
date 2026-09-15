import { cn } from "@/lib/utils";

/**
 * WIREFRAME: text placeholders that are actually set as text.
 *
 * A box labelled "tagline" tells you something belongs there. It does not tell
 * you how much room it takes, whether it out-shouts the thing under it, or
 * where the eye lands first — and those are the questions a wireframe is
 * supposed to answer. So copy slots are real type at real sizes, with the
 * placeholder wording in brackets so nobody mistakes it for a draft:
 *
 *     [Placeholder tagline / intro text]
 *     e.g. "Built on brotherhood, sisterhood, and Deen."
 *
 * Boxes are still right for images, video and embeds. They are wrong for words.
 *
 * WIREFRAME: the scale below is provisional and lives here so it goes away with
 * the wireframe. When branding lands, the real scale belongs in the `@theme`
 * block of globals.css, and this file gets deleted rather than promoted.
 */

const levels = {
  h1: "text-6xl leading-[1.05] font-semibold tracking-tight",
  h2: "text-4xl leading-[1.15] font-semibold tracking-tight",
  h3: "text-2xl leading-snug font-medium",
  body: "text-base leading-relaxed",
} as const;

const tags = {
  h1: "h1",
  h2: "h2",
  h3: "h3",
  body: "p",
} as const;

type TextProps = {
  /** Which step of the scale, and which element gets rendered. */
  as?: keyof typeof levels;
  /** The placeholder wording. Rendered in brackets. */
  children: React.ReactNode;
  /** An example of the real thing, shown underneath in small type. */
  example?: string;
  /** `dark` for copy sitting on a filled block. */
  tone?: "light" | "dark";
  className?: string;
};

export function Text({
  as = "body",
  children,
  example,
  tone = "light",
  className,
}: TextProps) {
  const Tag = tags[as] as React.ElementType;
  const onDark = tone === "dark";

  return (
    <div className={className}>
      <Tag className={cn(levels[as], onDark && "text-background")}>
        [{children}]
      </Tag>
      {example ? (
        <p
          className={cn(
            "mt-2 text-sm",
            onDark ? "text-background/60" : "text-muted-foreground",
          )}
        >
          e.g. “{example}”
        </p>
      ) : null}
    </div>
  );
}

/**
 * WIREFRAME: filler body copy, for the places where the only thing that matters
 * is how much room a few paragraphs take up. Latin rather than plausible
 * English, so nobody starts editing it.
 */
const LOREM = [
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
  "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
  "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.",
];

export function Lorem({
  paragraphs = 2,
  tone = "light",
  className,
}: {
  paragraphs?: number;
  tone?: "light" | "dark";
  className?: string;
}) {
  const onDark = tone === "dark";

  return (
    <div className={cn("flex flex-col gap-4", className)}>
      {LOREM.slice(0, paragraphs).map((paragraph) => (
        <p
          key={paragraph}
          className={cn(
            levels.body,
            onDark ? "text-background/80" : "text-muted-foreground",
          )}
        >
          {paragraph}
        </p>
      ))}
    </div>
  );
}
