import { brotherLocations } from "@/generated/brother-neighbornets";
import {
  MAP_POINTS,
  MAP_STATE_INDEX,
  type MapPoint,
} from "@/generated/neighbornets-map-index";
import {
  SEARCH_PLACES,
  SEARCH_ZIPS,
  type SearchPlace,
  type SearchZip,
} from "@/generated/neighbornets-search";
import { sisterLocations } from "@/generated/sister-neighbornets";
import type { NeighborNetLocation } from "@/lib/neighbornets";
import { normalizeSearchText, placeChunkKey } from "@/lib/search-text";

/**
 * The NeighborNets map's search: local, no geocoding service. It knows the
 * NeighborNets (name, city, ZIP), the states (name or USPS code), every
 * Census place and New England, New Jersey and Pennsylvania town, and every
 * ZIP code area (scripts/neighbornets-context.mjs: chunks loaded as a query
 * needs them, by first letter or first two digits).
 *
 * A place (a city, a ZIP) is found as a point; its results are the
 * NeighborNets within the search radius of it, nearest first. A place with
 * none in reach offers the nearest few instead, with their distances.
 */

/** Map units and degrees of a place. */
export type Spot = { x: number; y: number; lat: number; lon: number };

export type Suggestion =
  | { kind: "state"; code: string; label: string; detail: string }
  | { kind: "place"; spot: Spot; name: string; label: string; detail: string }
  | { kind: "net"; id: string; label: string; detail: string }
  | { kind: "zip"; zip: string; spot: Spot; label: string; detail: string };

export type SearchResult =
  | { kind: "state"; code: string }
  /** NeighborNets for the query: `ids` nearest first, `focus` the place. */
  | { kind: "nets"; query: string; ids: string[]; focus?: Spot }
  /** A place with no NeighborNet in reach: the nearest, with miles. */
  | {
      kind: "nearest";
      query: string;
      place: string;
      focus: Spot;
      nearest: { id: string; miles: number }[];
    }
  | { kind: "none"; query: string };

export type SearchOptions = {
  /** NeighborNets within this many miles of a place are its results. */
  radiusMiles: number;
  /** How many nearest NeighborNets a place without one offers. */
  nearestCount: number;
  /** How many suggestions the field lists. */
  suggestionCount: number;
};

type Net = { net: NeighborNetLocation; point: MapPoint; text: string };

const POINTS = new Map(MAP_POINTS.map((point) => [point.id, point]));
/** The NeighborNets on the map (not those beyond it). */
const NETS: Net[] = [...brotherLocations, ...sisterLocations].flatMap((net) => {
  const point = POINTS.get(net.id);
  return point ? [{ net, point, text: normalizeSearchText(net.name) }] : [];
});
const NET_BY_ID = new Map(NETS.map((entry) => [entry.net.id, entry]));
const STATES = MAP_STATE_INDEX.map((state) => ({
  ...state,
  text: normalizeSearchText(state.name),
  abbr: state.code.toLowerCase(),
  count: MAP_POINTS.filter((point) => point.state === state.code).length,
}));
const STATE_BY_TEXT = new Map(
  STATES.flatMap((state) => [
    [state.text, state],
    [state.abbr, state],
  ]),
);

// --- Index chunks --------------------------------------------------------

const places = new Map<string, Promise<readonly SearchPlace[]>>();
const zips = new Map<string, Promise<readonly SearchZip[]>>();
const loadedPlaces = new Map<string, readonly SearchPlace[]>();
const loadedZips = new Map<string, readonly SearchZip[]>();

function loadChunk<T>(
  key: string,
  loaders: Record<string, () => Promise<{ default: unknown }>>,
  cache: Map<string, Promise<readonly T[]>>,
  loaded: Map<string, readonly T[]>,
): Promise<readonly T[]> {
  const load = loaders[key];
  if (!load) return Promise.resolve([]);
  let chunk = cache.get(key);
  if (!chunk) {
    chunk = load()
      .then((module) => {
        const rows = module.default as readonly T[];
        loaded.set(key, rows);
        return rows;
      })
      .catch(() => {
        cache.delete(key); // offline: try again next time
        return [] as readonly T[];
      });
    cache.set(key, chunk);
  }
  return chunk;
}

const placesFor = (text: string) =>
  loadChunk(placeChunkKey(text), SEARCH_PLACES, places, loadedPlaces);
const zipsFor = (zip: string) =>
  loadChunk(zip.slice(0, 2), SEARCH_ZIPS, zips, loadedZips);

/**
 * Load what suggestions for `query` need (its letter's places, its ZIP
 * prefix's areas). Resolves once they are in; suggest again then.
 */
export async function prepareSearch(query: string): Promise<void> {
  const text = normalizeSearchText(query);
  if (!text) return;
  if (/^\d{2}/.test(text)) await zipsFor(text);
  else await placesFor(text);
}

// --- Matching ------------------------------------------------------------

