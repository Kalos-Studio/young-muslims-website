// Builds the Support hero photo crops in design-assets/figma/support/hero/:
// the sisters embracing by the lake (the Figma hero's image fill, node
// 442:1752, 2048 x 1365), framed as each frame frames it (desktop 415:1573,
// tablet 447:2198, mobile 447:2755). The hero covers the viewport with them
// (object-fit: cover), art-directed per breakpoint (support-hero.tsx).
//
// Each crop is the region of the fill each frame shows, from Figma's own
// geometry: the fill sits in its blob vector (4516.67 x 1837.73, at
// FRAMES[].vector in the frame) with its CROP image transform (a, tx, d,
// ty: the image spans the vector from u = -tx / a to (1 - tx) / a, and the
// same down), so in frame px it is a rect; the crop is the part of it
// inside the frame (down to the photo's foot where the image ends above the
// frame's), at the frame's aspect, centred on what the frame shows.
//
// Each crop is rendered at the size the screens that show it need (OUTPUT:
// desktop 2880 wide, 2x a 1440 screen; tablet 1536, 2x 768; mobile 1200,
// over 3x a 390 phone), with Lanczos and light sharpening, so the browser
// never stretches it. The fill caps the detail: desktop shows about 1425 of
// its pixels across (enlarged 2x here), tablet 776, mobile 438 (enlarged
// 2.7x): a larger original would make the phones crisper.
//
// Figma also lays its monotone NOISE effect over this photo; it is not
// baked in here (the About hero's decision: a clean photo; Figma's 32%
// Obsidian tint is the hero's own overlay).
//
//   node scripts/support-hero-assets.mjs <the fill, JPEG>
import { mkdirSync } from "node:fs";
import { createRequire } from "node:module";

const sharp = createRequire(import.meta.url)("sharp");
const DIR = "design-assets/figma/support/hero";

/* The vector's size (the image fill's 0..1 space). */
const VECTOR = { width: 4516.67138671875, height: 1837.72802734375 };

/*
 * Each frame: its size, where the photo vector sits in it (its BG frame's
 * offset plus the vector's), and the fill's image transform [a, tx, d, ty].
 */
const FRAMES = {
  desktop: {
    width: 1440,
    height: 970,
    vector: { x: -2344.87939453125, y: -53.76153564453125 - 736.7059326171875 },
    fill: [
      2.1818718910217285, -0.8690652847290039, 1.3319543600082397,
      -0.3468855917453766,
    ],
  },
  tablet: {
    width: 768,
    height: 1024,
    vector: {
      x: -269.41796875 - 2344.87939453125,
      y: -129 - 736.7059326171875,
    },
    fill: [
      2.3333652019500732, -0.998026967048645, 1.4244354963302612,
      -0.4287686049938202,
    ],
  },
  mobile: {
    width: 360,
    height: 958,
    vector: { x: -540 - 2344.87939453125, y: -173 - 736.7059326171875 },
    fill: [
      2.7505149841308594, -1.3208531141281128, 1.6790903806686401,
      -0.6847596168518066,
    ],
  },
};
/* Each crop's rendered width (its height in proportion). */
const OUTPUT = { desktop: 2880, tablet: 1536, mobile: 1200 };

const source = process.argv[2];
if (!source) {
  console.error("Pass the Figma photo (the Support hero's image fill).");
  process.exit(1);
}
const { width: imageWidth, height: imageHeight } =
  await sharp(source).metadata();
mkdirSync(DIR, { recursive: true });
for (const [name, frame] of Object.entries(FRAMES)) {
  const [a, tx, d, ty] = frame.fill;
  // The image's rect in frame px.
  const rect = {
    x: frame.vector.x + (-tx / a) * VECTOR.width,
    y: frame.vector.y + (-ty / d) * VECTOR.height,
    width: VECTOR.width / a,
    height: VECTOR.height / d,
  };
  const scale = imageWidth / rect.width; // image px per frame px
  // What the frame shows, in image px, down to where the image ends.
  const top = -rect.y * scale;
  const shown = {
    left: -rect.x * scale,
    top,
    width: frame.width * scale,
    height: Math.min(frame.height * scale, imageHeight - top),
  };
  // At the frame's aspect, centred on that.
  const aspect = frame.width / frame.height;
  let width = shown.width;
  let height = width / aspect;
  if (height > shown.height) {
    height = shown.height;
    width = height * aspect;
  }
  const region = {
    left: Math.round(shown.left + (shown.width - width) / 2),
    top: Math.round(shown.top),
    width: Math.round(width),
    height: Math.round(height),
  };
  const out = OUTPUT[name];
  const info = await sharp(source)
    .extract(region)
    .resize({ width: out, kernel: "lanczos3" })
    .sharpen({ sigma: 0.8, m1: 1, m2: 2 })
    .jpeg({ quality: 86, mozjpeg: true })
    .toFile(`${DIR}/hero-${name}.jpg`);
  console.log(
    `hero-${name}.jpg ${info.width} x ${info.height} (from ${region.width} x ${region.height} at ${region.left}, ${region.top}; ${(out / region.width).toFixed(2)}x)`,
  );
}
