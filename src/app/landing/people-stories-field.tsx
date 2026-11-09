"use client";

import Image from "next/image";
import { useLayoutEffect, useRef, useState } from "react";

import {
  BRAND_COLORS,
  type BrandColor,
  needsDarkText,
} from "@/lib/brand-palette";
import {
  armShapeEntrances,
  REDUCED_MOTION,
  trackPointerDrift,
} from "@/lib/shape-motion";
import { cn } from "@/lib/utils";

import styles from "./people-stories-section.module.css";
import { StoryOverlay } from "./story-overlay";
import { STORY_SNIPPETS, type StorySnippet } from "./story-snippets";

/*
 * The hover and story colours: the brand palette less Warm Snow and white,
 * which would vanish against this Warm Snow section.
 */
const POP_COLORS = BRAND_COLORS.filter(
  (color) => color.name !== "warm-snow" && color.name !== "pure-white",
);

/*
 * Each headshot's place, size, silhouette mask, float phase and drift depth,
 * in STORY_SNIPPETS order. Positions follow the Figma frames (mobile 360 x
 * 734, tablet 768 x 886, desktop 1440 x 1114; tablet and mobile at 0.674 and
 * 0.489 of the desktop sizes). The field is centred and capped at the
 * frame's width; on desktop the two right-hand headshots are placed from the
 * right edge (Figma's 179 and 123), so they stay on screen down to 1280.
 */
const LAYOUT = [
  {
    mask: styles.maskRahmah,
    float: styles.float1,
    depth: 0.9,
    className:
      "top-24.5 left-1.75 w-29.25 md:top-31.25 md:left-8 md:w-40.5 xl:top-45 xl:left-32.25 xl:w-60",
  },
  {
    mask: styles.maskMustafa,
    float: styles.float2,
    depth: 0.6,
    className:
      "top-3.75 left-35.25 w-25 md:top-20.75 md:left-80.25 md:w-34.25 xl:top-18.5 xl:left-158 xl:w-51",
  },
  {
    mask: styles.maskMaryam,
    float: styles.float3,
    depth: 0.8,
    className:
      "top-27.75 left-63.5 w-24 md:top-35.75 md:left-146.25 md:w-33.25 xl:top-53 xl:right-44.75 xl:left-auto xl:w-49.25",
  },
  {
    mask: styles.maskLayla,
    float: styles.float4,
    depth: 1,
    className:
      "top-123.75 left-3 w-27 md:top-116 md:left-11.5 md:w-37.25 xl:top-150 xl:left-29.25 xl:w-55",
  },
  {
    mask: styles.maskBilal,
    float: styles.float5,
    depth: 0.7,
    className:
      "top-148.75 left-31 w-27.5 md:top-157.5 md:left-74.75 md:w-38 xl:top-207.5 xl:left-145.75 xl:w-56.5",
  },
  {
    mask: styles.maskYusuf,
    float: "",
    depth: 0.85,
    className:
      "top-120.25 left-54 w-36 md:top-120.75 md:left-134.25 md:w-49.5 xl:top-156.75 xl:right-30.75 xl:left-auto xl:w-73.5",
  },
] as const;

/** A random pop colour, never `last` (the one this headshot showed last). */
function pickPopColor(last: BrandColor | undefined) {
  const choices = POP_COLORS.filter((color) => color !== last);
  return choices[Math.floor(Math.random() * choices.length)];
}

type Active = {
  story: StorySnippet;
  color: BrandColor;
  darkText: boolean;
  trigger: HTMLButtonElement;
};

/**
 * The six floating headshots and their stories.
 *
 * - Motion (the shared shape motion, as in the everywhere section): each
 *   grows and fades in on entering view and, with a fine pointer, drifts
 *   towards the cursor; a slow CSS float keeps them alive. No orbit.
 * - Hover (fine pointer) or keyboard focus: a colour is picked at random from
 *   the palette (never the last one this headshot showed) and the headshot's
 *   own silhouette slides out behind it, bigger, in that colour.
 * - Click: the story opens over the page in that same colour (on touch,
 *   where there was no hover, one is picked then), its text and button
 *   flipped for contrast.
 *
 * Under reduced motion there is no entrance, drift or float, and the pop
 * appears without sliding; the DOM is the same either way.
 */
