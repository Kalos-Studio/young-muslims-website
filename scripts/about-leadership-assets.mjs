// Builds the About page's leadership photos in
// design-assets/figma/about/leadership/ (Figma 530:273, tablet 595:2007,
// mobile 596:2674; DESIGN-SYSTEM.md, "About leadership"):
//
// - <slug>-{desktop,tablet,mobile}.jpg: each photo framed as each frame
//   frames it, from the Figma image fill: the region its fill's image
//   transform shows (CROP: x tx..tx+a, y ty..ty+d of the photo; FILL:
//   centred cover), rendered at the size the screens need (desktop 1440 x
//   2048, 2x the 720 x 1024 panel; tablet 768 x 2048, 2x 384 x 1024; mobile
//   1080 x 1449, 3x the 360 x 483 banner) with Lanczos and light
//   sharpening, so the browser never stretches it. The panel then covers
//   the viewport's height with it.
//
// Each crop has Figma's grain baked in (NOISE), not applied live: Safari
// runs a live SVG filter on the CPU, and the panel's BlobReveal sweeps
// repaint the photo every frame, so a live grain slowed every swap on
// iPhone. Each IMG frame (531:306, 534:321, 534:331) carries a Figma NOISE
// effect: MONOTONE, black at 24% (alpha 0.24), density 1, size 0.5. Measured
// against Figma's own 2x export (inside each flat block of its
// nearest-neighbour upscale, where only the noise varies): every grain
// darkens its pixels by the same random amount on all three channels,
// uniform from 0 to 24% (out = in x (1 - alpha)), so the photo reads 12%
// darker on average, which this matches. A grain is 0.5 Figma (CSS) px, so
// GRAIN_PX of each crop's pixels: 1 on the desktop and tablet crops (2x), 1.5
// on the mobile one (3x).
//
//   node scripts/about-leadership-assets.mjs <dir of Figma fills>
//
// The directory holds each photo's fill as <slug>.png.
import { mkdirSync } from "node:fs";
import { createRequire } from "node:module";
import { join } from "node:path";

const sharp = createRequire(import.meta.url)("sharp");
const OUT = "design-assets/figma/about/leadership";

/* Each frame's output size. */
const FRAMES = {
  desktop: [1440, 2048],
  tablet: [768, 2048],
  mobile: [1080, 1449],
};

/* Figma's NOISE effect: the most a grain darkens, and its size in CSS px. */
const NOISE = { alpha: 0.24, size: 0.5 };
/* Each frame's crop pixels per CSS (Figma) px. */
const DENSITY = { desktop: 2, tablet: 2, mobile: 3 };

/* A small seeded generator (mulberry32), so the grain is the same each run. */
function random(seed) {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/*
 * Figma's monotone noise on raw RGB: each grain (`grain` px square) darkens
 * its pixels by one random amount, uniform from 0 to NOISE.alpha, the same
 * on every channel.
 */
function addNoise(rgb, width, height, grain, seed) {
  const next = random(seed);
  const columns = Math.ceil(width / grain);
  const rows = Math.ceil(height / grain);
  const keep = new Float32Array(columns * rows);
  for (let i = 0; i < keep.length; i++) keep[i] = 1 - NOISE.alpha * next();
  const out = Buffer.alloc(rgb.length);
  for (let y = 0; y < height; y++) {
    const row = Math.floor(y / grain) * columns;
    for (let x = 0; x < width; x++) {
      const factor = keep[row + Math.floor(x / grain)];
      const i = (y * width + x) * 3;
      out[i] = Math.round(rgb[i] * factor);
      out[i + 1] = Math.round(rgb[i + 1] * factor);
      out[i + 2] = Math.round(rgb[i + 2] * factor);
    }
  }
  return out;
}

/*
 * Each photo per frame: its fill's transform as [a, tx, d, ty], or null
 * for FILL (centred cover).
 */
const PHOTOS = {
  "leaders-lake": {
    desktop: [
      0.46875, 0.3177083134651184, 0.4444445073604584, 0.2560763657093048,
    ],
    tablet: [
      0.37336698174476624, 0.2892605662345886, 0.6627119779586792,
      0.17852114140987396,
    ],
    mobile: [
      0.4739970862865448, 0.2636334300041199, 0.4232923984527588,
      0.24390864372253418,
    ],
  },
  "sisters-ymc": {
    desktop: [0.46875, 0.265625, 1, 0],
    tablet: [0.249481201171875, 0.38862982392311096, 1, 0],
    mobile: [0.4963025748729706, 0.26367682218551636, 1, 0],
  },
  "brothers-award": {
    desktop: null,
    tablet: [0.5626049637794495, 0.21869751811027527, 1, 0],
    mobile: [1, 0, 0.894444465637207, 0.02813791297376156],
  },
};

const dir = process.argv[2];
if (!dir) {
  console.error("Pass the directory of Figma fills (<slug>.png).");
  process.exit(1);
}
mkdirSync(OUT, { recursive: true });
for (const [slug, frames] of Object.entries(PHOTOS)) {
  const source = join(dir, `${slug}.png`);
  const { width: sw, height: sh } = await sharp(source).metadata();
  for (const [frame, crop] of Object.entries(frames)) {
    const [width, height] = FRAMES[frame];
    let region;
    if (crop) {
      const [a, tx, d, ty] = crop;
      region = {
        left: Math.max(0, Math.round(tx * sw)),
        top: Math.max(0, Math.round(ty * sh)),
        width: Math.min(sw, Math.round(a * sw)),
        height: Math.min(sh, Math.round(d * sh)),
      };
    } else {
      const scale = Math.max(width / sw, height / sh);
      const w = Math.round(width / scale);
      const h = Math.round(height / scale);
      region = {
        left: Math.round((sw - w) / 2),
        top: Math.round((sh - h) / 2),
        width: w,
        height: h,
      };
    }
    const enlarge = width / region.width;
    const { data } = await sharp(source)
      .extract(region)
      .resize({ width, height, fit: "cover", kernel: "lanczos3" })
      .sharpen({ sigma: enlarge > 1.2 ? 0.9 : 0.6, m1: 1, m2: 2 })
      .removeAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true });
    const seed = [...`${slug}-${frame}`].reduce(
      (hash, char) => Math.imul(hash ^ char.charCodeAt(0), 16777619),
      2166136261,
    );
    const grained = addNoise(
      data,
      width,
      height,
      NOISE.size * DENSITY[frame],
      seed,
    );
    await sharp(grained, { raw: { width, height, channels: 3 } })
      .jpeg({ quality: 86, mozjpeg: true })
      .toFile(join(OUT, `${slug}-${frame}.jpg`));
    console.log(
      `${slug}-${frame}.jpg ${width} x ${height} from ${region.width} x ${region.height} (${enlarge.toFixed(2)}x)`,
    );
  }
}
