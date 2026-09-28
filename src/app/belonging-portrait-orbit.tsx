"use client";

import Image, { type StaticImageData } from "next/image";
import { useEffect, useRef, useState } from "react";
import {
  type MotionValue,
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTime,
  useTransform,
} from "motion/react";

import portrait01 from "../../design-assets/figma/landing-2026/orbit-01.png";
import portrait02 from "../../design-assets/figma/landing-2026/orbit-02.png";
import portrait03 from "../../design-assets/figma/landing-2026/orbit-03.png";
import portrait04 from "../../design-assets/figma/landing-2026/orbit-04.png";
import portrait05 from "../../design-assets/figma/landing-2026/orbit-05.png";
import portrait06 from "../../design-assets/figma/landing-2026/orbit-06.png";
import portrait07 from "../../design-assets/figma/landing-2026/orbit-07.png";
import portrait08 from "../../design-assets/figma/landing-2026/orbit-08.png";
import portrait09 from "../../design-assets/figma/landing-2026/orbit-09.png";
import portrait10 from "../../design-assets/figma/landing-2026/orbit-10.png";
import portrait11 from "../../design-assets/figma/landing-2026/orbit-11.png";
import portrait12 from "../../design-assets/figma/landing-2026/orbit-12.png";
import portrait13 from "../../design-assets/figma/landing-2026/orbit-13.png";
import portrait14 from "../../design-assets/figma/landing-2026/orbit-14.png";
import portrait15 from "../../design-assets/figma/landing-2026/orbit-15.png";
import portrait16 from "../../design-assets/figma/landing-2026/orbit-16.png";
import portrait17 from "../../design-assets/figma/landing-2026/orbit-17.png";
import portrait18 from "../../design-assets/figma/landing-2026/orbit-18.png";
import portrait19 from "../../design-assets/figma/landing-2026/orbit-19.png";
import portrait20 from "../../design-assets/figma/landing-2026/orbit-20.png";

type Portrait = {
  image: StaticImageData;
  width: number;
  height: number;
  rotate?: number;
};

type OrbitSize = {
  width: number;
  height: number;
};

const FULL_CIRCLE = Math.PI * 2;
const ORBIT_DURATION_MS = 36_000;
const HORIZONTAL_RADIUS = 0.64;
const VERTICAL_RADIUS = 0.27;
const ORBIT_TILT_RADIANS = (-14 * Math.PI) / 180;

const PORTRAITS: Portrait[] = [
  { image: portrait01, width: 194, height: 208 },
  { image: portrait02, width: 215, height: 220 },
  { image: portrait03, width: 242, height: 223 },
  { image: portrait04, width: 225, height: 226 },
  { image: portrait05, width: 234, height: 218, rotate: -135 },
  { image: portrait06, width: 249, height: 242 },
  { image: portrait07, width: 225, height: 214 },
  { image: portrait08, width: 225, height: 203, rotate: -126.04 },
  { image: portrait09, width: 208, height: 214 },
  { image: portrait10, width: 220, height: 195, rotate: 165 },
  { image: portrait11, width: 209, height: 200 },
  { image: portrait12, width: 192, height: 185 },
  { image: portrait13, width: 211, height: 197 },
  { image: portrait14, width: 200, height: 206 },
  { image: portrait15, width: 230, height: 206 },
  { image: portrait16, width: 212, height: 218, rotate: 4.85 },
  { image: portrait17, width: 208, height: 233 },
  { image: portrait18, width: 237, height: 185, rotate: -90 },
  { image: portrait19, width: 198, height: 208, rotate: -30 },
  { image: portrait20, width: 219, height: 217 },
];

function getOrbitPosition(angle: number, orbitSize: OrbitSize) {
  const x = Math.cos(angle) * orbitSize.width * HORIZONTAL_RADIUS;
  const y = Math.sin(angle) * orbitSize.height * VERTICAL_RADIUS;

  return {
    x: x * Math.cos(ORBIT_TILT_RADIANS) - y * Math.sin(ORBIT_TILT_RADIANS),
    y: x * Math.sin(ORBIT_TILT_RADIANS) + y * Math.cos(ORBIT_TILT_RADIANS),
  };
}

