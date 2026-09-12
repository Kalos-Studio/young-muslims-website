import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

/**
 * WIREFRAME: the placeholder rectangle. The only placeholder primitive there
 * is — every slot on every wireframe page is one of these.
 *
 * A rectangle with a plain-language description of what will live there. Two
 * earlier versions of this were worse and are worth not going back to:
 *
 * - A second primitive that drew grey bars at the weight of the eventual
 *   headline. It read as noise rather than as a placeholder.
 * - Labels set in letterspaced capitals. Nothing on this site is going to be
 *   set that way, so it made the wireframe look like a design decision instead
 *   of a description of one.
 *
 * So: normal sentences, sentence case, inside a box. Where a real example helps
 * the client picture the slot, put it in `detail` in quotes.
 *
 * Building a real page means deleting a <Frame> and putting the actual thing in
 * its place, which is a local, obvious edit.
 */

const frameVariants = cva(
  "flex items-center justify-center text-center select-none",
  {
    variants: {
      variant: {
        /** Hairline box on white. Structural regions and generic slots. */
        outline: "border border-wf-rule bg-background text-muted-foreground",
        /** Near-black block. Video and hero slots, per the Figma frames. */
        fill: "bg-wf-fill text-background",
        /** Mid-grey block. Image and story slots. */
        muted: "bg-wf-fill-muted text-background",
      },
    },
    defaultVariants: {
      variant: "outline",
    },
  },
);

type FrameProps = VariantProps<typeof frameVariants> & {
  /** What goes here eventually, in plain words. */
  label: string;
  /** A second line: an example of the real thing, or detail the label can't carry. */
  detail?: string;
  className?: string;
  children?: React.ReactNode;
};

export function Frame({
  variant,
  label,
  detail,
  className,
  children,
}: FrameProps) {
  return (
    <div className={cn(frameVariants({ variant }), className)}>
      {children ?? (
        <div className="max-w-lg px-6 py-4">
          <p className="text-sm font-medium">{label}</p>
          {detail ? <p className="mt-2 text-sm opacity-70">{detail}</p> : null}
        </div>
      )}
    </div>
  );
}
