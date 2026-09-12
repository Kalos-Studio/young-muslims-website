import { cn } from "@/lib/utils";

import { NoteSlot } from "./note-slot";
import { StickyNote } from "./sticky-note";

/**
 * WIREFRAME: lays a page section out beside its sticky note.
 *
 * The note sits in a fixed-width rail to the right of the content rather than
 * absolutely positioned over it. Two reasons: a note can never clip off the
 * edge of the window, and toggling notes off leaves an empty rail instead of
 * reflowing the page, so the client sees the same layout either way.
 *
 * Sections without a note still use <Annotate> so every section shares one
 * content width down the page.
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

export function Annotate({
  children,
  note,
  author,
  /** Where the note sits against a tall block. */
  align = "start",
  className,
}: {
  children: React.ReactNode;
  note?: React.ReactNode;
  author?: string;
  align?: "start" | "center";
  className?: string;
}) {
  // Once the wireframe is gone this component goes with it; until then, a build
  // with notes disabled pays for neither the rail nor the note text.
  if (!NOTES_ENABLED) {
    return <div className={className}>{children}</div>;
  }

  return (
    <div
      className={cn(
        "grid grid-cols-[minmax(0,1fr)_15rem] gap-10",
        align === "center" ? "items-center" : "items-start",
        className,
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
  );
}
