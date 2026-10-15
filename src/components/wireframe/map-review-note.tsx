// WIREFRAME: Temporary review note for the Find a Chapter map prototype.
export function MapReviewNote() {
  return (
    <aside
      aria-label="Map prototype note"
      className="relative mb-8 max-w-lg border border-yellow-300 bg-yellow-100 p-5 text-sm leading-relaxed text-brand-obsidian shadow-md"
    >
      <p className="mb-2 font-bold">Map prototype note</p>
      <p>
        Select a state or search for a city to reveal city names, highways, and
        local NeighborNet locations. Select a map logo or a result card to keep
        the matching location highlighted.
      </p>
    </aside>
  );
}
