// Generates the landing "show you" blob outline from Figma's wave vectors.
//
//   bun run generate:show-you-blob
//
// For each Figma shape around the section (top: 165:1221 Landing Twilight,
// 165:1223 Obsidian; bottom: 165:1225 Landing Twilight, 165:1227 Obsidian),
// placed exactly as in Figma, it traces the OUTER edge across x = -800..800
// (Figma units from the section's centre): the topmost edge of the top waves
// and the bottommost edge of the bottom waves, exactly as Figma draws them
// (including the bottom shape's curve back into the section at the far
// left). Each contour is then closed straight back into the section, deep
// enough that the closing edge always stays hidden, so no notch, lobe or
// straight edge can show.
//
// Writes src/app/landing/show-you-blob.ts (used by show-you-motion.tsx) and
// reference renders in design-assets/figma/landing-2026/show-you/. If the
// Figma shapes change, update SHAPES below (path data from the vendored SVGs,
// placements from the Figma node boxes and rotations) and re-run.
//
// The overlaps must stay larger than the parallax can move the caps; the
// script sizes the bottom rim's overlap and refuses to write if they cannot
// keep every straight inner edge hidden (see the comment above
// BOTTOM_RIM_OVERLAP).

import { writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

/** How far the Obsidian caps reach back into the section (Figma units). */
const OVERLAP = 140;
/** How far the top Twilight rim reaches back: less than the Obsidian, so its
 * inner edge stays hidden behind it although the rims move 1.5x as far. */
const RIM_OVERLAP = 64;
/** The parallax distances (keep in step with --show-edge-drift and the 1.5x
 * rim depth in show-you-motion.tsx), used to size and check the overlaps. */
const EDGE_DRIFT = 110;
const RIM_DRIFT = EDGE_DRIFT * 1.5;
/** Half the visible width of the blob, in Figma units (the caps' view box is
 * -720..720 wide; wider screens scale it). */
const VISIBLE_HALF_WIDTH = 720;
const X_FROM = -800;
const X_TO = 800;
const STEP = 6;

const SHAPES = {
  topTwilight: {
    node: "165:1221",
    d: "M1712.81 200.158C1606.81 252.74 1474.7 244.909 1377.93 180.3C1178.79 47.3541 887.443 -27.2297 627.145 9.22328C93.6825 83.9006 -256.117 871.228 235.579 1226.62C429.497 1364.14 676.372 1337.75 848.474 1251.23C954.011 1198.19 1086.02 1205.27 1183.17 1269.23C1480.48 1465.01 1736.12 1503.61 1955.3 1278.46C2022.43 1209.56 2125.63 1175.35 2228.56 1187.84C3048.8 1287.5 2926.48 -402.574 1712.72 200.065L1712.81 200.158Z",
    // Centre the path on its box, rotate, then place the box centre.
    place: { centre: [-1376.115, -716.1], rotate: -9.8, at: [-115.01, 402.98] },
    edge: "top",
  },
  topObsidian: {
    node: "165:1223",
    d: "M1614.85 188.711C1514.91 238.285 1390.36 230.901 1299.12 169.988C1111.37 44.6458 836.687 -25.6723 591.276 8.69576C88.3245 79.102 -241.469 821.399 222.105 1156.47C404.933 1286.12 637.687 1261.24 799.947 1179.67C899.447 1129.66 1023.91 1136.34 1115.5 1196.64C1395.81 1381.22 1636.82 1417.61 1843.47 1205.34C1906.76 1140.38 2004.06 1108.12 2101.1 1119.9C2874.43 1213.86 2759.1 -379.55 1614.76 188.623L1614.85 188.711Z",
    place: {
      centre: [-1297.41, -675.145],
      rotate: -9.8,
      at: [-107.04, 443.34],
    },
    edge: "top",
  },
  bottomTwilight: {
    node: "165:1225",
    d: "M867.051 1465.18C460.53 1435.21 167.662 1176.63 53.5776 789.84C7.53405 633.918 -36.3529 483.602 46.8922 328.003C202.815 36.6447 539.246 156.768 800.196 115.9C1059.53 75.248 1361.88 -64.2846 1661.33 34.9194C1933.06 124.958 2110.12 339.217 2216.12 596.393C2281.14 754.148 2319.74 956.223 2231 1113.44C2124.35 1302.47 1834.51 1365.33 1635.23 1375.14C1376.66 1387.98 1133.07 1484.7 867.051 1465.18Z",
    place: { centre: [-1141.45, -733.885], rotate: 3.2, at: [-20.28, -416.94] },
    edge: "bottom",
  },
  bottomObsidian: {
    node: "165:1227",
    d: "M790.839 1336.4C420.051 1309.06 152.925 1073.21 48.8683 720.416C6.87183 578.198 -33.1576 441.095 42.7705 299.172C184.988 33.4238 491.848 142.988 729.861 105.713C966.398 68.634 1242.18 -58.6342 1515.3 31.8501C1763.15 113.974 1924.65 309.401 2021.33 543.971C2080.63 687.861 2115.84 872.174 2034.9 1015.57C1937.63 1187.98 1673.26 1245.32 1491.5 1254.27C1255.65 1265.98 1033.47 1354.2 790.839 1336.4Z",
    place: { centre: [-1041.12, -669.38], rotate: 3.2, at: [-23.88, -481.35] },
    edge: "bottom",
  },
};

/** Flattens an absolute M/L/C/Z path into a closed polyline, placed. */
function polyline(d, { centre, rotate, at }) {
  const r = (rotate * Math.PI) / 180;
  const cos = Math.cos(r);
  const sin = Math.sin(r);
  const place = ([x, y]) => {
    const a = x + centre[0];
    const b = y + centre[1];
    return [a * cos - b * sin + at[0], a * sin + b * cos + at[1]];
  };
  const tokens = d.match(/[MLCZ]|-?\d*\.?\d+(?:e-?\d+)?/gi);
  const points = [];
  let i = 0;
  let current = [0, 0];
  let command = "";
  const next = () => Number(tokens[i++]);
  while (i < tokens.length) {
    if (/[MLCZ]/i.test(tokens[i])) command = tokens[i++].toUpperCase();
    if (command === "M" || command === "L") {
      current = [next(), next()];
      points.push(place(current));
    } else if (command === "C") {
      const c1 = [next(), next()];
      const c2 = [next(), next()];
      const end = [next(), next()];
      for (let s = 1; s <= 48; s++) {
        const t = s / 48;
        const u = 1 - t;
        points.push(
          place([
            u * u * u * current[0] +
              3 * u * u * t * c1[0] +
              3 * u * t * t * c2[0] +
              t * t * t * end[0],
            u * u * u * current[1] +
              3 * u * u * t * c1[1] +
              3 * u * t * t * c2[1] +
              t * t * t * end[1],
          ]),
        );
      }
      current = end;
    } else if (command === "Z") {
      command = "";
    }
  }
  return points;
}

/** The outer edge at x: the topmost (top waves) or bottommost crossing. */
function outerEdge(points, x, edge) {
  let best = null;
  for (let k = 0; k < points.length; k++) {
    const [ax, ay] = points[k];
    const [bx, by] = points[(k + 1) % points.length];
    if ((ax <= x && bx > x) || (bx <= x && ax > x)) {
      const y = ay + ((x - ax) / (bx - ax)) * (by - ay);
      if (best === null || (edge === "top" ? y < best : y > best)) best = y;
    }
  }
  return best;
}

const round = (n) => Number(n.toFixed(1));

/** Samples one shape's outer edge across X_FROM..X_TO. */
function sample(name, shape) {
  const points = polyline(shape.d, shape.place);
  const samples = [];
  for (let x = X_FROM; x <= X_TO; x += STEP) {
    const y = outerEdge(points, x, shape.edge);
    if (y === null)
      throw new Error(`${name} (${shape.node}) does not reach x=${x}`);
    samples.push([x, y]);
  }
  checkOrganic(name, shape, samples);
  return samples;
}

/*
 * Refuses contours that would show a straight edge: a near-vertical jump
 * between neighbouring samples (a cut), or a perfectly flat run near either
 * visible side (a contour flattened into a shelf, which meets the screen edge
 * as a squared corner). Figma's waves are steep and curved near both sides.
 * bun run test:show-you checks the rendered blob in the browser as well.
 */
function checkOrganic(name, shape, samples) {
  for (let k = 1; k < samples.length; k++) {
    const rise = Math.abs(samples[k][1] - samples[k - 1][1]);
    if (rise > 3 * STEP)
      throw new Error(
        `${name} (${shape.node}) jumps ${round(rise)} units at x=${samples[k][0]}: a vertical cut.`,
      );
  }
  let run = 1;
  for (let k = 1; k < samples.length; k++) {
    const [x, y] = samples[k];
    const nearSide = Math.abs(x) >= VISIBLE_HALF_WIDTH - 60;
    run = nearSide && Math.abs(y - samples[k - 1][1]) < 0.01 ? run + 1 : 1;
    if (run >= 5)
      throw new Error(
        `${name} (${shape.node}) is flat near x=${x}: a shelf where Figma's edge curves.`,
      );
  }
}

/*
 * The rims' straight inner edges must stay covered by the Obsidian at every
 * point of the parallax. A rim's inner edge (depth R, moving RIM_DRIFT) has
 * to stay on the section side of the Obsidian edge e (moving EDGE_DRIFT), so
 * R >= (RIM_DRIFT - EDGE_DRIFT) - e at the edge's closest approach, and
 * behind the Obsidian cap's own inner edge, so R <= OVERLAP. At the far left
 * Figma's bottom shape (165:1227) curves back into the section (e < 0
 * there), which the bottom rim's depth allows for.
 */
const bottomEdge = sample("bottomObsidian", SHAPES.bottomObsidian);
const closestBottom = Math.min(...bottomEdge.map(([, y]) => y));
const BOTTOM_RIM_OVERLAP = Math.ceil(
  RIM_DRIFT - EDGE_DRIFT - closestBottom + 8,
);
if (BOTTOM_RIM_OVERLAP > OVERLAP || EDGE_DRIFT >= OVERLAP)
  throw new Error(
    `Overlaps too small for the parallax: the bottom rim needs ${BOTTOM_RIM_OVERLAP}, the Obsidian overlap is ${OVERLAP}.`,
  );

const contours = {};
for (const [name, shape] of Object.entries(SHAPES)) {
  const samples = sample(name, shape);
  // A smooth curve through the samples (Catmull-Rom as cubic Béziers).
  let d = `M${round(samples[0][0])} ${round(samples[0][1])}`;
  for (let k = 0; k < samples.length - 1; k++) {
    const p0 = samples[Math.max(0, k - 1)];
    const p1 = samples[k];
    const p2 = samples[k + 1];
    const p3 = samples[Math.min(samples.length - 1, k + 2)];
    d +=
      `C${round(p1[0] + (p2[0] - p0[0]) / 6)} ${round(p1[1] + (p2[1] - p0[1]) / 6)} ` +
      `${round(p2[0] - (p3[0] - p1[0]) / 6)} ${round(p2[1] - (p3[1] - p1[1]) / 6)} ` +
      `${round(p2[0])} ${round(p2[1])}`;
  }
  const depth =
    name === "bottomTwilight"
      ? BOTTOM_RIM_OVERLAP
      : name.endsWith("Twilight")
        ? RIM_OVERLAP
        : OVERLAP;
  const inner = shape.edge === "top" ? depth : -depth;
  d += `L${X_TO} ${inner}L${X_FROM} ${inner}Z`;
  const ys = samples.map(([, y]) => y);
  contours[name] = d;
  console.log(
    `${name.padEnd(15)} ${shape.node}  reaches back ${depth}, outer edge ${round(Math.min(...ys))} to ${round(Math.max(...ys))}`,
  );
}

const svgDir = path.join(root, "design-assets/figma/landing-2026/show-you");
writeFileSync(
  path.join(svgDir, "blob-top.svg"),
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="-800 -460 1600 ${460 + OVERLAP}"><path d="${contours.topTwilight}" fill="#34344C"/><path d="${contours.topObsidian}" fill="#171725"/></svg>\n`,
);
writeFileSync(
  path.join(svgDir, "blob-bottom.svg"),
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="-800 ${-OVERLAP} 1600 ${380 + OVERLAP}"><path d="${contours.bottomTwilight}" fill="#34344C"/><path d="${contours.bottomObsidian}" fill="#171725"/></svg>\n`,
);

writeFileSync(
  path.join(root, "src/app/landing/show-you-blob.ts"),
  `/*
 * The "show you" blob outline. GENERATED by scripts/blob-contours.mjs
 * (bun run generate:show-you-blob) from Figma's wave vectors around the
 * section: each shape's outer edge across x = -800..800 (Figma units from the
 * section's centre), closed straight back into the section. Top contours are
 * measured from the section's top edge, bottom ones from its bottom edge.
 * Reference renders: design-assets/figma/landing-2026/show-you/blob-top.svg
 * and blob-bottom.svg. Regenerate rather than edit by hand.
 */

/** How far the Obsidian caps reach back into the section, in Figma units. */
export const BLOB_OVERLAP = ${OVERLAP};
/** How far the Twilight rims reach back into the section. */
export const BLOB_RIM_OVERLAP = ${RIM_OVERLAP};
/** How far the bottom Twilight rim reaches back: deeper, because Figma's
 * bottom shape curves back into the section at the far left. */
export const BLOB_BOTTOM_RIM_OVERLAP = ${BOTTOM_RIM_OVERLAP};

export const BLOB_TOP_TWILIGHT =
  "${contours.topTwilight}";
export const BLOB_TOP_OBSIDIAN =
  "${contours.topObsidian}";
export const BLOB_BOTTOM_TWILIGHT =
  "${contours.bottomTwilight}";
export const BLOB_BOTTOM_OBSIDIAN =
  "${contours.bottomObsidian}";
`,
);
console.log(
  "Wrote src/app/landing/show-you-blob.ts and show-you/blob-top.svg, blob-bottom.svg. Run bun run format.",
);
