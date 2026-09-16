import Link from "next/link";

import { Logo } from "./logo";
import { NavLink } from "./nav-link";
import { ctaLink, primaryLinks } from "./nav-links";
import { SideNav } from "./side-nav";

/**
 * The site header. Permanent: these are the real routes and the real layout.
 * Primary links left, logo centred, the call to action and the drawer trigger
 * right.
 *
 * The three-column grid with an `auto` middle is what centres the logo against
 * the viewport. Flex with justify-between would only centre it when the two
 * outer groups happened to be the same width, and they are not.
 *
 * The logo is the real asset, not a placeholder box. A grey rectangle here
 * would make the header depend on wireframe components, and then removing the
 * wireframe would mean rebuilding the header.
 *
 * WIREFRAME: desktop-only for now. When we do responsive, this is one of the
 * two places that needs real work: the left-hand links collapse into <SideNav />
 * below the `md` breakpoint.
 */
export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/60 backdrop-blur-md">
      <div className="mx-auto grid h-24 max-w-[90rem] grid-cols-[1fr_auto_1fr] items-center gap-8 px-10">
        <nav
          aria-label="Primary"
          className="flex items-center justify-start gap-8 text-base"
        >
          {primaryLinks.map((link) => (
            <NavLink key={link.href} href={link.href}>
              {link.label}
            </NavLink>
          ))}
        </nav>

        <Link
          href="/"
          aria-label="Young Muslims, home"
          className="justify-self-center rounded-xs outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          {/* aria-hidden because the link above already names the destination;
              without it a screen reader announces the name twice. */}
          <Logo className="h-4" aria-hidden />
        </Link>

        <div className="flex shrink-0 items-center justify-end gap-6">
          <NavLink
            href={ctaLink.href}
            className="font-semibold text-foreground no-underline hover:underline"
          >
            {ctaLink.label}
          </NavLink>
          <SideNav />
        </div>
      </div>
    </header>
  );
}
