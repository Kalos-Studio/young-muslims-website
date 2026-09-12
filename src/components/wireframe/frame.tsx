import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

/**
 * WIREFRAME: the core placeholder rectangle.
 *
 * Every slot on a wireframe page is one of these: a rectangle with a caption
 * saying what will eventually live there. The caption is a description of the
 * slot ("HIGHLIGHT REEL VIDEO"), never sample content — the whole point is that
 * the client reads structure and does not get distracted arguing with copy that
 * was never meant to be real.
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
  /** What goes here eventually. Shown centred, in small caps. */
  label: string;
  /** A second line for detail the label alone cannot carry. */
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
        <div className="px-6 py-4">
          <p className="text-xs font-medium tracking-[0.18em] uppercase">
            {label}
          </p>
          {detail ? (
            <p className="mt-2 text-xs tracking-normal normal-case opacity-70">
              {detail}
            </p>
          ) : null}
        </div>
      )}
    </div>
  );
}
