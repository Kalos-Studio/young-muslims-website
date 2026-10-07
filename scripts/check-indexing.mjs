import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { load } from "cheerio";

const mode = process.argv[2];
assert(["production", "preview"].includes(mode), "Pass production or preview");
const indexable = mode === "production";
const origin = "https://youngmuslims.com";
const paths = [
  "/",
  "/about",
  "/stories",
  "/support",
  "/neighbornets",
  "/store",
  "/blog",
  "/design-system",
];
const read = (path) => readFileSync(path, "utf8");

for (const path of paths) {
  const file = path === "/" ? "index" : path.slice(1);
  const $ = load(read(`.next/server/app/${file}.html`));
  assert.equal(
    $("meta[name=robots]").attr("content"),
    indexable ? "index, follow" : "noindex, nofollow",
    path,
  );
  assert.equal(
    new URL($("link[rel=canonical]").attr("href")).href,
    new URL(path, origin).href,
    path,
  );
}

const xml = load(read(".next/server/app/sitemap.xml.body"), { xmlMode: true });
assert.deepEqual(
  xml("loc")
    .toArray()
    .map((el) => xml(el).text())
    .sort(),
  indexable ? paths.map((path) => new URL(path, origin).href).sort() : [],
);
const robots = read(".next/server/app/robots.txt.body");
assert.match(robots, /Allow: \//);
assert.equal(robots.includes(`Sitemap: ${origin}/sitemap.xml`), indexable);
assert(!robots.includes("Disallow: /"));

const manifest = JSON.parse(read(".next/routes-manifest.json"));
const blocked = manifest.headers.some(
  (rule) =>
    rule.source === "/:path*" &&
    rule.headers.some(
      (header) =>
        header.key.toLowerCase() === "x-robots-tag" &&
        header.value === "noindex, nofollow",
    ),
);
assert.equal(blocked, !indexable);
console.log(
  `PASS: ${mode} metadata and canonicals for all 8 pages, sitemap, robots, and configured headers.`,
);
