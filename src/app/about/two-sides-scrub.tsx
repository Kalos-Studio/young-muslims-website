"use client";

import { useMotionValueEvent, useScroll } from "motion/react";
import { useLayoutEffect, useRef } from "react";

import { readLengthToken } from "@/lib/motion-tokens";
import { readRootToken } from "@/lib/shape-motion";

/**
 * When the section pins and its sequence runs. Must match the media
 * queries in two-sides-section.module.css: the CSS lays the section out,
 * this decides whether to drive it.
 */
const PINNED_QUERY =
  "(prefers-reduced-motion: no-preference) and (height > 30rem) and (width >= 48rem), (prefers-reduced-motion: no-preference) and (height > 46rem)";
/** Tablet and desktop run the flow across; phones, stacked, run it down. */
const ACROSS_QUERY = "(width >= 48rem)";

/*
 * Each monogram's own box in its logo's canvas, as shares of the logo's
 * width (Figma 542:53 / 542:66: x, y and size of 485), and where its
 * in-wordmark art sits in its rig (the rig is the standalone logo's box):
 * filling it, for both. Both standalones fill their box to the edge of
 * their circle (the Brothers raster trimmed to its disc), so the circles
 * align and the two sides show the same size.
 */
const MARKS = {
  brothers: { box: [80.86, 0.34, 121.97], inset: 0 },
  sisters: { box: [81.33, 0, 122.04], inset: 0 },
} as const;
const LOGO_WIDTH = 484.93;

const clamp = (value: number) => Math.min(1, Math.max(0, value));
const span = (p: number, from: number, to: number) =>
  clamp((p - from) / (to - from));
/** Eases a 0..1 share in and out with no step in its rate at either end. */
const smooth = (t: number) => t * t * (3 - 2 * t);

type Rect = { x: number; y: number; size: number };

/**
 * A curve through `values` at `knots` (ascending) whose rate never jumps:
 * a monotone cubic (Fritsch-Butland tangents), so it passes each keyframe
 * exactly, never overshoots, comes to rest only where the motion turns
 * round, starts from rest and leaves the last keyframe still moving.
 */
const curve = (knots: number[], values: number[]) => {
  const last = knots.length - 1;
  const h = knots.slice(1).map((knot, k) => knot - knots[k]);
  const d = h.map((width, k) => (values[k + 1] - values[k]) / width);
  const m = knots.map((_, k) => {
    if (k === 0) return 0;
    if (k === last) return d[last - 1];
    const [d0, d1, h0, h1] = [d[k - 1], d[k], h[k - 1], h[k]];
    if (d0 * d1 <= 0) return 0;
    return (3 * (h0 + h1)) / ((2 * h1 + h0) / d0 + (h1 + 2 * h0) / d1);
  });
  return (p: number) => {
    if (p <= knots[0]) return values[0];
    if (p >= knots[last]) return values[last];
    let k = 0;
    while (p > knots[k + 1]) k++;
    const t = (p - knots[k]) / h[k];
    const [t2, t3] = [t * t, t * t * t];
    return (
      (2 * t3 - 3 * t2 + 1) * values[k] +
      (t3 - 2 * t2 + t) * h[k] * m[k] +
      (-2 * t3 + 3 * t2) * values[k + 1] +
      (t3 - t2) * h[k] * m[k + 1]
    );
  };
};

/**
 * The rig's box along its path: its circle's centre and its size (on a log
 * scale, so the zoom reads at an even pace) each follow one curve through
 * the keyframes, so neither moving nor growing changes speed abruptly.
 */
const path = (knots: number[], frames: Rect[]) => {
  const centreX = curve(
    knots,
    frames.map((f) => f.x + f.size / 2),
  );
  const centreY = curve(
    knots,
    frames.map((f) => f.y + f.size / 2),
  );
  const logSize = curve(
    knots,
    frames.map((f) => Math.log(f.size)),
  );
  return (p: number): Rect => {
    const size = Math.exp(logSize(p));
    return { x: centreX(p) - size / 2, y: centreY(p) - size / 2, size };
  };
};

type Rig = {
  rig: HTMLElement;
  mark: HTMLElement;
  standalone: HTMLElement;
  /** The in-logo monogram the rig takes over from. */
  monogram: HTMLElement;
  /** The rig's box (the standalone logo's) at each key moment, in px. */
  start: Rect;
  frame3: Rect;
  frame4: Rect;
  exit: Rect;
  /** Its box at any progress, through those (set when armed). */
  at: (p: number) => Rect;
};

type Phases = {
  holdEnd: number;
  fadeEnd: number;
  growEnd: number;
  crossfadeStart: number;
  crossfadeEnd: number;
  zoomFrameAt: number;
  zoomEnd: number;
};

type Parts = {
  stage: HTMLElement;
  /** The heading and paragraph, and each logo's letters. */
  fades: HTMLElement[];
  phases: Phases;
  /** The rigs and their laid-out size, in px. */
  rigs: Rig[];
  rigSize: number;
};

