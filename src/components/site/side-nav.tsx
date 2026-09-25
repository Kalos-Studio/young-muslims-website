"use client";

import { Dialog } from "@base-ui/react/dialog";
import { ArrowUpRight, Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { type CSSProperties, useEffect, useRef, useState } from "react";

import { Logo } from "./logo";
import { ctaLink, drawerOnlyLinks, primaryLinks } from "./nav-links";

const secondaryLinks = [...drawerOnlyLinks, ctaLink];

const featureLinks = [
  {
    href: "/blog",
    eyebrow: "From the blog",
    title: "Ideas for growing in faith and community",
    tone: "ym-menu-feature--royal",
  },
  {
    href: "/stories#example-story",
    eyebrow: "Member story",
    title: "Amina found the people she calls first",
    tone: "ym-menu-feature--jade",
  },
  {
    href: "/neighbornets#upcoming-events",
    eyebrow: "Upcoming events",
    title: "Find your next place to show up",
    tone: "ym-menu-feature--brass",
  },
] as const;

/**
 * The permanent site menu. Base UI supplies focus trapping, Escape-to-close,
 * focus restoration and page inerting; the YM layer supplies the full-screen
 * art direction and center-out reveal.
 */
export function SideNav() {
  const [open, setOpen] = useState(false);
  const [revealOrigin, setRevealOrigin] = useState({ x: 0, y: 0 });
  const triggerRef = useRef<HTMLButtonElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    if (!open) return;

    // Fundraise Up injects its local test-mode bar after <body> at the maximum
    // z-index. Hide only that development chrome while the menu owns the top
    // layer, then restore the exact inline value on close.
    const testPanel = document.getElementById("test-panel");
    if (!testPanel) return;

    const previousVisibility = testPanel.style.getPropertyValue("visibility");
    const previousPriority = testPanel.style.getPropertyPriority("visibility");
    testPanel.style.setProperty("visibility", "hidden", "important");

    return () => {
      if (previousVisibility) {
        testPanel.style.setProperty(
          "visibility",
          previousVisibility,
          previousPriority,
        );
      } else {
        testPanel.style.removeProperty("visibility");
      }
    };
  }, [open]);

  const closeMenu = () => setOpen(false);
  const handleOpenChange = (nextOpen: boolean) => {
    if (nextOpen && triggerRef.current) {
      const bounds = triggerRef.current.getBoundingClientRect();
      setRevealOrigin({
        x: bounds.left + bounds.width / 2,
        y: bounds.top + bounds.height / 2,
      });
    }

    setOpen(nextOpen);
  };

  const popupStyle = {
    "--menu-origin-x": `${revealOrigin.x}px`,
    "--menu-origin-y": `${revealOrigin.y}px`,
  } as CSSProperties;

  return (
    <Dialog.Root open={open} onOpenChange={handleOpenChange}>
      <Dialog.Trigger
        ref={triggerRef}
        data-menu-trigger
        aria-label="Open menu"
        className="rounded-xs p-2 text-foreground outline-none hover:opacity-60 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
      >
        <Menu className="size-6" strokeWidth={2.5} aria-hidden />
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Backdrop className="fixed inset-0 z-50 bg-brand-obsidian/20" />
        <Dialog.Popup className="ym-menu-popup" style={popupStyle}>
          <div className="ym-menu-surface" aria-hidden />

          <div className="ym-menu-content">
            <div className="ym-menu-topbar">
              <Dialog.Title className="sr-only">Site menu</Dialog.Title>
              <span aria-hidden />
              <Link
                href="/"
                aria-label="Young Muslims, home"
                onClick={closeMenu}
                className="ym-menu-logo"
              >
                <Logo className="h-5" aria-hidden />
              </Link>
              <Dialog.Close aria-label="Close menu" className="ym-menu-close">
                <X className="size-7" strokeWidth={2} aria-hidden />
              </Dialog.Close>
            </div>

            <div className="ym-menu-layout">
              <div className="flex min-h-0 flex-col justify-between gap-10">
                <nav aria-label="Main menu">
                  <ul className="ym-menu-link-list ym-menu-primary-list">
                    {primaryLinks.map((link) => {
                      const isCurrent = pathname.startsWith(link.href);

                      return (
                        <li key={link.href}>
                          <Link
                            href={link.href}
                            onClick={closeMenu}
                            aria-current={isCurrent ? "page" : undefined}
                            className="ym-menu-primary-link"
                          >
                            {link.label}
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </nav>

                <nav aria-label="More pages">
                  <p className="mb-5 text-nav font-bold text-brand-pure-white/50">
                    More to explore
                  </p>
                  <ul className="ym-menu-link-list ym-menu-secondary-list">
                    {secondaryLinks.map((link) => {
                      const isCurrent = pathname.startsWith(link.href);

                      return (
                        <li key={link.href}>
                          <Link
                            href={link.href}
                            onClick={closeMenu}
                            aria-current={isCurrent ? "page" : undefined}
                            className="ym-menu-secondary-link"
                          >
                            <span>{link.label}</span>
                            <ArrowUpRight
                              className="size-5 shrink-0"
                              strokeWidth={1.75}
                              aria-hidden
                            />
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </nav>
              </div>

              <aside aria-label="Featured links" className="ym-menu-features">
                {featureLinks.map((feature) => (
                  <Link
                    key={feature.href}
                    href={feature.href}
                    onClick={closeMenu}
                    className={`group ym-menu-feature ${feature.tone}`}
                  >
                    <span className="text-nav font-bold opacity-65">
                      {feature.eyebrow}
                    </span>
                    <span className="mt-auto flex items-end justify-between gap-5">
                      <span className="max-w-sm text-card-title font-semibold">
                        {feature.title}
                      </span>
                      <ArrowUpRight
                        className="size-6 shrink-0 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
                        strokeWidth={1.75}
                        aria-hidden
                      />
                    </span>
                  </Link>
                ))}
              </aside>
            </div>
          </div>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
