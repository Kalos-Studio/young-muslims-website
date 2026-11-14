"use client";

import { useId, useState, type ReactNode } from "react";

import { MaterialIcon } from "@/components/ui/material-icon";

import styles from "./accordion.module.css";

/**
 * A disclosure: its title in bold with a chevron, its body below (Figma
 * 413:280, the story pages; 608:3743, the About FAQ). The title is a button
 * (`aria-expanded`, `aria-controls`; Enter and Space) that opens and closes
 * the body, its height easing and the chevron turning
 * (`--duration-story-accordion`), instantly under reduced motion. A closed
 * body is hidden from assistive tech and the tab order (`inert`). Open at
 * first unless `defaultOpen` is false. Type size and colour come from the
 * parent; the body is medium weight, 24px under the title.
 */
export function Accordion({
  title,
  defaultOpen = true,
  children,
}: {
  title: string;
  defaultOpen?: boolean;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);
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
          <div className="pt-6 font-medium">{children}</div>
        </div>
      </div>
    </div>
  );
}
