"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { createPortal } from "react-dom";
import { usePathname, useRouter } from "next/navigation";

import { cn } from "@/lib/utils";

import {
  BlobReveal,
  pickBlobRevealOrigin,
  readTimeToken,
  type BlobRevealDirection,
} from "./blob-reveal";
import { YmComposition } from "./ym-composition";
import styles from "./page-transition.module.css";
import { startSmoothScroll, stopSmoothScroll } from "./smooth-scroll-provider";

/**
 * The cover colours: the full brand palette (brand, Brothers and Sisters
 * families). `token` is read at runtime to choose the composition colour.
 */
const COVER_COLORS = [
  { token: "--color-brand-obsidian", className: "bg-brand-obsidian" },
  { token: "--color-brand-warm-snow", className: "bg-brand-warm-snow" },
  { token: "--color-brand-royal", className: "bg-brand-royal" },
  { token: "--color-brand-jade", className: "bg-brand-jade" },
  { token: "--color-brand-pure-white", className: "bg-brand-pure-white" },
  { token: "--color-brothers-midnight", className: "bg-brothers-midnight" },
  { token: "--color-brothers-slate", className: "bg-brothers-slate" },
  { token: "--color-brothers-sky", className: "bg-brothers-sky" },
  { token: "--color-sisters-forest", className: "bg-sisters-forest" },
  { token: "--color-sisters-brass", className: "bg-sisters-brass" },
  { token: "--color-sisters-buttercup", className: "bg-sisters-buttercup" },
] as const;

type CoverColor = (typeof COVER_COLORS)[number];

/** The reveal continues the cover's direction of travel: one sweep through. */
const OPPOSITE: Record<BlobRevealDirection, BlobRevealDirection> = {
  top: "bottom",
  bottom: "top",
  left: "right",
  right: "left",
  "top-left": "bottom-right",
  "top-right": "bottom-left",
  "bottom-left": "top-right",
  "bottom-right": "top-left",
};

type Phase = "entering" | "covering" | "holding" | "revealing";

type ActiveTransition = {
  href: string;
  pathname: string;
  origin: BlobRevealDirection;
  color: CoverColor;
  darkLogo: boolean;
};

/**
 * WCAG relative luminance of a colour token. The token's value can be in any
 * CSS colour form (production CSS shortens `#ffffff` to `#fff`), so it is
 * normalised to `#rrggbb` through a canvas context's `fillStyle` first.
 */
