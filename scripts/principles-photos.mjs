// Pre-crops the four principle photos (masters in
// design-assets/figma/landing-2026/new-sections/) to their Figma frame crops:
// desktop 1440 x 1024 (208:3, also used on tablet) and mobile 360 x 808
// (295:1194). Usage: node scripts/principles-photos.mjs design-assets/figma/landing-2026/principles
import { createRequire } from "node:module";
const sharp = createRequire(import.meta.url)("sharp");
const [outDir] = process.argv.slice(2);
const N = "design-assets/figma/landing-2026/new-sections";
const photos = [
  {
    name: "tarbiyyah",
    src: `${N}/208-3-source-01.jpeg`,
    desktop: "cover",
    mobile: { w: 336.75, h: 100, l: -132.28, t: 0 },
  },
  {
    name: "diversity",
    src: `${N}/208-3-source-03.jpeg`,
    desktop: { w: 109.78, h: 102.93, l: -4.89, t: -2.93 },
    mobile: { w: 336.63, h: 100, l: -142.69, t: 0 },
  },
  {
    name: "sustainability",
    src: `${N}/208-3-source-09.jpeg`,
    desktop: { w: 136.86, h: 128.32, l: -18.43, t: -26.95 },
    mobile: { w: 336.63, h: 100, l: -79.63, t: 0 },
  },
  {
    name: "impact",
    src: `${N}/208-3-source-04.jpeg`,
    desktop: { w: 128.05, h: 120.06, l: -12.08, t: -20.09 },
    mobile: { w: 512.19, h: 152.15, l: -164.89, t: -25.46 },
  },
];
const frames = { desktop: [1440, 1024, 2560], mobile: [360, 808, 1080] };
for (const p of photos) {
  const { width, height } = await sharp(p.src).metadata();
  for (const [kind, [fw, fh, maxW]] of Object.entries(frames)) {
    let crop = p[kind];
    if (crop === "cover") {
      const scale = Math.max(fw / width, fh / height);
      const dw = width * scale,
        dh = height * scale;
      crop = {
        w: (dw / fw) * 100,
        h: (dh / fh) * 100,
        l: (-(dw - fw) / 2 / fw) * 100,
        t: (-(dh - fh) / 2 / fh) * 100,
      };
    }
    const s = width / ((crop.w / 100) * fw);
    const left = Math.max(0, Math.round((-crop.l / 100) * fw * s));
    const top = Math.max(0, Math.round((-crop.t / 100) * fh * s));
    const cw = Math.min(Math.round(fw * s), width - left);
    const ch = Math.min(Math.round(fh * s), height - top);
    const outW = Math.min(maxW, cw);
    const outH = Math.round((outW * fh) / fw);
    await sharp(p.src)
      .extract({ left, top, width: cw, height: ch })
      .resize(outW, outH, { fit: "cover" })
      .jpeg({ quality: 80, mozjpeg: true })
      .toFile(`${outDir}/${p.name}-${kind}.jpg`);
    console.log(`${p.name}-${kind}.jpg`, {
      left,
      top,
      cw,
      ch,
      out: `${outW}x${outH}`,
    });
  }
}
