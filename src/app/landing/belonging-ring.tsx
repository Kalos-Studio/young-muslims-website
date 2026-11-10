"use client";

import {
  animate,
  cubicBezier,
  inView,
  useMotionValueEvent,
  useScroll,
} from "motion/react";
import { getImageProps, type StaticImageData } from "next/image";
import { useEffect, useRef } from "react";

import { readTimeToken } from "@/components/site/blob-reveal";
import { readEaseToken, readTurnsToken } from "@/lib/motion-tokens";
import { cn } from "@/lib/utils";

import face38 from "../../../design-assets/figma/landing-2026/belonging/face-37-38.png";
import face39 from "../../../design-assets/figma/landing-2026/belonging/face-37-39.png";
import face41 from "../../../design-assets/figma/landing-2026/belonging/face-37-41.png";
import face42 from "../../../design-assets/figma/landing-2026/belonging/face-37-42.png";
import face43 from "../../../design-assets/figma/landing-2026/belonging/face-37-43.png";
import face44 from "../../../design-assets/figma/landing-2026/belonging/face-37-44.png";
import face45 from "../../../design-assets/figma/landing-2026/belonging/face-37-45.png";
import face46 from "../../../design-assets/figma/landing-2026/belonging/face-37-46.png";
import face48 from "../../../design-assets/figma/landing-2026/belonging/face-37-48.png";
import face51 from "../../../design-assets/figma/landing-2026/belonging/face-37-51.png";
import face52 from "../../../design-assets/figma/landing-2026/belonging/face-37-52.png";
import face53 from "../../../design-assets/figma/landing-2026/belonging/face-37-53.png";
import face54 from "../../../design-assets/figma/landing-2026/belonging/face-37-54.png";
import face55 from "../../../design-assets/figma/landing-2026/belonging/face-37-55.png";
import face56 from "../../../design-assets/figma/landing-2026/belonging/face-37-56.png";
import face57 from "../../../design-assets/figma/landing-2026/belonging/face-37-57.png";
import face58 from "../../../design-assets/figma/landing-2026/belonging/face-37-58.png";
import face59 from "../../../design-assets/figma/landing-2026/belonging/face-37-59.png";
import face60 from "../../../design-assets/figma/landing-2026/belonging/face-37-60.png";
import face61 from "../../../design-assets/figma/landing-2026/belonging/face-37-61.png";
import styles from "./belonging-section.module.css";

type Face = {
  image: StaticImageData;
  /** Size of the unrotated face in Figma desktop units (37:37). */
  width: number;
  height: number;
  /** Figma's rotation of the face, in degrees clockwise. */
  rotate?: number;
};

/**
 * The 20 faces of Figma 37:37 in ring order, clockwise from the oval's left
 * end (sorted by where each sits on the oval).
 */
const FACES: Face[] = [
  { image: face60, width: 197.586, height: 207.616, rotate: -30 },
  { image: face59, width: 236.309, height: 184.643, rotate: -90 },
  { image: face61, width: 219.237, height: 217 },
  { image: face58, width: 208.051, height: 232.659 },
  { image: face57, width: 212.454, height: 218.045, rotate: 4.85 },
  { image: face56, width: 230.422, height: 205.814 },
  { image: face55, width: 200.221, height: 205.814 },
  { image: face54, width: 211.407, height: 196.866 },
  { image: face53, width: 192.391, height: 184.561 },
  { image: face52, width: 209.17, height: 200.221 },
  { image: face51, width: 219.679, height: 194.742, rotate: 165 },
  { image: face48, width: 208.051, height: 213.644 },
  { image: face46, width: 224.586, height: 203.016, rotate: -126.04 },
  { image: face45, width: 224.829, height: 213.644 },
  { image: face44, width: 249.438, height: 241.608 },
  { image: face43, width: 233.864, height: 217.937, rotate: -135 },
  { image: face42, width: 224.829, height: 225.948 },
  { image: face41, width: 241.608, height: 222.592 },
  { image: face39, width: 214.762, height: 220.355 },
  { image: face38, width: 193.51, height: 208.051 },
];

/**
 * The oval the faces sit on, fitted to the face centres of the desktop frame
 * (37:19 coordinates): centre, radii and tilt.
 */
