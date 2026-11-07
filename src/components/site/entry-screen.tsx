import { entryPhotos } from "./entry-photos";
import styles from "./entry-screen.module.css";

/*
 * Geometry from the Figma entry frame (273:620), in its own units: the
 * composition is 1073.78 x 926. `--entry-unit` scales one unit to the
 * viewport (see "Entry animation" in DESIGN-SYSTEM.md).
 */
const WIDTH = 1073.78;
const HEIGHT = 926;
/** Both wordmark lines are 271 units tall at this Boldonse size. */
const WORDMARK_SIZE = 224.3;
/** The photo band behind the wordmark: from the top of YOUNG to the bottom. */
const PHOTO_TOP = 354;
const PHOTO_HEIGHT = HEIGHT - PHOTO_TOP;

/**
 * The entry screen: the two monograms in Brothers Slate above "YOUNG MUSLIMS"
 * set in live Boldonse. The wordmark is a window onto group photos, which
 * `EntryAnimation` flashes by switching each `[data-entry-photo]` layer's
 * opacity. Server-rendered so it is on screen at first paint.
 *
 * The letterforms are an SVG clip path rather than `background-clip: text`:
 * each photo is a plain `href` from one array, with no per-photo CSS or
 * inline styles, and the text stays crisp at any size. `textLength` pins each
 * line to the frame's exact width without a tracking value.
 */
export function EntryScreen() {
  return (
    <div className={`${styles.screen} bg-brand-warm-snow`}>
      <div className={styles.composition}>
        {/* Pale slate is Brothers Slate at 65% over Warm Snow, as in the
            frame. The Warm Snow base keeps each mark opaque, so the grain
            blend shades the colour instead of greying it. */}
        <div
          className={`${styles.monogram} ${styles.monogramFilled} bg-brand-warm-snow`}
        >
          <span className="absolute inset-0 bg-brothers-slate/65" />
        </div>
        <div
          className={`${styles.monogram} ${styles.monogramOutline} bg-brand-warm-snow`}
        >
          <span className="absolute inset-0 bg-brothers-slate/65" />
        </div>

        <svg
          className={styles.wordmark}
          viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
          aria-hidden
        >
          <defs>
            {/* Film grain, confined to the shape it is applied to so the
                Warm Snow background stays clean. Also used by the
                monograms through CSS `filter`. */}
            <filter
              id="entry-grain"
              x="0"
              y="0"
              width="1"
              height="1"
              colorInterpolationFilters="sRGB"
            >
              <feTurbulence
                type="fractalNoise"
                baseFrequency="0.85"
                numOctaves={2}
                seed={7}
                stitchTiles="stitch"
                result="noise"
              />
              {/* The noise's alpha channel, centred near 0.5, as opaque grey.
                  Its colour channels are premultiplied and would darken. */}
              <feColorMatrix
                in="noise"
                type="matrix"
                values="0 0 0 1 0  0 0 0 1 0  0 0 0 1 0  0 0 0 0 1"
                result="grain"
              />
              {/* Source + 0.24 x (grain - 0.5): speckle without shifting the
                  average colour. */}
              <feComposite
                in="SourceGraphic"
                in2="grain"
                operator="arithmetic"
                k1="0"
                k2="1"
                k3="0.24"
                k4="-0.12"
                result="grained"
              />
              <feComposite in="grained" in2="SourceGraphic" operator="in" />
            </filter>

            <clipPath id="entry-wordmark">
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

          <g clipPath="url(#entry-wordmark)" filter="url(#entry-grain)">
            {/* Shown until the first photo has decoded. */}
            <rect
              x="0"
              y={PHOTO_TOP}
              width={WIDTH}
              height={PHOTO_HEIGHT}
              className="fill-brothers-slate"
            />
            {entryPhotos.map((photo, index) => (
              <image
                key={photo.src}
                data-entry-photo={index}
                href={photo.src}
                x="0"
                y={PHOTO_TOP}
                width={WIDTH}
                height={PHOTO_HEIGHT}
                preserveAspectRatio="xMidYMid slice"
                opacity={index === 0 ? 1 : 0}
              />
            ))}
          </g>
        </svg>
      </div>
    </div>
  );
}
