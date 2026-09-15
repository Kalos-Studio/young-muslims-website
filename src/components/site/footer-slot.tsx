"use client";

import { usePathname } from "next/navigation";

/**
 * Hides the footer on routes that are meant to be exactly one screen tall.
 *
 * The store is a fork out to two other sites: a full-bleed split with nothing
 * below it, so a footer underneath would add scroll to a page that should not
 * have any. The header stays, because leaving has to be possible.
 *
 * The footer itself arrives as a slot, so it stays a server component and its
 * inlined logo never reaches the client bundle. Permanent, and it imports
 * nothing from the wireframe.
 */
const FULL_SCREEN_ROUTES = ["/store"];

export function FooterSlot({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  if (FULL_SCREEN_ROUTES.includes(pathname)) return null;

  return <>{children}</>;
}
