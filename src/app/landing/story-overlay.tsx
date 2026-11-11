"use client";

import { Dialog } from "@base-ui/react/dialog";
import Image, { getImageProps } from "next/image";
import { useEffect, useRef, useState } from "react";

import {
  BlobReveal,
  pickBlobRevealOrigin,
  readTimeToken,
} from "@/components/site/blob-reveal";
import {
  startSmoothScroll,
  stopSmoothScroll,
} from "@/components/site/smooth-scroll-provider";
import { MaterialIcon } from "@/components/ui/material-icon";
import { StandardButton } from "@/components/ui/standard-button";
import type { BrandColor } from "@/lib/brand-palette";
import { REDUCED_MOTION } from "@/lib/shape-motion";
import { cn } from "@/lib/utils";

import quoteMark from "../../../design-assets/figma/landing-2026/stories/quote-mark.svg";
import styles from "./people-stories-section.module.css";
import type { StorySnippet } from "./story-snippets";

type Phase = "mounting" | "covering" | "open" | "closing" | "revealing";

/**
 * A story, opened over the landing page (not a route). The overlay is the
 * BlobReveal layer itself, in `color` (the colour of the hover pop that
 * preceded the click): mounted off-screen, it sweeps in to cover the page
 * from a random side, then its content fades in. Closing fades the content
 * and sweeps the blob back out the way it came, and the overlay unmounts.
 *
 * It is a Base UI dialog, portalled into <body> (outside the footer Easter
 * egg's transformed wrapper, and not in the browser's top layer, so the page
 * transition still covers it): focus moves to the close button and is
 * trapped, Escape closes, the page behind is inert and its scroll locked
 * (which also stands Lenis and the footer Easter egg down; Lenis is stopped
 * too while open). The story scrolls in its own container. Opening pushes a
 * same-URL history entry, so Back closes it.
 *
 * Text, and the button's tone, flip by the colour's luminance (`darkText`).
 * Under reduced motion it opens and closes at once, with no fade.
 */
