/*
 * Read motion tokens from the root so JavaScript animations follow the
 * documented CSS tokens in globals.css. Browser-only: call them from effects
 * or event handlers. Time tokens are read with `readTimeToken` in
 * components/site/blob-reveal.tsx.
 */

function readRootValue(name: string) {
  return getComputedStyle(document.documentElement)
    .getPropertyValue(name)
    .trim();
}

/** A length token in px; rem values follow the root font size. */
export function readLengthToken(name: string, fallbackPx: number) {
  const value = readRootValue(name);
  const amount = Number.parseFloat(value);
  if (Number.isNaN(amount)) return fallbackPx;
  if (!value.endsWith("rem")) return amount;
  return (
    amount *
    Number.parseFloat(getComputedStyle(document.documentElement).fontSize)
  );
}

/** A `cubic-bezier()` easing token as Motion's four control points. */
export function readEaseToken(
  name: string,
  fallback: [number, number, number, number],
): [number, number, number, number] {
  const points = readRootValue(name)
    .match(/cubic-bezier\(([^)]+)\)/)?.[1]
    .split(",")
    .map((point) => Number.parseFloat(point));
  return points?.length === 4 && points.every((point) => !Number.isNaN(point))
    ? [points[0], points[1], points[2], points[3]]
    : fallback;
}

/** An angle token in degrees (such as `36deg`), returned in turns. */
export function readTurnsToken(name: string, fallbackDegrees: number) {
  const degrees = Number.parseFloat(readRootValue(name));
  return (Number.isNaN(degrees) ? fallbackDegrees : degrees) / 360;
}
