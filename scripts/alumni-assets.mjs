// Builds the Stories page's alumni cards' photos in
// design-assets/figma/stories/alumni/ (Figma 587:1538, tablet 593:1673,
// mobile 593:1733; DESIGN-SYSTEM.md, "Stories alumni"):
//
// - <slug>.jpg: each card's photo, its source centred to cover the image
//   box (285 x 282) as Figma covers it, at up to twice that size (never
//   upscaled). Muneeb's source is his Figma fill (593:1658), vendored as
//   muneeb-syed-source.png. Add each new team member's vendored source to
//   ALUMNI.
//
// Their story pages' hero crops come from scripts/story-page-assets.mjs.
//
//   node scripts/alumni-assets.mjs
import { createRequire } from "node:module";
import { join } from "node:path";

const sharp = createRequire(import.meta.url)("sharp");
const DIR = "design-assets/figma/stories/alumni";
const BOX = { width: 285, height: 282 };

/* Each team member's slug and vendored source. */
const ALUMNI = {
  "muneeb-syed": join(DIR, "muneeb-syed-source.png"),
};

const aspect = BOX.width / BOX.height;

for (const [slug, source] of Object.entries(ALUMNI)) {
  const { width: sw, height: sh } = await sharp(source).metadata();
  const width = Math.min(sw, Math.round(sh * aspect));
  const height = Math.min(sh, Math.round(sw / aspect));
  await sharp(source)
    .extract({
      left: Math.round((sw - width) / 2),
      top: Math.round((sh - height) / 2),
      width,
      height,
    })
    .resize({ width: Math.min(BOX.width * 2, width) })
    .jpeg({ quality: 82, mozjpeg: true })
    .toFile(join(DIR, `${slug}.jpg`));
  console.log(`${slug}.jpg`);
}