/**
 * Drives the "Two sides" section's pinned sequence. It fills the section
 * (an invisible layer, the scroll target) and finds the parts by
 * `data-two-sides`: the `stage`, the copy (`copy`), each logo's `letters`
 * and `monogram`, and the `rig`s.
 *
 * One scroll-linked value (0 as the section's top meets the viewport's top,
 * 1 as its foot meets the viewport's foot: the whole runway, while the stage
 * is pinned) is cut into phases (tokens):
 *
 * - to `--two-sides-hold-end`: the default state holds; the stage's
 *   `data-phase` is "default", so the hover reveal is available;
 * - to `--two-sides-fade-end`: the copy and the letters fade out, the
 *   monograms staying where they are; `data-phase` is "collapsing", which
 *   switches the hover off (a reveal in progress reverses on its own);
 * - to `--two-sides-grow-end`: each monogram's rig takes over from it,
 *   exactly in its place, and moves and grows to Figma's frame 3 (the
 *   standalone logos centred, side by side; on phones, stacked),
 *   crossfading from the in-wordmark art to the standalone logo over
 *   `--two-sides-crossfade-start` to `-end` (the standalone fading in on top
 *   of the still-solid in-wordmark art, which then drops away);
 * - to `--two-sides-zoom-end`: they grow on through Figma's frame 4 (at
 *   `--two-sides-zoom-frame-at`) and push out of frame, Brothers left and
 *   Sisters right (on phones, Brothers off the top, Sisters the foot);
 * - the release: they leave the frame as the runway ends, so the stage
 *   releases straight into the Shura section, with no empty hold.
 *
 * The monograms pass through those frames on one continuous curve (their
 * centres and sizes, the size on a log scale), not an ease per phase, so
 * they never stop between frames or change speed at a phase boundary; the
 * fades ease in and out with no step in rate either. The scrub reads the
 * window scroll Lenis drives, so it moves in step with the smoothing.
 *
 * Each rig is laid out at its largest and only scaled down, so it stays
 * sharp; the frames' sizes come from tokens in logo widths, the positions
 * from the stage and logos as measured on load and resize. Only transform
 * (translate3d + scale) and opacity are written, straight to promoted
 * layers, and only when they change; `data-phase` only when the phase does.
 * Lenis smooths the wheel. Outside the pinned layout (reduced motion, short
 * screens) nothing is driven and every value is cleared.
 */
