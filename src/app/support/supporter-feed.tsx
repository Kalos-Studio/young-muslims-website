"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

export function SupporterFeed({ children }: { children: ReactNode }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    trackRef.current?.getAnimations().forEach((animation) => {
      if (paused) animation.pause();
      else animation.play();
    });
  }, [paused]);

  return (
    <section aria-label="Sample supporters" className="py-8">
      <div className="flex items-center justify-between gap-4 px-6 md:px-20">
        <p id="supporter-feed-label" className="text-nav text-muted-foreground">
          Supporter preview: sample data
        </p>
        <button
          type="button"
          aria-controls="supporter-feed"
          aria-pressed={paused}
          onClick={() => setPaused((value) => !value)}
          className="shrink-0 rounded-pill border border-border bg-background px-6 py-4 text-nav font-bold text-foreground hover:bg-muted focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring motion-reduce:hidden"
        >
          {paused ? "Resume scrolling" : "Pause scrolling"}
        </button>
      </div>
      <div
        id="supporter-feed"
        aria-labelledby="supporter-feed-label"
        tabIndex={0}
        className="mt-4 overflow-hidden overscroll-x-contain py-4 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ring motion-reduce:overflow-x-auto"
      >
        {/* Four equal groups match the existing marquee's quarter-width loop. */}
        <div
          ref={trackRef}
          className="nn-image-marquee-track nn-explainer-marquee-track flex w-max"
        >
          {[0, 1, 2, 3].map((copy) => (
            <ul
              key={copy}
              aria-hidden={copy > 0 ? true : undefined}
              aria-label={copy === 0 ? "Sample donations" : undefined}
              className={`flex shrink-0 gap-8 pr-8 ${copy > 0 ? "motion-reduce:hidden" : ""}`}
            >
              {children}
            </ul>
          ))}
        </div>
      </div>
    </section>
  );
}