/**
 * How well `text` matches the query `q` (0: not at all): the whole of it,
 * its start, a word's start, inside it, or (a query of four letters or
 * more) its start but for one letter.
 */
function score(text: string, q: string): number {
  if (text === q) return 100;
  if (text.startsWith(q)) return 80;
  if (` ${text}`.includes(` ${q}`)) return 60;
  if (q.length >= 3 && text.includes(q)) return 40;
  if (q.length >= 4 && withinOne(text.slice(0, q.length), q)) return 30;
  return 0;
}

/** Whether `a` and `b` (the same length) differ by at most one edit. */
function withinOne(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) {
    if (a[i] === b[i]) continue;
    // A swapped pair counts as one.
    if (a[i] === b[i + 1] && a[i + 1] === b[i] && i + 1 < a.length) i++;
    if (++diff > 1) return false;
  }
  return true;
}

/**
 * "Houston, TX", "Houston Texas", "New York New York": the place and the
 * state, if the text ends in one (the longest state that ends it).
 */
function splitState(text: string): { name: string; state: string | null } {
  const words = text.split(" ");
  for (let i = 1; i < words.length; i++) {
    const state = STATE_BY_TEXT.get(words.slice(i).join(" "));
    if (state) return { name: words.slice(0, i).join(" "), state: state.code };
  }
  return { name: text, state: null };
}

const spotOf = (row: SearchPlace | SearchZip): Spot =>
  row.length === 8
    ? { x: row[2], y: row[3], lat: row[4], lon: row[5] }
    : { x: row[1], y: row[2], lat: row[3], lon: row[4] };

/** Great-circle miles between two points (degrees). */
export function milesBetween(
  a: { lat: number; lon: number },
  b: { lat: number; lon: number },
): number {
  const rad = Math.PI / 180;
  const dLat = (b.lat - a.lat) * rad;
  const dLon = (b.lon - a.lon) * rad;
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(a.lat * rad) * Math.cos(b.lat * rad) * Math.sin(dLon / 2) ** 2;
  return 3958.8 * 2 * Math.asin(Math.sqrt(h));
}

const netSpot = ({ net, point }: Net): Spot => ({
  x: point.x,
  y: point.y,
  lat: net.latitude,
  lon: net.longitude,
});

/** The NeighborNets by distance from `spot`, with miles. */
function byDistance(spot: Spot) {
  return NETS.map((entry) => ({
    id: entry.net.id,
    miles: milesBetween(spot, netSpot(entry)),
  })).sort((a, b) => a.miles - b.miles);
}

const plural = (count: number, one: string) =>
  `${count} ${one}${count === 1 ? "" : "s"}`;

/** The suggestions for what has been typed so far (loaded chunks only). */
export function suggest(query: string, options: SearchOptions): Suggestion[] {
  const q = normalizeSearchText(query);
  if (!q) return [];
  const found: { score: number; suggestion: Suggestion }[] = [];
  const near = (spot: Spot) =>
    byDistance(spot).filter((entry) => entry.miles <= options.radiusMiles)
      .length;

  if (/^\d+$/.test(q)) {
    // A ZIP: the areas that start so, NeighborNet ZIPs first.
    const rows = loadedZips.get(q.slice(0, 2)) ?? [];
    const netZips = new Set(NETS.map(({ net }) => net.postalCode));
    for (const row of rows) {
      if (!row[0].startsWith(q)) continue;
      const spot = spotOf(row);
      const count = q.length === 5 ? near(spot) : 0;
      found.push({
        score: (netZips.has(row[0]) ? 90 : 50) + (row[0] === q ? 10 : 0),
        suggestion: {
          kind: "zip",
          zip: row[0],
          spot,
          label: row[0],
          detail: count ? `${plural(count, "NeighborNet")} nearby` : "ZIP code",
        },
      });
    }
  } else {
    const { name, state } = splitState(q);
    for (const entry of STATES) {
      const s = Math.max(score(entry.text, q), entry.abbr === q ? 100 : 0);
      if (s)
        found.push({
          score: s + 5,
          suggestion: {
            kind: "state",
            code: entry.code,
            label: entry.name,
            detail: plural(entry.count, "NeighborNet"),
          },
        });
    }
    for (const row of loadedPlaces.get(placeChunkKey(name)) ?? []) {
      if (state && row[1] !== state) continue;
      const s = score(normalizeSearchText(row[0]), name);
      if (!s) continue;
      // Bigger places and NeighborNet cities first among equals.
      const weight = s + Math.log10(row[6] + 1) * 4 + (row[7] ? 12 : 0);
      found.push({
        score: weight,
        suggestion: {
          kind: "place",
          spot: spotOf(row),
          name: row[0],
          label: `${row[0]}, ${row[1]}`,
          detail: "",
        },
      });
    }
    for (const entry of NETS) {
      const s = score(entry.text, q);
      // A NeighborNet's own name ahead of places of that name.
      if (s)
        found.push({
          score: s + 15,
          suggestion: {
            kind: "net",
            id: entry.net.id,
            label: entry.net.name,
            detail: [
              entry.net.branch === "brothers" ? "Brothers" : "Sisters",
              entry.net.city && `${entry.net.city}, ${entry.net.state}`,
            ]
              .filter(Boolean)
              .join(" · "),
          },
        });
    }
  }

  found.sort((a, b) => b.score - a.score);
  // No more than one of a label (a city and its same-named net), and the
  // places' counts read only for those shown.
  const seen = new Set<string>();
  const list: Suggestion[] = [];
  for (const { suggestion } of found) {
    const id = `${suggestion.kind === "net" ? "net" : "where"}:${suggestion.label}`;
    if (seen.has(id)) continue;
    seen.add(id);
    if (suggestion.kind === "place") {
      const count = near(suggestion.spot);
      suggestion.detail = count
        ? `${plural(count, "NeighborNet")} nearby`
        : "No NeighborNet nearby yet";
    }
    list.push(suggestion);
    if (list.length >= options.suggestionCount) break;
  }
  return list;
}

