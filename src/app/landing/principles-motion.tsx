"use client";

import { useMotionValueEvent, useScroll } from "motion/react";
import { type ComponentProps, useEffect, useRef } from "react";

/**
 * When the section pins. Must match the media query in
 * principles-section.module.css: the CSS lays the section out, this decides
 * whether to drive it. To fall back to the stacked layout on mobile, add
 * `and (width >= 48rem)` to both.
 */
const PINNED_QUERY =
  "(prefers-reduced-motion: no-preference) and (height > 30rem)";

type PanelParts = {
  panel: HTMLElement;
  photo: HTMLElement;
  word: HTMLElement;
  fade: HTMLElement;
  scrim: HTMLElement;
  /** The word's resting centre, from the stage's top, in px. */
  wordCentre: number;
  /** How far the word shrinks to fit its strip (1 when it fits). */
  wordScale: number;
  /** How far the photo slides up as the panel collapses, in px. */
  photoShift: number;
  /** The panel's resting top, from the stage's top, in px. */
  top: number;
};

type Timeline = {
  stage: number;
  strip: number;
  /** The header clearance above the strips, in px. */
  clearance: number;
  peek: number;
  rise: number;
  step: number;
  hold: number;
  /** The share of a hold over which a fresh strip's scrim fades in. */
  scrimFade: number;
  total: number;
  panels: PanelParts[];
  headingCopy: HTMLElement | null;
};

const clamp = (value: number) => Math.min(1, Math.max(0, value));

function readNumber(name: string, fallback: number) {
  const value = Number.parseFloat(
    getComputedStyle(document.documentElement).getPropertyValue(name),
  );
  return Number.isNaN(value) ? fallback : value;
}

/** An element's offset from an ancestor, ignoring transforms. */
function offsetWithin(element: HTMLElement, ancestor: HTMLElement) {
  let top = 0;
  let node: HTMLElement | null = element;
  while (node && node !== ancestor) {
    top += node.offsetTop;
    node = node.offsetParent as HTMLElement | null;
  }
  return top;
}

/*
 * The last value written to each element, so a frame only touches the
 * elements that actually move: most layers are at rest at any moment, and
 * every style write costs a style recalculation on the main thread.
 */
const written = new WeakMap<
  HTMLElement,
  { transform?: string; opacity?: string }
>();

function write(
  element: HTMLElement,
  key: "transform" | "opacity",
  value: string,
) {
  const last = written.get(element) ?? {};
  if (last[key] === value) return;
  last[key] = value;
  written.set(element, last);
  element.style[key] = value;
}

const move = (element: HTMLElement, y: number, scale = 1) =>
  write(
    element,
    "transform",
    scale === 1
      ? `translate3d(0, ${y.toFixed(1)}px, 0)`
      : `translate3d(0, ${y.toFixed(1)}px, 0) scale(${scale.toFixed(3)})`,
  );

const fade = (element: HTMLElement, opacity: number) =>
  write(element, "opacity", opacity.toFixed(3));

/**
 * Drives the principles section's pinned, scrubbed reveal. It renders the
 * section element (the scroll target) and finds its parts by
 * `data-principles`: the stage, the four panels and, in each, the photo, the
 * word, the description-and-button block (`fade`) and the strip scrim; and
 * the heading's Warm Snow copy in the first panel.
 *
 * One scroll-linked value (0 as the section's top reaches the viewport's top,
 * 1 as its bottom reaches the viewport's bottom, the whole runway while the
 * stage is pinned) is mapped onto a timeline in stage heights (see the
 * principles tokens) and written straight to compositor-only properties:
 * translate3d and scale on promoted layers, and opacity. Nothing animates
 * size, clip or layout, and there are no per-frame CSS transitions (Lenis
 * smooths the wheel; touch keeps native momentum).
 *
 * - Panel 0 rises from its peek to the top; each later panel rises from
 *   below the stage to its resting top: the header clearance plus i strips
 *   down.
 * - While panel i+1 rises, panel i's word slides up into the centre of its
 *   strip (below the header for the first) (shrinking only if the strip is shorter than the word), its
 *   description and button fade out and its photo slides up. The rising
 *   panel covers the rest, leaving the strip. Only once that collapse is
 *   complete does the strip's scrim fade in, over the start of the hold.
 * - The heading's Warm Snow copy rides in panel 0, held still against it,
 *   and fades as panel 1 rises.
 *
 * Keyboard focus on a principle's button scrolls to where that principle is
 * fully revealed. The photos are decoded before the section arrives, so no
 * decode lands mid-scrub. Outside the pinned layout (reduced motion, short
 * viewports) every transform is cleared and nothing is driven.
 */
