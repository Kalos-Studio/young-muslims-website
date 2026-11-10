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
  writeFileSync(`${DIR}/marker-${kind}.svg`, svg);
  console.log(`marker-${kind}.svg (${BOX.toFixed(4)} box, circle ${CIRCLE})`);
}
console.log(`circle share of the box: ${(CIRCLE / BOX).toFixed(6)}`);
