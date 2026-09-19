"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * Keeps the fixed landing-page header legible as differently coloured sections
 * pass beneath it. Pages opt in by marking their sections with
 * `data-header-theme="dark"` or `data-header-theme="light"`.
 */
export function HeaderContrastController() {
  const pathname = usePathname();

  useEffect(() => {
    const header = document.querySelector<HTMLElement>("[data-site-header]");

    if (!header) return;
    const siteHeader = header;

    let animationFrame: number | undefined;

    function updateTheme() {
      animationFrame = undefined;

      const sampleY = siteHeader.getBoundingClientRect().height / 2;
      const sections = document.querySelectorAll<HTMLElement>(
        "main [data-header-theme]",
      );
      const activeSection = Array.from(sections).find((section) => {
        const bounds = section.getBoundingClientRect();
        return bounds.top <= sampleY && bounds.bottom > sampleY;
      });

      if (activeSection?.dataset.headerTheme) {
        siteHeader.dataset.headerTheme = activeSection.dataset.headerTheme;
      } else {
        delete siteHeader.dataset.headerTheme;
      }
    }

    function scheduleUpdate() {
      if (animationFrame === undefined) {
        animationFrame = window.requestAnimationFrame(updateTheme);
      }
    }

    scheduleUpdate();
    window.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("resize", scheduleUpdate);

    return () => {
      window.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("resize", scheduleUpdate);
      if (animationFrame !== undefined) {
        window.cancelAnimationFrame(animationFrame);
      }
      delete siteHeader.dataset.headerTheme;
    };
  }, [pathname]);

  return null;
}
