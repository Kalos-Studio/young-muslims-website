// Builds the Support "Why it matters" photo crops in
// design-assets/figma/support/why/: the brother thrown in the air (the
// Figma section's image fill, node 446:1855, 4096 x 2731, FILL), framed as
// each frame frames it (desktop 415:1602, tablet 447:2464, mobile 447:2957)
// for the drifting layer between the two waves (why-it-matters.tsx).
//
// The layer is the wave band (section y 540 to 1180 in every frame: both
// waves' edges stay inside it, DESIGN-SYSTEM.md, "Support why it matters")
// plus half the drift (--support-why-drift, 6rem) above and below, as wide
// as the band's view box (desktop 1440; tablet 1280 and mobile 768, centred
// on the frame, so the wider screens of each range see more). Each crop is
// the part of the photo the frame shows there, from Figma's own placement
// of the photo rect (FILL at the image's own aspect, so the image is the
// rect); where the layer runs past the photo (the mobile photo, 676 tall),
// the photo is enlarged about the layer's centre until it covers it.
//
// Each crop has Figma's grain baked in, not applied live (a live SVG filter
// on a scrolling layer repaints on the CPU in Safari: the leadership
// section's finding): the photo's NOISE effect is MONOTONE, black at 24%,
// density 1, size 0.568, applied as in scripts/about-leadership-assets.mjs
// (each grain darkens its pixels by a uniform 0 to 24%).
//
//   node scripts/support-why-assets.mjs <the fill, PNG or JPEG>
import { mkdirSync } from "node:fs";
import { createRequire } from "node:module";

const sharp = createRequire(import.meta.url)("sharp");
const DIR = "design-assets/figma/support/why";

/* The band in section px, and half the drift (6rem). */
const BAND = { top: 540, bottom: 1180 };
const HALF_DRIFT = 48;

/*
 * Each frame: the photo rect in the section (x, y, width, height), the
 * view box's width and centre, and the crop's pixels per CSS px.
 */
const FRAMES = {
  desktop: {
    photo: [-51, 475, 1546.311279296875, 1031],
    width: 1440,
    centre: 720,
    density: 2,
  },
  tablet: {
    photo: [-415, 475, 1546.311279296875, 1031],
    width: 1280,
    centre: 384,
    density: 2,
  },
  mobile: {
    photo: [-415, 519, 1014, 676],
    width: 768,
    centre: 180,
    density: 3,
  },
};

/* Figma's NOISE effect: the most a grain darkens, and its size in CSS px. */
const NOISE = { alpha: 0.24, size: 0.5680751204490662 };

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

/* Figma's monotone noise on raw RGB (see about-leadership-assets.mjs). */
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

const source = process.argv[2];
if (!source) {
  console.error("Pass the Figma photo (the section's image fill).");
  process.exit(1);
}
const { width: sw, height: sh } = await sharp(source).metadata();
mkdirSync(DIR, { recursive: true });
for (const [name, frame] of Object.entries(FRAMES)) {
  const [px, py, pw, ph] = frame.photo;
  // The layer, in the photo rect's px.
  const layer = {
    x: frame.centre - frame.width / 2 - px,
    y: BAND.top - HALF_DRIFT - py,
    width: frame.width,
    height: BAND.bottom - BAND.top + 2 * HALF_DRIFT,
  };
  // Enlarge the photo about the layer's centre until it covers the layer:
  // the region of the photo shown is the layer shrunk by that, clamped in.
  const enlarge = Math.max(1, layer.width / pw, layer.height / ph);
  const w = layer.width / enlarge;
  const h = layer.height / enlarge;
  const cx = layer.x + layer.width / 2;
  const cy = layer.y + layer.height / 2;
  const left = Math.min(Math.max(cx - w / 2, 0), pw - w);
  const top = Math.min(Math.max(cy - h / 2, 0), ph - h);
  const scale = sw / pw; // image px per photo px
  const region = {
    left: Math.round(left * scale),
    top: Math.round(top * scale),
    width: Math.min(sw, Math.round(w * scale)),
    height: Math.min(sh, Math.round(h * scale)),
  };
  const width = layer.width * frame.density;
  const height = layer.height * frame.density;
  const { data } = await sharp(source)
    .extract(region)
    .resize({ width, height, fit: "fill", kernel: "lanczos3" })
    .removeAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const seed = [...`support-why-${name}`].reduce(
    (hash, char) => Math.imul(hash ^ char.charCodeAt(0), 16777619),
    2166136261,
  );
  const grained = addNoise(
    data,
    width,
    height,
    NOISE.size * frame.density,
    seed,
  );
  const info = await sharp(grained, { raw: { width, height, channels: 3 } })
    .jpeg({ quality: 84, mozjpeg: true })
    .toFile(`${DIR}/why-${name}.jpg`);
  console.log(
    `why-${name}.jpg ${info.width} x ${info.height}, ${(info.size / 1024).toFixed(0)} KB (from ${region.width} x ${region.height} at ${region.left}, ${region.top}${enlarge > 1 ? `; photo enlarged ${enlarge.toFixed(3)}x` : ""})`,
  );
}
