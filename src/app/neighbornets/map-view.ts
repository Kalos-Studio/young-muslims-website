import { MAP_VIEWBOX, type MapPoint } from "@/generated/neighbornets-map-index";

/**
 * A view of the map: the map point (in map units) at the frame's top-left,
 * and the zoom against the whole map (1 shows all of it). The frame keeps
 * the map's aspect, so a view is a viewBox of the same shape.
 */
export type View = { x: number; y: number; k: number };

export const FULL_VIEW: View = { x: 0, y: 0, k: 1 };

/** A rectangle in frame pixels (from the frame's top-left). */
export type Rect = { x: number; y: number; w: number; h: number };

/** The view as an SVG viewBox. */
export function viewBox(view: View) {
  const w = MAP_VIEWBOX.width / view.k;
  const h = MAP_VIEWBOX.height / view.k;
  return `${round(view.x)} ${round(view.y)} ${round(w)} ${round(h)}`;
}

/** Frame pixels per map unit at zoom 1. */
const unit = (frameWidth: number) => frameWidth / MAP_VIEWBOX.width;

/**
 * The transform that shows a view on a layer laid out for the whole map
 * (the markers): scale by the zoom, then move the view's corner to the
 * frame's (from a top-left origin).
 */
export function layerTransform(view: View, frameWidth: number) {
  const s = unit(frameWidth) * view.k;
  return `translate(${round(-view.x * s)}px, ${round(-view.y * s)}px) scale(${round(view.k, 4)})`;
}

/**
 * The transform, on a layer showing `from`, that makes it show `to`: what
 * the lens flies while the map is still drawn at `from`.
 */
export function flightTransform(from: View, to: View, frameWidth: number) {
  const scale = to.k / from.k;
  const s = unit(frameWidth) * to.k;
  return {
    css: `translate(${round((from.x - to.x) * s)}px, ${round((from.y - to.y) * s)}px) scale(${round(scale, 4)})`,
    matrix: new DOMMatrix([
      scale,
      0,
      0,
      scale,
      (from.x - to.x) * s,
      (from.y - to.y) * s,
    ]),
  };
}

/** The map point under a frame pixel, in a view. */
export function mapPoint(view: View, x: number, y: number, frameWidth: number) {
  const s = unit(frameWidth) * view.k;
  return { x: view.x + x / s, y: view.y + y / s };
}

/**
 * The view that fits `bounds` (map units) into `target` (frame pixels),
 * centred there, zoomed no further than `maxZoom` and no less than 1.
 */
export function fitView(
  bounds: readonly [number, number, number, number],
  target: Rect,
  frameWidth: number,
  maxZoom: number,
): View {
  const [x0, y0, x1, y1] = bounds;
  const base = unit(frameWidth);
  const k = Math.min(
    maxZoom,
    Math.max(
      1,
      Math.min(
        target.w / (Math.max(x1 - x0, 0.001) * base),
        target.h / (Math.max(y1 - y0, 0.001) * base),
      ),
    ),
  );
  const s = base * k;
  return {
    x: (x0 + x1) / 2 - (target.x + target.w / 2) / s,
    y: (y0 + y1) / 2 - (target.y + target.h / 2) / s,
    k,
  };
}

/**
 * A NeighborNet's area: it and the nets within `reach` map units of it, so
 * the zoom shows its neighbours too, at least `span` units across.
 */
export function areaAround(
  point: MapPoint,
  points: readonly MapPoint[],
  reach: number,
  span: number,
): [number, number, number, number] {
  let [x0, y0, x1, y1] = [point.x, point.y, point.x, point.y];
  for (const other of points) {
    if (Math.hypot(other.x - point.x, other.y - point.y) > reach) continue;
    x0 = Math.min(x0, other.x);
    y0 = Math.min(y0, other.y);
    x1 = Math.max(x1, other.x);
    y1 = Math.max(y1, other.y);
  }
  const grow = (lo: number, hi: number) => {
    const extra = Math.max(0, span - (hi - lo)) / 2;
    return [lo - extra, hi + extra];
  };
  [x0, x1] = grow(x0, x1);
  [y0, y1] = grow(y0, y1);
  return [x0, y0, x1, y1];
}

/** The box around `points`, grown to at least `span` map units each way. */
export function boxAround(
  points: readonly { x: number; y: number }[],
  span: number,
): [number, number, number, number] {
  let [x0, y0, x1, y1] = [Infinity, Infinity, -Infinity, -Infinity];
  for (const { x, y } of points) {
    x0 = Math.min(x0, x);
    y0 = Math.min(y0, y);
    x1 = Math.max(x1, x);
    y1 = Math.max(y1, y);
  }
  const grow = (lo: number, hi: number) => {
    const extra = Math.max(0, span - (hi - lo)) / 2;
    return [lo - extra, hi + extra];
  };
  [x0, x1] = grow(x0, x1);
  [y0, y1] = grow(y0, y1);
  return [x0, y0, x1, y1];
}

function round(value: number, places = 2) {
  const f = 10 ** places;
  return Math.round(value * f) / f;
}
