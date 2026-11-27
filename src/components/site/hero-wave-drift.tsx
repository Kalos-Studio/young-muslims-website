"use client";

import { useMotionValueEvent, useScroll } from "motion/react";
import { type ReactNode, useLayoutEffect, useRef } from "react";

import { REDUCED_MOTION } from "@/lib/shape-motion";

/**
 * The drifting front of a hero's wave (HeroWaveBand): its
 * Warm Snow layer, below the band's pale edge, moves vertically as the
 * wave scrolls past (a parallax), written straight to translate3d on this
 * one layer. The drift is a share of the band's own height
 * (`--hero-wave-drift-share`), so it scales with the wave on every screen.
 *
 * It only ever rises from the band's Figma place, never sinks below it:
 * the full drift above it as the wave enters the viewport, settling to the
 * Figma place as it leaves (the end of the hand-off). The pale edge dips to
 * 98% of the band at its lowest, so any drift down would push the pale
 * shape past the band's foot, where the band clips it flat against the
 * section's own background (a seam, the shape seeming to slide under the
 * section); rising, the pale edge stays inside the band at every scroll
 * position. The drift is under the band's thinnest point, so it never
 * reaches the photo's edge above either. Under reduced motion it rests at
 * the Figma place.
 */
export function HeroWaveDrift({
  className,
  children,
}: {
  className: string;
  children: ReactNode;
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
    const y = -(1 - Math.min(1, Math.max(0, progress))) * drift;
    layer.style.transform = `translate3d(0, ${y.toFixed(1)}px, 0)`;
  };

  useLayoutEffect(() => {
    const layer = ref.current;
    const band = layer?.parentElement;
    if (!layer || !band || window.matchMedia(REDUCED_MOTION).matches) return;
    const measure = () => {
      const share = Number.parseFloat(
        getComputedStyle(document.documentElement).getPropertyValue(
          "--hero-wave-drift-share",
        ),
      );
      driftRef.current = band.offsetHeight * (Number.isNaN(share) ? 0 : share);
      apply(scrollYProgress.get());
    };
    measure();
    window.addEventListener("resize", measure);
    return () => {
      window.removeEventListener("resize", measure);
      driftRef.current = null;
      layer.style.transform = "";
    };
  }, [scrollYProgress]);

  useMotionValueEvent(scrollYProgress, "change", apply);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
