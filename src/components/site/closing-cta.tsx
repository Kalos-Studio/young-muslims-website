import Image, { getImageProps, type StaticImageData } from "next/image";
import Link from "next/link";

import { AnimatedCtaLabel } from "@/components/ui/animated-arrow";
import { cn } from "@/lib/utils";

import styles from "./closing-cta.module.css";
import { ScrollDrift } from "./scroll-drift";

/*
 * The photo layer's height in each frame (CSS px): the section (h-180.75
 * from `xl`, h-223.5 below) plus `--closing-cta-drift` (10rem). Cover-fit
 * draws the photo at least this tall, so at least this height times its
 * aspect wide: the width the browser needs for an art-directed crop.
 */
const LAYER_HEIGHT = { desktop: 883, tablet: 1054, mobile: 1054 };

/* The drawn width of a cover-fit photo in its layer, for `sizes`. */
function coverSizes(image: StaticImageData, layerHeight: number) {
  return `max(100vw, ${Math.ceil((layerHeight * image.width) / image.height)}px)`;
}

/**
 * An art-directed photo: each frame's crop (a page's asset script renders
 * them), desktop from `xl`, tablet from `md`, mobile below, each asked for at
 * the width cover-fit draws it (not just the screen's), so dense screens get
 * the full crop.
 */
function ArtDirectedPhoto({
  image,
  artDirection,
  alt,
  className,
}: {
  image: StaticImageData;
  artDirection: { tablet: StaticImageData; mobile: StaticImageData };
  alt: string;
  className?: string;
}) {
  const sizes = {
    desktop: coverSizes(image, LAYER_HEIGHT.desktop),
    tablet: coverSizes(artDirection.tablet, LAYER_HEIGHT.tablet),
    mobile: coverSizes(artDirection.mobile, LAYER_HEIGHT.mobile),
  };
  const {
    props: { srcSet: desktop },
  } = getImageProps({ alt, fill: true, sizes: sizes.desktop, src: image });
  const {
    props: { srcSet: tablet },
  } = getImageProps({
    alt,
    fill: true,
    sizes: sizes.tablet,
    src: artDirection.tablet,
  });
  const {
    props: { srcSet: mobile, ...img },
  } = getImageProps({
    alt,
    fill: true,
    sizes: sizes.mobile,
    src: artDirection.mobile,
  });
  return (
    <picture>
      <source media="(width >= 80rem)" srcSet={desktop} sizes={sizes.desktop} />
      <source media="(width >= 48rem)" srcSet={tablet} sizes={sizes.tablet} />
      <source srcSet={mobile} sizes={sizes.mobile} />
      <img {...img} alt={alt} className={className} />
    </picture>
  );
}

const BUTTON =
  "ym-cta-trigger relative flex h-15.25 w-full items-center gap-3 px-7.5 text-cta font-bold outline-none focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-warm-snow md:w-78";

/**
 * The closing call to action above the footer (Figma 270:301, tablet
 * 280:788, mobile 297:1442), shared by every page with its own photo.
 *
 * - `image` / `alt`: the page's photo (a static import) and its alt text.
 * - `imageFocus`: how to frame the photo: `"center"` (the default) or
 *   `"low"`, for a tall photo whose subject sits low in it (CSS module).
 * - `overHero`: for a page whose CTA follows a pinned hero directly (the
 *   Store page's): the section is clear above the shape's wavy top, so the
 *   hero shows there and the wave rises over it as the page scrolls.
 * - `artDirection`: optional tablet and mobile crops (`image` is then the
 *   desktop crop), each the strip of the photo its frames show, rendered
 *   for dense screens; the About page's (scripts/about-cta-assets.mjs).
 *
 * The mission line is the same everywhere, so it is not a prop.
 *
 * An organic shape (the Figma frame's silhouette as a mask, wavy at its top
 * where it hands off from the section above) holds the full-bleed photo
 * under a 40% Obsidian overlay; its wavy foot is an Obsidian cap over the
 * photo, running into the footer. The photo drifts within the shape and the
 * foot drifts too, each on its own layer (ScrollDrift). On it, the mission line and two box buttons:
 * "Get involved" (filled, to /contact) and "Support us" (outlined, to
 * /support), each with the label roll and the diagonal arrow launch; "Support
 * us" also fills with Warm Snow on hover. Desktop sets the line left and
 * the buttons stacked right; tablet and mobile stack them, the buttons full
 * width between the 32px gutters on mobile. Content caps at 1440.
 */
export function ClosingCta({
  image,
  alt,
  imageFocus = "center",
  artDirection,
  overHero = false,
}: {
  image: StaticImageData;
  alt: string;
  imageFocus?: "center" | "low";
  artDirection?: { tablet: StaticImageData; mobile: StaticImageData };
  overHero?: boolean;
}) {
  const imageClassName = cn(
    "object-cover",
    imageFocus === "low" && styles.focusLow,
  );
  return (
    <section
      aria-labelledby="closing-cta-heading"
      className={cn(
        "relative h-223.5 overflow-clip xl:h-180.75",
        !overHero && "bg-brand-warm-snow",
      )}
    >
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-81.75 bg-brand-obsidian xl:h-92.75"
      />
      <div className={cn("absolute inset-0 overflow-hidden", styles.shape)}>
        <ScrollDrift
          token="--closing-cta-drift"
          fallback={160}
          className={styles.photo}
        >
          <div
            className={
              imageFocus === "low" ? styles.focusLowBox : "absolute inset-0"
            }
          >
            {artDirection ? (
              <ArtDirectedPhoto
                image={image}
                artDirection={artDirection}
                alt={alt}
                className={imageClassName}
              />
            ) : (
              <Image
                src={image}
                alt={alt}
                fill
                sizes="100vw"
                className={imageClassName}
              />
            )}
          </div>
        </ScrollDrift>
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-brand-obsidian/40"
        />
      </div>
      {/* The shape's wavy foot: an Obsidian cap over the photo, drifting
          with the scroll (it runs past the section's foot, which clips it). */}
      <ScrollDrift
        token="--closing-cta-foot-drift"
        fallback={64}
        className={cn("bg-brand-obsidian", styles.foot)}
      />

      <div className="relative mx-auto flex h-full max-w-360 flex-col px-8 pt-38.75 md:justify-center md:px-16 md:pt-0 xl:flex-row xl:items-center xl:justify-between xl:pr-56.5 xl:pl-32.25">
        <h2
          id="closing-cta-heading"
          className="text-center text-mobile-section font-extrabold text-brand-warm-snow md:max-w-133 md:text-left md:text-landing-section xl:max-w-173"
        >
          Seeking the pleasure of Allah (SWT) by empowering Muslim youth.
        </h2>
        <div className="mt-48 flex flex-col gap-8 md:mt-11.75 xl:mt-0">
          <Link
            href="/contact"
            className={cn(
              BUTTON,
              "bg-brand-warm-snow text-brand-obsidian",
              styles.button,
            )}
          >
            <AnimatedCtaLabel
              label="Get involved"
              arrowMotion="diagonal"
              textClassName="flex-1"
            />
          </Link>
          <Link
            href="/support"
            className={cn(
              BUTTON,
              "border border-brand-warm-snow text-brand-warm-snow",
              styles.button,
              styles.outline,
            )}
          >
            <AnimatedCtaLabel
              label="Support us"
              arrowMotion="diagonal"
              textClassName="flex-1"
            />
          </Link>
        </div>
      </div>
    </section>
  );
}
