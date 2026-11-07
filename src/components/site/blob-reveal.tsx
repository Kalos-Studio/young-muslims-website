"use client";

import { useEffect, useRef, type ComponentPropsWithoutRef } from "react";

import { cn } from "@/lib/utils";

/**
 * The sides and corners a directional reveal can start from. The covering
 * layer's blob slides away from this origin, so the content underneath
 * appears there first, behind the blob's trailing organic edge.
 */
export const BLOB_REVEAL_DIRECTIONS = [
  "top",
  "bottom",
  "left",
  "right",
  "top-left",
  "top-right",
  "bottom-left",
  "bottom-right",
] as const;

export type BlobRevealDirection = (typeof BLOB_REVEAL_DIRECTIONS)[number];

/**
 * Where a reveal starts: one of the eight directions, or `"center"`, where a
 * blob grows from nothing at the viewport centre and uncovers the content
 * from the middle outward.
 */
export type BlobRevealOrigin = BlobRevealDirection | "center";

/**
 * Picks one of the eight directions at random, for reveals that should vary
 * (such as page transitions). Pass `"center"` directly for a centre reveal.
 */
export function pickBlobRevealOrigin(): BlobRevealDirection {
  return BLOB_REVEAL_DIRECTIONS[
    Math.floor(Math.random() * BLOB_REVEAL_DIRECTIONS.length)
  ];
}

/**
 * How many curated blob shapes exist (`--blob-reveal-shape-1` to `-6` in
 * globals.css). Keep this in step with that list.
 */
export const BLOB_REVEAL_SHAPE_COUNT = 6;

/** Picks one of the curated blob shapes at random (1-based). */
export function pickBlobRevealShape() {
  return 1 + Math.floor(Math.random() * BLOB_REVEAL_SHAPE_COUNT);
}

/**
 * Reads a time token such as `--duration-blob-reveal` (in ms or s) from the
 * root, so timers in JavaScript follow the documented CSS tokens.
 */
export function readTimeToken(name: string, fallbackMs: number) {
  const value = getComputedStyle(document.documentElement)
    .getPropertyValue(name)
    .trim();
  const amount = Number.parseFloat(value);
  if (Number.isNaN(amount)) return fallbackMs;
  return value.endsWith("ms") ? amount : amount * 1000;
}

type BlobRevealProps = ComponentPropsWithoutRef<"div"> & {
  /** False while the layer covers the page; true starts the reveal. */
  revealing: boolean;
  /**
   * Where the reveal starts. A direction can be picked when the reveal
   * starts; `"center"` should be set from the first render, because the
   * covering mask differs.
   */
  origin?: BlobRevealOrigin;
  /**
   * Pins one of the curated shapes (1 to BLOB_REVEAL_SHAPE_COUNT). By
   * default a shape is picked at random for every play.
   */
  shape?: number;
  /** Called once the blob has left the viewport. */
  onRevealed?: () => void;
};

/**
 * A covering layer that wipes away with an organic blob.
 *
 * Directional origins: the layer is visible only inside a blob-shaped CSS
 * mask that starts large enough to cover the viewport, and revealing slides
 * the mask off-screen away from `origin`, uncovering the content behind the
 * blob's trailing edge (mask-position animates).
 *
 * `origin="center"`: the layer is visible outside a blob that grows from
 * nothing at the viewport centre, uncovering the content from the middle
 * outward (the blob's mask-size animates).
 *
 * Neither the layer nor the content fades or moves; only the mask changes,
 * and both mask-position and mask-size interpolate reliably as plain lengths.
 *
 * Each play uses one of the curated blob shapes, picked at random on mount
 * and again whenever `revealing` returns to false, so a reused layer gets a
 * fresh shape every time. The pick is made on the client after hydration;
 * until then (and on the server) shape 1 is used.
 *
 * Geometry and timing are the `--blob-reveal-*`, `--duration-blob-reveal`
 * and `--ease-blob-reveal` tokens (see "Blob reveal" in DESIGN-SYSTEM.md).
 * Under reduced motion the reveal completes instantly.
 */
export function BlobReveal({
  revealing,
  origin,
  shape,
  onRevealed,
  className,
  children,
  ...props
}: BlobRevealProps) {
  const layerRef = useRef<HTMLDivElement>(null);
  const onRevealedRef = useRef(onRevealed);

  useEffect(() => {
    onRevealedRef.current = onRevealed;
  });

  // Arm the next play with a random shape. Set directly on the element so the
  // server render stays deterministic and the pick costs no extra render.
  useEffect(() => {
    if (revealing || shape !== undefined) return;
    const layer = layerRef.current;
    if (layer) layer.dataset.blobShape = String(pickBlobRevealShape());
  }, [revealing, shape]);

  useEffect(() => {
    if (!revealing) return;
    const layer = layerRef.current;
    if (!layer) return;

    let complete = false;
    const finish = () => {
      if (complete) return;
      complete = true;
      onRevealedRef.current?.();
    };
    const onTransitionEnd = (event: TransitionEvent) => {
      if (event.target === layer && event.propertyName.includes("mask")) {
        finish();
      }
    };
    // Fallback in case the transition never runs (e.g. a hidden tab).
    const fallback = window.setTimeout(
      finish,
      readTimeToken("--duration-blob-reveal", 700) + 250,
    );

    layer.addEventListener("transitionend", onTransitionEnd);
    return () => {
      layer.removeEventListener("transitionend", onTransitionEnd);
      window.clearTimeout(fallback);
    };
  }, [revealing]);

  return (
    <div
      ref={layerRef}
      {...props}
      className={cn("ym-blob-reveal", className)}
      data-blob-origin={origin}
      data-blob-shape={shape}
      data-blob-state={revealing ? "revealing" : "covering"}
    >
      {children}
    </div>
  );
}
