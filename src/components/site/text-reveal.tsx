"use client";

import { animate, inView } from "motion/react";
import {
  Children,
  cloneElement,
  isValidElement,
  useLayoutEffect,
  useRef,
  type ElementType,
  type ReactNode,
} from "react";

import { readEaseToken, readLengthToken } from "@/lib/motion-tokens";

import { readTimeToken } from "./blob-reveal";

// Elements spread with `textRevealUnit` (./text-reveal-unit) are revealed
// whole rather than split.
type SplittableProps = {
  children?: ReactNode;
  "data-text-reveal-unit"?: string;
};

/**
 * Wraps every word in an inline-block span (a transform needs a box) and
 * keeps the whitespace between them, recursing into elements such as an
 * `<h2>`, a `<p>` or a highlighted `<span>`. `<br />` and other empty
 * elements pass through. The split is the same on the server and the client.
 */
function splitWords(children: ReactNode, prefix = ""): ReactNode[] {
  return Children.toArray(children).flatMap((child, index): ReactNode[] => {
    const key = `${prefix}${index}`;
    if (typeof child === "string" || typeof child === "number") {
      return String(child)
        .split(/(\s+)/)
        .filter(Boolean)
        .map((part, partIndex) =>
          /^\s+$/.test(part) ? (
            part
          ) : (
            <span
              key={`${key}-${partIndex}`}
              data-text-reveal-word=""
              className="inline-block"
            >
              {part}
            </span>
          ),
        );
    }
    if (!isValidElement<SplittableProps>(child)) return [child];
    if (child.props["data-text-reveal-unit"] !== undefined) {
      return [cloneElement(child, { "data-text-reveal-word": "" } as object)];
    }
    if (child.props.children === undefined) return [child];
    return [
      cloneElement(child, undefined, ...splitWords(child.props.children, key)),
    ];
  });
}

/** Groups words into the lines they currently wrap onto, in reading order. */
function groupLines(words: HTMLElement[]) {
  const lines: HTMLElement[][] = [];
  let lineBottom = Number.NEGATIVE_INFINITY;
  for (const word of words) {
    const { top, bottom } = word.getBoundingClientRect();
    const middle = (top + bottom) / 2;
    const line = lines.at(-1);
    if (line && middle < lineBottom) {
      line.push(word);
      lineBottom = Math.max(lineBottom, bottom);
    } else {
      lines.push([word]);
      lineBottom = bottom;
    }
  }
  return lines;
}

/**
 * The site's text reveal: every section below the hero wraps its text in
 * it. When the text scrolls into view its lines fade in and rise into place
 * one after another, once.
 *
 * Wrap a heading, a paragraph, or a block holding both (the stagger then runs
 * through the heading's lines into the body's). Lines are measured when the
 * reveal starts, so they follow however the text wraps at that width. Spread
 * `textRevealUnit` (from ./text-reveal-unit) on a link or button inside to
 * reveal it as one line.
 *
 * Timing comes from the `--duration-text-reveal`, `--duration-text-reveal-
 * stagger`, `--text-reveal-rise` and `--ease-text-reveal` tokens. Scrolling
 * is native (Lenis drives the window scroll), so in-view detection stays in
 * step with smooth scrolling. Under reduced motion, and before JavaScript
 * runs, the text is simply shown in place.
 */
export function TextReveal({
  as: Component = "div",
  className,
  id,
  children,
}: {
  as?: ElementType;
  className?: string;
  id?: string;
  children: ReactNode;
}) {
  const ref = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const root = ref.current;
    if (!root || window.matchMedia("(prefers-reduced-motion: reduce)").matches)
      return;
    const words = Array.from(
      root.querySelectorAll<HTMLElement>("[data-text-reveal-word]"),
    );
    if (words.length === 0) return;

    // Hide before the browser paints the hydrated page; the section starts
    // below the fold, so nothing visible disappears.
    const rise = readLengthToken("--text-reveal-rise", 20);
    for (const word of words) {
      word.style.opacity = "0";
      word.style.transform = `translateY(${rise}px)`;
    }

    const stopWatching = inView(
      root,
      () => {
        stopWatching();
        const duration = readTimeToken("--duration-text-reveal", 700) / 1000;
        const stagger =
          readTimeToken("--duration-text-reveal-stagger", 90) / 1000;
        const ease = readEaseToken("--ease-text-reveal", [0.22, 1, 0.36, 1]);
        groupLines(words).forEach((line, index) => {
          animate(
            line,
            { opacity: [0, 1], y: [rise, 0] },
            { duration, ease, delay: index * stagger },
          );
        });
      },
      // Start once the text's top is 15% up from the bottom of the viewport.
      // The area above the viewport counts as in view too, so text that a
      // jump (a link to a later section, a dragged scrollbar) skips past is
      // still revealed rather than left hidden.
      { margin: "100000px 0px -15% 0px" },
    );
    return () => stopWatching();
  }, []);

  return (
    <Component ref={ref} id={id} className={className}>
      {splitWords(children)}
    </Component>
  );
}
