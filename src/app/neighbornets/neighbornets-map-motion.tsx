"use client";

import Image from "next/image";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";

import {
  startSmoothScroll,
  stopSmoothScroll,
} from "@/components/site/smooth-scroll-provider";
import { brotherLocations } from "@/generated/brother-neighbornets";
import {
  MAP_POINTS,
  MAP_STATE_INDEX,
  MAP_VIEWBOX,
  type MapPoint,
} from "@/generated/neighbornets-map-index";
import { sisterLocations } from "@/generated/sister-neighbornets";
import type { NeighborNetLocation } from "@/lib/neighbornets";
import { readEaseToken, readLengthToken } from "@/lib/motion-tokens";
import { readTimeToken } from "@/components/site/blob-reveal";
import {
  FINE_POINTER,
  REDUCED_MOTION,
  readRootToken,
} from "@/lib/shape-motion";
import { cn } from "@/lib/utils";

import pinJade from "../../../design-assets/figma/neighbornets/map/pin-jade-selected.svg";
import pinRoyal from "../../../design-assets/figma/neighbornets/map/pin-royal-selected.svg";
import {
  FULL_VIEW,
  areaAround,
  fitView,
  mapPoint,
  viewBox,
  type View,
} from "./map-view";
import { createMapLabels, type Box, type LabelSpace } from "./map-labels";
import {
  NeighborNetsMapPanel,
  type PanelContent,
} from "./neighbornets-map-panel";
import styles from "./neighbornets-map.module.css";

/** What the map shows: everything, a state, or one NeighborNet's area. */
export type Selection =
  { kind: "state"; code: string } | { kind: "net"; id: string } | null;

const NETS = new Map<string, NeighborNetLocation>(
  [...brotherLocations, ...sisterLocations].map((net) => [net.id, net]),
);
const POINTS = new Map<string, MapPoint>(
  MAP_POINTS.map((point) => [point.id, point]),
);
const STATES = new Map(MAP_STATE_INDEX.map((state) => [state.code, state]));

function contentFor(selection: NonNullable<Selection>): PanelContent | null {
  if (selection.kind === "net") {
    const net = NETS.get(selection.id);
    return net ? { kind: "net", net } : null;
  }
  const state = STATES.get(selection.code);
  if (!state) return null;
  const nets = MAP_POINTS.filter((point) => point.state === state.code)
    .map((point) => NETS.get(point.id))
    .filter((net): net is NeighborNetLocation => Boolean(net))
    .sort(
      (a, b) =>
        (a.city ?? "").localeCompare(b.city ?? "") ||
        a.name.localeCompare(b.name),
    );
  return { kind: "state", name: state.name, nets };
}

const sameSelection = (a: Selection, b: Selection) =>
  a?.kind === b?.kind &&
  (a?.kind === "state"
    ? a.code === (b as { code: string }).code
    : a?.kind === "net"
      ? a.id === (b as { id: string }).id
      : true);

/** The imperative map (the zoom, the markers): see NeighborNetsMapMotion. */
type MapEngine = { show: (selection: Selection) => void };

type PanelEntry = { key: number; content: PanelContent; open: boolean };

const subscribeNothing = () => () => {};

/**
 * The NeighborNets map's interaction (Figma 334:2, 370:14, 583:966).
 *
 * - **Hover (mouse, at rest):** the map grows to `--neighbornets-map-lens-zoom`
 *   about the pointer and trails it: one transform on the lens, eased by its
 *   CSS transition on the compositor. The state under the pointer fills (a
 *   one-path SVG under the outlines, its own layer), found by taking the
 *   pointer back through the lens and the view into map units and testing
 *   each candidate state's filled area, never its outline.
 * - **A state or a NeighborNet (click, tap, or the URL):** the page scrolls
 *   the map's top under the header (when nothing was open) and stays free to
 *   scroll; the map flies to fit the state into what shows above the panel,
 *   or deep into the net (`--neighbornets-map-net-zoom`); a state shows only
 *   its nets; a net's marker becomes the Brass pin; and the panel slides up.
 *   The map stays live: another state or marker switches the panel. Escape,
 *   or the panel's close button, closes the panel and clears the selection,
 *   and the map stays where it is.
 * - **Leaving:** once the map's section is scrolled out of view (less than
 *   `--neighbornets-map-leave-ratio` of it showing) with a panel open or the
 *   map zoomed in, the panel closes and the map returns to the whole US.
 * - **Page and map share gestures:** the page scrolls freely; the map takes
 *   a gesture only while it is being manipulated (a drag, a pinch, a wheel
 *   zoom), and only then does Lenis leave it alone (`data-lenis-prevent`).
 * - **Markers:** never magnified: each sits over the lens, placed for the
 *   whole map by its position class and moved by a `translate` (its own
 *   layer, on the compositor) to where the view on screen puts it, every
 *   frame of a move. So they keep their size at any zoom and are drawn at 1x.
 *   (Counter-scaling markers inside a magnified layer made Chrome raster each
 *   one at the layer's zoom: hundreds of huge tiles, which ran the GPU out of
 *   memory, pixelating and then corrupting the map.)
 * - **Place labels:** names of cities and towns (map-labels.ts), loaded per
 *   state once a view zooms in past the first label zoom, chosen and
 *   decluttered at each commit (clear of each other and of the markers on
 *   show, within what shows of the map) and moved with the markers.
 * - **Panels:** a new panel rises as the one it replaces drops, so a switch
 *   reads as a new panel. They are portalled into <body>, clear of the
 *   footer stage's transformed wrapper.
 * - **URL:** `?state=TX` or `?nn=<id>`, replaced (not pushed) as it changes,
 *   and opened on load once the entry animation is done.
 *
 * Reduced motion: no lens; a zoom commits at once and panels appear without
 * sliding; everything else works the same.
 */