const OVAL = {
  cx: 742.6404,
  cy: 859.6134,
  rx: 951.03,
  ry: 414.6331,
  tilt: -0.3436,
};
/**
 * Faces are spaced evenly along the oval, starting this fraction of the way
 * round from its right end, which keeps each close to its place in Figma.
 */
const FIRST_FACE = 0.48155;
/** Faces are drawn at this share of their Figma size for room between them. */
const FACE_SCALE = 0.84;
/**
 * The SVG's box in Figma units: 2300 x 1280, centred on the copy (720,
 * 871.6), so the ring stays centred on the copy at every width.
 */
const VIEW_X = -430;
const VIEW_WIDTH = 2300;
const VIEW_BOX = `${VIEW_X} 231.6 ${VIEW_WIDTH} 1280`;

/**
 * The stream-in plays once per page load. Kept at module level so a remount
 * (navigating away and back) shows the ring at rest instead of replaying it.
 */
let swirlPlayed = false;

/**
 * Arc length along the oval, sampled, so faces can be spaced evenly: each
 * sample's share of the perimeter, and the perimeter in Figma units.
 */
const SAMPLES = 1440;
const { ARC, PERIMETER } = (() => {
  const lengths = [0];
  let previous = [OVAL.rx, 0];
  for (let i = 1; i <= SAMPLES; i += 1) {
    const angle = (i / SAMPLES) * Math.PI * 2;
    const point = [OVAL.rx * Math.cos(angle), OVAL.ry * Math.sin(angle)];
    lengths.push(
      lengths[i - 1] +
        Math.hypot(point[0] - previous[0], point[1] - previous[1]),
    );
    previous = point;
  }
  const total = lengths[SAMPLES];
  return {
    ARC: lengths.map((length) => length / total),
    PERIMETER: total,
  };
})();

/**
 * The point a given fraction of the way round the oval (clockwise on screen
 * from its right end), in Figma units.
 */
function pointOnOval(fraction: number) {
  const target = ((fraction % 1) + 1) % 1;
  let low = 0;
  let high = SAMPLES;
  while (high - low > 1) {
    const middle = (low + high) >> 1;
    if (ARC[middle] <= target) low = middle;
    else high = middle;
  }
  const step = (target - ARC[low]) / (ARC[high] - ARC[low] || 1);
  const angle = ((low + step) / SAMPLES) * Math.PI * 2;
  const u = OVAL.rx * Math.cos(angle);
  const v = OVAL.ry * Math.sin(angle);
  const cos = Math.cos(OVAL.tilt);
  const sin = Math.sin(OVAL.tilt);
  return [OVAL.cx + u * cos - v * sin, OVAL.cy + u * sin + v * cos];
}

function translate([x, y]: number[]) {
  return `translate(${x.toFixed(2)} ${y.toFixed(2)})`;
}

const clamp01 = (value: number) => Math.min(1, Math.max(0, value));

/** The oval's rightmost point, as a fraction of the way round. */
const RIGHT_END = (() => {
  let best = 0;
  for (let i = 1; i < SAMPLES; i += 1) {
    if (pointOnOval(i / SAMPLES)[0] > pointOnOval(best)[0]) best = i / SAMPLES;
  }
  return best;
})();

/** The signed shortest way round from one fraction to another. */
const wrapDelta = (delta: number) => delta - Math.round(delta);

/**
 * Where a face streaming in from the right joins the oval. Faces on the top
 * arc (resting anticlockwise of the right end, `direction` -1) come along
 * the top; faces on the bottom arc (+1) come along the bottom. The entry is
 * where that arc crosses `edge` (in Figma x), so the face starts just out of
 * view. If the oval's right end is already inside `edge` (a wide screen),
 * the face starts at the right end, pushed `push` units further right.
 */
function streamEntry(edge: number, direction: 1 | -1) {
  const step = 1 / SAMPLES;
  let fraction = RIGHT_END;
  if (pointOnOval(fraction)[0] <= edge) {
    return { fraction, push: edge - pointOnOval(fraction)[0] };
  }
  while (
    Math.abs(fraction - RIGHT_END) < 0.5 &&
    pointOnOval(fraction + direction * step)[0] > edge
  ) {
    fraction += direction * step;
  }
  return { fraction, push: 0 };
}

