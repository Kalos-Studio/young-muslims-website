"use client";

import type { CSSProperties } from "react";
import Image, { type StaticImageData } from "next/image";
import Link from "next/link";
import { useMemo, useRef, useState } from "react";
import { motion, useInView, useReducedMotion } from "motion/react";

import brooklynPhoto from "../../design-assets/figma/landing-2026/chapter-cities/brooklyn.jpg";
import brooklynShape from "../../design-assets/figma/landing-2026/chapter-cities/brooklyn-shape.svg";
import friscoPhoto from "../../design-assets/figma/landing-2026/chapter-cities/frisco.jpg";
import friscoShape from "../../design-assets/figma/landing-2026/chapter-cities/frisco-shape.svg";
import houstonPhoto from "../../design-assets/figma/landing-2026/chapter-cities/houston-255-102.jpg";
import houstonShape from "../../design-assets/figma/landing-2026/chapter-cities/houston-shape.svg";
import newarkPhoto from "../../design-assets/figma/landing-2026/chapter-cities/newark.jpg";
import newarkShape from "../../design-assets/figma/landing-2026/chapter-cities/newark-shape.svg";
import stamfordPhoto from "../../design-assets/figma/landing-2026/chapter-cities/stamford.jpg";
import stamfordShape from "../../design-assets/figma/landing-2026/chapter-cities/stamford-shape.svg";
import suwaneePhoto from "../../design-assets/figma/landing-2026/chapter-cities/suwanee.jpg";
import suwaneeShape from "../../design-assets/figma/landing-2026/chapter-cities/suwanee-shape.svg";
import tampaPhoto from "../../design-assets/figma/landing-2026/chapter-cities/tampa.jpg";
import tampaShape from "../../design-assets/figma/landing-2026/chapter-cities/tampa-shape.svg";
import chapterWave from "../../design-assets/figma/landing-2026/new-sections/chapter-wave-top.svg";

type CityKey =
  | "houston"
  | "stamford"
  | "suwanee"
  | "tampa"
  | "brooklyn"
  | "newark"
  | "frisco";

type City = {
  key: CityKey;
  name: string;
  state: string;
  photo: StaticImageData;
  shape: string;
  selectedClassName: string;
  photoClassName: string;
  shapeWidth: number;
  shapeRotation: number;
};

const CITIES: City[] = [
  {
    key: "houston",
    name: "Houston",
    state: "Texas",
    photo: houstonPhoto,
    shape: houstonShape,
    selectedClassName: "text-sisters-brass",
    photoClassName: "size-full object-cover object-bottom",
    shapeWidth: 768,
    shapeRotation: -29.9,
  },
  {
    key: "stamford",
    name: "Stamford",
    state: "Connecticut",
    photo: stamfordPhoto,
    shape: stamfordShape,
    selectedClassName: "text-brothers-slate",
    photoClassName:
      "absolute top-[-16.25%] left-[-37.74%] h-[116.32%] w-[175.48%] max-w-none",
    shapeWidth: 776,
    shapeRotation: 0,
  },
  {
    key: "suwanee",
    name: "Suwanee",
    state: "Georgia",
    photo: suwaneePhoto,
    shape: suwaneeShape,
    selectedClassName: "text-brand-jade",
    photoClassName:
      "absolute top-[-9.68%] left-[-35.34%] h-[122.16%] w-[143.26%] max-w-none",
    shapeWidth: 855,
    shapeRotation: 0,
  },
  {
    key: "tampa",
    name: "Tampa",
    state: "Florida",
    photo: tampaPhoto,
    shape: tampaShape,
    selectedClassName: "text-brothers-sky",
    photoClassName: "size-full object-cover",
    shapeWidth: 1068,
    shapeRotation: 0,
  },
  {
    key: "brooklyn",
    name: "Brooklyn",
    state: "New York",
    photo: brooklynPhoto,
    shape: brooklynShape,
    selectedClassName: "text-sisters-buttercup",
    photoClassName:
      "absolute top-[-28.85%] left-[-67.34%] h-[149.01%] w-[252.86%] max-w-none",
    shapeWidth: 1066,
    shapeRotation: 0,
  },
  {
    key: "newark",
    name: "Newark",
    state: "New Jersey",
    photo: newarkPhoto,
    shape: newarkShape,
    selectedClassName: "text-brand-royal",
    photoClassName:
      "absolute top-[-26.66%] left-[-66.14%] h-[130.02%] w-[220.72%] max-w-none",
    shapeWidth: 930,
    shapeRotation: 80.96,
  },
  {
    key: "frisco",
    name: "Frisco",
    state: "Texas",
    photo: friscoPhoto,
    shape: friscoShape,
    selectedClassName: "text-sisters-brass",
    photoClassName:
      "absolute top-[-38.74%] left-[-18.6%] h-[181.85%] w-[137.19%] max-w-none",
    shapeWidth: 1051,
    shapeRotation: -90,
  },
];

