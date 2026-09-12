import { cn } from "@/lib/utils";

/**
 * WIREFRAME: the outer container for a wireframe page.
 *
 * Prints the frame's name in the corner the way the Figma artboards do, so the
 * client can match what they are looking at to what they reviewed in Figma, and
 * sets the one content width every page shares.
 *
 * The width is sized so that a section's content column plus the 15rem sticky
 * note rail and the gap between them land at a comfortable desktop measure.
 * Changing it here changes every page at once.
 */
export function PageFrame({
  label,
  children,
  className,
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <main className={cn("mx-auto w-full max-w-[84rem] px-10 pb-24", className)}>
      <p className="py-8 text-xs font-medium tracking-[0.3em] text-muted-foreground uppercase">
        {label}
      </p>
      {children}
    </main>
  );
}
