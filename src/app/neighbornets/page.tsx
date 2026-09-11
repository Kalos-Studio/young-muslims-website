import type { Metadata } from "next";

import { NeighborNetsMap } from "./neighbornets-map";

export const metadata: Metadata = {
  title: "Neighbornets · Young Muslims",
  description:
    "Find a Young Muslims neighbornet near you: brothers' and sisters' circles across the United States.",
  // This is a working prototype, not a page we want indexed yet.
  robots: { index: false, follow: false },
};

export default function NeighborNetsPage() {
  // On wide screens the page is pinned to the viewport so the map fills the
  // space and the debug panel scrolls inside its own column. Narrow screens
  // fall back to normal document flow with a fixed-height map.
  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-4 p-4 sm:p-6 lg:h-dvh lg:overflow-hidden">
      <header className="shrink-0">
        <h1 className="text-2xl font-semibold tracking-tight">Neighbornets</h1>
        <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
          Every dot is a local Young Muslims circle. Brothers&apos; and
          sisters&apos; neighbornets are tracked separately, so the map has to
          tell them apart at a glance. The panel on the right is a scratch pad
          for trying different ways of doing that.
        </p>
        <p className="mt-2 text-xs text-muted-foreground">
          Names, contacts, and meeting times below are placeholder data for
          layout testing only.
        </p>
      </header>

      <NeighborNetsMap />
    </div>
  );
}
