"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";
import { isNavigationItemCurrent, type NavigationItem } from "./nav-links";

/**
 * A nav link that knows whether it is the current page.
 *
 * This is the only part of the header that needs to be a client component, so
 * it is split out rather than making the whole header one. `aria-current` is
 * what a screen reader announces. With `currentDot`, the same attribute draws
 * the sighted equivalent, so the two cannot disagree.
 *
 * The link sets no color of its own. Header colors are fixed by the caller and
 * never change with state, so there is nothing here to override.
 */

type NavLinkProps = {
  item: NavigationItem;
  children: React.ReactNode;
  className?: string;
  /**
   * Marks the current page with a small dot beneath the link, drawn by
   * `.ym-nav-current-dot` in globals.css from `aria-current="page"`.
   */
  currentDot?: boolean;
  /** Lets route-specific CSS find the chapter CTA (see globals.css). */
  "data-site-cta"?: boolean;
  /** Called after a successful navigation, so the drawer can close itself. */
  onNavigate?: () => void;
};

export function NavLink({
  item,
  children,
  className,
  currentDot,
  "data-site-cta": siteCta,
  onNavigate,
}: NavLinkProps) {
  const pathname = usePathname();
  const isCurrent = isNavigationItemCurrent(item, pathname);
  const linkClassName = cn(
    "outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-pure-white",
    currentDot ? "ym-nav-current-dot" : undefined,
    className,
  );

  return (
    <Link
      href={item.href}
      onClick={onNavigate}
      aria-current={isCurrent ? "page" : undefined}
      data-site-cta={siteCta ? "true" : undefined}
      className={linkClassName}
    >
      {children}
    </Link>
  );
}
