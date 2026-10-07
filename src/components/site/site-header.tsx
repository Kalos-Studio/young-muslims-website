import Link from "next/link";

import { HeaderContrastController } from "./header-contrast-controller";
import { Logo } from "./logo";
import { NavLink } from "./nav-link";
import { ctaLink, primaryLinks } from "./nav-links";
import { SideNav } from "./side-nav";

/**
 * The site header. Permanent: these are the real routes and the real layout.
 * The logo sits left, primary links are centred, and the call to action sits
 * right immediately before the drawer trigger.
 *
 * The three-column grid with an `auto` middle centres the primary navigation
 * against the viewport regardless of the unequal outer groups.
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
    <header
      data-site-header
      className="sticky top-0 z-40 border-b border-border bg-background/60 backdrop-blur-md"
    >
      <HeaderContrastController />
      <div
        data-site-header-inner
        className="grid h-[123px] w-full grid-cols-[1fr_auto] items-center gap-8 px-8 md:grid-cols-[1fr_auto_1fr] md:px-20"
      >
        <div className="flex items-center justify-start">
          <Link
            href="/"
            aria-label="Young Muslims, home"
            data-site-logo-link
            className="rounded-xs transition-colors duration-300 outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            {/* aria-hidden because the link above already names the destination;
                without it a screen reader announces the name twice. */}
            <Logo className="h-5 w-auto" aria-hidden />
          </Link>
        </div>

        <nav
          data-primary-nav
          aria-label="Primary"
          className="hidden items-center justify-center gap-4 text-nav md:flex"
        >
          {primaryLinks.map((link) => (
            <NavLink key={link.href} href={link.href} className="p-2.5">
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex shrink-0 items-center justify-end gap-6">
          <nav
            aria-label="Find a chapter"
            className="hidden items-center text-nav md:flex"
          >
            <NavLink
              href={ctaLink.href}
              className="inline-flex items-center bg-brand-royal px-6 py-4 text-nav font-bold text-brand-pure-white transition-opacity hover:opacity-80 focus-visible:ring-2 focus-visible:ring-brand-royal focus-visible:ring-offset-2"
              data-site-cta
            >
              {ctaLink.label}
            </NavLink>
          </nav>
          <SideNav />
        </div>
      </div>
    </header>
  );
}
