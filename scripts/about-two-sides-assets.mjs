// Builds the About page's "Two sides. One mission." assets in
// design-assets/figma/about/two-sides/ (Figma 536:2755, tablet 596:2101,
// mobile 596:2757; hover 542:75 / 542:180; scroll flow 597:3609 / 597:3610;
// DESIGN-SYSTEM.md, "About two sides"):
//
// - {brothers,sisters}-letters.svg: each Young Muslims logo without its
//   "O", the full logo's box (485 x 261), so the letters can fade while the
//   monogram stays.
// - {brothers,sisters}-monogram.svg: the logo's "O", its own vector in
//   Figma, on the logo's own canvas (485 x 261), so it sits exactly over the
//   letters (stacked, inset 0) and can later be moved on its own: its box
//   in the canvas is 81 from the left, 122 square.
// - {brothers,sisters}-mark.svg: the same monogram on a viewBox cropped to
//   its own box (MARK), for the scroll sequence's rig, which moves and grows
//   it on its own and crossfades it to the standalone logo.
// - {brothers,sisters}-wordmark.svg: BROTHERS (Royal) and SISTERS (Jade),
//   the hover's wordmarks.
// - sisters-standalone.svg, brothers-standalone.png: the standalone
//   monogram logos the in-wordmark monograms become. The Brothers one is a
//   2400 x 2400 raster in Figma with a transparent margin round its disc
//   (about 1/7 a side); it is trimmed to the disc (square), so it fills its
//   box as the Sisters art does and the two read the same size.
// - {brothers,sisters}-photo-{1-4}.webp: the hover's four photos, top left,
//   top right, bottom left, bottom right, each covering Figma's box at 3x.
//
//   node scripts/about-two-sides-assets.mjs <dir of Figma exports>
//
// The directory holds Figma's SVGs of the two logos (brothers-logo.svg,
// sisters-logo.svg), the wordmarks (brothers-word.svg, sisters-word.svg)
// and the standalone (sisters-standalone.svg), brothers-standalone.png, and
// the photos' fills by node id (photos/596-3437.png, …).
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { createRequire } from "node:module";
import { join } from "node:path";

const sharp = createRequire(import.meta.url)("sharp");
const OUT = "design-assets/figma/about/two-sides";

/* Figma's exports carry editor-only attributes on the root. */
const cleanRoot = (svg) =>
  svg.replace(/<svg [^>]*>/, (root) =>
    root.replace(
      / preserveAspectRatio="none"| overflow="visible"| style="[^"]*"/g,
      "",
    ),
  );
const root = (svg) => svg.match(/<svg [^>]*>/)[0];

/* The hover photos: node, slug, Figma box (w x h). Cover-cropped. */
const PHOTOS = [
  ["596-3437", "brothers-photo-1", 181, 121],
  ["596-3440", "brothers-photo-2", 188, 125],
  ["596-3446", "brothers-photo-3", 166, 125],
  ["596-3443", "brothers-photo-4", 190, 127],
  ["597-3484", "sisters-photo-1", 128, 171],
  ["597-3478", "sisters-photo-2", 188, 126],
  ["597-3487", "sisters-photo-3", 168, 125],
  ["597-3481", "sisters-photo-4", 209, 152],
];
const SCALE = 3;

const dir = process.argv[2];
if (!dir) {
  console.error("Pass the directory of Figma exports.");
  process.exit(1);
}
mkdirSync(OUT, { recursive: true });
const read = (name) => cleanRoot(readFileSync(join(dir, name), "utf8"));

// Brothers: the letters are one group, the monogram one path.
const brothers = read("brothers-logo.svg");
writeFileSync(
  join(OUT, "brothers-letters.svg"),
  `${root(brothers)}\n${brothers.match(/<g id="YOUNG MUSLIMS">[\s\S]*?<\/g>/)[0]}\n</svg>\n`,
);
writeFileSync(
  join(OUT, "brothers-monogram.svg"),
  `${root(brothers)}\n${brothers.match(/<path id="Vector"[^>]*\/>/)[0]}\n</svg>\n`,
);

// Sisters: eleven letter paths, the monogram a group of three.
const sisters = read("sisters-logo.svg");
const letters = sisters.match(/<path id="Vector(?:_\d+)?"[^>]*\/>/g);
if (letters.length !== 11)
  throw new Error(`Expected 11 letters, got ${letters.length}`);
writeFileSync(
  join(OUT, "sisters-letters.svg"),
  `${root(sisters)}\n${letters.join("\n")}\n</svg>\n`,
);
writeFileSync(
  join(OUT, "sisters-monogram.svg"),
  `${root(sisters)}\n${sisters.match(/<g id="Vector_12">[\s\S]*?<\/g>/)[0]}\n</svg>\n`,
);

/* Each monogram's own box in its logo's canvas (Figma 542:53 / 542:66). */
const MARK = {
  brothers: [80.86, 0.34, 121.97],
  sisters: [81.33, 0, 122.04],
};
for (const side of ["brothers", "sisters"]) {
  const [x, y, size] = MARK[side];
  const monogram = readFileSync(join(OUT, `${side}-monogram.svg`), "utf8");
  writeFileSync(
    join(OUT, `${side}-mark.svg`),
    monogram.replace(
      /<svg [^>]*>/,
      `<svg width="${size}" height="${size}" viewBox="${x} ${y} ${size} ${size}" fill="none" xmlns="http://www.w3.org/2000/svg">`,
    ),
  );
}

for (const [from, to] of [
  ["brothers-word.svg", "brothers-wordmark.svg"],
  ["sisters-word.svg", "sisters-wordmark.svg"],
  ["sisters-standalone.svg", "sisters-standalone.svg"],
]) {
  writeFileSync(join(OUT, to), read(from));
}
{
  // Trim the transparent margin, then square the box round the disc.
  const { data, info } = await sharp(join(dir, "brothers-standalone.png"))
    .trim({ threshold: 0 })
    .png()
    .toBuffer({ resolveWithObject: true });
  const size = Math.max(info.width, info.height);
  await sharp(data)
    .extend({
      top: Math.floor((size - info.height) / 2),
      bottom: Math.ceil((size - info.height) / 2),
      left: Math.floor((size - info.width) / 2),
      right: Math.ceil((size - info.width) / 2),
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .png({ compressionLevel: 9 })
    .toFile(join(OUT, "brothers-standalone.png"));
  console.log(
    `brothers-standalone.png ${size} x ${size} (from ${info.width} x ${info.height})`,
  );
}

for (const [node, slug, width, height] of PHOTOS) {
  const info = await sharp(join(dir, "photos", `${node}.png`))
    .resize({
      width: width * SCALE,
      height: height * SCALE,
      fit: "cover",
      kernel: "lanczos3",
    })
    .webp({ quality: 84, effort: 6 })
    .toFile(join(OUT, `${slug}.webp`));
  console.log(`${slug}.webp ${info.width} x ${info.height}`);
}
console.log("logos, monograms, wordmarks and standalones written");
