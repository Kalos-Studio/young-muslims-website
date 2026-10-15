// WIREFRAME: Temporary review note for the Find a Chapter map prototype.
export function MapReviewNote() {
  return (
    <aside
      aria-label="Map prototype note"
      className="relative mb-8 max-w-lg border border-yellow-300 bg-yellow-100 p-5 text-sm leading-relaxed text-brand-obsidian shadow-md"
    >
      <p className="mb-2 font-bold">Map prototype note</p>
      <p>
        Cards will be added when a user clicks into a region. More map detail,
        including city names, will also be added. This prototype demonstrates
        the map&apos;s hover and interaction states, plus search functionality.
      </p>
    </aside>
  );
}
