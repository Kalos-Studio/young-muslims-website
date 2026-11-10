// Backfills each NeighborNet's place (city, state, ZIP, country) from its
// coordinates, once, at build-data time: OpenStreetMap Nominatim's reverse
// geocoder, at its 1 request per second limit. Nothing calls a geocoder at
// runtime; the results are committed to data/neighbornet-places.csv, which
// scripts/generate-neighbornets.mjs merges into the generated locations.
//
// Cached by ID and coordinates: only new or moved NeighborNets are looked up,
// so re-running is cheap. Review the CSV after a run; a row can be corrected
// by hand (set `source` to `manual` and it is never overwritten): where the
// coordinates fall in an unincorporated area the geocoder names only the
// county or township, so the manual rows give the place people use.
//
//   bun scripts/reverse-geocode-neighbornets.mjs
//   bun scripts/reverse-geocode-neighbornets.mjs --normalize   (no lookups)
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { parse } from "csv-parse/sync";

import { brotherLocations } from "../src/generated/brother-neighbornets.ts";
import { sisterLocations } from "../src/generated/sister-neighbornets.ts";
import { toCsv } from "./neighbornet-data.mjs";

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const outputPath = resolve(projectRoot, "data/neighbornet-places.csv");
const COLUMNS = [
  "id",
  "latitude",
  "longitude",
  "city",
  "state",
  "postal_code",
  "country",
  "source",
];

if (process.argv.includes("--normalize")) {
  // Re-applies placeName to the committed geocoder rows, without lookups.
  const rows = parse(readFileSync(outputPath, "utf8"), {
    columns: true,
    trim: true,
  }).map((row) =>
    row.source === "nominatim" ? { ...row, city: placeName(row.city) } : row,
  );
  writeFileSync(outputPath, toCsv(COLUMNS, rows));
  console.log(`Normalized ${rows.length} places.`);
  process.exit(0);
}

const existing = existsSync(outputPath)
  ? parse(readFileSync(outputPath, "utf8"), { columns: true, trim: true })
  : [];
const byId = new Map(existing.map((row) => [row.id, row]));
const locations = [...brotherLocations, ...sisterLocations];
const rows = [];
let looked = 0;

for (const location of locations) {
  const cached = byId.get(location.id);
  const latitude = location.latitude.toFixed(6);
  const longitude = location.longitude.toFixed(6);
  if (
    cached &&
    (cached.source === "manual" ||
      (cached.latitude === latitude && cached.longitude === longitude))
  ) {
    rows.push(cached);
    continue;
  }
  if (looked > 0) await wait(1100);
  looked += 1;
  const place = await reverseGeocode(location.latitude, location.longitude);
  rows.push({ id: location.id, latitude, longitude, ...place });
  console.log(
    `${location.id}: ${place.city}, ${place.state} ${place.postal_code}`,
  );
}

rows.sort((a, b) => a.id.localeCompare(b.id));
writeFileSync(outputPath, toCsv(COLUMNS, rows));
console.log(`Looked up ${looked}; wrote ${rows.length} places.`);

async function reverseGeocode(latitude, longitude) {
  const url = new URL("https://nominatim.openstreetmap.org/reverse");
  url.search = new URLSearchParams({
    lat: String(latitude),
    lon: String(longitude),
    format: "jsonv2",
    addressdetails: "1",
    zoom: "18",
  });
  const response = await fetch(url, {
    headers: {
      "User-Agent":
        "YoungMuslimsWebsite/1.0 (+https://youngmuslims.com; one-time chapter import)",
      Referer: "https://youngmuslims.com/",
    },
  });
  if (!response.ok) {
    throw new Error(`Geocoder returned ${response.status} for ${url}`);
  }
  const { address = {} } = await response.json();
  return {
    city: cityOf(address),
    state: (address["ISO3166-2-lvl4"] ?? "").split("-")[1] ?? "",
    postal_code: (address.postcode ?? "").split(/[-;:]/)[0].trim(),
    country: (address.country_code ?? "").toUpperCase(),
    source: "nominatim",
  };
}

/**
 * The place a visitor would name: the city, town or village; in New York
 * City, the borough (nobody says they live in "City of New York").
 */
function cityOf(address) {
  const city =
    address.city ??
    address.town ??
    address.village ??
    address.hamlet ??
    address.municipality ??
    address.suburb ??
    address.county ??
    "";
  if (/^(city of )?new york$/i.test(city)) {
    return address.borough ?? address.city_district ?? address.suburb ?? city;
  }
  return placeName(city);
}

/**
 * The name people use, without the municipal form: "Old Bridge Township" is
 * Old Bridge, "Village of Valley Stream" is Valley Stream.
 */
export function placeName(name) {
  return name
    .replace(/^(?:city|town|village|borough) of /i, "")
    .replace(/ township$/i, "");
}

function wait(milliseconds) {
  return new Promise((done) => setTimeout(done, milliseconds));
}
