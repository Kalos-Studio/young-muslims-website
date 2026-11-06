import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { readFileSync } from "node:fs";
import { createServer } from "node:net";
import { load } from "cheerio";

// Checks the built site over HTTP, the way a crawler sees it. Pages are
// discovered from the build manifests rather than a hand-kept list, so a new
// page is checked automatically.
//
// Usage: build first, then run with the same environment as the build.
//   CONTEXT=production SITE_INDEXABLE=true bun run build && \
//     CONTEXT=production SITE_INDEXABLE=true bun run test:seo
//   CONTEXT=deploy-preview bun run build && \
//     CONTEXT=deploy-preview bun run test:seo
// The environment only tells this script which result to expect. The server
// is started without CONTEXT and SITE_INDEXABLE because Netlify does not pass
// them to on-demand pages at request time; the build must have baked them in.

const indexable =
  process.env.CONTEXT === "production" && process.env.SITE_INDEXABLE === "true";
const mode = indexable ? "production" : "preview";
const origin = "https://youngmuslims.com";

const readJson = (path) => JSON.parse(readFileSync(path, "utf8"));
// Maps each app/ file to its URL, with route groups like (marketing) removed.
const routes = Object.entries(readJson(".next/app-path-routes-manifest.json"))
  .filter(([file]) => file.endsWith("/page"))
  .map(([, route]) => route)
  .filter((route) => !route.split("/").some((part) => part.startsWith("_")));
const prerendered = Object.entries(
  readJson(".next/prerender-manifest.json").routes,
);

// Static pages, plus every concrete path generateStaticParams produced for a
// dynamic route. A dynamic route with no prerendered paths cannot be checked,
// so it fails loudly instead of being skipped.
const pages = [];
const unchecked = [];
for (const route of routes) {
  if (!route.includes("[")) {
    pages.push(route);
    continue;
  }
  const paths = prerendered
    .filter(([, info]) => info.srcRoute === route)
    .map(([path]) => path);
  if (paths.length === 0) unchecked.push(route);
  pages.push(...paths);
}
pages.sort();
assert(pages.length > 0, "No pages found. Run the build first.");

const port = await freePort();
const base = `http://127.0.0.1:${port}`;
const serverEnv = { ...process.env };
delete serverEnv.CONTEXT;
delete serverEnv.SITE_INDEXABLE;
const server = spawn(
  "node_modules/.bin/next",
  ["start", "-H", "127.0.0.1", "-p", String(port)],
  {
    env: serverEnv,
    stdio: ["ignore", "pipe", "inherit"],
  },
);
const failures = [];
const check = (label, fn) => {
  try {
    fn();
  } catch (error) {
    failures.push(`${label}: ${error.message.split("\n")[0]}`);
  }
};

