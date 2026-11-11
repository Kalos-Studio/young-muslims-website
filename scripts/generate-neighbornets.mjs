import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { parse } from "csv-parse/sync";
import { format } from "prettier";

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const inputPath = resolve(projectRoot, "data/neighbornets.csv");
const brotherAdditionsPath = resolve(
  projectRoot,
  "data/brother-neighbornets-additions.csv",
);
const sisterInputPath = resolve(projectRoot, "data/sister-neighbornets.csv");
const brotherOutputPath = resolve(
  projectRoot,
  "src/generated/brother-neighbornets.ts",
);
const sisterOutputPath = resolve(
  projectRoot,
  "src/generated/sister-neighbornets.ts",
);
const ids = new Set();

const brotherSourcePath = resolve(
  projectRoot,
  "data/brother-neighbornets-source.csv",
);
const placesPath = resolve(projectRoot, "data/neighbornet-places.csv");

const brothers = withScrapedContacts(
  loadLocations({
    path: inputPath,
    requiredColumns: ["neighbor_net", "subregion", "latitude", "longitude"],
    branch: "brothers",
    regionColumn: "subregion",
  }),
);
const brotherAdditions = loadLocations({
  path: brotherAdditionsPath,
  requiredColumns: [
    "neighbor_net",
    "region",
    "state",
    "latitude",
    "longitude",
    "email",
    "instagram",
  ],
  branch: "brothers",
  regionColumn: "region",
  stateColumn: "state",
});
const sisters = loadLocations({
  path: sisterInputPath,
  requiredColumns: [
    "neighbor_net",
    "region",
    "state",
    "latitude",
    "longitude",
    "instagram",
  ],
  branch: "sisters",
  regionColumn: "region",
  stateColumn: "state",
});

const places = loadPlaces();
await writeGeneratedFile(
  brotherOutputPath,
  "brotherLocations",
  [...brothers, ...brotherAdditions].map((location) =>
    withPlace(location, places),
  ),
);
await writeGeneratedFile(
  sisterOutputPath,
  "sisterLocations",
  sisters.map((location) => withPlace(location, places)),
);

console.log(
  `Generated ${brothers.length + brotherAdditions.length} Brothers and ${sisters.length} Sisters NeighborNet locations.`,
);

function loadLocations({
  path,
  requiredColumns,
  branch,
  regionColumn,
  stateColumn,
}) {
  const source = readFileSync(path, "utf8");
  const header = parse(source, { to_line: 1 })[0];
  const missingColumns = requiredColumns.filter(
    (column) => !header.includes(column),
  );
  if (missingColumns.length > 0) {
    throw new Error(
      `${path} is missing required columns: ${missingColumns.join(", ")}`,
    );
  }

  const rows = parse(source, {
    columns: true,
    skip_empty_lines: true,
    trim: true,
  });

  return rows.map((row, index) => {
    const rowNumber = index + 2;
    const name = requiredValue(row.neighbor_net, "neighbor_net", rowNumber);
    const region = requiredValue(row[regionColumn], regionColumn, rowNumber);
    const state = stateColumn
      ? requiredValue(row[stateColumn], stateColumn, rowNumber)
      : undefined;
    if (state && !/^[A-Z]{2}$/.test(state)) {
      throw new Error(`Invalid state "${state}" in ${path} row ${rowNumber}`);
    }
    if (row.instagram && !/^@[a-z0-9._]+$/i.test(row.instagram)) {
      throw new Error(
        `Invalid Instagram handle "${row.instagram}" in ${path} row ${rowNumber}`,
      );
    }
    const latitude = coordinate(row.latitude, "latitude", rowNumber, -90, 90);
    const longitude = coordinate(
      row.longitude,
      "longitude",
      rowNumber,
      -180,
      180,
    );
    const id = `${branch}-${slug(`${region}-${name}`)}`;
    if (ids.has(id)) {
      throw new Error(
        `Duplicate NeighborNet ID "${id}" generated from ${path} row ${rowNumber}`,
      );
    }
    ids.add(id);

    return {
      id,
      name,
      branch,
      status: "active",
      ...(state ? { state } : {}),
      region,
      latitude,
      longitude,
      ...(row.instagram || row.email
        ? {
            contact: {
              name: `${name} ${branch === "sisters" ? "Sisters" : "Brothers"}`,
              role: "Chapter contact",
              ...(row.email ? { email: row.email } : {}),
              ...(row.instagram ? { instagram: row.instagram } : {}),
            },
          }
        : {}),
    };
  });
}

