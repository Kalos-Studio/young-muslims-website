// Builds the Support page's "Where your support goes" photos in
// design-assets/figma/support/where/ (Figma 446:2062, tablet 447:2578,
// mobile 447:3069; DESIGN-SYSTEM.md, "Support where your support goes"):
//
// - <slug>.webp: each photo in its organic shape, transparent outside it,
//   from Figma's own 2x PNG export of its tablet node (447:2586, 447:2592,
//   447:2598, 447:2604; 533px wide, so 1066px), the largest the frames show
//   it. Figma exports these vector nodes already cut to their shape, with
//   transparency, so they are only re-encoded here. Desktop now shows the
//   same shaped photos at 450 wide (446:2136…: Figma's 2x export is 900px,
//   the same crop and shape, scaled) and mobile at 280-294, so one file per
//   photo serves every breakpoint (next/image makes the smaller widths).
//
//   node scripts/support-where-assets.mjs <dir of 2x exports>
//
// The directory holds each node's export named by its id with a dash
// (447-2586.png, …).
import { mkdirSync } from "node:fs";
import { createRequire } from "node:module";
import { join } from "node:path";

const sharp = createRequire(import.meta.url)("sharp");
const OUT = "design-assets/figma/support/where";

const PHOTOS = [
  { slug: "neighbornets", node: "447:2586" },
  { slug: "retreats", node: "447:2592" },
  { slug: "leadership", node: "447:2598" },
  { slug: "service", node: "447:2604" },
];

const dir = process.argv[2];
if (!dir) {
  console.error("Pass the directory of 2x exports (447-2586.png, …).");
  process.exit(1);
}
mkdirSync(OUT, { recursive: true });
for (const photo of PHOTOS) {
  const source = join(dir, `${photo.node.replace(":", "-")}.png`);
  const info = await sharp(source)
    .ensureAlpha()
    .webp({ quality: 88, alphaQuality: 100, effort: 6 })
    .toFile(join(OUT, `${photo.slug}.webp`));
  console.log(`${photo.slug}.webp ${info.width} x ${info.height}`);
}
