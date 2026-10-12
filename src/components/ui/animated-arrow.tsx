import type { HTMLAttributes } from "react";

import { MaterialIcon } from "./material-icon";

type AnimatedArrowProps = Omit<HTMLAttributes<HTMLSpanElement>, "children"> & {
  size?: number;
};

type AnimatedCtaLabelProps = {
  arrowSize?: number;
  label: string;
  textClassName?: string;
};

/**
 * Two stacked arrows create the vertical handoff used by the site's CTA hover
 * treatment. The containing interactive element supplies `ym-cta-trigger`.
 */
export function AnimatedArrow({
  size = 24,
  className,
  style,
  ...props
}: AnimatedArrowProps) {
  return (
    <span
      aria-hidden
      className={`ym-cta-arrow ${className ?? ""}`}
      style={{ width: size, height: size, ...style }}
      {...props}
    >
      <MaterialIcon
        name="north_east"
        size={size}
        className="ym-cta-arrow__icon ym-cta-arrow__icon--current"
      />
      <MaterialIcon
        name="north_east"
        size={size}
        className="ym-cta-arrow__icon ym-cta-arrow__icon--next"
      />
    </span>
  );
}

/** Shared rolling label and upward arrow for landing-page CTA buttons. */
export function AnimatedCtaLabel({
  arrowSize = 20,
  label,
  textClassName,
}: AnimatedCtaLabelProps) {
  return (
    <>
      <span className={`ym-cta-roll ${textClassName ?? ""}`}>
        <span className="ym-cta-roll__text" data-text={label}>
          {label}
        </span>
      </span>
      <AnimatedArrow size={arrowSize} />
    </>
  );
}
