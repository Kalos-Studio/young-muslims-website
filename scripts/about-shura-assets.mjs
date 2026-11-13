// Builds the About page's Shura cards' photos ("The Young Muslims team.",
// Figma 542:174, tablet 596:2123, mobile 596:2778; DESIGN-SYSTEM.md,
// "About Shura") in design-assets/figma/about/shura/:
//
// - <slug>.jpg: each member's photo, its source centred to cover the image
//   box (285 x 282) as Figma covers it, at up to twice that size (never
//   upscaled: Figma's fills are 400 square, so these are 400 x 396).
//
// The sources are the members' Figma fills, vendored in sources/<slug>.png.
// Muneeb's is the Stories alumni card's photo (the same fill), reused from
// design-assets/figma/stories/alumni/. Members without a photo have no
// source: their cards show a Royal or Jade block until YM sends one.
//
//   node scripts/about-shura-assets.mjs
import { readdirSync } from "node:fs";
import { createRequire } from "node:module";
import { join } from "node:path";

const sharp = createRequire(import.meta.url)("sharp");
const DIR = "design-assets/figma/about/shura";
const BOX = { width: 285, height: 282 };
const aspect = BOX.width / BOX.height;

for (const file of readdirSync(join(DIR, "sources")).sort()) {
  const slug = file.replace(/\.png$/, "");
  const source = join(DIR, "sources", file);
  const { width: sw, height: sh } = await sharp(source).metadata();
  const width = Math.min(sw, Math.round(sh * aspect));
  const height = Math.min(sh, Math.round(sw / aspect));
  const info = await sharp(source)
    .extract({
      left: Math.round((sw - width) / 2),
      top: Math.round((sh - height) / 2),
      width,
      height,
    })
    .resize({ width: Math.min(BOX.width * 2, width) })
    .jpeg({ quality: 82, mozjpeg: true })
    .toFile(join(DIR, `${slug}.jpg`));
  console.log(`${slug}.jpg ${info.width} x ${info.height}`);
}
