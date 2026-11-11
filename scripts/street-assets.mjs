// Builds the landing "Word on the street" cards' assets in
// design-assets/figma/landing-2026/street/:
//
// - photo-{slug}.jpg: each card's photo, cropped to its image box (Figma
//   270:449, 270:488, 270:503: 378 wide, 373 / 381 / 375 tall) exactly as
//   the Figma frame places it, at twice that size. It is the hover's square
//   and, masked, the resting blob, so the two always line up;
// - mask-{slug}.png: each card's blob silhouette (the alpha of the Figma
//   vector's export, in white), the CSS mask for the resting blob.
//
// Pass the folder holding the Figma downloads: the photos (the vectors' raw
// image fills: heart.png, gavel.jpg, moon.jpg) and the vectors' exports
// (blob-mental.png, blob-judgement.png, blob-ramadan.png).
//
//   node scripts/street-assets.mjs <figma-folder>
import { mkdirSync } from "node:fs";
import { createRequire } from "node:module";

const sharp = createRequire(import.meta.url)("sharp");
const DIR = "design-assets/figma/landing-2026/street";

/*
 * Each image box (Figma px) and the photo's place in it, as % of the box
 * (width, height, left, top). The mental-health photo's comes from the Figma
 * hover frame (270:565; Figma stretches it slightly); the other two were
 * recovered by matching the photo to the vector's export.
 */
const CARDS = {
  "mental-health": {
    photo: "heart.png",
    blob: "blob-mental.png",
    box: { width: 378, height: 373 },
    place: { w: 154.42, h: 118.36, l: -15.42, t: -1.41 },
  },
  "judgement-stigma": {
    photo: "gavel.jpg",
    blob: "blob-judgement.png",
    box: { width: 378, height: 381 },
    place: { w: 201.59, h: 102.36, l: -71.43, t: -2.36 },
  },
  "ramadan-guide": {
    photo: "moon.jpg",
    blob: "blob-ramadan.png",
    box: { width: 378, height: 375 },
    place: { w: 159.52, h: 100.8, l: -29.37, t: -0.8 },
  },
};

const folder = process.argv[2];
if (!folder) {
  console.error("Pass the folder holding the Figma downloads.");
  process.exit(1);
}
mkdirSync(DIR, { recursive: true });

for (const [slug, card] of Object.entries(CARDS)) {
  const out = { width: card.box.width * 2, height: card.box.height * 2 };
  const { w, h, l, t } = card.place;
  // The photo resized to its box-relative size, then the box cut from it.
  const size = {
    width: Math.round((w / 100) * out.width),
    height: Math.round((h / 100) * out.height),
  };
  await sharp(`${folder}/${card.photo}`)
    .resize({ ...size, fit: "fill" })
    .extract({
      left: Math.round((-l / 100) * out.width),
      top: Math.round((-t / 100) * out.height),
      ...out,
    })
    .jpeg({ quality: 82, mozjpeg: true })
    .toFile(`${DIR}/photo-${slug}.jpg`);

  const alpha = await sharp(`${folder}/${card.blob}`)
    .resize({ ...out, fit: "fill" })
    .extractChannel("alpha")
    .toBuffer();
  await sharp({ create: { ...out, channels: 3, background: "#fff" } })
    .joinChannel(alpha)
    .png({ palette: true, colours: 16 })
    .toFile(`${DIR}/mask-${slug}.png`);
  console.log(
    `photo-${slug}.jpg, mask-${slug}.png (${out.width} x ${out.height})`,
  );
}
