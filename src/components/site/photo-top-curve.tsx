/** Shared curved edge used above the site's closing photographs. */
export function PhotoTopCurve() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute top-0 left-0 z-10 h-24 w-full text-background"
    >
      <svg
        viewBox="0 0 1440 96"
        preserveAspectRatio="none"
        className="block h-full w-full"
      >
        <path d="M0 0H1440V72C1100 -18 340 -18 0 72Z" fill="currentColor" />
      </svg>
    </div>
  );
}
