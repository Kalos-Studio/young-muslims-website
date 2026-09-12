"use client";

import { useNotes } from "./use-notes";

/**
 * WIREFRAME: the client half of <Annotate>.
 *
 * Exists only to apply the show/hide toggle. The note itself is server
 * rendered and arrives here as a slot, so this component stays tiny and the
 * pages using <Annotate> stay server components.
 *
 * The note stays in the tree when hidden rather than being unmounted, so
 * toggling it back on is instant and does not refetch anything.
 */
export function NoteSlot({ children }: { children: React.ReactNode }) {
  const { visible } = useNotes();

  return (
    <div aria-hidden={!visible} className={visible ? undefined : "invisible"}>
      {children}
    </div>
  );
}
