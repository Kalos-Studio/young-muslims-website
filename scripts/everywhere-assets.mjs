// Builds the landing "everywhere" section's assets from the Figma sources in
// design-assets/figma/landing-2026/everywhere/source/ (desktop frame 73:164):
//
// - shape-*.webp: each shape-photo as one image, its tinted rim and its
//   masked photo composited at their Figma offsets (the bottom-left pair
//   rotated 52.65deg, as in Figma), at 2x and trimmed to what is drawn;
// - map.jpg: the "Globe Map" frame (1440 x 795) at 2x: the map image clipped
//   to the 1440 globe circle with its 2px rim, on Warm Snow (markers and the
//   fade are drawn by the page);
// - src/app/landing/everywhere-markers.{module.css,ts}: the 85 markers'
//   positions in that frame, as percentages, ordered left to right (the
//   order of the drop-in cascade).
//
//   node scripts/everywhere-assets.mjs
import { readFileSync, writeFileSync } from "node:fs";
import { createRequire } from "node:module";

const sharp = createRequire(import.meta.url)("sharp");
const DIR = "design-assets/figma/landing-2026/everywhere";
const SRC = `${DIR}/source`;
const SCALE = 2;

/*
 * Shapes in section coordinates. `rim` and `photo` give each layer's box;
 * for the rotated pair the box is the layer's own (unrotated) size, placed
 * by its centre.
 */
const SHAPES = [
  {
    name: "top-left",
    rim: { x: 96.196, y: 118.616, w: 332.725, h: 300.769 },
    photo: { x: 129.319, y: 148.558, w: 266.478, h: 240.884 },
  },
  {
    name: "top-right",
    rim: { x: 993.261, y: 116.13, w: 347, h: 332 },
    photo: { x: 1038.261, y: 159.13, w: 258, h: 247 },
  },
  {
    name: "bottom-left",
    rotate: 52.65,
    rim: { cx: 232.958, cy: 1474.125, w: 304.065, h: 319.5 },
    photo: { cx: 238.25, cy: 1476.16, w: 233.826, h: 249.882 },
  },
  {
    name: "bottom-right",
    rim: { x: 1043, y: 1317, w: 311, h: 321 },
    photo: { x: 1083.84, y: 1360.05, w: 239, h: 245 },
  },
];

async function layer(file, box, rotate) {
  let image = file.endsWith(".svg")
    ? sharp(readFileSync(file), { density: 72 * SCALE })
    : sharp(file);
  image = image.resize(Math.round(box.w * SCALE), Math.round(box.h * SCALE));
  if (rotate) {
    const buffer = await image.png().toBuffer();
    image = sharp(buffer).rotate(rotate, {
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    });
  }
  const { data, info } = await image
    .png()
    .toBuffer({ resolveWithObject: true });
  // Top-left corner in section units.
  const x = rotate ? box.cx - info.width / SCALE / 2 : box.x;
  const y = rotate ? box.cy - info.height / SCALE / 2 : box.y;
  return { data, w: info.width, h: info.height, x, y };
}

for (const shape of SHAPES) {
  const rim = await layer(
    `${SRC}/rim-${shape.name}.svg`,
    shape.rim,
    shape.rotate,
  );
  const photo = await layer(
    `${SRC}/photo-${shape.name}.png`,
    shape.photo,
    shape.rotate,
  );
  const x0 = Math.min(rim.x, photo.x);
  const y0 = Math.min(rim.y, photo.y);
  const x1 = Math.max(rim.x + rim.w / SCALE, photo.x + photo.w / SCALE);
  const y1 = Math.max(rim.y + rim.h / SCALE, photo.y + photo.h / SCALE);
  const canvas = sharp({
    create: {
      width: Math.ceil((x1 - x0) * SCALE),
      height: Math.ceil((y1 - y0) * SCALE),
      channels: 4,
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    },
  }).composite(
    [rim, photo].map((part) => ({
      input: part.data,
      left: Math.round((part.x - x0) * SCALE),
      top: Math.round((part.y - y0) * SCALE),
    })),
  );
  // Trim to what is drawn, and report where that lands in the section.
  const flat = await canvas.png().toBuffer();
  const { info } = await sharp(flat)
    .trim({ threshold: 1 })
    .toBuffer({ resolveWithObject: true });
  const left = x0 + -(info.trimOffsetLeft ?? 0) / SCALE;
  const top = y0 + -(info.trimOffsetTop ?? 0) / SCALE;
  await sharp(flat)
    .trim({ threshold: 1 })
    .webp({ quality: 86, alphaQuality: 100 })
    .toFile(`${DIR}/shape-${shape.name}.webp`);
  console.log(
    `shape-${shape.name}.webp: x ${left.toFixed(1)}, y ${top.toFixed(1)}, ${(info.width / SCALE).toFixed(1)} x ${(info.height / SCALE).toFixed(1)}`,
  );
}

