import type { ReactNode } from "react";
import Image, { type StaticImageData } from "next/image";

/** Shared image-led opening, using the existing Support hero type and spacing. */
export function PhotoPageHero({
  image,
  imageAlt,
  title,
  description,
  nextSurface,
}: {
  image: StaticImageData;
  imageAlt: string;
  title: ReactNode;
  description: string;
  nextSurface: "primary" | "muted";
}) {
  return (
    <section
      className="relative isolate overflow-hidden bg-primary text-primary-foreground"
      data-header-theme="dark"
    >
      <Image
        src={image}
        alt={imageAlt}
        fill
        preload
        sizes="100vw"
        className="-z-20 object-cover"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-primary/60"
      />
      <div className="mx-auto flex min-h-screen max-w-screen-2xl flex-col items-center justify-center px-8 py-40 text-center md:px-20 lg:py-60">
        <h1 className="max-w-5xl font-display text-mobile-display uppercase lg:text-display">
          {title}
        </h1>
        <p className="mt-6 max-w-2xl text-nav font-semibold lg:text-lead">
          {description}
        </p>
      </div>
      <svg
        aria-hidden="true"
        viewBox="0 0 1440 170"
        preserveAspectRatio="none"
        className={`pointer-events-none absolute inset-x-0 bottom-0 h-20 w-full lg:h-40 ${nextSurface === "primary" ? "text-primary" : "text-muted"}`}
      >
        {/* Same curved profile as the NeighborNets hero. */}
        <path
          d="M0 32C345 119 1028 126 1440 78V170H0V32Z"
          fill="currentColor"
        />
      </svg>
    </section>
  );
}
