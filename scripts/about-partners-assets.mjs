// Builds the About page's partner logos (Figma 544:653, tablet 596:2430,
// mobile 596:3377; DESIGN-SYSTEM.md, "About partners") in
// design-assets/figma/about/partners/:
//
// - <slug>.webp: each raster logo as Figma shows it (its image fill's crop,
//   or a cover crop for "fill" images) in its 1440 frame box, at up to three
//   times that height (never upscaled), lossless with its transparency.
// - american-muslims-for-palestine.svg: AMP's logo, vectorized in Figma
//   (white on an Obsidian box), with the export's canvas layers removed.
//
// The sources are the logos' Figma image fills (and the AMP export),
// vendored in sources/.
//
//   node scripts/about-partners-assets.mjs
import { readFileSync, writeFileSync } from "node:fs";
import { createRequire } from "node:module";
import { join } from "node:path";

const sharp = createRequire(import.meta.url)("sharp");
const DIR = "design-assets/figma/about/partners";
const SCALE = 3;

/*
 * slug, Figma box (w x h), and its fill: "fill" (cover) or a crop as
 * Figma's image transform, [[scaleX, translateX], [scaleY, translateY]]
 * in shares of the image.
 */
const LOGOS = [
  [
    "icna",
    344,
    131.72,
    [
      [1, 0],
      [0.3829, 0.3121],
    ],
  ],
  [
    "icna-council-for-social-justice",
    365,
    94,
    [
      [1, 0],
      [0.2578, 0.3711],
    ],
  ],
  [
    "family-youth-institute",
    204,
    130,
    [
      [1, 0],
      [0.639, 0.1408],
    ],
  ],
  [
    "helping-hand",
    412,
    94,
    [
      [0.8958, 0.0308],
      [0.4667, 0.2095],
    ],
  ],
  [
    "us-council-of-muslim-organizations",
    324,
    128,
    [
      [1, 0],
      [0.8409, 0],
    ],
  ],
  ["yaqeen-institute", 440, 64, "fill"],
  ["qalam", 254, 76, "fill"],
  [
    "oaktree-institute",
    112,
    114,
    [
      [0.8267, 0.08],
      [0.8433, 0.0867],
    ],
  ],
  ["muslim-alliance-for-black-lives", 266, 86, "fill"],
  ["msa-national", 256, 96, "fill"],
  [
    "khalil-center",
    319,
    72,
    [
      [1, 0],
      [0.4957, 0.2493],
    ],
  ],
  [
    "icna-relief",
    249,
    70,
    [
      [1, 0],
      [0.2817, 0.36],
    ],
  ],
];

for (const [slug, width, height, fill] of LOGOS) {
  const source = join(DIR, "sources", `${slug}.png`);
  const { width: sw, height: sh } = await sharp(source).metadata();
  let image = sharp(source);
  if (fill !== "fill") {
    const [[ax, tx], [ay, ty]] = fill;
    image = image.extract({
      left: Math.round(tx * sw),
      top: Math.round(ty * sh),
      width: Math.round(ax * sw),
      height: Math.round(ay * sh),
    });
  }
  const cropped = await image.png().toBuffer();
  const { height: ch } = await sharp(cropped).metadata();
  const outHeight = Math.min(ch, Math.round(height * SCALE));
  const info = await sharp(cropped)
    .resize({
      width: Math.round((outHeight * width) / height),
      height: outHeight,
      fit: fill === "fill" ? "cover" : "fill",
      kernel: "lanczos3",
    })
    .webp({ lossless: true, effort: 6 })
    .toFile(join(DIR, `${slug}.webp`));
  console.log(`${slug}.webp ${info.width} x ${info.height}`);
}

// AMP: keep the logo's own box and paths; drop the export's canvas.
const amp = readFileSync(
  join(DIR, "sources", "american-muslims-for-palestine.svg"),
  "utf8",
);
const body = amp.match(/<g id="image 2 \[Vectorized\]">([\s\S]*?)<\/g>/)[1];
writeFileSync(
  join(DIR, "american-muslims-for-palestine.svg"),
  `<svg width="284" height="130" viewBox="0 0 284 130" fill="none" xmlns="http://www.w3.org/2000/svg">${body}</svg>\n`,
);
console.log("american-muslims-for-palestine.svg");
