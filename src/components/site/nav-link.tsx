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
 * what a screen reader announces; the underline is the sighted equivalent, and
 * both come from the same check so they cannot disagree.
 */

type NavLinkProps = {
  item: NavigationItem;
  children: React.ReactNode;
  className?: string;
  "data-site-cta"?: boolean;
  /** Called after a successful navigation, so the drawer can close itself. */
  onNavigate?: () => void;
};

export function NavLink({
  item,
  children,
  className,
  "data-site-cta": siteCta,
  onNavigate,
}: NavLinkProps) {
  const pathname = usePathname();
  const isCurrent = isNavigationItemCurrent(item, pathname);
  const linkClassName = cn(
    "rounded-xs font-bold underline-offset-8 transition-colors outline-none",
    "hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
    isCurrent ? "text-foreground underline" : "text-muted-foreground",
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
