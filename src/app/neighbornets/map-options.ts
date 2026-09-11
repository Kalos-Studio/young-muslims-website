import type { Branch } from "@/lib/neighbornets";

/**
 * Every knob the debug panel exposes. This file is the single source of truth
 * for the prototype's option space: the panel renders itself from these lists
 * and the map reads the resulting settings object. Once we settle on a look,
 * the winning combination becomes the hardcoded default and this whole module
 * (plus the panel) can be deleted.
 */

/** How a single neighbornet is drawn on the map. */
export type MarkerStyle = "dot" | "ring" | "pin" | "initial" | "pulse";

/** Which visual channel carries the brothers/sisters distinction. */
export type Differentiator = "color" | "shape" | "initial" | "color-and-shape";

/** Named brother/sister color pairs to compare for contrast and tone. */
export type Palette = "emerald-violet" | "blue-rose" | "teal-amber" | "mono";

/** How a neighbornet's details are surfaced. */
export type InfoMode = "hover-tooltip" | "click-popup" | "side-panel" | "both";

/** Basemap treatment: real tiles vs. a blank canvas with state polygons. */
export type Basemap = "streets" | "blank";

/** Dot sizing: uniform, or scaled by the net's headcount. */
export type SizeMode = "uniform" | "by-size";

export type BranchFilter = Branch | "all";

export type MapSettings = {
  basemap: Basemap;
  showStateOutlines: boolean;
  markerStyle: MarkerStyle;
  differentiator: Differentiator;
  palette: Palette;
  sizeMode: SizeMode;
  infoMode: InfoMode;
  showLabels: boolean;
  /** Nudge co-located brothers'/sisters' nets apart so neither hides the other. */
  pairOffset: boolean;
  cluster: boolean;
  dimInactive: boolean;
  branchFilter: BranchFilter;
};

export const defaultSettings: MapSettings = {
  basemap: "blank",
  showStateOutlines: true,
  markerStyle: "ring",
  differentiator: "color",
  palette: "emerald-violet",
  sizeMode: "uniform",
  infoMode: "both",
  showLabels: false,
  pairOffset: true,
  cluster: false,
  dimInactive: true,
  branchFilter: "all",
};

/** Hex pairs rather than Tailwind classes: MapLibre paint expressions need raw colors. */
export const palettes: Record<
  Palette,
  { label: string; brothers: string; sisters: string; note: string }
> = {
  "emerald-violet": {
    label: "Emerald / Violet",
    brothers: "#059669",
    sisters: "#7c3aed",
    note: "Strong hue separation, reads for most color-vision types.",
  },
  "blue-rose": {
    label: "Blue / Rose",
    brothers: "#2563eb",
    sisters: "#e11d48",
    note: "Highest contrast pair, but leans on a gendered color cliche.",
  },
  "teal-amber": {
    label: "Teal / Amber",
    brothers: "#0d9488",
    sisters: "#d97706",
    note: "Warm/cool split; amber can wash out on a light basemap.",
  },
  mono: {
    label: "Mono (shape only)",
    brothers: "#404040",
    sisters: "#404040",
    note: "Forces the shape or letter channel to do all the work.",
  },
};

export const markerStyleOptions: {
  value: MarkerStyle;
  label: string;
  note: string;
}[] = [
  {
    value: "dot",
    label: "Plain dot",
    note: "Smallest footprint, densest map.",
  },
  {
    value: "ring",
    label: "Ringed dot",
    note: "White halo keeps dots legible over dark tiles.",
  },
  {
    value: "pin",
    label: "Teardrop pin",
    note: "Points at the exact spot; heavier at national zoom.",
  },
  {
    value: "initial",
    label: "Lettered badge",
    note: "B / S inside the dot, so it works without color.",
  },
  {
    value: "pulse",
    label: "Pulsing dot",
    note: "Animated halo; use sparingly, it competes for attention.",
  },
];

export const differentiatorOptions: {
  value: Differentiator;
  label: string;
  note: string;
}[] = [
  {
    value: "color",
    label: "Color only",
    note: "Fastest to scan when zoomed out.",
  },
  {
    value: "shape",
    label: "Shape only",
    note: "Circle vs. diamond. Accessible, slower to read.",
  },
  {
    value: "initial",
    label: "Letter only",
    note: "B / S. Unambiguous but needs a bigger dot.",
  },
  {
    value: "color-and-shape",
    label: "Color + shape",
    note: "Redundant encoding, the safest for color-blind users.",
  },
];

export const infoModeOptions: {
  value: InfoMode;
  label: string;
  note: string;
}[] = [
  {
    value: "hover-tooltip",
    label: "Hover tooltip",
    note: "Quick scan, but unreachable on touch devices.",
  },
  {
    value: "click-popup",
    label: "Click popup",
    note: "Anchored card on the map. Works on touch.",
  },
  {
    value: "side-panel",
    label: "Click → side panel",
    note: "Most room for contact details; never covers the map.",
  },
  {
    value: "both",
    label: "Hover peek + click panel",
    note: "Tooltip teases the name, click opens full details.",
  },
];

export const basemapOptions: { value: Basemap; label: string; note: string }[] =
  [
    {
      value: "streets",
      label: "Street tiles",
      note: "CARTO basemap. Useful once someone zooms into a city.",
    },
    {
      value: "blank",
      label: "Blank + state shapes",
      note: "Data-only canvas. Cleanest at national zoom.",
    },
  ];

export const sizeModeOptions: {
  value: SizeMode;
  label: string;
  note: string;
}[] = [
  {
    value: "uniform",
    label: "Uniform dots",
    note: "Every net reads as equal.",
  },
  {
    value: "by-size",
    label: "Scaled by headcount",
    note: "Shows where the weight is; small nets get easy to miss.",
  },
];

/**
 * US state polygons for the blank-basemap treatment, served from our own origin
 * (`public/us-states.geojson`). Fetching this from a GitHub raw URL at runtime
 * would put a third party in the render path of our own map, so the file is
 * checked in instead. Derived from US Census cartographic boundary data, which
 * is public domain.
 */
export const US_STATES_GEOJSON = "/us-states.geojson";

/**
 * Bounding box of the lower 48, used to frame the map on load. Fitting bounds
 * rather than hardcoding a zoom is what keeps the whole country on screen at
 * phone widths as well as on a desktop.
 */
export const US_BOUNDS: [[number, number], [number, number]] = [
  [-125, 24],
  [-66.5, 49.5],
];

/** Fallback view used before the first fit, and the center the compass returns to. */
export const US_VIEW = {
  center: [-97, 39] as [number, number],
  zoom: 3.4,
};
