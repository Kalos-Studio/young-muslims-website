// Builds the Store page's closing CTA photo crops in
// design-assets/figma/store/cta/ (Figma 456:3355, tablet 456:3611, mobile
// 456:3753; DESIGN-SYSTEM.md, "Store split"): the sisters on the boardwalk
// by the lake, the CTA's fill (1200 x 1600, portrait, the largest Figma
// has; the group spans about 880 of its pixels across).
//
// Framing: each frame's render matched against the fill (normalised
// cross-correlation over the photo, clear of the text and buttons): desktop
// draws it 1.21x from (7, 509), tablet 0.895x from (85, 362), mobile 0.66x
// from (309, 182). Each crop is the region the CTA's photo layer (the
// section plus `--closing-cta-drift`, 80px above and below) shows at the
// frame's width:
//
// - desktop: 1440 x 883 from 1.21x: (7, 443) 1190 x 730.
// - tablet: 768 x 1054 from 0.895x, widened to the right as far as it stays
//   centred on Figma's framing (0 to 1028), so wider tablets cover by width
//   and keep the whole group: (0, 273) 1028 x 1177.
// - mobile: Figma shows a 545-wide strip at 0.66x, the fill's full height
//   for the 1054 layer; the whole fill (centred within 19px of Figma's
//   strip) frames the same at 360 and keeps more of the group on wider
//   phones: (0, 0) 1200 x 1600.
//
// Each is rendered at the width its screens draw it at the density they
// need (OUTPUT: 2x a 1440 desktop, 2x a 1279 tablet, 3x the 791 a phone
// draws it at), with Lanczos and light sharpening, as the other CTA photos
// are. The fill caps the detail: desktop enlarges it about 1.2x (2.4x at
// 2x), so a larger original from YM is the only full fix.
//
//   node scripts/store-cta-assets.mjs <the fill>
import { mkdirSync } from "node:fs";
import { createRequire } from "node:module";

const sharp = createRequire(import.meta.url)("sharp");
const DIR = "design-assets/figma/store/cta";
const CROPS = {
  desktop: { left: 7, top: 443, width: 1190, height: 730 },
  tablet: { left: 0, top: 273, width: 1028, height: 1177 },
  mobile: { left: 0, top: 0, width: 1200, height: 1600 },
};
const OUTPUT = { desktop: 2880, tablet: 2560, mobile: 2400 };

const source = process.argv[2];
if (!source) {
  console.error("Pass the CTA's image fill.");
  process.exit(1);
}
mkdirSync(DIR, { recursive: true });
for (const [name, region] of Object.entries(CROPS)) {
  const out = OUTPUT[name];
  const enlarged = out / region.width;
  const info = await sharp(source)
    .extract(region)
    .resize({ width: out, kernel: "lanczos3" })
    .sharpen({ sigma: Math.min(1.6, 0.6 + 0.2 * enlarged), m1: 1, m2: 2 })
    .jpeg({ quality: 86, mozjpeg: true })
    .toFile(`${DIR}/sisters-boardwalk-${name}.jpg`);
  console.log(
    `sisters-boardwalk-${name}.jpg ${info.width} x ${info.height} (from ${region.width} x ${region.height}, ${enlarged.toFixed(2)}x)`,
  );
}
