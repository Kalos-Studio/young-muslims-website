// Builds the About stats section's background photo in
// design-assets/figma/about/stats/ (Figma 534:2641, tablet 595:2037, mobile
// 596:2700; DESIGN-SYSTEM.md, "About stats"):
//
// - celebration-{desktop,tablet,mobile}.jpg: the brothers lifting one of
//   their own, from the Figma image fill (1080 x 720), framed as each frame
//   frames it but at the parallax layer's shape: the section plus
//   --about-stats-drift (96) tall, so the layer drifts without the browser
//   zooming the photo further. Each region is centred on the frame's own
//   crop and kept inside the photo. Figma's fill treatment is baked in:
//   saturation -1 (black and white) and contrast -0.2, fitted against
//   Figma's render (with its 48% Obsidian overlay taken out) as grey x
//   0.842 + 2.4. Rendered at 2x (3x on mobile) with Lanczos and light
//   sharpening; the original is small, so these are enlarged (logged).
//
//   node scripts/about-stats-assets.mjs <figma-photo.png>
import { mkdirSync } from "node:fs";
import { createRequire } from "node:module";

const sharp = createRequire(import.meta.url)("sharp");
const OUT = "design-assets/figma/about/stats";
const DRIFT = 96;

/*
 * Each frame: its size, the output scale, and its fill's transform as
 * [a, tx, d, ty] (the region of the photo it shows).
 */
const FRAMES = {
  desktop: {
    width: 1440,
    height: 1024,
    scale: 2,
    crop: [
      0.7643312215805054, 0.23566877841949463, 0.8152866363525391,
      0.01273886114358902,
    ],
  },
  tablet: {
    width: 768,
    height: 1024,
    scale: 2,
    crop: [
      0.4923076927661896, 0.3472139537334442, 0.9846153855323792,
      0.015384623780846596,
    ],
  },
  mobile: {
    width: 360,
    height: 958,
    scale: 3,
    crop: [0.2505219280719757, 0.4104842245578766, 1, 0],
  },
};

const source = process.argv[2];
if (!source) {
  console.error("Pass the Figma photo (the section's image fill).");
  process.exit(1);
}
mkdirSync(OUT, { recursive: true });
const { width: sw, height: sh } = await sharp(source).metadata();
for (const [name, frame] of Object.entries(FRAMES)) {
  const [a, tx, d, ty] = frame.crop;
  const cx = (tx + a / 2) * sw;
  const cy = (ty + d / 2) * sh;
  // The layer's shape (the section plus the drift), at the frame's scale
  // of the photo, shrunk to fit the photo if it must.
  const aspect = frame.width / (frame.height + DRIFT);
  let width = a * sw;
  let height = width / aspect;
  if (height > sh) {
    height = sh;
    width = height * aspect;
  }
  const left = Math.round(Math.min(sw - width, Math.max(0, cx - width / 2)));
  const top = Math.round(Math.min(sh - height, Math.max(0, cy - height / 2)));
  const region = {
    left,
    top,
    width: Math.round(width),
    height: Math.round(height),
  };
  const outWidth = frame.width * frame.scale;
  const info = await sharp(source)
    .extract(region)
    .greyscale()
    .linear(0.842, 2.4)
    .resize({ width: outWidth, kernel: "lanczos3" })
    .sharpen({ sigma: 0.9, m1: 1, m2: 2 })
    .jpeg({ quality: 84, mozjpeg: true })
    .toFile(`${OUT}/celebration-${name}.jpg`);
  console.log(
    `celebration-${name}.jpg ${info.width} x ${info.height} from ${region.width} x ${region.height} (${(outWidth / region.width).toFixed(2)}x)`,
  );
}
