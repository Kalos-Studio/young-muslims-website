// The NeighborNets map's projection, shared by every generator that places
// anything on it (scripts/neighbornets-map.mjs: the states and markers;
// scripts/neighbornets-context.mjs: the place labels), so all of it lines up
// exactly: the lower 48 states and DC from the US Census 1:10m boundaries
// (us-atlas), in the standard US Albers equal-area conic (d3-geo `geoAlbers`:
// parallels 29.5 and 45.5, centred on 96W), fitted to WIDTH map units across
// with PAD units of room for the outline stroke.
//
// Build-time only (d3-geo, topojson-client and us-atlas are dev
// dependencies).
import { geoAlbers, geoPath } from "d3-geo";
import { feature } from "topojson-client";
import topology from "us-atlas/states-10m.json" with { type: "json" };

/** Map units across; the height follows from the projection. */
export const WIDTH = 1000;
/** Room for the outline stroke at the map's edges, in map units. */
export const PAD = 4;
/** Two places: about a tenth of a pixel at the widest map, sharp when zoomed. */
export const DIGITS = 2;

// FIPS code -> USPS code, the lower 48 and DC (us-atlas feature IDs).
export const USPS = {
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
export const states = feature(topology, lower48).features;
if (states.length !== 49) {
  throw new Error(`Expected the lower 48 and DC, got ${states.length}`);
}

export const projection = geoAlbers().fitWidth(WIDTH - PAD * 2, {
  type: "FeatureCollection",
  features: states,
});
const [tx, ty] = projection.translate();
projection.translate([tx + PAD, ty + PAD]);
export const path = geoPath(projection).digits(DIGITS);
export const HEIGHT = Math.ceil(
  path.bounds({ type: "FeatureCollection", features: states })[1][1] + PAD,
);
