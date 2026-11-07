"use client";

import type { ReactNode } from "react";
import { useLayoutEffect, useRef, useState } from "react";

import { BlobReveal, readTimeToken } from "./blob-reveal";
import { entryPhotos } from "./entry-photos";
import styles from "./entry-animation.module.css";

const VIDEO_READY_TIMEOUT_MS = 5_000;
/** Extra time after the reveal's duration before the safety finish runs. */
const REVEAL_SAFETY_MS = 500;

type Stage = "flashing" | "revealing" | "done";

async function preloadImage(src: string) {
  const image = new window.Image();
  image.src = src;
  try {
    await image.decode();
  } catch {
    // A failed asset should not leave the entry overlay on screen forever.
  }
}

async function waitForPageImage(image: HTMLImageElement) {
  image.loading = "eager";

  if (!image.complete) {
    await new Promise<void>((resolve) => {
      image.addEventListener("load", () => resolve(), { once: true });
      image.addEventListener("error", () => resolve(), { once: true });
    });
  }

  try {
    await image.decode();
  } catch {
    // Decode can reject for an image that failed to load.
  }
}

function waitForVideo(video: HTMLVideoElement) {
  if (video.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA || video.error) {
    return Promise.resolve();
  }

  return new Promise<void>((resolve) => {
    const finish = () => {
      window.clearTimeout(timeout);
      video.removeEventListener("loadeddata", finish);
      video.removeEventListener("error", finish);
      resolve();
    };
    const timeout = window.setTimeout(finish, VIDEO_READY_TIMEOUT_MS);

    video.addEventListener("loadeddata", finish, { once: true });
    video.addEventListener("error", finish, { once: true });

    // The media can become ready between the initial check and listener setup.
    if (video.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA || video.error) {
      finish();
    }
  });
}

async function waitForLandingContent() {
  const landingPage = document.querySelector<HTMLElement>(
    "[data-landing-page]",
  );
  if (!landingPage) return;

  const pageImages = Array.from(landingPage.querySelectorAll("img"));
  const svgImageSources = Array.from(landingPage.querySelectorAll("svg image"))
    .map((image) => image.getAttribute("href"))
    .filter((src): src is string => Boolean(src));
  const videos = Array.from(landingPage.querySelectorAll("video"));

  await Promise.all([
    document.fonts.ready,
    ...pageImages.map(waitForPageImage),
    ...[...new Set(svgImageSources)].map(preloadImage),
    ...videos.map(waitForVideo),
  ]);
}

/** Shows one photo layer of the entry wordmark and hides the rest. */
function showEntryPhoto(index: number) {
  document
    .querySelectorAll<SVGImageElement>("[data-entry-photo]")
    .forEach((layer) => {
      layer.setAttribute(
        "opacity",
        layer.dataset.entryPhoto === String(index) ? "1" : "0",
      );
    });
}

/**
 * The first-load entry sequence. `screen` (the server-rendered EntryScreen)
 * is on screen at first paint; photos flash through its wordmark, and once
 * the page underneath is ready the whole screen wipes away with a
 * centre-origin BlobReveal: a blob grows from the middle of the composition
 * and uncovers the page outward.
 *
 * Contract other code relies on: while playing, `<html>` has an inline
 * `overflow: hidden` (the footer Easter egg and Lenis both check it), scroll
 * restoration is manual and the page is scrolled to the top unless the URL
 * has a hash, and the overlay carries `data-entry-animation`. All of it is
 * restored on finish. Under reduced motion the overlay is hidden and the
 * sequence finishes immediately.
 */
export function EntryAnimation({
  children,
  screen,
}: {
  children: ReactNode;
  screen: ReactNode;
}) {
  const [stage, setStage] = useState<Stage>("flashing");
  const finishRef = useRef(() => {});

  useLayoutEffect(() => {
    const shouldResetScroll = window.location.hash === "";
    const previousScrollRestoration = window.history.scrollRestoration;
    const isLandingPage = Boolean(
      document.querySelector("[data-landing-page]"),
    );
    let cancelled = false;
    let finished = false;
    let frameTimer: number | undefined;
    const timers: number[] = [];
    const previousOverflow = document.documentElement.style.overflow;

    const finish = () => {
      if (cancelled || finished) return;
      finished = true;
      if (shouldResetScroll) window.scrollTo(0, 0);
      window.history.scrollRestoration = previousScrollRestoration;
      document.documentElement.style.overflow = previousOverflow;
      setStage("done");
    };
    finishRef.current = finish;

    if (shouldResetScroll) {
      window.history.scrollRestoration = "manual";
      window.scrollTo(0, 0);
    }

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      timers.push(window.setTimeout(finish, 0));

      return () => {
        cancelled = true;
        timers.forEach(window.clearTimeout);
        window.history.scrollRestoration = previousScrollRestoration;
      };
    }

    document.documentElement.style.overflow = "hidden";
    const landingContentReady = isLandingPage
      ? waitForLandingContent()
      : Promise.resolve();
    const photosReady = Promise.all(
      entryPhotos.map((photo) => preloadImage(photo.src)),
    );

    // Each photo gets an equal share of the flash; the last one is held.
    const frameDuration =
      readTimeToken("--duration-entry-flash", 1200) / entryPhotos.length;
    const holdDuration = readTimeToken("--duration-entry-hold", 140);
    const lastPhoto = entryPhotos.length - 1;
    let photoIndex = 0;

    void photosReady.then(() => {
      if (cancelled) return;

      frameTimer = window.setInterval(() => {
        photoIndex = (photoIndex + 1) % entryPhotos.length;
        showEntryPhoto(photoIndex);
      }, frameDuration);

      const minimumCycle = new Promise<void>((resolve) => {
        timers.push(window.setTimeout(resolve, frameDuration * lastPhoto));
      });

      void Promise.all([minimumCycle, landingContentReady]).then(() => {
        if (cancelled) return;
        window.clearInterval(frameTimer);
        showEntryPhoto(lastPhoto);
        timers.push(
          window.setTimeout(() => {
            if (cancelled) return;
            setStage("revealing");
            // BlobReveal reports completion; this only guards against a
            // transition that never ends.
            timers.push(
              window.setTimeout(
                finish,
                readTimeToken("--duration-blob-reveal", 700) + REVEAL_SAFETY_MS,
              ),
            );
          }, holdDuration),
        );
      });
    });

    return () => {
      cancelled = true;
      window.clearInterval(frameTimer);
      timers.forEach(window.clearTimeout);
      document.documentElement.style.overflow = previousOverflow;
      window.history.scrollRestoration = previousScrollRestoration;
    };
  }, []);

  return (
    <>
      <div className={styles.site}>{children}</div>

      {stage !== "done" ? (
        <BlobReveal
          aria-hidden="true"
          data-entry-animation
          revealing={stage === "revealing"}
          origin="center"
          onRevealed={() => finishRef.current()}
          className={styles.root}
        >
          {screen}
        </BlobReveal>
      ) : null}
    </>
  );
}