export function PrinciplesMotion({
  children,
  ...props
}: ComponentProps<"section">) {
  const ref = useRef<HTMLElement>(null);
  const timelineRef = useRef<Timeline | null>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  const apply = (progress: number) => {
    const line = timelineRef.current;
    if (!line) return;
    const t = clamp(progress) * line.total;
    // Where each panel's rise ends on the timeline, and the rise, 0 to 1.
    const riseEnds = line.panels.map((_, index) =>
      index === 0
        ? line.rise
        : line.rise +
          line.hold +
          (index - 1) * (line.step + line.hold) +
          line.step,
    );
    const rises = riseEnds.map((end, index) =>
      clamp((t - end) / (index === 0 ? line.rise : line.step) + 1),
    );
    line.panels.forEach((parts, index) => {
      const from =
        index === 0 ? line.peek * line.stage : line.stage - parts.top;
      move(parts.panel, (1 - rises[index]) * from);
      // Its collapse is the next panel's rise.
      const collapse = rises[index + 1] ?? 0;
      // The centre of its strip, below the header clearance.
      const target = line.clearance + index * line.strip + line.strip / 2;
      move(
        parts.word,
        collapse * (target - parts.wordCentre),
        1 - collapse * (1 - parts.wordScale),
      );
      fade(parts.fade, 1 - clamp(collapse * 2.5));
      // The scrim is the last beat: it waits for the collapse to finish
      // (the next panel's rise ending), then fades in over the start of the
      // hold that follows, once the panel is only its strip.
      const settled = riseEnds[index + 1];
      fade(
        parts.scrim,
        settled === undefined
          ? 0
          : clamp((t - settled) / (line.hold * line.scrimFade)),
      );
      move(parts.photo, -collapse * parts.photoShift);
    });
    if (line.headingCopy) {
      move(line.headingCopy, -(1 - rises[0]) * line.peek * line.stage);
      fade(line.headingCopy, 1 - clamp(rises[1] * 3));
    }
  };

  useEffect(() => {
    const section = ref.current;
    const stage = section?.querySelector<HTMLElement>(
      '[data-principles="stage"]',
    );
    if (!section || !stage) return;
    const panels = [
      ...section.querySelectorAll<HTMLElement>('[data-principles="panel"]'),
    ];
    const part = (panel: HTMLElement, name: string) =>
      panel.querySelector<HTMLElement>(`[data-principles="${name}"]`)!;
    const headingCopy = section.querySelector<HTMLElement>(
      '[data-principles="heading-copy"]',
    );
    const moving = panels.flatMap((panel) => [
      panel,
      part(panel, "photo"),
      part(panel, "word"),
      part(panel, "fade"),
      part(panel, "scrim"),
    ]);
    if (headingCopy) moving.push(headingCopy);
    const pinned = window.matchMedia(PINNED_QUERY);

    const setup = () => {
      for (const element of moving) {
        element.style.transform = "";
        element.style.opacity = "";
        written.delete(element);
      }
      timelineRef.current = null;
      if (!pinned.matches) return;
      const stageHeight = stage.clientHeight;
      // Panels 1 and 2 rest one strip apart, below the header clearance.
      const strip = panels[2].offsetTop - panels[1].offsetTop;
      const clearance = panels[1].offsetTop - strip;
      const shift = readNumber("--principles-photo-shift", 0.5625);
      timelineRef.current = {
        stage: stageHeight,
        strip,
        clearance,
        peek: readNumber("--principles-peek", 0.6436),
        rise: readNumber("--principles-rise", 0.65),
        step: readNumber("--principles-step", 0.75),
        hold: readNumber("--principles-hold", 0.15),
        scrimFade: readNumber("--principles-scrim-fade", 0.6),
        total: 0,
        headingCopy,
        panels: panels.map((panel, index) => {
          const word = part(panel, "word");
          const fontSize = Number.parseFloat(getComputedStyle(word).fontSize);
          return {
            panel,
            photo: part(panel, "photo"),
            word,
            top: panel.offsetTop,
            fade: part(panel, "fade"),
            scrim: part(panel, "scrim"),
            wordCentre: offsetWithin(word, stage) + word.offsetHeight / 2,
            // Room for the glyphs (about 1.25 em) with 1rem either side.
            wordScale: Math.min(1, (strip - 32) / (fontSize * 1.25)),
            // Never so far that the photo's foot rises above the next
            // panel's resting edge.
            photoShift: Math.max(
              0,
              Math.min(
                shift * stageHeight,
                stageHeight - clearance - (index + 1) * strip - 1,
              ),
            ),
          };
        }),
      };
      const line = timelineRef.current;
      line.total = line.rise + 4 * line.hold + 3 * line.step;
      apply(scrollYProgress.get());
    };

    // A button focused by keyboard scrolls to where its principle is fully
    // revealed (it may still be below the stage, or under the next panel).
    const onFocus = (event: FocusEvent) => {
      const line = timelineRef.current;
      const panel = (event.target as HTMLElement).closest<HTMLElement>(
        '[data-principles="panel"]',
      );
      if (!line || !panel || !(event.target as HTMLElement).matches("a"))
        return;
      const index = panels.indexOf(panel);
      const revealed =
        index === 0
          ? line.rise
          : line.rise +
            line.hold +
            (index - 1) * (line.step + line.hold) +
            line.step;
      const top = section.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({ top: top + revealed * line.stage });
    };

    // Decode the photos before the section arrives.
    const decoder = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        decoder.disconnect();
        for (const image of section.querySelectorAll("img")) {
          image.loading = "eager";
          void image.decode().catch(() => undefined);
        }
      },
      { rootMargin: "200% 0px" },
    );
    decoder.observe(section);

    setup();
    const resize = new ResizeObserver(setup);
    resize.observe(stage);
    for (const panel of panels) resize.observe(part(panel, "word"));
    pinned.addEventListener("change", setup);
    section.addEventListener("focusin", onFocus);
    void document.fonts.ready.then(setup);
    return () => {
      decoder.disconnect();
      resize.disconnect();
      pinned.removeEventListener("change", setup);
      section.removeEventListener("focusin", onFocus);
      timelineRef.current = null;
    };
  }, [scrollYProgress]);

  useMotionValueEvent(scrollYProgress, "change", apply);

  return (
    <section ref={ref} {...props}>
      {children}
    </section>
  );
}
