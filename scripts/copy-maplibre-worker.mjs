// MapLibre GL runs its tile and GeoJSON parsing in a web worker. The mapcn
// registry component defaults that worker's URL to unpkg.com, which means every
// page view fetches a script from a third-party CDN at runtime, and the map
// silently renders no tiles and no GeoJSON if that request is blocked or unpkg
// is down. Copying the worker out of the installed package into `public/` lets
// us serve it from our own origin, and because it is copied from node_modules
// it can never drift from the maplibre-gl version we actually depend on.
//
// Wired to `postinstall`, so it runs on every install including CI and Netlify.

import { copyFile, mkdir } from "node:fs/promises";
import { createRequire } from "node:module";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const require = createRequire(import.meta.url);
const root = join(dirname(fileURLToPath(import.meta.url)), "..");

// The worker imports its shared chunk as a sibling path, so both files have to
// land next to each other or the worker 404s on its own dependency.
const FILES = ["maplibre-gl-worker.mjs", "maplibre-gl-shared.mjs"];

const dist = join(dirname(require.resolve("maplibre-gl/package.json")), "dist");
const publicDir = join(root, "public");

await mkdir(publicDir, { recursive: true });
for (const file of FILES) {
  await copyFile(join(dist, file), join(publicDir, file));
}

console.log(`Copied maplibre-gl worker to public/: ${FILES.join(", ")}`);
