import { cn } from "@/lib/utils";

import { NoteSlot } from "./note-slot";
import { StickyNote } from "./sticky-note";

/**
 * WIREFRAME: places a page section and its sticky notes.
 *
 * Notes sit in the whitespace *above* the section, right-aligned, rather than
 * on top of it. Two earlier versions were worse:
 *
 * - A fixed rail down the right-hand side. It took real space, so every section
 *   was narrowed to make room for commentary and the wireframe showed a layout
 *   that was never going to exist.
 * - Laid over the section's top-right corner. That fixed the layout problem and
 *   created a worse one: notes covered the components they were about, which on
 *   a dense block like the donation widget made it unreadable.
 *
 * Above-and-outside gets both: absolutely positioned, so it costs no layout, and
 * in the gap between sections, so it covers nothing. The cost is that annotated
 * sections need real headroom — `mt-28` or so — which is why the pages space
 * them out. `pointer-events-none` so a note can never swallow a click.
 *
 * Pass `notes` instead of `note` when one section needs two, as on Support,
 * where the row has a different point to make about each of its columns.
 *
 * `bleed` opts out of the shared content width, for full-width sections: the
 * landing hero, the store's split screen.
 *
 * This is deliberately a *server* component. An earlier version read the notes
 * toggle directly, which made it a client component — and a client component's
 * props are serialised into the RSC payload whatever it decides to render, so
 * every note's text shipped inside the HTML of builds that had notes disabled.
 * Deciding here, on the server, means a build without notes never sends the
 * commentary at all. The toggle itself lives in <NoteSlot>, which only ever
 * receives an already-rendered note.
 *
 * WIREFRAME: desktop-only. Responsive later means letting notes fall back into
 * the flow above the block they annotate.
 */

const NOTES_ENABLED =
  process.env.NEXT_PUBLIC_SHOW_NOTES === "true" ||
  process.env.NODE_ENV === "development";

/** The shared content width. */
const CONTAINER = "mx-auto w-full max-w-[80rem] px-10";

export function Annotate({
  children,
  note,
  notes,
  author,
  /** Run full width instead of inside the shared content column. */
  bleed = false,
  className,
}: {
  children: React.ReactNode;
  note?: React.ReactNode;
  notes?: React.ReactNode[];
  author?: string;
  bleed?: boolean;
  className?: string;
}) {
  const all = notes ?? (note ? [note] : []);

  // Once the wireframe is gone this component goes with it; until then, a build
  // with notes disabled pays for neither the wrapper nor the note text.
  if (!NOTES_ENABLED) {
    return <div className={cn(!bleed && CONTAINER, className)}>{children}</div>;
  }

  return (
    <div className={cn("relative", !bleed && CONTAINER, className)}>
      {all.length > 0 ? (
        <div
          className={cn(
            "pointer-events-none absolute bottom-full z-20 mb-3 flex items-end gap-3",
            bleed ? "right-10" : "right-10",
          )}
        >
          {all.map((entry, index) => (
            <NoteSlot key={index}>
              <StickyNote author={author}>{entry}</StickyNote>
            </NoteSlot>
          ))}
        </div>
      ) : null}
      {children}
    </div>
  );
}