const RING = FACES.map((face, index) => {
  const width = face.width * FACE_SCALE;
  const height = face.height * FACE_SCALE;
  return {
    // An optimised source at twice the face's desktop size.
    href: getImageProps({
      src: face.image,
      alt: "",
      width: Math.round(width),
      height: Math.round(height),
    }).props.src,
    width,
    height,
    rotate: face.rotate,
    place: FIRST_FACE + index / FACES.length,
  };
});

/**
 * Each face's stream-in path when the viewport's right edge is at
 * `viewportRight` (Figma x): from just beyond that edge, along its arc of the
 * oval, to its place. `length` is the distance covered, in Figma units. Faces
 * that rest beyond the right edge (narrow screens) only fade in. Ordered
 * farthest first, so faces on an arc never pass one another.
 */
function streamPaths(viewportRight: number) {
  return RING.map((face, index) => {
    // Clear of the edge by half the face's diagonal, whatever its turn.
    const edge = viewportRight + Math.hypot(face.width, face.height) / 2;
    const direction = wrapDelta(face.place - RIGHT_END) < 0 ? -1 : 1;
    const entry = streamEntry(edge, direction);
    const travel = wrapDelta(face.place - entry.fraction);
    const restsOutOfView = Math.sign(travel) !== direction;
    const push = restsOutOfView ? 0 : entry.push;
    return {
      index,
      from: restsOutOfView ? face.place : face.place - travel,
      travel: restsOutOfView ? 0 : travel,
      push,
      length: restsOutOfView ? 0 : Math.abs(travel) * PERIMETER + push,
    };
  }).sort((a, b) => b.length - a.length);
}

/**
 * The stream-in's pace comes from the 1440px desktop layout, where the ring
 * is drawn 1:1 and the viewport's right edge is at Figma x 1440: the longest
 * path there (in px) is covered in `--duration-belonging-swirl`.
 */
const REFERENCE_LONGEST = Math.max(
  ...streamPaths(1440).map((path) => path.length),
);

/**
 * The belonging section's ring of faces (Figma 37:37): an oval of 20 faces
 * around the copy. It is drawn once in Figma's desktop units and scaled by
 * `--belonging-ring-width`, so tablet and mobile show the same ring, wider
 * than the screen, with its sides bleeding off.
 *
 * The motion has two phases, handed over at the rest positions:
 *
 * 1. Stream-in, a time-based animation that plays once per page load. When
 *    the section scrolls into view, the faces enter one after another from
 *    beyond the viewport's right edge and sweep along the oval into their
 *    places, like beads threading onto it: top-arc faces along the top,
 *    bottom-arc faces along the bottom, farthest first. Each fades in as it
 *    comes. It plays to the end on its own timeline whatever the scroll does,
 *    and scrolling back up never replays it.
 * 2. Drift, linked to scroll, from the moment the stream-in ends. The ring
 *    rotates gently round the oval, counter-clockwise as the page scrolls
 *    down and back as it scrolls up. The rotation is measured from the scroll
 *    position at the handoff, so it starts at zero: the faces continue from
 *    exactly where the stream-in left them. Before the handoff, scrolling does
 *    not rotate the ring.
 *
 * The server renders the faces at rest, which is also the reduced-motion
 * state: no swirl, no drift. Nothing about the markup depends on the motion
 * preference, so hydration always matches.
 */
