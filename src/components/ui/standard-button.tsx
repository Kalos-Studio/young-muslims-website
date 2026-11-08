import Link from "next/link";
import type { ComponentProps } from "react";

import { cn } from "@/lib/utils";

import { AnimatedArrow } from "./animated-arrow";
import styles from "./standard-button.module.css";

const BASE_CLASSES =
  "ym-cta-trigger relative isolate inline-flex w-full items-center justify-center gap-2.5 px-6 md:w-auto pt-4 pb-4.5 text-nav font-bold text-brand-obsidian outline-none focus-visible:ring-2 focus-visible:ring-brand-royal focus-visible:ring-offset-2 focus-visible:ring-offset-brand-warm-snow";

type StandardButtonProps = Omit<
  ComponentProps<typeof Link>,
  "href" | "children"
> & {
  /** The button's text. */
  label: string;
  href: ComponentProps<typeof Link>["href"];
};

/**
 * The site's standard page button (Figma 545:938 resting, 544:654 hover): a
 * link with its label in Obsidian, an ↗ arrow in a Royal square and a Royal
 * underline. Use it for in-page calls to action everywhere except the header
 * CTAs and the end-of-page CTA sections, which have their own styles.
 *
 * On hover or keyboard focus it plays one orchestrated animation: the
 * underline rises into a full Royal fill as the text turns Warm Snow, while
 * the label rolls and the arrow launches up and to the right (the Donate
 * button's diagonal arrow). The arrow's square is the same Royal as the fill,
 * so it merges into it, as in the hover frame. Under reduced motion it
 * switches straight to the filled state.
 *
 * On mobile it spans its container's width (label and arrow centred), for a
 * bigger tap target and a clean stacked layout; from `md` it sizes to its
 * label. Pass `className` for placement (margins and the like); other link
 * props pass through to the anchor.
 */
export function StandardButton({
  label,
  href,
  className,
  ...props
}: StandardButtonProps) {
  return (
    <Link
      href={href}
      className={cn(BASE_CLASSES, styles.button, className)}
      {...props}
    >
      <span className="ym-cta-roll">
        <span className="ym-cta-roll__text" data-text={label}>
          {label}
        </span>
      </span>
      <span className="bg-brand-royal text-brand-warm-snow">
        <AnimatedArrow size={16} className="ym-cta-arrow--diagonal" />
      </span>
    </Link>
  );
}
