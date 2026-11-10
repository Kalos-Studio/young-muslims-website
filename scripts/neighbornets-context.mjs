// Generates the NeighborNets map's place labels (stage 4b): per-state
// chunks in src/generated/neighbornets-context/{ST}.json, loaded by the map
// only for the states a zoomed-in view touches, and the loader index beside
// them. A one-off build-data script, like the reverse geocoder: its output
// is committed, its sources are not.
//
// Sources (US Census, public domain), downloaded once to a cache:
// - 2023 Gazetteer places: every incorporated place and CDP, with its
//   internal point (coordinates).
// - 2023 Gazetteer county subdivisions: in New Jersey, Pennsylvania and New
//   England the township or town is the municipality people name (Edison,
//   Cherry Hill, Brookline), not a Census place.
// - Vintage 2023 subcounty population estimates (SUB-EST2023): populations
//   for incorporated places and county subdivisions (CDPs have none).
//
// Every label is projected through the map's own projection
// (scripts/neighbornets-projection.mjs), so it lines up with the states and
// the markers exactly. A label is kept if its place has 10,000 people or
// more, or if a NeighborNet meets there (its city, from the generated
// locations, always labelled whatever its size); each has a population tier
// (1: over 250,000; 2: over 50,000; 3: over 10,000; 0: smaller) and a
// NeighborNet flag, and a chunk lists its labels by priority (tier 1, then
// NeighborNet cities, then tiers 2 and 3; by population within each), the
// order the map's declutter keeps them in.
//
//   bun scripts/neighbornets-context.mjs [--sources <dir>]
import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { format } from "prettier";

import { brotherLocations } from "../src/generated/brother-neighbornets.ts";
import { sisterLocations } from "../src/generated/sister-neighbornets.ts";
import { normalizeSearchText, placeChunkKey } from "../src/lib/search-text.ts";
import { USPS, projection } from "./neighbornets-projection.mjs";

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const OUT_DIR = resolve(projectRoot, "src/generated/neighbornets-context");
const SEARCH_DIR = resolve(projectRoot, "src/generated/neighbornets-search");
const sourcesArg = process.argv.indexOf("--sources");
const SOURCES =
  sourcesArg > 0
    ? resolve(process.argv[sourcesArg + 1])
    : resolve(projectRoot, "node_modules/.cache/neighbornets-context");
const USER_AGENT =
  "YoungMuslimsWebsite/1.0 (+https://youngmuslims.com; one-time map label import)";

const GAZETTEER =
  "https://www2.census.gov/geo/docs/maps-data/data/gazetteer/2023_Gazetteer";
const FILES = {
  places: {
    url: `${GAZETTEER}/2023_Gaz_place_national.zip`,
    file: "2023_Gaz_place_national.txt",
  },
  subdivisions: {
    url: `${GAZETTEER}/2023_Gaz_cousubs_national.zip`,
    file: "2023_Gaz_cousubs_national.txt",
  },
  zips: {
    url: `${GAZETTEER}/2023_Gaz_zcta_national.zip`,
    file: "2023_Gaz_zcta_national.txt",
  },
  population: {
    url: "https://www2.census.gov/programs-surveys/popest/datasets/2020-2023/cities/totals/sub-est2023.csv",
    file: "sub-est2023.csv",
  },
};

/** Population tiers: [tier, more than this many people]. */
const TIERS = [
  [1, 250_000],
  [2, 50_000],
  [3, 10_000],
];
/** Where the township or town is the place people name. */
const SUBDIVISION_STATES = new Set([
  "NJ",
  "PA",
  "CT",
  "MA",
  "ME",
  "NH",
  "RI",
  "VT",
]);
/** A place and a subdivision of the same name this close are one place. */
const SAME_PLACE = 8; // map units (about 36 km)
const DIGITS = 2;

// --- Sources ----------------------------------------------------------------