/**
 * The base Brothers list (data/neighbornets.csv) carries coordinates but no
 * contacts; the scraped YM locations list (brother-neighbornets-source.csv)
 * carries each net's published email and Instagram. Match by name and region,
 * else by a name that appears once in the scrape (its regions are grouped
 * differently, e.g. "Dallas" for "Dallas East"), and attach the contact.
 */
function withScrapedContacts(locations) {
  const rows = parse(readFileSync(brotherSourcePath, "utf8"), {
    columns: true,
    skip_empty_lines: true,
    trim: true,
  });
  const key = (value) =>
    value
      .normalize("NFKD")
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "");
  let matched = 0;
  const result = locations.map((location) => {
    const candidates = rows.filter(
      (row) => key(row.neighbor_net) === key(location.name),
    );
    const row =
      candidates.find((r) => key(r.region) === key(location.region)) ??
      (candidates.length === 1 ? candidates[0] : undefined);
    if (!row || (!row.email && !row.instagram)) return location;
    if (row.instagram && !/^@[a-z0-9._]+$/i.test(row.instagram)) {
      throw new Error(`Invalid Instagram handle "${row.instagram}"`);
    }
    matched += 1;
    return {
      ...location,
      contact: {
        name: `${location.name} Brothers`,
        role: "Chapter contact",
        ...(row.email ? { email: row.email } : {}),
        ...(row.instagram ? { instagram: row.instagram } : {}),
      },
    };
  });
  console.log(`Attached scraped contacts to ${matched} base Brothers nets.`);
  return result;
}

/**
 * Each net's place, reverse-geocoded from its coordinates once
 * (scripts/reverse-geocode-neighbornets.mjs, committed to
 * data/neighbornet-places.csv): keyed by ID.
 */
function loadPlaces() {
  if (!existsSync(placesPath)) return new Map();
  const rows = parse(readFileSync(placesPath, "utf8"), {
    columns: true,
    skip_empty_lines: true,
    trim: true,
  });
  return new Map(rows.map((row) => [row.id, row]));
}

/**
 * Adds the net's city and ZIP, its country when outside the US, and its state
 * where the source list has none (a source state is kept; a disagreement is
 * reported for review).
 */
function withPlace(location, places) {
  const place = places.get(location.id);
  if (!place) {
    console.warn(`No place for ${location.id}; run the reverse geocoder.`);
    return location;
  }
  if (location.state && place.state && location.state !== place.state) {
    console.warn(
      `${location.id}: source state ${location.state}, coordinates in ${place.state}`,
    );
  }
  const { contact, ...rest } = location;
  return {
    ...rest,
    ...(place.city ? { city: place.city } : {}),
    ...(location.state || !place.state ? {} : { state: place.state }),
    ...(place.postal_code ? { postalCode: place.postal_code } : {}),
    ...(place.country && place.country !== "US"
      ? { country: place.country }
      : {}),
    ...(contact ? { contact } : {}),
  };
}

async function writeGeneratedFile(path, exportName, locations) {
  const generatedSource = `// Generated by scripts/generate-neighbornets.mjs. Do not edit directly.\nimport type { NeighborNetLocation } from "@/lib/neighbornets";\n\nexport const ${exportName}: NeighborNetLocation[] = ${JSON.stringify(locations, null, 2)};\n`;
  const formattedSource = await format(generatedSource, {
    parser: "typescript",
  });
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, formattedSource);
}

function requiredValue(value, column, row) {
  if (!value) {
    throw new Error(`Missing ${column} in NeighborNet CSV row ${row}`);
  }
  return value;
}

function coordinate(value, column, row, minimum, maximum) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed < minimum || parsed > maximum) {
    throw new Error(
      `Invalid ${column} "${value}" in NeighborNet CSV row ${row}`,
    );
  }
  return parsed;
}

function slug(value) {
  return value
    .normalize("NFKD")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}
