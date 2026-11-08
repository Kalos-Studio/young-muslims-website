// Audits the landing "show you" blob for straight edges.
//
//   RESPONSIVE_AUDIT_ORIGIN=http://localhost:3000 bun run test:show-you
//
// At mobile, tablet, desktop, 1920 and 2560 widths it scrolls through the
// section and, at each step, hides everything on the page except the
// section's Obsidian body and its four blob caps, takes a screenshot and
// checks the shape for:
// - straight VERTICAL boundaries (a colour change holding one column for 20+
//   rows, away from the screen's sides), such as a cap ending in a cut;
// - long straight HORIZONTAL boundaries (200+ px on one row; organic crests
//   stay flat for less), such as an exposed inner edge of a cap or rim;
// - SQUARED corners: a flat run of 10+ px that turns abruptly steep (0.4+ px
//   per px over the next 12 px), such as a contour flattened into a shelf;
// and for any horizontal page overflow. Exits non-zero on any finding.

import { spawn } from "node:child_process";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { inflateSync } from "node:zlib";

const ORIGIN = process.env.RESPONSIVE_AUDIT_ORIGIN ?? "http://localhost:3000";
const CHROME =
  process.env.CHROME_PATH ??
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const VIEWPORTS = [
  [360, 640],
  [768, 1024],
  [1440, 1024],
  [1920, 1080],
  [2560, 1300],
];
const SECTION = "section[aria-labelledby=show-you-heading]";
const OBSIDIAN = [23, 23, 37];
const TWILIGHT = [52, 52, 76];
/** A strip at the right left alone (an overlay scrollbar, when present). */
const SCROLLBAR = 20;

function waitForBrowserUrl(child) {
  return new Promise((resolve, reject) => {
    let stderr = "";
    const timer = setTimeout(
      () => reject(new Error(`Chrome did not start. ${stderr.trim()}`)),
      10_000,
    );
    child.stderr.on("data", (chunk) => {
      stderr += chunk;
      const match = stderr.match(/DevTools listening on (ws:\/\/[^\s]+)/);
      if (!match) return;
      clearTimeout(timer);
      resolve(match[1]);
    });
    child.once("exit", (code) => {
      clearTimeout(timer);
      reject(new Error(`Chrome exited before startup with code ${code}.`));
    });
  });
}

class CdpClient {
  constructor(socket) {
    this.socket = socket;
    this.nextId = 1;
    this.pending = new Map();
    socket.addEventListener("message", (event) => {
      const message = JSON.parse(event.data);
      if (!message.id) return;
      const request = this.pending.get(message.id);
      if (!request) return;
      this.pending.delete(message.id);
      if (message.error) request.reject(new Error(message.error.message));
      else request.resolve(message.result);
    });
  }

  send(method, params = {}, sessionId) {
    const id = this.nextId++;
    return new Promise((resolve, reject) => {
      this.pending.set(id, { resolve, reject });
      this.socket.send(JSON.stringify({ id, method, params, sessionId }));
    });
  }
}

