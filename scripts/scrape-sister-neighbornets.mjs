import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { load } from "cheerio";

import { sisterLocationsUrl, stateCodes, toCsv } from "./neighbornet-data.mjs";

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const outputPath = resolve(projectRoot, "data/sister-neighbornets-source.csv");

const response = await fetch(sisterLocationsUrl, {
  headers: {
    "User-Agent":
      "YoungMuslimsWebsite/1.0 (+https://youngmuslims.com; chapter data import)",
  },
});

if (!response.ok) {
  throw new Error(
    `Failed to fetch ${sisterLocationsUrl}: ${response.status} ${response.statusText}`,
  );
}

const $ = load(await response.text());
const rows = [];
const warnings = [];

$("h2").each((_index, heading) => {
  const region = $(heading).text().replace(/\s+/g, " ").trim();
  const state = stateCodes[region];
  if (!state || isLegacyHiddenSection($, heading)) return;

  const headingWidget = $(heading).closest(".elementor-widget-heading");
  const list = headingWidget.next(".elementor-widget-icon-list");
  if (list.length !== 1) {
    warnings.push(`${region}: expected one chapter list after the heading`);
    return;
  }

  list.find(".elementor-icon-list-item").each((_itemIndex, item) => {
    const name = $(item)
      .find(".elementor-icon-list-text")
      .text()
      .replace(/\s+/g, " ")
      .trim();
    if (!name) return;

    const href = $(item).find("a").attr("href");
    const instagram = instagramHandle(href);
    if (!instagram) {
      warnings.push(
        `${region} / ${name}: missing or invalid Instagram link${href ? ` (${href})` : ""}`,
      );
    }

    rows.push({
      neighbor_net: name === "DesMoines" ? "Des Moines" : name,
      region,
      state,
      instagram,
      source_url: sisterLocationsUrl,
    });
  });
});

if (rows.length < 90) {
  throw new Error(
    `Only found ${rows.length} visible Sisters NeighborNets; refusing to replace the source snapshot`,
  );
}

const keys = new Set();
for (const row of rows) {
  const key = `${row.state}|${row.neighbor_net.toLowerCase()}`;
  if (keys.has(key)) throw new Error(`Duplicate Sisters NeighborNet: ${key}`);
  keys.add(key);
}

rows.sort(
  (a, b) =>
    a.region.localeCompare(b.region) ||
    a.neighbor_net.localeCompare(b.neighbor_net),
);

mkdirSync(dirname(outputPath), { recursive: true });
writeFileSync(
  outputPath,
  toCsv(["neighbor_net", "region", "state", "instagram", "source_url"], rows),
);

console.log(`Scraped ${rows.length} visible Sisters NeighborNets.`);
for (const warning of warnings) console.warn(`Warning: ${warning}`);

function isLegacyHiddenSection($, heading) {
  return $(heading)
    .parents()
    .toArray()
    .some((element) => {
      const classes = new Set(($(element).attr("class") ?? "").split(/\s+/));
      return (
        classes.has("elementor-hidden-desktop") &&
        classes.has("elementor-hidden-tablet") &&
        classes.has("elementor-hidden-mobile")
      );
    });
}

function instagramHandle(href) {
  if (!href) return "";
  try {
    const url = new URL(href);
    if (!/(^|\.)instagram\.com$/i.test(url.hostname)) return "";
    const handle = url.pathname.split("/").filter(Boolean)[0];
    return handle ? `@${handle}` : "";
  } catch {
    return "";
  }
}
