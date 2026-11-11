// Builds the Stories hero photo crops in design-assets/figma/stories/hero/:
// the sisters with the YM letters (the Figma hero's image fill, 2731 x 4096),
// framed as each frame frames it (desktop 401:3520, tablet 414:316, mobile
// 414:791). The hero covers the viewport with them (object-fit: cover),
// art-directed per breakpoint.
//
// Each crop is the region of the original each frame shows. Desktop, from
// the photo blob's placement (4236 x 1993, flipped upright): the photo is
// 0.5467 units a pixel, its left edge 26.5 units left of the frame and its
// top 424.06 above it. Tablet and mobile place the photo in their blob at
// other scales, so their crops were found by matching each frame's render
// of the blob (Figma's export, clipped to the frame) against the original:
// 0.3477 and 0.2439 frame pixels a photo pixel.
//
//   node scripts/stories-hero-assets.mjs <figma-photo.jpg>
import { mkdirSync } from "node:fs";
import { createRequire } from "node:module";

const sharp = createRequire(import.meta.url)("sharp");
const DIR = "design-assets/figma/stories/hero";

const CROPS = {
  // 1440 x 981: the six across the frame, the neon sign's foot at the top.
  desktop: { left: 48, top: 776, width: 2634, height: 1794 },
  // 768 x 978: the group from the neon sign down, nearly all six.
  tablet: { left: 75, top: 529, width: 2209, height: 2813 },
  // 360 x 934: the neon sign, the centre three and the YM letters.
  mobile: { left: 631, top: 131, width: 1476, height: 3829 },
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
