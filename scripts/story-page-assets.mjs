// Builds the story pages' assets in design-assets/figma/stories/story-page/
// (Figma 413:69 desktop, 414:1264 tablet, 414:1418 mobile; DESIGN-SYSTEM.md,
// "Story pages"):
//
// - band-{desktop,tablet,mobile}-{0,1,2,3}.svg: the hero's photo band, the
//   CSS mask of the person's full-bleed photo: the band runs edge to edge,
//   between a top and a foot edge, organic shapes parting to show the
//   person. Shape 0 is Figma's (Rahmah's): the frame less two copies of one
//   Warm Snow blob (band-blob.svg, 2904 x 1867.1) turned 5.17deg about their
//   group's centre. The others take their edges from the site's own shapes:
//   1 the landing hero's wave (above, mirrored and turned over; below, as
//   it is), 2 the closing CTA's photo window (its top edge and its wavy
//   foot, each frame's own), 3 the Stories hero's wave above (mirrored,
//   turned over) and the NeighborNets hero's below. Each edge is placed as
//   high (the top) and as low (the foot) as it can go while the top clears
//   the back button and the headline, and the foot the attribution, in
//   every frame (CLEAR); toward each side (SIDE_EASE) the edges ease out to the
//   band's full height, so the sides are straight and flush. Each edge is
//   traced from its source at a fraction of a unit and written as a smooth
//   vector curve (cubic Béziers), with preserveAspectRatio="none" so it
//   stretches to any width without letterboxing.
// - photos/<slug>-{desktop,tablet,mobile}.jpg: each person's photo cropped
//   to each frame's hero box. Rahmah's is Figma's exact crop (the photo's
//   box in each frame); the others are framed on their subject's head
//   (SUBJECT, FRAMING): sized for the frame within a sharpness floor, left
//   of the quote on desktop and tablet and above it on mobile, clear of the
//   band's edges, then sharpened (SOFT). Each crop is the hero's height plus the photo's
//   parallax drift (`--story-hero-drift`), half above and half below, the
//   size of the drifting layer, so the drift never shows an edge.
// - cta-brothers-lift.jpg: the CTA's photo (413:129's fill), its top 68%
//   (Figma's framing: the lifted brother to the crowd's faces), 2560 wide.
//
// It also prints the frame geometry the CSS tokens hold (the quote mark,
// pull-quote and attribution boxes, and the shade's stops).
//
// Pass the folder of sources: <slug>.{png,jpg} for each person (the Figma
// fills: Rahmah's 413:265, Mustafa's, Maryam's, Layla's, Bilal's and Yusuf's
// story photos, and each placeholder's gallery face fill, named
// community-<face>.jpg) and cta.jpg.
//
//   node scripts/story-page-assets.mjs <sources-folder>
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { createRequire } from "node:module";
import { join } from "node:path";

const sharp = createRequire(import.meta.url)("sharp");
const DIR = "design-assets/figma/stories/story-page";
const sources = process.argv[2];
if (!sources) {
  console.error("Pass the folder of photo sources.");
  process.exit(1);
}
mkdirSync(join(DIR, "photos"), { recursive: true });

const BLOB = readFileSync(
  "design-assets/figma/stories/story-page/band-blob.svg",
  "utf8",
).match(/ d="([^"]+)"/)[1];
const GROUP = { width: 2904, height: 1867.103 };
const ANGLE = 5.17;
const cos = Math.cos((ANGLE * Math.PI) / 180);
const sin = Math.sin((ANGLE * Math.PI) / 180);
// The IMG frame inside the tilted group (the same in every frame).
const IMG = { x: 613.85, y: 924.15 };

/*
 * Each frame: its size; its group's centre (from the group's top-left
 * corner in the file, less that corner's offset from the centre once
 * turned); the two blobs' places in the group; and the photo's, the quote
 * mark's, the pull-quote's and the attribution's boxes in the IMG frame
 * (each turned box's bounds, and its own size upright), and the shade.
 */
