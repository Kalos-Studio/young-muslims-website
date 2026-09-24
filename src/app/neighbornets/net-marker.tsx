"use client";

import { cn } from "@/lib/utils";
import type { Branch, NeighborNetLocation } from "@/lib/neighbornets";
import {
  palettes,
  type Differentiator,
  type MarkerStyle,
  type Palette,
  type SizeMode,
} from "./map-options";

/**
 * The visual glyph for one neighbornet. Everything about how a net looks lives
 * here so the debug panel only has to flip settings, and so a future
 * "we picked this one" cleanup is a matter of deleting branches.
 */

export function branchColor(branch: Branch, palette: Palette): string {
  return palettes[palette][branch];
}

/** Diamond for sisters is what makes the shape channel readable without color. */
function usesShape(differentiator: Differentiator): boolean {
  return differentiator === "shape" || differentiator === "color-and-shape";
}

function usesInitial(
  differentiator: Differentiator,
  markerStyle: MarkerStyle,
): boolean {
  return differentiator === "initial" || markerStyle === "initial";
}

/**
 * Base diameter in px. `by-size` interpolates between 12 and 26px across a
 * headcount range of roughly 5–35, which is the spread in the seed data.
 */
function glyphSize(
  net: NeighborNetLocation,
  sizeMode: SizeMode,
  hasLetter: boolean,
) {
  const base = hasLetter ? 20 : 14;
  if (sizeMode === "uniform" || net.size === undefined) return base;
  const clamped = Math.min(Math.max(net.size, 5), 35);
  const scaled = 12 + ((clamped - 5) / 30) * 14;
  return Math.round(Math.max(scaled, hasLetter ? 18 : 12));
}

export type NetMarkerProps = {
  net: NeighborNetLocation;
  markerStyle: MarkerStyle;
  differentiator: Differentiator;
  palette: Palette;
  sizeMode: SizeMode;
  /** Paused and forming nets can be knocked back so active ones read first. */
  dimInactive: boolean;
  /** The net is hovered or selected, so nudge it forward. */
  emphasized: boolean;
};

export function NetMarker({
  net,
  markerStyle,
  differentiator,
  palette,
  sizeMode,
  dimInactive,
  emphasized,
}: NetMarkerProps) {
  const color = branchColor(net.branch, palette);
  const letter = usesInitial(differentiator, markerStyle)
    ? net.branch === "brothers"
      ? "B"
      : "S"
    : null;
  const diamond = usesShape(differentiator) && net.branch === "sisters";
  const size = glyphSize(net, sizeMode, letter !== null);

  const muted = dimInactive && net.status !== "active";
  const opacity = muted ? 0.45 : 1;

  if (markerStyle === "pin") {
    return (
      <Pin
        color={color}
        letter={letter}
        emphasized={emphasized}
        opacity={opacity}
        outlineDashed={net.status === "forming"}
      />
    );
  }

  return (
    <div
      className={cn(
        "relative flex items-center justify-center transition-transform duration-150",
        emphasized && "scale-125",
      )}
      style={{ width: size, height: size, opacity }}
    >
      {markerStyle === "pulse" && !muted ? (
        <span
          className="absolute inset-0 animate-ping rounded-full"
          style={{
            backgroundColor: color,
            opacity: 0.35,
            borderRadius: diamond ? "20%" : "9999px",
          }}
        />
      ) : null}
      <span
        className={cn(
          "relative flex items-center justify-center font-semibold text-white",
          markerStyle === "ring" || markerStyle === "pulse"
            ? "shadow-sm ring-2 ring-background"
            : null,
          emphasized && "ring-2 ring-foreground",
        )}
        style={{
          width: size,
          height: size,
          backgroundColor: color,
          borderRadius: diamond ? "20%" : "9999px",
          transform: diamond ? "rotate(45deg)" : undefined,
          fontSize: Math.round(size * 0.55),
          lineHeight: 1,
          // Forming nets get a hollow center so they read as "not yet running"
          // even when the dim-inactive toggle is off.
          boxShadow:
            net.status === "forming" ? "inset 0 0 0 3px white" : undefined,
        }}
      >
        {letter ? (
          <span style={{ transform: diamond ? "rotate(-45deg)" : undefined }}>
            {letter}
          </span>
        ) : null}
      </span>
    </div>
  );
}

function Pin({
  color,
  letter,
  emphasized,
  opacity,
  outlineDashed,
}: {
  color: string;
  letter: string | null;
  emphasized: boolean;
  opacity: number;
  outlineDashed: boolean;
}) {
  return (
    <div
      className={cn(
        "origin-bottom transition-transform duration-150",
        emphasized && "scale-125",
      )}
      style={{ opacity }}
    >
      <svg width={22} height={30} viewBox="0 0 22 30" aria-hidden="true">
        <path
          d="M11 29C11 29 20 18.5 20 11A9 9 0 1 0 2 11C2 18.5 11 29 11 29Z"
          fill={color}
          stroke="white"
          strokeWidth={outlineDashed ? 1.5 : 2}
          strokeDasharray={outlineDashed ? "3 2" : undefined}
        />
        {letter ? (
          <text
            x="11"
            y="14.5"
            textAnchor="middle"
            fontSize="9"
            fontWeight="700"
            fill="white"
          >
            {letter}
          </text>
        ) : (
          <circle cx="11" cy="11" r="3.2" fill="white" fillOpacity={0.85} />
        )}
      </svg>
    </div>
  );
}
