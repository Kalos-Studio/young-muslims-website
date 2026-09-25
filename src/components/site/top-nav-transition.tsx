"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ComponentProps,
  type CSSProperties,
  type ReactNode,
} from "react";

const COVER_DURATION = 800;
const PRESENT_DURATION = 260;
const REVEAL_DURATION = 800;

type TransitionPhase =
  "idle" | "covering" | "covered" | "presenting" | "uncovering";

type TransitionState = {
  phase: TransitionPhase;
  originX: number;
  originY: number;
  targetPathname: string;
  targetBackground: string;
};

type StartNavigation = (href: string, trigger: HTMLAnchorElement) => void;

const TopNavTransitionContext = createContext<StartNavigation | null>(null);

const initialState: TransitionState = {
  phase: "idle",
  originX: 0,
  originY: 0,
  targetPathname: "",
  targetBackground: "var(--color-brand-warm-snow)",
};

const PAGE_BACKGROUNDS: Record<string, string> = {
  "/": "var(--color-brothers-midnight)",
  "/about": "var(--color-brand-warm-snow)",
  "/stories": "var(--color-brand-warm-snow)",
  "/support": "var(--color-brand-warm-snow)",
  "/neighbornets": "var(--color-brand-warm-snow)",
};

function capturePageText(layer: HTMLDivElement) {
  const page = document.querySelector<HTMLElement>("[data-page-shell] main");
  if (!page) return;

  const bounds = page.getBoundingClientRect();
  const snapshot = page.cloneNode(true) as HTMLElement;
  const snapshotElements = [
    snapshot,
    ...snapshot.querySelectorAll<HTMLElement>("*"),
  ];

  snapshot.classList.add("ym-route-transition-text-snapshot");
  snapshot.removeAttribute("id");
  snapshot.setAttribute("aria-hidden", "true");
  snapshot.style.setProperty("position", "absolute", "important");
  snapshot.style.setProperty("top", `${bounds.top}px`, "important");
  snapshot.style.setProperty("left", `${bounds.left}px`, "important");
  snapshot.style.setProperty("width", `${bounds.width}px`, "important");
  snapshot.style.setProperty("height", `${page.scrollHeight}px`, "important");
  snapshot.style.setProperty("margin", "0", "important");

  for (const element of snapshotElements) {
    element.removeAttribute("id");
    element.style.setProperty("background", "transparent", "important");
    element.style.setProperty("background-image", "none", "important");
    element.style.setProperty("border-color", "transparent", "important");
    element.style.setProperty("box-shadow", "none", "important");
    element.style.setProperty("animation", "none", "important");
    element.style.setProperty("transition", "none", "important");

    if (
      element.matches(
        "img, picture, video, canvas, svg, iframe, input, select, textarea",
      ) ||
      !element.textContent?.trim()
    ) {
      element.style.setProperty("visibility", "hidden", "important");
    }
  }

  layer.replaceChildren(snapshot);
}

/**
 * Owns the full-screen transition without wrapping the page content in a
 * client component. Keeping it in the root layout means it survives route
 * changes and can reveal the destination after navigation has completed.
 */
export function TopNavTransitionProvider({
  children,
}: {
  children: ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const coverTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const textLayer = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<TransitionState>(initialState);

  const startNavigation = useCallback<StartNavigation>(
    (href, trigger) => {
      if (state.phase !== "idle") return;

      const destination = new URL(href, window.location.href);
      const isCurrentLocation =
        destination.pathname === window.location.pathname &&
        destination.search === window.location.search;

      if (isCurrentLocation) {
        router.push(href);
        return;
      }

      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        router.push(href);
        return;
      }

      const bounds = trigger.getBoundingClientRect();
      setState({
        phase: "covering",
        originX: bounds.left + bounds.width / 2,
        originY: bounds.top + bounds.height / 2,
        targetPathname: destination.pathname,
        targetBackground:
          PAGE_BACKGROUNDS[destination.pathname] ??
          "var(--color-brand-warm-snow)",
      });

      coverTimer.current = setTimeout(() => {
        setState((current) => ({ ...current, phase: "covered" }));
        router.push(href);
      }, COVER_DURATION);
    },
    [router, state.phase],
  );

  useEffect(() => {
    if (state.phase !== "covered" || pathname !== state.targetPathname) return;

    let secondFrame: number | null = null;
    const frame = requestAnimationFrame(() => {
      secondFrame = requestAnimationFrame(() => {
        if (textLayer.current) capturePageText(textLayer.current);
        setState((current) => ({ ...current, phase: "presenting" }));
      });
    });

    return () => {
      cancelAnimationFrame(frame);
      if (secondFrame !== null) cancelAnimationFrame(secondFrame);
    };
  }, [pathname, state.phase, state.targetPathname]);

  useEffect(() => {
    if (state.phase !== "presenting") return;

    const presentTimer = setTimeout(
      () => setState((current) => ({ ...current, phase: "uncovering" })),
      PRESENT_DURATION,
    );
    return () => clearTimeout(presentTimer);
  }, [state.phase]);

  useEffect(() => {
    if (state.phase !== "uncovering") return;

    const revealTimer = setTimeout(
      () => setState(initialState),
      REVEAL_DURATION,
    );
    return () => clearTimeout(revealTimer);
  }, [state.phase]);

  useEffect(() => {
    if (state.phase === "idle") textLayer.current?.replaceChildren();
  }, [state.phase]);

  useEffect(
    () => () => {
      if (coverTimer.current) clearTimeout(coverTimer.current);
    },
    [],
  );

  // Fundraise Up's test panel uses the maximum z-index. Hide it only while the
  // route mask is active so it cannot sit above the transition.
  useEffect(() => {
    if (state.phase === "idle") return;

    const panel = document.getElementById("fundraise-up-test-mode-panel");
    if (!panel) return;

    const previousVisibility = panel.style.visibility;
    panel.style.visibility = "hidden";
    return () => {
      panel.style.visibility = previousVisibility;
    };
  }, [state.phase]);

  const transitionStyle = {
    "--ym-route-origin-x": `${state.originX}px`,
    "--ym-route-origin-y": `${state.originY}px`,
    "--ym-route-background": state.targetBackground,
  } as CSSProperties;

  return (
    <TopNavTransitionContext.Provider value={startNavigation}>
      {children}
      <div
        aria-hidden="true"
        className="ym-route-transition"
        data-phase={state.phase}
        style={transitionStyle}
      >
        <div className="ym-route-transition-shape" />
        <div ref={textLayer} className="ym-route-transition-text" />
      </div>
    </TopNavTransitionContext.Provider>
  );
}

type TopNavLinkProps = Omit<
  ComponentProps<typeof Link>,
  "href" | "onNavigate"
> & {
  href: string;
};

/** A Link that opts into the transition reserved for the persistent header. */
export function TopNavLink({ href, ...props }: TopNavLinkProps) {
  const startNavigation = useContext(TopNavTransitionContext);
  const linkRef = useRef<HTMLAnchorElement>(null);

  return (
    <Link
      {...props}
      ref={linkRef}
      href={href}
      onNavigate={(event) => {
        if (!startNavigation || !linkRef.current) return;

        const destination = new URL(href, window.location.href);
        if (
          destination.pathname === window.location.pathname &&
          destination.search === window.location.search
        ) {
          return;
        }

        event.preventDefault();
        startNavigation(href, linkRef.current);
      }}
    />
  );
}