const FRAMES = {
  desktop: {
    width: 1440,
    height: 981,
    corner: [-711.7342529296875, -1544],
    top: [-2.43, -26.89],
    bottom: [200.52, 2215.95],
    photo: { at: [0, 0], bounds: [1856.111, 2598.875], size: [1641, 2461] },
    mark: {
      at: [1015.59, 889.11],
      bounds: [216.997, 175.903],
      size: [203.568, 158.201],
    },
    quote: {
      at: [1100.67, 965.55],
      bounds: [531.582, 198.245],
      size: [520, 152],
    },
    name: {
      at: [1116.96, 1173.86],
      bounds: [241.186, 45.531],
      size: [240, 24],
    },
    // Black at 42% from 40.401% of the photo (from its right) to clear at
    // 55.255%.
    shade: { side: "right", from: 0.40401, to: 0.55255 },
    // Where the person sits in the box (Rahmah's faces in the frame).
    focus: [0.3, 0.57],
    out: 2400,
    drift: 128,
    // The top edge's highest point.
    floor: 260,
    // What the band must clear: x from, x to, and the foot of each (the top
    // edge runs below the button and the headline, the foot below the
    // attribution).
    clear: {
      above: [
        [80, 225, 232],
        [710, 1360, 316],
      ],
      below: [[746, 1341, 747]],
    },
  },
  tablet: {
    width: 768,
    height: 1024,
    corner: [-977.7342529296875, -1697],
    top: [14.24, 157.36],
    bottom: [216.47, 2392.23],
    photo: {
      at: [333.85, 594.07],
      bounds: [1153.735, 1615.698],
      size: [1020, 1530],
    },
    mark: {
      at: [956, 1134.64],
      bounds: [155.631, 126.159],
      size: [146, 113.463],
    },
    quote: {
      at: [1002.6, 1191.95],
      bounds: [306.435, 122.556],
      size: [299, 96],
    },
    name: {
      at: [1014.14, 1329.07],
      bounds: [192.931, 36.226],
      size: [192, 19],
    },
    shade: { side: "right", from: 0.42598, to: 0.57696 },
    focus: [0.27, 0.54],
    out: 1536,
    drift: 112,
    floor: 300,
    clear: {
      above: [[64, 584, 367]],
      below: [[399, 738, 730]],
    },
  },
  mobile: {
    width: 360,
    height: 958,
    corner: [-1181.7342529296875, -1884],
    top: [25.86, 285.83],
    bottom: [233.23, 2577.47],
    photo: {
      at: [639.51, 813.62],
      bounds: [823.45, 1153.165],
      size: [728, 1092],
    },
    mark: {
      at: [797.07, 1453.26],
      bounds: [155.631, 126.159],
      size: [146, 113.463],
    },
    quote: {
      at: [827.73, 1512.28],
      bounds: [302.726, 114.318],
      size: [296, 88],
    },
    name: { at: [837.65, 1633.37], bounds: [168.848, 32.071], size: [168, 17] },
    shade: { side: "bottom", from: 0.42125, to: 0.55082 },
    // Below the band's top edge (365 to 413), the head clear of it.
    focus: [0.5, 0.55],
    out: 720,
    drift: 96,
    floor: 300,
    clear: {
      above: [[28, 328, 341]],
      below: [[8, 328, 826]],
    },
  },
};

/* The clearance kept above the top edge and below the foot's (frame px). */
const CLEARANCE = { above: 24, below: 40 };

/*
 * The site's edges, each sampled as the y of its boundary at every x of its
 * frame (1440 wide for the hero waves; each frame's own for the closing
 * CTA): `native` says which side the photo is on ("below" a top edge,
 * "above" a foot).
 */
const HERO_WAVE = readFileSync("src/components/site/hero-wave.tsx", "utf8");
const constant = (name) =>
  HERO_WAVE.match(new RegExp(`const ${name} =\\s*"([^"]+)"`))?.[1] ??
  HERO_WAVE.match(new RegExp(`const ${name} =\\s*\`([^\`]+)\``))?.[1];
const ROTATION = constant("ROTATION");
const heroTransform = (name) => constant(name).replace("${ROTATION}", ROTATION);

/* Edges are traced at this many samples a unit, each column's edge the
   area of black above it (anti-aliasing gives the fractions), so it is
   exact to a fraction of a unit, not a whole pixel. */
const TRACE = 4;

