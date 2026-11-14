"use client";

import { useMotionValueEvent, useScroll } from "motion/react";
import { type ReactNode, useLayoutEffect, useRef } from "react";

import { cn } from "@/lib/utils";

import { readLengthToken } from "@/lib/motion-tokens";
import { REDUCED_MOTION } from "@/lib/shape-motion";

/**
 * A layer that drifts vertically as it scrolls past (a parallax): from half
 * its drift (`token`, a length token) up, its top entering the viewport, to
 * half of it down, its foot leaving; written straight to translate3d on
 * this one layer (composited). A photo drifting inside a fixed shape is
 * sized half its drift larger above and below, so no edge ever shows.
 * Used by the closing CTA (its photo and wavy foot), the story pages (the
 * hero photo and the watermark) and the About FAQ (its background shape).
 * Under reduced motion it stays at its place.
 */
export function ScrollDrift({
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
