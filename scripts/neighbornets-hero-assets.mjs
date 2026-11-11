// Builds the NeighborNets hero photo crops in
// design-assets/figma/neighbornets/hero/: the group on the field (the Figma
// hero's image fill, 2731 x 4096), framed as each frame frames it (desktop
// 301:2068, tablet 374:247, mobile 401:1230). The hero covers the viewport
// with them (object-fit: cover), art-directed per breakpoint.
//
// Each crop is a region of the original (left, top, width, height), measured
// from the frames: the group's heads about a quarter down, the title over
// their torsos.
//
//   node scripts/neighbornets-hero-assets.mjs <figma-photo.jpg>
import { mkdirSync } from "node:fs";
import { createRequire } from "node:module";

const sharp = createRequire(import.meta.url)("sharp");
const DIR = "design-assets/figma/neighbornets/hero";

const CROPS = {
  // 1440 x 981: the whole group across the frame, a little cut at the right.
  desktop: { left: 6, top: 1275, width: 2152, height: 1460 },
  // 768 x 981: the middle of the group, larger.
  tablet: { left: 583, top: 1081, width: 1567, height: 2002 },
  // 360 x 778: the five at the centre, the field below them.
  mobile: { left: 927, top: 1032, width: 878, height: 1898 },
};

const source = process.argv[2];
if (!source) {
  console.error("Pass the Figma photo (the hero's image fill).");
  process.exit(1);
}
mkdirSync(DIR, { recursive: true });
for (const [name, region] of Object.entries(CROPS)) {
  await sharp(source)
    .extract(region)
    .jpeg({ quality: 80, mozjpeg: true })
    .toFile(`${DIR}/hero-${name}.jpg`);
  console.log(`hero-${name}.jpg (${region.width} x ${region.height})`);
}
