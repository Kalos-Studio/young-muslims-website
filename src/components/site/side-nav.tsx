"use client";

import { Dialog } from "@base-ui/react/dialog";
import Image, { type StaticImageData } from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { type CSSProperties, useEffect, useRef, useState } from "react";

import { AnimatedArrow } from "@/components/ui/animated-arrow";
import { MaterialIcon } from "@/components/ui/material-icon";

import menuMarkFilled from "../../../design-assets/figma/menu/menu-mark-ym.svg";
import menuMarkOutline from "../../../design-assets/figma/menu/menu-mark-ym-outline.svg";
import facebookIcon from "../../../design-assets/figma/landing-2026/new-sections/footer-facebook.svg";
import instagramIcon from "../../../design-assets/figma/landing-2026/new-sections/footer-instagram.svg";
import xIcon from "../../../design-assets/figma/landing-2026/new-sections/footer-x.svg";
import youtubeIcon from "../../../design-assets/figma/landing-2026/new-sections/footer-youtube.svg";
import { Logo } from "./logo";
import { MenuToggleIcon } from "./menu-toggle-icon";
import { getNavigationItems, isNavigationItemCurrent } from "./nav-links";

const menuPrimaryLinks = getNavigationItems("drawer-primary");
const menuSecondaryLinks = getNavigationItems("drawer-secondary");

const socialIcons: ReadonlyArray<{
  href: string;
  label: string;
  src: StaticImageData;
}> = [
  {
    href: "https://www.facebook.com/youngmuslims",
    label: "Facebook",
    src: facebookIcon,
  },
  {
    href: "https://twitter.com/youngmuslims",
    label: "X",
    src: xIcon,
  },
  {
    href: "https://www.youtube.com/youngmuslims",
    label: "YouTube",
    src: youtubeIcon,
  },
  {
    href: "https://www.instagram.com/young_muslims/",
    label: "Instagram",
    src: instagramIcon,
  },
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

  // The monograms mount only when the menu opens. Warm the browser cache once
  // after load so the reveal shows them immediately instead of popping in.
  useEffect(() => {
    for (const mark of [menuMarkFilled, menuMarkOutline]) {
      const image = new window.Image();
      image.src = mark.src;
    }
  }, []);

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
        aria-label={open ? "Close menu" : "Open menu"}
        className="block cursor-pointer text-brand-pure-white outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-pure-white"
      >
        <MenuToggleIcon open={open} />
      </Dialog.Trigger>

      <Dialog.Portal>
        {/* Invisible click-outside catcher. The circle reveal is the whole
            visible surface, so this has no background. It must stack above
            the page's positioned layers; Base UI's own internal backdrop
            does not, so clicks outside the growing circle would otherwise
            land on the inert page and not close the menu. */}
        <Dialog.Backdrop className="ym-menu-backdrop" />
        <Dialog.Popup className="ym-menu-popup" style={popupStyle}>
          {/* Outside the content so the monograms stay anchored to the
              viewport and bleed off its edges. */}
          <div className="ym-menu-decoration" aria-hidden>
            <Image
              src={menuMarkFilled}
              alt=""
              loading="eager"
              className="ym-menu-mark ym-menu-mark--filled"
            />
            <Image
              src={menuMarkOutline}
              alt=""
              loading="eager"
              className="ym-menu-mark ym-menu-mark--outline"
            />
          </div>

          <div className="ym-menu-content">
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
                {/* The icon's size is inline, so each breakpoint gets its own:
                    24px in the 40px mobile square, 32px in the 54px square.
                    Flex wrappers avoid the inline baseline gap that pushed
                    the glyph above centre. */}
                <span className="flex md:hidden">
                  <MaterialIcon name="close" size={24} aria-hidden />
                </span>
                <span className="hidden md:flex">
                  <MaterialIcon name="close" size={32} aria-hidden />
                </span>
              </Dialog.Close>
            </div>

            <div className="ym-menu-layout">
              <div className="flex min-h-0 flex-col justify-between gap-10">
                <nav aria-label="Main menu">
                  <ul className="ym-menu-link-list ym-menu-primary-list">
                    {menuPrimaryLinks.map((link) => {
                      const isCurrent = isNavigationItemCurrent(link, pathname);

                      return (
                        <li key={link.id}>
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
                    {menuSecondaryLinks.map((link) => {
                      const isCurrent = isNavigationItemCurrent(link, pathname);

                      return (
                        <li key={link.id}>
                          <Link
                            href={link.href}
                            onClick={closeMenu}
                            aria-current={isCurrent ? "page" : undefined}
                            className="ym-cta-trigger ym-menu-secondary-link"
                          >
                            <span className="ym-cta-roll">
                              <span
                                className="ym-cta-roll__text"
                                data-text={link.label}
                              >
                                {link.label}
                              </span>
                            </span>
                            {/* 18px arrows on mobile, 24px from `md`. */}
                            <span className="md:hidden">
                              <AnimatedArrow size={18} />
                            </span>
                            <span className="hidden md:block">
                              <AnimatedArrow />
                            </span>
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </nav>

                <ul className="ym-menu-socials" aria-label="Social media">
                  {socialIcons.map((social) => (
                    <li key={social.label}>
                      <a
                        href={social.href}
                        target="_blank"
                        rel="noreferrer"
                        aria-label={`${social.label} (opens in a new tab)`}
                        className="ym-menu-social-link"
                      >
                        <Image src={social.src} alt="" aria-hidden />
                      </a>
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
