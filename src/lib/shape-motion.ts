/*
 * Shared motion for floating shape-photos (the landing "everywhere" section's
 * group photos and the stories snippet's headshots). Browser-only: call from
 * effects. Everything runs on the compositor: entrances are Web Animations of
 * transform and opacity, and the pointer drift sets a target transform that a
 * CSS transform transition (on the layer, in the caller's CSS) eases to.
 * Callers skip all of it under reduced motion.
 */
import { readTimeToken } from "@/components/site/blob-reveal";
import { readLengthToken } from "@/lib/motion-tokens";

export const REDUCED_MOTION = "(prefers-reduced-motion: reduce)";
const FINE_POINTER = "(hover: hover) and (pointer: fine)";

/** A token from the root, or `fallback` when it is unset. */
export function readRootToken(name: string, fallback: string) {
  return (
    getComputedStyle(document.documentElement).getPropertyValue(name).trim() ||
    fallback
  );
}

/**
 * Runs `play` once, as `element`'s top comes `rise` up from the viewport's
 * foot (15% by default, as TextReveal does), or straight away if it is
 * already past. Returns the observer, for cleanup.
 */
export function onEnter(element: Element, play: () => void, rise = "15%") {
  const observer = new IntersectionObserver(
    ([entry]) => {
      if (!entry.isIntersecting && entry.boundingClientRect.top > 0) return;
      observer.disconnect();
      play();
    },
    { rootMargin: `0px 0px -${rise} 0px` },
  );
  observer.observe(element);
  return observer;
}

/** A Web Animation created paused on its first frame (`fill: both`). */
export function pausedAnimation(
  element: Element,
  keyframes: Keyframe[],
  options: KeyframeAnimationOptions,
) {
  const animation = element.animate(keyframes, { fill: "both", ...options });
  animation.pause();
  return animation;
}

/**
 * Each shape grows from `fromScale` as it fades in, once, as it enters view.
 * The tokens name the duration, start scale and easing. Returns a cleanup.
 */
export function armShapeEntrances(
  shapes: Element[],
  tokens: { duration: string; fromScale: string; easing: string },
) {
  const fromScale = readRootToken(tokens.fromScale, "0.92");
  const options = {
    duration: readTimeToken(tokens.duration, 900),
    easing: readRootToken(tokens.easing, "ease-out"),
  };
  const animations: Animation[] = [];
  const observers = shapes.map((shape) => {
    const animation = pausedAnimation(
      shape,
      [
        { opacity: 0, transform: `scale(${fromScale})` },
        { opacity: 1, transform: "scale(1)" },
      ],
      options,
    );
    animations.push(animation);
    return onEnter(shape, () => animation.play());
  });
  return () => {
    observers.forEach((observer) => observer.disconnect());
    animations.forEach((animation) => animation.cancel());
  };
}

/**
 * With a fine pointer, and only while `area` is on screen, each layer drifts
 * towards the cursor: up to the `reach` token's length times its depth, from
 * where the cursor sits relative to the viewport's centre. Pointer moves are
 * read at most once a frame. Returns a cleanup.
 */
export function trackPointerDrift(
  area: Element,
  layers: { element: HTMLElement; depth: number }[],
  reachToken: string,
) {
  const finePointer = window.matchMedia(FINE_POINTER);
  const reach = readLengthToken(reachToken, 14);
  let frame = 0;
  let pointer: { x: number; y: number } | null = null;
  const place = () => {
    frame = 0;
    const nx = pointer ? (pointer.x / window.innerWidth - 0.5) * 2 : 0;
    const ny = pointer ? (pointer.y / window.innerHeight - 0.5) * 2 : 0;
    for (const layer of layers) {
      const x = nx * reach * layer.depth;
      const y = ny * reach * layer.depth;
      layer.element.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0)`;
    }
  };
  const onMove = (event: PointerEvent) => {
    if (event.pointerType !== "mouse") return;
    pointer = { x: event.clientX, y: event.clientY };
    if (!frame) frame = requestAnimationFrame(place);
  };
  const onLeave = () => {
    pointer = null;
    if (!frame) frame = requestAnimationFrame(place);
  };
  let listening = false;
  const listen = (on: boolean) => {
    if (on === listening) return;
    listening = on;
    if (on) {
      window.addEventListener("pointermove", onMove, { passive: true });
      document.documentElement.addEventListener("pointerleave", onLeave);
    } else {
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      onLeave();
    }
  };
  const visibility = new IntersectionObserver(([entry]) =>
    listen(entry.isIntersecting && finePointer.matches),
  );
  visibility.observe(area);
  return () => {
    visibility.disconnect();
    listen(false);
    if (frame) cancelAnimationFrame(frame);
    for (const layer of layers) layer.element.style.transform = "";
  };
}