async function sampleEdge(svg, width, height) {
  const { data } = await sharp(Buffer.from(svg), { density: 72 * TRACE })
    .resize(width * TRACE, height * TRACE, { fit: "fill" })
    .greyscale()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const W = width * TRACE;
  const H = height * TRACE;
  const edge = [];
  for (let x = 0; x < width; x++) {
    let total = 0;
    for (let sub = 0; sub < TRACE; sub++) {
      const column = x * TRACE + sub;
      let dark = 0;
      for (let y = 0; y < H; y++) {
        const value = data[y * W + column];
        if (value >= 250) break;
        dark += 1 - value / 255;
      }
      total += dark;
    }
    edge.push(total / TRACE / TRACE);
  }
  return edge;
}

/** A hero wave's edge: where its photo blob gives way to the band below. */
async function heroEdge(blob, transform, top, height) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1440" height="${height}" viewBox="0 ${top} 1440 ${height}"><rect x="0" y="${top}" width="1440" height="${height}" fill="#fff"/><path fill="#000" transform="${transform}" d="${blob}"/></svg>`;
  return { native: "above", points: await sampleEdge(svg, 1440, height) };
}

/** A closing CTA edge: the first white of its frame's SVG, column by column. */
async function ctaEdge(file, native) {
  const svg = readFileSync(file, "utf8");
  const [, , width, height] = svg
    .match(/viewBox="([^"]+)"/)[1]
    .split(" ")
    .map(Number);
  return { native, points: await sampleEdge(svg, width, height) };
}

const EDGES = {
  landing: await heroEdge(
    constant("HERO_BLOB"),
    heroTransform("HERO_PHOTO_BLOB"),
    986,
    244,
  ),
  neighbornets: await heroEdge(
    constant("NEIGHBORNETS_HERO_BLOB"),
    constant("NEIGHBORNETS_PHOTO_BLOB"),
    1015,
    200,
  ),
  stories: await heroEdge(
    constant("STORIES_HERO_BLOB"),
    constant("STORIES_PHOTO_BLOB"),
    1011,
    160,
  ),
};
const CTA = {};
for (const name of ["desktop", "tablet", "mobile"]) {
  CTA[name] = {
    top: await ctaEdge(
      `design-assets/figma/landing-2026/cta/shape-${name}.svg`,
      "below",
    ),
    foot: await ctaEdge(
      `design-assets/figma/landing-2026/cta/foot-${name}.svg`,
      "above",
    ),
  };
}

/* The edge shapes (1 to 3): each frame's top and foot edge, and whether the
   top is mirrored left to right. */
/* `swell` deepens each shape's edges (the CTA's window and the gentler
   hero waves read as an opening only when deeper than they are at home). */
const SHAPES = [
  () => ({
    top: EDGES.landing,
    mirror: true,
    foot: EDGES.landing,
    swell: 1.3,
  }),
  (frame) => ({
    top: CTA[frame].top,
    mirror: false,
    foot: CTA[frame].foot,
    swell: 2.6,
  }),
  () => ({
    top: EDGES.stories,
    mirror: true,
    foot: EDGES.neighbornets,
    swell: 4,
  }),
];

/**
 * An edge as a profile across the frame (width W): resampled to W columns,
 * turned to the role it plays (a top edge: larger is lower, the photo
 * below; a foot: larger is lower, the photo above; an edge from the other
 * side is turned over), from 0 and scaled to `scale`.
 */
function profile(edge, role, W, scale, mirror) {
  const { points, native } = edge;
  const flip = (role === "top") === (native === "above") ? -1 : 1;
  const out = [];
  for (let x = 0; x <= W; x++) {
    const at = ((mirror ? W - x : x) / W) * (points.length - 1);
    const i = Math.floor(at);
    const j = Math.min(points.length - 1, i + 1);
    out.push(flip * (points[i] + (points[j] - points[i]) * (at - i)));
  }
  const min = Math.min(...out);
  return out.map((y) => (y - min) * scale);
}

/**
 * An edge as a smooth vector curve: CURVE_POINTS points evenly across the
 * frame (each the edge averaged over a few units, so no trace noise is
 * kept), joined by a Catmull-Rom spline as cubic Béziers. From the left, or
 * from the right with `reverse`.
 */
const CURVE_POINTS = 48;

