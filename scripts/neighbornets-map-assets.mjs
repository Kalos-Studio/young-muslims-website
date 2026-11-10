// Builds the NeighborNets map's marker art in
// design-assets/figma/neighbornets/map/: the Figma map's YM circle markers
// (Royal for Brothers, 401:214; Jade for Sisters, 401:380; vendored as
// figma-marker-*.svg) under the landing map's marker shadow (the drop shadow
// in design-assets/figma/landing-2026/everywhere/marker-royal.svg: 4 down,
// blur 2, Obsidian at 30%), baked into the image so 235 markers cost no live
// filters.
//
// The circle (36.9137 units) sits centred in a square box with room for the
// shadow, so the marker's point is the box's centre; the map sizes the box
// with `--neighbornets-map-marker-box` (DESIGN-SYSTEM.md, "NeighborNets map").
//
//   node scripts/neighbornets-map-assets.mjs
import { readFileSync, writeFileSync } from "node:fs";

import { separateShadow, vectorRing } from "./marker-art.mjs";

const DIR = "design-assets/figma/neighbornets/map";
const CIRCLE = 36.9137;
const PAD = 8;
const BOX = CIRCLE + PAD * 2;

const SHADOW = `<filter id="shadow" x="${-PAD}" y="${-PAD}" width="${BOX}" height="${BOX}" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
<feFlood flood-opacity="0" result="BackgroundImageFix"/>
<feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
<feOffset dy="4"/>
<feGaussianBlur stdDeviation="2"/>
<feComposite in2="hardAlpha" operator="out"/>
<feColorMatrix type="matrix" values="0 0 0 0 0.0901961 0 0 0 0 0.0901961 0 0 0 0 0.145098 0 0 0 0.3 0"/>
<feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow"/>
<feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow" result="shape"/>
</filter>`;

for (const kind of ["royal", "jade"]) {
  const source = readFileSync(`${DIR}/figma-marker-${kind}.svg`, "utf8");
  const body = source
    .replace(/^<svg[^>]*>\s*/, "")
    .replace(/\s*<\/svg>\s*$/, "");
  const svg = `<svg width="${BOX}" height="${BOX}" viewBox="${-PAD} ${-PAD} ${BOX} ${BOX}" fill="none" xmlns="http://www.w3.org/2000/svg">
<g filter="url(#shadow)">
${body}
</g>
<defs>
${SHADOW}
</defs>
</svg>
`;
  // The art unfiltered, its shadow from a silhouette: crisp at any density.
  writeFileSync(`${DIR}/marker-${kind}.svg`, separateShadow(svg));
  console.log(`marker-${kind}.svg (${BOX.toFixed(4)} box, circle ${CIRCLE})`);
}
console.log(`circle share of the box: ${(CIRCLE / BOX).toFixed(6)}`);

// --- The selected pin -----------------------------------------------------
//
// The selected NeighborNet's marker (Figma 583:966): the landing's pin, white
// edged, in a 4-unit Sisters Brass ring (Figma's selected Royal pin, 583:976,
// vendored as figma-pin-royal-selected.svg: a 40-unit pin centred in a
// 56-unit box). Figma draws only the Royal one; the Jade one is the same pin
// with the Jade pin's art (583:970, figma-pin-jade.svg) set into it. Its
// point (the pin's square corner) is at 48, 48 of the box.
const selected = readFileSync(`${DIR}/figma-pin-royal-selected.svg`, "utf8");
writeFileSync(`${DIR}/pin-royal-selected.svg`, vectorRing(selected));
const jadePaths = [
  ...readFileSync(`${DIR}/figma-pin-jade.svg`, "utf8").matchAll(
    /<path d="[^"]+" fill="[^"]+"\/>/g,
  ),
].map(([path]) => path);
const [jadeShape, ...jadeArt] = jadePaths;
const royalShape = selected.match(/<path d="[^"]+" fill="#234080"\/>/)[0];
const royalArt = selected.match(
  /<path id="Vector" d="[^"]+" fill="#FEFEFE"\/>/,
)[0];
const jadeSelected = selected
  .replace(royalShape, `<g transform="translate(8 8)">${jadeShape}</g>`)
  .replace(royalArt, `<g transform="translate(8 8)">${jadeArt.join("")}</g>`);
writeFileSync(`${DIR}/pin-jade-selected.svg`, vectorRing(jadeSelected));
console.log(
  "pin-royal-selected.svg, pin-jade-selected.svg (56 box, point 48, 48)",
);

// --- The card covers --------------------------------------------------------
//
// The NeighborNet card's placeholder cover lockup (until each net has a
// photo): the side's mark and the YOUNG MUSLIMS wordmark, 24 units tall, as
// Figma's Shadow Creek card (371:390: the Sisters mark, then the wordmark from
// 29.08 across, 219.55 in all). Sisters: Forest on Sisters Brass (as Figma).
// Brothers: the Brothers mark (the card watermark's, 370:254) in white, for
// Royal.
const CARD = `${DIR}/card`;
const inner = (svg) =>
  svg.replace(/^<svg[^>]*>\s*/, "").replace(/\s*<\/svg>\s*$/, "");
const wordmark = inner(
  readFileSync(`${CARD}/young-muslims-wordmark.svg`, "utf8"),
);
const lockup = (mark, colour) =>
  `<svg width="219.546" height="24" viewBox="0 0 219.546 24" fill="none" xmlns="http://www.w3.org/2000/svg">
${mark}
<g transform="translate(29.0837 0)">${wordmark}</g>
</svg>
`
    .replaceAll("#043222", colour)
    .replaceAll("#F9F9FA", colour);
writeFileSync(
  `${CARD}/cover-sisters.svg`,
  lockup(inner(readFileSync(`${CARD}/sisters-ym.svg`, "utf8")), "#043222"),
);
writeFileSync(
  `${CARD}/cover-brothers.svg`,
  lockup(
    `<g transform="scale(${24 / 167})">${inner(readFileSync(`${CARD}/watermark-brothers.svg`, "utf8"))}</g>`,
    "#FFFFFF",
  ),
);
console.log("card/cover-brothers.svg, card/cover-sisters.svg");

// --- Chip icon masks -------------------------------------------------------
//
// The chips draw their icons as masks in the text's colour (so they turn
// Warm Snow with the hover fill). Figma's Instagram icon sits on a white
// square, which as a mask is the whole square: drop it.
writeFileSync(
  `${CARD}/instagram-mask.svg`,
  readFileSync(`${CARD}/instagram-royal.svg`, "utf8").replace(
    /<rect [^>]*fill="white"\/>\s*/,
    "",
  ),
);
console.log("card/instagram-mask.svg");