export function BelongingRing() {
  const stageRef = useRef<HTMLDivElement>(null);
  const faceRefs = useRef<(SVGGElement | null)[]>([]);
  /** Set at the handoff: the drift per unit of scroll, and where it starts. */
  const driftRef = useRef<{ turns: number; from: number } | null>(null);
  const { scrollYProgress } = useScroll({
    target: stageRef,
    offset: ["start end", "end start"],
  });

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage || window.matchMedia("(prefers-reduced-motion: reduce)").matches)
      return;

    const groups = faceRefs.current;
    const driftTurns = readTurnsToken("--belonging-ring-drift", 36);

    /** Moves face `index` and sets its opacity. */
    const placeFace = (
      index: number,
      fraction: number,
      push: number,
      opacity: number,
    ) => {
      const group = groups[index];
      if (!group) return;
      const [x, y] = pointOnOval(fraction);
      group.setAttribute("transform", translate([x + push, y]));
      group.setAttribute("opacity", String(opacity));
    };

    /**
     * The stream-in paths for the current layout, each with its duration.
     * The longest path at 1440px takes `each`, which sets the stream's pace.
     * A path longer than that on screen (on wide screens the whole oval is in
     * view and faces come from beyond its end) takes proportionally longer,
     * so it moves at the same on-screen speed; shorter paths take `each`, as
     * every face does at 1440, so nothing rushes.
     */
    const timedPaths = (each: number) => {
      const box = stage.querySelector("svg")?.getBoundingClientRect();
      const scale = box && box.width > 0 ? box.width / VIEW_WIDTH : 1;
      const viewportRight =
        VIEW_X +
        (document.documentElement.clientWidth - (box?.left ?? 0)) / scale;
      return streamPaths(viewportRight).map((path) => {
        const stretch = (path.length * scale) / REFERENCE_LONGEST;
        return { ...path, duration: each * Math.max(1, stretch) };
      });
    };

    // Phase 2 begins here, from the rest positions: zero rotation at the
    // current scroll position.
    const handOff = () => {
      driftRef.current = { turns: driftTurns, from: scrollYProgress.get() };
    };

    if (swirlPlayed) {
      handOff();
      return () => {
        driftRef.current = null;
      };
    }

    // Hidden until the stream-in starts.
    RING.forEach((face, index) => placeFace(index, face.place, 0, 0));
    let stopStream: (() => void) | undefined;
    const stopWatching = inView(
      stage,
      () => {
        stopWatching();
        swirlPlayed = true;
        const each = readTimeToken("--duration-belonging-swirl", 1400) / 1000;
        const fade =
          readTimeToken("--duration-belonging-swirl-fade", 700) / 1000;
        const stagger =
          readTimeToken("--duration-belonging-swirl-stagger", 60) / 1000;
        const ease = cubicBezier(
          ...readEaseToken("--ease-belonging-swirl", [0.3, 0.6, 0.25, 1]),
        );
        const paths = timedPaths(each);
        const total = Math.max(
          ...paths.map((path, order) => order * stagger + path.duration),
        );
        // One linear clock; each face reads its own staggered slice: its
        // path eased over its duration, its fade-in over the first `fade`.
        const controls = animate(0, total, {
          duration: total,
          ease: "linear",
          onUpdate: (time) => {
            paths.forEach((path, order) => {
              const elapsed = time - order * stagger;
              const eased = ease(clamp01(elapsed / path.duration));
              placeFace(
                path.index,
                path.from + path.travel * eased,
                path.push * (1 - eased),
                clamp01(elapsed / fade),
              );
            });
          },
          onComplete: () => {
            RING.forEach((face, index) => placeFace(index, face.place, 0, 1));
            handOff();
          },
        });
        stopStream = () => controls.stop();
      },
      // Starts once the stage's top is 15% up from the bottom of the
      // viewport. The area above the viewport counts too, so a jump past the
      // section still plays it rather than leaving the faces hidden.
      { margin: "100000px 0px -15% 0px" },
    );

    return () => {
      stopWatching();
      stopStream?.();
      driftRef.current = null;
    };
  }, [scrollYProgress]);

  useMotionValueEvent(scrollYProgress, "change", (progress) => {
    const drift = driftRef.current;
    if (!drift) return;
    const rotation = drift.turns * (progress - drift.from);
    RING.forEach((face, index) => {
      faceRefs.current[index]?.setAttribute(
        "transform",
        translate(pointOnOval(face.place - rotation)),
      );
    });
  });

  return (
    <div
      ref={stageRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0"
    >
      <svg
        viewBox={VIEW_BOX}
        className={cn(
          "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 overflow-visible",
          styles.ring,
        )}
      >
        {RING.map((face, index) => (
          <g
            key={face.href}
            ref={(group) => {
              faceRefs.current[index] = group;
            }}
            transform={translate(pointOnOval(face.place))}
          >
            <image
              href={face.href}
              x={-face.width / 2}
              y={-face.height / 2}
              width={face.width}
              height={face.height}
              preserveAspectRatio="none"
              transform={face.rotate ? `rotate(${face.rotate})` : undefined}
            />
          </g>
        ))}
      </svg>
    </div>
  );
}
