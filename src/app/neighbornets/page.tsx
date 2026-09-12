import type { Metadata } from "next";

import { NeighborNetsMap } from "./neighbornets-map";
import { defaultSettings, type MapSettings } from "./map-options";
// WIREFRAME: wireframe chrome around a real, working map. See WIREFRAME.md.
import { Annotate } from "@/components/wireframe/annotate";
import { PageFrame } from "@/components/wireframe/page-frame";
import { TextSlot } from "@/components/wireframe/text-slot";

export const metadata: Metadata = {
  title: "Join a NeighborNet · Young Muslims",
  description:
    "Find a Young Muslims neighbornet near you: brothers' and sisters' circles across the United States.",
};

/**
 * WIREFRAME: settings for the wireframe only. `defaultSettings` is left alone so
 * the marker-comparison prototype still boots the way it always did — this is a
 * per-caller override, not a change to what everyone gets.
 *
 * `mono` plus the shape channel is what makes the map greyscale without losing
 * the brothers/sisters distinction: both branches draw in the same neutral, and
 * sisters' nets read as diamonds rather than circles. That option space already
 * existed in map-options.ts, so this is a configuration, not a rewrite.
 *
 * The blank basemap is also the honest choice here: it draws our own
 * public-domain state polygons instead of CARTO's tiles, so the wireframe does
 * not pull a third party into the page just to show a shape of the country.
 */
const wireframeSettings: MapSettings = {
  ...defaultSettings,
  basemap: "blank",
  palette: "mono",
  differentiator: "shape",
  markerStyle: "ring",
};

export default function NeighborNetsPage() {
  return (
    <PageFrame label="Join a NeighborNet">
      <Annotate className="mb-10">
        <TextSlot label="Intro copy about YM" size="h2" lines={1} />
      </Annotate>

      <Annotate note="the one live piece: real map, real placeholder data. brothers are circles, sisters are diamonds, so the split reads without colour">
        {/* WIREFRAME: the debug panel is hidden for the client-facing prototype.
            Drop `showDebugPanel={false}` to get the marker-comparison tooling
            back while we are still deciding how the dots should look. */}
        <div className="h-[42rem] overflow-hidden border border-wf-rule">
          <NeighborNetsMap
            initialSettings={wireframeSettings}
            showDebugPanel={false}
          />
        </div>
      </Annotate>
    </PageFrame>
  );
}
