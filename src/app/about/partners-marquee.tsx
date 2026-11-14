"use client";

import { useEffect, useRef, type ReactNode } from "react";

import { cn } from "@/lib/utils";

/**
 * The About partners' logo row: a full-bleed window over a track of the
 * row's copies, which loops on its own (a CSS animation, in the track's
 * class: partners-section.module.css), the NeighborNets photo marquees'
 * mechanic. This only pauses the loop while the row is off screen (an
 * observer sets `data-paused`), so it costs nothing out of view. Under
 * reduced motion the CSS never animates, and this changes nothing visible.
 */
export function PartnersMarquee({
  label,
  className,
  trackClassName,
  children,
}: {
  label: string;
  className?: string;
  trackClassName: string;
  children: ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const row = ref.current;
    if (!row) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) delete row.dataset.paused;
      else row.dataset.paused = "";
    });
    observer.observe(row);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      role="group"
      aria-label={label}
      data-paused=""
      className={cn("overflow-clip", className)}
    >
      <div className={cn("flex w-max", trackClassName)}>{children}</div>
    </div>
  );
}