function curve(edge, W, reverse) {
  const at = (x) => {
    const i = Math.round(x);
    const from = Math.max(0, i - 3);
    const to = Math.min(edge.length - 1, i + 3);
    let sum = 0;
    for (let j = from; j <= to; j++) sum += edge[j];
    return sum / (to - from + 1);
  };
  const points = [];
  for (let k = 0; k <= CURVE_POINTS; k++) {
    const x = (k / CURVE_POINTS) * W;
    points.push([x, at(x)]);
  }
  if (reverse) points.reverse();
  let d = "";
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[Math.max(0, i - 1)];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[Math.min(points.length - 1, i + 2)];
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
    const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    d += `C${round(c1[0])} ${round(c1[1])} ${round(c2[0])} ${round(c2[1])} ${round(p2[0])} ${round(p2[1])}`;
  }
  return { start: round(points[0][1]), d };
}

/** The band between a top and a foot profile, placed to clear `clear`. */
function placeBand(frame, top, foot) {
  const { height: H, clear } = frame;
  // The top as high as the button and headline allow.
  let lift = 0;
  for (const [x0, x1, bottom] of clear.above)
    for (let x = x0; x <= x1; x++)
      lift = Math.max(lift, bottom + CLEARANCE.above - top[x]);
  // Never higher than the floor (the space between button and headline).
  lift = Math.max(lift, frame.floor - Math.min(...top));
  const topEdge = top.map((y) => lift + y);
  // The foot as low as the frame allows, flattened until it clears the
  // attribution.
  let footEdge;
  for (let squash = 1; squash > 0.05; squash *= 0.85) {
    const depth = Math.max(...foot) * squash;
    footEdge = foot.map((y) => H - 2 - depth + y * squash);
    const ok = clear.below.every(([x0, x1, bottom]) =>
      footEdge.slice(x0, x1 + 1).every((y) => y >= bottom + CLEARANCE.below),
    );
    if (ok) break;
  }
  // Flush sides: each edge eases out to the band's full extent toward the
  // sides (the top to its highest point, the foot to its lowest), weighted
  // |2x/W - 1|^SIDE_EASE across the whole width (none in the middle, all at
  // the sides), so the band meets both sides of the frame at its full height
  // with no shape curling into a corner and no kink; the waves stay in the
  // middle. The top still clears the headline.
  const W = topEdge.length - 1;
  const highest = Math.min(...topEdge);
  const lowest = Math.max(...footEdge);
  for (let x = 0; x <= W; x++) {
    const ease = Math.abs((2 * x) / W - 1) ** SIDE_EASE;
    let limit = 0;
    for (const [x0, x1, bottom] of clear.above)
      if (x >= x0 && x <= x1) limit = Math.max(limit, bottom + CLEARANCE.above);
    topEdge[x] = Math.max(limit, topEdge[x] - ease * (topEdge[x] - highest));
    footEdge[x] = footEdge[x] + ease * (lowest - footEdge[x]);
  }
  return { topEdge, footEdge };
}

/* How sharply the edges' easing to full height gathers at the sides. */
const SIDE_EASE = 3;

const round = (value) => Math.round(value * 100) / 100;