function tokenLuminance(token: string) {
  const value = getComputedStyle(document.documentElement)
    .getPropertyValue(token)
    .trim();
  const context = document.createElement("canvas").getContext("2d");
  if (context) context.fillStyle = value;
  const normalised = String(context?.fillStyle ?? "");
  const hex = normalised.match(/^#([\da-f]{2})([\da-f]{2})([\da-f]{2})$/i);
  const channels = hex
    ? hex.slice(1).map((part) => Number.parseInt(part, 16))
    : [0, 0, 0];
  const [r, g, b] = channels.map((channel) => {
    const c = channel / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function readNumberToken(name: string, fallback: number) {
  const value = Number.parseFloat(
    getComputedStyle(document.documentElement).getPropertyValue(name),
  );
  return Number.isNaN(value) ? fallback : value;
}

/** Waits for fonts and the destination's visible images, within a budget. */
async function waitForDestination(budgetMs: number) {
  const visibleImages = Array.from(
    document.querySelectorAll<HTMLImageElement>("[data-page-shell] img"),
  ).filter((image) => {
    const bounds = image.getBoundingClientRect();
    return bounds.bottom > 0 && bounds.top < window.innerHeight;
  });
  const ready = Promise.all([
    document.fonts.ready,
    ...visibleImages.map((image) =>
      image.complete
        ? image.decode().catch(() => undefined)
        : new Promise<void>((resolve) => {
            image.addEventListener("load", () => resolve(), { once: true });
            image.addEventListener("error", () => resolve(), { once: true });
          }),
    ),
  ]);
  await Promise.race([
    ready,
    new Promise((resolve) => window.setTimeout(resolve, budgetMs)),
  ]);
}

/** Whether a click on this anchor should play the page transition. */
function transitionUrlFor(event: MouseEvent) {
  if (
    event.defaultPrevented ||
    event.button !== 0 ||
    event.metaKey ||
    event.ctrlKey ||
    event.shiftKey ||
    event.altKey
  ) {
    return null;
  }
  const target = event.target;
  const anchor = target instanceof Element ? target.closest("a[href]") : null;
  if (!(anchor instanceof HTMLAnchorElement)) return null;
  if (anchor.target && anchor.target !== "_self") return null;
  if (anchor.hasAttribute("download")) return null;
  if (anchor.closest('[data-page-transition="off"]')) return null;

  const url = new URL(anchor.href, window.location.href);
  if (url.origin !== window.location.origin) return null;
  // Same page (a #hash or a query change, e.g. the Stories panel): leave it.
  if (url.pathname === window.location.pathname) return null;
  return url;
}

/**
 * Page transition for client-side navigation.
 *
 * A capture-phase click listener on the document takes over internal link
 * clicks: it calls `preventDefault()`, which makes next/link skip its own
 * navigation while every other click handler (such as the menu closing
 * itself) still runs. A blob in a random brand colour, with the entry's
 * stacked YM composition centred in one solid contrasting colour (Obsidian or
 * Warm Snow, by luminance), sweeps in from a random direction using
 * BlobReveal. Once it covers the viewport the app navigates with
 * `router.push` inside a transition, holds while that transition is pending
 * and the destination's visible images load (capped by the max-hold token),
 * then the same blob continues across and off-screen, revealing the new page.
 *
 * Not intercepted: modified clicks, new-tab and download links, external
 * links, same-page links, links inside `[data-page-transition="off"]` (the
 * Stories portraits, which have their own transition), back/forward
 * navigation, clicks while the entry animation plays, and everything under
 * reduced motion, where links navigate directly.
 *
 * Scroll: Lenis is stopped for the duration (cancelling momentum, so it
 * cannot fight Next's scroll-to-top) and restarted re-synced afterwards. The
 * `<html>` overflow flag is not used, because Base UI's menu scroll lock also
 * writes it.
 */
export function PageTransition() {
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();
  const [active, setActive] = useState<ActiveTransition | null>(null);
  const [phase, setPhase] = useState<Phase>("entering");
  const activeRef = useRef(false);
  const sawPending = useRef(false);
  const holdStartedAt = useRef(0);

  // Intercept internal link clicks.
  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      const url = transitionUrlFor(event);
      if (!url) return;
      if (activeRef.current) {
        // A transition is already running; ignore further navigations.
        event.preventDefault();
        return;
      }
      if (document.querySelector("[data-entry-animation]")) return;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        return;
      }

      event.preventDefault();
      activeRef.current = true;
      sawPending.current = false;
      stopSmoothScroll();

      const color =
        COVER_COLORS[Math.floor(Math.random() * COVER_COLORS.length)];
      setPhase("entering");
      setActive({
        href: url.pathname + url.search + url.hash,
        pathname: url.pathname,
        origin: pickBlobRevealOrigin(),
        color,
        darkLogo:
          tokenLuminance(color.token) >
          readNumberToken("--page-transition-contrast-threshold", 0.195),
      });
    };

    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, []);

  // Once the off-screen pose has painted, sweep the blob in.
  useEffect(() => {
    if (!active || phase !== "entering") return;
    let second = 0;
    const first = window.requestAnimationFrame(() => {
      second = window.requestAnimationFrame(() => setPhase("covering"));
    });
    return () => {
      window.cancelAnimationFrame(first);
      window.cancelAnimationFrame(second);
    };
  }, [active, phase]);

  // Covered: navigate.
  const onCovered = () => {
    if (!active) return;
    holdStartedAt.current = performance.now();
    setPhase("holding");
    startTransition(() => router.push(active.href));
  };

  // Remember that the navigation went pending, so its end can be detected.
  useEffect(() => {
    if (isPending) sawPending.current = true;
  }, [isPending]);

  // Hold until the destination has committed and painted, within the cap.
  useEffect(() => {
    if (!active || phase !== "holding") return;
    const maxHold = readTimeToken("--duration-page-transition-max-hold", 3000);
    const elapsed = () => performance.now() - holdStartedAt.current;
    let cancelled = false;
    const reveal = () => {
      if (!cancelled) setPhase("revealing");
    };

    const committed =
      (sawPending.current && !isPending) || pathname === active.pathname;
    const cap = window.setTimeout(reveal, Math.max(0, maxHold - elapsed()));
    if (committed) {
      // Let the new route paint, then wait for its fonts and visible images.
      window.requestAnimationFrame(() => {
        void waitForDestination(Math.max(0, maxHold - elapsed())).then(reveal);
      });
    }
    return () => {
      cancelled = true;
      window.clearTimeout(cap);
    };
  }, [active, phase, isPending, pathname]);

  const onRevealed = () => {
    activeRef.current = false;
    setActive(null);
    startSmoothScroll();
  };

  // Never leave smooth scrolling stopped if this unmounts mid-transition.
  useEffect(() => () => startSmoothScroll(), []);

  if (!active) return null;

  return createPortal(
    <BlobReveal
      aria-hidden="true"
      data-page-transition-cover
      revealing={phase === "entering" || phase === "revealing"}
      origin={phase === "revealing" ? OPPOSITE[active.origin] : active.origin}
      onCovered={onCovered}
      onRevealed={onRevealed}
      className={cn(styles.cover, active.color.className)}
    >
      {/* The entry's stacked composition in one solid contrast colour. */}
      <YmComposition
        variant="solid"
        className={
          active.darkLogo ? "text-brand-obsidian" : "text-brand-warm-snow"
        }
      />
    </BlobReveal>,
    document.body,
  );
}
