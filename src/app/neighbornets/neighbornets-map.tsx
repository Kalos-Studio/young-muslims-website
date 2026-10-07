"use client";

import {
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type FormEvent,
} from "react";
import { RotateCcw, Search } from "lucide-react";

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
  toFeatureCollection,
  type Branch,
  type NeighborNetLocation,
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
  locations,
  initialSettings = defaultSettings,
  showDebugPanel = true,
  bare = false,
  finder = false,
  interactive,
}: {
  locations: NeighborNetLocation[];
  initialSettings?: MapSettings;
  showDebugPanel?: boolean;
  bare?: boolean;
  /** Add the public chapter-search, density-map, and result-card experience. */
  finder?: boolean;
  /** Keep visual chrome and map interaction as separate decisions. */
  interactive?: boolean;
}) {
  const [settings, setSettings] = useState<MapSettings>(initialSettings);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [submittedQuery, setSubmittedQuery] = useState("");
  const [focusedResultId, setFocusedResultId] = useState<string | null>(null);
  const [mapZoom, setMapZoom] = useState(US_VIEW.zoom);
  const mapSectionRef = useRef<HTMLDivElement>(null);

  const visibleNets = useMemo(
    () =>
      settings.branchFilter === "all"
        ? locations
        : locations.filter((net) => net.branch === settings.branchFilter),
    [locations, settings.branchFilter],
  );

  const counts = useMemo(
    () => ({
      brothers: locations.filter((n) => n.branch === "brothers").length,
      sisters: locations.filter((n) => n.branch === "sisters").length,
      shown: visibleNets.length,
    }),
    [locations, visibleNets],
  );

  const pairedCities = useMemo(() => sharedCities(visibleNets), [visibleNets]);
  const availableBranches = useMemo(
    () =>
      (["brothers", "sisters"] as const).filter((branch) =>
        locations.some((net) => net.branch === branch),
      ),
    [locations],
  );

  const normalizedQuery = normalizeSearchTerm(submittedQuery);
  const searchResults = useMemo(() => {
    if (!normalizedQuery) return [];

    return visibleNets
      .filter((net) =>
        [net.name, net.city, net.state, net.region]
          .filter(Boolean)
          .some((value) =>
            normalizeSearchTerm(value!).includes(normalizedQuery),
          ),
      )
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [normalizedQuery, visibleNets]);
  const hasSearch = normalizedQuery.length > 0;
  const hasSearchResults = hasSearch && searchResults.length > 0;
  const mappedNets = hasSearchResults ? searchResults : visibleNets;
  const cameraNets = useMemo(() => {
    if (!hasSearchResults) return null;
    if (!focusedResultId) return searchResults;
    const focused = searchResults.find((net) => net.id === focusedResultId);
    return focused ? [focused] : searchResults;
  }, [focusedResultId, hasSearchResults, searchResults]);
  const showHeatmap = finder && !hasSearchResults && mapZoom < 5.5;
  const showMarkers = !finder || hasSearchResults || mapZoom >= 4.5;
  const coordinateOffsets = useMemo(
    () => offsetsForSharedCoordinates(visibleNets),
    [visibleNets],
  );

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

  function handleSelect(net: NeighborNetLocation) {
    setSelectedId((current) => (current === net.id ? null : net.id));
  }

  function handleSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmittedQuery(query.trim());
    setFocusedResultId(null);
    setSelectedId(null);
  }

  function resetSearch() {
    setQuery("");
    setSubmittedQuery("");
    setFocusedResultId(null);
    setSelectedId(null);
  }

  function focusResult(net: NeighborNetLocation) {
    setFocusedResultId(net.id);
    setSelectedId(net.id);
    mapSectionRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
  }

  return (
    <div className={cn(finder && "space-y-6")}>
      {finder ? (
        <ChapterSearch
          query={query}
          onQueryChange={setQuery}
          onSubmit={handleSearch}
          onChoose={(value) => {
            setQuery(value);
            setSubmittedQuery(value);
            setFocusedResultId(null);
            setSelectedId(null);
          }}
          onReset={resetSearch}
          locations={visibleNets}
          hasSearch={hasSearch}
          resultCount={searchResults.length}
        />
      ) : null}

      <div
        ref={mapSectionRef}
        className={cn(
          finder
            ? "relative h-[70vh] min-h-[32rem] w-full scroll-mt-32"
            : bare
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
            // MapCamera raises this to the exact zoom needed to keep the whole
            // country in frame once it knows the rendered container size.
            minZoom={1.5}
            maxZoom={14}
            // A bare map is a picture of the country, not something to fly
            // around in. This disables MapLibre's own drag/zoom/keyboard
            // handlers; markers are separate DOM overlays, so they stay
            // clickable, and fitBounds still drives the camera.
            interactive={interactive ?? !bare}
            onViewportChange={(viewport) => setMapZoom(viewport.zoom)}
          >
            <MapCamera focusLocations={cameraNets} />

            {showHeatmap ? <RegionHeatmap nets={visibleNets} /> : null}

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

            {showMarkers && settings.cluster ? (
              <ClusterLayers
                nets={mappedNets}
                settings={settings}
                onSelect={handleSelect}
              />
            ) : showMarkers ? (
              mappedNets.map((net) => (
                <MapMarker
                  key={net.id}
                  longitude={net.longitude}
                  latitude={net.latitude}
                  // A screen-space nudge, so the two nets stay separated at every
                  // zoom instead of merging as you zoom out.
                  offset={
                    coordinateOffsets[net.id] ??
                    (settings.pairOffset && pairedCities.has(cityKey(net))
                      ? [net.branch === "brothers" ? -9 : 9, 0]
                      : [0, 0])
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
                        {net.city ?? net.name}
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
            ) : null}

            {bare ? null : (
              <MapControls
                position="top-right"
                showZoom
                showCompass
                showFullscreen
              />
            )}
          </Map>

          <Legend
            settings={settings}
            branches={availableBranches}
            hasInactive={locations.some((net) => net.status !== "active")}
            densityMode={showHeatmap}
          />
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

      {finder && hasSearch ? (
        <SearchResultCards
          query={submittedQuery}
          results={searchResults}
          selectedId={selectedId}
          palette={settings.palette}
          onSelect={focusResult}
        />
      ) : null}
    </div>
  );
}

/**
 * Frames the lower 48 once the map is ready. Without this the map opens at a
 * fixed zoom, which crops the country badly on a phone-width container.
 */
function MapCamera({
  focusLocations,
}: {
  focusLocations: NeighborNetLocation[] | null;
}) {
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

    const setCountryZoomFloor = () => {
      const countryCamera = map.cameraForBounds(US_BOUNDS, { padding: 32 });
      if (countryCamera?.zoom !== undefined) {
        map.setMinZoom(countryCamera.zoom);
      }
    };

    const fit = (animated = false) => {
      if (userDriven) return;
      setCountryZoomFloor();
      if (!focusLocations || focusLocations.length === 0) {
        map.fitBounds(US_BOUNDS, { padding: 32, duration: animated ? 900 : 0 });
        return;
      }

      if (focusLocations.length === 1) {
        const [net] = focusLocations;
        map.easeTo({
          center: [net.longitude, net.latitude],
          zoom: 8,
          duration: animated ? 900 : 0,
        });
        return;
      }

      const longitudes = focusLocations.map((net) => net.longitude);
      const latitudes = focusLocations.map((net) => net.latitude);
      map.fitBounds(
        [
          [Math.min(...longitudes), Math.min(...latitudes)],
          [Math.max(...longitudes), Math.max(...latitudes)],
        ],
        {
          padding: { top: 72, right: 72, bottom: 72, left: 72 },
          maxZoom: 8,
          duration: animated ? 900 : 0,
        },
      );
    };

    fit(true);

    // The container can still be settling when the map first loads (and it
    // changes size on rotate or fullscreen), so refit until the user takes over.
    const observer = new ResizeObserver(() => {
      setCountryZoomFloor();
      fit(false);
    });
    observer.observe(map.getContainer());

    return () => {
      observer.disconnect();
      map.off("movestart", markUserDriven);
    };
  }, [map, isLoaded, focusLocations]);

  return null;
}

function RegionHeatmap({ nets }: { nets: NeighborNetLocation[] }) {
  const netsByDominance = useMemo(() => {
    const counts: Record<string, Record<Branch, number>> = {};
    for (const net of nets) {
      counts[net.region] ??= { brothers: 0, sisters: 0 };
      counts[net.region][net.branch] += 1;
    }

    return {
      brothers: nets.filter(
        (net) => counts[net.region].brothers >= counts[net.region].sisters,
      ),
      sisters: nets.filter(
        (net) => counts[net.region].sisters > counts[net.region].brothers,
      ),
    };
  }, [nets]);

  return (
    <>
      {netsByDominance.brothers.length ? (
        <HeatmapLayer
          branch="brothers"
          nets={netsByDominance.brothers}
          colorToken="--color-brothers-sky"
          fallbackColor="#4a90d9"
        />
      ) : null}
      {netsByDominance.sisters.length ? (
        <HeatmapLayer
          branch="sisters"
          nets={netsByDominance.sisters}
          colorToken="--color-brand-jade"
          fallbackColor="#397451"
        />
      ) : null}
    </>
  );
}

function HeatmapLayer({
  branch,
  nets,
  colorToken,
  fallbackColor,
}: {
  branch: Branch;
  nets: NeighborNetLocation[];
  colorToken: string;
  fallbackColor: string;
}) {
  const { map, isLoaded } = useMap();
  const reactId = useId().replaceAll(":", "");
  const sourceId = `neighbornet-heat-${branch}-${reactId}`;
  const layerId = `${sourceId}-layer`;
  const data = useMemo(() => toFeatureCollection(nets), [nets]);

  useEffect(() => {
    if (!map || !isLoaded) return;

    const tokenColor = getComputedStyle(document.documentElement)
      .getPropertyValue(colorToken)
      .trim();
    const color = tokenColor || fallbackColor;

    map.addSource(sourceId, { type: "geojson", data });
    const firstLabelLayer = map
      .getStyle()
      .layers?.find((layer) => layer.type === "symbol")?.id;

    map.addLayer(
      {
        id: layerId,
        type: "heatmap",
        source: sourceId,
        maxzoom: 7,
        paint: {
          "heatmap-weight": 1,
          "heatmap-intensity": [
            "interpolate",
            ["linear"],
            ["zoom"],
            1,
            0.8,
            6,
            1.5,
          ],
          "heatmap-color": [
            "interpolate",
            ["linear"],
            ["heatmap-density"],
            0,
            "rgba(0, 0, 0, 0)",
            0.18,
            withAlpha(color, 0.2),
            0.42,
            withAlpha(color, 0.48),
            0.7,
            withAlpha(color, 0.76),
            1,
            color,
          ],
          "heatmap-radius": ["interpolate", ["linear"], ["zoom"], 1, 18, 6, 52],
          "heatmap-opacity": [
            "interpolate",
            ["linear"],
            ["zoom"],
            4.5,
            0.9,
            5.5,
            0,
          ],
        },
      },
      firstLabelLayer,
    );

    return () => {
      if (map.getLayer(layerId)) map.removeLayer(layerId);
      if (map.getSource(sourceId)) map.removeSource(sourceId);
    };
  }, [colorToken, data, fallbackColor, isLoaded, layerId, map, sourceId]);

  return null;
}

function withAlpha(hex: string, alpha: number): string {
  const value = hex.replace("#", "");
  if (!/^[\da-f]{6}$/i.test(value)) return hex;
  const red = Number.parseInt(value.slice(0, 2), 16);
  const green = Number.parseInt(value.slice(2, 4), 16);
  const blue = Number.parseInt(value.slice(4, 6), 16);
  return `rgba(${red}, ${green}, ${blue}, ${alpha})`;
}

function cityKey(net: NeighborNetLocation): string {
  return net.city
    ? `${net.city}|${net.state ?? ""}`
    : `${net.longitude}|${net.latitude}`;
}

/**
 * Cities running both a brothers' and a sisters' net. Their coordinates are
 * close enough that at national zoom the two dots land on the same pixel and
 * one silently covers the other, so these are the ones worth nudging apart.
 */
function sharedCities(nets: NeighborNetLocation[]): Set<string> {
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

/** Offset exact coordinate duplicates so every source row remains clickable. */
function offsetsForSharedCoordinates(
  nets: NeighborNetLocation[],
): Record<string, [number, number]> {
  const groups: Record<string, NeighborNetLocation[]> = {};
  for (const net of nets) {
    const key = `${net.longitude}|${net.latitude}`;
    groups[key] ??= [];
    groups[key].push(net);
  }

  const offsets: Record<string, [number, number]> = {};
  for (const group of Object.values(groups)) {
    if (group.length < 2) continue;
    group.forEach((net, index) => {
      offsets[net.id] = [(index - (group.length - 1) / 2) * 18, 0];
    });
  }
  return offsets;
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
  nets: NeighborNetLocation[];
  settings: MapSettings;
  onSelect: (net: NeighborNetLocation) => void;
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

function Legend({
  settings,
  branches,
  hasInactive,
  densityMode,
}: {
  settings: MapSettings;
  branches: Branch[];
  hasInactive: boolean;
  densityMode: boolean;
}) {
  const palette = palettes[settings.palette];
  const shapeChannel =
    settings.differentiator === "shape" ||
    settings.differentiator === "color-and-shape";
  const legendBranches: Branch[] = densityMode
    ? ["brothers", "sisters"]
    : branches;

  return (
    <div className="absolute bottom-3 left-3 rounded-card border border-border bg-background/90 px-4 py-2 text-xs backdrop-blur-sm">
      <p className="mb-1.5 text-xs font-semibold text-muted-foreground">
        NeighborNets
      </p>
      <ul className="space-y-1">
        {legendBranches.map((branch) => (
          <li key={branch} className="flex items-center gap-2">
            <span
              className={cn(
                "size-3 shrink-0",
                shapeChannel && branch === "sisters" && "rotate-45",
              )}
              style={{
                backgroundColor: densityMode
                  ? branch === "brothers"
                    ? "var(--color-brothers-sky)"
                    : "var(--color-brand-jade)"
                  : palette[branch],
                borderRadius:
                  shapeChannel && branch === "sisters" ? "20%" : "9999px",
              }}
            />
            {branchLabel[branch]}
          </li>
        ))}
      </ul>
      {settings.dimInactive && hasInactive ? (
        <p className="mt-1.5 text-xs text-muted-foreground">
          Faded = forming or paused
        </p>
      ) : null}
    </div>
  );
}

function ChapterSearch({
  query,
  onQueryChange,
  onSubmit,
  onChoose,
  onReset,
  locations,
  hasSearch,
  resultCount,
}: {
  query: string;
  onQueryChange: (value: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onChoose: (value: string) => void;
  onReset: () => void;
  locations: NeighborNetLocation[];
  hasSearch: boolean;
  resultCount: number;
}) {
  const suggestions = useMemo(() => {
    const term = normalizeSearchTerm(query);
    if (!term) return [];

    return [...new Set(locations.flatMap((net) => [net.name, net.region]))]
      .filter((suggestion) => normalizeSearchTerm(suggestion).includes(term))
      .sort((a, b) => a.localeCompare(b))
      .slice(0, 6);
  }, [locations, query]);

  return (
    <div className="rounded-card bg-brand-royal p-5 text-brand-pure-white sm:p-7">
      <form onSubmit={onSubmit} role="search">
        <label htmlFor="chapter-search" className="text-h4 block">
          Find a NeighborNet near you
        </label>
        <div className="mt-4 flex flex-col gap-3 sm:flex-row">
          <div className="relative min-w-0 flex-1">
            <Search
              aria-hidden="true"
              className="pointer-events-none absolute top-1/2 left-4 size-5 -translate-y-1/2 text-brand-royal"
            />
            <input
              id="chapter-search"
              value={query}
              onChange={(event) => onQueryChange(event.target.value)}
              placeholder="Search by chapter or region"
              autoComplete="off"
              className="h-14 w-full rounded-pill border-2 border-transparent bg-brand-pure-white pr-5 pl-12 text-base text-brand-obsidian outline-none placeholder:text-brand-obsidian/55 focus-visible:border-brothers-sky"
            />
          </div>
          <button
            type="submit"
            className="h-14 rounded-pill bg-brothers-sky px-7 font-bold text-brothers-midnight transition-transform outline-none hover:-translate-y-0.5 focus-visible:ring-2 focus-visible:ring-brand-pure-white"
          >
            Search
          </button>
          {hasSearch ? (
            <button
              type="button"
              onClick={onReset}
              className="inline-flex h-14 items-center justify-center gap-2 rounded-pill border border-brand-pure-white/45 px-5 font-bold outline-none hover:bg-brand-pure-white/10 focus-visible:ring-2 focus-visible:ring-brand-pure-white"
            >
              <RotateCcw aria-hidden="true" className="size-4" />
              Reset
            </button>
          ) : null}
        </div>
        {suggestions.length > 0 ? (
          <div className="mt-4 border-t border-brand-pure-white/25 pt-4">
            <p className="text-sm font-bold">Matching locations</p>
            <ul className="mt-2 flex flex-wrap gap-2">
              {suggestions.map((suggestion) => (
                <li key={suggestion}>
                  <button
                    type="button"
                    onClick={() => onChoose(suggestion)}
                    className="rounded-pill bg-brand-pure-white/10 px-4 py-2 text-sm outline-none hover:bg-brand-pure-white/20 focus-visible:ring-2 focus-visible:ring-brand-pure-white"
                  >
                    {suggestion}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
        <span className="sr-only" aria-live="polite">
          {hasSearch
            ? `${resultCount} NeighborNets found.`
            : `${locations.length} NeighborNets available.`}
        </span>
      </form>
    </div>
  );
}

function SearchResultCards({
  query,
  results,
  selectedId,
  palette,
  onSelect,
}: {
  query: string;
  results: NeighborNetLocation[];
  selectedId: string | null;
  palette: MapSettings["palette"];
  onSelect: (net: NeighborNetLocation) => void;
}) {
  if (results.length === 0) {
    return (
      <div className="rounded-card border border-brand-obsidian/15 bg-brand-pure-white p-8 text-center">
        <h2 className="text-h4 text-brand-royal">No NeighborNets found</h2>
        <p className="mt-2 text-sm text-brand-obsidian/70">
          Try a nearby chapter name or a YM region such as Chicago, Houston, or
          Florida.
        </p>
      </div>
    );
  }

  return (
    <section aria-labelledby="chapter-results-heading">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 id="chapter-results-heading" className="text-h3 text-brand-jade">
            {results.length}{" "}
            {results.length === 1 ? "NeighborNet" : "NeighborNets"} found
          </h2>
          <p className="mt-1 text-sm text-brand-obsidian/65">
            Results for “{query}”
          </p>
        </div>
        <p className="text-sm text-brand-obsidian/65">
          Select a card or a dot on the map.
        </p>
      </div>
      <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {results.map((net) => (
          <button
            key={net.id}
            type="button"
            onClick={() => onSelect(net)}
            aria-pressed={selectedId === net.id}
            className={cn(
              "rounded-card border bg-brand-pure-white p-5 text-left transition-transform outline-none hover:-translate-y-1 focus-visible:ring-2 focus-visible:ring-brand-royal",
              selectedId === net.id
                ? "border-brand-royal shadow-md"
                : "border-brand-obsidian/15",
            )}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-h4 text-brand-obsidian">{net.name}</h3>
                <p className="mt-2 text-sm text-brand-obsidian/65">
                  {net.region}
                </p>
              </div>
              <span
                className="mt-1 size-3 shrink-0 rounded-full ring-2 ring-brand-pure-white"
                style={{ backgroundColor: branchColor(net.branch, palette) }}
              />
            </div>
            <div className="mt-6 flex items-center justify-between gap-3">
              <span className="rounded-pill bg-brothers-sky/15 px-3 py-1 text-xs font-bold text-brothers-midnight">
                {branchLabel[net.branch]}
              </span>
              <span className="text-sm font-bold text-brand-royal">
                View on map
              </span>
            </div>
          </button>
        ))}
      </div>
    </section>
  );
}

function normalizeSearchTerm(value: string): string {
  return value
    .normalize("NFKD")
    .toLocaleLowerCase("en-US")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}