for (const [name, frame] of Object.entries(FRAMES)) {
  const half = [GROUP.width / 2, GROUP.height / 2];
  // The corner is the group's top-left once turned about its centre.
  const centre = [
    frame.corner[0] - (-half[0] * cos + half[1] * sin),
    frame.corner[1] - (-half[0] * sin - half[1] * cos),
  ];
  /** A point in the group, in the frame. */
  const place = ([x, y]) => {
    const dx = x - half[0];
    const dy = y - half[1];
    return [centre[0] + dx * cos - dy * sin, centre[1] + dx * sin + dy * cos];
  };
  /** An upright box (turned back inside the group) in the frame. */
  const box = ({ at, bounds, size }) => {
    const [cx, cy] = place([
      IMG.x + at[0] + bounds[0] / 2,
      IMG.y + at[1] + bounds[1] / 2,
    ]);
    return {
      left: cx - size[0] / 2,
      top: cy - size[1] / 2,
      width: size[0],
      height: size[1],
    };
  };
  frame.photoBox = box(frame.photo);

  // The band masks: Figma's (0), then the edge shapes (1 to 3).
  const { width: W, height: H } = frame;
  const blob = (at) =>
    `<path fill="#000" transform="translate(${at[0]} ${at[1]})" d="${BLOB}"/>`;
  const group = `translate(${round(centre[0])} ${round(centre[1])}) rotate(${ANGLE}) translate(${-half[0]} ${round(-half[1])})`;
  writeFileSync(
    join(DIR, `band-${name}-0.svg`),
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" preserveAspectRatio="none"><defs><mask id="m" maskUnits="userSpaceOnUse" x="0" y="0" width="${W}" height="${H}"><rect width="${W}" height="${H}" fill="#fff"/><g transform="${group}">${blob(frame.top)}${blob(frame.bottom)}</g></mask></defs><rect width="${W}" height="${H}" fill="#fff" mask="url(#m)"/></svg>\n`,
  );
  SHAPES.forEach((shape, index) => {
    const { top, mirror, foot, swell } = shape(name);
    // The hero waves are 1440 wide: their height scales with the frame,
    // but never below half, so the narrow frames keep their swell.
    const scaleOf = (edge) =>
      edge.points.length === W ? 1 : Math.max(W / 1440, 0.5);
    const { topEdge, footEdge } = placeBand(
      frame,
      profile(top, "top", W, scaleOf(top) * swell, mirror),
      profile(foot, "foot", W, scaleOf(foot) * swell, false),
    );
    // The lowest the top edge comes at each x, and the highest the foot
    // does, over the three shapes: the window a head must sit in
    // (whichever shape a page takes).
    frame.bandTop ??= new Array(W).fill(0);
    frame.bandFoot ??= new Array(W).fill(H);
    topEdge.forEach((y, x) => {
      frame.bandTop[x] = Math.max(frame.bandTop[x], y);
    });
    footEdge.forEach((y, x) => {
      frame.bandFoot[x] = Math.min(frame.bandFoot[x], y);
    });
    const upper = curve(topEdge, W, false);
    const lower = curve(footEdge, W, true);
    // Straight, flush sides: the band meets both edges of the frame.
    const d = `M0 ${upper.start}${upper.d}L${W} ${lower.start}${lower.d}Z`;
    writeFileSync(
      join(DIR, `band-${name}-${index + 1}.svg`),
      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" preserveAspectRatio="none"><path fill="#fff" d="${d}"/></svg>\n`,
    );
    console.log(
      `band-${name}-${index + 1}: top ${round(Math.min(...topEdge))}-${round(Math.max(...topEdge))}, foot ${round(Math.min(...footEdge))}-${round(Math.max(...footEdge))}`,
    );
  });

  // The geometry for the tokens.
  const pct = (value, of) => `${round((value / of) * 100)}%`;
  const p = frame.photoBox;
  const shade =
    frame.shade.side === "right"
      ? [
          pct(W - (p.left + p.width - frame.shade.from * p.width), W),
          pct(W - (p.left + p.width - frame.shade.to * p.width), W),
        ]
      : [
          pct(H - (p.top + p.height - frame.shade.from * p.height), H),
          pct(H - (p.top + p.height - frame.shade.to * p.height), H),
        ];
  const fmt = (b) =>
    `left ${round(b.left)} (${pct(b.left, W)}), top ${round(b.top)}, ${b.width} x ${b.height}`;
  console.log(`${name} ${W} x ${H}: photo ${fmt(p)}`);
  console.log(`  mark ${fmt(box(frame.mark))}`);
  console.log(`  quote ${fmt(box(frame.quote))}`);
  console.log(`  name ${fmt(box(frame.name))}`);
  console.log(`  shade from the ${frame.shade.side}: ${shade.join(" to ")}`);
}

/*
 * Each person's head in their (upright) source: the x and y of its centre
 * and its height (hair or hijab top to chin), as shares of the source,
 * measured on a 10% grid against their gallery face (faces.json), so the
 * page shows the very person the gallery does. (Rahmah's is Figma's own
 * crop.) Groups name the one person:
 */
