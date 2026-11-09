"use client";

import { useMotionValueEvent, useScroll } from "motion/react";
import Image from "next/image";
import { type ReactNode, useLayoutEffect, useRef, useState } from "react";

import { readTimeToken } from "@/components/site/blob-reveal";
import { StandardButton } from "@/components/ui/standard-button";
import { readLengthToken } from "@/lib/motion-tokens";
import { readRootToken, REDUCED_MOTION } from "@/lib/shape-motion";
import { cn } from "@/lib/utils";

import { NEIGHBORNETS } from "./neighbornets";
import styles from "./neighbornets-section.module.css";

/** Mobile, with motion: scrolling drives the selection. */
const SCROLL_SELECT =
  "(width < 48rem) and (prefers-reduced-motion: no-preference)";

type Layer = { element: HTMLElement; drift: number };

/** The selection, and the one sliding away while a switch plays. */
type Stack = { selected: number; leaving: number | null };

/**
 * The switcher's moving parts: the NeighborNet names, the photo tile and the
 * shape behind it, laid out in one grid with the section's `intro` and
 * `viewAll` (server-rendered, passed in).
 *
 * - Tablet and desktop: the names are buttons; the tile pins at the
 *   viewport's centre (sticky) while the left column scrolls by.
 * - Mobile: the names run in a long column over the tile, which pins near the
 *   top; the name in the tile's name slot (CSS sticks it there until the next
 *   pushes it out) is the selection, so scrolling drives it.
 * - A switch is a card-stack reveal: every NeighborNet's card is in the
 *   tile, stacked, as is every NeighborNet's shape behind it. The old card
 *   and its shape slide right (`--neighbornets-slide`, quickly:
 *   `--duration-neighbornets-slide`) and fade away above the new ones, which
 *   expand into place from `--neighbornets-reveal-from-scale` over the
 *   longer `--duration-neighbornets-reveal`, as if stacked just behind:
 *   card and shape move together as one stack. Web Animations of translate3d,
 *   opacity and scale; a new switch mid-reveal cancels them cleanly.
 * - The shape drifts as the section scrolls past (`--neighbornets-shape-
 *   drift`, written straight to translate3d on its layer).
 *
 * Under reduced motion: the cards swap at once, the shapes cut, nothing
 * drifts, and mobile's names are a plain list of buttons under the tile
 * (CSS). The DOM is the same either way, so the server and client agree.
 */
