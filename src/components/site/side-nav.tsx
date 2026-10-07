"use client";

import { Dialog } from "@base-ui/react/dialog";
import { ArrowUpRight, Menu, X } from "lucide-react";
import Image, { type StaticImageData } from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { type CSSProperties, useEffect, useRef, useState } from "react";

import menuMarkBottom from "../../../design-assets/figma/landing-2026/card-decor-bottom.svg";
import menuMarkTop from "../../../design-assets/figma/landing-2026/card-decor-top.svg";
import facebookIcon from "../../../design-assets/figma/landing-2026/new-sections/footer-facebook.svg";
import instagramIcon from "../../../design-assets/figma/landing-2026/new-sections/footer-instagram.svg";
import xIcon from "../../../design-assets/figma/landing-2026/new-sections/footer-x.svg";
import youtubeIcon from "../../../design-assets/figma/landing-2026/new-sections/footer-youtube.svg";
import { Logo } from "./logo";
import { ctaLink, drawerOnlyLinks, primaryLinks } from "./nav-links";

const menuPrimaryLinks = [
  { ...ctaLink, label: "Chapters" },
  ...primaryLinks,
] as const;

const socialIcons: ReadonlyArray<{ label: string; src: StaticImageData }> = [
  { label: "Facebook", src: facebookIcon },
  { label: "X", src: xIcon },
  { label: "YouTube", src: youtubeIcon },
  { label: "Instagram", src: instagramIcon },
];

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
        <Dialog.Backdrop className="ym-menu-backdrop" />
        <Dialog.Popup className="ym-menu-popup" style={popupStyle}>
          <div className="ym-menu-surface" aria-hidden />

          <div className="ym-menu-content">
            <div className="ym-menu-decoration" aria-hidden>
              <Image
                src={menuMarkTop}
                alt=""
                className="ym-menu-mark ym-menu-mark--top"
              />
              <Image
                src={menuMarkBottom}
                alt=""
                className="ym-menu-mark ym-menu-mark--bottom"
              />
            </div>

            <div className="ym-menu-topbar">
              <Dialog.Title className="sr-only">Site menu</Dialog.Title>
              <Link
                href="/"
                aria-label="Young Muslims, home"
                onClick={closeMenu}
                className="ym-menu-logo"
              >
                <Logo className="h-5" aria-hidden />
              </Link>
              <Dialog.Close aria-label="Close menu" className="ym-menu-close">
                <X className="size-8" strokeWidth={2} aria-hidden />
              </Dialog.Close>
            </div>

            <div className="ym-menu-layout">
              <div className="flex min-h-0 flex-col justify-between gap-10">
                <nav aria-label="Main menu">
                  <ul className="ym-menu-link-list ym-menu-primary-list">
                    {menuPrimaryLinks.map((link) => {
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
              </div>

              <div className="ym-menu-footer">
                <nav aria-label="More pages">
                  <ul className="ym-menu-link-list ym-menu-secondary-list">
                    {drawerOnlyLinks.map((link) => {
                      const isCurrent =
                        link.label !== "Contact" &&
                        pathname.startsWith(link.href);

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
                              className="size-6 shrink-0"
                              strokeWidth={1.75}
                              aria-hidden
                            />
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </nav>

                <ul className="ym-menu-socials" aria-label="Social media">
                  {socialIcons.map((social) => (
                    <li key={social.label}>
                      <Image src={social.src} alt={social.label} />
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
