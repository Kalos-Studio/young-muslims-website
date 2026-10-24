"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

import type { BlogPost } from "@/lib/blog";

function ArrowIcon({ direction }: { direction: "left" | "right" }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className={`size-6 ${direction === "left" ? "rotate-180" : ""}`}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <path d="M4 12h15m-6-6 6 6-6 6" />
    </svg>
  );
}

export function FeaturedBlogCarousel({ slides }: { slides: BlogPost[] }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [transition, setTransition] = useState<{
    to: number;
    direction: -1 | 1;
    started: boolean;
  } | null>(null);

  useEffect(() => {
    if (!transition || transition.started) return;
    let secondFrame = 0;
    const firstFrame = requestAnimationFrame(() => {
      secondFrame = requestAnimationFrame(() => {
        setTransition((current) => current && { ...current, started: true });
      });
    });
    return () => {
      cancelAnimationFrame(firstFrame);
      cancelAnimationFrame(secondFrame);
    };
  }, [transition]);

  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    function finishWithoutMotion() {
      if (preference.matches && transition) {
        setActiveIndex(transition.to);
        setTransition(null);
      }
    }
    preference.addEventListener("change", finishWithoutMotion);
    return () => preference.removeEventListener("change", finishWithoutMotion);
  }, [transition]);

  function goToSlide(to: number, direction: -1 | 1, keyboard: boolean) {
    if (transition || to === activeIndex) return;
    if (
      keyboard ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      setActiveIndex(to);
      return;
    }
    setTransition({ to, direction, started: false });
  }

  function moveSlide(direction: -1 | 1, keyboard: boolean) {
    goToSlide(
      (activeIndex + direction + slides.length) % slides.length,
      direction,
      keyboard,
    );
  }

  return (
    <section
      data-header-theme="dark"
      aria-label="Featured blog resources"
      aria-roledescription="carousel"
      className="relative isolate grid overflow-hidden bg-foreground text-background"
    >
      {slides.map((slide, index) => {
        const active = index === activeIndex;
        const incoming = index === transition?.to;
        let position = "translate-x-0";
        if (transition) {
          if (active && transition.started)
            position =
              transition.direction === 1
                ? "-translate-x-full"
                : "translate-x-full";
          if (incoming && !transition.started)
            position =
              transition.direction === 1
                ? "translate-x-full"
                : "-translate-x-full";
        }
        return (
          <div
            key={slide.id}
            aria-hidden={!active}
            inert={!active}
            onTransitionEnd={(event) => {
              if (event.target !== event.currentTarget || !transition?.started)
                return;
              setActiveIndex(transition.to);
              setTransition(null);
            }}
            className={`relative col-start-1 row-start-1 flex min-h-128 w-full min-w-0 items-end ${active || incoming ? "visible" : "invisible"} ${transition?.started ? "transition-transform duration-300 ease-in-out motion-reduce:transition-none" : "transition-none"} ${position}`}
          >
            <Image
              src={slide.heroImage ?? slide.image}
              alt=""
              fill
              preload={index === 0}
              sizes="100vw"
              className="object-cover"
            />
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/30 to-transparent"
            />

            <div className="relative mx-auto w-full max-w-7xl px-8 pt-32 pb-24 md:px-20">
              <div className="max-w-4xl">
                <span className="inline-flex bg-foreground/40 px-2 py-1 text-nav font-semibold text-background backdrop-blur-sm">
                  {slide.category}
                </span>
                <h2 className="mt-3 font-display text-mobile-display text-background uppercase md:text-display">
                  {slide.title}
                </h2>
                <p className="mt-4 line-clamp-2 max-w-2xl text-body font-medium text-background md:text-lead">
                  {slide.excerpt}
                </p>
                <Link
                  href={`/blog/${slide.id}`}
                  className="group mt-6 inline-flex items-center gap-3 border border-background px-6 py-4 text-nav font-bold text-background transition-colors outline-none hover:bg-background hover:text-foreground focus-visible:ring-2 focus-visible:ring-background focus-visible:ring-offset-2 focus-visible:ring-offset-foreground motion-reduce:transition-none"
                >
                  Read article
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 24 24"
                    className="size-5 transition-transform duration-200 group-hover:translate-x-1 group-focus-visible:translate-x-1 motion-reduce:transition-none"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                  >
                    <path d="M4 12h15m-6-6 6 6-6 6" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        );
      })}
      <p className="sr-only" aria-live="polite" aria-atomic="true">
        {slides[activeIndex].title}
      </p>
      <div className="pointer-events-none absolute inset-x-0 bottom-8 mx-auto w-full max-w-7xl px-8 md:px-20">
        <div
          className="pointer-events-auto flex gap-2"
          aria-label={`Slide ${activeIndex + 1} of ${slides.length}`}
        >
          {slides.map((item, index) => (
            <button
              key={item.id}
              type="button"
              aria-label={`Show featured resource ${index + 1}: ${item.title}`}
              aria-pressed={index === activeIndex}
              onClick={(event) =>
                goToSlide(
                  index,
                  index > activeIndex ? 1 : -1,
                  event.detail === 0,
                )
              }
              className={`size-4 border border-background transition-colors outline-none hover:bg-background/60 focus-visible:ring-2 focus-visible:ring-background focus-visible:ring-offset-2 focus-visible:ring-offset-foreground motion-reduce:transition-none ${index === activeIndex ? "bg-background" : "bg-transparent"}`}
            />
          ))}
        </div>
      </div>

      <button
        type="button"
        aria-label="Previous featured resource"
        onClick={(event) => moveSlide(-1, event.detail === 0)}
        className="absolute right-20 bottom-4 z-20 grid size-12 place-items-center text-background transition-colors hover:bg-foreground/40 focus-visible:ring-2 focus-visible:ring-background focus-visible:outline-none motion-reduce:transition-none md:top-1/2 md:right-auto md:bottom-auto md:left-2 md:size-16 md:-translate-y-1/2"
      >
        <ArrowIcon direction="left" />
      </button>
      <button
        type="button"
        aria-label="Next featured resource"
        onClick={(event) => moveSlide(1, event.detail === 0)}
        className="absolute right-6 bottom-4 z-20 grid size-12 place-items-center text-background transition-colors hover:bg-foreground/40 focus-visible:ring-2 focus-visible:ring-background focus-visible:outline-none motion-reduce:transition-none md:top-1/2 md:right-2 md:bottom-auto md:size-16 md:-translate-y-1/2"
      >
        <ArrowIcon direction="right" />
      </button>
    </section>
  );
}
