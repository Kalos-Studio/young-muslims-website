import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { parse } from "csv-parse/sync";

import { normalizeName, toCsv } from "./neighbornet-data.mjs";

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const sourcePath = resolve(projectRoot, "data/brother-neighbornets-source.csv");
const basePath = resolve(projectRoot, "data/neighbornets.csv");
const sisterPath = resolve(projectRoot, "data/sister-neighbornets.csv");
const outputPath = resolve(
  projectRoot,
  "data/brother-neighbornets-additions.csv",
);

const sourceRows = readCsv(sourcePath);
const baseRows = readCsv(basePath);
const sisterRows = readCsv(sisterPath);
const existingRows = existsSync(outputPath) ? readCsv(outputPath) : [];
const existingByKey = new Map(existingRows.map((row) => [rowKey(row), row]));
const sisterByKey = new Map(sisterRows.map((row) => [rowKey(row), row]));
const baseNames = new Set(
  baseRows.map((row) => normalizeName(row.neighbor_net)),
);

const existingNameAliases = {
  Cstat: "College Station",
  Gainesville: "Gainesville - FL",
  Lilburn: "Liburn",
  Locks: "Windsor Locks",
  Maryam: "Masjid Maryam",
  Shelterock: "Shelter Rock",
};

const geocodeQueries = {
  "TX|austin": "Austin, Texas, USA",
  "PA|khair": "435 North 60th Street, Philadelphia, Pennsylvania 19151, USA",
  "PA|masjid al nur":
    "5247 Simpson Ferry Road, Mechanicsburg, Pennsylvania 17050, USA",
  "TX|maskaty": "Katy, Texas, USA",
  "TX|ym masjid hamza": "6233 Tres Lagunas Drive, Houston, Texas 77083, USA",
  "NV|metro west": "Las Vegas, Nevada, USA",
  "CA|brighton": "Brighton, Sacramento, California, USA",
  "ON|mississauga": "Mississauga, Ontario, Canada",
};

const manualCoordinates = {
  "TX|austin": {
    latitude: "30.271129",
    longitude: "-97.743700",
    geocodeSource: "reviewed Austin city center",
  },
  "TX|ym masjid hamza": {
    latitude: "29.710300",
    longitude: "-95.638800",
    geocodeSource: "reviewed Masjid Hamza coordinate",
  },
};

for (const [sourceName, existingName] of Object.entries(existingNameAliases)) {
  if (baseNames.has(normalizeName(existingName))) {
    baseNames.add(normalizeName(sourceName));
  }
}

const additions = sourceRows.filter((row) => {
  const name = normalizeName(row.neighbor_net);
  return name !== "calgary" && !baseNames.has(name);
});

const outputRows = [];
let networkLookups = 0;

for (const [index, row] of additions.entries()) {
  const key = rowKey(row);
  const manual = manualCoordinates[key];
  if (manual) {
    outputRows.push({
      ...row,
      latitude: manual.latitude,
      longitude: manual.longitude,
      geocode_source: manual.geocodeSource,
    });
    continue;
  }

  const existing = existingByKey.get(key);
  if (validCoordinates(existing)) {
    outputRows.push({ ...row, ...coordinateFields(existing) });
    continue;
  }

  const sister = sisterByKey.get(key);
  if (validCoordinates(sister)) {
    outputRows.push({
      ...row,
      latitude: Number(sister.latitude).toFixed(6),
      longitude: Number(sister.longitude).toFixed(6),
      geocode_source: "matching sisters chapter",
    });
    continue;
  }

  const query = geocodeQueries[key] ?? `${row.neighbor_net}, ${row.region}`;
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
    `[${index + 1}/${additions.length}] ${row.neighbor_net}, ${row.state} -> ${result.lat}, ${result.lon}`,
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
      "email",
      "instagram",
      "source_url",
      "geocode_source",
    ],
    outputRows,
  ),
);

console.log(
  `Wrote ${outputRows.length} new Brothers NeighborNets (${networkLookups} network lookups); Calgary excluded.`,
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
    longitude <= -50
  );
}

function coordinateFields(row) {
  return {
    latitude: Number(row.latitude).toFixed(6),
    longitude: Number(row.longitude).toFixed(6),
    geocode_source: row.geocode_source || "preserved reviewed coordinate",
  };
}

async function geocode(query, expectedRegion) {
  const url = new URL("https://nominatim.openstreetmap.org/search");
  url.search = new URLSearchParams({
    q: query,
    format: "jsonv2",
    addressdetails: "1",
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
    results.find((result) => resultRegion(result) === expectedRegion) ?? null
  );
}

function resultRegion(result) {
  const iso =
    result.address?.["ISO3166-2-lvl4"] ?? result.address?.["ISO3166-2-lvl3"];
  return iso?.split("-").at(-1) ?? "";
}

function wait(milliseconds) {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}