export function NeighborNetsMapMotion({
  className,
  children,
}: {
  className: string;
  children: ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const engine = useRef<MapEngine | null>(null);
  const [selection, setSelection] = useState<Selection>(null);
  const [panels, setPanels] = useState<PanelEntry[]>([]);
  const [markers, setMarkers] = useState<HTMLElement | null>(null);
  const panelKey = useRef(0);
  const mounted = useSyncExternalStore(
    subscribeNothing,
    () => true,
    () => false,
  );

  const selectionRef = useRef<Selection>(null);
  const select = useCallback((next: Selection) => {
    if (sameSelection(selectionRef.current, next)) return;
    const content = next ? contentFor(next) : null;
    const resolved = content ? next : null;
    selectionRef.current = resolved;
    setSelection(resolved);
    setPanels((entries) => [
      ...entries.map((entry) => ({ ...entry, open: false })),
      ...(content ? [{ key: ++panelKey.current, content, open: true }] : []),
    ]);
  }, []);
  const selectRef = useRef(select);
  useEffect(() => {
    selectRef.current = select;
  });

  // The map: hover, hit test, zoom, filter, lock.
  useEffect(() => {
    const frame = ref.current;
    const part = <T extends Element>(name: string) =>
      frame?.querySelector<T>(`[data-map-part="${name}"]`) ?? null;
    const lens = part<HTMLElement>("lens");
    const highlight = part<SVGPathElement>("highlight");
    const selectedFill = part<SVGPathElement>("selected");
    const statesSvg = part<SVGSVGElement>("states");
    const markersLayer = part<HTMLElement>("markers");
    const labelsLayer = part<HTMLElement>("labels");
    const highlightSvg = highlight?.ownerSVGElement;
    if (!frame || !lens || !highlight || !statesSvg || !markersLayer) return;
    if (!labelsLayer) return;
    if (!selectedFill) return;
    if (!highlightSvg) return;
    setMarkers(markersLayer);

    const finePointer = window.matchMedia(FINE_POINTER);
    const reducedMotion = window.matchMedia(REDUCED_MOTION);
    const number = (name: string, fallback: number) =>
      Number.parseFloat(readRootToken(name, String(fallback))) || fallback;
    const lensZoom = number("--neighbornets-map-lens-zoom", 1.677);
    const cullZoom = number("--neighbornets-map-cull-zoom", 2.5);
    const maxZoom = number("--neighbornets-map-max-zoom", 24);
    const netZoom = number("--neighbornets-map-net-zoom", 24);
    const leaveRatio = number("--neighbornets-map-leave-ratio", 0.1);
    const span = number("--neighbornets-map-area-span", 40);
    // Durations through readTimeToken: the built CSS writes 700ms as .7s.
    const flightMs = readTimeToken("--duration-neighbornets-map-lens", 700);
    const settleMs = readTimeToken("--duration-neighbornets-map-settle", 320);
    const resetRatio = number("--neighbornets-map-reset-ratio", 0.8);
    const resistance = number("--neighbornets-map-bounds-resistance", 0.35);
    const wheelRate = number("--neighbornets-map-wheel-rate", 0.0025);
    const pinchRate = number("--neighbornets-map-pinch-rate", 0.01);
    const wheelEase = number("--neighbornets-map-wheel-ease", 0.35);
    const wheelIdle = readTimeToken(
      "--duration-neighbornets-map-wheel-idle",
      160,
    );
    const trailMs = readTimeToken(
      "--duration-neighbornets-map-lens-trail",
      140,
    );
    const ease = cubicBezier(
      readEaseToken("--ease-neighbornets-map-lens", [0.22, 1, 0.36, 1]),
    );
    const dragThreshold = readLengthToken(
      "--neighbornets-map-drag-threshold",
      6,
    );
    // Place labels: loaded per state once zoomed in, chosen and decluttered
    // at each commit, moved with the map each frame (map-labels.ts).
    const labels = createMapLabels(labelsLayer, {
      zooms: {
        city: number("--neighbornets-map-label-zoom-city", 3),
        large: number("--neighbornets-map-label-zoom-large", 6),
        net: number("--neighbornets-map-label-zoom-net", 8),
        place: number("--neighbornets-map-label-zoom-place", 10),
      },
      gap: readLengthToken("--neighbornets-map-label-gap", 4),
      classes: {
        label: styles.label,
        city: cn(styles.city, "font-semibold"),
        place: cn(styles.place, "font-medium"),
      },
      // A state's labels arrived: shown now, unless the map is moving (its
      // next commit shows them).
      onLoad: () => {
        if (!move && !live) labels.update(base, frameWidth);
      },
      space: () => labelSpace(),
    });

    /**
     * Where labels may go now, in frame pixels: what shows of the map (on
     * screen, under the header, above the panel; the zoomed map draws to
     * its section's foot), and the markers on show and the pin, which no
     * label covers. Read at a commit, once the markers are placed.
     */
    const labelSpace = (): LabelSpace => {
      const { box, clipFoot, headerFoot, panelHeight } = measure();
      const area: Box = [
        Math.max(0, -box.left),
        Math.max(0, headerFoot - box.top),
        Math.min(box.width, window.innerWidth - box.left),
        Math.min(clipFoot, window.innerHeight - panelHeight) - box.top,
      ];
      const obstacles: Box[] = [];
      let clearance = 0;
      const shownMarkers = markerEls.filter(
        (el) =>
          !el.hasAttribute("data-hidden") &&
          !el.hasAttribute("data-selected") &&
          !el.hasAttribute("data-offscreen"),
      );
      const pin = markersLayer.querySelector<HTMLElement>("[data-map-pin]");
      for (const el of pin ? [...shownMarkers, pin] : shownMarkers) {
        const r = el.getBoundingClientRect();
        const left = r.left - box.left;
        const top = r.top - box.top;
        if (left > area[2] || left + r.width < area[0]) continue;
        if (top > area[3] || top + r.height < area[1]) continue;
        obstacles.push([left, top, left + r.width, top + r.height]);
        if (el !== pin) clearance = Math.max(clearance, r.width / 2);
      }
      return { area, obstacles, clearance };
    };
    const markerEls = [
      ...markersLayer.querySelectorAll<HTMLElement>("[data-neighbornet]"),
    ];
    const targets = [
      ...statesSvg.querySelectorAll<SVGPathElement>("path[data-state]"),
    ].map((path) => ({
      code: path.dataset.state ?? "",
      path,
      box: path.getBBox(),
    }));
    type Target = (typeof targets)[number];

    // The committed view (what the SVGs draw: their viewBox) and the view on
    // screen: between commits the lens's transform shows `shown` over
    // `base`, and the markers are placed for `shown` directly.
    let base: View = FULL_VIEW;
    let shown: View = FULL_VIEW;
    let move = 0; // the eased move (a flight or a settle) under way, if any
    let atRest = true; // the whole map, nothing selected: the lens may hover
    // A panel is open (a state or net selected): the map has been brought
    // into view for it.
    let open = false;
    let pointer: { x: number; y: number } | null = null;
    let hovered: Target | null = null;
    let frameRequest = 0;
    let lastTick = 0;
    // The state whose panel is open (its fill stays), if any.
    let selectedState: string | null = null;
    // The frame's width, read with the other measurements (never between
    // writes, which would force a layout).
    let frameWidth = frame.getBoundingClientRect().width;
    const halfW = MAP_VIEWBOX.width / 2;
    const halfH = MAP_VIEWBOX.height / 2;

    // Each marker and its map point, and how far it is moved now.
    const placed = markerEls.map((el) => ({
      el,
      point: POINTS.get(el.dataset.neighbornet ?? ""),
      dx: 0,
      dy: 0,
      on: true,
    }));

    /**
     * Move each marker (and the pin) to where `view` puts it: its position
     * class places it for the whole map, so the move is the difference.
     * Only markers on screen (now or last frame) are written.
     */
    const placeMarkers = (view: View) => {
      const u = frameWidth / MAP_VIEWBOX.width;
      const w = frameWidth;
      const h = (frameWidth * MAP_VIEWBOX.height) / MAP_VIEWBOX.width;
      const reach = w * 0.05;
      const offset = (x: number, y: number) => ({
        dx: x * u * (view.k - 1) - view.x * u * view.k,
        dy: y * u * (view.k - 1) - view.y * u * view.k,
      });
      for (const marker of placed) {
        if (!marker.point || marker.el.hasAttribute("data-hidden")) continue;
        const { dx, dy } = offset(marker.point.x, marker.point.y);
        const sx = marker.point.x * u + dx;
        const sy = marker.point.y * u + dy;
        // On the map's visible area (the frame, the section around it), with
        // a marker's room; anything else is hidden, not left where it was.
        // Only zoomed in deep (past the cull zoom): at the whole map and the
        // hover lens every marker stays, so none blinks at the edges.
        const on =
          view.k < cullZoom ||
          (sx > -reach && sx < w + reach && sy > -h * 0.5 && sy < h * 1.5);
        if (on !== marker.on) {
          if (on) delete marker.el.dataset.offscreen;
          else marker.el.dataset.offscreen = "";
          marker.on = on;
        }
        if (
          on &&
          (Math.abs(dx - marker.dx) > 0.05 || Math.abs(dy - marker.dy) > 0.05)
        ) {
          marker.el.style.translate = `${round(dx, 2)}px ${round(dy, 2)}px`;
          marker.dx = dx;
          marker.dy = dy;
        }
      }
      const pin = markersLayer.querySelector<HTMLElement>("[data-map-pin]");
      const pinPoint = pin && POINTS.get(pin.dataset.mapPin ?? "");
      if (pin && pinPoint) {
        const { dx, dy } = offset(pinPoint.x, pinPoint.y);
        pin.style.translate = `${round(dx, 2)}px ${round(dy, 2)}px`;
      }
    };

    /** The view that keeps map point `m` under frame point `p` at zoom k. */
    const around = (
      m: { x: number; y: number },
      p: { x: number; y: number },
      k: number,
    ): View => {
      const u = (frameWidth / MAP_VIEWBOX.width) * k;
      return { x: m.x - p.x / u, y: m.y - p.y / u, k };
    };

    /**
     * Show `view`: both SVGs drawn at it (their viewBox, every frame of a
     * move, so the outlines' non-scaling stroke holds 1.75px throughout,
     * never a magnified bitmap that snaps back), and the markers placed.
     */
    let drawn = "";
    const render = (view: View) => {
      shown = view;
      const box = viewBox(view);
      if (box !== drawn) {
        drawn = box;
        for (const svg of [statesSvg, highlightSvg])
          svg.setAttribute("viewBox", box);
      }
      placeMarkers(view);
      labels.place(view, frameWidth);
    };

    /** The map point under a viewport point, in the view on screen. */
    const pointAt = (clientX: number, clientY: number) => {
      const box = frame.getBoundingClientRect();
      return mapPoint(shown, clientX - box.left, clientY - box.top, box.width);
    };

    const stateAt = (clientX: number, clientY: number) => {
      const { x, y } = pointAt(clientX, clientY);
      const point = new DOMPoint(x, y);
      if (hovered && contains(hovered, point)) return hovered;
      return targets.find((target) => contains(target, point)) ?? null;
    };

    // --- Hover ----------------------------------------------------------

    const tick = (now: number) => {
      frameRequest = 0;
      const dt = lastTick ? Math.min(now - lastTick, 64) : 16;
      lastTick = now;
      // The state under the pointer (also mid-drag): the hover fill, on any
      // state but the selected one (which has its own, stronger fill).
      const next = pointer ? stateAt(pointer.x, pointer.y) : null;
      if (next !== hovered) {
        hovered = next;
        highlight.setAttribute("d", hoverFillFor(next));
        frame.dataset.hoveredState = next?.code ?? "";
      }
      // A pan or zoom gesture owns the view: no hover lens.
      if (live) return;
      // The hover lens (the whole map, a mouse over it): the view trails
      // toward the map grown about the pointer, or back to the whole map.
      if (
        !atRest ||
        move ||
        reducedMotion.matches ||
        !finePointer.matches ||
        frame.hasAttribute("data-zoomed")
      )
        return;
      let target = FULL_VIEW;
      if (pointer) {
        const box = frame.getBoundingClientRect();
        const p = { x: pointer.x - box.left, y: pointer.y - box.top };
        target = around(mapPoint(FULL_VIEW, p.x, p.y, frameWidth), p, lensZoom);
      }
      const t = 1 - Math.exp(-dt / trailMs);
      const k = Math.exp(
        Math.log(shown.k) + (Math.log(target.k) - Math.log(shown.k)) * t,
      );
      const arrived =
        Math.abs(k / target.k - 1) < 0.0005 &&
        Math.abs(shown.x - target.x) < 0.01 &&
        Math.abs(shown.y - target.y) < 0.01;
      if (arrived) {
        if (shown !== target) render(target === FULL_VIEW ? FULL_VIEW : target);
        lastTick = 0;
        return;
      }
      render({
        x: shown.x + (target.x - shown.x) * t,
        y: shown.y + (target.y - shown.y) * t,
        k,
      });
      schedule();
    };
    const schedule = () => {
      if (!frameRequest) frameRequest = requestAnimationFrame(tick);
    };

    const onEnter = (event: PointerEvent) => {
      if (event.pointerType !== "mouse" || !finePointer.matches) return;
      pointer = { x: event.clientX, y: event.clientY };
      schedule();
    };
    const onMove = (event: PointerEvent) => {
      if (event.pointerType !== "mouse" || !pointer) return;
      pointer = { x: event.clientX, y: event.clientY };
      schedule();
    };
    const onLeave = () => {
      if (!pointer) return;
      pointer = null;
      schedule();
    };

    // --- Zoom -----------------------------------------------------------

    /** Draw `view` for real (the SVGs' viewBox, sharp) and drop the lens. */
    const commit = (view: View) => {
      base = view;
      // Zoomed in, the map takes every drag (CSS); at its own framing a
      // vertical swipe scrolls the page.
      if (view.k > 1.001) frame.dataset.zoomed = "";
      else delete frame.dataset.zoomed;
      render(view);
      labels.update(view, frameWidth);
      // The map moved under a still pointer: find its state again.
      schedule();
    };

    /** Ease from the view on screen to `to`, frame by frame, then commit. */
    const fly = (to: View, arrived: () => void, settle = false) => {
      const id = ++move;
      // The labels it lands on start loading now, ready for its commit.
      labels.prepare(to);
      if (reducedMotion.matches) {
        move = 0;
        commit(to);
        arrived();
        return;
      }
      const from = shown;
      const duration = settle ? settleMs : flightMs;
      const fromCentre = {
        x: from.x + halfW / from.k,
        y: from.y + halfH / from.k,
      };
      const toCentre = { x: to.x + halfW / to.k, y: to.y + halfH / to.k };
      let start = 0;
      const step = (now: number) => {
        if (id !== move) return;
        start ||= now;
        const t = Math.min(1, (now - start) / duration);
        if (t >= 1) {
          move = 0;
          commit(to);
          arrived();
          return;
        }
        const e = ease(t);
        const k = Math.exp(
          Math.log(from.k) + (Math.log(to.k) - Math.log(from.k)) * e,
        );
        const cx = fromCentre.x + (toCentre.x - fromCentre.x) * e;
        const cy = fromCentre.y + (toCentre.y - fromCentre.y) * e;
        render({ x: cx - halfW / k, y: cy - halfH / k, k });
        requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    };

    /**
     * Everything a zoom needs, read at once (one layout): the frame, the
     * header's foot, and the newest panel's height.
     */
    const measure = () => {
      const box = frame.getBoundingClientRect();
      const header = document
        .querySelector("[data-site-header]")
        ?.getBoundingClientRect();
      const panel = [
        ...document.querySelectorAll<HTMLElement>(
          "[data-neighbornets-panel]:not([inert])",
        ),
      ].at(-1);
      return {
        box,
        // The zoomed map draws past the frame, to its section's edge.
        clipFoot:
          frame.closest("section")?.getBoundingClientRect().bottom ??
          box.bottom,
        headerFoot: Math.max(header?.bottom ?? 0, 0),
        panelHeight: panel?.offsetHeight ?? 0,
      };
    };

    /**
     * What shows of the map (the frame and its section below it) above the
     * panel and under the header, in frame pixels, less the fit padding;
     * `scrollBy` is how far the page is about to scroll (the frame moves up
     * by it).
     */
    const visibleArea = (
      { box, clipFoot, headerFoot, panelHeight }: ReturnType<typeof measure>,
      scrollBy: number,
    ) => {
      const pad = readLengthToken("--neighbornets-map-fit-padding", 24);
      const frameTop = box.top - scrollBy;
      const top = Math.max(frameTop, headerFoot);
      const bottom = Math.min(
        clipFoot - scrollBy,
        window.innerHeight - panelHeight,
      );
      const left = Math.max(box.left, 0);
      const right = Math.min(box.right, window.innerWidth);
      return {
        x: left - box.left + pad,
        y: top - frameTop + pad,
        w: Math.max(right - left - pad * 2, 1),
        h: Math.max(bottom - top - pad * 2, 1),
      };
    };

    /**
     * A map gesture (a drag, a pinch, a wheel zoom) is under way: Lenis
     * leaves the map's wheel and touch alone until it ends; otherwise the
     * page scrolls as usual, over the map too.
     */
    const capture = (on: boolean) => {
      if (on) frame.setAttribute("data-lenis-prevent", "");
      else frame.removeAttribute("data-lenis-prevent");
    };

    /** The hover fill's outline: the hovered state, unless it is selected. */
    function hoverFillFor(state: Target | null) {
      return (
        (state &&
          state.code !== selectedState &&
          state.path.getAttribute("d")) ||
        ""
      );
    }

    /** Fill the selected state (or none). */
    const markState = (selection: Selection) => {
      const code = selection?.kind === "state" ? selection.code : null;
      if (code === selectedState) return;
      selectedState = code;
      const target = targets.find((state) => state.code === code);
      selectedFill.setAttribute("d", target?.path.getAttribute("d") ?? "");
      highlight.setAttribute("d", hoverFillFor(hovered));
    };

    const filter = (selection: Selection) => {
      for (const marker of markerEls) {
        const id = marker.dataset.neighbornet ?? "";
        const hidden =
          selection?.kind === "state" &&
          marker.dataset.state !== selection.code;
        if (hidden !== marker.hasAttribute("data-hidden")) {
          if (hidden) marker.dataset.hidden = "";
          else delete marker.dataset.hidden;
        }
        const chosen = selection?.kind === "net" && selection.id === id;
        if (chosen !== marker.hasAttribute("data-selected")) {
          if (chosen) marker.dataset.selected = "";
          else delete marker.dataset.selected;
        }
      }
    };

    /**
     * What a selection zooms to: a state's NeighborNets (as Figma 370:14
     * frames Texas by its nets, not its outline), at least the area span
     * across, or its outline when it has none; a net, its point alone (the
     * view centres on it at the net zoom).
     */
    const boundsFor = (
      selection: NonNullable<Selection>,
    ): readonly [number, number, number, number] | undefined => {
      if (selection.kind === "net") {
        const point = POINTS.get(selection.id);
        return point && [point.x, point.y, point.x, point.y];
      }
      const nets = MAP_POINTS.filter((point) => point.state === selection.code);
      if (nets.length === 0) return STATES.get(selection.code)?.bounds;
      return areaAround(nets[0], nets, Infinity, span);
    };

    const show = (selection: Selection) => {
      writeUrl(selection);
      // A new view replaces any gesture under way (its wheel's idle timer
      // would otherwise commit the old view over the new flight).
      endGesture(true);
      if (!selection) {
        open = false;
        resetZoom = 0;
        filter(null);
        markState(null);
        atRest = true;
        if (resetting) {
          // Zoomed out past the state, or scrolled away: the whole map.
          const done = () => {
            resetting = false;
            snapReset = false;
          };
          if (snapReset) {
            move = 0;
            commit(FULL_VIEW);
            done();
          } else fly(FULL_VIEW, done);
          return;
        }
        // Closed (X, Escape): the map stays where it is, mid-flight too.
        move = 0;
        commit(shown);
        return;
      }
      // The first selection brings the map into view: its top under the
      // header, for the most room (the page stays free to scroll).
      const first = !open;
      open = true;
      // Reads (one layout), then writes.
      const measured = measure();
      frameWidth = measured.box.width;
      const scrollBy = first ? measured.box.top - measured.headerFoot : 0;
      const bounds = boundsFor(selection);
      const target =
        bounds &&
        fitView(
          bounds,
          visibleArea(measured, scrollBy),
          frameWidth,
          selection.kind === "net" ? Math.min(netZoom, maxZoom) : maxZoom,
        );
      // Zooming out below this returns to the whole map: a share of the
      // state's fit (for a net, its state's), never above where this view
      // starts, so the reset is always within reach and never immediate.
      const area = visibleArea(measured, scrollBy);
      const stateCode =
        selection.kind === "state"
          ? selection.code
          : POINTS.get(selection.id)?.state;
      const stateBounds =
        stateCode && boundsFor({ kind: "state", code: stateCode });
      const stateFit = stateBounds
        ? fitView(stateBounds, area, frameWidth, maxZoom).k
        : (target?.k ?? 1);
      resetZoom = Math.min(stateFit, target?.k ?? stateFit) * resetRatio;
      atRest = false;
      if (Math.abs(scrollBy) > 1) {
        // Past any smooth scroll under way, which would carry on over it;
        // Lenis resumes from the new position.
        stopSmoothScroll();
        window.scrollTo({
          top: window.scrollY + scrollBy,
          behavior: "instant",
        });
        startSmoothScroll();
      }
      filter(selection);
      markState(selection);
      render(shown);
      if (target) fly(target, () => {});
    };
    // --- Free pan and zoom ----------------------------------------------------

    // The view during a gesture (the lens shows it over `base`); null when
    // no gesture is under way.
    let live: View | null = null;
    let liveBox: DOMRect | null = null;
    let resetZoom = 0;
    let resetting = false;
    // The reset is at once (the map is out of view), not a flight.
    let snapReset = false;
    const pointers = new Map<number, { x: number; y: number }>();
    let drag: {
      id: number;
      start: { x: number; y: number };
      view: View;
      moving: boolean;
    } | null = null;
    let pinch: {
      distance: number;
      middle: { x: number; y: number };
      view: View;
    } | null = null;
    let suppressClick = false;
    let wheelTarget: View | null = null;
    let wheelFrame = 0;
    let wheelTimer = 0;

    /**
     * Whether the map takes a gesture: a touch always (a pinch zooms; one
     * finger pans only once zoomed in, until then a vertical swipe scrolls
     * the page, by `touch-action`); a mouse's drag and the wheel only with a
     * state or net open or the map zoomed in (on the whole map the wheel
     * scrolls the page and the hover lens has the pointer).
     */
    const free = (event?: { pointerType: string }) =>
      !resetting &&
      (event?.pointerType === "touch" ||
        selectionRef.current !== null ||
        shown.k > 1.001);
    const unit = () => frameWidth / MAP_VIEWBOX.width;

    /**
     * Keep the view's centre within the US (the map's units), keeping
     * `keep` of any overshoot: a share while dragging (resistance), none to
     * settle.
     */
    const bound = (view: View, keep: number): View => {
      const hold = (centre: number, max: number) =>
        centre < 0
          ? centre * keep
          : centre > max
            ? max + (centre - max) * keep
            : centre;
      const cx = hold(view.x + halfW / view.k, MAP_VIEWBOX.width);
      const cy = hold(view.y + halfH / view.k, MAP_VIEWBOX.height);
      return { x: cx - halfW / view.k, y: cy - halfH / view.k, k: view.k };
    };

    /** Take the view over: stop any flight where it is. */
    const begin = () => {
      if (live) return live;
      move = 0;
      capture(true);
      liveBox = frame.getBoundingClientRect();
      live = shown;
      return shown;
    };

    /** Show `view` (the lens and the markers move; nothing is redrawn). */
    const apply = (view: View) => {
      // With nothing open the map zooms no further out than the whole map.
      if (!selectionRef.current && view.k < 1) {
        const cx = view.x + halfW / view.k;
        const cy = view.y + halfH / view.k;
        view = bound({ x: cx - halfW, y: cy - halfH, k: 1 }, 0);
      }
      live = view;
      render(view);
      if (selectionRef.current && view.k < resetZoom) reset();
    };

    /** Zoomed out past the state: back to the whole map, as X does. */
    const reset = () => {
      if (resetting) return;
      resetting = true;
      endGesture(true);
      selectRef.current(null);
    };

    /** The gesture is over: commit its view, or settle it back in bounds. */
    const endGesture = (abandon = false) => {
      window.clearTimeout(wheelTimer);
      cancelAnimationFrame(wheelFrame);
      wheelFrame = 0;
      wheelTarget = null;
      for (const id of pointers.keys())
        if (frame.hasPointerCapture(id)) frame.releasePointerCapture(id);
      pointers.clear();
      drag = null;
      pinch = null;
      delete frame.dataset.dragging;
      capture(false);
      const view = live;
      live = null;
      if (!view || abandon) return;
      // Nothing open, zoomed back out: back to the whole map's framing.
      if (!selectionRef.current && view.k <= 1.001) {
        if (reducedMotion.matches) commit(FULL_VIEW);
        else fly(FULL_VIEW, () => {}, true);
        return;
      }
      const settled = bound(view, 0);
      const outside = settled.x !== view.x || settled.y !== view.y;
      if (outside && !reducedMotion.matches) fly(settled, () => {}, true);
      else commit(settled);
    };

    // Wheel: zoom about the pointer, easing toward where the wheel has
    // taken it; a trackpad pinch arrives as ctrl + wheel.
    const wheelStep = () => {
      wheelFrame = 0;
      if (!live || !wheelTarget) return;
      const t = wheelTarget;
      const ease = reducedMotion.matches ? 1 : wheelEase;
      const k = Math.exp(
        Math.log(live.k) + (Math.log(t.k) - Math.log(live.k)) * ease,
      );
      const next =
        Math.abs(k / t.k - 1) < 0.002
          ? t
          : {
              x: live.x + (t.x - live.x) * ease,
              y: live.y + (t.y - live.y) * ease,
              k,
            };
      apply(next);
      if (next !== t && !resetting)
        wheelFrame = requestAnimationFrame(wheelStep);
    };
    const onWheel = (event: WheelEvent) => {
      if (!free()) return; // the whole map: the page scrolls as usual
      event.preventDefault();
      const from = wheelTarget ?? begin();
      const box = liveBox ?? frame.getBoundingClientRect();
      const lines =
        event.deltaMode === 1
          ? 16
          : event.deltaMode === 2
            ? window.innerHeight
            : 1;
      const rate = event.ctrlKey ? pinchRate : wheelRate;
      const k = Math.min(
        maxZoom,
        from.k * Math.exp(-event.deltaY * lines * rate),
      );
      const p = { x: event.clientX - box.left, y: event.clientY - box.top };
      wheelTarget = bound(
        around(mapPoint(from, p.x, p.y, frameWidth), p, k),
        0,
      );
      if (!wheelFrame) wheelFrame = requestAnimationFrame(wheelStep);
      window.clearTimeout(wheelTimer);
      wheelTimer = window.setTimeout(() => {
        if (wheelTarget && live) apply(wheelTarget);
        endGesture();
      }, wheelIdle);
    };

    // Pointers: one drags (past the threshold), two pinch.
    const local = (p: { x: number; y: number }) => {
      const box = liveBox ?? frame.getBoundingClientRect();
      return { x: p.x - box.left, y: p.y - box.top };
    };
    const startPinch = () => {
      const [a, b] = [...pointers.values()];
      const view = live ?? begin();
      pinch = {
        distance: Math.max(Math.hypot(a.x - b.x, a.y - b.y), 1),
        middle: local({ x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 }),
        view,
      };
      for (const id of pointers.keys()) frame.setPointerCapture(id);
      frame.dataset.dragging = "";
    };
    const onPointerDown = (event: PointerEvent) => {
      if (!free(event)) return;
      if (event.pointerType === "mouse" && event.button !== 0) return;
      pointers.set(event.pointerId, { x: event.clientX, y: event.clientY });
      // One finger (or a mouse) drags only once the map is zoomed in (until
      // then a swipe scrolls the page); two fingers always pinch.
      const pans = shown.k > 1.001;
      if (pointers.size === 1 && pans) {
        drag = {
          id: event.pointerId,
          start: { x: event.clientX, y: event.clientY },
          view: base,
          moving: false,
        };
      } else if (pointers.size === 2) {
        drag = null;
        startPinch();
      }
    };
    const onPointerMove = (event: PointerEvent) => {
      if (!pointers.has(event.pointerId)) return;
      pointers.set(event.pointerId, { x: event.clientX, y: event.clientY });
      // A finger has no hover: while it drags or pinches, the state under it
      // fills, as the state under a mouse does.
      if (event.pointerType === "touch") {
        pointer = { x: event.clientX, y: event.clientY };
        schedule();
      }
      if (pinch && pointers.size >= 2) {
        const [a, b] = [...pointers.values()];
        const middle = local({ x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 });
        const k = Math.min(
          maxZoom,
          (pinch.view.k * Math.hypot(a.x - b.x, a.y - b.y)) / pinch.distance,
        );
        const anchor = mapPoint(
          pinch.view,
          pinch.middle.x,
          pinch.middle.y,
          frameWidth,
        );
        apply(
          bound(
            around(anchor, middle, k),
            reducedMotion.matches ? 0 : resistance,
          ),
        );
        return;
      }
      if (!drag || drag.id !== event.pointerId) return;
      const dx = event.clientX - drag.start.x;
      const dy = event.clientY - drag.start.y;
      if (!drag.moving) {
        if (Math.hypot(dx, dy) < dragThreshold) return;
        drag.moving = true;
        drag.view = begin();
        drag.start = { x: event.clientX, y: event.clientY };
        frame.setPointerCapture(event.pointerId);
        frame.dataset.dragging = "";
        return;
      }
      const k = drag.view.k;
      apply(
        bound(
          {
            x: drag.view.x - dx / (unit() * k),
            y: drag.view.y - dy / (unit() * k),
            k,
          },
          reducedMotion.matches ? 0 : resistance,
        ),
      );
    };
    const onPointerUp = (event: PointerEvent) => {
      if (!pointers.has(event.pointerId)) return;
      pointers.delete(event.pointerId);
      const moved = Boolean(pinch || drag?.moving);
      if (pinch && pointers.size === 1 && live) {
        // One finger left: it carries on as a drag from here.
        const [[id, p]] = [...pointers.entries()];
        pinch = null;
        drag = { id, start: p, view: live, moving: true };
        return;
      }
      if (pointers.size > 0) return;
      if (event.pointerType === "touch" && pointer) {
        pointer = null;
        schedule();
      }
      if (moved) {
        // A drag's release is not a click on whatever it ended over.
        suppressClick = true;
        window.setTimeout(() => (suppressClick = false), 0);
      }
      if (live) endGesture();
      else {
        drag = null;
        pinch = null;
      }
    };

    /**
     * The map's section scrolled out of view: close any panel and return the
     * map to the whole US at once, so coming back finds it fresh.
     */
    const leave = () => {
      if (!selectionRef.current && shown.k <= 1.001 && !move && !live) return;
      endGesture(true);
      if (selectionRef.current) {
        resetting = true;
        snapReset = true;
        selectRef.current(null);
        return;
      }
      move = 0;
      atRest = true;
      commit(FULL_VIEW);
    };
    const section = frame.closest("section") ?? frame;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry && entry.intersectionRatio < leaveRatio) leave();
      },
      { threshold: [0, leaveRatio] },
    );
    observer.observe(section);

    engine.current = { show };

    // --- Input ----------------------------------------------------------

    const onClick = (event: MouseEvent) => {
      if (suppressClick) {
        suppressClick = false;
        return;
      }
      const marker = (event.target as Element).closest<HTMLElement>(
        "[data-neighbornet]",
      );
      if (marker?.dataset.neighbornet) {
        selectRef.current({ kind: "net", id: marker.dataset.neighbornet });
        return;
      }
      const state = stateAt(event.clientX, event.clientY);
      if (state) selectRef.current({ kind: "state", code: state.code });
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape" && selectionRef.current) {
        selectRef.current(null);
      }
    };
    const onResize = () => {
      frameWidth = frame.getBoundingClientRect().width;
      for (const marker of placed) marker.on = true;
      render(shown);
      labels.resize();
      if (!move && !live) labels.update(base, frameWidth);
    };

    frame.addEventListener("pointerenter", onEnter);
    frame.addEventListener("pointermove", onMove, { passive: true });
    frame.addEventListener("pointerleave", onLeave);
    frame.addEventListener("click", onClick);
    frame.addEventListener("wheel", onWheel, { passive: false });
    frame.addEventListener("pointerdown", onPointerDown);
    frame.addEventListener("pointermove", onPointerMove);
    frame.addEventListener("pointerup", onPointerUp);
    frame.addEventListener("pointercancel", onPointerUp);
    window.addEventListener("keydown", onKey);
    window.addEventListener("resize", onResize);
    // The page scrolls under a still pointer (wheel): follow it.
    window.addEventListener("scroll", schedule, { passive: true });

    // Open the URL's state or net once the entry animation is done.
    const initial = readUrl();
    let waiting = 0;
    if (initial) {
      const open = () => {
        if (document.querySelector("[data-entry-animation]")) {
          waiting = window.setTimeout(open, 100);
          return;
        }
        selectRef.current(initial);
      };
      open();
    }

    return () => {
      frame.removeEventListener("pointerenter", onEnter);
      frame.removeEventListener("pointermove", onMove);
      frame.removeEventListener("pointerleave", onLeave);
      frame.removeEventListener("click", onClick);
      frame.removeEventListener("wheel", onWheel);
      frame.removeEventListener("pointerdown", onPointerDown);
      frame.removeEventListener("pointermove", onPointerMove);
      frame.removeEventListener("pointerup", onPointerUp);
      frame.removeEventListener("pointercancel", onPointerUp);
      window.clearTimeout(wheelTimer);
      cancelAnimationFrame(wheelFrame);
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("scroll", schedule);
      window.clearTimeout(waiting);
      if (frameRequest) cancelAnimationFrame(frameRequest);
      observer.disconnect();
      move = 0;
      capture(false);
      engine.current = null;
    };
  }, []);

  // Each new selection: the map follows (after the panel has rendered, so
  // the zoom knows how much of the map shows above it).
  useEffect(() => {
    engine.current?.show(selection);
  }, [selection]);

  const close = useCallback(() => select(null), [select]);
  const selectNet = useCallback(
    (id: string) => select({ kind: "net", id }),
    [select],
  );
  const selectedNet = selection?.kind === "net" ? selection.id : null;
  const selectedPoint = selectedNet ? POINTS.get(selectedNet) : undefined;
  const selectedBranch = selectedNet
    ? NETS.get(selectedNet)?.branch
    : undefined;

  return (
    <div ref={ref} data-neighbornets-map className={className}>
      {children}
      {markers &&
        selectedPoint &&
        createPortal(
          <span
            aria-hidden
            data-map-pin={selectedNet ?? ""}
            className={cn(styles.pin, selectedPoint.position)}
          >
            <Image
              src={selectedBranch === "sisters" ? pinJade : pinRoyal}
              alt=""
              className="block size-full"
            />
          </span>,
          markers,
        )}
      {mounted &&
        createPortal(
          panels.map((entry) => (
            <NeighborNetsMapPanel
              key={entry.key}
              content={entry.content}
              open={entry.open}
              onClose={close}
              onSelectNet={selectNet}
              onGone={() =>
                setPanels((entries) =>
                  entries.filter((other) => other.key !== entry.key),
                )
              }
            />
          )),
          document.body,
        )}
    </div>
  );
}