async function connect(url) {
  const socket = new WebSocket(url);
  await new Promise((resolve, reject) => {
    socket.addEventListener("open", resolve, { once: true });
    socket.addEventListener("error", reject, { once: true });
  });
  return new CdpClient(socket);
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/** Decodes an 8-bit RGB/RGBA PNG into rows of colour classes. */
function classify(png) {
  let pos = 8;
  let width = 0;
  let height = 0;
  let colourType = 0;
  const chunks = [];
  while (pos < png.length) {
    const length = png.readUInt32BE(pos);
    const type = png.toString("latin1", pos + 4, pos + 8);
    const data = png.subarray(pos + 8, pos + 8 + length);
    if (type === "IHDR") {
      width = data.readUInt32BE(0);
      height = data.readUInt32BE(4);
      colourType = data[9];
    } else if (type === "IDAT") chunks.push(data);
    pos += 12 + length;
  }
  const bpp = colourType === 6 ? 4 : 3;
  const raw = inflateSync(Buffer.concat(chunks));
  const stride = width * bpp;
  const near = (r, g, b, [cr, cg, cb], t) =>
    Math.abs(r - cr) < t && Math.abs(g - cg) < t && Math.abs(b - cb) < t + 2;
  const rows = [];
  let previous = new Uint8Array(stride);
  for (let y = 0, i = 0; y < height; y++) {
    const filter = raw[i];
    const line = new Uint8Array(raw.subarray(i + 1, i + 1 + stride));
    i += 1 + stride;
    for (let k = 0; k < stride; k++) {
      const a = k >= bpp ? line[k - bpp] : 0;
      const b = previous[k];
      const c = k >= bpp ? previous[k - bpp] : 0;
      if (filter === 1) line[k] = (line[k] + a) & 255;
      else if (filter === 2) line[k] = (line[k] + b) & 255;
      else if (filter === 3) line[k] = (line[k] + ((a + b) >> 1)) & 255;
      else if (filter === 4) {
        const p = a + b - c;
        const pa = Math.abs(p - a);
        const pb = Math.abs(p - b);
        const pc = Math.abs(p - c);
        line[k] =
          (line[k] + (pa <= pb && pa <= pc ? a : pb <= pc ? b : c)) & 255;
      }
    }
    const row = new Uint8Array(width);
    for (let x = 0; x < width; x++) {
      const [r, g, b] = [line[x * bpp], line[x * bpp + 1], line[x * bpp + 2]];
      row[x] = near(r, g, b, OBSIDIAN, 8)
        ? 1
        : near(r, g, b, TWILIGHT, 9)
          ? 2
          : 0;
    }
    rows.push(row);
    previous = line;
  }
  return { rows, width, height };
}

/** Straight-edge findings in a screenshot showing only the blob. */
function straightEdges({ rows, width, height }) {
  const findings = [];
  for (let x = 3; x < width - SCROLLBAR; x++) {
    let run = 0;
    for (let y = 0; y <= height; y++) {
      if (y < height && rows[y][x] !== rows[y][x + 1]) run++;
      else {
        if (run >= 20)
          findings.push(`vertical edge at x=${x}, y=${y - run}-${y}`);
        run = 0;
      }
    }
  }
  for (let y = 0; y < height - 1; y++) {
    let run = 0;
    for (let x = 0; x <= width; x++) {
      if (x < width && rows[y][x] !== rows[y + 1][x]) run++;
      else {
        if (run >= 200)
          findings.push(`horizontal edge at y=${y}, x=${x - run}-${x}`);
        run = 0;
      }
    }
  }
  for (const target of [1, 2]) {
    for (const down of [true, false]) {
      // The boundary of this colour, as a function of x.
      const ys = [];
      for (let x = 0; x < width; x++) {
        let found = null;
        if (down) {
          for (let y = 1; y < height && found === null; y++)
            if ((rows[y][x] === target) !== (rows[y - 1][x] === target))
              found = y;
        } else {
          for (let y = height - 1; y > 0 && found === null; y--)
            if ((rows[y - 1][x] === target) !== (rows[y][x] === target))
              found = y;
        }
        ys.push(found);
      }
      const slope = (a, b) =>
        a >= 0 &&
        b >= 0 &&
        a < width - SCROLLBAR &&
        b < width - SCROLLBAR &&
        ys[a] !== null &&
        ys[b] !== null
          ? Math.abs(ys[b] - ys[a]) / Math.abs(b - a)
          : 0;
      for (let x = 0; x < width; x++) {
        if (ys[x] === null) continue;
        const start = x;
        while (x + 1 < width && ys[x + 1] === ys[start]) x++;
        if (x - start + 1 >= 10 && start < width - SCROLLBAR - 4)
          if (slope(x, x + 12) >= 0.4 || slope(start - 12, start) >= 0.4)
            findings.push(
              `squared corner (${target === 1 ? "Obsidian" : "Twilight"}) at x=${start}-${x}, y=${ys[start]}`,
            );
      }
    }
  }
  return findings;
}

const profile = await mkdtemp(join(tmpdir(), "ym-show-you-audit-"));
const chrome = spawn(
  CHROME,
  [
    "--headless=new",
    "--enable-unsafe-swiftshader",
    "--no-first-run",
    "--remote-debugging-port=0",
    `--user-data-dir=${profile}`,
    "about:blank",
  ],
  { stdio: ["ignore", "ignore", "pipe"] },
);
let failures = 0;
let client;
try {
  client = await connect(await waitForBrowserUrl(chrome));
  const { targetId } = await client.send("Target.createTarget", {
    url: "about:blank",
  });
  const { sessionId } = await client.send("Target.attachToTarget", {
    targetId,
    flatten: true,
  });
  const evaluate = async (expression) => {
    const result = await client.send(
      "Runtime.evaluate",
      { expression, returnByValue: true, awaitPromise: true },
      sessionId,
    );
    if (result.exceptionDetails)
      throw new Error(result.exceptionDetails.text ?? "Evaluation failed.");
    return result.result.value;
  };
  await client.send("Page.enable", {}, sessionId);
  for (const [width, height] of VIEWPORTS) {
    await client.send(
      "Emulation.setDeviceMetricsOverride",
      { width, height, deviceScaleFactor: 1, mobile: width < 768 },
      sessionId,
    );
    await client.send("Page.navigate", { url: `${ORIGIN}/` }, sessionId);
    for (let i = 0; i < 400; i++) {
      await sleep(50);
      const ready = await evaluate(
        `document.readyState === "complete" && !document.querySelector("[data-entry-animation]") && !!document.querySelector(${JSON.stringify(SECTION)})`,
      ).catch(() => false);
      if (ready) break;
    }
    await sleep(600);
    const section = await evaluate(
      `(() => { const b = document.querySelector(${JSON.stringify(SECTION)}).getBoundingClientRect(); return { top: b.top + scrollY, height: b.height }; })()`,
    );
    // Only the section's body and the blob caps stay visible.
    await evaluate(`(() => {
      const style = document.createElement("style");
      style.textContent = 'body * { visibility: hidden !important; } ${SECTION}, ${SECTION} [class*=cap], ${SECTION} [class*=cap] * { visibility: visible !important; }';
      document.head.append(style);
    })()`);
    const found = new Set();
    for (let step = 0; step <= 10; step++) {
      const progress = step / 10;
      const y = Math.round(
        section.top - height + progress * (section.height + height),
      );
      await evaluate(`window.scrollTo(0, ${y})`);
      await sleep(350);
      const { data } = await client.send(
        "Page.captureScreenshot",
        {},
        sessionId,
      );
      for (const finding of straightEdges(
        classify(Buffer.from(data, "base64")),
      ))
        found.add(`at ${Math.round(progress * 100)}% scroll: ${finding}`);
      const overflow = await evaluate(
        "document.documentElement.scrollWidth - innerWidth",
      );
      if (overflow > 0) found.add(`horizontal page overflow of ${overflow}px`);
    }
    if (found.size) {
      failures += found.size;
      console.error(`FAIL ${width}x${height}:`);
      for (const finding of [...found].slice(0, 8))
        console.error(`  ${finding}`);
    } else
      console.log(`PASS ${width}x${height}: no straight edges, no overflow`);
  }
} finally {
  client?.socket.close();
  chrome.kill();
  await new Promise((resolve) => chrome.once("exit", resolve));
  await rm(profile, { recursive: true, force: true });
}
if (failures) {
  console.error(
    `\nThe show-you blob has ${failures} straight-edge finding(s).`,
  );
  process.exitCode = 1;
}
