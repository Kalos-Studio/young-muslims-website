// Builds the landing stories snippet's derived assets in
// design-assets/figma/landing-2026/stories/:
//
// - mask-*.png: each headshot's own silhouette (its alpha, in white, about
//   300px wide), the CSS mask for its coloured hover pop, so the pop echoes
//   that headshot's exact outline without loading the portrait twice;
// - edge-photo.svg / edge-band.svg: masks for the story view's wavy edges,
//   from the site's hero blob edge (Figma 27:253, as in HeroWave and the
//   everywhere section's top edge): the photo shows above the edge; the
//   lighter band (mirrored, for variety) shows below it;
// - photo-rahmah-k.jpg: Rahmah's photo (design-assets/figma/stories/
//   rahmah-photo.jpeg, a tall portrait) cropped as in the Figma story view:
//   the two sisters among the flowers, the sign out of frame, at a 1.6:1
//   ratio so the narrower mobile band still holds both;
// - photo-mustafa-r.jpg: Mustafa's photo cropped to the Figma story view's
//   framing, the front row of the group;
// - photo-{maryam-t,layla-h,bilal-s,yusuf-a}.jpg: their story-view photos,
//   cropped to the Figma frames (575:506, 575:523, 575:540, 575:571; each a
//   1440 x 1228 frame whose top the photo band shows). Their sources are the
//   frames' image fills, downloaded from Figma; pass the folder holding them
//   (maryam.png, layla.png, bilal.png, yusuf.png) to rebuild these.
//
//   Desktop gets its own, wider crop of each (photo-*-desktop.jpg): the
//   band there is wide and short, so each is cropped at the band's 2.4:1
//   with the face 30% down (shown at object-position 50% 30%), clear of the
//   wavy edge at any desktop band height;
// - edge-pair-photo.svg / edge-pair-band.svg: the desktop story view's
//   layered edges, the hero wave's own pair (HeroWave: the photo blob and the
//   same blob, bigger and offset below it) in one 246-unit frame: the photo
//   shows above the smaller copy's edge, the lighter band below the bigger
//   copy's edge, the colour between.
//
//   node scripts/stories-assets.mjs [figma-photo-folder]
import { readFileSync, writeFileSync } from "node:fs";
import { createRequire } from "node:module";

const sharp = createRequire(import.meta.url)("sharp");
const DIR = "design-assets/figma/landing-2026/stories";
const SLUGS = [
  "rahmah-k",
  "mustafa-r",
  "maryam-t",
  "layla-h",
  "bilal-s",
  "yusuf-a",
];

for (const slug of SLUGS) {
  const source = sharp(`${DIR}/headshot-${slug}.png`).resize({ width: 300 });
  const alpha = await source.clone().extractChannel("alpha").toBuffer();
  const { width, height } = await sharp(alpha).metadata();
  await sharp({
    create: { width, height, channels: 3, background: "#fff" },
  })
    .joinChannel(alpha)
    .png({ palette: true, colours: 16 })
    .toFile(`${DIR}/mask-${slug}.png`);
  console.log(`mask-${slug}.png ${width} x ${height}`);
}

// The hero blob and its photo-blob placement (src/components/site/
// hero-wave.tsx); its edge spans y 986-1083 of the hero band across 1440.
const hero = readFileSync("src/components/site/hero-wave.tsx", "utf8");
const blob = hero.match(/HERO_BLOB =\s*"([^"]+)"/)[1];
const rotation = hero.match(/ROTATION = "([^"]+)"/)[1];
const placement = `matrix(${rotation} -122.2947 -985.8739) scale(0.811688)`;
const palePlacement = `matrix(${rotation} -377.2776 -1322.5624)`;
const box = 'viewBox="0 984 1440 101" preserveAspectRatio="none"';
writeFileSync(
  `${DIR}/edge-photo.svg`,
  `<svg xmlns="http://www.w3.org/2000/svg" ${box}><path fill="#fff" transform="${placement}" d="${blob}"/></svg>\n`,
);
writeFileSync(
  `${DIR}/edge-band.svg`,
  `<svg xmlns="http://www.w3.org/2000/svg" ${box}><defs><mask id="m" maskUnits="userSpaceOnUse" x="0" y="984" width="1440" height="101"><rect x="0" y="984" width="1440" height="101" fill="#fff"/><path fill="#000" transform="translate(1440 0) scale(-1 1) ${placement}" d="${blob}"/></mask></defs><rect x="0" y="984" width="1440" height="101" fill="#fff" mask="url(#m)"/></svg>\n`,
);
console.log("edge-photo.svg, edge-band.svg");