/* The map frame: 1440 x 795, the globe circle's top 36.85 down. */
const FRAME = { w: 1440, h: 795 };
const GLOBE = { top: 36.85, size: 1440, rim: 2 };
const MAP = { x: 158, y: GLOBE.top - 787.85, w: 1172, h: 1668 };
{
  const W = FRAME.w * SCALE;
  const H = FRAME.h * SCALE;
  const r = (GLOBE.size / 2) * SCALE;
  const cy = (GLOBE.top + GLOBE.size / 2) * SCALE;
  const map = await sharp(`${SRC}/map.png`)
    .resize(Math.round(MAP.w * SCALE), Math.round(MAP.h * SCALE))
    .toBuffer();
  // The map, as Figma places it, inside the frame.
  const placed = await sharp({
    create: {
      width: W,
      height: H,
      channels: 4,
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    },
  })
    .composite([
      {
        input: await sharp(map)
          .extract({
            left: 0,
            top: Math.round(-MAP.y * SCALE),
            width: Math.round(MAP.w * SCALE),
            height: H,
          })
          .toBuffer(),
        left: Math.round(MAP.x * SCALE),
        top: 0,
      },
      // Clipped to the globe.
      {
        input: Buffer.from(
          `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}"><circle cx="${W / 2}" cy="${cy}" r="${r}" fill="#fff"/></svg>`,
        ),
        blend: "dest-in",
      },
    ])
    .png()
    .toBuffer();
  const rimWidth = GLOBE.rim * SCALE;
  await sharp({
    create: {
      width: W,
      height: H,
      channels: 3,
      background: "#FCFAF8",
    },
  })
    .composite([
      { input: placed },
      {
        input: Buffer.from(
          `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}"><circle cx="${W / 2}" cy="${cy}" r="${r - rimWidth / 2}" fill="none" stroke="#DEDEDE" stroke-width="${rimWidth}"/></svg>`,
        ),
      },
    ])
    .jpeg({ quality: 84, mozjpeg: true })
    .toFile(`${DIR}/map.jpg`);
  console.log(`map.jpg: ${W} x ${H}`);
}

/*
 * The markers, from the Figma "Markers" group (at x 314, y 212 in the map
 * frame): each 24 x 24 marker's x, y and kind (r = Royal, brothers; j = Jade,
 * sisters). Each marker's art is a 32 x 32 box starting 4 to its left.
 */
const GROUP = { x: 314, y: 212 };
// prettier-ignore
const MARKERS = [
  [0,185,"r"],[355,302,"r"],[22,190,"r"],[66,280,"r"],[81,282,"r"],[370,306,"r"],[355,314,"r"],[363,345,"r"],
  [408,371,"r"],[415,365,"r"],[391,363,"r"],[405,353,"r"],[44,268,"r"],[66,266,"j"],[107,219,"j"],[88,220,"r"],
  [95,229,"r"],[384,306,"j"],[379,318,"j"],[377,338,"j"],[357,367,"j"],[391,380,"j"],[406,377,"j"],[501,355,"j"],
  [477,353,"j"],[492,360,"j"],[675,404,"j"],[633,333,"r"],[628,348,"r"],[624,375,"r"],[667,381,"r"],[669,411,"r"],
  [583,268,"r"],[595,272,"r"],[427,137,"j"],[420,49,"r"],[413,71,"r"],[494,123,"r"],[494,133,"r"],[539,157,"r"],
  [549,188,"r"],[567,198,"r"],[633,194,"r"],[667,188,"r"],[675,184,"r"],[701,166,"r"],[681,139,"r"],[691,117,"r"],
  [708,103,"r"],[646,119,"r"],[718,81,"r"],[726,91,"r"],[737,83,"r"],[711,129,"r"],[681,156,"r"],[705,137,"r"],
  [506,111,"r"],[432,71,"j"],[444,87,"j"],[511,125,"j"],[511,133,"j"],[547,149,"j"],[569,167,"j"],[583,196,"j"],
  [547,214,"j"],[520,244,"j"],[583,284,"j"],[602,284,"j"],[626,272,"j"],[643,342,"j"],[636,375,"j"],[589,145,"j"],
  [636,234,"j"],[713,115,"j"],[764,73,"j"],[742,71,"j"],[748,39,"j"],[705,131,"j"],[703,159,"j"],[530,214,"r"],
  [523,233,"r"],[372.18,260,"j"],[142,290,"j"],[44,0,"j"],[22,166,"j"],
];
const ordered = MARKERS.map(([x, y, kind]) => ({ x, y, kind })).sort(
  (a, b) => a.x - b.x || a.y - b.y,
);
const pct = (value, of) => `${((value / of) * 100).toFixed(4)}%`;
const css = [
  "/*",
  " * Generated by scripts/everywhere-assets.mjs from the Figma markers",
  " * (73:164): each marker's place in the 1440 x 795 map frame, as",
  " * percentages, numbered left to right. Regenerate rather than edit.",
  " */",
  "",
  ...ordered.map(
    (m, index) =>
      `.m${index} {\n  left: ${pct(GROUP.x + m.x - 4, FRAME.w)};\n  top: ${pct(GROUP.y + m.y, FRAME.h)};\n}\n`,
  ),
].join("\n");
writeFileSync("src/app/landing/everywhere-markers.module.css", css);
writeFileSync(
  "src/app/landing/everywhere-markers.ts",
  `/*
 * Generated by scripts/everywhere-assets.mjs: the map's ${ordered.length} markers, ordered
 * left to right (the drop-in cascade's order), with their position class
 * (everywhere-markers.module.css) and kind (royal: brothers, jade: sisters).
 * Regenerate rather than edit.
 */
import positions from "./everywhere-markers.module.css";

export const MARKERS = [
${ordered.map((m, index) => `  { position: positions.m${index}, kind: "${m.kind === "r" ? "royal" : "jade"}" },`).join("\n")}
] as const;
`,
);
console.log(`markers: ${ordered.length}`);