const SUBJECT = {
  // The stories: Mustafa is the boy in the middle (his gallery face), Layla
  // in the red patterned hijab and glasses (front left), Maryam in the
  // beige hijab and glasses (second from left), Bilal in the white thobe,
  // Yusuf in the blue jumper, Muneeb at the microphone.
  "mustafa-r": [0.44, 0.589, 0.13],
  "layla-h": [0.335, 0.6, 0.18],
  "maryam-t": [0.368, 0.459, 0.09],
  "bilal-s": [0.335, 0.378, 0.27],
  "yusuf-a": [0.445, 0.335, 0.33],
  "muneeb-syed": [0.42, 0.408, 0.39],
  // PLACEHOLDERS: each gallery face's person.
  "community-ab441": [0.615, 0.435, 0.075],
  "community-08a9b": [0.055, 0.675, 0.1],
  "community-2e353": [0.505, 0.435, 0.035],
  "community-c2981": [0.45, 0.355, 0.32],
  "community-86dfe": [0.39, 0.516, 0.16],
  "community-1d75b": [0.43, 0.542, 0.085],
  "community-093fb": [0.8, 0.416, 0.04],
  "community-b649d": [0.68, 0.663, 0.072],
  "community-995d1": [0.41, 0.388, 0.052],
  "community-8245b": [0.4, 0.467, 0.22],
  "community-bfb31": [0.5, 0.385, 0.126],
  "community-4b24a": [0.42, 0.341, 0.157],
  "community-4ca3d": [0.545, 0.38, 0.49],
  "community-41fca": [0.405, 0.446, 0.15],
  "community-a4cd2": [0.39, 0.462, 0.32],
  "community-b4dd1": [0.645, 0.414, 0.112],
  "community-e10ab": [0.724, 0.395, 0.055],
};
const faces = JSON.parse(
  readFileSync("design-assets/figma/stories/gallery/faces.json", "utf8"),
);
/* Sources stored turned in Figma (the fill is rotated in its frame): turned
   upright first (a quarter turn back). */
const TURNED = new Set(
  faces
    .filter(({ imageTransform: [[a, b], [c]] }) => a === 0 && b < 0 && c > 0)
    .map((face) => `community-${face.name}`),
);

/*
 * Framing, per frame (frame px). The head is sized to `head` tall, never
 * zoomed past `density` source px per frame px (so it stays sharp) and
 * never less than covering the layer, and set at the frame's focus. It
 * must sit in the window between the band's top edge above it (the lowest
 * any shape's edge comes there, `bandTop`) and its foot (`bandFoot`; on
 * mobile, the pull-quote, `quoteTop`), each `MARGIN` clear: a head too big
 * to sit at the focus is moved down until its top clears, and one taller
 * than the window (a close-up in the wide desktop frame) is centred in it,
 * its eyes in view.
 */
const FRAMING = {
  desktop: { head: 190, density: 1.1 },
  tablet: { head: 170, density: 1.2 },
  mobile: { head: 130, density: 1.4, quoteTop: 690 },
};
const MARGIN = 24;

/*
 * A photo with too little above the head to set it there (the crop's top
 * can go no higher than the source's: Yusuf's and Muneeb's heads sit near
 * the top of theirs) gets a strip added above: the photo's own top rows,
 * drawn down and blurred. It falls under the Warm Snow above the band (the
 * log flags any that would show).
 */
async function padTop(image, pad) {
  const { width, height } = await sharp(image).metadata();
  const strip = await sharp(image)
    .extract({
      left: 0,
      top: 0,
      width,
      height: Math.max(1, Math.round(height / 200)),
    })
    .resize(width, pad, { fit: "fill" })
    .blur(Math.max(1, width / 60))
    .toBuffer();
  return sharp(image)
    .extend({ top: pad, background: "#000" })
    .composite([{ input: strip, top: 0, left: 0 }])
    .toBuffer();
}

/*
 * Sharpening, on the final size (as the browser shows it): a light
 * unsharp mask on every crop; more on one enlarged from a small source
 * (upscaled here with Lanczos, sharper than the browser's own scaling, to
 * at least the frame's width), and more again on the sources that are soft
 * in themselves (out of focus or compressed in the original).
 */
const SOFT = new Set([
  "bilal-s",
  "mustafa-r",
  "muneeb-syed",
  "community-8245b",
  "community-08a9b",
  "community-a4cd2",
  "community-c2981",
  "community-4b24a",
]);

const sourceFor = (slug) =>
  [".png", ".jpg"]
    .map((ext) => join(sources, `${slug}${ext}`))
    .find((file) => existsSync(file));

const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

