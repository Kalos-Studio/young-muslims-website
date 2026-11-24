// Builds the Support page's closing CTA photo crops in
// design-assets/figma/support/cta/ (Figma 415:1632, tablet 447:2253, mobile
// 447:2810; DESIGN-SYSTEM.md, "Closing CTA"): the brothers under the
// magnolia, the CTA's image fill (4096 x 2731).
//
// Placement, from Figma's own transforms: each frame's CTA vector (415:1634,
// 447:2255, 447:2812) is turned 3.7deg (its relative transform) and fills
// with the photo in CROP mode (its imageTransform). Composed, they map
// frame pixels to photo pixels; the image transform counter-turns the photo,
// so it stands upright in every frame (checked here: the composite's turn
// must be under 0.05deg) and each crop is a plain rectangle of the photo.
//
// Each crop is the photo ClosingCta's layer shows (the section plus
// `--closing-cta-drift`, 80px above and below; cover-fit):
//
// - desktop: exactly Figma's: the 1440 frame, y -80 to 803 (2.24 photo px
//   a frame px), well inside the photo.
// - tablet and mobile: Figma draws the photo only about 960 frame px tall
//   (on mobile it stops short of the frame's foot, under the Obsidian
//   cap), less than the 1054 layer, so these take the photo's full height,
//   which cover-fit draws about 1.1x Figma's size, centred across on
//   Figma's framing (the frame's centre) and as wide as the widest screen
//   of the range needs at that size (1279 tablets, 767 phones), so wider
//   screens show more of the photo rather than enlarging it.
//
// Each is rendered at the width its screens draw it at the density they
// need (OUTPUT: 2x a 1440 desktop, 2x a 1279 tablet, 3x the 768 a phone
// draws it at), with Lanczos and light sharpening, as the other CTA photos
// are.
//
//   node scripts/support-cta-assets.mjs <the fill>
import { mkdirSync } from "node:fs";
import { createRequire } from "node:module";

const sharp = createRequire(import.meta.url)("sharp");
const DIR = "design-assets/figma/support/cta";
const DRIFT = 160;
const TURN = [
  0.9979125261306763, -0.06457959115505219, 0.06457959115505219,
  0.9979125261306763,
];
/* Each frame's vector: its size, its relative transform's offset, its
   fill's imageTransform, and the frame's centre across. */
const FRAMES = {
  desktop: {
    size: [2310.845703125, 756.219970703125],
    offset: [-450.9658203125, -79.267578125],
    image: [
      1.2614998817443848, -0.02671574428677559, -0.1531541645526886,
      0.12244141101837158, 0.6191597580909729, 0.12131884694099426,
    ],
    centre: 720,
  },
  tablet: {
    size: [2830.589599609375, 926.30517578125],
    offset: [-1003.9224853515625, -96.05046081542969],
    image: [
      1.9618229866027832, -0.0415470227599144, -0.515753448009491,
      0.1904149204492569, 0.9628869891166687, -0.049010712653398514,
    ],
    centre: 384,
  },
  mobile: {
    size: [2830.589599609375, 926.30517578125],
    offset: [-1202.4307861328125, -96.05046081542969],
    image: [
      2.1499431133270264, -0.045530982315540314, -0.6131544709205627,
      0.208673894405365, 1.0552186965942383, -0.10622179508209229,
    ],
    centre: 180,
  },
};

const source = process.argv[2];
if (!source) {
  console.error("Pass the CTA's image fill.");
  process.exit(1);
}
const { width: PW, height: PH } = await sharp(source).metadata();
mkdirSync(DIR, { recursive: true });

/* 2x3 affine helpers ([a, b, c, d, e, f]: x' = ax + by + c, y' = dx + ey + f). */
const mul = (m, n) => [
  m[0] * n[0] + m[1] * n[3],
  m[0] * n[1] + m[1] * n[4],
  m[0] * n[2] + m[1] * n[5] + m[2],
  m[3] * n[0] + m[4] * n[3],
  m[3] * n[1] + m[4] * n[4],
  m[3] * n[2] + m[4] * n[5] + m[5],
];
const inv = (m) => {
  const det = m[0] * m[4] - m[1] * m[3];
  const a = m[4] / det,
    b = -m[1] / det,
    d = -m[3] / det,
    e = m[0] / det;
  return [a, b, -(a * m[2] + b * m[5]), d, e, -(d * m[2] + e * m[5])];
};
const apply = (m, x, y) => [
  m[0] * x + m[1] * y + m[2],
  m[3] * x + m[4] * y + m[5],
];

const LAYER = {
  desktop: 723 + DRIFT,
  tablet: 894 + DRIFT,
  mobile: 894 + DRIFT,
};
const WIDEST = { desktop: 1440, tablet: 1279, mobile: 767 };
const OUTPUT = { desktop: 2880, tablet: 2560, mobile: 2304 };

for (const [name, frame] of Object.entries(FRAMES)) {
  // Frame px -> vector px -> vector unit box -> photo unit box -> photo px.
  const R = [
    TURN[0],
    TURN[1],
    frame.offset[0],
    TURN[2],
    TURN[3],
    frame.offset[1],
  ];
  const toUnit = [1 / frame.size[0], 0, 0, 0, 1 / frame.size[1], 0];
  const toPx = [PW, 0, 0, 0, PH, 0];
  const M = mul(toPx, mul(frame.image, mul(toUnit, inv(R))));
  const turn = (Math.atan2(M[3], M[0]) * 180) / Math.PI;
  if (Math.abs(turn) > 0.05)
    throw new Error(`${name}: the photo is turned ${turn}deg`);
  let region;
  if (name === "desktop") {
    const [left, top] = apply(M, 0, -DRIFT / 2);
    const [right, bottom] = apply(M, WIDEST.desktop, LAYER.desktop - DRIFT / 2);
    region = { left, top, width: right - left, height: bottom - top };
  } else {
    const [centre] = apply(M, frame.centre, 0);
    const width = (WIDEST[name] * PH) / LAYER[name];
    region = { left: centre - width / 2, top: 0, width, height: PH };
  }
  region = Object.fromEntries(
    Object.entries(region).map(([k, v]) => [k, Math.round(v)]),
  );
  if (
    region.left < 0 ||
    region.left + region.width > PW ||
    region.top < 0 ||
    region.top + region.height > PH
  )
    throw new Error(
      `${name}: the crop leaves the photo ${JSON.stringify(region)}`,
    );
  const out = OUTPUT[name];
  const enlarged = out / region.width;
  const info = await sharp(source)
    .extract(region)
    .resize({ width: out, kernel: "lanczos3" })
    .sharpen({ sigma: Math.min(1.6, 0.6 + 0.2 * enlarged), m1: 1, m2: 2 })
    .jpeg({ quality: 86, mozjpeg: true })
    .toFile(`${DIR}/brothers-magnolia-${name}.jpg`);
  console.log(
    `brothers-magnolia-${name}.jpg ${info.width} x ${info.height} (from ${region.width} x ${region.height} at (${region.left}, ${region.top}), ${enlarged.toFixed(2)}x; Figma's turn ${turn.toFixed(3)}deg)`,
  );
}
