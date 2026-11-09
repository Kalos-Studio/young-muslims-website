import Image, { type StaticImageData } from "next/image";
import Link from "next/link";

import { AnimatedCtaLabel } from "@/components/ui/animated-arrow";
import { cn } from "@/lib/utils";

import styles from "./closing-cta.module.css";
import { ClosingCtaDrift } from "./closing-cta-drift";

const BUTTON =
  "ym-cta-trigger relative flex h-15.25 w-full items-center gap-3 px-7.5 text-cta font-bold outline-none focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-warm-snow md:w-78";

/**
 * The closing call to action above the footer (Figma 270:301, tablet
 * 280:788, mobile 297:1442), shared by every page with its own photo.
 *
 * - `image` / `alt`: the page's photo (a static import) and its alt text.
 * - `imageFocus`: how to frame the photo: `"center"` (the default) or
 *   `"low"`, for a tall photo whose subject sits low in it (CSS module).
 *
 * The mission line is the same everywhere, so it is not a prop.
 *
 * An organic shape (the Figma frame's silhouette as a mask, wavy at its top
 * where it hands off from the section above) holds the full-bleed photo
 * under a 40% Obsidian overlay; its wavy foot is an Obsidian cap over the
 * photo, running into the footer. The photo drifts within the shape and the
 * foot drifts too, each on its own layer (ClosingCtaDrift). On it, the mission line and two box buttons:
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
}: {
  image: StaticImageData;
  alt: string;
  imageFocus?: "center" | "low";
}) {
  return (
    <section
      aria-labelledby="closing-cta-heading"
      className="relative h-223.5 overflow-clip bg-brand-warm-snow xl:h-180.75"
    >
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-81.75 bg-brand-obsidian xl:h-92.75"
      />
      <div className={cn("absolute inset-0 overflow-hidden", styles.shape)}>
        <ClosingCtaDrift
          token="--closing-cta-drift"
          fallback={160}
          className={styles.photo}
        >
          <div
            className={
              imageFocus === "low" ? styles.focusLowBox : "absolute inset-0"
            }
          >
            <Image
              src={image}
              alt={alt}
              fill
              sizes="100vw"
              className={cn(
                "object-cover",
                imageFocus === "low" && styles.focusLow,
              )}
            />
          </div>
        </ClosingCtaDrift>
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-brand-obsidian/40"
        />
      </div>
      {/* The shape's wavy foot: an Obsidian cap over the photo, drifting
          with the scroll (it runs past the section's foot, which clips it). */}
      <ClosingCtaDrift
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
