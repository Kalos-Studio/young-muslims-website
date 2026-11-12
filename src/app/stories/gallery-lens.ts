/*
 * The Stories gallery's fisheye (DESIGN-SYSTEM.md, "Stories gallery"). Pure
 * maths, no DOM: the field component measures, reads the tokens and moves
 * the faces with what this returns.
 *
 * The field is a honeycomb lattice seen through a lens fixed at the band's
 * centre, as on a watch's app grid: whatever is panned to the middle is full
 * size, and faces shrink towards the edges. Nothing else moves the lens.
 * Unlensed, cell (column i, row j) sits `column` apart across and `row`
 * apart down (odd columns half a row lower), moved by the pan.
 *
 * - **Across**, a cell `dx` from the centre is drawn at `R tanh(dx / R)`:
 *   near the centre the field is at full size, and it compresses smoothly
 *   towards the sides. R is `lens`, grown in proportion where the band's
 *   half-width is more than `reach`, so wide screens are filled to the edge.
 * - **Down**, rows keep their spacing; near the band's top and bottom a face
 *   shrinks so it never crosses `contentHalf` from the middle.
 * - **Size** falls with the distance r from the centre (vertical distance
 *   weighted by `lensY`): `sech²(r / lens)`, the derivative of the across
 *   mapping (so neighbours never overlap), less a little more round the
 *   centre (`boost`), which lifts the middle face out as Figma does.
 */

export type LensGeometry = {
  /** The band's size, px. */
  width: number;
  height: number;
  /** A face at full size, px. */
  face: number;
  /** Unlensed lattice spacing, px. */
  column: number;
  row: number;
  /** The lens radius, px. */
  lens: number;
  /** The half-width the lens radius spans before it grows, px. */
  reach: number;
  /** How much vertical distance counts towards a face's size (0 to 1). */
  lensY: number;
  /** How much smaller than the lens alone the centre's neighbours are. */
  boost: number;
  /** Faces stay within this far of the band's middle, px. */
  contentHalf: number;
  /** Below this scale a face is not drawn. */
  cull: number;
};

/** The across mapping's radius for this band (see above). */
export function lensRadius({ lens, reach, width }: LensGeometry) {
  return Math.max(lens, (lens * width) / 2 / reach);
}

/**
 * Where a cell whose unlensed centre is (x, y), from the band's top left, is
 * drawn, and at what scale (0 when it is not drawn: too small, or off the
 * band).
 */
export function lensCell(
  geometry: LensGeometry,
  radius: number,
  x: number,
  y: number,
) {
  const { face, column, lens, lensY, boost, contentHalf, cull, width, height } =
    geometry;
  const dx = x - width / 2;
  const dy = y - height / 2;
  const drawnX = width / 2 + radius * Math.tanh(dx / radius);
  const r = Math.hypot(dx, lensY * dy);
  const t = Math.tanh(r / lens);
  const near = Math.tanh(r / column);
  const edge = (contentHalf - Math.abs(dy)) / (face / 2);
  let scale = (1 - t * t) * (1 - boost * near * near) * Math.min(1, edge);
  const half = (face * scale) / 2;
  if (scale < cull || drawnX + half < 0 || drawnX - half > width) scale = 0;
  return { x: drawnX, y, scale };
}

/**
 * How far either side of the centre (unlensed) a cell can still be drawn:
 * the columns worth visiting.
 */
export function lensSpan(geometry: LensGeometry, radius: number) {
  const { lens, cull, width, face } = geometry;
  // Past this distance the lens alone draws a face below `cull`.
  const smallest = lens * Math.atanh(Math.sqrt(1 - cull));
  const room = width / 2 + face / 2;
  return Math.min(
    smallest,
    room >= radius ? smallest : radius * Math.atanh(room / radius),
  );
}
