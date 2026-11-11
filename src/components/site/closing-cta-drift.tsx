"use client";

import { useMotionValueEvent, useScroll } from "motion/react";
import { type ReactNode, useLayoutEffect, useRef } from "react";

import { cn } from "@/lib/utils";

import { readLengthToken } from "@/lib/motion-tokens";
import { REDUCED_MOTION } from "@/lib/shape-motion";

/**
 * A closing CTA layer that drifts vertically as the section scrolls past:
 * from half its drift (`token`) up, the section's top entering the
 * viewport, to half of it down, its foot leaving; written straight to
 * translate3d on this one layer. Used for the photo (which moves inside the
 * fixed shape) and for the wavy foot's cap. Under reduced motion it stays
 * at its place.
 */
export function ClosingCtaDrift({
  token,
  fallback,
  className,
  children,
}: {
  token: string;
  fallback: number;
  className: string;
  children?: ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const driftRef = useRef<number | null>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const apply = (progress: number) => {
    const drift = driftRef.current;
    const layer = ref.current;
    if (drift === null || !layer) return;
    const y = (Math.min(1, Math.max(0, progress)) - 0.5) * drift;
    layer.style.transform = `translate3d(0, ${y.toFixed(1)}px, 0)`;
  };

  useLayoutEffect(() => {
    const layer = ref.current;
    if (!layer || window.matchMedia(REDUCED_MOTION).matches) return;
    const measure = () => {
      driftRef.current = readLengthToken(token, fallback);
      apply(scrollYProgress.get());
    };
    measure();
    window.addEventListener("resize", measure);
    return () => {
      window.removeEventListener("resize", measure);
      driftRef.current = null;
      layer.style.transform = "";
    };
  }, [scrollYProgress, token, fallback]);

  useMotionValueEvent(scrollYProgress, "change", apply);

  return (
    <div ref={ref} className={cn(className)}>
      {children}
    </div>
  );
}
