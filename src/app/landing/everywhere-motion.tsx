"use client";

import { useMotionValueEvent, useScroll } from "motion/react";
import { type ComponentProps, useLayoutEffect, useRef } from "react";

import { readTimeToken } from "@/components/site/blob-reveal";
import { readLengthToken } from "@/lib/motion-tokens";
import {
  armShapeEntrances,
  onEnter,
  pausedAnimation,
  readRootToken,
  REDUCED_MOTION,
  trackPointerDrift,
} from "@/lib/shape-motion";

type Shape = { parallax: HTMLElement; pointer: HTMLElement; depth: number };

/**
 * The "everywhere" section's motion. It renders the section element and
 * finds its parts by `data-everywhere`. The shape entrance and pointer drift
 * are the shared shape motion (lib/shape-motion.ts, also used by the stories
 * snippet). Everything runs on the compositor:
 * one-shot entrances are Web Animations of transform and opacity (created
 * paused on their first frame when the section mounts, played on entering
 * view), the scroll parallax is written straight to translate3d, and the
 * pointer drift sets a target that a CSS transform transition eases to.
 *
 * - Shapes (`shape` > `shape-pointer` > `shape-art`): the art grows from
 *   `--everywhere-shape-from-scale` as it fades in; the outer layer drifts
 *   up through the section's scroll (`--everywhere-shape-drift` x depth);
 *   with a fine pointer, the middle layer drifts towards the cursor
 *   (`--everywhere-pointer-drift` x depth). Pointer moves are read at most
 *   once a frame, and only while the section is on screen. No hover effect.
 * - Stats: each rises `--everywhere-stat-rise` as it fades in, one stagger
 *   after the last, in reading order (left to right; top to bottom on
 *   mobile).
 * - Map: fades in growing from `--everywhere-map-from-scale`. The 85 markers
 *   have their own trigger, the map's top reaching `--everywhere-pin-trigger`
 *   up the viewport, and pin on in their DOM order, which runs left to right
 *   across the map: each drops `--everywhere-pin-drop` as it scales
 *   in from nothing, with a slight overshoot, one stagger after the last.
 *
 * Under reduced motion nothing is created: everything stays in place.
 */
