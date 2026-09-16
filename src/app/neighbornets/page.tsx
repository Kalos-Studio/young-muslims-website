import type { Metadata } from "next";

import { NeighborNetsMap } from "./neighbornets-map";
import { defaultSettings, type MapSettings } from "./map-options";
// WIREFRAME: wireframe chrome around a real, working map. See WIREFRAME.md.
import { Annotate } from "@/components/wireframe/annotate";
import { Frame } from "@/components/wireframe/frame";
import { Lorem, Text } from "@/components/wireframe/text";
import { PageFrame } from "@/components/wireframe/page-frame";

export const metadata: Metadata = {
  title: "Join a NeighborNet",
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
      {/* Nobody arriving on this site knows what a NeighborNet is, and the map
          alone does not tell them — so the explanation comes before it, not
          after. */}
      <Annotate
        className="mb-14"
        note="people don't know what a neighbornet is when they land here, so say it before the map, not after"
      >
        <Text
          as="h1"
          className="max-w-4xl"
          example="Youth from around the country, coming together every week."
        >
          Placeholder headline: what a NeighborNet is
        </Text>
        <Text as="body" className="mt-6 max-w-2xl">
          Placeholder supporting line: a local circle you can actually turn up
          to, and what happens when you do
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

      <Annotate className="mt-2">
        <div className="grid grid-cols-2 items-start gap-12">
          <div>
            <Text as="h2">What is a NeighborNet</Text>
            <Lorem paragraphs={2} className="mt-4" />
            <button className="mt-6 rounded-md border border-foreground bg-foreground px-6 py-3 text-sm font-medium text-background">
              Don&apos;t have a NN near you? Start one here
            </button>
          </div>
          <Frame
            variant="muted"
            label="Slideshow of images here"
            className="aspect-square w-full"
          />
        </div>
      </Annotate>

      <Annotate
        className="mt-16"
        note="each card links out to its own page: one for events, one for conferences, one for retreats"
      >
        <Text as="h2" className="text-center">
          Other Ways to Get Involved
        </Text>
        <div className="mt-8 grid grid-cols-3 gap-6">
          <div>
            <Frame
              variant="muted"
              label="Events"
              className="aspect-video w-full"
            />
            <Lorem paragraphs={1} className="mt-3" />
          </div>
          <div>
            <Frame
              variant="muted"
              label="Conferences"
              className="aspect-video w-full"
            />
            <Lorem paragraphs={1} className="mt-3" />
          </div>
          <div>
            <Frame
              variant="muted"
              label="Retreats"
              className="aspect-video w-full"
            />
            <Lorem paragraphs={1} className="mt-3" />
          </div>
        </div>
      </Annotate>
    </PageFrame>
  );
}
