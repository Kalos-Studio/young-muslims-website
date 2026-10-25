import { spawn } from "node:child_process";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";

const ORIGIN = process.env.RESPONSIVE_AUDIT_ORIGIN ?? "http://localhost:3000";
const CHROME =
  process.env.CHROME_PATH ??
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";

function waitForBrowserUrl(process) {
  return new Promise((resolve, reject) => {
    let stderr = "";
    const timer = setTimeout(
      () => reject(new Error(`Chrome did not start. ${stderr.trim()}`)),
      10_000,
    );

    process.stderr.on("data", (chunk) => {
      stderr += chunk;
      const match = stderr.match(/DevTools listening on (ws:\/\/[^\s]+)/);
      if (!match) return;
      clearTimeout(timer);
      resolve(match[1]);
    });
    process.once("exit", (code) => {
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

async function evaluate(client, sessionId, expression) {
  const result = await client.send(
    "Runtime.evaluate",
    { expression, returnByValue: true, awaitPromise: true },
    sessionId,
  );
  if (result.exceptionDetails) {
    throw new Error(
      result.exceptionDetails.text ?? "Browser evaluation failed.",
    );
  }
  return result.result.value;
}

async function waitUntil(client, sessionId, expression) {
  const deadline = Date.now() + 30000;
  while (Date.now() < deadline) {
    if (await evaluate(client, sessionId, expression)) return;
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
  const diagnostic = await evaluate(
    client,
    sessionId,
    `({path:location.pathname,text:document.body.innerText.slice(0,1200),entry:!!document.querySelector('[data-entry-animation]')})`,
  );
  throw new Error(
    `Timed out waiting for ${expression}: ${JSON.stringify(diagnostic)}`,
  );
}

const profile = await mkdtemp(join(tmpdir(), "ym-footer-audit-"));
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
  await client.send("Page.enable", {}, sessionId);
  const routes = process.env.FOOTER_AUDIT_ROUTES?.split(",") ?? [
    "/stories",
    "/stories/rahmah-k",
    "/neighbornets",
    "/about",
    "/contact",
    "/blog",
    "/store",
    "/support",
    "/",
  ];
  for (const route of routes) {
    await client.send(
      "Emulation.setDeviceMetricsOverride",
      { width: 390, height: 844, deviceScaleFactor: 1, mobile: true },
      sessionId,
    );
    await client.send(
      "Page.navigate",
      { url: new URL(route, ORIGIN).href },
      sessionId,
    );
    await waitUntil(
      client,
      sessionId,
      `location.pathname === ${JSON.stringify(route)} && !!document.querySelector('footer[data-footer-phase]') && !document.querySelector('[data-entry-animation]')`,
    );
    await evaluate(
      client,
      sessionId,
      `window.scrollTo(0,document.documentElement.scrollHeight)`,
    );
    await waitUntil(
      client,
      sessionId,
      `document.querySelector('footer')?.dataset.footerReady === 'true'`,
    );
    for (const input of ["wheel", "touch", "keyboard"]) {
      await evaluate(
        client,
        sessionId,
        `(async () => {
        window.scrollTo(0, document.documentElement.scrollHeight - innerHeight - 100);
        await new Promise(resolve => setTimeout(resolve, 50));
        if (${JSON.stringify(input)} === 'wheel') {
          window.dispatchEvent(new WheelEvent('wheel', { deltaY: 120 }));
          window.scrollTo(0, document.documentElement.scrollHeight);
          window.dispatchEvent(new WheelEvent('wheel', { deltaY: 80 }));
        } else if (${JSON.stringify(input)} === 'touch') {
          const touch = y => new Touch({ identifier: 1, target: document.body, clientX: 150, clientY: y });
          window.dispatchEvent(new TouchEvent('touchstart', { touches: [touch(600)] }));
          window.scrollTo(0, document.documentElement.scrollHeight);
          window.dispatchEvent(new TouchEvent('touchmove', { touches: [touch(500)] }));
          window.dispatchEvent(new TouchEvent('touchend'));
        } else {
          window.scrollTo(0, document.documentElement.scrollHeight);
          window.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown' }));
        }
      })()`,
      );
      await waitUntil(
        client,
        sessionId,
        `document.querySelector('footer')?.dataset.footerPhase === 'flashing'`,
      );
      const revealed = await evaluate(
        client,
        sessionId,
        `getComputedStyle(document.querySelector('[data-site-page-stage]')).transform.includes('-200') && getComputedStyle(document.querySelector('[data-footer-stage]')).visibility === 'visible'`,
      );
      if (!revealed)
        throw new Error(`${route}: ${input} did not reveal the montage`);
      await waitUntil(
        client,
        sessionId,
        `document.querySelector('footer')?.dataset.footerPhase === 'idle'`,
      );
      await new Promise((resolve) => setTimeout(resolve, 400));
    }
    console.log(`PASS ${route}: wheel, touch, keyboard, return to idle`);
  }
  await client.send(
    "Emulation.setEmulatedMedia",
    { features: [{ name: "prefers-reduced-motion", value: "reduce" }] },
    sessionId,
  );
  await evaluate(
    client,
    sessionId,
    `window.dispatchEvent(new WheelEvent('wheel',{deltaY:200}))`,
  );
  await new Promise((resolve) => setTimeout(resolve, 100));
  if (
    await evaluate(
      client,
      sessionId,
      `document.querySelector('footer').dataset.footerPhase !== 'idle'`,
    )
  )
    throw new Error("Reduced motion did not suppress the montage");
  console.log("PASS reduced motion");
} finally {
  client?.socket.close();
  chrome.kill();
  await new Promise((resolve) => chrome.once("exit", resolve));
  await rm(profile, { recursive: true, force: true });
}
