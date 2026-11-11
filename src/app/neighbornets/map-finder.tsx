"use client";

import { createContext, useContext, useRef, type ReactNode } from "react";

import type { Selection } from "./neighbornets-map-motion";

type FinderTarget = { current: ((selection: Selection) => void) | null };

const FinderContext = createContext<FinderTarget | null>(null);

/**
 * Joins the NeighborNets finder's search field (above the map) to the map
 * (NeighborNetsMapMotion registers its `select` here): the field's results
 * open the map's panels and zoom as a click on the map does.
 */
export function NeighborNetsFinder({ children }: { children: ReactNode }) {
  const target = useRef<FinderTarget["current"]>(null);
  return (
    <FinderContext.Provider value={target}>{children}</FinderContext.Provider>
  );
}

/** The map's `select`, once the map has mounted (null outside a finder). */
export function useFinder(): FinderTarget | null {
  return useContext(FinderContext);
}
