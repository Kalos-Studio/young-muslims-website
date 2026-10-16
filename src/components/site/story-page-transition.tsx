"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { motion, useAnimationControls, useReducedMotion } from "motion/react";

type StoryTransitionDetail = {
  href: string;
  src: string;
  color: string;
  bounds: { left: number; top: number; width: number; height: number };
};

const EVENT_NAME = "ym:story-page-transition";

export function useStoryPageNavigation() {
  const reduceMotion = useReducedMotion();

  return useCallback(
    (
      href: string,
      src: string,
      color: string,
      bounds: DOMRect,
      event: { preventDefault: () => void },
    ) => {
      if (
        reduceMotion ||
        window.matchMedia("(prefers-reduced-motion: reduce)").matches
      ) {
        return;
      }

      event.preventDefault();
      window.dispatchEvent(
        new CustomEvent<StoryTransitionDetail>(EVENT_NAME, {
          detail: {
            href,
            src,
            color,
            bounds: {
              left: bounds.left,
              top: bounds.top,
              width: bounds.width,
              height: bounds.height,
            },
          },
        }),
      );
    },
    [reduceMotion],
  );
}

export function StoryPageTransition() {
  const router = useRouter();
  const pathname = usePathname();
  const reduceMotion = useReducedMotion();
  const controls = useAnimationControls();
  const [transition, setTransition] = useState<StoryTransitionDetail | null>(
    null,
  );
  const navigationStarted = useRef(false);

  useEffect(() => {
    const beginTransition = (event: Event) => {
      const { detail } = event as CustomEvent<StoryTransitionDetail>;
      if (reduceMotion || navigationStarted.current) return;

      navigationStarted.current = true;
      setTransition(detail);

      const centerX = detail.bounds.left + detail.bounds.width / 2;
      const centerY = detail.bounds.top + detail.bounds.height / 2;
      const scaleToCoverViewport =
        Math.max(
          (2 * Math.max(centerX, window.innerWidth - centerX)) /
            detail.bounds.width,
          (2 * Math.max(centerY, window.innerHeight - centerY)) /
            detail.bounds.height,
        ) * 1.15;

      requestAnimationFrame(() => {
        void controls
          .start({
            scale: scaleToCoverViewport,
            transition: { duration: 0.58, ease: [0.22, 1, 0.36, 1] },
          })
          .then(() => router.push(detail.href));
      });
    };

    window.addEventListener(EVENT_NAME, beginTransition);
    return () => window.removeEventListener(EVENT_NAME, beginTransition);
  }, [controls, reduceMotion, router]);

  useEffect(() => {
    if (!transition || !navigationStarted.current) return;
    const targetPath = new URL(transition.href, window.location.origin)
      .pathname;
    if (pathname !== targetPath) return;

    void controls
      .start({ opacity: 0, transition: { duration: 0.3, ease: "easeOut" } })
      .then(() => {
        setTransition(null);
        navigationStarted.current = false;
      });
  }, [controls, pathname, transition]);

  if (!transition) return null;

  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none fixed z-[100] bg-brand-royal"
      initial={false}
      animate={controls}
      style={{
        left: transition.bounds.left,
        top: transition.bounds.top,
        width: transition.bounds.width,
        height: transition.bounds.height,
        scale: 1,
        opacity: 1,
        backgroundColor: transition.color,
        transformOrigin: "center center",
        willChange: "transform, opacity",
        maskImage: `url("${transition.src}")`,
        WebkitMaskImage: `url("${transition.src}")`,
        maskMode: "alpha",
        maskSize: "100% 100%",
        WebkitMaskSize: "100% 100%",
        maskRepeat: "no-repeat",
        WebkitMaskRepeat: "no-repeat",
      }}
    />
  );
}
