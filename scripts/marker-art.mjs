// Marker art that stays crisp at any device pixel ratio, shared by the map
// marker generators (scripts/neighbornets-map-assets.mjs, and the landing
// map's markers below).
//
// Figma exports a marker as its whole art inside one filtered group (the
// drop shadow; the selected pin's Brass ring is a morphology filter too).
// Engines rasterise a filtered SVG image through the filter, which can come
// out soft on high-density screens, and at the image's small intrinsic size
// where an engine draws it from that. So:
//
// - `separateShadow`: the shadow filter is applied to a black copy of the
//   marker's silhouette (its first shape), with the filter's last step (the
//   art drawn back over its shadow) dropped, so it draws the shadow alone;
//   the art follows, unfiltered, plain vector.
// - `vectorRing`: the selected pin's ring becomes a stroke: the pin's white
//   edge (a 4-unit stroke) over a Brass 12-unit stroke of the same path, so
//   the Brass shows 4 units past the white, as the filter's 4-unit dilation
//   did, and no filter is left.
// - Both draw at four times the intrinsic size (same viewBox).
//
//   node scripts/marker-art.mjs   (writes the landing map's crisp markers)

import { readFileSync, writeFileSync } from "node:fs";

const BRASS = "#D8AA45";

function enlarge(svg, factor = 4) {
  return svg.replace(/<svg([^>]*)>/, (open, attrs) => {
    const size = (name) =>
      Number(attrs.match(new RegExp(` ${name}="([\\d.]+)"`))?.[1]);
    const width = size("width");
    const height = size("height");
    return `<svg${attrs
      .replace(/ width="[\d.]+"/, ` width="${+(width * factor).toFixed(4)}"`)
      .replace(/ height="[\d.]+"/, ` height="${+(height * factor).toFixed(4)}"`)
      .replace(/ style="[^"]*"/, "")
      .replace(/ preserveAspectRatio="none"/, "")
      .replace(/ overflow="visible"/, "")}>`;
  });
}

/** The art unfiltered, its shadow drawn from a silhouette (see above). */
export function separateShadow(svg) {
  const id = svg.match(/<g([^>]*) filter="url\(#([^)]+)\)"/)?.[2];
  if (!id) throw new Error("No filtered group in the marker art");
  const group = svg.indexOf(`filter="url(#${id})"`);
  const body = svg.slice(group);
  const shape = body.match(/<(path|rect)\b[^>]*?\/>/)?.[0];
  if (!shape) throw new Error("No shape in the marker art");
  const silhouette = shape
    .replace(/ fill="[^"]*"/, ' fill="#000"')
    .replace(/ id="[^"]*"/, "")
    .replace(/\/>$/, ` filter="url(#${id})"/>`);
  const shadowOnly = svg.replace(
    /\s*<feBlend mode="normal" in="SourceGraphic"[^>]*\/>/,
    "",
  );
  const out = shadowOnly
    .replace(` filter="url(#${id})"`, "")
    .replace(/(<g[^>]*>)/, `${silhouette}\n$1`);
  return enlarge(out);
}

/** The selected pin with its Brass ring as a stroke, no filter. */
export function vectorRing(svg) {
  const edge = svg.match(
    /<path d="[^"]+" stroke="white" stroke-width="4"\/>/,
  )?.[0];
  if (!edge) throw new Error("No white edge in the pin");
  const ring = edge
    .replace('stroke="white"', `stroke="${BRASS}"`)
    .replace('stroke-width="4"', 'stroke-width="12" stroke-linejoin="miter"');
  const out = svg
    .replace(/ filter="url\(#[^)]+\)"/, "")
    .replace(/\s*<defs>[\s\S]*?<\/defs>/, "")
    .replace(/(<g[^>]*>)/, `$1\n${ring}`);
  return enlarge(out);
}

// The landing map's markers (Figma 73:164): crisp copies beside the
// vendored originals.
if (import.meta.url === `file://${process.argv[1]}`) {
  const dir = "design-assets/figma/landing-2026/everywhere";
  for (const kind of ["royal", "jade"]) {
    writeFileSync(
      `${dir}/marker-${kind}-crisp.svg`,
      separateShadow(readFileSync(`${dir}/marker-${kind}.svg`, "utf8")),
    );
    console.log(`${dir}/marker-${kind}-crisp.svg`);
  }
}
