import { cn } from "@/lib/utils";

import { NoteSlot } from "./note-slot";
import { StickyNote } from "./sticky-note";

/**
 * WIREFRAME: places a page section and lays its sticky note on it.
 *
 * Notes are absolutely positioned over a corner of the section they annotate,
 * so they cost no layout and sit next to the thing they are about. Overlapping
 * the content is fine and expected, the way a sticky note on a Figma artboard
 * covers part of the artboard. What is not fine is a note drifting away from
 * its subject, so `placement` picks the corner: put it over the column it is
 * talking about.
 *
 * Two earlier versions got this wrong in opposite directions. A fixed rail down
 * the right-hand side took real space, so every section was narrowed to make
 * room for commentary and the wireframe showed a layout that would never exist.
 * Then notes moved into the gap above each section, which covered nothing but
 * floated them out of context and forced big artificial gaps between sections.
 *
 * `pointer-events-none` so a note can never swallow a click.
 *
 * For a section that needs a note on each of two columns, nest: wrap each
 * column in its own `<Annotate bleed>`, which attaches a note to that element
 * without adding a container.
 *
 * `bleed` opts out of the shared content width, for full-width sections and for
 * nested use.
 *
 * This is deliberately a *server* component. An earlier version read the notes
 * toggle directly, which made it a client component, and a client component's
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
const CONTAINER = "mx-auto w-full max-w-[80rem] px-6 md:px-10";

const placements = {
  "top-right": "md:absolute md:top-6 md:right-6",
  "top-left": "md:absolute md:top-6 md:left-6",
  "bottom-right": "md:absolute md:right-6 md:bottom-6",
  "bottom-left": "md:absolute md:bottom-6 md:left-6",
  /** Vertically centred, for notes that would otherwise sit in a dead corner
      or collide with the fixed notes toggle in the bottom left. */
  "center-left": "md:absolute md:top-1/2 md:left-10 md:-translate-y-1/2",
  "center-right": "md:absolute md:top-1/2 md:right-10 md:-translate-y-1/2",
} as const;

export type Placement = keyof typeof placements;

export function Annotate({
  children,
  note,
  notes,
  /** Run full width instead of inside the shared content column. */
  bleed = false,
  /** Which corner of the section a single `note` sits over. */
  placement = "top-right",
  className,
}: {
  children: React.ReactNode;
  note?: React.ReactNode;
  /**
   * Several notes on one section, each with its own corner. Use this rather
   * than nesting <Annotate> wrappers when the notes are all about the same
   * section, as on the landing hero.
   */
  notes?: { note: React.ReactNode; placement: Placement }[];
  bleed?: boolean;
  placement?: Placement;
  className?: string;
}) {
  const all = notes ?? (note ? [{ note, placement }] : []);

  // Once the wireframe is gone this component goes with it; until then, a build
  // with notes disabled pays for neither the wrapper nor the note text.
  if (!NOTES_ENABLED) {
    return <div className={cn(!bleed && CONTAINER, className)}>{children}</div>;
  }

  return (
    <div className={cn("relative", !bleed && CONTAINER, className)}>
      {all.map((entry, index) => (
        <div
          key={index}
          className={cn(
            "pointer-events-none relative z-20 mb-4 md:mb-0",
            bleed && "mx-6 md:mx-0",
            placements[entry.placement],
          )}
        >
          <NoteSlot>
            <StickyNote>{entry.note}</StickyNote>
          </NoteSlot>
        </div>
      ))}
      {children}
    </div>
  );
}
