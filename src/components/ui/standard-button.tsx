import Link from "next/link";
import type { ComponentProps } from "react";

import { cn } from "@/lib/utils";

import { AnimatedArrow } from "./animated-arrow";
import styles from "./standard-button.module.css";

const BASE_CLASSES =
  "ym-cta-trigger relative isolate inline-flex w-full items-center justify-center gap-2.5 px-6 md:w-auto pt-4 pb-4.5 text-nav font-bold outline-none focus-visible:ring-2 focus-visible:ring-offset-2";

/*
 * The two tones. Each sets the resting text, the focus ring, and the arrow's
 * square, which matches the fill so it merges into it on hover. The fill
 * colour and the hover text colour are in the CSS module.
 */
const TONES = {
  light: {
    button:
      "text-brand-obsidian focus-visible:ring-brand-royal focus-visible:ring-offset-brand-warm-snow",
    arrow: "bg-brand-royal text-brand-warm-snow",
    module: undefined,
  },
  dark: {
    button:
      "text-brand-warm-snow focus-visible:ring-brand-warm-snow focus-visible:ring-offset-brand-obsidian",
    arrow: "bg-brand-warm-snow text-brand-obsidian",
    module: styles.dark,
  },
} as const;

type StandardButtonProps = Omit<
  ComponentProps<typeof Link>,
  "href" | "children"
> & {
  /** The button's text. */
  label: string;
  href: ComponentProps<typeof Link>["href"];
  /**
   * `light` (the default) for light backgrounds; `dark` for dark ones, such
   * as photos under a dark overlay.
   */
  tone?: keyof typeof TONES;
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
 * `tone="dark"` (Figma 246:124) inverts it for dark backgrounds: Warm Snow
 * text and underline, the arrow in Obsidian on a Warm Snow square; on hover a
 * Warm Snow fill rises and the text turns Obsidian. Same mechanics, timing
 * and reduced-motion behaviour.
 *
 * On mobile it spans its container's width (label and arrow centred), for a
 * bigger tap target and a clean stacked layout; from `md` it sizes to its
 * label. Pass `className` for placement (margins and the like); other link
 * props pass through to the anchor.
 */
export function StandardButton({
  label,
  href,
  tone = "light",
  className,
  ...props
}: StandardButtonProps) {
  const colours = TONES[tone];
  return (
    <Link
      href={href}
      className={cn(
        BASE_CLASSES,
        colours.button,
        styles.button,
        colours.module,
        className,
      )}
      {...props}
    >
      <span className="ym-cta-roll">
        <span className="ym-cta-roll__text" data-text={label}>
          {label}
        </span>
      </span>
      <span className={colours.arrow}>
        <AnimatedArrow size={16} className="ym-cta-arrow--diagonal" />
      </span>
    </Link>
  );
}
