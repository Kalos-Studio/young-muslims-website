import Image from "next/image";

import { brotherLocations } from "@/generated/brother-neighbornets";
import {
  MAP_POINTS,
  MAP_STATES,
  MAP_VIEWBOX,
  type MapPoint,
} from "@/generated/neighbornets-map";
import { sisterLocations } from "@/generated/sister-neighbornets";
import type { Branch } from "@/lib/neighbornets";
import { cn } from "@/lib/utils";

import markerJade from "../../../design-assets/figma/neighbornets/map/marker-jade.svg";
import markerRoyal from "../../../design-assets/figma/neighbornets/map/marker-royal.svg";
import styles from "./neighbornets-map.module.css";

const BRANCH = new Map<string, Branch>(
  [...brotherLocations, ...sisterLocations].map((net) => [net.id, net.branch]),
);
const MARKER = { brothers: markerRoyal, sisters: markerJade } as const;
const SLOT = { [-1]: styles.slotBefore, 0: undefined, 1: styles.slotAfter };
const STATES = new Set(MAP_POINTS.map((point) => point.state));
const PLACES = STATES.has("DC")
  ? `${STATES.size - 1} states and Washington, DC`
  : `${STATES.size} states`;

function Marker({ point }: { point: MapPoint }) {
  const branch = BRANCH.get(point.id) ?? "brothers";
  return (
    <span
      data-neighbornet={point.id}
      data-state={point.state}
      data-branch={branch}
      className={cn(styles.marker, point.position, SLOT[point.slot])}
    >
      <Image src={MARKER[branch]} alt="" className="block size-full" />
    </span>
  );
}

/**
 * The NeighborNets map (Figma 301:2121, tablet 374:621, mobile 401:1582): the
 * lower 48 states as SVG, every NeighborNet on it as its side's YM circle
 * (Royal for Brothers, Jade for Sisters), all from build-time data
 * (scripts/neighbornets-map.mjs) in one projection, so each marker sits at its
 * coordinates. Static for now; zoom, the state panel, search and the net
 * detail build on this frame.
 */
export function NeighborNetsMap() {
  return (
    <div data-neighbornets-map className={styles.frame}>
      <svg
        viewBox={`0 0 ${MAP_VIEWBOX.width} ${MAP_VIEWBOX.height}`}
        role="img"
        aria-label={`Map of the United States marking ${MAP_POINTS.length} Young Muslims NeighborNets across ${PLACES}.`}
        className={styles.map}
      >
        <g
          className={cn(
            styles.states,
            "fill-brand-warm-snow stroke-neighbornets-map-outline",
          )}
        >
          {MAP_STATES.map((state) => (
            <path key={state.code} d={state.d} data-state={state.code} />
          ))}
        </g>
      </svg>
      <div aria-hidden className={styles.markers}>
        {MAP_POINTS.map((point) => (
          <Marker key={point.id} point={point} />
        ))}
      </div>
    </div>
  );
}
