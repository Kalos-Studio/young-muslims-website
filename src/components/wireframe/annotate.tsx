import { cn } from "@/lib/utils";

import { NoteSlot } from "./note-slot";
import { StickyNote } from "./sticky-note";

/**
 * WIREFRAME: places a page section, and lays its sticky note over it.
 *
 * Notes are absolutely positioned, so they take up no space in the layout and
 * the page reads at the width it will really be. An earlier version gave them a
 * fixed 15rem rail down the right-hand side, which meant every section was
 * narrowed to make room for commentary — the wireframe was showing a layout
 * that was never going to exist. Notes now behave like sticky notes on a Figma
 * artboard: they sit on top, and turning them off changes nothing underneath.
 *
 * `pointer-events-none` so a note can never swallow a click meant for the thing
 * it is annotating.
 *
 * `bleed` opts a section out of the shared content width, for anything
 * full-width: the landing hero, the store's split screen.
 *
 * This is deliberately a *server* component. An earlier version read the notes
 * toggle directly, which made it a client component — and a client component's
 * props are serialised into the RSC payload whatever it decides to render, so
 * every note's text shipped inside the HTML of builds that had notes disabled.
 * Deciding here, on the server, means a build without notes never sends the
 * commentary at all. The toggle itself lives in <NoteSlot>, which only ever
 * receives an already-rendered note.
 *
 * WIREFRAME: desktop-only. Responsive later means letting notes stack under the
 * block they annotate instead of sitting over its corner.
 */

const NOTES_ENABLED =
  process.env.NEXT_PUBLIC_SHOW_NOTES === "true" ||
  process.env.NODE_ENV === "development";

/** The shared content width. */
const CONTAINER = "mx-auto w-full max-w-[80rem] px-10";

export function Annotate({
  children,
  note,
  author,
  /** Run full width instead of inside the shared content column. */
  bleed = false,
  className,
}: {
  children: React.ReactNode;
  note?: React.ReactNode;
  author?: string;
  bleed?: boolean;
  className?: string;
}) {
  // Once the wireframe is gone this component goes with it; until then, a build
  // with notes disabled pays for neither the wrapper nor the note text.
  if (!NOTES_ENABLED) {
    return <div className={cn(!bleed && CONTAINER, className)}>{children}</div>;
  }

  return (
    <div className={cn("relative", !bleed && CONTAINER, className)}>
      {children}
      {note ? (
        <div className="pointer-events-none absolute top-6 right-6 z-20 lg:right-10">
          <NoteSlot>
            <StickyNote author={author}>{note}</StickyNote>
          </NoteSlot>
        </div>
      ) : null}
    </div>
  );
}