const pairBox = 'viewBox="0 984 1440 246" preserveAspectRatio="none"';
writeFileSync(
  `${DIR}/edge-pair-photo.svg`,
  `<svg xmlns="http://www.w3.org/2000/svg" ${pairBox}><path fill="#fff" transform="${placement}" d="${blob}"/></svg>\n`,
);
writeFileSync(
  `${DIR}/edge-pair-band.svg`,
  `<svg xmlns="http://www.w3.org/2000/svg" ${pairBox}><defs><mask id="m" maskUnits="userSpaceOnUse" x="0" y="984" width="1440" height="246"><rect x="0" y="984" width="1440" height="246" fill="#fff"/><path fill="#000" transform="${palePlacement}" d="${blob}"/></mask></defs><rect x="0" y="984" width="1440" height="246" fill="#fff" mask="url(#m)"/></svg>\n`,
);
console.log("edge-pair-photo.svg, edge-pair-band.svg");

await sharp("design-assets/figma/stories/rahmah-photo.jpeg")
  .extract({ left: 0, top: 1416, width: 2731, height: 1700 })
  .resize({ width: 1920 })
  .jpeg({ quality: 80, mozjpeg: true })
  .toFile(`${DIR}/photo-rahmah-k.jpg`);
console.log("photo-rahmah-k.jpg");

// Mustafa's photo (design-assets/figma/stories/mustafa-photo.jpeg), cropped
// as in the Figma story view (249:18): the front row of the group, their
// heads at the top of the band, the night sky out of frame.
await sharp("design-assets/figma/stories/mustafa-photo.jpeg")
  .extract({ left: 0, top: 480, width: 1600, height: 720 })
  .jpeg({ quality: 82, mozjpeg: true })
  .toFile(`${DIR}/photo-mustafa-r.jpg`);
console.log("photo-mustafa-r.jpg");

/*
 * Each Figma frame's image box, as % of the 1440 x 1228 frame (width,
 * height, left, top).
 */
const FRAMES = {
  "maryam-t": {
    file: "maryam.png",
    w: 244.56,
    h: 191.21,
    l: -36.19,
    t: -71.34,
  },
  "layla-h": { file: "layla.png", w: 251.06, h: 196.29, l: -125.54, t: -96.33 },
  "bilal-s": { file: "bilal.png", w: 158.9, h: 124.24, l: -9.21, t: -24.2 },
  "yusuf-a": { file: "yusuf.png", w: 149.04, h: 116.53, l: -15.26, t: -14.52 },
};
/*
 * Each desktop crop in the source (4096 x 2731): the face's centre (x, y, as
 * shares of the source) and the crop's width (a share of the source width);
 * the crop is 2.4:1 with the face 30% down.
 */
const DESKTOP = {
  "maryam-t": { x: 0.45, y: 0.45, width: 0.74 },
  "layla-h": { x: 0.7, y: 0.58, width: 0.55 },
  "bilal-s": { x: 0.47, y: 0.32, width: 0.7 },
  "yusuf-a": { x: 0.45, y: 0.3, width: 0.9 },
};
const sourceFolder = process.argv[2];
if (sourceFolder) {
  for (const [slug, frame] of Object.entries(FRAMES)) {
    const file = `${sourceFolder}/${frame.file}`;
    const { width, height } = await sharp(file).metadata();
    const scale = width / ((frame.w / 100) * 1440);
    const left = Math.round((-frame.l / 100) * 1440 * scale);
    const top = Math.round((-frame.t / 100) * 1228 * scale);
    const cropWidth = Math.min(Math.round(1440 * scale), width - left);
    const cropHeight = Math.min(Math.round(1228 * scale), height - top);
    await sharp(file)
      .extract({ left, top, width: cropWidth, height: cropHeight })
      .resize({ width: Math.min(1920, cropWidth) })
      .jpeg({ quality: 80, mozjpeg: true })
      .toFile(`${DIR}/photo-${slug}.jpg`);
    console.log(`photo-${slug}.jpg from ${cropWidth} x ${cropHeight}`);

    const crop = DESKTOP[slug];
    const deskWidth = Math.round(crop.width * width);
    const deskHeight = Math.round(deskWidth / 2.4);
    const deskLeft = Math.max(
      0,
      Math.min(width - deskWidth, Math.round(crop.x * width - deskWidth / 2)),
    );
    const deskTop = Math.max(
      0,
      Math.min(
        height - deskHeight,
        Math.round(crop.y * height - 0.3 * deskHeight),
      ),
    );
    await sharp(file)
      .extract({
        left: deskLeft,
        top: deskTop,
        width: deskWidth,
        height: deskHeight,
      })
      .resize({ width: Math.min(2400, deskWidth) })
      .jpeg({ quality: 80, mozjpeg: true })
      .toFile(`${DIR}/photo-${slug}-desktop.jpg`);
    console.log(
      `photo-${slug}-desktop.jpg from ${deskWidth} x ${deskHeight} at ${deskLeft}, ${deskTop}`,
    );
  }
}
