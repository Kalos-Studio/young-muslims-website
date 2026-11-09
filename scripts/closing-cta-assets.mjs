// Builds the closing CTA's assets in design-assets/figma/landing-2026/cta/:
//
// - shape-{desktop,tablet,mobile}.svg: the organic photo shape's silhouette
//   in each Figma frame, as a vector path (crisp at any width) (270:301 desktop 1440 x 723, 280:788 tablet and
//   297:1442 mobile, 768 / 360 x 894), the CSS mask for the photo. Figma
//   exports the shape (273:609, 280:790, 297:1444) flattened onto white,
//   clipped to its frame; outside the shape is the white connected to the
//   frame's edges, so it is flood-filled from the border (bright pixels
//   inside the photo stay in). Its top edge is traced to sub-pixel precision
//   and drawn as a smooth curve; below it the shape runs to the frame's foot;
// - foot-{desktop,tablet,mobile}.svg: the shape's wavy foot, traced the same
//   way: everything below it, running FOOT_OVERDRAW past the frame's foot,
//   drawn as an Obsidian cap over the photo (it drifts with the scroll);
// - ymatx-railing.jpg: the landing page's CTA photo (the YMATX brothers on
//   the railing), the Figma fill's original, at 2560 wide.
//
// Pass the folder holding the Figma downloads (export.png, export-tablet.png,
// export-mobile.png and the photo, raw1.jpg).
//
//   node scripts/closing-cta-assets.mjs <figma-folder>
import { writeFileSync } from "node:fs";
import { createRequire } from "node:module";

const sharp = createRequire(import.meta.url)("sharp");
const DIR = "design-assets/figma/landing-2026/cta";
/* How far the foot cap runs past the frame's foot, in frame units (px). */
const FOOT_OVERDRAW = 120;

const SHAPES = [
  { name: "desktop", file: "export.png", frame: { width: 1440, height: 723 } },
  {
    name: "tablet",
    file: "export-tablet.png",
    frame: { width: 768, height: 894 },
  },
  {
    name: "mobile",
    file: "export-mobile.png",
    frame: { width: 360, height: 894 },
  },
];

const folder = process.argv[2];
if (!folder) {
  console.error("Pass the folder holding the Figma downloads.");
  process.exit(1);
}

for (const shape of SHAPES) {
  const { data, info } = await sharp(`${folder}/${shape.file}`)
    .removeAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const { width: W, height: H, channels } = info;
  const white = (i) =>
    data[i * channels] > 236 &&
    data[i * channels + 1] > 236 &&
    data[i * channels + 2] > 236;
  // Flood-fill the white connected to the border: that is outside.
  const outside = new Uint8Array(W * H);
  const stack = [];
  const push = (x, y) => {
    if (x < 0 || y < 0 || x >= W || y >= H) return;
    const i = y * W + x;
    if (outside[i] || !white(i)) return;
    outside[i] = 1;
    stack.push(i);
  };
  for (let x = 0; x < W; x++) {
    push(x, 0);
    push(x, H - 1);
  }
  for (let y = 0; y < H; y++) {
    push(0, y);
    push(W - 1, y);
  }
  while (stack.length) {
    const i = stack.pop();
    const x = i % W;
    const y = (i - x) / W;
    push(x + 1, y);
    push(x - 1, y);
    push(x, y + 1);
    push(x, y - 1);
  }
  // Alpha in the frame: the export sits at the frame's top.
  const { width: FW, height: FH } = shape.frame;
  const alpha = Buffer.alloc(FW * FH);
  for (let y = 0; y < Math.min(H, FH); y++)
    for (let x = 0; x < FW; x++)
      alpha[y * FW + x] = outside[y * W + Math.min(x, W - 1)] ? 0 : 255;
  // Trace the edges to sub-pixel precision from a softened alpha: each
  // column's top edge (where the shape starts) and bottom edge (where it
  // ends), interpolated at the 50% crossing.
  const smooth = await sharp(alpha, {
    raw: { width: FW, height: FH, channels: 1 },
  })
    .blur(1.5)
    .extractChannel(0)
    .raw()
    .toBuffer();
  const at = (x, y) => smooth[y * FW + x];
  const edge = (x, fromTop) => {
    const step = fromTop ? 1 : -1;
    let y = fromTop ? 0 : FH - 1;
    if (at(x, y) >= 128) return fromTop ? 0 : FH;
    while (y >= 0 && y < FH && at(x, y) < 128) y += step;
    const prev = y - step;
    const a0 = at(x, prev);
    const a1 = at(x, y);
    return prev + (step * (128 - a0)) / (a1 - a0) + (fromTop ? 0 : 1);
  };
  // Sample every few pixels and smooth the samples a little more.
  const STEP = Math.max(4, Math.round(FW / 120));
  const xs = [];
  for (let x = 0; x < FW; x += STEP) xs.push(x);
  if (xs.at(-1) !== FW - 1) xs.push(FW - 1);
  const settle = (ys) =>
    ys.map((y, i) => {
      const n = ys.slice(Math.max(0, i - 2), i + 3);
      return n.reduce((sum, v) => sum + v, 0) / n.length;
    });
  const top = settle(xs.map((x) => edge(x, true)));
  const bottom = settle(xs.map((x) => edge(x, false)));
  // A smooth curve through the points (Catmull-Rom as cubic Béziers).
  const curve = (points) =>
    points
      .slice(1)
      .map((p, i) => {
        const p0 = points[Math.max(0, i - 1)];
        const p1 = points[i];
        const p3 = points[Math.min(points.length - 1, i + 2)];
        const c1 = [p1[0] + (p[0] - p0[0]) / 6, p1[1] + (p[1] - p0[1]) / 6];
        const c2 = [p[0] - (p3[0] - p1[0]) / 6, p[1] - (p3[1] - p1[1]) / 6];
        return `C${c1.map(round).join(" ")} ${c2.map(round).join(" ")} ${p.map(round).join(" ")}`;
      })
      .join("");
  const round = (v) => Math.round(v * 10) / 10;
  const topPoints = xs.map((x, i) => [x === FW - 1 ? FW : x, top[i]]);
  // The shape: the wavy top, then straight down to the frame's foot (the
  // wavy foot is drawn by its own cap, which the parallax moves).
  const d = `M0 ${round(top[0])}` + curve(topPoints) + `L${FW} ${FH}L0 ${FH}Z`;
  writeFileSync(
    `${DIR}/shape-${shape.name}.svg`,
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${FW} ${FH}" preserveAspectRatio="none"><path fill="#fff" d="${d}"/></svg>\n`,
  );
  // The foot cap: everything below the wavy foot, run FOOT_OVERDRAW past
  // the frame's foot so the drifting cap's lower edge never shows.
  const foot =
    `M0 ${round(bottom[0])}` +
    curve(xs.map((x, i) => [x === FW - 1 ? FW : x, bottom[i]])) +
    `L${FW} ${FH + FOOT_OVERDRAW}L0 ${FH + FOOT_OVERDRAW}Z`;
  writeFileSync(
    `${DIR}/foot-${shape.name}.svg`,
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${FW} ${FH + FOOT_OVERDRAW}" preserveAspectRatio="none"><path fill="#fff" d="${foot}"/></svg>\n`,
  );
  console.log(`shape-${shape.name}.svg (${FW} x ${FH}, from ${W} x ${H})`);
}

await sharp(`${folder}/raw1.jpg`)
  .resize({ width: 2560 })
  .jpeg({ quality: 78, mozjpeg: true })
  .toFile(`${DIR}/ymatx-railing.jpg`);
console.log("ymatx-railing.jpg");
