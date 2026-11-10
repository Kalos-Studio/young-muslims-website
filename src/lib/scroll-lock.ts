/**
 * Locks the page's scroll, for a mode that takes over the viewport without
 * covering it (the NeighborNets map while a state or net is open), and
 * returns the unlock.
 *
 * - `<html>` gets `overflow: hidden`: the flag Lenis (`prevent`) and the
 *   footer Easter egg already stand down for, as they do for the entry
 *   screen. `scrollbar-gutter: stable` keeps the layout from shifting where
 *   the scrollbar takes space.
 * - On touch devices the body is also fixed in place at the current scroll
 *   (`position: fixed`, `top` at minus the scroll): iOS Safari scrolls the
 *   page under `overflow: hidden` alone. Unlocking restores the body and
 *   scrolls back to exactly where the page was, in the same task, so nothing
 *   paints in between. Desktop keeps the plain lock: a fixed body resets
 *   `scrollY` to 0, which scroll-driven effects would read as the page's top.
 *
 * Base UI's menu and dialogs keep their own lock (they wait while this one
 * holds the page). Not reentrant: one holder at a time.
 */
export function lockPageScroll(): () => void {
  const html = document.documentElement;
  const body = document.body;
  const x = window.scrollX;
  const y = window.scrollY;
  const fixBody = window.matchMedia("(pointer: coarse)").matches;
  const saved = {
    overflow: html.style.overflow,
    gutter: html.style.scrollbarGutter,
    position: body.style.position,
    top: body.style.top,
    left: body.style.left,
    right: body.style.right,
    width: body.style.width,
  };

  html.style.scrollbarGutter = "stable";
  html.style.overflow = "hidden";
  if (fixBody) {
    Object.assign(body.style, {
      position: "fixed",
      top: `${-y}px`,
      left: "0",
      right: "0",
      width: "100%",
    });
  }

  return () => {
    html.style.overflow = saved.overflow;
    html.style.scrollbarGutter = saved.gutter;
    if (fixBody) {
      Object.assign(body.style, {
        position: saved.position,
        top: saved.top,
        left: saved.left,
        right: saved.right,
        width: saved.width,
      });
      window.scrollTo({ left: x, top: y, behavior: "instant" });
    }
  };
}
