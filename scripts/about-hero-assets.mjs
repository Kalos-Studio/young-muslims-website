// Builds the About hero photo crops in design-assets/figma/about/hero/: the
// group with the YM flags (the Figma hero's image fill, 4096 x 2733),
// framed as each frame frames it (desktop 507:3, tablet 595:1782, mobile
// 596:2493). The hero covers the viewport with them (object-fit: cover),
// art-directed per breakpoint.
//
// Each crop is the region of the original each frame shows, found by
// matching each frame's Figma render against the original (normalised
// cross-correlation, 0.95 or better): frame = original x scale + offset.
// Each crop runs down to the frame's wave (981, 1000 and 940 deep).
//
// Figma's render of the fill is brighter than the original (its image
// adjustments): fitted per channel against the desktop render, outside the
// nav, text and wave, and applied here so the photo reads as it does in
// Figma before the hero's own 25% Obsidian tint.
//
// Each crop is rendered at the size the screens that show it need (OUTPUT:
// desktop 2880 wide, 2x a 1440 screen; tablet 1536, 2x 768; mobile 1200,
// over 3x a 390 phone), with Lanczos and light sharpening, so the browser
// never stretches it. The frames show only part of the 4096-wide original
// (desktop 2051 of its pixels across, tablet 1219, mobile 656), so the
// crops are enlarged here 1.4x, 1.26x and 1.83x: the original caps the
// detail; this keeps it from softening further on screen.
//   node scripts/about-hero-assets.mjs <figma-photo.jpg>
import { mkdirSync } from "node:fs";
import { createRequire } from "node:module";

const sharp = createRequire(import.meta.url)("sharp");
const DIR = "design-assets/figma/about/hero";

/* Each frame: its size down to its wave, and where the original sits in it. */
const FRAMES = {
  // 1440 x 981: the whole group, the screen and the chairs below.
  desktop: { width: 1440, height: 981, scale: 0.702, x: -746, y: -638 },
  // 768 x 1000: the group from the screen down, the red and blue flags.
  tablet: { width: 768, height: 1000, scale: 0.63, x: -794, y: -510 },
  // 360 x 940: the left flag and the centre of the group, the screen above.
  mobile: { width: 360, height: 940, scale: 0.549, x: -714, y: -442 },
};
/* Figma's adjustment, per channel (R, G, B): out = in x gain + offset. */
const GAIN = [1.128, 1.145, 1.151];
const OFFSET = [25.3, 19, 14.8];
/* Each crop's rendered width (its height in proportion). */
const OUTPUT = { desktop: 2880, tablet: 1536, mobile: 1200 };

const source = process.argv[2];
if (!source) {
  console.error("Pass the Figma photo (the hero's image fill).");
  process.exit(1);
}
mkdirSync(DIR, { recursive: true });
for (const [name, frame] of Object.entries(FRAMES)) {
  const region = {
    left: Math.round(-frame.x / frame.scale),
    top: Math.round(-frame.y / frame.scale),
    width: Math.round(frame.width / frame.scale),
    height: Math.round(frame.height / frame.scale),
  };
  const width = OUTPUT[name];
  const info = await sharp(source)
    .extract(region)
    .linear(GAIN, OFFSET)
    .resize({ width, kernel: "lanczos3" })
    .sharpen({ sigma: 0.8, m1: 1, m2: 2 })
    .jpeg({ quality: 86, mozjpeg: true })
    .toFile(`${DIR}/hero-${name}.jpg`);
  console.log(
    `hero-${name}.jpg ${info.width} x ${info.height} (from ${region.width} x ${region.height}, ${(width / region.width).toFixed(2)}x)`,
  );
}