export function TwoSidesScrub() {
  const targetRef = useRef<HTMLDivElement>(null);
  const partsRef = useRef<Parts | null>(null);
  const written = useRef(new Map<HTMLElement, string>());
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start start", "end end"],
  });

  const opacity = (element: HTMLElement, value: number) => {
    const text = value.toFixed(3);
    if (written.current.get(element) === text) return;
    written.current.set(element, text);
    element.style.opacity = text;
  };

  const place = (element: HTMLElement, rect: Rect, size: number) => {
    const text = `translate3d(${rect.x.toFixed(2)}px, ${rect.y.toFixed(2)}px, 0) scale(${(rect.size / size).toFixed(5)})`;
    const key = `t:${text}`;
    if (written.current.get(element) === key) return;
    written.current.set(element, key);
    element.style.transform = text;
  };

  const apply = (progress: number) => {
    const parts = partsRef.current;
    if (!parts) return;
    const { phases } = parts;
    const p = clamp(progress);
    const phase = p < phases.holdEnd ? "default" : "collapsing";
    if (parts.stage.dataset.phase !== phase) parts.stage.dataset.phase = phase;
    const fade = smooth(span(p, phases.holdEnd, phases.fadeEnd));
    for (const element of parts.fades) opacity(element, 1 - fade);

    const moving = p >= phases.fadeEnd;
    const crossfade = smooth(
      span(p, phases.crossfadeStart, phases.crossfadeEnd),
    );
    for (const rig of parts.rigs) {
      // The rig takes over from the in-logo monogram, in its exact place.
      opacity(rig.rig, moving ? 1 : 0);
      opacity(rig.monogram, moving ? 0 : 1);
      // The standalone fades in over the in-wordmark art, which stays solid
      // under it until it is covered, then drops away.
      opacity(rig.standalone, crossfade);
      opacity(rig.mark, crossfade < 1 ? 1 : 0);
      place(rig.rig, rig.at(p), parts.rigSize);
    }
  };

  useLayoutEffect(() => {
    const section = targetRef.current?.parentElement;
    if (!section) return;
    const pinned = window.matchMedia(PINNED_QUERY);
    const across = window.matchMedia(ACROSS_QUERY);
    const one = (name: string) =>
      section.querySelector<HTMLElement>(`[data-two-sides="${name}"]`);
    const number = (name: string, fallback: number) => {
      const value = Number.parseFloat(readRootToken(name, String(fallback)));
      return Number.isNaN(value) ? fallback : value;
    };

    const clear = () => {
      const parts = partsRef.current;
      if (!parts) return;
      delete parts.stage.dataset.phase;
      for (const element of parts.fades) element.style.opacity = "";
      for (const rig of parts.rigs) {
        for (const element of [
          rig.rig,
          rig.mark,
          rig.standalone,
          rig.monogram,
        ]) {
          element.style.opacity = "";
          element.style.transform = "";
        }
      }
      written.current.clear();
      partsRef.current = null;
    };

    /* Each rig's key boxes, from the stage and logos as laid out now. */
    const measureRigs = (stage: HTMLElement, phases: Phases): Rig[] => {
      const stageBox = stage.getBoundingClientRect();
      const horizontal = across.matches;
      // Across: centred below the header's clearance (Figma's desktop and
      // tablet frames); down: centred on the stage (Figma's phone frames).
      const clearance = horizontal
        ? readLengthToken("--two-sides-stage-clearance", 80)
        : 0;
      const centreX = stageBox.width / 2;
      const centreY = clearance + (stageBox.height - clearance) / 2;
      const ratio = (name: string, fallback: number) => number(name, fallback);
      return (["brothers", "sisters"] as const).flatMap((key) => {
        const side = section.querySelector<HTMLElement>(
          `[data-two-sides="side"][data-side="${key}"]`,
        );
        const rig = section.querySelector<HTMLElement>(
          `[data-two-sides="rig"][data-side="${key}"]`,
        );
        const monogram = side?.querySelector<HTMLElement>(
          '[data-two-sides="monogram"]',
        );
        const mark = rig?.querySelector<HTMLElement>(
          '[data-two-sides="rig-mark"]',
        );
        const standalone = rig?.querySelector<HTMLElement>(
          '[data-two-sides="rig-standalone"]',
        );
        if (!side || !rig || !monogram || !mark || !standalone) return [];
        const logo = side.getBoundingClientRect();
        const unit = logo.width / LOGO_WIDTH;
        const { box, inset } = MARKS[key];
        // Where the in-wordmark art is now; the rig's box around it.
        const markSize = box[2] * unit;
        const startSize = markSize / (1 - 2 * inset);
        const start = {
          x: logo.left - stageBox.left + box[0] * unit - inset * startSize,
          y: logo.top - stageBox.top + box[1] * unit - inset * startSize,
          size: startSize,
        };
        // Brothers first: left across, on top down.
        const first = key === "brothers";
        const lead = (centre: number, size: number, gap: number) =>
          first ? centre - gap / 2 - size : centre + gap / 2;
        const pair = (size: number, gap: number): Rect =>
          horizontal
            ? { x: lead(centreX, size, gap), y: centreY - size / 2, size }
            : { x: centreX - size / 2, y: lead(centreY, size, gap), size };
        const frame3 = pair(
          ratio("--two-sides-standalone-size", 0.6907) * logo.width,
          ratio("--two-sides-standalone-gap", 0.1488) * logo.width,
        );
        const frame4 = pair(
          ratio("--two-sides-zoom-size", 1.732) * logo.width,
          ratio("--two-sides-zoom-gap", 0.373) * logo.width,
        );
        const exitSize = ratio("--two-sides-exit-size", 1.9794) * logo.width;
        // Out of frame: Brothers off the left (top), Sisters the right (foot).
        const exit = horizontal
          ? {
              x: first ? -exitSize : stageBox.width,
              y: centreY - exitSize / 2,
              size: exitSize,
            }
          : {
              x: centreX - exitSize / 2,
              y: first ? -exitSize : stageBox.height,
              size: exitSize,
            };
        const at = path(
          [phases.fadeEnd, phases.growEnd, phases.zoomFrameAt, phases.zoomEnd],
          [start, frame3, frame4, exit],
        );
        return [
          { rig, mark, standalone, monogram, start, frame3, frame4, exit, at },
        ];
      });
    };

    const arm = () => {
      clear();
      const stage = one("stage");
      if (!pinned.matches || !stage) return;
      const phases: Phases = {
        holdEnd: number("--two-sides-hold-end", 0.1364),
        fadeEnd: number("--two-sides-fade-end", 0.3409),
        growEnd: number("--two-sides-grow-end", 0.6591),
        crossfadeStart: number("--two-sides-crossfade-start", 0.5625),
        crossfadeEnd: number("--two-sides-crossfade-end", 0.5966),
        zoomFrameAt: number("--two-sides-zoom-frame-at", 0.8523),
        zoomEnd: number("--two-sides-zoom-end", 1),
      };
      const rigs = measureRigs(stage, phases);
      partsRef.current = {
        stage,
        fades: [
          ...section.querySelectorAll<HTMLElement>(
            '[data-two-sides="copy"], [data-two-sides="letters"]',
          ),
        ],
        phases,
        rigs,
        rigSize: rigs[0]?.rig.offsetWidth ?? 1,
      };
      apply(scrollYProgress.get());
    };
    arm();
    pinned.addEventListener("change", arm);
    across.addEventListener("change", arm);
    window.addEventListener("resize", arm);
    return () => {
      pinned.removeEventListener("change", arm);
      across.removeEventListener("change", arm);
      window.removeEventListener("resize", arm);
      clear();
    };
    // `apply` reads only refs; re-arming per render would reset the cache.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scrollYProgress]);

  useMotionValueEvent(scrollYProgress, "change", apply);

  return (
    <div
      ref={targetRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0"
    />
  );
}
