// Builds the landing NeighborNet switcher's assets in
// design-assets/figma/landing-2026/neighbornets/:
//
// - edge-mask-top.svg / edge-mask-bottom.svg: the section's content mask at
//   its layered edges, the front (Obsidian) edge at rest: the hero wave's
//   pale blob (HeroWave) in the pair's 246-unit frame, white below its edge;
//   the bottom one turned 180deg. The content (the tile's shapes) never shows
//   past the section's edge;
// - houston.jpg: Houston's photo, framed from its full-resolution original
//   (see HOUSTON below), at twice the tile's size (968 x 1095);
// - {stamford,suwanee,tampa,brooklyn}.jpg: each NeighborNet's photo cropped
//   to the tile (Figma 255:102's siblings, 484 x 547.6) as the Figma frame
//   frames it, at twice that size. The sources are the tiles' image fills,
//   downloaded from Figma; pass the folder holding them (stamford.png,
//   suwanee.png, tampa.png, brooklyn.png) to rebuild these.
//
//   node scripts/neighbornets-assets.mjs [figma-photo-folder]
import { readFileSync, writeFileSync } from "node:fs";
import { createRequire } from "node:module";

const sharp = createRequire(import.meta.url)("sharp");
const DIR = "design-assets/figma/landing-2026/neighbornets";
const TILE = { width: 484, height: 547.6 };
const OUT = { width: 968, height: 1095 };

/*
 * Houston's photo comes from the full-resolution original in the repo (the
 * Figma fill, 1024 x 684, is a small, brightened crop of it, which the tile
 * showed only 605px of, upscaled). Framed in the original (4096 x 2733): the
 * group's front centred on the blue YM flag, both red flags at the sides,
 * faces about 30% down (clear of the city name, as on the other tiles);
 * 1500px wide, so it is downscaled. Each channel gets the gain that matches
 * the Figma fill's exposure (its means over the same part of the room).
 */
const HOUSTON = {
  source:
    "design-assets/figma/landing-2026/new-sections/255-102-source-01.jpeg",
  region: { left: 1550, top: 881, width: 1500, height: 1697 },
  gain: [1.607, 1.551, 1.677],
};

await sharp(HOUSTON.source)
  .extract(HOUSTON.region)
  .linear(HOUSTON.gain, [0, 0, 0])
  .resize(OUT)
  .jpeg({ quality: 80, mozjpeg: true })
  .toFile(`${DIR}/houston.jpg`);
console.log("houston.jpg from the 4096 x 2733 original");

/*
 * The other tiles' image boxes, as % of the tile (width, height, left, top),
 * from the Figma frame; `cover` crops to fill the tile instead, anchored at
 * `y` (0 top, 1 bottom).
 */
const CROPS = {
  stamford: { w: 175.48, h: 116.32, l: -37.74, t: -16.25 },
  suwanee: { w: 143.26, h: 122.16, l: -35.34, t: -9.68 },
  tampa: { cover: true, y: 0.5 },
  brooklyn: { w: 252.86, h: 149.01, l: -67.34, t: -28.85 },
};

const hero = readFileSync("src/components/site/hero-wave.tsx", "utf8");
const blob = hero.match(/HERO_BLOB =\s*"([^"]+)"/)[1];
const rotation = hero.match(/ROTATION = "([^"]+)"/)[1];
const pale = `matrix(${rotation} -377.2776 -1322.5624)`;
for (const [edge, turn] of [
  ["top", ""],
  ["bottom", ' transform="rotate(180 720 1107)"'],
]) {
  writeFileSync(
    `${DIR}/edge-mask-${edge}.svg`,
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 984 1440 246" preserveAspectRatio="none"><defs><mask id="m" maskUnits="userSpaceOnUse" x="0" y="984" width="1440" height="246"><rect x="0" y="984" width="1440" height="246" fill="#fff"/><path fill="#000" transform="${pale}" d="${blob}"/></mask></defs><g${turn}><rect x="0" y="984" width="1440" height="246" fill="#fff" mask="url(#m)"/></g></svg>\n`,
  );
  console.log(`edge-mask-${edge}.svg`);
}

const folder = process.argv[2];
if (!folder) process.exit(0);

for (const [slug, crop] of Object.entries(CROPS)) {
  const file = `${folder}/${slug}.png`;
  const { width, height } = await sharp(file).metadata();
  let region;
  if (crop.cover) {
    const scale = Math.max(TILE.width / width, TILE.height / height);
    const cropWidth = Math.round(TILE.width / scale);
    const cropHeight = Math.round(TILE.height / scale);
    region = {
      left: Math.round((width - cropWidth) / 2),
      top: Math.round((height - cropHeight) * crop.y),
      width: cropWidth,
      height: cropHeight,
    };
  } else {
    // Source pixels per tile unit.
    const scale = width / ((crop.w / 100) * TILE.width);
    region = {
      left: Math.round((-crop.l / 100) * TILE.width * scale),
      top: Math.round((-crop.t / 100) * TILE.height * scale),
      width: Math.round(TILE.width * scale),
      height: Math.round(TILE.height * scale),
    };
    region.width = Math.min(region.width, width - region.left);
    region.height = Math.min(region.height, height - region.top);
  }
  await sharp(file)
    .extract(region)
    .resize(OUT)
    .jpeg({ quality: 80, mozjpeg: true })
    .toFile(`${DIR}/${slug}.jpg`);
  console.log(
    `${slug}.jpg from ${region.width} x ${region.height} at ${region.left}, ${region.top}`,
  );
}
