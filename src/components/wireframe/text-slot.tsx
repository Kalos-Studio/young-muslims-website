import { cn } from "@/lib/utils";

/**
 * WIREFRAME: a stand-in for a block of type.
 *
 * Renders a label naming the slot plus grey bars at the weight the real type
 * will be, so the page reads as a hierarchy without anyone having to write
 * copy. Deliberately not lorem ipsum: fake sentences invite the client to
 * respond to the words instead of the structure.
 */

const barHeight = {
  h1: "h-11",
  h2: "h-7",
  body: "h-3",
} as const;

const barGap = {
  h1: "gap-3",
  h2: "gap-2.5",
  body: "gap-2",
} as const;

type TextSlotProps = {
  /** Names the slot, e.g. "H1" or "Intro paragraph". */
  label: string;
  /** Visual weight of the bars. */
  size?: keyof typeof barHeight;
  /** How many lines of type this slot is expected to run to. */
  lines?: number;
  align?: "start" | "center";
  /** `dark` for slots sitting on a filled block, where the bars must invert. */
  tone?: "light" | "dark";
  className?: string;
};

export function TextSlot({
  label,
  size = "body",
  lines = 2,
  align = "start",
  tone = "light",
  className,
}: TextSlotProps) {
  const isCentered = align === "center";
  const onDark = tone === "dark";

  return (
    <div
      className={cn(
        "flex flex-col",
        barGap[size],
        isCentered && "items-center",
        className,
      )}
    >
      <p
        className={cn(
          "text-[0.625rem] font-medium tracking-[0.18em] uppercase",
          onDark ? "text-background/70" : "text-muted-foreground",
          isCentered && "text-center",
        )}
      >
        {label} · {lines} {lines === 1 ? "line" : "lines"}
      </p>
      <div className={cn("flex w-full flex-col", barGap[size])}>
        {Array.from({ length: lines }, (_, index) => (
          <div
            key={index}
            className={cn(
              "w-full rounded-xs",
              onDark ? "bg-background/80" : "bg-wf-rule",
              barHeight[size],
              // Ragging the last line keeps the block from reading as a solid
              // rectangle, which is what a paragraph actually looks like.
              index === lines - 1 && lines > 1 && "w-3/5",
              index === lines - 1 && lines > 1 && isCentered && "self-center",
            )}
          />
        ))}
      </div>
    </div>
  );
}
