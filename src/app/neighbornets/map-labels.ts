import {
  CONTEXT_LABELS,
  type ContextLabel,
} from "@/generated/neighbornets-context";
import {
  MAP_STATE_INDEX,
  MAP_VIEWBOX,
} from "@/generated/neighbornets-map-index";

import type { View } from "./map-view";

/** The zooms at which each kind of label appears (the map label tokens). */
export type LabelZooms = {
  /** Cities over 250,000 (tier 1). */
  city: number;
  /** Places over 50,000 (tier 2). */
  large: number;
  /** Every NeighborNet's city, whatever its size. */
  net: number;
  /** Places over 10,000 (tier 3). */
  place: number;
};

/** A box in frame pixels: [left, top, right, bottom]. */
export type Box = [number, number, number, number];

/** Where labels may go, read at each commit (MapLabelsOptions.space). */
export type LabelSpace = {
  /** What shows of the map: under the header, above the panel. */
  area: Box;
  /** The markers on show (and the pin): no label covers one. */
  obstacles: Box[];
  /** A marker's radius: how far a label steps aside from its point. */
  clearance: number;
};

type Label = {
  name: string;
  x: number;
  y: number;
  /** The zoom it shows from. */
  zoom: number;
  /** Declutter priority: lower wins (tier 1, NeighborNet cities, 2, 3). */
  rank: number;
  /** Its place in its state's list (by population within a rank). */
  order: number;
  city: boolean;
  net: boolean;
  el: HTMLElement | null;
  /** Its size in pixels (measured once it is first laid out). */
  w: number;
  h: number;
  /** Shown since the last commit, and visible at the zoom on screen. */
  visible: boolean;
  dx: number;
  dy: number;
  /** Where it sits against its point (chosen at each commit), in pixels. */
  ox: number;
  oy: number;
};

export type MapLabelsOptions = {
  zooms: LabelZooms;
  /** Clear space kept between labels, in pixels. */
  gap: number;
  /** Class names: every label, a city's, a place's. */
  classes: { label: string; city: string; place: string };
  /** A state's labels arrived (show them once nothing is moving). */
  onLoad: () => void;
  /** The space labels may take now (read at each commit). */
  space: () => LabelSpace;
};

/**
 * The map's place labels (DESIGN-SYSTEM.md, "NeighborNets map"): informational
 * text over the states, never magnified (each is placed by a `translate`,
 * like the markers, so it keeps its size and is drawn sharp at any zoom).
 *
 * - **Data:** one chunk per state (scripts/neighbornets-context.mjs), loaded
 *   the first time a view zoomed in past the first label zoom touches that
 *   state (its bounds, from the client-side state index), and kept. Nothing
 *   loads on the whole map.
 * - **At each commit** (`update`): the labels of the loaded states that the
 *   zoom shows (by kind) and whose point is on what shows of the map (under
 *   the header, above the panel) are taken in priority order, and each is
 *   kept at the first of its spots (on its point, then below, above, right
 *   and left of it, a marker's radius aside) where it covers no label
 *   already kept and no marker, within what shows: a greedy declutter. A
 *   NeighborNet's city with no such spot takes the one covering the least
 *   of the markers rather than go (its nets are why it is labelled). The rest are hidden. Nothing fades.
 * - **Each frame** (`place`): the kept labels move with the map; zooming out
 *   mid-move hides any below its kind's zoom at once (they do not crowd the
 *   shrinking map until the next commit).
 */
