"use client";

import { motion, useReducedMotion, type Transition } from "motion/react";

/**
 * The header's menu glyph: one SVG whose three lines morph between a hamburger
 * and an X, so opening and closing read as one continuous gesture. Two stock
 * Material glyphs cannot do that, which is the only reason this is bespoke;
 * use `MaterialIcon` for every other icon.
 *
 * Geometry matches the Material `menu` symbol the Figma navigation uses: in a
 * 24-unit box, bars span x 3–21 at y 7, 12 and 17, each 2 units thick. Opening
 * moves the outer bars onto the middle one and rotates them ±45°, while the
 * middle bar fades. Motion rotates SVG elements about their own centre.
 *
 * Decorative only: the trigger that contains it owns the accessible name.
 * Reduced motion swaps the two states instantly.
 */
export function MenuToggleIcon({ open }: { open: boolean }) {
  const reduceMotion = useReducedMotion();
  const transition: Transition = reduceMotion
    ? { duration: 0 }
    : { duration: 0.35, ease: [0.645, 0.045, 0.355, 1] };

  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      aria-hidden
      className="block size-8"
    >
      <motion.line
        x1={3}
        x2={21}
        y1={7}
        y2={7}
        initial={false}
        animate={open ? { y: 5, rotate: 45 } : { y: 0, rotate: 0 }}
        transition={transition}
      />
      <motion.line
        x1={3}
        x2={21}
        y1={12}
        y2={12}
        initial={false}
        animate={{ opacity: open ? 0 : 1 }}
        transition={transition}
      />
      <motion.line
        x1={3}
        x2={21}
        y1={17}
        y2={17}
        initial={false}
        animate={open ? { y: -5, rotate: -45 } : { y: 0, rotate: 0 }}
        transition={transition}
      />
    </svg>
  );
}