const CITY_BY_KEY = Object.fromEntries(
  CITIES.map((city) => [city.key, city]),
) as Record<CityKey, City>;

const transition = { duration: 0.48, ease: [0.22, 1, 0.36, 1] } as const;

function CityMedia({
  activeKey,
  reduceMotion,
}: {
  activeKey: CityKey;
  reduceMotion: boolean | null;
}) {
  const activeCity = CITY_BY_KEY[activeKey];
  const shapeTransition = reduceMotion ? { duration: 0 } : transition;

  return (
    <div className="sticky top-[max(5rem,calc(50svh-203.5px))] h-[407px] w-[360px] md:top-[calc(50svh-217.5px)] md:h-[435px] md:w-[384px] lg:top-[calc(50svh-274px)] lg:h-[548px] lg:w-[484px]">
      <div className="pointer-events-none absolute top-1/2 left-1/2 -z-10 size-0">
        {CITIES.map((city) => {
          const isActive = city.key === activeKey;
          const shapeStyle = {
            "--chapter-shape-width": `${city.shapeWidth}px`,
          } as CSSProperties;

          return (
            <motion.div
              key={city.key}
              className="absolute top-1/2 left-1/2 w-[min(var(--chapter-shape-width),170vw)] -translate-x-1/2 -translate-y-1/2"
              style={{ ...shapeStyle, rotate: city.shapeRotation }}
              initial={false}
              animate={{
                opacity: isActive ? 1 : 0,
                scale: isActive ? 1 : 0.92,
              }}
              transition={shapeTransition}
              aria-hidden="true"
            >
              <Image
                src={city.shape}
                alt=""
                className="block h-auto w-full max-w-none"
              />
            </motion.div>
          );
        })}
      </div>

      <div className="relative z-10 size-full overflow-hidden">
        {CITIES.map((city) => {
          const isActive = city.key === activeKey;

          return (
            <motion.div
              key={city.key}
              className="absolute inset-0 overflow-hidden"
              initial={false}
              animate={{
                opacity: isActive ? 1 : 0,
                scale: isActive ? 1 : 1.035,
              }}
              transition={shapeTransition}
              aria-hidden={!isActive}
            >
              <Image
                src={city.photo}
                alt={
                  isActive
                    ? `Young Muslims community members in ${city.name}, ${city.state}`
                    : ""
                }
                sizes="(max-width: 767px) 360px, (max-width: 1023px) 384px, 484px"
                className={city.photoClassName}
                priority={city.key === "houston"}
              />
            </motion.div>
          );
        })}

        <div className="pointer-events-none absolute inset-0 z-10 bg-[linear-gradient(180deg,rgba(191,206,219,0)_9.5%,rgba(23,23,37,0.48)_109.91%)]" />

        <div className="absolute inset-0 z-20 text-center text-brand-pure-white">
          <p className="absolute top-[39.6%] hidden w-full font-display text-[42.86px] uppercase md:block lg:text-stat">
            {activeCity.name}
          </p>
          <p className="absolute top-[58.6%] w-full text-[15px] font-bold tracking-[-0.02em] uppercase md:text-[16px] lg:text-landing-copy">
            {activeCity.state}
          </p>
          <Link
            href="/neighbornets"
            className="absolute top-[66.4%] left-1/2 inline-flex w-[296px] -translate-x-1/2 items-center justify-center border border-brand-warm-snow px-6 py-4 text-nav font-bold text-brand-warm-snow transition-colors hover:bg-brand-warm-snow hover:text-brand-obsidian focus-visible:ring-2 focus-visible:ring-brand-warm-snow focus-visible:ring-offset-2 focus-visible:ring-offset-brand-obsidian focus-visible:outline-none md:top-[67.2%] md:w-auto"
          >
            Visit
          </Link>
        </div>
      </div>
    </div>
  );
}

