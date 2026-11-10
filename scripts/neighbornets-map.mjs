// Generates the NeighborNets map (src/generated/neighbornets-map.ts and its
// marker positions, neighbornets-map-points.module.css): the lower 48 states
// and DC from the US Census 1:10m boundaries (us-atlas), projected with the
// standard US Albers equal-area conic (d3-geo `geoAlbers`: parallels 29.5 and
// 45.5, centred on 96W), and every NeighborNet's coordinates through the SAME
// projection, so a marker can only land where its coordinates are.
//
// Each net's map state is the state polygon that contains it; a net just
// off a simplified coastline (a pier, a beach) falls back to the state its
// coordinates reverse-geocoded to. A net outside the US (Mississauga,
// Ontario) is not plotted: it is listed in OFF_MAP_IDS for the map's
// "Canada" entry.
//
// Build-time only: d3-geo, topojson-client and us-atlas are dev dependencies
// and nothing here ships to the browser except the generated paths. Run with
// Bun (it reads the generated TypeScript locations):
//
//   bun scripts/neighbornets-map.mjs
import { writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { geoAlbers, geoContains, geoPath } from "d3-geo";
import { format } from "prettier";
import { feature } from "topojson-client";
import topology from "us-atlas/states-10m.json" with { type: "json" };

import { brotherLocations } from "../src/generated/brother-neighbornets.ts";
import { sisterLocations } from "../src/generated/sister-neighbornets.ts";

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const OUT_TS = resolve(projectRoot, "src/generated/neighbornets-map.ts");
const OUT_CSS = resolve(
  projectRoot,
  "src/generated/neighbornets-map-points.module.css",
);

/** Map units across; the height follows from the projection. */
const WIDTH = 1000;
/** Room for the outline stroke at the map's edges, in map units. */
const PAD = 4;
/** Two places: about a tenth of a pixel at the widest map, sharp when zoomed. */
const DIGITS = 2;

// FIPS code -> USPS code, the lower 48 and DC (us-atlas feature IDs).
const USPS = {
  "01": "AL",
  "04": "AZ",
  "05": "AR",
  "06": "CA",
  "08": "CO",
  "09": "CT",
  10: "DE",
  11: "DC",
  12: "FL",
  13: "GA",
  16: "ID",
  17: "IL",
  18: "IN",
  19: "IA",
  20: "KS",
  21: "KY",
  22: "LA",
  23: "ME",
  24: "MD",
  25: "MA",
  26: "MI",
  27: "MN",
  28: "MS",
  29: "MO",
  30: "MT",
  31: "NE",
  32: "NV",
  33: "NH",
  34: "NJ",
  35: "NM",
  36: "NY",
  37: "NC",
  38: "ND",
  39: "OH",
  40: "OK",
  41: "OR",
  42: "PA",
  44: "RI",
  45: "SC",
  46: "SD",
  47: "TN",
  48: "TX",
  49: "UT",
  50: "VT",
  51: "VA",
  53: "WA",
  54: "WV",
  55: "WI",
  56: "WY",
};

const geometries = topology.objects.states.geometries.filter(
  (geometry) => USPS[geometry.id],
);
const lower48 = { type: "GeometryCollection", geometries };
const states = feature(topology, lower48).features;
if (states.length !== 49) {
  throw new Error(`Expected the lower 48 and DC, got ${states.length}`);
}

const projection = geoAlbers().fitWidth(WIDTH - PAD * 2, {
  type: "FeatureCollection",
  features: states,
});
const [tx, ty] = projection.translate();
projection.translate([tx + PAD, ty + PAD]);
const path = geoPath(projection).digits(DIGITS);
const HEIGHT = Math.ceil(
  path.bounds({ type: "FeatureCollection", features: states })[1][1] + PAD,
);
const round = (value) => Math.round(value * 100) / 100;

const mapStates = states
  .map((state) => {
    const [[x0, y0], [x1, y1]] = path.bounds(state);
    return {
      code: USPS[state.id],
      name: state.properties.name,
      d: path(state),
      bounds: [round(x0), round(y0), round(x1), round(y1)],
    };
  })
  .sort((a, b) => a.name.localeCompare(b.name));

// --- The NeighborNets -----------------------------------------------------

const locations = [...brotherLocations, ...sisterLocations];
const offMap = [];
const points = [];
const problems = [];
for (const location of locations) {
  if (location.country && location.country !== "US") {
    offMap.push(location.id);
    continue;
  }
  const lonLat = [location.longitude, location.latitude];
  const container = states.find((state) => geoContains(state, lonLat));
  const state = container ? USPS[container.id] : location.state;
  if (!state) {
    throw new Error(`${location.id} is outside every state and has none`);
  }
  if (!container) {
    problems.push(`${location.id}: off the coastline, placed in ${state}`);
  } else if (location.state && location.state !== state) {
    problems.push(
      `${location.id}: listed in ${location.state}, coordinates in ${state}`,
    );
  }
  const [x, y] = projection(lonLat);
  points.push({ id: location.id, x: round(x), y: round(y), state });
}

// Brothers and Sisters nets that meet at the same place share coordinates;
// each pair (or trio) is fanned out side by side by `slot`, in marker widths,
// so neither hides the other at any zoom.
const sameSpot = new Map();
for (const point of points) {
  const key = `${Math.round(point.x * 2)},${Math.round(point.y * 2)}`;
  sameSpot.set(key, [...(sameSpot.get(key) ?? []), point]);
}
for (const group of sameSpot.values()) {
  group.sort((a, b) => a.id.localeCompare(b.id));
  const slots =
    group.length === 1 ? [0] : group.length === 2 ? [-1, 1] : [-1, 0, 1];
  if (group.length > 3)
    throw new Error(`Four nets at one spot: ${group[0].id}`);
  group.forEach((point, index) => (point.slot = slots[index]));
}

// Drawn top to bottom, so a lower marker overlaps the one above it.
points.sort((a, b) => a.y - b.y || a.x - b.x);

// --- Output ---------------------------------------------------------------

const pct = (value, total) => `${round((value / total) * 100 * 100) / 100}%`;
const css = `/*
 * Generated by scripts/neighbornets-map.mjs: each NeighborNet marker's place
 * on the map (${WIDTH} x ${HEIGHT} map units), as percentages of the map
 * frame, drawn top to bottom. Regenerate rather than edit.
 */
${points
  .map(
    (point, index) =>
      `.p${index} {\n  left: ${pct(point.x, WIDTH)};\n  top: ${pct(point.y, HEIGHT)};\n}`,
  )
  .join("\n\n")}
`;

const ts = `// Generated by scripts/neighbornets-map.mjs. Do not edit directly.
import positions from "./neighbornets-map-points.module.css";

/** The map's coordinate space: US Albers, ${WIDTH} map units across. */
export const MAP_VIEWBOX = { width: ${WIDTH}, height: ${HEIGHT} } as const;

export type MapState = {
  /** USPS code. */
  code: string;
  name: string;
  /** The state's outline: filled, and stroked as its border. */
  d: string;
  /** [x0, y0, x1, y1] in map units: what a zoom to the state fits. */
  bounds: readonly [number, number, number, number];
};

/** The lower 48 and DC, by name. */
export const MAP_STATES: readonly MapState[] = ${JSON.stringify(mapStates)};

export type MapPoint = {
  /** The NeighborNet's ID. */
  id: string;
  /** Its place in map units. */
  x: number;
  y: number;
  /** USPS code of the state polygon that contains it. */
  state: string;
  /** Side-by-side offset for nets sharing a spot, in marker widths. */
  slot: -1 | 0 | 1;
  /** Its position class (neighbornets-map-points.module.css). */
  position: string;
};

/** Every plotted NeighborNet, top to bottom (the drawing order). */
export const MAP_POINTS: readonly MapPoint[] = [
${points
  .map(
    (point, index) =>
      `  { id: ${JSON.stringify(point.id)}, x: ${point.x}, y: ${point.y}, state: ${JSON.stringify(point.state)}, slot: ${point.slot}, position: positions.p${index} },`,
  )
  .join("\n")}
];

/** NeighborNets outside the US, listed beside the map rather than on it. */
export const OFF_MAP_IDS: readonly string[] = ${JSON.stringify(offMap)};
`;

writeFileSync(OUT_CSS, await format(css, { parser: "css" }));
writeFileSync(OUT_TS, await format(ts, { parser: "typescript" }));

const kb = (text) => `${(Buffer.byteLength(text) / 1024).toFixed(0)} KB`;
console.log(
  `Map ${WIDTH} x ${HEIGHT}: ${mapStates.length} states (${kb(mapStates.map((s) => s.d).join(""))} of paths), ${points.length} NeighborNets plotted, ${offMap.length} off the map (${offMap.join(", ")}).`,
);
for (const problem of problems) console.log(`  note: ${problem}`);
