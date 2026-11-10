"use client";

import Image, { type StaticImageData } from "next/image";
import { useRef, type PointerEvent } from "react";
import {
  motion,
  useInView,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "motion/react";

const rowPositions = [
  "top-0",
  "top-[223px] md:top-[360px]",
  "top-[446px] md:top-[720px]",
] as const;

function useMarqueeMotion<T extends HTMLElement>() {
  const containerRef = useRef<T>(null);
  const isVisible = useInView(containerRef, { margin: "100px 0px" });
  const reduceMotion = useReducedMotion();
  const cursorXTarget = useMotionValue(0);
  const cursorYTarget = useMotionValue(0);
  const cursorX = useSpring(cursorXTarget, { stiffness: 80, damping: 24 });
  const cursorY = useSpring(cursorYTarget, { stiffness: 80, damping: 24 });

  const handlePointerMove = (event: PointerEvent<T>) => {
    if (reduceMotion || event.pointerType !== "mouse") return;

    const bounds = event.currentTarget.getBoundingClientRect();
    cursorXTarget.set(
      ((event.clientX - bounds.left) / bounds.width - 0.5) * 24,
    );
    cursorYTarget.set(
      ((event.clientY - bounds.top) / bounds.height - 0.5) * 16,
    );
  };

  const resetCursor = () => {
    cursorXTarget.set(0);
    cursorYTarget.set(0);
  };

  return {
    containerRef,
    isVisible,
    cursorX,
    cursorY,
    handlePointerMove,
    resetCursor,
  };
}

export function ChapterImageMarquee({ rows }: { rows: StaticImageData[][] }) {
  const {
    containerRef,
    isVisible,
    cursorX,
    cursorY,
    handlePointerMove,
    resetCursor,
  } = useMarqueeMotion<HTMLElement>();

  return (
    <section
      ref={containerRef}
      aria-label="Young Muslims chapters across the country"
      className="relative h-[693px] w-full overflow-hidden bg-brand-warm-snow md:h-[1104px]"
      onPointerMove={handlePointerMove}
      onPointerLeave={resetCursor}
    >
      {rows.map((row, rowIndex) => (
        <motion.div
          key={rowIndex}
          className={`absolute left-1/2 w-max ${rowPositions[rowIndex]}`}
          style={{ x: cursorX, y: cursorY }}
        >
          <div
            className="nn-image-marquee-track flex w-max"
            data-direction={rowIndex === 1 ? "left" : "right"}
            style={{
              animationDirection: rowIndex === 1 ? "normal" : "reverse",
              animationPlayState: isVisible ? "running" : "paused",
            }}
          >
            {[0, 1].map((copy) => (
              <div key={copy} aria-hidden="true" className="flex shrink-0">
                {row.map((tile, tileIndex) => (
                  <div
                    key={`${copy}-${tileIndex}`}
                    className="relative h-[223px] w-[140px] shrink-0 md:h-[360px] md:w-[226px]"
                  >
                    <Image
                      src={tile}
                      alt=""
                      fill
                      sizes="(max-width: 767px) 140px, 226px"
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            ))}
          </div>
        </motion.div>
      ))}
    </section>
  );
}