function readUrl(): Selection {
  const params = new URLSearchParams(window.location.search);
  const state = params.get("state")?.toUpperCase();
  if (state && STATES.has(state)) return { kind: "state", code: state };
  const id = params.get("nn");
  if (id && NETS.has(id) && POINTS.has(id)) return { kind: "net", id };
  return null;
}

function writeUrl(selection: Selection) {
  const url = new URL(window.location.href);
  url.searchParams.delete("state");
  url.searchParams.delete("nn");
  if (selection?.kind === "state")
    url.searchParams.set("state", selection.code);
  if (selection?.kind === "net") url.searchParams.set("nn", selection.id);
  if (url.href !== window.location.href)
    window.history.replaceState(window.history.state, "", url);
}

const round = (value: number, places: number) => {
  const f = 10 ** places;
  return Math.round(value * f) / f;
};

/** A CSS cubic-bezier() easing as a function of progress (0 to 1). */
function cubicBezier([x1, y1, x2, y2]: [number, number, number, number]) {
  const curve = (a: number, b: number, t: number) =>
    3 * a * t * (1 - t) ** 2 + 3 * b * t ** 2 * (1 - t) + t ** 3;
  return (x: number) => {
    if (x <= 0) return 0;
    if (x >= 1) return 1;
    let lo = 0;
    let hi = 1;
    for (let i = 0; i < 24; i++) {
      const mid = (lo + hi) / 2;
      if (curve(x1, x2, mid) < x) lo = mid;
      else hi = mid;
    }
    return curve(y1, y2, (lo + hi) / 2);
  };
}

function contains(
  target: { path: SVGPathElement; box: DOMRect },
  point: DOMPoint,
) {
  const { box } = target;
  return (
    point.x >= box.x &&
    point.x <= box.x + box.width &&
    point.y >= box.y &&
    point.y <= box.y + box.height &&
    target.path.isPointInFill(point)
  );
}
