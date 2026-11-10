import type { StaticImageData } from "next/image";

import { cn } from "@/lib/utils";

import styles from "./ym-composition.module.css";
import { GrainPrimitives } from "./grain-filter";

/*
 * The stacked YM composition from the Figma entry frame (273:620; the page
 * transition's 564:359 uses the same layout), in its own units: 1073.78 x
 * 926. `--entry-unit` scales one unit to the viewport, so every use scales
 * the same way (see "Entry animation" in DESIGN-SYSTEM.md).
 */
const WIDTH = 1073.78;
const HEIGHT = 926;
/** Both wordmark lines are 271 units tall at this Boldonse size. */
const WORDMARK_SIZE = 224.3;
/** The band behind the wordmark: from the top of YOUNG to the bottom. */
const BAND_TOP = 354;
const BAND_HEIGHT = HEIGHT - BAND_TOP;

type YmCompositionProps =
  | {
      /**
       * Entry screen: pale-slate monograms and a wordmark that windows the
       * photos, with film grain.
       */
      variant: "photos";
      photos: readonly StaticImageData[];
      className?: string;
    }
  | {
      /**
       * Page transition: monograms and wordmark in one solid colour, the
       * current text colour, with no grain.
       */
      variant: "solid";
      className?: string;
    };

/**
 * The two YM monograms (filled Brothers, outlined Sisters) above "YOUNG
 * MUSLIMS" in live Boldonse. Shared by the entry screen and the page
 * transition so the lockup is identical in both.
 *
 * The monograms are the menu's full-opacity marks used as CSS masks. The
 * wordmark is an SVG clip path of the live text, so its fill can be photos
 * (each a plain `href`, with no per-photo CSS or inline styles) or a solid
 * colour, and it stays crisp at any size. `textLength` pins each line to the
 * frame's exact width without a tracking value.
 */
export function YmComposition(props: YmCompositionProps) {
  const photos = props.variant === "photos";
  // Distinct ids per variant; the two are never on screen together.
  const clipId = photos ? "entry-wordmark" : "transition-wordmark";
  const monogram = cn(
    styles.monogram,
    photos ? cn(styles.grain, "bg-brand-warm-snow") : "bg-current",
  );

  return (
    <div className={cn(styles.composition, props.className)}>
      {/* Entry: pale slate is Brothers Slate at 65% over Warm Snow, as in the
          frame. The Warm Snow base keeps each mark opaque, so the grain blend
          shades the colour instead of greying it. */}
      <div className={cn(monogram, styles.monogramFilled)}>
        {photos ? (
          <span className="absolute inset-0 bg-brothers-slate/65" />
        ) : null}
      </div>
      <div className={cn(monogram, styles.monogramOutline)}>
        {photos ? (
          <span className="absolute inset-0 bg-brothers-slate/65" />
        ) : null}
      </div>

      <svg
        className={styles.wordmark}
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        aria-hidden
      >
        <defs>
          {photos ? (
            // Film grain, confined to the shape it is applied to so the
            // background stays clean. Also used by the monograms through the
            // CSS `filter` in .grain.
            <filter
              id="entry-grain"
              x="0"
              y="0"
              width="1"
              height="1"
              colorInterpolationFilters="sRGB"
            >
              <GrainPrimitives />
            </filter>
          ) : null}

          <clipPath id={clipId}>
            <text
              x="27"
              y="623"
              fontSize={WORDMARK_SIZE}
              textLength="1014"
              lengthAdjust="spacing"
              className="font-display"
            >
              YOUNG
            </text>
            <text
              x="-13"
              y="924"
              fontSize={WORDMARK_SIZE}
              textLength="1094"
              lengthAdjust="spacing"
              className="font-display"
            >
              MUSLIMS
            </text>
          </clipPath>
        </defs>

        <g
          clipPath={`url(#${clipId})`}
          filter={photos ? "url(#entry-grain)" : undefined}
        >
          {photos ? (
            <>
              {/* Shown until the first photo has decoded. */}
              <rect
                x="0"
                y={BAND_TOP}
                width={WIDTH}
                height={BAND_HEIGHT}
                className="fill-brothers-slate"
              />
              {props.photos.map((photo, index) => (
                <image
                  key={photo.src}
                  data-entry-photo={index}
                  href={photo.src}
                  x="0"
                  y={BAND_TOP}
                  width={WIDTH}
                  height={BAND_HEIGHT}
                  preserveAspectRatio="xMidYMid slice"
                  opacity={index === 0 ? 1 : 0}
                />
              ))}
            </>
          ) : (
            <rect
              x="0"
              y={BAND_TOP}
              width={WIDTH}
              height={BAND_HEIGHT}
              className="fill-current"
            />
          )}
        </g>
      </svg>
    </div>
  );
}