for (const slug of ["rahmah-k", ...Object.keys(SUBJECT)]) {
  const file = sourceFor(slug);
  if (!file) continue;
  const upright = await sharp(file)
    .rotate(TURNED.has(slug) ? 270 : 0)
    .toBuffer();
  const [fx, fy, hh] = SUBJECT[slug] ?? [0.5, 0.5, 0.1];
  const { width: sw, height: sh } = await sharp(upright).metadata();
  for (const [name, frame] of Object.entries(FRAMES)) {
    // The drifting layer: the hero plus the drift, half above, half below.
    const { width: W, drift } = frame;
    const H = frame.height + drift;
    let region;
    let source = upright;
    if (slug === "rahmah-k") {
      // Figma's crop: the frame's window onto the photo's box. (On mobile
      // the photo starts 25 below the frame's top, under the top blob: the
      // window is moved down onto the photo.)
      const p = frame.photoBox;
      const scale = sw / p.width;
      const width = Math.min(sw, Math.round(W * scale));
      const height = Math.min(sh, Math.round(H * scale));
      region = {
        left: clamp(Math.round(-p.left * scale), 0, sw - width),
        top: clamp(Math.round((-p.top - drift / 2) * scale), 0, sh - height),
        width,
        height,
      };
    } else {
      const framing = FRAMING[name];
      const head = hh * sh;
      const tx = frame.focus[0];
      // The window across the head's width (about four fifths of its
      // height), at a given scale.
      const window = (u) => {
        const half = (0.4 * head) / u;
        const from = Math.max(0, Math.round(tx * W - half));
        const to = Math.min(W - 1, Math.round(tx * W + half));
        const span = (edge) => edge.slice(from, to + 1);
        return [
          Math.max(...span(frame.bandTop)) + MARGIN,
          Math.min(framing.quoteTop ?? H, ...span(frame.bandFoot)) - MARGIN,
        ];
      };
      // Source px per frame px, the head's centre in the hero, and the
      // strip added above (source px), settled over a few passes.
      let pad = 0;
      let unit;
      let focusY;
      for (let pass = 0; pass < 3; pass++) {
        const cover = Math.min(sw / W, (sh + pad) / H);
        unit = Math.min(cover, Math.max(framing.density, head / framing.head));
        const [top, bottom] = window(unit);
        const size = head / unit;
        focusY =
          size > bottom - top
            ? (top + bottom) / 2
            : Math.max(frame.focus[1] * frame.height, top + size / 2);
        // The crop's top sits (drift / 2 + focusY) above the head's centre.
        pad = Math.max(0, Math.ceil((drift / 2 + focusY) * unit - fy * sh));
      }
      if (pad) source = await padTop(upright, pad);
      const ph = sh + pad;
      const width = Math.min(sw, Math.round(W * unit));
      const height = Math.min(ph, Math.round(H * unit));
      const ty = (drift / 2 + focusY) / H;
      region = {
        left: Math.round(clamp(fx * sw - tx * width, 0, sw - width)),
        top: Math.round(clamp(fy * sh + pad - ty * height, 0, ph - height)),
        width,
        height,
      };
      if (pad) {
        // Where the strip ends in the hero, against the band's top edge.
        const end = (pad - region.top) / unit - drift / 2;
        const shows = end > Math.min(...frame.bandTop);
        console.log(
          `${slug}-${name}: strip of ${pad}px above${shows ? " (SHOWS)" : ""}`,
        );
      }
    }
    const outWidth = Math.min(frame.out, Math.max(region.width, W));
    const enlarged = outWidth / region.width;
    const sigma =
      (enlarged > 1 ? Math.min(1.6, 0.6 + 0.4 * enlarged) : 0.5) +
      (SOFT.has(slug) ? 0.4 : 0);
    await sharp(source)
      .extract(region)
      .resize({ width: outWidth, kernel: "lanczos3" })
      .sharpen({ sigma, m1: 1, m2: SOFT.has(slug) ? 3 : 2 })
      .jpeg({ quality: 80, mozjpeg: true })
      .toFile(join(DIR, "photos", `${slug}-${name}.jpg`));
    console.log(
      `photos/${slug}-${name}.jpg`,
      `${region.width}x${region.height}`,
      `density ${(region.width / W).toFixed(2)}`,
      enlarged > 1 ? `enlarged ${enlarged.toFixed(2)}x` : "",
    );
  }
}

// Figma frames the lifted brother at the top and the crowd's faces at the
// foot: its top 68%, which the CTA's cover crop then centres.
await sharp(join(sources, "cta.jpg"))
  .extract({ left: 0, top: 0, width: 4096, height: 1857 })
  .resize({ width: 2560 })
  .jpeg({ quality: 80, mozjpeg: true })
  .toFile(join(DIR, "cta-brothers-lift.jpg"));
console.log("cta-brothers-lift.jpg");
