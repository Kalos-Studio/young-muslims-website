import Link from "next/link";

import { NavLink } from "./nav-link";
import { ctaLink, primaryLinks } from "./nav-links";
import { SideNav } from "./side-nav";

/**
 * The site header. Permanent: these are the real routes, and this is the real
 * layout from the Figma frames — wordmark left, primary links centre, the
 * call to action and the drawer trigger right.
 *
 * The wordmark is set as type rather than as a placeholder box on purpose. A
 * grey rectangle here would make the header depend on wireframe components,
 * and then removing the wireframe would mean rebuilding the header. When the
 * real logo asset arrives it replaces the <span>s below and nothing else moves.
 *
 * WIREFRAME: desktop-only for now. When we do responsive, this is one of the
 * two places that needs real work: the centre links collapse into <SideNav />
 * below the `md` breakpoint, and the wordmark drops to a single line.
 */
export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur-sm">
      <div className="mx-auto flex h-24 max-w-[90rem] items-center justify-between gap-8 px-10">
        <Link
          href="/"
          className="shrink-0 rounded-xs leading-[0.95] font-bold tracking-tighter outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          <span className="block text-xl uppercase">Young</span>
          <span className="block text-xl uppercase">Muslims</span>
          <span className="sr-only">Home</span>
        </Link>

        <nav aria-label="Primary" className="flex items-center gap-8 text-base">
          {primaryLinks.map((link) => (
            <NavLink key={link.href} href={link.href}>
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex shrink-0 items-center gap-6">
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
