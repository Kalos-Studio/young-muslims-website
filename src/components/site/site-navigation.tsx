import Link from "next/link";

import { AnimatedCtaLabel } from "@/components/ui/animated-arrow";
import { MaterialIcon } from "@/components/ui/material-icon";

import { Logo } from "./logo";
import { NavLink } from "./nav-link";
import { getNavigationItems } from "./nav-links";
import { SideNav } from "./side-nav";

const primaryLinks = getNavigationItems("header-primary");
const [chapterLink] = getNavigationItems("header-cta");
const [donateLink] = getNavigationItems("header-donate");

const focusRing =
  "outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-pure-white";

/**
 * The navigation bar inside the site header, from the Figma Navigation frames:
 * desktop `527:12`, tablet `279:62` and mobile `280:1017`.
 *
 * Server-rendered. Only the current-page links (`NavLink`) and the menu
 * trigger (`SideNav`) are client components. Colors are fixed: everything is
 * Pure White except the Donate button, which is always Warm Snow on Obsidian.
 *
 * Each breakpoint removes items, as in Figma:
 * - Base (mobile): logo and menu only, 32px side padding (80px tall).
 * - `md` (tablet): adds Donate, 64px side padding (97px tall).
 * - `xl` (desktop): adds the four centre links and Find a Chapter, 80px side
 *   padding. `xl` rather than `lg`, because at 1024px the full bar measures
 *   about 890px against 896px of room and the links would crowd.
 *
 * Heights are not set. They come from 24px vertical padding around the tallest
 * item, which is the 49px Donate button or the 32px menu icon, as in Figma.
 * The menu is the primary navigation below `xl` and lists every destination.
 */
export function SiteNavigation() {
  return (
    <div
      data-site-header-inner
      className="mx-auto flex w-full max-w-360 items-center justify-between px-8 py-6 text-nav font-bold md:px-16 xl:px-20"
    >
      <Link
        href="/"
        aria-label="Young Muslims, home"
        data-site-logo-link
        className={focusRing}
      >
        {/* aria-hidden because the link above already names the destination;
            without it a screen reader announces the name twice. */}
        <Logo className="h-5" aria-hidden />
      </Link>

      <nav aria-label="Primary" className="hidden items-center gap-4 xl:flex">
        {primaryLinks.map((link) => (
          <NavLink
            key={link.id}
            item={link}
            className="ym-cta-trigger p-2.5"
            currentDot
          >
            <span className="ym-cta-roll">
              <span className="ym-cta-roll__text" data-text={link.label}>
                {link.label}
              </span>
            </span>
          </NavLink>
        ))}
      </nav>

      <div className="flex items-center gap-6">
        <NavLink
          item={chapterLink}
          data-site-cta
          className="ym-cta-trigger hidden items-center gap-2.5 p-2.5 xl:flex"
        >
          <MaterialIcon name="search" size={18} aria-hidden />
          <span className="ym-cta-roll">
            <span className="ym-cta-roll__text" data-text={chapterLink.label}>
              {chapterLink.label}
            </span>
          </span>
        </NavLink>
        <NavLink
          item={donateLink}
          className="ym-cta-trigger hidden items-center gap-2 bg-brand-warm-snow px-6 py-4 text-brand-obsidian md:flex"
        >
          <AnimatedCtaLabel
            label={donateLink.label}
            arrowSize={16}
            arrowMotion="diagonal"
          />
        </NavLink>
        <SideNav />
      </div>
    </div>
  );
}