/** What a place's search finds: its NeighborNets in reach, or the nearest. */
function locate(
  query: string,
  place: string,
  focus: Spot,
  options: SearchOptions,
): SearchResult {
  const ranked = byDistance(focus);
  const inReach = ranked.filter((entry) => entry.miles <= options.radiusMiles);
  if (inReach.length > 0)
    return {
      kind: "nets",
      query,
      ids: inReach.map((entry) => entry.id),
      focus,
    };
  return {
    kind: "nearest",
    query,
    place,
    focus,
    nearest: ranked.slice(0, options.nearestCount),
  };
}

/** Act on a suggestion. */
export function resultFor(
  suggestion: Suggestion,
  options: SearchOptions,
): SearchResult {
  switch (suggestion.kind) {
    case "state":
      return { kind: "state", code: suggestion.code };
    case "net":
      return { kind: "nets", query: suggestion.label, ids: [suggestion.id] };
    case "place":
      return locate(
        suggestion.name,
        suggestion.label,
        suggestion.spot,
        options,
      );
    case "zip":
      return locate(suggestion.zip, suggestion.zip, suggestion.spot, options);
  }
}

/**
 * Resolve a submitted query: a ZIP; a state (name or code); a NeighborNet
 * by name; a place (optionally "City, ST"), the NeighborNet city or else the
 * largest of that name; failing all, the best suggestion that matches at
 * least a word's start (or, four letters on, all but one letter); else
 * nothing.
 */
export async function resolveSearch(
  query: string,
  options: SearchOptions,
): Promise<SearchResult> {
  const trimmed = query.trim();
  const q = normalizeSearchText(trimmed);
  if (!q) return { kind: "none", query: trimmed };

  const zip = q.match(/^(\d{5})(?: ?\d{4})?$/)?.[1];
  if (zip) {
    const rows = await zipsFor(zip);
    const row = rows.find((candidate) => candidate[0] === zip);
    if (row) return locate(zip, zip, spotOf(row), options);
    // Not a ZIP code area, but a NeighborNet's ZIP (a PO box, say).
    const nets = NETS.filter(({ net }) => net.postalCode === zip);
    if (nets.length > 0) return locate(zip, zip, netSpot(nets[0]), options);
    return { kind: "none", query: trimmed };
  }

  const state = STATE_BY_TEXT.get(q);
  if (state) return { kind: "state", code: state.code };

  const named = NETS.filter((entry) => entry.text === q);
  if (named.length > 0)
    return {
      kind: "nets",
      query: trimmed,
      ids: named.map((entry) => entry.net.id),
    };

  const { name, state: inState } = splitState(q);
  const rows = await placesFor(name);
  const place = rows.find(
    (row) =>
      normalizeSearchText(row[0]) === name && (!inState || row[1] === inState),
  ); // rows list NeighborNet cities first, then the largest
  if (place)
    return locate(place[0], `${place[0]}, ${place[1]}`, spotOf(place), options);

  const [best] = suggest(trimmed, options);
  if (best && (await isConfident(best, trimmed)))
    return resultFor(best, options);
  return { kind: "none", query: trimmed };
}

/**
 * A fallback suggestion counts if it matches at least a word's start, or
 * (four letters or more) is the same but for one letter: "Hosuton" finds
 * Houston, as the list already suggests.
 */
async function isConfident(suggestion: Suggestion, query: string) {
  const q = normalizeSearchText(query);
  const text = normalizeSearchText(
    suggestion.kind === "place" ? suggestion.name : suggestion.label,
  );
  const best = Math.max(score(text, splitState(q).name), score(text, q));
  return best >= 60 || (best >= 30 && q.length >= 4);
}

/** A NeighborNet's record, for the panels. */
export function netById(id: string): NeighborNetLocation | undefined {
  return NET_BY_ID.get(id)?.net;
}
