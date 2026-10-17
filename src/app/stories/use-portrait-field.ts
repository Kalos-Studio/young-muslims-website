"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "motion/react";

import { PORTRAIT_SLOTS } from "./portrait-slots";

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

/** Pan and magnify the gallery without rerendering its portraits every frame. */
export function usePortraitField() {
  const viewportRef = useRef<HTMLDivElement>(null);
  const suppressClickRef = useRef(false);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const viewport = viewportRef.current;
    const field = viewport?.firstElementChild as HTMLDivElement | null;
    if (!viewport || !field) return;
    const portraits = [
      ...field.querySelectorAll<HTMLElement>("[data-portrait]"),
    ];
    let width = 0,
      height = 0,
      fieldWidth = 0,
      fieldHeight = 0;
    let x = 0,
      y = 0,
      targetX = 0,
      targetY = 0;
    let focusX = 0,
      focusY = 0,
      targetFocusX = 0,
      targetFocusY = 0;
    let frame = 0,
      previousTime = 0;
    let keyboardFocus = false;
    let drag: {
      id: number;
      x: number;
      y: number;
      panX: number;
      panY: number;
      moved: boolean;
    } | null = null;
    const scales = portraits.map(() => 1);
    const limits = () => ({
      minX: width - fieldWidth - 100,
      maxX: 100,
      minY: (height - fieldHeight) / 2 - 32,
      maxY: (height - fieldHeight) / 2 + 32,
    });
    const bound = () => {
      const limitsNow = limits();
      targetX = clamp(targetX, limitsNow.minX, limitsNow.maxX);
      targetY = clamp(targetY, limitsNow.minY, limitsNow.maxY);
    };
    const render = (time: number) => {
      frame = 0;
      const delta = previousTime ? Math.min(time - previousTime, 64) : 16;
      previousTime = time;
      const ease = reduceMotion || drag ? 1 : 1 - Math.exp(-delta / 85);
      x += (targetX - x) * ease;
      y += (targetY - y) * ease;
      focusX += (targetFocusX - focusX) * ease;
      focusY += (targetFocusY - focusY) * ease;
      field.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      let unsettled =
        Math.abs(x - targetX) +
          Math.abs(y - targetY) +
          Math.abs(focusX - targetFocusX) +
          Math.abs(focusY - targetFocusY) >
        0.1;
      portraits.forEach((portrait, index) => {
        const slot = PORTRAIT_SLOTS[index];
        const centerX = ((slot.x + slot.width / 2) / 1440) * fieldWidth + x;
        const centerY =
          ((slot.y - 556 + slot.height / 2) / 661) * fieldHeight + y;
        const distance = Math.hypot(
          (centerX - focusX) / Math.max(width * 0.52, 220),
          (centerY - focusY) / (height * 0.72),
        );
        const prominence = Math.max(0, 1 - distance);
        // Normalize the source slots so even the tiny edge portraits can grow.
        const maxSize = fieldWidth < 1100 ? 120 : 170;
        const desired =
          (maxSize /
            ((Math.max(slot.width, slot.height) / 1440) * fieldWidth)) *
          (0.3 + 0.7 * prominence ** 0.7);
        scales[index] += (desired - scales[index]) * ease;
        unsettled ||= Math.abs(desired - scales[index]) > 0.001;
        portrait.style.transform = `scale(${scales[index]})`;
      });
      if (unsettled) frame = requestAnimationFrame(render);
      else previousTime = 0;
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(render);
    };
    const resize = () => {
      width = viewport.clientWidth;
      height = viewport.clientHeight;
      fieldWidth = field.offsetWidth;
      fieldHeight = field.offsetHeight;
      targetX = x = (width - fieldWidth) / 2;
      targetY = y = (height - fieldHeight) / 2;
      targetFocusX = focusX = width / 2;
      targetFocusY = focusY = height / 2;
      schedule();
    };
    const point = (event: PointerEvent) => {
      const rect = viewport.getBoundingClientRect();
      return { x: event.clientX - rect.left, y: event.clientY - rect.top };
    };
    const move = (event: PointerEvent) => {
      const p = point(event);
      if (drag && event.pointerId === drag.id) {
        const dx = p.x - drag.x,
          dy = p.y - drag.y;
        if (!drag.moved && Math.hypot(dx, dy) < 8) return;
        drag.moved = true;
        suppressClickRef.current = true;
        if (!viewport.hasPointerCapture(event.pointerId))
          viewport.setPointerCapture(event.pointerId);
        targetX = drag.panX + dx;
        targetY = drag.panY + dy;
        // Touch moves the grid through a fixed central lens, as on a watch.
        targetFocusX = width / 2;
        targetFocusY = height / 2;
        bound();
        schedule();
      } else if (event.pointerType === "mouse" && !keyboardFocus) {
        targetFocusX = clamp(p.x, 0, width);
        targetFocusY = clamp(p.y, 0, height);
        // Hover is a continuous lens, never a snap to whichever portrait is
        // nearest. Keep travel small unless the field extends offscreen.
        const hoverMargin = 24;
        targetX =
          hoverMargin +
          (width - fieldWidth - hoverMargin * 2) * clamp(p.x / width, 0, 1);
        targetY =
          (height - fieldHeight) / 2 +
          (0.5 - clamp(p.y / height, 0, 1)) * hoverMargin * 2;
        bound();
        schedule();
      }
    };
    const down = (event: PointerEvent) => {
      suppressClickRef.current = false;
      if (event.pointerType === "mouse" || !event.isPrimary) return;
      keyboardFocus = false;
      const p = point(event);
      drag = {
        id: event.pointerId,
        x: p.x,
        y: p.y,
        panX: x,
        panY: y,
        moved: false,
      };
    };
    const up = (event: PointerEvent) => {
      // Touch starts with implicit capture on the tapped portrait. Its capture
      // loss bubbles when we transfer the gesture to the viewport.
      if (event.type === "lostpointercapture" && event.target !== viewport)
        return;
      if (drag?.id !== event.pointerId) return;
      drag = null;
      if (viewport.hasPointerCapture(event.pointerId))
        viewport.releasePointerCapture(event.pointerId);
    };
    const leave = () => {
      if (drag || keyboardFocus) return;
      targetFocusX = width / 2;
      targetFocusY = height / 2;
      schedule();
    };
    const focus = (event: FocusEvent) => {
      const portrait = (event.target as HTMLElement).closest<HTMLElement>(
        "[data-portrait]",
      );
      if (!portrait?.matches(":focus-visible")) return;
      keyboardFocus = true;
      const slot = PORTRAIT_SLOTS[Number(portrait.dataset.portrait)];
      targetX = width / 2 - ((slot.x + slot.width / 2) / 1440) * fieldWidth;
      targetY =
        height / 2 - ((slot.y - 556 + slot.height / 2) / 661) * fieldHeight;
      bound();
      targetFocusX = ((slot.x + slot.width / 2) / 1440) * fieldWidth + targetX;
      targetFocusY =
        ((slot.y - 556 + slot.height / 2) / 661) * fieldHeight + targetY;
      schedule();
    };
    const blur = () => {
      keyboardFocus = false;
    };
    const key = (event: KeyboardEvent) => {
      if (event.target !== viewport) return;
      const directions: Record<string, [number, number]> = {
        ArrowLeft: [100, 0],
        ArrowRight: [-100, 0],
        ArrowUp: [0, 100],
        ArrowDown: [0, -100],
      };
      const direction = directions[event.key];
      if (!direction) return;
      event.preventDefault();
      targetX += direction[0];
      targetY += direction[1];
      bound();
      schedule();
    };
    const observer = new ResizeObserver(resize);
    observer.observe(viewport);
    resize();
    viewport.addEventListener("pointermove", move);
    viewport.addEventListener("pointerdown", down);
    viewport.addEventListener("pointerup", up);
    viewport.addEventListener("pointercancel", up);
    viewport.addEventListener("lostpointercapture", up);
    viewport.addEventListener("pointerleave", leave);
    viewport.addEventListener("focusin", focus);
    viewport.addEventListener("focusout", blur);
    viewport.addEventListener("keydown", key);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
      viewport.removeEventListener("pointermove", move);
      viewport.removeEventListener("pointerdown", down);
      viewport.removeEventListener("pointerup", up);
      viewport.removeEventListener("pointercancel", up);
      viewport.removeEventListener("lostpointercapture", up);
      viewport.removeEventListener("pointerleave", leave);
      viewport.removeEventListener("focusin", focus);
      viewport.removeEventListener("focusout", blur);
      viewport.removeEventListener("keydown", key);
    };
  }, [reduceMotion]);

  return { viewportRef, suppressClickRef };
}