async function source({ url, file }) {
  const path = resolve(SOURCES, file);
  if (existsSync(path)) return path;
  mkdirSync(SOURCES, { recursive: true });
  console.log(`Downloading ${url}`);
  const response = await fetch(url, { headers: { "User-Agent": USER_AGENT } });
  if (!response.ok) throw new Error(`${url}: ${response.status}`);
  const body = Buffer.from(await response.arrayBuffer());
  if (url.endsWith(".zip")) {
    const zip = `${path}.zip`;
    writeFileSync(zip, body);
    execFileSync("unzip", ["-o", "-q", zip, file, "-d", SOURCES]);
  } else {
    writeFileSync(path, body);
  }
  return path;
}

/** A Gazetteer file (tab-separated, its last column padded with spaces). */
function readGazetteer(path) {
  const [header, ...lines] = readFileSync(path, "utf8").trim().split("\n");
  const columns = header.split("\t").map((column) => column.trim());
  return lines.map((line) => {
    const cells = line.split("\t").map((cell) => cell.trim());
    return Object.fromEntries(columns.map((column, i) => [column, cells[i]]));
  });
}

/** SUB-EST2023 (Latin-1): population by place and by county subdivision. */
function readPopulation(path) {
  const [header, ...lines] = readFileSync(path, "latin1").trim().split("\n");
  const columns = header.trim().split(",");
  const at = (name) => columns.indexOf(name);
  const [sumlev, state, county, place, cousub, pop] = [
    "SUMLEV",
    "STATE",
    "COUNTY",
    "PLACE",
    "COUSUB",
    "POPESTIMATE2023",
  ].map(at);
  const places = new Map();
  const subdivisions = new Map();
  for (const line of lines) {
    // No field holds a comma (names are unquoted), so a plain split holds.
    const cells = line.trim().split(",");
    const people = Number(cells[pop]);
    if (cells[sumlev] === "162")
      places.set(cells[state] + cells[place], people);
    if (cells[sumlev] === "061")
      subdivisions.set(cells[state] + cells[county] + cells[cousub], people);
  }
  return { places, subdivisions };
}

// --- Names ------------------------------------------------------------------

// Consolidated city-counties whose Census name is not the one on a map.
const RENAMES = {
  "Nashville-Davidson": "Nashville",
  "Lexington-Fayette": "Lexington",
  "Butte-Silver Bow": "Butte",
};
const KIND =
  / (city and borough|metro township|unified government|consolidated government|metropolitan government|metro government|urban county|municipality|corporation|plantation|township|borough|village|city|town|CDP)$/;

/** The name a map shows: no Census kind ("city", "CDP", "(balance)"). */
function displayName(censusName) {
  let name = censusName.replace(/ \(balance\)$/, "").replace(KIND, "");
  // "Athens-Clarke County", "Louisville/Jefferson County": the city.
  name = name.replace(/^(.+?)[-/].* County$/, "$1");
  return RENAMES[name] ?? name;
}

/** For matching names: case, punctuation and "Saint"/"St." aside. */
const key = (name) =>
  name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/^the /, "")
    .replace(/\bsaint\b/g, "st")
    .replace(/\bst\./g, "st")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();

// --- Build ------------------------------------------------------------------

const round = (value) => Math.round(value * 10 ** DIGITS) / 10 ** DIGITS;
const STATES = new Set(Object.values(USPS));
const project = (row) => {
  const lon = Number(row.INTPTLONG);
  const lat = Number(row.INTPTLAT);
  const point = projection([lon, lat]);
  return (
    point && {
      x: round(point[0]),
      y: round(point[1]),
      lat: Math.round(lat * 1000) / 1000,
      lon: Math.round(lon * 1000) / 1000,
    }
  );
};
const tierOf = (people) => TIERS.find(([, more]) => people > more)?.[0] ?? 0;

const population = readPopulation(await source(FILES.population));

