// Builds the About page's closing CTA photo crops in
// design-assets/figma/about/cta/ (Figma 507:449, tablet 595:1855, mobile
// 596:2566; DESIGN-SYSTEM.md, "About FAQ"): the three sisters at the fall
// festival, the CTA's fill (1080 x 719, the largest Figma has).
//
// Framing (unchanged): Figma draws the photo about 1.45x with the sky above
// the sisters' heads cut, their faces in the frame's top third (above the
// mission line); cover-fit on the whole photo would sit them behind the
// line. So the framed photo drops the top 170px (sky) and the right 80px
// (centring the three across the frame): 1000 x 549 (FRAMED).
//
// Art direction (ClosingCta's `images`): the photo layer is the section
// plus the drift (894 + 160 = 1054 tall on mobile and tablet), and cover-fit
// fills its height there at every width, so each narrower frame only ever
// shows a centred strip of the framed photo: up to 400 of its 1000px across
// on phones (a 767 screen), 668 on tablets (1279). Each crop is that strip
// (desktop, wider and shorter, shows it all), so cover-fit draws each exactly
// as it drew the framed photo: the framing is the same at every width.
//
// Each crop is rendered at the size its screens draw it at the density they
// need (OUTPUT): desktop 3200 wide (2x the 1608 the photo draws at on a 1440
// screen), tablet 2560 (2x 1279) and mobile 2304 (3x the 768 it draws at on
// phones), with Lanczos and light sharpening, as the hero's crops are, so the
// browser never stretches it. The source caps the detail: a phone shows
// about 200 of its pixels across, a 1440 screen about 900; this keeps it
// from softening further on screen. Only a larger original can sharpen it.
//
//   node scripts/about-cta-assets.mjs <the fill, PNG>
import { createRequire } from "node:module";

const sharp = createRequire(import.meta.url)("sharp");
const DIR = "design-assets/figma/about/cta";
/* The framed photo in the fill. */
const FRAMED = { left: 0, top: 170, width: 1000, height: 549 };
/* Each crop's width, centred in the framed photo. */
const STRIP = { desktop: 1000, tablet: 668, mobile: 400 };
/* Each crop's rendered width (its height in proportion). */
const OUTPUT = { desktop: 3200, tablet: 2560, mobile: 2304 };

const source = process.argv[2];
if (!source) {
  console.error("Pass the CTA's image fill.");
  process.exit(1);
}
for (const [name, width] of Object.entries(STRIP)) {
  const region = {
    ...FRAMED,
    left: FRAMED.left + (FRAMED.width - width) / 2,
    width,
  };
  const out = OUTPUT[name];
  const enlarged = out / width;
  const info = await sharp(source)
    .extract(region)
    .resize({ width: out, kernel: "lanczos3" })
    .sharpen({ sigma: Math.min(1.6, 0.6 + 0.2 * enlarged), m1: 1, m2: 2 })
    .jpeg({ quality: 86, mozjpeg: true })
    .toFile(`${DIR}/sisters-festival-${name}.jpg`);
  console.log(
    `sisters-festival-${name}.jpg ${info.width} x ${info.height} (from ${width} x ${region.height}, ${enlarged.toFixed(2)}x)`,
  );
}
