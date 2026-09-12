"use client";

import { useNotes } from "./use-notes";

/**
 * WIREFRAME: lets the client hide the sticky notes and read the wireframe on
 * its own terms, then bring the commentary back.
 *
 * Sits bottom-left. Agentation's feedback toolbar occupies the bottom-right
 * corner and is not configurable enough to be worth fighting, so the two stay
 * out of each other's way.
 */
export function NotesToggle() {
  const { enabled, visible, toggle } = useNotes();

  if (!enabled) return null;

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={visible}
      className="fixed bottom-5 left-5 z-50 rounded-full border border-border bg-background px-4 py-2 text-xs font-medium tracking-wide shadow-sm outline-none hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
    >
      Notes {visible ? "on" : "off"}
    </button>
  );
}