try {
  await waitForServer();

  for (const route of unchecked)
    failures.push(
      `${route}: dynamic route has no prerendered pages to check; add generateStaticParams or extend this script`,
    );

  const indexed = [];
  const titles = new Map();
  const descriptions = new Map();
  for (const path of pages) {
    const response = await fetch(base + path, { redirect: "manual" });
    const $ = load(await response.text());
    const robots = $("meta[name=robots]").attr("content") ?? "";
    const isIndexed = robots.startsWith("index");
    if (isIndexed) indexed.push(path);

    check(path, () => assert.equal(response.status, 200, "status"));
    check(path, () =>
      assert.equal(
        new URL($("link[rel=canonical]").attr("href") ?? "", "invalid:/").href,
        new URL(path, origin).href,
        "canonical",
      ),
    );
    check(path, () =>
      assert.equal(
        response.headers.get("x-robots-tag"),
        indexable ? null : "noindex, nofollow",
        "X-Robots-Tag header",
      ),
    );
    if (!indexable) {
      // Pages that opt out of indexing keep "follow"; noindex is what matters.
      check(path, () => assert.match(robots, /^noindex, /, "robots meta"));
      continue;
    }
    check(path, () =>
      assert.match(
        robots,
        /^(index|noindex), (follow|nofollow)$/,
        "robots meta",
      ),
    );
    if (!isIndexed) continue;
    const title = $("title").text().trim();
    const description = $("meta[name=description]").attr("content")?.trim();
    check(path, () => assert(title, "missing title"));
    check(path, () => assert(description, "missing description"));
    if (titles.has(title))
      failures.push(`${path}: title duplicates ${titles.get(title)}`);
    if (descriptions.has(description))
      failures.push(
        `${path}: description duplicates ${descriptions.get(description)}`,
      );
    titles.set(title, path);
    descriptions.set(description, path);
  }

  // The sitemap must list exactly the pages that allow indexing: a missing
  // page is never submitted, and a noindex page sends Google mixed signals.
  const xml = load(await (await fetch(`${base}/sitemap.xml`)).text(), {
    xmlMode: true,
  });
  const listed = xml("loc")
    .toArray()
    .map((el) => xml(el).text())
    .sort();
  const expected = indexed.map((path) => new URL(path, origin).href).sort();
  if (indexable) {
    // Guard against everything going noindex at once with an empty sitemap.
    check("/", () =>
      assert(indexed.includes("/"), "homepage is not indexable"),
    );
    check("/sitemap.xml", () => assert(listed.length > 0, "sitemap is empty"));
  }
  for (const url of listed.filter((url) => !expected.includes(url)))
    failures.push(`/sitemap.xml: lists ${url}, which is not an indexable page`);
  for (const url of expected.filter((url) => !listed.includes(url)))
    failures.push(`/sitemap.xml: missing indexable page ${url}`);

  const robotsTxt = await (await fetch(`${base}/robots.txt`)).text();
  check("/robots.txt", () => assert.match(robotsTxt, /Allow: \//));
  // Blocking crawling would stop crawlers from reading the noindex tags.
  check("/robots.txt", () =>
    assert(!/Disallow: \/\s*$/m.test(robotsTxt), "Disallow: /"),
  );
  check("/robots.txt", () =>
    assert.equal(
      robotsTxt.includes(`Sitemap: ${origin}/sitemap.xml`),
      indexable,
      "Sitemap line",
    ),
  );

  const missing = await fetch(`${base}/seo-check-missing-page`);
  const $missing = load(await missing.text());
  check("missing page", () => assert.equal(missing.status, 404, "status"));
  check("missing page", () =>
    assert.match(
      $missing("meta[name=robots]").attr("content") ?? "",
      /noindex/,
      "robots meta",
    ),
  );

  const home = load(await (await fetch(`${base}/`)).text());
  check("/ structured data", () => {
    const types = home("script[type='application/ld+json']")
      .toArray()
      .flatMap((el) => {
        const data = JSON.parse(home(el).text());
        return (data["@graph"] ?? [data]).map((item) => item["@type"]);
      });
    assert(types.includes("Organization"), "missing Organization");
    assert(types.includes("WebSite"), "missing WebSite");
  });

  if (failures.length) {
    console.error(`FAIL: ${mode} SEO check\n  ${failures.join("\n  ")}`);
    process.exitCode = 1;
  } else {
    console.log(
      `PASS: ${mode} SEO check on ${pages.length} pages (${indexed.length} indexable), sitemap, robots.txt, 404, and structured data.`,
    );
  }
} finally {
  server.kill();
}

// Resolve once this script's own server reports it is ready. Probing the port
// instead could reach some other process already listening there.
function waitForServer() {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(
      () => reject(new Error("next start did not become ready in 30s")),
      30_000,
    );
    const fail = (reason) => {
      clearTimeout(timer);
      reject(new Error(`next start failed: ${reason}`));
    };
    server.on("error", (error) => fail(error.message));
    server.on("exit", (code) => fail(`exited with code ${code}`));
    let output = "";
    server.stdout.on("data", (chunk) => {
      output += chunk;
      if (/Ready in/.test(output)) {
        clearTimeout(timer);
        server.stdout.resume();
        resolve();
      }
    });
  });
}

function freePort() {
  return new Promise((resolve, reject) => {
    const probe = createServer();
    probe.on("error", reject);
    probe.listen(0, "127.0.0.1", () => {
      const { port } = probe.address();
      probe.close(() => resolve(port));
    });
  });
}
