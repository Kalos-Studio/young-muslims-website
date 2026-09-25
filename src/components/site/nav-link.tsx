"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

import { TopNavLink } from "./top-nav-transition";

/**
 * A nav link that knows whether it is the current page.
 *
 * This is the only part of the header that needs to be a client component, so
 * it is split out rather than making the whole header one. `aria-current` is
 * what a screen reader announces; the underline is the sighted equivalent, and
 * both come from the same check so they cannot disagree.
 */

type NavLinkProps = {
  href: string;
  children: React.ReactNode;
  className?: string;
  /** Restricts the full-screen route transition to persistent header links. */
  topLevel?: boolean;
  /** Called after a successful navigation, so the drawer can close itself. */
  onNavigate?: () => void;
};

export function useIsCurrent(href: string): boolean {
  const pathname = usePathname();
  // Exact match for "/", prefix match elsewhere, so /stories/some-person still
  // marks Stories as the current section.
  return href === "/" ? pathname === "/" : pathname.startsWith(href);
}

export function NavLink({
  href,
  children,
  className,
  topLevel = false,
  onNavigate,
}: NavLinkProps) {
  const isCurrent = useIsCurrent(href);
  const linkClassName = cn(
    "rounded-xs font-bold underline-offset-8 transition-colors outline-none",
    "hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
    isCurrent ? "text-foreground underline" : "text-muted-foreground",
    className,
  );

  if (topLevel) {
    return (
      <TopNavLink
        href={href}
        aria-current={isCurrent ? "page" : undefined}
        className={linkClassName}
      >
        {children}
      </TopNavLink>
    );
  }

  return (
    <Link
      href={href}
      onClick={onNavigate}
      aria-current={isCurrent ? "page" : undefined}
      className={linkClassName}
    >
      {children}
    </Link>
  );
}
