import { cn } from "@/lib/utils";

/**
 * WIREFRAME: one of Omar's sticky notes.
 *
 * Carries the reasoning behind a decision so the client can read the thinking
 * next to the thing it explains, the way they would in the Figma file. Yellow
 * is the only colour in the prototype, which is what makes a note read as
 * commentary sitting on top of the wireframe rather than as part of the design.
 *
 * Presentation only — whether a note renders at all is decided by <Annotate />.
 */
export function StickyNote({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <aside
      className={cn(
        "w-52 rotate-[-1.2deg] border border-wf-note-edge bg-wf-note px-4 py-3 shadow-[0_2px_10px_rgba(0,0,0,0.12)]",
        className,
      )}
    >
      <p className="text-sm leading-snug font-medium text-wf-note-ink">
        {children}
      </p>
    </aside>
  );
}
