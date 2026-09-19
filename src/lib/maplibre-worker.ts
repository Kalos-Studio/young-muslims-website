"use client";

import * as MapLibreGL from "maplibre-gl";

/**
 * Point MapLibre at the worker we serve ourselves.
 *
 * `src/components/ui/map.tsx` (the mapcn registry component) falls back to
 * loading the worker from unpkg.com, and only if no URL has been set yet. Every
 * module that imports the map component must import this one FIRST so our
 * same-origin copy wins. Otherwise the map quietly renders no tiles and no
 * GeoJSON wherever that CDN is unreachable.
 *
 * The file is copied out of node_modules by `scripts/copy-maplibre-worker.mjs`
 * on postinstall, so its version always matches the installed maplibre-gl.
 */
if (typeof window !== "undefined") {
  MapLibreGL.setWorkerUrl("/maplibre-gl-worker.mjs");
}

export {};
