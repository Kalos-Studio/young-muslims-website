"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion, useTime, useTransform } from "motion/react";

import { PersonOutline } from "@/components/wireframe/person-outline";
import { cn } from "@/lib/utils";

const PORTRAITS = [
  { size: "7rem", tone: "border-brand-royal" },
  { size: "4.5rem", tone: "border-brand-jade" },
  { size: "9rem", tone: "border-landing-cyan" },
  { size: "5rem", tone: "border-brand-royal" },
  { size: "6.5rem", tone: "border-brand-jade" },
  { size: "4rem", tone: "border-landing-cyan" },
  { size: "8rem", tone: "border-brand-royal" },
  { size: "5.5rem", tone: "border-brand-jade" },
  { size: "6.5rem", tone: "border-landing-cyan" },
  { size: "4.5rem", tone: "border-brand-royal" },
  { size: "8.5rem", tone: "border-brand-jade" },
  { size: "5rem", tone: "border-landing-cyan" },
  { size: "7.5rem", tone: "border-brand-royal" },
  { size: "4rem", tone: "border-brand-jade" },
  { size: "8rem", tone: "border-landing-cyan" },
  { size: "5.5rem", tone: "border-brand-royal" },
] as const;

const FULL_CIRCLE = Math.PI * 2;
const ORBIT_DURATION_MS = 48_000;
const HORIZONTAL_RADIUS = 0.62;
const VERTICAL_RADIUS = 0.3;
const ORBIT_TILT = (-14 * Math.PI) / 180;

type OrbitSize = {
  width: number;
  height: number;
};

function getOrbitPosition(angle: number, orbitSize: OrbitSize) {
  const ellipseX = Math.cos(angle) * orbitSize.width * HORIZONTAL_RADIUS;
  const ellipseY = Math.sin(angle) * orbitSize.height * VERTICAL_RADIUS;

  return {
    x: ellipseX * Math.cos(ORBIT_TILT) - ellipseY * Math.sin(ORBIT_TILT),
    y: ellipseX * Math.sin(ORBIT_TILT) + ellipseY * Math.cos(ORBIT_TILT),
  };
}

function OrbitingPortrait({
  portrait,
  index,
  orbitSize,
  reduceMotion,
}: {
  portrait: (typeof PORTRAITS)[number];
  index: number;
  orbitSize: OrbitSize;
  reduceMotion: boolean | null;
}) {
  const time = useTime();
  const startingAngle = (index / PORTRAITS.length) * FULL_CIRCLE - Math.PI / 2;
  const x = useTransform(time, (latest) => {
    const angle = startingAngle + (latest / ORBIT_DURATION_MS) * FULL_CIRCLE;
    return getOrbitPosition(angle, orbitSize).x;
  });
  const y = useTransform(time, (latest) => {
    const angle = startingAngle + (latest / ORBIT_DURATION_MS) * FULL_CIRCLE;
    return getOrbitPosition(angle, orbitSize).y;
  });

  const restingPosition = getOrbitPosition(startingAngle, orbitSize);

  return (
    <motion.div
      aria-hidden
      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 will-change-transform"
      style={{
        width: portrait.size,
        height: portrait.size,
        x: reduceMotion ? restingPosition.x : x,
        y: reduceMotion ? restingPosition.y : y,
      }}
    >
      <div
        className={cn(
          "flex size-full rotate-6 items-center justify-center rounded-full border-4 bg-muted text-muted-foreground",
          portrait.tone,
        )}
      >
        <PersonOutline className="h-1/2 w-1/2" />
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

  return (
    <div
      ref={orbitRef}
      className="pointer-events-none absolute inset-0"
      aria-label="Sixteen portrait image placeholders moving continuously around the section title"
    >
      {PORTRAITS.map((portrait, index) => (
        <OrbitingPortrait
          key={index}
          portrait={portrait}
          index={index}
          orbitSize={orbitSize}
          reduceMotion={reduceMotion}
        />
      ))}
    </div>
  );
}