export function createMapLabels(layer: HTMLElement, options: MapLabelsOptions) {
  const { zooms, gap, classes, onLoad, space } = options;
  const firstZoom = Math.min(zooms.city, zooms.large, zooms.net, zooms.place);
  const loaded = new Map<string, Label[]>();
  const loading = new Set<string>();
  let kept: Label[] = [];

  const toLabel = (
    [name, x, y, tier, net]: ContextLabel,
    order: number,
  ): Label => {
    const byTier =
      tier === 1
        ? zooms.city
        : tier === 2
          ? zooms.large
          : tier === 3
            ? zooms.place
            : Infinity;
    return {
      name,
      x,
      y,
      zoom: Math.min(byTier, net ? zooms.net : Infinity),
      rank: tier === 1 ? 0 : net ? 1 : tier === 2 ? 2 : 3,
      order,
      city: tier === 1,
      el: null,
      w: 0,
      h: 0,
      net: net === 1,
      visible: false,
      // Not placed yet: the first move always writes.
      dx: Infinity,
      dy: Infinity,
      ox: 0,
      oy: 0,
    };
  };

  /** The states whose bounds `view` touches (map units). */
  const statesIn = (view: View) => {
    const x1 = view.x + MAP_VIEWBOX.width / view.k;
    const y1 = view.y + MAP_VIEWBOX.height / view.k;
    return MAP_STATE_INDEX.filter(
      ({ bounds: [bx0, by0, bx1, by1] }) =>
        bx1 >= view.x && bx0 <= x1 && by1 >= view.y && by0 <= y1,
    ).map((state) => state.code);
  };

  /** Load the chunks `view` needs (zoomed in enough for labels), once. */
  const prepare = (view: View) => {
    if (view.k < firstZoom) return;
    for (const code of statesIn(view)) {
      const load = CONTEXT_LABELS[code];
      if (!load || loaded.has(code) || loading.has(code)) continue;
      loading.add(code);
      load()
        .then((chunk) => {
          const labels = chunk.default as readonly ContextLabel[];
          loaded.set(code, labels.map(toLabel));
          onLoad();
        })
        .catch(() => {
          // Offline or a failed chunk: try again with the next view.
        })
        .finally(() => loading.delete(code));
    }
  };

  const hide = (label: Label) => {
    if (label.el && !label.el.hidden) label.el.hidden = true;
    label.visible = false;
  };

  const move = (label: Label, view: View, unit: number) => {
    const dx = (label.x - view.x) * unit * view.k + label.ox;
    const dy = (label.y - view.y) * unit * view.k + label.oy;
    if (Math.abs(dx - label.dx) > 0.05 || Math.abs(dy - label.dy) > 0.05) {
      label.el!.style.translate = `${round(dx)}px ${round(dy)}px`;
      label.dx = dx;
      label.dy = dy;
    }
  };

  /** Each frame: move the kept labels with the map. */
  const place = (view: View, frameWidth: number) => {
    if (kept.length === 0) return;
    const unit = frameWidth / MAP_VIEWBOX.width;
    for (const label of kept) {
      const on = view.k >= label.zoom;
      if (on !== label.visible) {
        label.el!.hidden = !on;
        label.visible = on;
      }
      if (on) move(label, view, unit);
    }
  };

  /** At a commit: choose the labels `view` shows, and declutter them. */
  const update = (view: View, frameWidth: number) => {
    prepare(view);
    if (view.k < firstZoom) {
      for (const label of kept) hide(label);
      kept = [];
      return;
    }
    const unit = frameWidth / MAP_VIEWBOX.width;
    const { area, obstacles, clearance } = space();
    const candidates: Label[] = [];
    for (const code of statesIn(view)) {
      for (const label of loaded.get(code) ?? []) {
        if (view.k < label.zoom) continue;
        const sx = (label.x - view.x) * unit * view.k;
        const sy = (label.y - view.y) * unit * view.k;
        if (sx < area[0] || sx > area[2] || sy < area[1] || sy > area[3])
          continue;
        candidates.push(label);
      }
    }
    candidates.sort((a, b) => a.rank - b.rank || a.order - b.order);

    // New labels: created, then measured together (one layout).
    const fresh = candidates.filter((label) => !label.el);
    for (const label of fresh) {
      const el = document.createElement("span");
      el.className = `${classes.label} ${label.city ? classes.city : classes.place}`;
      el.textContent = label.name;
      el.hidden = true;
      layer.append(el);
      label.el = el;
    }
    const unmeasured = candidates.filter((label) => label.w === 0);
    for (const label of unmeasured) label.el!.hidden = false;
    for (const label of unmeasured) {
      label.w = label.el!.offsetWidth;
      label.h = label.el!.offsetHeight;
    }

    // Greedy declutter: in priority order, each label takes the first of
    // its spots whose box (and the gap around it) overlaps no label kept so
    // far and no marker; failing that, a NeighborNet's city takes the one
    // that covers the least of the markers.
    const overlaps = (box: Box, others: Box[]) =>
      others.some(
        ([x0, y0, x1, y1]) =>
          box[0] < x1 && box[2] > x0 && box[1] < y1 && box[3] > y0,
      );
    const boxes: Box[] = [];
    const next: Label[] = [];
    for (const label of candidates) {
      const sx = (label.x - view.x) * unit * view.k;
      const sy = (label.y - view.y) * unit * view.k;
      const halfW = label.w / 2;
      const halfH = label.h / 2;
      const spots = [
        [0, 0],
        [0, clearance + halfH],
        [0, -clearance - halfH],
        [clearance + halfW, 0],
        [-clearance - halfW, 0],
      ].map(([ox, oy]) => ({
        ox,
        oy,
        box: [
          sx + ox - halfW - gap,
          sy + oy - halfH - gap,
          sx + ox + halfW + gap,
          sy + oy + halfH + gap,
        ] as Box,
      }));
      // A spot stays on what shows of the map, clear of the labels kept.
      const clear = spots.filter(
        ({ box }) =>
          box[0] >= area[0] &&
          box[1] >= area[1] &&
          box[2] <= area[2] &&
          box[3] <= area[3] &&
          !overlaps(box, boxes),
      );
      const spot =
        clear.find((spot) => !overlaps(spot.box, obstacles)) ??
        (label.net ? leastCovered(clear, obstacles) : undefined);
      if (!spot) continue;
      label.ox = spot.ox;
      label.oy = spot.oy;
      label.dx = Infinity; // its spot may have changed: write it
      boxes.push(spot.box);
      next.push(label);
    }

    const keep = new Set(next);
    for (const label of kept) if (!keep.has(label)) hide(label);
    for (const label of unmeasured) if (!keep.has(label)) hide(label);
    for (const label of next) {
      label.el!.hidden = false;
      label.visible = true;
      move(label, view, unit);
    }
    kept = next;
  };

  /** The layout changed (a resize): measure every label again. */
  const resize = () => {
    for (const labels of loaded.values())
      for (const label of labels) label.w = label.h = 0;
  };

  return { prepare, place, update, resize };
}

export type MapLabels = ReturnType<typeof createMapLabels>;

/** Of `spots`, the one whose box covers the least of `obstacles`. */
function leastCovered<T extends { box: Box }>(spots: T[], obstacles: Box[]) {
  let best: T | undefined;
  let least = Infinity;
  for (const spot of spots) {
    const [a0, b0, a1, b1] = spot.box;
    let covered = 0;
    for (const [x0, y0, x1, y1] of obstacles)
      covered +=
        Math.max(0, Math.min(a1, x1) - Math.max(a0, x0)) *
        Math.max(0, Math.min(b1, y1) - Math.max(b0, y0));
    if (covered < least) {
      least = covered;
      best = spot;
    }
  }
  return best;
}

function round(value: number) {
  return Math.round(value * 100) / 100;
}
