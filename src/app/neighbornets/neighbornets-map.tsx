"use client";

import { useEffect, useMemo, useState } from "react";

// Must come before the map component so our same-origin worker URL is set
// before mapcn's unpkg fallback runs. See src/lib/maplibre-worker.ts.
import "@/lib/maplibre-worker";
import {
  Map,
  MapControls,
  useMap,
  MapGeoJSON,
  MapMarker,
  MapClusterLayer,
  MarkerContent,
  MarkerLabel,
  MarkerPopup,
  MarkerTooltip,
} from "@/components/ui/map";
import { cn } from "@/lib/utils";
import {
  branchLabel,
  neighborNets,
  toFeatureCollection,
  type Branch,
  type NeighborNet,
} from "@/lib/neighbornets";
import { DebugPanel } from "./debug-panel";
import { NetDetails } from "./net-details";
import { NetMarker, branchColor } from "./net-marker";
import {
  US_BOUNDS,
  US_STATES_GEOJSON,
  US_VIEW,
  defaultSettings,
  palettes,
  type MapSettings,
} from "./map-options";

/**
 * Prototype surface for the neighbornet map. The map itself is the deliverable;
 * the debug panel beside it exists so we can compare marker treatments and
 * info-reveal patterns against real-ish data before committing to one.
 *
 * The props exist so a caller can dress the map differently without changing
 * what every other caller gets: the wireframe needs a greyscale, bare map with
 * no debug panel, but `defaultSettings` stays the settings this prototype boots
 * with everywhere else.
 *
 * `bare` drops the prototype chrome entirely — no side column, no border, no
 * zoom or pan — so the map reads as the shape of the country sitting on the
 * page rather than as a widget embedded in a box. Note that it also removes the
 * side panel, so a `bare` caller wants an `infoMode` that surfaces details on
 * the map itself (`click-popup` or `hover-tooltip`), not `side-panel`.
 */
