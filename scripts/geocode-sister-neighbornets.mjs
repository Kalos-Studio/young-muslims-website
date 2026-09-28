import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { parse } from "csv-parse/sync";

import {
  brotherRegionStates,
  normalizeName,
  toCsv,
} from "./neighbornet-data.mjs";

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const sourcePath = resolve(projectRoot, "data/sister-neighbornets-source.csv");
const brotherPath = resolve(projectRoot, "data/neighbornets.csv");
const outputPath = resolve(projectRoot, "data/sister-neighbornets.csv");

const sourceRows = readCsv(sourcePath);
const existingRows = existsSync(outputPath) ? readCsv(outputPath) : [];
const brothers = readCsv(brotherPath);
const existingByKey = new Map(existingRows.map((row) => [rowKey(row), row]));
const brothersByKey = new Map();

const geocodeQueries = {
  "IN|illiana": "Dyer, Indiana, USA",
  "IN|north indy": "north Indianapolis, Indiana, USA",
  "IN|west indy": "west Indianapolis, Indiana, USA",
  "MA|acton boxborough": "Acton, Massachusetts, USA",
  "NJ|571": "West Windsor, New Jersey, USA",
  "NY|kensington": "Kensington, Brooklyn, New York, USA",
  "PA|delco": "Media, Pennsylvania, USA",
  "PA|philly": "Philadelphia, Pennsylvania, USA",
  "TX|dezavala": "De Zavala Road, San Antonio, Texas, USA",
  "TX|shadow creek": "Shadow Creek Ranch, Pearland, Texas, USA",
  "DC|dc": "Washington, District of Columbia, USA",
};

const manualCoordinates = {
  "AZ|east valley": { latitude: "33.415200", longitude: "-111.831500" },
  "IL|ampo": { latitude: "41.760600", longitude: "-88.320100" },
  "IL|iccd": { latitude: "42.033400", longitude: "-87.883400" },
  "IN|west indy": { latitude: "39.768400", longitude: "-86.200000" },
  "MD|bel air": { latitude: "39.535900", longitude: "-76.348300" },
};

for (const row of brothers) {
  const state = brotherRegionStates[row.subregion];
  if (!state)
    throw new Error(`No state mapping for brother region ${row.subregion}`);
  brothersByKey.set(`${state}|${normalizeName(row.neighbor_net)}`, row);
}

const outputRows = [];
let networkLookups = 0;

for (const [index, row] of sourceRows.entries()) {
  const key = rowKey(row);
  const manual = manualCoordinates[key];
  if (manual) {
    outputRows.push({
      ...row,
      latitude: manual.latitude,
      longitude: manual.longitude,
      geocode_source: "manual city center",
    });
    continue;
  }

  const existing = existingByKey.get(key);
  if (validCoordinates(existing)) {
    outputRows.push({ ...row, ...coordinateFields(existing) });
    continue;
  }

  const brother = brotherMatch(row, brothersByKey);
  if (brother) {
    outputRows.push({
      ...row,
      latitude: Number(brother.latitude).toFixed(6),
      longitude: Number(brother.longitude).toFixed(6),
      geocode_source: "matching brothers chapter",
    });
    continue;
  }

  const query =
    geocodeQueries[key] ?? `${row.neighbor_net}, ${row.region}, USA`;
  const result = await geocode(query, row.state);
  networkLookups += 1;
  if (!result) {
    throw new Error(
      `No geocoding result for ${row.neighbor_net}, ${row.region}. Add a reviewed override and rerun.`,
    );
  }

  outputRows.push({
    ...row,
    latitude: Number(result.lat).toFixed(6),
    longitude: Number(result.lon).toFixed(6),
    geocode_source: `Nominatim: ${result.display_name}`,
  });

  console.log(
    `[${index + 1}/${sourceRows.length}] ${row.neighbor_net}, ${row.state} -> ${result.lat}, ${result.lon}`,
  );
  await wait(1100);
}

writeFileSync(
  outputPath,
  toCsv(
    [
      "neighbor_net",
      "region",
      "state",
      "latitude",
      "longitude",
      "instagram",
      "source_url",
      "geocode_source",
    ],
    outputRows,
  ),
);

console.log(
  `Wrote ${outputRows.length} geocoded Sisters NeighborNets (${networkLookups} network lookups).`,
);

function readCsv(path) {
  return parse(readFileSync(path, "utf8"), {
    columns: true,
    skip_empty_lines: true,
    trim: true,
  });
}

function rowKey(row) {
  return `${row.state}|${normalizeName(row.neighbor_net)}`;
}

function validCoordinates(row) {
  if (!row) return false;
  const latitude = Number(row.latitude);
  const longitude = Number(row.longitude);
  return (
    Number.isFinite(latitude) &&
    latitude >= 18 &&
    latitude <= 72 &&
    Number.isFinite(longitude) &&
    longitude >= -180 &&
    longitude <= -65
  );
}

function coordinateFields(row) {
  return {
    latitude: Number(row.latitude).toFixed(6),
    longitude: Number(row.longitude).toFixed(6),
    geocode_source: row.geocode_source || "preserved reviewed coordinate",
  };
}

function brotherMatch(row, byKey) {
  const aliases = {
    "FL|pompano beach": "pompano",
    "NJ|white marsh": "whitemarsh",
    "VA|gainesville": "gainesville va",
  };
  const key = rowKey(row);
  return (
    byKey.get(key) ?? byKey.get(`${row.state}|${aliases[key] ?? "__none__"}`)
  );
}

async function geocode(query, expectedState) {
  const url = new URL("https://nominatim.openstreetmap.org/search");
  url.search = new URLSearchParams({
    q: query,
    format: "jsonv2",
    addressdetails: "1",
    countrycodes: "us",
    limit: "5",
  });
  const response = await fetch(url, {
    headers: {
      "User-Agent":
        "YoungMuslimsWebsite/1.0 (+https://youngmuslims.com; one-time chapter import)",
      Referer: "https://youngmuslims.com/",
    },
  });
  if (!response.ok) {
    throw new Error(`Geocoder returned ${response.status} for ${query}`);
  }
  const results = await response.json();
  return (
    results.find((result) => resultState(result) === expectedState) ??
    results[0] ??
    null
  );
}

function resultState(result) {
  const iso = result.address?.["ISO3166-2-lvl4"];
  if (iso?.startsWith("US-")) return iso.slice(3);
  if (result.address?.state === "District of Columbia") return "DC";
  return "";
}

function wait(milliseconds) {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}
