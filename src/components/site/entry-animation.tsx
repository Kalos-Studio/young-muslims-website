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

export function EntryAnimation({ children }: { children: ReactNode }) {
  const [frameIndex, setFrameIndex] = useState(0);
  const [stage, setStage] = useState<Stage>("flashing");

  useLayoutEffect(() => {
    const shouldResetScroll = window.location.hash === "";
    const previousScrollRestoration = window.history.scrollRestoration;

    if (shouldResetScroll) {
      window.history.scrollRestoration = "manual";
      window.scrollTo(0, 0);
    }

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const reducedMotionTimer = window.setTimeout(() => {
        if (shouldResetScroll) {
          window.scrollTo(0, 0);
          window.history.scrollRestoration = previousScrollRestoration;
        }

        setStage("done");
      }, 0);

      return () => {
        window.clearTimeout(reducedMotionTimer);
        window.history.scrollRestoration = previousScrollRestoration;
      };
    }

    const previousOverflow = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";

    const timers: number[] = [];

    frames.slice(1).forEach((_, index) => {
      timers.push(
        window.setTimeout(
          () => setFrameIndex(index + 1),
          FLASH_DURATION_MS * (index + 1),
        ),
      );
    });

    const revealAt =
      FLASH_DURATION_MS * (frames.length - 1) + FINAL_FRAME_HOLD_MS;

    timers.push(window.setTimeout(() => setStage("revealing"), revealAt));
    timers.push(
      window.setTimeout(
        () => {
          if (shouldResetScroll) {
            window.scrollTo(0, 0);
            window.history.scrollRestoration = previousScrollRestoration;
          }

          document.documentElement.style.overflow = previousOverflow;
          setStage("done");
        },
        revealAt + REVEAL_DURATION_MS + 50,
      ),
    );

    return () => {
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