/** Every candidate place, by state: Census places, then subdivisions. */
const candidates = new Map([...STATES].map((state) => [state, []]));
for (const row of readGazetteer(await source(FILES.places))) {
  if (!STATES.has(row.USPS)) continue;
  const at = project(row);
  if (!at) continue;
  candidates.get(row.USPS).push({
    name: displayName(row.NAME),
    ...at,
    people: population.places.get(row.GEOID) ?? 0,
    kind: "place",
  });
}
const subdivisionRows = readGazetteer(await source(FILES.subdivisions));
for (const row of subdivisionRows) {
  if (!STATES.has(row.USPS)) continue;
  // Active governments (A) and their consolidated kin (C); a subdivision
  // that is only a Census stand-in (F, S, N, I) is a place already, or
  // nobody's name for anywhere.
  const counts = SUBDIVISION_STATES.has(row.USPS) && /[AC]/.test(row.FUNCSTAT);
  // Elsewhere (New York's towns and boroughs: Queens, Hempstead) a
  // subdivision only names a NeighborNet's city.
  const at = project(row);
  if (!at) continue;
  const people = population.subdivisions.get(row.GEOID) ?? 0;
  const name = displayName(row.NAME);
  const list = candidates.get(row.USPS);
  // The same place as a Census place nearby (New Jersey's cities, New
  // England's town centres): one label, at the place's point (the town's
  // centre), with the larger population.
  const same = list.find(
    (other) =>
      other.kind === "place" &&
      key(other.name) === key(name) &&
      Math.hypot(other.x - at.x, other.y - at.y) < SAME_PLACE,
  );
  if (same) {
    if (counts) same.people = Math.max(same.people, people);
    continue;
  }
  list.push({ name, ...at, people, kind: counts ? "place" : "nn-only" });
}

// The NeighborNets' cities: always labelled.
const unmatched = [];
const nets = [...brotherLocations, ...sisterLocations].filter(
  (net) => net.country === "US" || !net.country,
);
const netCities = new Map();
for (const net of nets) {
  if (!net.city || !net.state) continue;
  // "Washington, DC": the city's name without its state.
  const name = net.city.replace(new RegExp(`, ${net.state}$`), "");
  const id = `${net.state}:${key(name)}`;
  const entry = netCities.get(id) ?? {
    ...net,
    city: name,
    points: [],
    nets: [],
  };
  entry.points.push(projection([net.longitude, net.latitude]));
  entry.nets.push(net);
  netCities.set(id, entry);
}
for (const city of netCities.values()) {
  const list = candidates.get(city.state);
  if (!list) continue;
  // The candidate of that name nearest the city's nets.
  const [nx, ny] = [0, 1].map(
    (i) =>
      city.points.reduce((sum, point) => sum + point[i], 0) /
      city.points.length,
  );
  const matches = list
    .filter((place) => key(place.name) === key(city.city))
    .sort(
      (a, b) => Math.hypot(a.x - nx, a.y - ny) - Math.hypot(b.x - nx, b.y - ny),
    );
  if (matches[0] && Math.hypot(matches[0].x - nx, matches[0].y - ny) < 25) {
    matches[0].nn = true;
    continue;
  }
  // Not a Census place by that name (a neighbourhood the geocoder named):
  // labelled at its nets' mean point.
  unmatched.push(`${city.city}, ${city.state}`);
  const mean = (field) =>
    Math.round(
      (city.nets.reduce((sum, net) => sum + net[field], 0) / city.nets.length) *
        1000,
    ) / 1000;
  list.push({
    name: city.city,
    x: round(nx),
    y: round(ny),
    lat: mean("latitude"),
    lon: mean("longitude"),
    people: 0,
    kind: "place",
    nn: true,
  });
}

// --- Output -----------------------------------------------------------------

/** Priority: tier 1, NeighborNet cities, tier 2, tier 3. */
const rank = (label) =>
  label.tier === 1 ? 0 : label.nn ? 1 : label.tier === 2 ? 2 : 3;

