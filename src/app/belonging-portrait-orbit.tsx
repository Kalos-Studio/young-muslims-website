"use client";

// Motion's useTransform overloads have different internal hook layouts.
// Remount during animation edits instead of preserving incompatible hook state.
// @refresh reset

import Image, { type StaticImageData } from "next/image";
import { useEffect, useRef, useState, type ReactNode } from "react";
import {
  type MotionValue,
  animate,
  motion,
  useInView,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
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
  entryProgress,
  scrollYProgress,
  entryScrollProgress,
  rotationEnabled,
  cursorX,
  cursorY,
  reduceMotion,
}: {
  portrait: Portrait;
  index: number;
  orbitSize: OrbitSize;
  entryProgress: MotionValue<number>;
  scrollYProgress: MotionValue<number>;
  entryScrollProgress: MotionValue<number>;
  rotationEnabled: MotionValue<number>;
  cursorX: MotionValue<number>;
  cursorY: MotionValue<number>;
  reduceMotion: boolean | null;
}) {
  const startingAngle = -Math.PI / 4 - (index / PORTRAITS.length) * FULL_CIRCLE;
  const entryStart = index * 0.023;
  const entryEnd = 0.54 + entryStart;
  const position = useTransform(() => {
    const value = entryProgress.get();
    const entry = Math.max(
      0,
      Math.min(1, (value - entryStart) / (entryEnd - entryStart)),
    );
    const easedEntry = 1 - Math.pow(1 - entry, 3);
    // Read scroll values on every render so Motion subscribes to them before
    // the entrance finishes; only apply their rotation after the handoff.
    const scrollDelta = scrollYProgress.get() - entryScrollProgress.get();
    const scrollRotation = rotationEnabled.get()
      ? scrollDelta * FULL_CIRCLE * 0.65
      : 0;
    const angle =
      -Math.PI / 4 +
      (startingAngle + Math.PI / 4) * easedEntry -
      scrollRotation;
    const orbit = getOrbitPosition(angle, orbitSize);
    return {
      x: orbit.x * easedEntry + orbitSize.width * 0.8 * (1 - easedEntry),
      y: orbit.y * easedEntry - orbitSize.height * 0.65 * (1 - easedEntry),
    };
  });
  const x = useTransform(() => position.get().x + cursorX.get());
  const y = useTransform(() => position.get().y + cursorY.get());
  const opacity = useTransform(
    entryProgress,
    [entryStart, entryStart + 0.15],
    [0, 1],
  );
  const zIndex = useTransform(y, (latestY) =>
    Math.round(latestY + orbitSize.height),
  );
  const restingPosition = getOrbitPosition(startingAngle, orbitSize);

  return (
    <motion.div
      className="absolute top-1/2 left-1/2"
      style={{
        width: portrait.width,
        height: portrait.height,
        marginLeft: -portrait.width / 2,
        marginTop: -portrait.height / 2,
        opacity: reduceMotion ? 1 : opacity,
        x: reduceMotion ? restingPosition.x : x,
        y: reduceMotion ? restingPosition.y : y,
        zIndex,
      }}
    >
      <div className="size-full scale-[0.62] md:scale-100">
        <Image
          src={portrait.image}
          alt=""
          sizes={`${portrait.width}px`}
          className="size-full max-w-none object-contain"
          style={{ transform: `rotate(${portrait.rotate ?? 0}deg)` }}
        />
      </div>
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
  const { scrollYProgress } = useScroll({
    target: orbitRef,
    offset: ["start end", "end start"],
  });
  const entryProgress = useMotionValue(0);
  const entryScrollProgress = useMotionValue(0);
  const rotationEnabled = useMotionValue(0);
  const entryStarted = useRef(false);
  const shouldReduceMotion = reduceMotion === true;
  const orbitHasEnteredView = useInView(orbitRef, {
    once: true,
    margin: "0px 0px -15% 0px",
  });
  const orbitIsVisible = useInView(orbitRef, { margin: "200px 0px" });
  const orbitIsSized = orbitSize.width > 0;

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
    if (!orbitHasEnteredView || !orbitIsSized || entryStarted.current) return;
    entryStarted.current = true;

    if (shouldReduceMotion) {
      entryProgress.set(1);
      return;
    }

    const controls = animate(entryProgress, 1, {
      duration: 1.7,
      ease: [0.22, 1, 0.36, 1],
      onComplete: () => {
        entryScrollProgress.set(scrollYProgress.get());
        rotationEnabled.set(1);
      },
    });

    return () => controls.stop();
  }, [
    entryProgress,
    entryScrollProgress,
    orbitHasEnteredView,
    orbitIsSized,
    shouldReduceMotion,
    rotationEnabled,
    scrollYProgress,
  ]);

  useEffect(() => {
    if (reduceMotion || !orbitIsVisible) {
      cursorXTarget.set(0);
      cursorYTarget.set(0);
      return;
    }

    const finePointerQuery = window.matchMedia(
      "(hover: hover) and (pointer: fine)",
    );

    if (!finePointerQuery.matches) return;

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
  }, [cursorXTarget, cursorYTarget, orbitIsVisible, reduceMotion]);

  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0">
      <div
        ref={orbitRef}
        className="absolute top-0 left-[calc(50%+41.45px)] h-full w-[900px] -translate-x-1/2 -translate-y-[14px] md:left-1/2 md:w-[1440px] md:translate-y-0"
      >
        {PORTRAITS.map((portrait, index) => (
          <OrbitingPortrait
            key={index}
            portrait={portrait}
            index={index}
            orbitSize={orbitSize}
            entryProgress={entryProgress}
            scrollYProgress={scrollYProgress}
            entryScrollProgress={entryScrollProgress}
            rotationEnabled={rotationEnabled}
            cursorX={cursorX}
            cursorY={cursorY}
            reduceMotion={reduceMotion}
          />
        ))}
      </div>
    </div>
  );
}

export function BelongingCopy({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 95%", "start 60%"],
  });
  const opacity = useTransform(scrollYProgress, [0, 1], [0, 1]);
  const y = useTransform(scrollYProgress, [0, 1], [24, 0]);

  return (
    <div
      ref={ref}
      className="absolute top-[487px] left-1/2 z-20 w-[290px] -translate-x-1/2 text-center md:top-[743px] md:w-full md:max-w-[784px]"
    >
      <motion.div style={reduceMotion ? undefined : { opacity, y }}>
        {children}
      </motion.div>
    </div>
  );
}
