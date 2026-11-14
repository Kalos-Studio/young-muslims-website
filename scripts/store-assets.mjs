// Builds the Store split's photos in design-assets/figma/store/ (Figma
// 456:3296 desktop, 456:3556 tablet, 456:3698 mobile; hover 456:3515,
// 456:3807, 456:3876; DESIGN-SYSTEM.md, "Store split"): the brother in the
// YM track jacket (the Brothers half's fill, 4096 x 2731) and the sister in
// the YM hoodie (the Sisters half's, 1365 x 2048, the largest Figma has).
//
// Figma's fills are the colour originals (it desaturates them at rest), so
// these are kept in colour and the page desaturates them with a CSS filter:
// one photo serves the black-and-white rest and the colour hover.
//
// The brothers' photo is drawn as tall as its half, about 1.5x as wide (its
// shape): 1350 wide on a 1440 x 900 screen, 1690 at Figma's 1127, so it is
// scaled to 3200 wide (about 2x). The sisters' is portrait and drawn about
// as wide as its half (720 on desktop): kept at its full 1365.
//
//   node scripts/store-assets.mjs <brothers fill> <sisters fill>
import { mkdirSync } from "node:fs";
import { createRequire } from "node:module";

const sharp = createRequire(import.meta.url)("sharp");
const DIR = "design-assets/figma/store";
const [brothers, sisters] = process.argv.slice(2);
if (!brothers || !sisters) {
  console.error("Pass the brothers' and the sisters' image fills.");
  process.exit(1);
}
mkdirSync(DIR, { recursive: true });
for (const [name, source, width] of [
  ["brothers", brothers, 3200],
  ["sisters", sisters, undefined],
]) {
  const pipeline = sharp(source).rotate();
  if (width) pipeline.resize({ width, kernel: "lanczos3" });
  const info = await pipeline
    .jpeg({ quality: 84, mozjpeg: true })
    .toFile(`${DIR}/${name}.jpg`);
  console.log(`${name}.jpg ${info.width} x ${info.height} ${info.size}B`);
}