mkdirSync(OUT_DIR, { recursive: true });
let total = 0;
let netLabels = 0;
const sizes = [];
for (const [state, list] of candidates) {
  const labels = list
    .map((place) => ({ ...place, tier: tierOf(place.people) }))
    .filter((place) => place.nn || (place.kind === "place" && place.tier > 0))
    .sort((a, b) => rank(a) - rank(b) || b.people - a.people);
  // A name twice (a city and a same-named township elsewhere in the state)
  // is fine; the same name at the same spot is not.
  const seen = new Set();
  const unique = labels.filter((label) => {
    const id = `${key(label.name)}@${Math.round(label.x)},${Math.round(label.y)}`;
    if (seen.has(id)) return false;
    seen.add(id);
    return true;
  });
  total += unique.length;
  netLabels += unique.filter((label) => label.nn).length;
  const json = JSON.stringify(
    unique.map((label) => [
      label.name,
      label.x,
      label.y,
      label.kind === "place" ? label.tier : 0,
      label.nn ? 1 : 0,
    ]),
  );
  const text = await format(json, { parser: "json" });
  writeFileSync(resolve(OUT_DIR, `${state}.json`), text);
  sizes.push([state, unique.length, Buffer.byteLength(text)]);
}

const codes = [...STATES].sort();
const index = `// Generated by scripts/neighbornets-context.mjs. Do not edit directly.

/**
 * A place label: its name, its point in map units, its population tier
 * (1: over 250,000; 2: over 50,000; 3: over 10,000; 0: smaller) and
 * whether a NeighborNet meets there (1). A state's labels are listed by
 * priority: tier 1, NeighborNet cities, then tiers 2 and 3.
 */
export type ContextLabel = readonly [
  name: string,
  x: number,
  y: number,
  tier: 0 | 1 | 2 | 3,
  neighborNet: 0 | 1,
];

/** Each state's labels, loaded on demand (one chunk per state). */
export const CONTEXT_LABELS: Record<
  string,
  () => Promise<{ default: unknown }>
> = {
${codes.map((code) => `  ${code}: () => import("./${code}.json"),`).join("\n")}
};
`;
writeFileSync(
  resolve(OUT_DIR, "index.ts"),
  await format(index, { parser: "typescript" }),
);

// --- Search index -------------------------------------------------------
//
// The map's search (src/app/neighbornets/map-search.ts) finds a place by
// name, or a ZIP, with no geocoding service: every Census place (and New
// England, New Jersey and Pennsylvania town) and every NeighborNet city, one
// chunk per first letter of its search text, and every ZIP code area's
// internal point (2023 ZCTA Gazetteer), one chunk per first two digits.
// Each chunk is loaded only when a query needs it.

mkdirSync(SEARCH_DIR, { recursive: true });
const tenth = (value) => Math.round(value * 10) / 10;
const hundredth = (value) => Math.round(value * 100) / 100;
// Written minified (and left out of Prettier): what ships is what is here.
const byLetter = new Map();
for (const [state, list] of candidates) {
  // One entry per name in a state: its NeighborNet city, else its largest.
  const best = new Map();
  for (const place of list) {
    if (place.kind !== "place" && !place.nn) continue;
    const text = normalizeSearchText(place.name);
    if (!text) continue;
    const held = best.get(text);
    if (
      !held ||
      (place.nn && !held.nn) ||
      (Boolean(place.nn) === Boolean(held.nn) && place.people > held.people)
    )
      best.set(text, place);
  }
  for (const [text, place] of best) {
    const letter = placeChunkKey(text);
    const rows = byLetter.get(letter) ?? [];
    // Coarse enough for a search (0.1 map unit, about 450 m; 0.01 degrees,
    // about 1 km), small enough to load per keystroke's letter.
    rows.push([
      place.name,
      state,
      tenth(place.x),
      tenth(place.y),
      hundredth(place.lat),
      hundredth(place.lon),
      Math.round(place.people / 1000),
      place.nn ? 1 : 0,
    ]);
    byLetter.set(letter, rows);
  }
}
let searchPlaces = 0;
for (const [letter, rows] of byLetter) {
  rows.sort((a, b) => b[7] - a[7] || b[6] - a[6]);
  searchPlaces += rows.length;
  writeFileSync(
    resolve(SEARCH_DIR, `places-${letter}.json`),
    `${JSON.stringify(rows)}\n`,
  );
}

