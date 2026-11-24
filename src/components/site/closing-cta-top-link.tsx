"use client";

import type { MouseEvent, ReactNode } from "react";

import { smoothScrollTo } from "./smooth-scroll-provider";

/**
 * A ClosingCta button that takes the reader back to the top of the page
 * it is on (the Support page's "Support us", whose top is the donation
 * form): Lenis's easing (`smoothScrollTo`, a jump under reduced motion).
 * From the keyboard it then moves focus to the page's donation form (its
 * iframe in `#donate`), if there is one, so focus follows the scroll.
 * Without script it is a plain link to `href` (the same page, at its top).
 */
export function ClosingCtaTopLink({
  href,
  className,
  children,
}: {
  href: string;
  className?: string;
  children: ReactNode;
}) {
  const onClick = (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    const fromKeyboard = event.detail === 0;
    smoothScrollTo(0, () => {
      if (!fromKeyboard) return;
      document.querySelector<HTMLElement>("#donate iframe")?.focus();
    });
  };

  return (
    <a href={href} onClick={onClick} className={className}>
      {children}
    </a>
  );
}