export function PeopleStoriesField() {
  const fieldRef = useRef<HTMLDivElement>(null);
  const colors = useRef(new Map<string, BrandColor>());
  const [active, setActive] = useState<Active | null>(null);

  useLayoutEffect(() => {
    const field = fieldRef.current;
    if (!field || window.matchMedia(REDUCED_MOTION).matches) return;
    const disarm = armShapeEntrances(
      [...field.querySelectorAll('[data-stories="art"]')],
      {
        duration: "--duration-stories-shape",
        fromScale: "--stories-shape-from-scale",
        easing: "--ease-stories",
      },
    );
    const stopDrift = trackPointerDrift(
      field,
      [...field.querySelectorAll<HTMLElement>('[data-stories="drift"]')].map(
        (element) => ({ element, depth: Number(element.dataset.depth ?? 1) }),
      ),
      "--stories-pointer-drift",
    );
    return () => {
      disarm();
      stopDrift();
    };
  }, []);

  /** Gives this headshot's pop a fresh colour (never its last one). */
  const repaint = (slug: string, pop: Element | null) => {
    const last = colors.current.get(slug);
    const color = pickPopColor(last);
    colors.current.set(slug, color);
    if (pop) {
      if (last) pop.classList.remove(last.bg);
      pop.classList.add(color.bg);
    }
    return color;
  };

  return (
    <div ref={fieldRef} className="pointer-events-none absolute inset-0">
      {STORY_SNIPPETS.map((story, index) => {
        const layout = LAYOUT[index];
        return (
          <div key={story.slug} className={cn("absolute", layout.className)}>
            <div
              data-stories="drift"
              data-depth={layout.depth}
              className={styles.drift}
            >
              <div className={cn(styles.float, layout.float)}>
                <div data-stories="art">
                  <button
                    type="button"
                    aria-label={`Read ${story.name}’s story`}
                    aria-haspopup="dialog"
                    className={cn(
                      "pointer-events-auto relative block w-full cursor-pointer outline-none focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-royal",
                      styles.headshot,
                    )}
                    onPointerEnter={(event) => {
                      if (event.pointerType === "mouse")
                        repaint(
                          story.slug,
                          event.currentTarget.firstElementChild,
                        );
                    }}
                    onFocus={(event) => {
                      if (event.currentTarget.matches(":focus-visible"))
                        repaint(
                          story.slug,
                          event.currentTarget.firstElementChild,
                        );
                    }}
                    onClick={(event) => {
                      const color =
                        colors.current.get(story.slug) ??
                        repaint(
                          story.slug,
                          event.currentTarget.firstElementChild,
                        );
                      setActive({
                        story,
                        color,
                        darkText: needsDarkText(color),
                        trigger: event.currentTarget,
                      });
                    }}
                  >
                    <span
                      aria-hidden="true"
                      className={cn(
                        "pointer-events-none",
                        styles.pop,
                        layout.mask,
                      )}
                    />
                    <Image
                      src={story.headshot}
                      alt=""
                      sizes="(width >= 80rem) 300px, (width >= 48rem) 200px, 150px"
                      className="relative block h-auto w-full"
                    />
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      })}

      {active ? (
        <StoryOverlay
          key={active.story.slug}
          story={active.story}
          color={active.color}
          darkText={active.darkText}
          onClosed={() => {
            const trigger = active.trigger;
            setActive(null);
            requestAnimationFrame(() => {
              if (trigger.isConnected) trigger.focus({ preventScroll: true });
            });
          }}
        />
      ) : null}
    </div>
  );
}
