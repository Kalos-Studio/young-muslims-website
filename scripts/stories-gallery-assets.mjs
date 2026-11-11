// Builds the Stories gallery faces in design-assets/figma/stories/gallery/:
// the 23 portrait blobs of Figma 401:3786, each its photo cropped as Figma
// crops it and cut to its blob, at 3x the field's full face size so the
// face under the focus stays sharp on 3x screens; and each blob's
// silhouette alone (`<name>-mask.png`, white on transparent, at 2x the
// hover pop's size), the hover pop's mask.
//
// faces.json holds what Figma knows of each face (read from the file): its
// node, its place and size in the frame, its image fill's hash, the fill's
// crop (`imageTransform`, a node-unit to image-unit affine, as Figma's CROP
// mode stores it) and its blob path in node pixels. The originals are the
// image fills themselves, named by their hash (Figma names an image by the
// SHA-1 of its bytes):
//
//   node scripts/stories-gallery-assets.mjs <folder of <hash>.jpg>
//
// Each face keeps its Figma proportions and is scaled so its longer side is
// FULL_SIZE (the field's `--stories-gallery-face`, 11rem: the centre
// column's faces in Figma, 170 to 177) times SCALE.
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { join } from "node:path";

const sharp = createRequire(import.meta.url)("sharp");
const DIR = "design-assets/figma/stories/gallery";
const FULL_SIZE = 176;
const SCALE = 3;
// The pop is `--stories-pop-size` (135%) of the face: its mask at 2x that.
const MASK_SIZE = Math.round(FULL_SIZE * 1.35 * 2);

const sources = process.argv[2];
if (!sources) {
  console.error("Pass the folder of Figma image fills (<hash>.jpg).");
  process.exit(1);
}

const faces = JSON.parse(readFileSync(join(DIR, "faces.json"), "utf8"));

for (const face of faces) {
  const source = sharp(join(sources, `${face.image}.jpg`));
  const { width: W, height: H } = await source.metadata();
  const [[a, b, tx], [c, d, ty]] = face.imageTransform;

  // The node's unit square in image pixels: its bounding box, and which way
  // it is turned (one face's fill is rotated a quarter turn).
  const corners = [
    [0, 0],
    [1, 0],
    [0, 1],
    [1, 1],
  ].map(([u, v]) => [(a * u + b * v + tx) * W, (c * u + d * v + ty) * H]);
  const xs = corners.map(([x]) => x);
  const ys = corners.map(([, y]) => y);
  const left = Math.round(Math.min(...xs));
  const top = Math.round(Math.min(...ys));
  const right = Math.round(Math.max(...xs));
  const bottom = Math.round(Math.max(...ys));
  // A crop may run a pixel past the photo: extend its edge into the gap.
  const region = sharp(join(sources, `${face.image}.jpg`)).extend({
    top: Math.max(0, -top),
    left: Math.max(0, -left),
    bottom: Math.max(0, bottom - H),
    right: Math.max(0, right - W),
    extendWith: "copy",
  });
  const extracted = await region
    .extract({
      left: Math.max(0, left),
      top: Math.max(0, top),
      width: right - left,
      height: bottom - top,
    })
    .toBuffer();
  // u runs along the image's x (no turn) or down its y (b = 0, c > 0 with
  // the x axis reversed: the node's top-left is the region's top-right).
  const turned = a === 0 && b < 0 && c > 0 ? 270 : 0;
  const upright = await sharp(extracted).rotate(turned).toBuffer();

  const fit = (FULL_SIZE * SCALE) / Math.max(face.width, face.height);
  const width = Math.round(face.width * fit);
  const height = Math.round(face.height * fit);
  const photo = await sharp(upright)
    .resize(width, height, { fit: "fill", kernel: "lanczos3" })
    .toBuffer();
  const mask = Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${face.width} ${face.height}"><path d="${face.path}" fill="#fff"/></svg>`,
  );
  await sharp(photo)
    .ensureAlpha()
    .composite([{ input: mask, blend: "dest-in" }])
    .png({ compressionLevel: 9, palette: false })
    .toFile(join(DIR, `${face.name}.png`));
  const maskFit = MASK_SIZE / Math.max(face.width, face.height);
  const maskWidth = Math.round(face.width * maskFit);
  const maskHeight = Math.round(face.height * maskFit);
  await sharp(
    Buffer.from(
      `<svg xmlns="http://www.w3.org/2000/svg" width="${maskWidth}" height="${maskHeight}" viewBox="0 0 ${face.width} ${face.height}"><path d="${face.path}" fill="#fff"/></svg>`,
    ),
  )
    .png({ compressionLevel: 9, palette: true, colours: 16 })
    .toFile(join(DIR, `${face.name}-mask.png`));
  console.log(
    `${face.name}: ${width} x ${height} from ${right - left} x ${bottom - top}`,
  );
}
