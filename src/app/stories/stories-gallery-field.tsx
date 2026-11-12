"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, type ReactNode } from "react";

import { readTimeToken } from "@/components/site/blob-reveal";
import { type BrandColor, pickPopColor } from "@/lib/brand-palette";
import {
  FINE_POINTER,
  readRootToken,
  REDUCED_MOTION,
} from "@/lib/shape-motion";
import { readLengthToken } from "@/lib/motion-tokens";
import { cn } from "@/lib/utils";

import {
  lensCell,
  lensRadius,
  lensSpan,
  type LensGeometry,
} from "./gallery-lens";
import { LATTICE_ORDER, LATTICE_ROW_STEP } from "./gallery-people";
import styles from "./stories-gallery.module.css";

/** A face as the field draws it: its person and its optimised image. */
export type FieldFace = {
  face: string;
  slug: string;
  name: string;
  src: string;
  srcSet?: string;
  sizes?: string;
};

/*
 * Face nodes on the page: the most cells the band can show at once (about
 * 14 columns of up to 3 on the widest screens; about 30 at 1440, 10 on a
 * phone), with room to spare. Cells take a free node as they come into
 * view and give it back as they leave, so the field is endless with a fixed
 * number of nodes.
 */
const POOL = 72;

const MASKS = styles as Record<string, string>;

type Cell = { key: string; i: number; j: number; face: number };

/**
 * The Stories gallery's field (DESIGN-SYSTEM.md, "Stories gallery"): an
 * endless honeycomb of the 23 faces through a fisheye lens fixed at the
 * band's centre (gallery-lens.ts), as on a watch's app grid: a face is full
 * size when it is panned to the middle, and smaller towards the edges. The
 * cursor never moves the lens; dragging the field brings faces through it.
 *
 * - **Drawing:** a pool of face nodes, each on its own layer, placed by one
 *   transform (translate and a scale of at most 1) in a frame loop that runs
 *   only while the field moves (a drag, a glide, a keyboard pan) and the
 *   band is on screen; a node is written only when its place changes, and
 *   its image swapped only when it takes another cell.
 * - **Pan:** a mouse drags the field any way; a horizontal wheel (a
 *   trackpad's sideways swipe) pans it across, and vertical wheels scroll
 *   the page. On touch the band owns every gesture that starts in it
 *   (`touch-action: none`): any swipe pans the field, any way; the page
 *   scrolls from anywhere outside the band. A press that moves less than
 *   the drag threshold stays a click (a tap); a drag's click is dropped. Lenis is held off (`data-lenis-prevent`) while a drag
 *   is under way, and a release glides to a stop.
 * - **Faces** are links to `/stories/[slug]` through the page transition,
 *   whose cover takes the face's hover pop colour (`data-transition-color`).
 *   The pool's nodes are hidden from assistive tech and the tab order; the
 *   23 people are a list of links in it, and focusing one pans its nearest
 *   face to the middle and pops it.
 * - **Hint (fine pointers):** "Drag to explore" by the cursor as it comes
 *   onto the band, until the first drag (see `showHint`).
 * - **Reduced motion:** no glide or keyboard easing; drags and the keyboard
 *   move the field directly, and the hint appears without fading.
 */
