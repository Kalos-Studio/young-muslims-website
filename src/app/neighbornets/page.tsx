import type { Metadata } from "next";

import { NeighborNetsMap } from "./neighbornets-map";
import { defaultSettings, type MapSettings } from "./map-options";
// WIREFRAME: wireframe chrome around a real, working map. See WIREFRAME.md.
import { Annotate } from "@/components/wireframe/annotate";
import { Text } from "@/components/wireframe/text";
import { PageFrame } from "@/components/wireframe/page-frame";

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
 * Greyscale but still colour-coded: black for brothers, grey for sisters, with
 * the ringed marker style giving each dot a white halo so the grey ones do not
 * sink into the state fill. The shape channel is off — one visual difference is
 * easier to read than two.
 *
 * `click-popup` rather than the default `side-panel`, because a bare map has no
 * side column to put details in; the card opens on the map itself.
 *
 * The blank basemap is also the honest choice here: it draws our own
 * public-domain state polygons instead of CARTO's tiles, so the page does not
 * pull a third party in just to show the shape of the country.
 */
const wireframeSettings: MapSettings = {
  ...defaultSettings,
  basemap: "blank",
  palette: "black-gray",
  differentiator: "color",
  markerStyle: "ring",
  infoMode: "click-popup",
};

export default function NeighborNetsPage() {
  return (
    <PageFrame className="pt-16">
      <Annotate className="mb-12">
        <Text
          as="h2"
          example="There's a NeighborNet near you. Find it on the map."
        >
          Placeholder intro copy about YM
        </Text>
      </Annotate>

      <Annotate note="the one live piece: real map, real placeholder data. black dots are brothers' nets, grey are sisters'">
        {/* WIREFRAME: `bare` drops the prototype's border, side column and zoom
            controls so this reads as the country sitting on the page rather
            than a widget in a box. Drop `bare` and `showDebugPanel={false}` to
            get the marker-comparison tooling back while we are still deciding
            how the dots should look. */}
        <div className="h-[38rem]">
          <NeighborNetsMap
            initialSettings={wireframeSettings}
            showDebugPanel={false}
            bare
          />
        </div>
      </Annotate>
    </PageFrame>
  );
}
