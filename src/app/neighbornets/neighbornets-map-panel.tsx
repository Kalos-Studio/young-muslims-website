"use client";

import Image from "next/image";
import { useEffect, useId, useRef, useState } from "react";

import type { NeighborNetLocation } from "@/lib/neighbornets";
import { cn } from "@/lib/utils";

import closeIcon from "../../../design-assets/figma/neighbornets/map/card/close.svg";
import { NeighborNetCard } from "./neighbornet-card";
import styles from "./neighbornets-map-panel.module.css";

export type PanelContent =
  | { kind: "state"; name: string; nets: NeighborNetLocation[] }
  | { kind: "net"; net: NeighborNetLocation }
  /** A search's NeighborNets (Figma 371:394: "Results for ‘Houston’"). */
  | { kind: "results"; query: string; nets: NeighborNetLocation[] }
  /** A searched place with none in reach: the nearest, with distances. */
  | {
      kind: "nearest";
      place: string;
      nets: { net: NeighborNetLocation; miles: number }[];
    };

/** A distance as the cards show it: "4 mi away", "Under 1 mi away". */
function milesAway(miles: number) {
  return miles < 1 ? "Under 1 mi away" : `${Math.round(miles)} mi away`;
}

/**
 * A results panel (Figma 370:14 / 375:897 / 401:2667, and the single net's,
 * 583:966 / 583:1100 / 583:1258): Obsidian, fixed to the viewport's foot at
 * every width, titled, with a close button, and its NeighborNet cards in a
 * row that scrolls sideways (native scroll, snapping to each card; Lenis
 * leaves it alone). A state's panel lists its nets; a net's panel shows its
 * card alone, selected; a search's lists the NeighborNets it found, nearest
 * first, or, for a place with none in reach, says so and offers the nearest
 * with their distances.
 *
 * `open` slides it up; a panel being replaced is kept, with `open` false,
 * until it has dropped away (`onGone`). The open one takes focus on its
 * title (so a screen reader lands on it, and Tab reaches Close next); Escape (NeighborNetsMapMotion) or the button closes it.
 */
export function NeighborNetsMapPanel({
  content,
  open,
  onClose,
  onGone,
  onSelectNet,
}: {
  content: PanelContent;
  open: boolean;
  onClose: () => void;
  onGone: () => void;
  /** A results card was clicked: show that net. */
  onSelectNet: (id: string) => void;
}) {
  const titleId = useId();
  const titleRef = useRef<HTMLHeadingElement>(null);
  const panelRef = useRef<HTMLElement>(null);
  // Mounted below the viewport, then opened once that pose has painted, so
  // it slides up.
  const [entered, setEntered] = useState(false);

  useEffect(() => {
    if (!open) return;
    let second = 0;
    const first = requestAnimationFrame(() => {
      second = requestAnimationFrame(() => setEntered(true));
    });
    titleRef.current?.focus({ preventScroll: true });
    return () => {
      cancelAnimationFrame(first);
      cancelAnimationFrame(second);
    };
  }, [open]);

  // Dropped away (or never moved, under reduced motion): unmount.
  useEffect(() => {
    if (open) return;
    const panel = panelRef.current;
    const animating =
      panel && getComputedStyle(panel).transitionDuration !== "0s";
    if (!animating) {
      onGone();
      return;
    }
    const done = (event: TransitionEvent) => {
      if (event.target === panel && event.propertyName === "translate")
        onGone();
    };
    panel.addEventListener("transitionend", done);
    return () => panel.removeEventListener("transitionend", done);
  }, [open, onGone]);

  const title =
    content.kind === "state"
      ? "Results for this area"
      : content.kind === "results"
        ? `Results for \u2018${content.query}\u2019`
        : content.kind === "nearest"
          ? `No NeighborNet in ${content.place} yet`
          : `${content.net.name} - NeighborNet`;
  // Every card in the row, with its distance where the panel gives one.
  const rowNets =
    content.kind === "net"
      ? []
      : content.kind === "nearest"
        ? content.nets
        : content.nets.map((net) => ({ net, miles: undefined }));

  return (
    <section
      ref={panelRef}
      aria-labelledby={titleId}
      data-neighbornets-panel={content.kind}
      data-open={open && entered ? "" : undefined}
      inert={!open}
      className={cn(
        "fixed inset-x-0 bottom-0 z-30 bg-brand-obsidian text-brand-pure-white",
        styles.panel,
      )}
    >
      <div className="pb-6 md:pb-8 xl:pb-9.5">
        <div className="relative mx-auto w-full max-w-360 pt-5 md:pt-6.25 xl:pt-10.5">
          <h2
            ref={titleRef}
            id={titleId}
            tabIndex={-1}
            className="px-5 pr-16 text-article-title font-semibold outline-none md:px-8 md:pr-20 xl:px-19.5 xl:text-lead"
          >
            {title}
            {content.kind === "state" && (
              <span className="sr-only">: {content.name}</span>
            )}
          </h2>
          {/* The site's close button: it turns a quarter on hover. */}
          <button
            type="button"
            aria-label="Close"
            onClick={onClose}
            className="ym-close absolute top-4 right-5 size-8 md:top-5 md:right-8 xl:top-10.25 xl:right-20"
          >
            <Image src={closeIcon} alt="" className="size-5" />
          </button>
        </div>
        {content.kind === "net" ? (
          <div className="mx-auto mt-6 w-full max-w-360 px-5 md:px-8 xl:mt-10 xl:px-19.5">
            <NeighborNetCard net={content.net} selected />
          </div>
        ) : rowNets.length > 0 ? (
          // The row runs the viewport's full width, so cards are cut by the
          // screen's edge (more to come), not a box's; it starts in line
          // with the title. Its top padding is room for a card's hover lift
          // (the row's overflow would clip it), taken from the gap above.
          <ul
            data-lenis-prevent
            className={cn(
              "mt-3 flex snap-x snap-mandatory items-stretch gap-3 overflow-x-auto overscroll-x-contain pt-1 md:mt-5 xl:mt-9 xl:gap-8",
              styles.row,
            )}
          >
            {rowNets.map(({ net, miles }) => (
              <li key={net.id} className="flex shrink-0 snap-start">
                <NeighborNetCard
                  net={net}
                  distance={miles === undefined ? undefined : milesAway(miles)}
                  onSelect={() => onSelectNet(net.id)}
                />
              </li>
            ))}
          </ul>
        ) : (
          <p className="mx-auto mt-4 w-full max-w-360 px-5 text-body md:mt-6 md:px-8 xl:mt-10 xl:px-19.5">
            There&rsquo;s no NeighborNet in{" "}
            {content.kind === "state" ? content.name : "this area"} yet.
          </p>
        )}
      </div>
    </section>
  );
}