export function EverywhereMotion({
  children,
  ...props
}: ComponentProps<"section">) {
  const ref = useRef<HTMLElement>(null);
  const shapesRef = useRef<{ shapes: Shape[]; drift: number } | null>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const apply = (progress: number) => {
    const state = shapesRef.current;
    if (!state) return;
    // -0.5 to 0.5 across the section; 0 when it is centred.
    const centred = Math.min(1, Math.max(0, progress)) - 0.5;
    for (const shape of state.shapes) {
      const y = -centred * state.drift * shape.depth;
      shape.parallax.style.transform = `translate3d(0, ${y.toFixed(1)}px, 0)`;
    }
  };

  useLayoutEffect(() => {
    const section = ref.current;
    if (!section || window.matchMedia(REDUCED_MOTION).matches) return;
    const all = (name: string) => [
      ...section.querySelectorAll<HTMLElement>(`[data-everywhere="${name}"]`),
    ];
    const enter = readRootToken("--ease-everywhere-enter", "ease-out");
    const pin = readRootToken("--ease-everywhere-pin", "ease-out");
    const observers: IntersectionObserver[] = [];
    const animations: Animation[] = [];
    const paused = (
      element: Element,
      keyframes: Keyframe[],
      options: KeyframeAnimationOptions,
    ) => {
      const animation = pausedAnimation(element, keyframes, options);
      animations.push(animation);
      return animation;
    };

    // Shapes: grow and fade in (shared with the stories snippet).
    const disarmShapes = armShapeEntrances(all("shape-art"), {
      duration: "--duration-everywhere-shape",
      fromScale: "--everywhere-shape-from-scale",
      easing: "--ease-everywhere-enter",
    });

    // Stats: rise and fade in, one by one.
    const stats = all("stat");
    const rise = readLengthToken("--everywhere-stat-rise", 24);
    const statStagger = readTimeToken(
      "--duration-everywhere-stat-stagger",
      140,
    );
    const statAnimations = stats.map((stat, index) =>
      paused(
        stat,
        [
          { opacity: 0, transform: `translate3d(0, ${rise}px, 0)` },
          { opacity: 1, transform: "translate3d(0, 0, 0)" },
        ],
        {
          duration: readTimeToken("--duration-everywhere-stat", 700),
          delay: index * statStagger,
          easing: enter,
        },
      ),
    );
    if (stats[0])
      observers.push(
        onEnter(stats[0], () => statAnimations.forEach((a) => a.play())),
      );

    // The map's entrance, and, on their own trigger, the markers, left to
    // right.
    const map = all("map")[0];
    if (map) {
      const mapDuration = readTimeToken("--duration-everywhere-map", 900);
      const mapScale = readRootToken("--everywhere-map-from-scale", "0.96");
      const mapAnimation = paused(
        map,
        [
          { opacity: 0, transform: `scale(${mapScale})` },
          { opacity: 1, transform: "scale(1)" },
        ],
        { duration: mapDuration, easing: enter },
      );
      const drop = readLengthToken("--everywhere-pin-drop", 12);
      const pinDuration = readTimeToken("--duration-everywhere-pin", 420);
      const pinStagger = readTimeToken("--duration-everywhere-pin-stagger", 12);
      // Each entrance is dropped once it has played (it ends where the page
      // already is): a finished animation, held, keeps its element on its
      // own compositor layer, which is rastered soft on high-density screens.
      const release = (animation: Animation) => {
        animation.finished.then(() => animation.cancel()).catch(() => {});
        return animation;
      };
      release(mapAnimation);
      const markerAnimations = all("marker").map((marker, index) =>
        release(
          paused(
            marker,
            [
              {
                opacity: 0,
                transform: `translate3d(0, ${-drop}px, 0) scale(0)`,
              },
              { opacity: 1, transform: "translate3d(0, 0, 0) scale(1)" },
            ],
            {
              duration: pinDuration,
              delay: index * pinStagger,
              easing: pin,
            },
          ),
        ),
      );
      observers.push(onEnter(map, () => mapAnimation.play()));
      // The markers start as the map comes properly into view (its top
      // `--everywhere-pin-trigger` up the viewport), whatever the map's own
      // entrance is doing. A line rather than a share of the map, which is
      // wider than the screen on tablet and mobile.
      observers.push(
        onEnter(
          map,
          () => markerAnimations.forEach((a) => a.play()),
          readRootToken("--everywhere-pin-trigger", "45%"),
        ),
      );
    }

    // Scroll parallax.
    const shapes = all("shape").map((parallax) => ({
      parallax,
      pointer: parallax.querySelector<HTMLElement>(
        '[data-everywhere="shape-pointer"]',
      )!,
      depth: Number(parallax.dataset.depth ?? 1),
    }));
    shapesRef.current = {
      shapes,
      drift: readLengthToken("--everywhere-shape-drift", 80),
    };
    apply(scrollYProgress.get());

    // Pointer drift, fine pointers only, while the section is on screen.
    const stopDrift = trackPointerDrift(
      section,
      shapes.map((shape) => ({ element: shape.pointer, depth: shape.depth })),
      "--everywhere-pointer-drift",
    );

    const resize = () => {
      if (shapesRef.current)
        shapesRef.current.drift = readLengthToken(
          "--everywhere-shape-drift",
          80,
        );
      apply(scrollYProgress.get());
    };
    window.addEventListener("resize", resize);

    return () => {
      observers.forEach((observer) => observer.disconnect());
      disarmShapes();
      stopDrift();
      window.removeEventListener("resize", resize);
      animations.forEach((animation) => animation.cancel());
      for (const shape of shapes) shape.parallax.style.transform = "";
      shapesRef.current = null;
    };
  }, [scrollYProgress]);

  useMotionValueEvent(scrollYProgress, "change", apply);

  return (
    <section ref={ref} {...props}>
      {children}
    </section>
  );
}
