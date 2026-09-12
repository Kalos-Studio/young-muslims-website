import { Logo } from "./logo";
import { NavLink } from "./nav-link";
import { footerLinks } from "./nav-links";

/**
 * The footer is the site's one complete index: every page is reachable from
 * here, including the two that otherwise live only in the drawer.
 *
 * Real links and the real logo, for the same reason the header has them — the
 * footer is permanent, so it should not import anything disposable. What is
 * still missing is content we do not have yet (address, socials, legal), and
 * that gets added when it exists rather than mocked now.
 */
export function SiteFooter() {
  return (
    <footer className="mt-32 border-t border-border">
      <div className="mx-auto flex max-w-[90rem] items-start justify-between gap-16 px-10 py-16">
        <div>
          <Logo className="h-16" />
          <p className="mt-6 text-sm text-muted-foreground">
            By the youth, for the youth.
          </p>
        </div>

        <nav aria-label="Footer" className="flex flex-col items-end gap-3">
          {footerLinks.map((link) => (
            <NavLink key={link.href} href={link.href} className="text-sm">
              {link.label}
            </NavLink>
          ))}
        </nav>
      </div>
    </footer>
  );
}
