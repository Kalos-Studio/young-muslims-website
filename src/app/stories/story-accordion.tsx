"use client";

import { useId, useState } from "react";

import { MaterialIcon } from "@/components/ui/material-icon";
import { cn } from "@/lib/utils";

import styles from "./story-page.module.css";

/**
 * One of a story page's accordions (Figma 413:280): its title in bold with
 * a chevron, its text below. Open at first (as in Figma); its title is a
 * button (`aria-expanded`, `aria-controls`; Enter and Space) that closes and
 * reopens it, the body's height easing and the chevron turning
 * (`--duration-story-accordion`), instantly under reduced motion. A closed
 * body is hidden from assistive tech and the tab order (`inert`).
 */
export function StoryAccordion({
  title,
  children,
}: {
  title: string;
  children: string;
}) {
  const [open, setOpen] = useState(true);
  const id = useId();
  return (
    <div>
      <h3>
        <button
          type="button"
          aria-expanded={open}
          aria-controls={id}
          onClick={() => setOpen((value) => !value)}
          className="flex w-full cursor-pointer items-center justify-between gap-6 text-left font-bold outline-none focus-visible:ring-2 focus-visible:ring-brand-obsidian focus-visible:ring-offset-4 focus-visible:ring-offset-brand-warm-snow"
        >
          {title}
          <MaterialIcon name="keyboard_arrow_down" className={styles.chevron} />
        </button>
      </h3>
      <div
        id={id}
        role="region"
        aria-label={title}
        data-open={open ? "" : undefined}
        inert={!open}
        className={styles.panel}
      >
        <div className="overflow-hidden">
          <p className={cn("pt-6 font-medium")}>{children}</p>
        </div>
      </div>
    </div>
  );
}