// ZIPs outside the lower 48 and DC (Puerto Rico and the islands, Hawaii,
// the Pacific territories, Alaska) are not on the map.
const OFF_MAP_ZIP = /^(00[6-9]|96[7-9]|99[5-9])/;
const byPrefix = new Map();
for (const row of readGazetteer(await source(FILES.zips))) {
  const zip = row.GEOID;
  if (OFF_MAP_ZIP.test(zip)) continue;
  const at = project(row);
  if (!at || at.x < 0 || at.x > 1000 || at.y < 0 || at.y > 640) continue;
  const prefix = zip.slice(0, 2);
  const rows = byPrefix.get(prefix) ?? [];
  rows.push([
    zip,
    tenth(at.x),
    tenth(at.y),
    hundredth(at.lat),
    hundredth(at.lon),
  ]);
  byPrefix.set(prefix, rows);
}
let searchZips = 0;
for (const [prefix, rows] of byPrefix) {
  searchZips += rows.length;
  writeFileSync(
    resolve(SEARCH_DIR, `zips-${prefix}.json`),
    `${JSON.stringify(rows)}\n`,
  );
}

const letters = [...byLetter.keys()].sort();
const prefixes = [...byPrefix.keys()].sort();
const searchIndex = `// Generated by scripts/neighbornets-context.mjs. Do not edit directly.

/**
 * A searchable place: its name, USPS state, point in map units, latitude
 * and longitude, population in thousands, and whether a NeighborNet meets
 * there (1). A chunk lists NeighborNet cities first, then by population.
 */
export type SearchPlace = readonly [
  name: string,
  state: string,
  x: number,
  y: number,
  latitude: number,
  longitude: number,
  thousands: number,
  neighborNet: 0 | 1,
];

/** A ZIP code area: the ZIP, its point in map units, latitude, longitude. */
export type SearchZip = readonly [
  zip: string,
  x: number,
  y: number,
  latitude: number,
  longitude: number,
];

type Chunk = () => Promise<{ default: unknown }>;

/** Places by the first letter of their search text ("0": a digit). */
export const SEARCH_PLACES: Record<string, Chunk> = {
${letters.map((letter) => `  ${letter === "0" ? '"0"' : letter}: () => import("./places-${letter}.json"),`).join("\n")}
};

/** ZIP code areas by their first two digits. */
export const SEARCH_ZIPS: Record<string, Chunk> = {
${prefixes.map((prefix) => `  "${prefix}": () => import("./zips-${prefix}.json"),`).join("\n")}
};
`;
writeFileSync(
  resolve(SEARCH_DIR, "index.ts"),
  await format(searchIndex, { parser: "typescript" }),
);
console.log(
  `Search: ${searchPlaces} places in ${letters.length} chunks, ${searchZips} ZIPs in ${prefixes.length} chunks.`,
);

sizes.sort((a, b) => b[2] - a[2]);
console.log(
  `${total} labels in ${codes.length} states (${netLabels} NeighborNet cities, ${netCities.size} named). Largest: ${sizes
    .slice(0, 4)
    .map(
      ([state, count, bytes]) =>
        `${state} ${count} (${(bytes / 1024).toFixed(1)} KB)`,
    )
    .join(", ")}.`,
);
if (unmatched.length)
  console.log(
    `  not a Census place, labelled at the nets: ${unmatched.join("; ")}`,
  );