function OrbitingPortrait({
  portrait,
  index,
  orbitSize,
  time,
  cursorX,
  cursorY,
  reduceMotion,
}: {
  portrait: Portrait;
  index: number;
  orbitSize: OrbitSize;
  time: MotionValue<number>;
  cursorX: MotionValue<number>;
  cursorY: MotionValue<number>;
  reduceMotion: boolean | null;
}) {
  const startingAngle = (index / PORTRAITS.length) * FULL_CIRCLE - Math.PI / 2;
  const x = useTransform([time, cursorX], ([latestTime, latestCursorX]) => {
    const angle =
      startingAngle - (Number(latestTime) / ORBIT_DURATION_MS) * FULL_CIRCLE;

    return getOrbitPosition(angle, orbitSize).x + Number(latestCursorX);
  });
  const y = useTransform([time, cursorY], ([latestTime, latestCursorY]) => {
    const angle =
      startingAngle - (Number(latestTime) / ORBIT_DURATION_MS) * FULL_CIRCLE;

    return getOrbitPosition(angle, orbitSize).y + Number(latestCursorY);
  });
  const zIndex = useTransform(y, (latestY) =>
    Math.round(latestY + orbitSize.height),
  );
  const restingPosition = getOrbitPosition(startingAngle, orbitSize);

  return (
    <motion.div
      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 will-change-transform"
      style={{
        width: portrait.width,
        height: portrait.height,
        x: reduceMotion ? restingPosition.x : x,
        y: reduceMotion ? restingPosition.y : y,
        zIndex,
      }}
    >
      <Image
        src={portrait.image}
        alt=""
        sizes={`${portrait.width}px`}
        className="size-full max-w-none object-contain"
        style={{ transform: `rotate(${portrait.rotate ?? 0}deg)` }}
      />
    </motion.div>
  );
}

export function BelongingPortraitOrbit() {
  const orbitRef = useRef<HTMLDivElement>(null);
  const [orbitSize, setOrbitSize] = useState<OrbitSize>({
    width: 0,
    height: 0,
  });
  const reduceMotion = useReducedMotion();
  const cursorXTarget = useMotionValue(0);
  const cursorYTarget = useMotionValue(0);
  const cursorX = useSpring(cursorXTarget, {
    stiffness: 45,
    damping: 20,
    mass: 0.8,
  });
  const cursorY = useSpring(cursorYTarget, {
    stiffness: 45,
    damping: 20,
    mass: 0.8,
  });
  const time = useTime();

  useEffect(() => {
    const orbit = orbitRef.current;
    if (!orbit) return;

    const updateSize = () => {
      const { width, height } = orbit.getBoundingClientRect();
      setOrbitSize({ width, height });
    };

    updateSize();
    const resizeObserver = new ResizeObserver(updateSize);
    resizeObserver.observe(orbit);

    return () => resizeObserver.disconnect();
  }, []);

  useEffect(() => {
    if (reduceMotion) {
      cursorXTarget.set(0);
      cursorYTarget.set(0);
      return;
    }

    const updateCursorPosition = (event: PointerEvent) => {
      const orbit = orbitRef.current;
      if (!orbit) return;

      const bounds = orbit.getBoundingClientRect();
      const isInsideSection =
        event.clientX >= bounds.left &&
        event.clientX <= bounds.right &&
        event.clientY >= bounds.top &&
        event.clientY <= bounds.bottom;

      if (!isInsideSection) {
        cursorXTarget.set(0);
        cursorYTarget.set(0);
        return;
      }

      const horizontalPosition =
        (event.clientX - (bounds.left + bounds.width / 2)) / (bounds.width / 2);
      const verticalPosition =
        (event.clientY - (bounds.top + bounds.height / 2)) /
        (bounds.height / 2);

      cursorXTarget.set(horizontalPosition * 18);
      cursorYTarget.set(verticalPosition * 12);
    };

    const resetCursorPosition = () => {
      cursorXTarget.set(0);
      cursorYTarget.set(0);
    };

    window.addEventListener("pointermove", updateCursorPosition, {
      passive: true,
    });
    window.addEventListener("blur", resetCursorPosition);

    return () => {
      window.removeEventListener("pointermove", updateCursorPosition);
      window.removeEventListener("blur", resetCursorPosition);
    };
  }, [cursorXTarget, cursorYTarget, reduceMotion]);

  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0">
      <div
        ref={orbitRef}
        className="absolute top-0 left-1/2 h-full w-[1440px] -translate-x-1/2"
      >
        {PORTRAITS.map((portrait, index) => (
          <OrbitingPortrait
            key={index}
            portrait={portrait}
            index={index}
            orbitSize={orbitSize}
            time={time}
            cursorX={cursorX}
            cursorY={cursorY}
            reduceMotion={reduceMotion}
          />
        ))}
      </div>
    </div>
  );
}