export function NeighborNetsMap({
  initialSettings = defaultSettings,
  showDebugPanel = true,
  bare = false,
}: {
  initialSettings?: MapSettings;
  showDebugPanel?: boolean;
  bare?: boolean;
} = {}) {
  const [settings, setSettings] = useState<MapSettings>(initialSettings);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const visibleNets = useMemo(
    () =>
      settings.branchFilter === "all"
        ? neighborNets
        : neighborNets.filter((net) => net.branch === settings.branchFilter),
    [settings.branchFilter],
  );

  const counts = useMemo(
    () => ({
      brothers: neighborNets.filter((n) => n.branch === "brothers").length,
      sisters: neighborNets.filter((n) => n.branch === "sisters").length,
      shown: visibleNets.length,
    }),
    [visibleNets],
  );

  const pairedCities = useMemo(() => sharedCities(visibleNets), [visibleNets]);

  /** One name label per city: the id of the first net found in each. */
  const labelledNets = useMemo(() => {
    const seen = new Set<string>();
    const ids = new Set<string>();
    for (const net of visibleNets) {
      const key = cityKey(net);
      if (seen.has(key)) continue;
      seen.add(key);
      ids.add(net.id);
    }
    return ids;
  }, [visibleNets]);

  const selected = visibleNets.find((net) => net.id === selectedId) ?? null;

  const panelMode =
    settings.infoMode === "side-panel" || settings.infoMode === "both";

  function handleSelect(net: NeighborNet) {
    if (!panelMode) return;
    setSelectedId((current) => (current === net.id ? null : net.id));
  }

  return (
    <div
      className={cn(
        bare
          ? "relative h-full w-full"
          : // `min-h-0` on both cells is what stops the tall debug panel from
            // stretching the grid row and pushing the map's center off-screen.
            "grid min-h-0 flex-1 gap-4 lg:grid-cols-[minmax(0,1fr)_20rem]",
      )}
    >
      <div
        className={cn(
          "relative",
          bare
            ? "h-full w-full"
            : "h-[60vh] min-h-0 overflow-hidden rounded-lg border border-border lg:h-full",
        )}
      >
        <Map
          className="h-full w-full"
          // mapcn otherwise picks its theme from prefers-color-scheme, which
          // would flip the map to dark while the rest of the page stays light:
          // the app has no dark mode wired up yet. Drop this once it does.
          theme="light"
          blank={settings.basemap === "blank"}
          center={US_VIEW.center}
          zoom={US_VIEW.zoom}
          // Low enough that fitBounds can frame the lower 48 inside a
          // phone-width container instead of being clamped and overflowing.
          minZoom={1.5}
          maxZoom={14}
          // A bare map is a picture of the country, not something to fly
          // around in. This disables MapLibre's own drag/zoom/keyboard
          // handlers; markers are separate DOM overlays, so they stay
          // clickable, and fitBounds still drives the camera.
          interactive={!bare}
        >
          <FitToUS />

          {settings.showStateOutlines ? (
            <MapGeoJSON
              // Remounting on basemap change avoids re-tuning paint in place
              // while MapLibre is mid style-swap.
              key={`states-${settings.basemap}`}
              data={US_STATES_GEOJSON}
              fillPaint={
                settings.basemap === "blank"
                  ? { "fill-opacity": 0.55 }
                  : { "fill-opacity": 0 }
              }
              linePaint={{
                "line-color":
                  settings.basemap === "blank" ? "#ffffff" : "#94a3b8",
                "line-width": 0.6,
              }}
            />
          ) : null}

          {settings.cluster ? (
            <ClusterLayers
              nets={visibleNets}
              settings={settings}
              onSelect={handleSelect}
            />
          ) : (
            visibleNets.map((net) => (
              <MapMarker
                key={net.id}
                longitude={net.longitude}
                latitude={net.latitude}
                // A screen-space nudge, so the two nets stay separated at every
                // zoom instead of merging as you zoom out.
                offset={
                  settings.pairOffset && pairedCities.has(cityKey(net))
                    ? [net.branch === "brothers" ? -9 : 9, 0]
                    : [0, 0]
                }
                onMouseEnter={() => setHoveredId(net.id)}
                onMouseLeave={() => setHoveredId(null)}
                onClick={() => handleSelect(net)}
              >
                <MarkerContent className="cursor-pointer">
                  <NetMarker
                    net={net}
                    markerStyle={settings.markerStyle}
                    differentiator={settings.differentiator}
                    palette={settings.palette}
                    sizeMode={settings.sizeMode}
                    dimInactive={settings.dimInactive}
                    emphasized={hoveredId === net.id || selectedId === net.id}
                  />
                  {/* MarkerLabel is positioned, not portaled, so it has to sit
                      inside MarkerContent to anchor to the marker. Only the
                      first net in a city gets one, or paired nets print the
                      same city name twice on top of each other. */}
                  {settings.showLabels && labelledNets.has(net.id) ? (
                    <MarkerLabel className="rounded bg-background/85 px-1 py-px">
                      {net.city}
                    </MarkerLabel>
                  ) : null}
                </MarkerContent>

                {settings.infoMode === "hover-tooltip" ||
                settings.infoMode === "both" ? (
                  <MarkerTooltip className="bg-transparent! p-0! shadow-none!">
                    <NetDetails
                      net={net}
                      palette={settings.palette}
                      density={
                        settings.infoMode === "both" ? "peek" : "compact"
                      }
                    />
                  </MarkerTooltip>
                ) : null}

                {settings.infoMode === "click-popup" ? (
                  <MarkerPopup className="border-0! bg-transparent! p-0! shadow-none!">
                    <NetDetails
                      net={net}
                      palette={settings.palette}
                      density="compact"
                    />
                  </MarkerPopup>
                ) : null}
              </MapMarker>
            ))
          )}

          {bare ? null : (
            <MapControls
              position="top-right"
              showZoom
              showCompass
              showFullscreen
            />
          )}
        </Map>

        <Legend settings={settings} />
      </div>

      {bare ? null : (
        <div className="flex min-h-0 flex-col gap-4 overflow-hidden">
          {panelMode ? (
            <div className="rounded-lg border border-border bg-card p-1">
              {selected ? (
                <NetDetails
                  net={selected}
                  palette={settings.palette}
                  density="full"
                  onClose={() => setSelectedId(null)}
                  className="border-0 shadow-none"
                />
              ) : (
                <p className="px-3 py-6 text-center text-xs text-muted-foreground">
                  Click a dot to see that neighbornet&apos;s contact details.
                </p>
              )}
            </div>
          ) : null}

          {showDebugPanel ? (
            <div className="min-h-0 lg:flex-1">
              <DebugPanel
                settings={settings}
                onChange={(next) => {
                  setSettings(next);
                  if (
                    next.infoMode !== "side-panel" &&
                    next.infoMode !== "both"
                  ) {
                    setSelectedId(null);
                  }
                }}
                counts={counts}
              />
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}

/**
 * Frames the lower 48 once the map is ready. Without this the map opens at a
 * fixed zoom, which crops the country badly on a phone-width container.
 */
function FitToUS() {
  const { map, isLoaded } = useMap();

  useEffect(() => {
    if (!map || !isLoaded) return;

    // Stop refitting the moment someone pans or zooms themselves. A `movestart`
    // carrying an `originalEvent` came from the user, not from our own fitBounds.
    let userDriven = false;
    const markUserDriven = (e: { originalEvent?: unknown }) => {
      if (e.originalEvent) userDriven = true;
    };
    map.on("movestart", markUserDriven);

    const fit = () => {
      if (userDriven) return;
      map.fitBounds(US_BOUNDS, { padding: 32, duration: 0 });
    };

    fit();

    // The container can still be settling when the map first loads (and it
    // changes size on rotate or fullscreen), so refit until the user takes over.
    const observer = new ResizeObserver(fit);
    observer.observe(map.getContainer());

    return () => {
      observer.disconnect();
      map.off("movestart", markUserDriven);
    };
  }, [map, isLoaded]);

  return null;
}

function cityKey(net: NeighborNet): string {
  return `${net.city}|${net.state}`;
}

/**
 * Cities running both a brothers' and a sisters' net. Their coordinates are
 * close enough that at national zoom the two dots land on the same pixel and
 * one silently covers the other, so these are the ones worth nudging apart.
 */
function sharedCities(nets: NeighborNet[]): Set<string> {
  // A plain record rather than a `Map`, which the mapcn `Map` component shadows
  // in this module.
  const branches: Record<string, Set<Branch>> = {};
  for (const net of nets) {
    const key = cityKey(net);
    branches[key] ??= new Set<Branch>();
    branches[key].add(net.branch);
  }
  return new Set(
    Object.entries(branches)
      .filter(([, set]) => set.size > 1)
      .map(([key]) => key),
  );
}

/**
 * Clustering collapses markers into circle layers, which means the per-net
 * React glyph is gone. Rendering one cluster layer per branch is what keeps the
 * brothers/sisters split visible in this mode.
 */
function ClusterLayers({
  nets,
  settings,
  onSelect,
}: {
  nets: NeighborNet[];
  settings: MapSettings;
  onSelect: (net: NeighborNet) => void;
}) {
  const byBranch = useMemo(
    () => ({
      brothers: toFeatureCollection(
        nets.filter((n) => n.branch === "brothers"),
      ),
      sisters: toFeatureCollection(nets.filter((n) => n.branch === "sisters")),
    }),
    [nets],
  );

  return (
    <>
      {(["brothers", "sisters"] as const).map((branch) => {
        const color = branchColor(branch, settings.palette);
        return (
          <MapClusterLayer
            key={branch}
            data={byBranch[branch]}
            clusterRadius={36}
            clusterMaxZoom={7}
            clusterColors={[color, color, color]}
            clusterThresholds={[4, 10]}
            pointColor={color}
            onPointClick={(feature) => {
              const net = nets.find((n) => n.id === feature.properties?.id);
              if (net) onSelect(net);
            }}
          />
        );
      })}
    </>
  );
}

function Legend({ settings }: { settings: MapSettings }) {
  const palette = palettes[settings.palette];
  const shapeChannel =
    settings.differentiator === "shape" ||
    settings.differentiator === "color-and-shape";

  return (
    <div className="absolute bottom-3 left-3 rounded-md border border-border bg-background/90 px-3 py-2 text-xs shadow-sm backdrop-blur-sm">
      <p className="mb-1.5 text-xs font-semibold text-muted-foreground">
        Neighbornets
      </p>
      <ul className="space-y-1">
        {(["brothers", "sisters"] as const).map((branch) => (
          <li key={branch} className="flex items-center gap-2">
            <span
              className={cn(
                "size-3 shrink-0",
                shapeChannel && branch === "sisters" && "rotate-45",
              )}
              style={{
                backgroundColor: palette[branch],
                borderRadius:
                  shapeChannel && branch === "sisters" ? "20%" : "9999px",
              }}
            />
            {branchLabel[branch]}
          </li>
        ))}
      </ul>
      {settings.dimInactive ? (
        <p className="mt-1.5 text-xs text-muted-foreground">
          Faded = forming or paused
        </p>
      ) : null}
    </div>
  );
}