export function ChapterFinderSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [selectedKey, setSelectedKey] = useState<CityKey>("houston");
  const [previewKey, setPreviewKey] = useState<CityKey | null>(null);
  const reduceMotion = useReducedMotion();
  const shapeHasEntered = useInView(sectionRef, { once: true, amount: 0.25 });
  const activeKey = previewKey ?? selectedKey;
  const activeCity = useMemo(() => CITY_BY_KEY[activeKey], [activeKey]);

  return (
    <section
      ref={sectionRef}
      data-header-theme="dark"
      aria-labelledby="chapter-finder-heading"
      className="relative h-[3790px] w-full overflow-hidden bg-brand-warm-snow md:h-[1943px] lg:h-[2198px]"
    >
      <motion.div
        className="pointer-events-none absolute inset-0"
        initial={false}
        animate={{ y: shapeHasEntered || reduceMotion ? 0 : 180 }}
        transition={
          reduceMotion
            ? { duration: 0 }
            : { duration: 1.1, ease: [0.22, 1, 0.36, 1] }
        }
        aria-hidden="true"
      >
        <div className="absolute top-[-900px] left-1/2 flex h-[5809px] w-[5869px] -translate-x-1/2 items-center justify-center md:top-[-462px] md:h-[2984px] md:w-[3015px] lg:top-[-554px] lg:h-[3418px] lg:w-[3453px] lg:-translate-x-[61%]">
          <div className="rotate-[56.37deg]">
            <Image
              src={chapterWave}
              alt=""
              className="block h-auto w-[4104px] max-w-none md:w-[2108px] lg:w-[2415px]"
            />
          </div>
        </div>
      </motion.div>

      <div className="absolute inset-y-0 left-1/2 w-full max-w-[1440px] -translate-x-1/2">
        <div className="absolute top-[205px] left-8 z-30 w-[296px] text-brand-warm-snow md:top-[181px] md:left-16 md:w-[538px] lg:top-[468px] lg:left-[90px]">
          <h2
            id="chapter-finder-heading"
            className="text-[30px] leading-normal font-extrabold tracking-[-0.02em] md:text-[36px] lg:text-landing-section"
          >
            Let&apos;s find your story.
          </h2>
          <p className="mt-4 text-base font-medium tracking-[-0.02em] md:text-[18px] lg:text-landing-copy">
            There&apos;s a NeighborNet near you. Find it, and just show up,
            someone&apos;s saving you a seat.
          </p>
        </div>

        <div
          className="absolute top-[542px] left-1/2 z-40 flex w-[279px] -translate-x-1/2 flex-col items-center gap-[342px] md:top-[500px] md:left-16 md:translate-x-0 md:items-start md:gap-[100px] lg:top-[688px] lg:left-[97px] lg:gap-[23px]"
          aria-label="Choose a NeighborNet city"
        >
          {CITIES.map((city) => {
            const isActive = city.key === activeKey;
            const isSelected = city.key === selectedKey;

            return (
              <button
                key={city.key}
                type="button"
                aria-pressed={isSelected}
                aria-label={`${city.name}, ${city.state}${isSelected ? ", selected" : ""}`}
                className={`w-fit cursor-pointer rounded-sm font-display text-[42.5px] tracking-[-0.02em] uppercase transition-colors duration-300 focus-visible:ring-2 focus-visible:ring-brand-warm-snow focus-visible:ring-offset-4 focus-visible:ring-offset-brand-obsidian focus-visible:outline-none lg:text-stat ${isActive ? city.selectedClassName : "text-brand-pure-white"}`}
                onPointerEnter={(event) => {
                  if (event.pointerType !== "touch") setPreviewKey(city.key);
                }}
                onPointerLeave={(event) => {
                  if (event.pointerType !== "touch") setPreviewKey(null);
                }}
                onFocus={() => setPreviewKey(city.key)}
                onBlur={() => setPreviewKey(null)}
                onClick={() => {
                  setSelectedKey(city.key);
                  setPreviewKey(city.key);
                }}
              >
                {city.name}
              </button>
            );
          })}
        </div>

        <aside className="absolute top-[384px] bottom-[230px] left-0 z-20 w-[360px] md:top-[332px] md:bottom-[190px] md:left-1/2 md:w-[384px] lg:top-[468px] lg:bottom-[260px] lg:left-[816px] lg:w-[484px]">
          <CityMedia activeKey={activeKey} reduceMotion={reduceMotion} />
        </aside>

        <p className="sr-only" aria-live="polite" aria-atomic="true">
          Showing {activeCity.name}, {activeCity.state}.
        </p>

        <Link
          href="/neighbornets"
          className="absolute bottom-[126px] left-1/2 z-30 inline-flex w-[296px] -translate-x-1/2 items-center justify-center bg-brand-royal px-6 py-4 text-nav font-bold text-brand-pure-white transition-colors hover:bg-brand-royal/80 focus-visible:ring-2 focus-visible:ring-brand-pure-white focus-visible:ring-offset-2 focus-visible:ring-offset-brand-obsidian focus-visible:outline-none md:bottom-[160px] md:left-16 md:w-auto md:translate-x-0 lg:top-[1591px] lg:bottom-auto lg:left-[97px]"
        >
          View all
        </Link>
      </div>
    </section>
  );
}