export function StoriesGalleryField({
  faces,
  children,
}: {
  faces: FieldFace[];
  /** Drawn behind the faces (the watermark). */
  children?: ReactNode;
}) {
  const router = useRouter();
  const bandRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const band = bandRef.current;
    if (!band) return;
    const nodes = [
      ...band.querySelectorAll<HTMLAnchorElement>("[data-gallery-face]"),
    ];
    const photos = nodes.map((node) => node.querySelector("img")!);
    const pops = nodes.map((node) => node.firstElementChild as HTMLElement);
    const faceIndex = new Map(faces.map((face, index) => [face.face, index]));
    const latticeFaces = LATTICE_ORDER.map((id) => faceIndex.get(id) ?? 0);
    const reduced = window.matchMedia(REDUCED_MOTION);
    const finePointer = window.matchMedia(FINE_POINTER);

    // Geometry, from the tokens and the band's and a face's size.
    let geometry!: LensGeometry;
    let threshold = 6;
    let hintTime = 2000;
    let hintOffset = 20;
    let glideTime = 325;
    let panTime = 160;
    const measure = () => {
      const ratio = (name: string, fallback: number) =>
        Number.parseFloat(readRootToken(name, String(fallback))) || fallback;
      const face = nodes[0].offsetWidth;
      geometry = {
        width: band.clientWidth,
        height: band.clientHeight,
        face,
        column: face * ratio("--stories-gallery-column", 1.35),
        row: face * ratio("--stories-gallery-row", 1.32),
        lens: face * ratio("--stories-gallery-lens", 2.6),
        reach: face * ratio("--stories-gallery-reach", 4.09091),
        lensY: ratio("--stories-gallery-lens-y", 0.6),
        boost: ratio("--stories-gallery-focus-boost", 0.1),
        contentHalf: face * ratio("--stories-gallery-content", 2.55),
        cull: ratio("--stories-gallery-cull", 0.06),
      };
      threshold = readLengthToken("--stories-gallery-drag-threshold", 6);
      hintTime = readTimeToken("--duration-stories-gallery-hint", 2000);
      hintOffset = readLengthToken("--stories-gallery-hint-offset", 20);
      glideTime = readTimeToken("--duration-stories-gallery-glide", 325);
      panTime = readTimeToken("--duration-stories-gallery-pan", 160);
    };
    measure();

    // The view: the pan (px, unlensed). The lens never moves.
    let panX = 0;
    let panY = 0;
    let velocityX = 0;
    let velocityY = 0;
    let panTarget: { x: number; y: number } | null = null;
    let focusedKey: string | null = null;

    // The pool: which cell each node shows, and the node each cell has.
    const nodeCell: (Cell | null)[] = nodes.map(() => null);
    const nodeFace: number[] = nodes.map(() => -1);
    const nodeColor: (BrandColor | null)[] = nodes.map(() => null);
    const nodeDrawn = nodes.map(() => ({ x: NaN, y: NaN, scale: NaN }));
    const nodeFocused = nodes.map(() => false);
    const cellNode = new Map<string, number>();
    const colors = new Map<number, BrandColor>();

    /** The face lattice cell (i, j) shows (gallery-people.ts). */
    const faceAt = (i: number, j: number) => {
      const r = j - (i - (i & 1)) / 2;
      const index = (((i + LATTICE_ROW_STEP * r) % 23) + 23) % 23;
      return latticeFaces[index];
    };

    /** Gives node n's pop this face's colour (a fresh one with `fresh`). */
    const paint = (n: number, fresh: boolean) => {
      const face = nodeFace[n];
      let color = colors.get(face);
      if (fresh || !color) {
        color = pickPopColor(color);
        colors.set(face, color);
      }
      const last = nodeColor[n];
      if (last !== color) {
        if (last) pops[n].classList.remove(last.bg);
        pops[n].classList.add(color.bg);
        nodeColor[n] = color;
      }
      nodes[n].dataset.transitionColor = color.name;
      return color;
    };

    /** Node n now shows `face`: its image, mask, link and colour. */
    const assign = (n: number, face: number) => {
      if (nodeFace[n] === face) return;
      const previous = nodeFace[n];
      const node = nodes[n];
      const person = faces[face];
      const photo = photos[n];
      if (person.sizes) photo.sizes = person.sizes;
      if (person.srcSet) photo.srcset = person.srcSet;
      photo.src = person.src;
      if (previous >= 0)
        pops[n].classList.remove(MASKS[`mask${faces[previous].face}`]);
      pops[n].classList.add(MASKS[`mask${person.face}`]);
      node.href = `/stories/${person.slug}`;
      nodeFace[n] = face;
      const color = colors.get(face);
      if (color) paint(n, false);
      else {
        if (nodeColor[n]) pops[n].classList.remove(nodeColor[n]!.bg);
        nodeColor[n] = null;
        delete node.dataset.transitionColor;
      }
    };

    const hide = (n: number) => {
      const cell = nodeCell[n];
      if (cell) cellNode.delete(cell.key);
      nodeCell[n] = null;
      nodes[n].style.visibility = "hidden";
      nodeDrawn[n].scale = NaN;
      if (nodeFocused[n]) {
        nodes[n].removeAttribute("data-focused");
        nodeFocused[n] = false;
      }
    };

    /** Places every face for the current pan. */
    const layout = () => {
      const { width, height, column, row, contentHalf } = geometry;
      const radius = lensRadius(geometry);
      const span = lensSpan(geometry, radius);
      const originX = width / 2 + panX;
      const originY = height / 2 + panY;
      const wanted = new Map<
        string,
        Cell & { x: number; y: number; scale: number }
      >();
      const iFrom = Math.ceil((width / 2 - span - originX) / column);
      const iTo = Math.floor((width / 2 + span - originX) / column);
      for (let i = iFrom; i <= iTo; i++) {
        const offset = (i & 1) / 2;
        const jFrom = Math.ceil(
          (height / 2 - contentHalf - originY) / row - offset,
        );
        const jTo = Math.floor(
          (height / 2 + contentHalf - originY) / row - offset,
        );
        for (let j = jFrom; j <= jTo; j++) {
          const x = originX + i * column;
          const y = originY + (j + offset) * row;
          const drawn = lensCell(geometry, radius, x, y);
          if (drawn.scale === 0) continue;
          const key = `${i},${j}`;
          wanted.set(key, { key, i, j, face: faceAt(i, j), ...drawn });
        }
      }
      // Cells that left give their nodes back first.
      for (let n = 0; n < nodes.length; n++) {
        const cell = nodeCell[n];
        if (cell && !wanted.has(cell.key)) hide(n);
      }
      let free = 0;
      for (const cell of wanted.values()) {
        let n = cellNode.get(cell.key);
        if (n === undefined) {
          while (free < nodes.length && nodeCell[free]) free++;
          if (free >= nodes.length) break; // never at the pool's size
          n = free;
          nodeCell[n] = cell;
          cellNode.set(cell.key, n);
          assign(n, cell.face);
          nodes[n].style.visibility = "visible";
        }
        const drawn = nodeDrawn[n];
        const x = Math.round(cell.x * 100) / 100;
        const y = Math.round(cell.y * 100) / 100;
        const scale = Math.round(cell.scale * 1000) / 1000;
        if (x !== drawn.x || y !== drawn.y || scale !== drawn.scale) {
          nodes[n].style.transform =
            `translate3d(${x}px, ${y}px, 0) scale(${scale})`;
          drawn.x = x;
          drawn.y = y;
          drawn.scale = scale;
        }
        const focused = cell.key === focusedKey;
        if (focused !== nodeFocused[n]) {
          nodes[n].toggleAttribute("data-focused", focused);
          nodeFocused[n] = focused;
          if (focused) paint(n, false);
        }
      }
    };

    // The frame loop: runs while something moves and the band is on screen.
    let frame = 0;
    let last = 0;
    let onScreen = false;
    let dragging = false;
    const approach = (from: number, to: number, k: number) =>
      Math.abs(to - from) < 0.1 ? to : from + (to - from) * k;
    const tick = (now: number) => {
      frame = 0;
      const dt = last ? Math.min(64, now - last) : 16;
      last = now;
      let moving = false;
      if (!dragging && (velocityX || velocityY)) {
        panX += velocityX * dt;
        panY += velocityY * dt;
        const decay = Math.exp(-dt / glideTime);
        velocityX *= decay;
        velocityY *= decay;
        if (Math.hypot(velocityX, velocityY) < 0.01) velocityX = velocityY = 0;
        else moving = true;
      }
      if (panTarget) {
        const k = reduced.matches ? 1 : 1 - Math.exp(-dt / panTime);
        panX = approach(panX, panTarget.x, k);
        panY = approach(panY, panTarget.y, k);
        if (panX === panTarget.x && panY === panTarget.y) panTarget = null;
        else moving = true;
      }
      layout();
      if (moving) schedule();
      else last = 0;
    };
    const schedule = () => {
      if (!frame && onScreen) frame = requestAnimationFrame(tick);
    };

    // Images: every face is fetched (and decoded) once the band is near, so
    // a face coming into view for the first time is ready.
    let warmed = false;
    const warm = () => {
      if (warmed) return;
      warmed = true;
      for (const person of faces) {
        const image = new Image();
        if (person.sizes) image.sizes = person.sizes;
        if (person.srcSet) image.srcset = person.srcSet;
        image.src = person.src;
        void image.decode().catch(() => undefined);
      }
    };
    const visibility = new IntersectionObserver(
      ([entry]) => {
        onScreen = entry.isIntersecting;
        if (onScreen) {
          warm();
          schedule();
        }
      },
      { rootMargin: "50% 0px" },
    );
    visibility.observe(band);
    const resize = new ResizeObserver(() => {
      measure();
      layout();
      schedule();
    });
    resize.observe(band);
    layout();

    // The hint ("Drag to explore", fine pointers): it fades in by the
    // cursor as the cursor comes onto the band, follows it, and fades out
    // after the hint time, as the cursor leaves, or as a drag starts. Once
    // the field has been dragged it does not come back.
    const hint = band.querySelector<HTMLElement>("[data-gallery-hint]");
    let hintTimer = 0;
    let explored = false;
    const placeHint = (event: PointerEvent) => {
      if (!hint?.hasAttribute("data-show")) return;
      const bounds = band.getBoundingClientRect();
      // Below and right of the cursor, kept within the band.
      const x = Math.round(
        Math.min(
          event.clientX - bounds.left + hintOffset,
          bounds.width - hint.offsetWidth,
        ),
      );
      const y = Math.round(
        Math.min(
          event.clientY - bounds.top + hintOffset,
          bounds.height - hint.offsetHeight,
        ),
      );
      hint.style.translate = `${x}px ${y}px`;
    };
    const hideHint = () => {
      window.clearTimeout(hintTimer);
      hint?.removeAttribute("data-show");
    };
    const showHint = (event: PointerEvent) => {
      if (!hint || explored || event.pointerType !== "mouse") return;
      if (!finePointer.matches) return;
      hint.setAttribute("data-show", "");
      placeHint(event);
      window.clearTimeout(hintTimer);
      hintTimer = window.setTimeout(hideHint, hintTime);
    };

    // Pressing, dragging and gliding.
    let press: {
      id: number;
      x: number;
      y: number;
      panX: number;
      panY: number;
      touch: boolean;
    } | null = null;

    let samples: { t: number; x: number; y: number }[] = [];
    let suppressClick = false;
    let hovered: Element | null = null;
    const hold = (on: boolean) => {
      band.toggleAttribute("data-dragging", on);
      band.toggleAttribute("data-lenis-prevent", on);
    };
    const onPointerDown = (event: PointerEvent) => {
      if (event.button !== 0 || press) return;
      press = {
        id: event.pointerId,
        x: event.clientX,
        y: event.clientY,
        panX,
        panY,
        touch: event.pointerType !== "mouse",
      };
      samples = [{ t: event.timeStamp, x: event.clientX, y: event.clientY }];
      velocityX = velocityY = 0;
      panTarget = null;
      suppressClick = false;
      // Touch has no hover: the face's colour is picked as it is pressed.
      const node = (event.target as Element).closest<HTMLElement>(
        "[data-gallery-face]",
      );
      if (press.touch && node) {
        const n = nodes.indexOf(node as HTMLAnchorElement);
        if (n >= 0 && !colors.has(nodeFace[n])) paint(n, true);
      }
    };
    const onPointerMove = (event: PointerEvent) => {
      placeHint(event);
      if (!press || event.pointerId !== press.id) return;
      const dx = event.clientX - press.x;
      const dy = event.clientY - press.y;
      if (!dragging) {
        if (Math.hypot(dx, dy) < threshold) return;
        dragging = true;
        explored = true;
        hideHint();
        band.setPointerCapture(event.pointerId);
        hold(true);
      }
      panX = press.panX + dx;
      panY = press.panY + dy;
      samples.push({ t: event.timeStamp, x: event.clientX, y: event.clientY });
      while (samples.length > 2 && event.timeStamp - samples[0].t > 100)
        samples.shift();
      schedule();
    };
    const onPointerUp = (event: PointerEvent) => {
      if (!press || event.pointerId !== press.id) return;
      press = null;
      if (!dragging) return;
      dragging = false;
      suppressClick = event.type === "pointerup";
      if (band.hasPointerCapture(event.pointerId))
        band.releasePointerCapture(event.pointerId);
      hold(false);
      const first = samples[0];
      const latest = samples[samples.length - 1];
      const span = latest.t - first.t;
      if (!reduced.matches && span > 0 && event.timeStamp - latest.t < 80) {
        velocityX = (latest.x - first.x) / span;
        velocityY = (latest.y - first.y) / span;
      }
      schedule();
    };
    const onPointerEnter = (event: PointerEvent) => showHint(event);
    const onPointerLeave = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      hovered = null;
      if (!dragging) hideHint();
    };

    // A drag's click is dropped before the page transition sees it.
    const onClickCapture = (event: MouseEvent) => {
      if (!suppressClick) return;
      suppressClick = false;
      if (band.contains(event.target as Node)) {
        event.preventDefault();
        event.stopPropagation();
      }
    };

    // Sideways wheels (a trackpad's horizontal swipe) pan; vertical ones
    // scroll the page, and a pinch (ctrl + wheel) is the browser's.
    const onWheel = (event: WheelEvent) => {
      if (event.ctrlKey || Math.abs(event.deltaX) <= Math.abs(event.deltaY))
        return;
      event.preventDefault();
      event.stopPropagation();
      const unit = event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? 800 : 1;
      panX -= event.deltaX * unit;
      explored = true;
      hideHint();
      velocityX = velocityY = 0;
      panTarget = null;
      schedule();
    };

    // Hover: a fresh pop colour each time the cursor reaches a face.
    const onPointerOver = (event: PointerEvent) => {
      if (event.pointerType !== "mouse" || dragging) return;
      const node = (event.target as Element).closest("[data-gallery-face]");
      if (node === hovered) return;
      hovered = node;
      const n = node ? nodes.indexOf(node as HTMLAnchorElement) : -1;
      if (n >= 0 && nodeFace[n] >= 0) paint(n, true);
    };

    // The keyboard: a person's link pans their nearest face to the middle.
    const links = [
      ...band.querySelectorAll<HTMLAnchorElement>("[data-gallery-link]"),
    ];
    const onFocusIn = (event: FocusEvent) => {
      const link = event.target as HTMLElement;
      const face = faceIndex.get(link.dataset.galleryLink ?? "");
      if (face === undefined) return;
      const { column, row } = geometry;
      const ci = Math.round(-panX / column);
      const cj = Math.round(-panY / row);
      let best: { i: number; j: number; distance: number } | null = null;
      for (let i = ci - 12; i <= ci + 12; i++)
        for (let j = cj - 6; j <= cj + 6; j++) {
          if (faceAt(i, j) !== face) continue;
          const x = i * column + panX;
          const y = (j + (i & 1) / 2) * row + panY;
          const distance = Math.hypot(x, y);
          if (!best || distance < best.distance) best = { i, j, distance };
        }
      if (!best) return;
      panTarget = {
        x: -best.i * column,
        y: -(best.j + (best.i & 1) / 2) * row,
      };
      velocityX = velocityY = 0;
      focusedKey = `${best.i},${best.j}`;
      // A fresh colour for the face, which the link carries to the cover.
      const color = pickPopColor(colors.get(face));
      colors.set(face, color);
      for (let n = 0; n < nodes.length; n++)
        if (nodeFace[n] === face) paint(n, false);
      link.dataset.transitionColor = color.name;
      schedule();
    };
    const onFocusOut = () => {
      focusedKey = null;
      schedule();
    };

    band.addEventListener("pointerdown", onPointerDown);
    band.addEventListener("pointermove", onPointerMove);
    band.addEventListener("pointerup", onPointerUp);
    band.addEventListener("pointercancel", onPointerUp);
    band.addEventListener("pointerenter", onPointerEnter);
    band.addEventListener("pointerleave", onPointerLeave);
    band.addEventListener("pointerover", onPointerOver);
    band.addEventListener("wheel", onWheel, { passive: false });
    band.addEventListener("dragstart", (event) => event.preventDefault());
    window.addEventListener("click", onClickCapture, true);
    for (const link of links) {
      link.addEventListener("focus", onFocusIn);
      link.addEventListener("blur", onFocusOut);
    }
    return () => {
      if (frame) cancelAnimationFrame(frame);
      visibility.disconnect();
      resize.disconnect();
      band.removeEventListener("pointerdown", onPointerDown);
      band.removeEventListener("pointermove", onPointerMove);
      band.removeEventListener("pointerup", onPointerUp);
      band.removeEventListener("pointercancel", onPointerUp);
      band.removeEventListener("pointerenter", onPointerEnter);
      band.removeEventListener("pointerleave", onPointerLeave);
      band.removeEventListener("pointerover", onPointerOver);
      band.removeEventListener("wheel", onWheel);
      window.removeEventListener("click", onClickCapture, true);
      for (const link of links) {
        link.removeEventListener("focus", onFocusIn);
        link.removeEventListener("blur", onFocusOut);
      }
      hideHint();
      hold(false);
    };
  }, [faces]);

  return (
    <div
      ref={bandRef}
      className={styles.band}
      // Where the page transition did not take a face's click (reduced
      // motion, the entry animation), the router does.
      onClick={(event) => {
        const face = (event.target as Element).closest<HTMLAnchorElement>(
          "[data-gallery-face], [data-gallery-link]",
        );
        if (
          !face?.href ||
          event.defaultPrevented ||
          event.button !== 0 ||
          event.metaKey ||
          event.ctrlKey ||
          event.shiftKey ||
          event.altKey
        )
          return;
        event.preventDefault();
        router.push(new URL(face.href).pathname);
      }}
    >
      {children}
      {/* Desktop: dragging is how the field is explored; this says so
          (shown by the cursor until the first drag). */}
      <p
        aria-hidden
        data-gallery-hint=""
        className={cn(
          "pointer-events-none absolute top-0 left-0 z-20 bg-brand-obsidian px-4 py-2.5 text-nav font-semibold whitespace-nowrap text-brand-warm-snow",
          styles.hint,
        )}
      >
        Drag to explore
      </p>
      {Array.from({ length: POOL }, (_, n) => (
        <a
          key={n}
          data-gallery-face=""
          aria-hidden
          tabIndex={-1}
          draggable={false}
          className={styles.face}
        >
          <span className={styles.pop} />
          {/* The field swaps each node's image as it takes another cell, so
              it is a plain <img> given the optimised sources (srcSet from
              next/image's getImageProps). */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            alt=""
            draggable={false}
            decoding="async"
            className={styles.photo}
          />
        </a>
      ))}
      <ul aria-label="Stories" className="sr-only">
        {faces.map((face) => (
          <li key={face.face}>
            <a href={`/stories/${face.slug}`} data-gallery-link={face.face}>
              {face.name}’s story
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
