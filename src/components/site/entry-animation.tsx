"use client";

import type { ReactNode } from "react";
import { useLayoutEffect, useState } from "react";

import frame01 from "../../../design-assets/figma/entry-animation/frame-01.png";
import frame02 from "../../../design-assets/figma/entry-animation/frame-02.png";
import frame03 from "../../../design-assets/figma/entry-animation/frame-03.png";
import frame04 from "../../../design-assets/figma/entry-animation/frame-04.png";
import frame05 from "../../../design-assets/figma/entry-animation/frame-05.png";
import frame06 from "../../../design-assets/figma/entry-animation/frame-06.png";
import frame07 from "../../../design-assets/figma/entry-animation/frame-07.png";
import styles from "./entry-animation.module.css";

const frames = [frame01, frame02, frame03, frame04, frame05, frame06, frame07];

const FLASH_DURATION_MS = 145;
const FINAL_FRAME_HOLD_MS = 140;
const REVEAL_DURATION_MS = 750;

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
    video.addEventListener("loadeddata", () => resolve(), { once: true });
    video.addEventListener("error", () => resolve(), { once: true });
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

export function EntryAnimation({ children }: { children: ReactNode }) {
  const [frameIndex, setFrameIndex] = useState(0);
  const [stage, setStage] = useState<Stage>("flashing");

  useLayoutEffect(() => {
    const shouldResetScroll = window.location.hash === "";
    const previousScrollRestoration = window.history.scrollRestoration;
    const isLandingPage = Boolean(
      document.querySelector("[data-landing-page]"),
    );
    let cancelled = false;
    let frameTimer: number | undefined;
    const timers: number[] = [];
    const previousOverflow = document.documentElement.style.overflow;

    const finish = () => {
      if (cancelled) return;
      if (shouldResetScroll) window.scrollTo(0, 0);
      window.history.scrollRestoration = previousScrollRestoration;
      document.documentElement.style.overflow = previousOverflow;
      setStage("done");
    };

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

    const entryFramesReady = isLandingPage
      ? Promise.all(frames.map((frame) => preloadImage(frame.src)))
      : Promise.resolve();

    void entryFramesReady.then(() => {
      if (cancelled) return;

      frameTimer = window.setInterval(() => {
        setFrameIndex((index) => (index + 1) % frames.length);
      }, FLASH_DURATION_MS);

      const minimumCycle = new Promise<void>((resolve) => {
        timers.push(
          window.setTimeout(resolve, FLASH_DURATION_MS * (frames.length - 1)),
        );
      });

      void Promise.all([minimumCycle, landingContentReady]).then(() => {
        if (cancelled) return;
        window.clearInterval(frameTimer);
        setFrameIndex(frames.length - 1);
        timers.push(
          window.setTimeout(() => {
            if (cancelled) return;
            setStage("revealing");
            timers.push(window.setTimeout(finish, REVEAL_DURATION_MS + 50));
          }, FINAL_FRAME_HOLD_MS),
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
        <div
          aria-hidden="true"
          className={`${styles.root} ${stage === "revealing" ? styles.revealing : ""}`}
          data-entry-animation
        >
          <svg
            className={styles.canvas}
            viewBox="0 0 1440 1024"
            preserveAspectRatio="xMidYMid meet"
          >
            {frames.map((frame, index) => (
              <image
                key={frame.src}
                className={styles.frame}
                href={frame.src}
                x="183.1"
                y="36"
                width="1073.78"
                height="926"
                opacity={index === frameIndex ? 1 : 0}
                preserveAspectRatio="xMidYMid meet"
              />
            ))}
          </svg>
        </div>
      ) : null}
    </>
  );
}
