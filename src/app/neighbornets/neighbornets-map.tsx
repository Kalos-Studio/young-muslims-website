import { brotherLocations } from "@/generated/brother-neighbornets";
import { MAP_STATES } from "@/generated/neighbornets-map";
import {
  MAP_POINTS,
  MAP_VIEWBOX,
  type MapPoint,
} from "@/generated/neighbornets-map-index";
import { sisterLocations } from "@/generated/sister-neighbornets";
import type { Branch } from "@/lib/neighbornets";
import { cn } from "@/lib/utils";

import { NeighborNetsMapMotion } from "./neighbornets-map-motion";
import styles from "./neighbornets-map.module.css";

const NETS = new Map<string, { name: string; branch: Branch }>(
  [...brotherLocations, ...sisterLocations].map((net) => [net.id, net]),
);
const VIEWBOX = `0 0 ${MAP_VIEWBOX.width} ${MAP_VIEWBOX.height}`;
/** Each side's marker art (a background, so a marker is one element). */
const MARKER = { brothers: styles.royal, sisters: styles.jade } as const;
const SLOT = { [-1]: styles.slotBefore, 0: undefined, 1: styles.slotAfter };
const STATES = new Set(MAP_POINTS.map((point) => point.state));
const PLACES = STATES.has("DC")
  ? `${STATES.size - 1} states and Washington, DC`
  : `${STATES.size} states`;

/**
 * A NeighborNet's marker: a button (NeighborNetsMapMotion takes its click
 * and opens the net's panel). Out of the tab order: keyboard users reach the
 * nets through the results panels and, next, the search.
 */
function Marker({ point }: { point: MapPoint }) {
  const net = NETS.get(point.id);
  const branch = net?.branch ?? "brothers";
  return (
    <button
      type="button"
      tabIndex={-1}
      aria-label={`${net?.name ?? "NeighborNet"} NeighborNet`}
      data-neighbornet={point.id}
      data-state={point.state}
      data-branch={branch}
      className={cn(
        "rounded-full",
        styles.marker,
        MARKER[branch],
        point.position,
        SLOT[point.slot],
      )}
    />
  );
}

/**
 * The NeighborNets map (Figma 301:2121, tablet 374:621, mobile 401:1582): the
 * lower 48 states as SVG, every NeighborNet on it as its side's YM circle
 * (Royal for Brothers, Jade for Sisters), all from build-time data
 * (scripts/neighbornets-map.mjs) in one projection, so each marker sits at its
 * coordinates.
 *
 * Layers: the lens (NeighborNetsMapMotion magnifies it) holds the selected
 * and hovered states' fills (a small SVG) under the states' outlines
 * (unfilled; the section's Warm Snow shows through); the place labels and
 * then the markers sit over it, never magnified (each is moved to where the
 * view puts it).
 */
export function NeighborNetsMap() {
  return (
    <NeighborNetsMapMotion className={styles.frame}>
      <div data-map-part="lens" className={styles.lens}>
        {/* The selected state's fill (it stays while its panel is open), then
            the hovered state's (it follows the pointer): one small layer. */}
        <svg aria-hidden viewBox={VIEWBOX} className={styles.highlight}>
          <path data-map-part="selected" className="fill-border" />
          <path
            data-map-part="highlight"
            className="fill-neighbornets-map-hover"
          />
        </svg>
        <svg
          data-map-part="states"
          viewBox={VIEWBOX}
          role="img"
          aria-label={`Map of the United States marking ${MAP_POINTS.length} Young Muslims NeighborNets across ${PLACES}.`}
          className={styles.map}
        >
          <g
            className={cn(
              styles.states,
              "fill-none stroke-neighbornets-map-outline",
            )}
          >
            {MAP_STATES.map((state) => (
              <path key={state.code} d={state.d} data-state={state.code} />
            ))}
          </g>
        </svg>
      </div>
      {/* Place labels, filled in once the map zooms in (map-labels.ts). */}
      <div aria-hidden data-map-part="labels" className={styles.labels} />
      <div data-map-part="markers" className={styles.markers}>
        {MAP_POINTS.map((point) => (
          <Marker key={point.id} point={point} />
        ))}
      </div>
    </NeighborNetsMapMotion>
  );
}
