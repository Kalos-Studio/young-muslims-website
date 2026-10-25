"use client";

import { useEffect, useRef } from "react";
import { useScroll } from "motion/react";

/** Draw the connection at the viewport midpoint, in either scroll direction. */
export function ScrollConnector({
  branch = false,
  inverse = false,
  arrow = true,
}: {
  branch?: boolean;
  inverse?: boolean;
  arrow?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start center", "end center"],
  });

  useEffect(() => {
    const paths = Array.from(
      ref.current?.querySelectorAll<SVGPathElement>("[data-draw]") ?? [],
    );

    function draw(progress: number) {
      paths.forEach((path) => {
        const start = Number(path.dataset.start);
        const end = Number(path.dataset.end);
        const drawn = Math.max(
          0,
          Math.min(1, (progress - start) / (end - start)),
        );
        // SVG geometry attributes keep the theme's color and stroke unchanged.
        path.setAttribute("stroke-dashoffset", String(1 - drawn));
      });
    }

    draw(scrollYProgress.get());
    return scrollYProgress.on("change", draw);
  }, [scrollYProgress, branch, arrow]);

  const segments = branch
    ? [
        { d: "M50 0V32", start: 0, end: 0.5 },
        { d: "M50 32H0", start: 0.5, end: 0.7 },
        { d: "M50 32H100", start: 0.5, end: 0.7 },
        { d: "M0 32V64", start: 0.7, end: 1 },
        { d: "M100 32V64", start: 0.7, end: 1 },
      ]
    : [{ d: "M50 0V80", start: 0, end: 1 }];

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className={`relative mx-auto ${branch ? "mt-8 h-32 w-1/2" : "h-32 w-8"} ${inverse ? "text-current" : "text-accent"}`}
    >
      <svg
        viewBox={`0 0 100 ${branch ? 64 : 80}`}
        preserveAspectRatio="none"
        className="h-full w-full overflow-visible fill-none stroke-current stroke-3"
      >
        <g className="opacity-20 motion-reduce:hidden">
          {segments.map(({ d }) => (
            <path key={d} d={d} vectorEffect="non-scaling-stroke" />
          ))}
        </g>
        <g className="motion-reduce:hidden">
          {segments.map(({ d, start, end }) => (
            <path
              key={d}
              d={d}
              data-draw
              data-start={start}
              data-end={end}
              pathLength="1"
              strokeDasharray="1"
              strokeDashoffset="1"
              vectorEffect="non-scaling-stroke"
            />
          ))}
        </g>
        <g className="hidden motion-reduce:block">
          {segments.map(({ d }) => (
            <path key={d} d={d} vectorEffect="non-scaling-stroke" />
          ))}
        </g>
      </svg>
      {(branch || arrow) && (
        <div className="absolute inset-x-0 bottom-0">
          {Array.from({ length: branch ? 2 : 1 }, (_, index) => (
            <svg
              key={index}
              viewBox="0 0 16 16"
              className={`absolute bottom-0 h-8 w-8 translate-y-1/2 overflow-visible fill-none stroke-current stroke-3 ${branch ? (index === 0 ? "left-0 -translate-x-1/2" : "right-0 translate-x-1/2") : "left-1/2 -translate-x-1/2"}`}
            >
              <path
                d="M2 2L8 8L14 2"
                pathLength="1"
                strokeDasharray="1"
                strokeDashoffset="1"
                data-draw
                data-start="0.9"
                data-end="1"
                className="motion-reduce:hidden"
              />
              <path d="M2 2L8 8L14 2" className="hidden motion-reduce:block" />
            </svg>
          ))}
        </div>
      )}
    </div>
  );
}