export function StoryOverlay({
  story,
  color,
  darkText,
  onClosed,
}: {
  story: StorySnippet;
  color: BrandColor;
  darkText: boolean;
  onClosed: () => void;
}) {
  const [reduced] = useState(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia(REDUCED_MOTION).matches,
  );
  const [phase, setPhase] = useState<Phase>(reduced ? "open" : "mounting");
  const [origin] = useState(pickBlobRevealOrigin);
  const closeRef = useRef<HTMLButtonElement>(null);
  const historyEntry = useRef(false);
  const phaseRef = useRef(phase);
  const onClosedRef = useRef(onClosed);

  useEffect(() => {
    phaseRef.current = phase;
    onClosedRef.current = onClosed;
  });

  // Sweep in once the off-screen pose has painted.
  useEffect(() => {
    if (reduced) return;
    let second = 0;
    const first = requestAnimationFrame(() => {
      second = requestAnimationFrame(() => setPhase("covering"));
    });
    return () => {
      cancelAnimationFrame(first);
      cancelAnimationFrame(second);
    };
  }, [reduced]);

  const startClosing = () => {
    const current = phaseRef.current;
    if (current === "closing" || current === "revealing") return;
    if (reduced) {
      onClosedRef.current();
      return;
    }
    if (current === "open") {
      setPhase("closing");
      window.setTimeout(
        () => setPhase("revealing"),
        readTimeToken("--duration-stories-fade", 400),
      );
    } else {
      setPhase("revealing");
    }
  };

  // Close, taking our history entry off the stack if it is still there.
  const requestClose = () => {
    if (historyEntry.current) {
      historyEntry.current = false;
      window.history.back();
    }
    startClosing();
  };

  useEffect(() => {
    stopSmoothScroll();
    // Going back to the landing page's own entry must not move the page:
    // the browser would restore a scroll position it saved for that entry.
    const restoration = window.history.scrollRestoration;
    const scrollY = window.scrollY;
    window.history.scrollRestoration = "manual";
    // One same-URL entry, marked so a remount (React's development double
    // effect) does not push a second.
    if (
      !(window.history.state as { storyOverlay?: boolean } | null)?.storyOverlay
    )
      window.history.pushState(
        { storyOverlay: true },
        "",
        window.location.href,
      );
    historyEntry.current = true;
    const onPopState = () => {
      if (!historyEntry.current) return;
      historyEntry.current = false;
      startClosing();
    };
    window.addEventListener("popstate", onPopState);
    return () => {
      window.removeEventListener("popstate", onPopState);
      window.history.scrollRestoration = restoration;
      if (Math.abs(window.scrollY - scrollY) > 1) window.scrollTo(0, scrollY);
      // During a page transition (the story's link), leave Lenis to it.
      if (!document.querySelector("[data-page-transition-cover]"))
        startSmoothScroll();
    };
    // startClosing reads refs only, so mounting once is right.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const textColor = darkText ? "text-brand-obsidian" : "text-brand-pure-white";

  return (
    <Dialog.Root
      open
      onOpenChange={(open) => {
        if (!open) requestClose();
      }}
    >
      <Dialog.Portal>
        <Dialog.Popup className={styles.overlay} initialFocus={closeRef}>
          <BlobReveal
            revealing={phase === "mounting" || phase === "revealing"}
            origin={origin}
            onCovered={() => setPhase("open")}
            onRevealed={() => onClosedRef.current()}
            className={cn("absolute inset-0", color.bg, textColor)}
          >
            <div
              data-lenis-prevent
              className="absolute inset-0 overflow-y-auto overscroll-contain"
            >
              <div
                className={cn(styles.content, styles.layout)}
                data-shown={phase === "open" ? "" : undefined}
              >
                <StoryPhoto story={story} />
                <StoryBody
                  story={story}
                  darkText={darkText}
                  onNavigate={() => {
                    historyEntry.current = false;
                  }}
                />
              </div>
            </div>
            <Dialog.Close
              ref={closeRef}
              aria-label="Close story"
              className="ym-close absolute top-4 right-4 size-11 md:top-8 md:right-8 md:size-12 short:top-3 short:right-3 short:size-10"
            >
              <MaterialIcon name="close" aria-hidden />
            </Dialog.Close>
          </BlobReveal>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

/**
 * The photo band, cut along a wavy bottom edge. It takes whatever height the
 * text leaves, up to `--stories-photo-height` (CSS module); each photo is
 * pre-cropped to its Figma framing, so its top is what the band shows. On
 * desktop, a story with a `photoDesktop` crop shows that instead (art
 * direction), placed so its face, 30% down, stays clear of the wavy edge.
 */
function StoryPhoto({ story }: { story: StorySnippet }) {
  const alt = `${story.name}, ${story.city}`;
  if (!story.photoDesktop)
    return (
      <div className={cn("relative", styles.photo)}>
        <Image
          src={story.photo}
          alt={alt}
          fill
          sizes="100vw"
          className="object-cover object-top"
        />
      </div>
    );
  const common = { alt, sizes: "100vw" };
  const {
    props: { srcSet: desktop },
  } = getImageProps({ ...common, src: story.photoDesktop });
  const {
    props: { srcSet: other, ...img },
  } = getImageProps({ ...common, src: story.photo });
  return (
    <div className={cn("relative", styles.photo)}>
      <picture>
        <source media="(width >= 80rem)" srcSet={desktop} />
        <source srcSet={other} />
        <img
          {...img}
          alt={alt}
          className={cn(
            "absolute inset-0 size-full object-cover object-top",
            styles.photoFramed,
          )}
        />
      </picture>
    </div>
  );
}

/**
 * The coloured part, at its natural height: the lighter band (Warm Snow at
 * 10%), the quote mark, the pull-quote, the narrative, the attribution and
 * "View the full story" (dark StandardButton on dark colours, light on light
 * ones). Desktop sets the quote beside the narrative; tablet stacks them (the
 * quote centred); mobile centres everything. Sizes are trimmed from Figma's
 * so the whole story fits one screen; landscape phones set the text beside
 * the photo.
 */
function StoryBody({
  story,
  darkText,
  onNavigate,
}: {
  story: StorySnippet;
  darkText: boolean;
  onNavigate: () => void;
}) {
  return (
    <div className={styles.body}>
      <div
        aria-hidden="true"
        className={cn(
          "absolute inset-x-0 top-6 bottom-0 bg-brand-warm-snow/10 md:top-8 xl:top-10",
          styles.band,
        )}
      />
      <Image
        src={quoteMark}
        alt=""
        aria-hidden="true"
        className="absolute top-10 left-4 h-auto w-16 md:top-12 md:left-10 md:w-24 xl:top-16 xl:left-13 xl:w-32 short:top-4 short:w-14"
      />
      <div className="relative mx-auto flex w-full max-w-360 flex-col gap-3 px-8 pt-14 pb-6 text-center md:gap-5 md:px-16 md:pt-18 md:pb-10 md:text-left xl:flex-row xl:justify-between xl:gap-16 xl:pt-24 xl:pr-20 xl:pb-14 xl:pl-32 short:gap-3 short:px-6 short:pt-12 short:pb-5 short:text-left">
        <Dialog.Title
          render={<blockquote />}
          className="text-landing-copy font-bold md:text-center xl:max-w-124 xl:text-left xl:text-mobile-display short:text-left short:text-body"
        >
          {story.quote}
        </Dialog.Title>
        <div className="flex flex-col gap-3 md:gap-5 xl:max-w-160 xl:flex-1 xl:gap-6 short:gap-3">
          <p className="text-body font-medium xl:text-landing-copy short:text-body">
            {story.narrative}
          </p>
          <div className="flex flex-col items-center gap-3 md:items-start md:gap-4 xl:flex-row xl:items-center xl:justify-between short:flex-row short:items-center short:justify-between">
            <p className="text-body font-extrabold xl:text-landing-copy short:text-body">
              — {story.name}, YM {story.city}
            </p>
            <StandardButton
              href={`/stories/${story.slug}`}
              label="View the full story"
              tone={darkText ? "light" : "dark"}
              onClick={onNavigate}
              className="short:w-auto"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
