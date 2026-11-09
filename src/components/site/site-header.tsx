"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { motion } from "motion/react";

import { useFooterPageStage } from "./footer-page-stage";
import styles from "./site-header.module.css";
import { cn } from "@/lib/utils";

/**
 * The fixed site header shell. The bar itself (`SiteNavigation`) is
 * server-rendered and passed in; this narrow client boundary owns only two
 * behaviors:
 *
 * 1. It follows the footer Easter egg's page translation (`pageY`), so the
 *    header moves with the page like before.
 * 2. It shows the gradient scrim once the page's hero is no longer behind it.
 *
 * Scrim trigger: each page marks its dark hero with `data-header-hero`. An
 * IntersectionObserver watches that element, with the root's top edge pulled
 * down by the header's own height. The scrim is off while any of the hero is
 * still behind the header, and on once the hero has scrolled past it. Pages
 * with no marked hero keep the scrim on, so the white navigation is always
 * legible; a hero that streams in later is picked up when it appears. Lenis
 * drives real window scrolling, so the observer stays in sync with it.
 *
 * The scrim is a CSS gradient (Deep Obsidian at 65% easing out to clear, reaching below the bar so no edge shows; site-header.module.css),
 * matching the Figma navigation's raster gradient, which measures about 67%.
 * Its fade is disabled under reduced motion.
 */
export function SiteHeader({ children }: { children: ReactNode }) {
  const { pageY } = useFooterPageStage();
  const pathname = usePathname();
  const headerRef = useRef<HTMLElement>(null);
  const [scrim, setScrim] = useState(false);

  useEffect(() => {
    const header = headerRef.current;
    if (!header) return;

    let hero: HTMLElement | null = null;
    let heroObserver: IntersectionObserver | undefined;

    // The header is 80px on mobile and 97px from `md` up, so the observer is
    // rebuilt whenever its height changes.
    const observeHero = () => {
      heroObserver?.disconnect();
      if (!hero) return;
      heroObserver = new IntersectionObserver(
        ([entry]) => setScrim(!entry.isIntersecting),
        { rootMargin: `-${Math.round(header.offsetHeight)}px 0px 0px 0px` },
      );
      heroObserver.observe(hero);
    };

    // Re-target whenever the marked hero changes. A hero can arrive after
    // this effect runs or be replaced by React (Stories renders its hero
    // inside a Suspense boundary that can re-create it on the client), and an
    // observer left on a detached node would never report again.
    const syncHero = () => {
      const next = document.querySelector<HTMLElement>("[data-header-hero]");
      if (next === hero) return;
      hero = next;
      if (!hero) setScrim(true);
      observeHero();
    };

    const resizeObserver = new ResizeObserver(observeHero);
    const heroWatcher = new MutationObserver(syncHero);
    resizeObserver.observe(header);
    heroWatcher.observe(document.body, { childList: true, subtree: true });
    syncHero();
    if (!hero) setScrim(true);

    return () => {
      heroWatcher.disconnect();
      resizeObserver.disconnect();
      heroObserver?.disconnect();
    };
  }, [pathname]);

  return (
    <motion.header
      ref={headerRef}
      data-site-header
      data-scrim={scrim ? "" : undefined}
      className="group fixed inset-x-0 top-0 z-40 text-brand-pure-white"
      style={{ y: pageY }}
    >
      <span
        aria-hidden
        className={cn(
          "pointer-events-none opacity-0 transition-opacity duration-300 group-data-scrim:opacity-100 motion-reduce:transition-none",
          styles.scrim,
        )}
      />
      <div className="relative">{children}</div>
    </motion.header>
  );
}
