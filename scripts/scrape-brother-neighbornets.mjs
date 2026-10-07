import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { load } from "cheerio";

import { toCsv } from "./neighbornet-data.mjs";

const locationsUrl = "https://ymsite.com/ym-locations/";
const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const outputPath = resolve(projectRoot, "data/brother-neighbornets-source.csv");
const sectionPattern = /^(NORTHEAST|SOUTHEAST|TEXAS|MIDWEST|WEST)\b/i;

const regionInfo = {
  "North New Jersey": { region: "New Jersey North", state: "NJ" },
  "South New Jersey": { region: "New Jersey South", state: "NJ" },
  "East New York": { region: "New York East", state: "NY" },
  "West New York": { region: "New York West", state: "NY" },
  Pennsylvania: { region: "Pennsylvania", state: "PA" },
  Connecticut: { region: "Connecticut", state: "CT" },
  Maryland: { region: "Maryland", state: "MD" },
  Georgia: { region: "Georgia", state: "GA" },
  Florida: { region: "Florida", state: "FL" },
  Tennessee: { region: "Tennessee", state: "TN" },
  Houstan: { region: "Houston", state: "TX" },
  Dallas: { region: "Dallas", state: "TX" },
  Austin: { region: "Austin", state: "TX" },
  Illinois: { region: "Chicago", state: "IL" },
  Indiana: { region: "Indiana", state: "IN" },
  Minnesota: { region: "Minnesota", state: "MN" },
  "Ontario, Canada": { region: "Ontario, Canada", state: "ON" },
  Nevada: { region: "Nevada", state: "NV" },
  California: { region: "California", state: "CA" },
  "Alberta, Canada": { region: "Alberta, Canada", state: "AB" },
};

const response = await fetch(locationsUrl, {
  headers: {
    "User-Agent":
      "YoungMuslimsWebsite/1.0 (+https://youngmuslims.com; chapter data import)",
  },
});
if (!response.ok) {
  throw new Error(
    `Failed to fetch ${locationsUrl}: ${response.status} ${response.statusText}`,
  );
}

const $ = load(await response.text());
const rows = [];
const warnings = [];

$(".elementor-image-box-title").each((_index, title) => {
  const section = $(title).text().replace(/\s+/g, " ").trim();
  if (!sectionPattern.test(section)) return;

  const titleWidget = $(title).closest(".elementor-widget-image-box");
  const editor = titleWidget.next(".elementor-widget-text-editor");
  if (editor.length !== 1) {
    warnings.push(`${section}: could not find its chapter list`);
    return;
  }

  let currentRegion;
  editor.find("p").each((_paragraphIndex, paragraph) => {
    const text = $(paragraph).text().replace(/\s+/g, " ").trim();
    const mailto = $(paragraph).find('a[href^="mailto:"]').first().attr("href");

    if (!mailto) {
      const label = text.replace(/:$/, "").trim();
      if (regionInfo[label]) currentRegion = regionInfo[label];
      return;
    }
    if (!currentRegion) {
      warnings.push(
        `${section}: chapter appeared before a recognized region: ${text}`,
      );
      return;
    }

    const beforeDash = text.split(/[–—]/, 1)[0];
    const inlineParts = beforeDash.split(":");
    const inlineRegion = inlineParts.length > 1 ? inlineParts[0].trim() : "";
    if (regionInfo[inlineRegion]) currentRegion = regionInfo[inlineRegion];
    const name = inlineParts.at(-1)?.trim();
    if (!name) return;

    const email = decodeURIComponent(mailto.slice("mailto:".length))
      .split("?")[0]
      .trim();
    const instagram = normalizeInstagram(text.match(/@[a-z0-9._@]+/i)?.[0]);
    if (!instagram) {
      warnings.push(
        `${currentRegion.region} / ${name}: missing or invalid Instagram handle`,
      );
    }

    rows.push({
      neighbor_net: name,
      region: currentRegion.region,
      state: currentRegion.state,
      email,
      instagram,
      source_url: locationsUrl,
    });
  });
});

if (rows.length < 65) {
  throw new Error(
    `Only found ${rows.length} Brothers NeighborNets; refusing to replace the source snapshot`,
  );
}

const keys = new Set();
for (const row of rows) {
  const key = `${row.state}|${row.neighbor_net.toLowerCase()}`;
  if (keys.has(key)) throw new Error(`Duplicate Brothers NeighborNet: ${key}`);
  keys.add(key);
}

mkdirSync(dirname(outputPath), { recursive: true });
writeFileSync(
  outputPath,
  toCsv(
    ["neighbor_net", "region", "state", "email", "instagram", "source_url"],
    rows,
  ),
);

console.log(`Scraped ${rows.length} Brothers NeighborNets.`);
for (const warning of warnings) console.warn(`Warning: ${warning}`);

function normalizeInstagram(handle) {
  if (!handle) return "";
  const repaired = handle
    .replace("@ym.jax@.brothers", "@ym.jax.brothers")
    .replace(/[^@a-z0-9._].*$/i, "");
  return /^@[a-z0-9._]+$/i.test(repaired) ? repaired : "";
}