export function NeighborNetSwitcher({
  intro,
  viewAll,
}: {
  intro: ReactNode;
  viewAll: ReactNode;
}) {
  const stageRef = useRef<HTMLDivElement>(null);
  const shapeLayerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const shapesRef = useRef<(SVGSVGElement | null)[]>([]);
  const namesRef = useRef<(HTMLButtonElement | null)[]>([]);
  const layerRef = useRef<Layer | null>(null);
  // The name slot's top on screen while scroll drives the selection.
  const slotRef = useRef<number | null>(null);
  const selectedRef = useRef(0);
  const [{ selected, leaving }, setStack] = useState<Stack>({
    selected: 0,
    leaving: null,
  });
  const { scrollYProgress } = useScroll({
    target: stageRef,
    offset: ["start end", "end start"],
  });

  const select = (index: number) => {
    const current = selectedRef.current;
    if (index === current) return;
    selectedRef.current = index;
    setStack({
      selected: index,
      leaving: window.matchMedia(REDUCED_MOTION).matches ? null : current,
    });
  };

  // Mobile: the name nearest the tile's name slot is the selection.
  const selectBySlot = () => {
    const slot = slotRef.current;
    if (slot === null) return;
    let nearest = selectedRef.current;
    let distance = Infinity;
    namesRef.current.forEach((name, index) => {
      if (!name) return;
      const away = Math.abs(name.getBoundingClientRect().top - slot);
      if (away < distance) {
        distance = away;
        nearest = index;
      }
    });
    select(nearest);
  };

  const onScroll = (progress: number) => {
    // Read (the names' positions) before writing (the layers' transforms),
    // so the frame never forces a style recalculation.
    selectBySlot();
    const layer = layerRef.current;
    if (layer) {
      // -0.5 to 0.5 across the section; 0 when it is centred.
      const y = -(Math.min(1, Math.max(0, progress)) - 0.5) * layer.drift;
      layer.element.style.transform = `translate3d(0, ${y.toFixed(1)}px, 0)`;
    }
  };

  useLayoutEffect(() => {
    const element = shapeLayerRef.current;
    if (!element) return;
    const scrollSelect = window.matchMedia(SCROLL_SELECT);
    const reduced = window.matchMedia(REDUCED_MOTION);
    const measure = () => {
      const first = namesRef.current[0];
      slotRef.current =
        scrollSelect.matches && first
          ? Number.parseFloat(getComputedStyle(first).top)
          : null;
      layerRef.current = reduced.matches
        ? null
        : {
            element,
            drift: readLengthToken("--neighbornets-shape-drift", 48),
          };
      if (!layerRef.current) element.style.transform = "";
      onScroll(scrollYProgress.get());
    };
    measure();
    scrollSelect.addEventListener("change", measure);
    reduced.addEventListener("change", measure);
    window.addEventListener("resize", measure);
    return () => {
      scrollSelect.removeEventListener("change", measure);
      reduced.removeEventListener("change", measure);
      window.removeEventListener("resize", measure);
      element.style.transform = "";
      layerRef.current = null;
      slotRef.current = null;
    };
    // onScroll reads refs only, so measuring on mount is right.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scrollYProgress]);

  useMotionValueEvent(scrollYProgress, "change", onScroll);

  // The card-stack reveal, for the card and its shape together: the ones
  // leaving slide right and fade above the new ones, which expand into
  // place. A new switch mid-reveal cancels it (the old ones simply hide).
  useLayoutEffect(() => {
    if (leaving === null) return;
    const slide = readLengthToken("--neighbornets-slide", 80);
    const fromScale = readRootToken("--neighbornets-reveal-from-scale", "0.94");
    const easing = readRootToken("--ease-neighbornets", "ease-out");
    const out: Keyframe[] = [
      { opacity: 1, transform: "translate3d(0, 0, 0)" },
      { opacity: 0, transform: `translate3d(${slide}px, 0, 0)` },
    ];
    const into: Keyframe[] = [
      { transform: `scale(${fromScale})` },
      { transform: "scale(1)" },
    ];
    const outOptions: KeyframeAnimationOptions = {
      duration: readTimeToken("--duration-neighbornets-slide", 380),
      easing,
      fill: "forwards",
    };
    const intoOptions: KeyframeAnimationOptions = {
      duration: readTimeToken("--duration-neighbornets-reveal", 600),
      easing,
    };
    const animations = [
      ...[cardsRef.current[leaving], shapesRef.current[leaving]].map(
        (element) => element?.animate(out, outOptions),
      ),
      ...[cardsRef.current[selected], shapesRef.current[selected]].map(
        (element) => element?.animate(into, intoOptions),
      ),
    ].filter((animation) => animation !== undefined);
    // Settle once everything has finished (the reveal outlasts the slide).
    Promise.all(animations.map((animation) => animation.finished))
      .then(() => setStack((stack) => ({ ...stack, leaving: null })))
      .catch(() => {});
    return () => animations.forEach((animation) => animation.cancel());
  }, [leaving, selected]);

  const current = NEIGHBORNETS[selected];
  const stateOf = (index: number) =>
    index === selected ? "active" : index === leaving ? "leaving" : "idle";

  return (
    <div
      ref={stageRef}
      className="relative mx-auto grid max-w-360 grid-cols-1 px-8 md:grid-cols-2 md:px-16 xl:pr-35 xl:pl-22.5"
    >
      <div className="relative z-10 row-start-1 md:col-span-2 xl:col-span-1">
        {intro}
      </div>

      <ul
        aria-label="NeighborNets"
        className={cn(
          "relative z-10 col-start-1 row-start-2 mt-12 md:mt-9 md:flex md:flex-col md:gap-33.5 md:pt-43 xl:mt-26.5 xl:gap-5.75 xl:pt-0",
          styles.names,
        )}
      >
        {NEIGHBORNETS.map((neighborNet, index) => (
          <li key={neighborNet.slug} className={styles.step}>
            <button
              ref={(element) => {
                namesRef.current[index] = element;
              }}
              type="button"
              aria-pressed={index === selected}
              aria-controls="neighbornet-tile"
              onClick={() => select(index)}
              className={cn(
                "cursor-pointer font-display text-landing-section uppercase outline-none focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-warm-snow xl:text-stat",
                index === selected
                  ? neighborNet.highlight
                  : "text-brand-pure-white",
                neighborNet.alternates && styles.alternates,
                styles.name,
              )}
            >
              {neighborNet.city}
            </button>
          </li>
        ))}
      </ul>

      {/* The tile's grid area: the pin's sticky containing block (a grid
          item's own would be the whole grid), so it pins only within its
          rows. */}
      <div className="col-start-1 row-start-2 -mx-8 mt-12 md:col-start-2 md:row-span-2 md:mx-0 md:mt-9 md:-mr-16 xl:row-span-3 xl:row-start-1 xl:mt-28 xl:mr-0 xl:w-121 xl:justify-self-end">
        <div className={cn("relative", styles.pin)}>
          {/* Each NeighborNet's shape (Warm Snow at 7% over Obsidian,
              Figma's #262639), stacked like the cards, on a layer that
              drifts with the scroll. */}
          <div
            ref={shapeLayerRef}
            aria-hidden="true"
            className={cn("pointer-events-none absolute inset-0", styles.layer)}
          >
            {NEIGHBORNETS.map((neighborNet, index) => (
              <svg
                key={neighborNet.slug}
                ref={(element) => {
                  shapesRef.current[index] = element;
                }}
                viewBox={neighborNet.shape.viewBox}
                preserveAspectRatio="none"
                data-state={stateOf(index)}
                className={cn(
                  styles.shape,
                  styles[neighborNet.shape.className],
                )}
              >
                <g transform={neighborNet.shape.transform}>
                  <path
                    d={neighborNet.shape.path}
                    className="fill-brand-obsidian"
                  />
                  <path
                    d={neighborNet.shape.path}
                    className="fill-brand-warm-snow/7"
                  />
                </g>
              </svg>
            ))}
          </div>

          <div
            id="neighbornet-tile"
            role="group"
            aria-label={`${current.city}, ${current.state}`}
            className="relative aspect-neighbornets-tile"
          >
            {NEIGHBORNETS.map((neighborNet, index) => {
              const state = stateOf(index);
              return (
                <div
                  key={neighborNet.slug}
                  ref={(element) => {
                    cardsRef.current[index] = element;
                  }}
                  data-state={state}
                  inert={state !== "active"}
                  className={styles.card}
                >
                  <Image
                    src={neighborNet.photo}
                    alt={`Young Muslims at the ${neighborNet.city} NeighborNet`}
                    fill
                    sizes="(width >= 48rem) min(50vw, 484px), min(100vw, 484px)"
                    className="object-cover"
                  />
                  <div
                    aria-hidden="true"
                    className="absolute inset-0 bg-linear-to-b from-transparent from-10% to-brand-obsidian/50"
                  />
                  <div
                    className={cn(
                      "relative flex flex-col items-center px-8 text-center text-brand-pure-white",
                      styles.cardBody,
                    )}
                  >
                    <p
                      className={cn(
                        "font-display text-landing-section uppercase xl:text-stat",
                        neighborNet.alternates && styles.alternates,
                        styles.cardName,
                      )}
                    >
                      {neighborNet.city}
                    </p>
                    <p className="text-body font-bold uppercase xl:text-landing-copy">
                      {neighborNet.state}
                    </p>
                    <StandardButton
                      href="/neighbornets"
                      label="Visit"
                      tone="dark"
                      aria-label={`Visit the ${neighborNet.city} NeighborNet`}
                      className="mt-4 w-auto xl:mt-6"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div
        className={cn(
          "relative z-10 row-start-3 mt-29 md:col-start-1 md:mt-31 xl:mt-9.5",
          styles.viewAll,
        )}
      >
        {viewAll}
      </div>
    </div>
  );
}
