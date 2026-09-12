import { cn } from "@/lib/utils";

import { NoteSlot } from "./note-slot";
import { StickyNote } from "./sticky-note";

/**
 * WIREFRAME: places a page section, and its sticky note if it has one.
 *
 * Two layouts:
 *
 * - **rail** (default) — the section sits in a centred column with the note in
 *   a fixed-width rail beside it. A note can never clip off the edge of the
 *   window, and toggling notes off leaves an empty rail rather than reflowing
 *   the page, so the client sees the same layout either way. Sections without a
 *   note still use this so every section shares one content width.
 * - **overlay** — the section runs the full width of the page and the note sits
 *   on top of it. For anything full-bleed, where giving up a 15rem rail would
 *   defeat the point.
 *
 * This is deliberately a *server* component. An earlier version read the notes
 * toggle directly, which made it a client component — and a client component's
 * props are serialised into the RSC payload whatever it decides to render, so
 * every note's text shipped inside the HTML of builds that had notes disabled.
 * Deciding here, on the server, means a build without notes never sends the
 * commentary at all. The toggle itself lives in <NoteSlot>, which only ever
 * receives an already-rendered note.
 *
 * WIREFRAME: desktop-only. Responsive later means collapsing the rail below
 * `lg` and stacking each note under the block it annotates.
 */

const NOTES_ENABLED =
  process.env.NEXT_PUBLIC_SHOW_NOTES === "true" ||
  process.env.NODE_ENV === "development";

/** The shared content width for railed sections. */
const CONTAINER = "mx-auto w-full max-w-[84rem] px-10";

export function Annotate({
  children,
  note,
  author,
  /** Where the note sits against a tall block. Rail layout only. */
  align = "start",
  /** Run full width with the note laid over the section instead of beside it. */
  overlay = false,
  className,
}: {
  children: React.ReactNode;
  note?: React.ReactNode;
  author?: string;
  align?: "start" | "center";
  overlay?: boolean;
  className?: string;
}) {
  // Once the wireframe is gone this component goes with it; until then, a build
  // with notes disabled pays for neither the rail nor the note text.
  if (!NOTES_ENABLED) {
    return (
      <div className={cn(!overlay && CONTAINER, className)}>{children}</div>
    );
  }

  if (overlay) {
    return (
      <div className={cn("relative w-full", className)}>
        {children}
        {note ? (
          <div className="pointer-events-none absolute top-10 right-10 z-10">
            <NoteSlot>
              <StickyNote author={author}>{note}</StickyNote>
            </NoteSlot>
          </div>
        ) : null}
      </div>
    );
  }

  return (
    <div className={cn(CONTAINER, className)}>
      <div
        className={cn(
          "grid grid-cols-[minmax(0,1fr)_15rem] gap-10",
          align === "center" ? "items-center" : "items-start",
        )}
      >
        <div className="min-w-0">{children}</div>
        <div>
          {note ? (
            <NoteSlot>
              <StickyNote author={author}>{note}</StickyNote>
            </NoteSlot>
          ) : null}
        </div>
      </div>
    </div>
  );
}
