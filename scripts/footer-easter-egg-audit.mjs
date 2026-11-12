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
    this.listeners = [];
    socket.addEventListener("message", (event) => {
      const message = JSON.parse(event.data);
      if (!message.id) {
        for (const listener of this.listeners) listener(message);
        return;
      }
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

async function waitUntil(client, sessionId, expression, timeout = 30000) {
  const deadline = Date.now() + timeout;
  while (Date.now() < deadline) {
    if (await evaluate(client, sessionId, expression)) return;
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
  const diagnostic = await evaluate(client, sessionId, PAGE_STATE);
  throw new Error(
    `Timed out waiting for ${expression}: ${JSON.stringify(diagnostic)}`,
  );
}

/*
 * Diagnostics only (the checks themselves are unchanged): on any failure the
 * audit prints the step it was on, how long it had been running, the page's
 * state (below) and what the browser reported (exceptions, console errors,
 * failed and still-pending requests), so an intermittent failure says why.
 */
const PAGE_STATE = `(() => {
  const footer = document.querySelector('footer');
  const stage = document.querySelector('[data-site-page-stage]');
  const footerStage = document.querySelector('[data-footer-stage]');
  const images = [...document.querySelectorAll('footer img, [data-footer-stage] img')];
  return {
    path: location.pathname,
    readyState: document.readyState,
    entryAnimation: !!document.querySelector('[data-entry-animation]'),
    footer: footer ? { ...footer.dataset } : null,
    stageTransform: stage ? getComputedStyle(stage).transform : null,
    footerStageVisibility: footerStage ? getComputedStyle(footerStage).visibility : null,
    scroll: { y: Math.round(scrollY), max: document.documentElement.scrollHeight - innerHeight },
    footerImages: { total: images.length, complete: images.filter(i => i.complete && i.naturalWidth > 0).length, pending: images.filter(i => !(i.complete && i.naturalWidth > 0)).map(i => (i.currentSrc || i.src).slice(-80)).slice(0, 8) },
    sinceNavigation: Math.round(performance.now()),
    text: document.body.innerText.slice(0, 300),
  };
})()`;
const started = Date.now();
const step = { route: null, input: null, phase: "startup" };
const browserLog = [];
const pendingRequests = new Map();
function record(message) {
  const { method, params } = message;
  if (method === "Runtime.exceptionThrown") {
    browserLog.push(
      `exception: ${params.exceptionDetails?.exception?.description ?? params.exceptionDetails?.text}`,
    );
  } else if (
    method === "Runtime.consoleAPICalled" &&
    ["error", "warning"].includes(params.type)
  ) {
    browserLog.push(
      `console.${params.type}: ${params.args.map((arg) => arg.value ?? arg.description).join(" ")}`,
    );
  } else if (
    method === "Log.entryAdded" &&
    ["error", "warning"].includes(params.entry.level)
  ) {
    browserLog.push(
      `log.${params.entry.level}: ${params.entry.text} ${params.entry.url ?? ""}`,
    );
  } else if (method === "Network.requestWillBeSent") {
    pendingRequests.set(params.requestId, {
      url: params.request.url,
      at: Date.now(),
    });
  } else if (method === "Network.loadingFinished") {
    pendingRequests.delete(params.requestId);
  } else if (method === "Network.loadingFailed") {
    const request = pendingRequests.get(params.requestId);
    pendingRequests.delete(params.requestId);
    if (!params.canceled)
      browserLog.push(
        `request failed: ${params.errorText} ${request?.url ?? ""}`,
      );
  }
  if (browserLog.length > 40) browserLog.splice(0, browserLog.length - 40);
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
let failureState;
try {
  client = await connect(await waitForBrowserUrl(chrome));
  client.listeners.push(record);
  const { targetId } = await client.send("Target.createTarget", {
    url: "about:blank",
  });
  const { sessionId } = await client.send("Target.attachToTarget", {
    targetId,
    flatten: true,
  });
  await client.send("Page.enable", {}, sessionId);
  for (const domain of ["Runtime", "Log", "Network"]) {
    await client.send(`${domain}.enable`, {}, sessionId);
  }
  failureState = () => evaluate(client, sessionId, PAGE_STATE);
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
    Object.assign(step, { route, input: null, phase: "load" });
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
    step.phase = "wait for footer ready";
    await waitUntil(
      client,
      sessionId,
      `document.querySelector('footer')?.dataset.footerReady === 'true'`,
    );
    for (const input of ["wheel", "touch", "keyboard"]) {
      Object.assign(step, { input, phase: "trigger" });
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
      step.phase = "wait for flashing";
      await waitUntil(
        client,
        sessionId,
        `document.querySelector('footer')?.dataset.footerPhase === 'flashing'`,
      );
      step.phase = "wait for montage reveal";
      // The page stage shifts up as the flash starts: wait for it to settle
      // at -200 rather than reading it the instant the phase flips (which
      // raced the shift and failed now and then). Bounded, so a montage that
      // never reveals still fails, with the stage's state in the message.
      try {
        await waitUntil(
          client,
          sessionId,
          `getComputedStyle(document.querySelector('[data-site-page-stage]')).transform.includes('-200') && getComputedStyle(document.querySelector('[data-footer-stage]')).visibility === 'visible'`,
          3000,
        );
      } catch {
        const state = await evaluate(
          client,
          sessionId,
          `({stage:getComputedStyle(document.querySelector('[data-site-page-stage]')).transform,footer:getComputedStyle(document.querySelector('[data-footer-stage]')).visibility,phase:document.querySelector('footer')?.dataset.footerPhase})`,
        );
        throw new Error(
          `${route}: ${input} did not reveal the montage: ${JSON.stringify(state)}`,
        );
      }
      step.phase = "wait for idle";
      await waitUntil(
        client,
        sessionId,
        `document.querySelector('footer')?.dataset.footerPhase === 'idle'`,
      );
      await new Promise((resolve) => setTimeout(resolve, 400));
    }
    console.log(`PASS ${route}: wheel, touch, keyboard, return to idle`);
  }
  Object.assign(step, { route: null, input: null, phase: "reduced motion" });
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
} catch (error) {
  // Report why, then fail as before.
  let state = null;
  try {
    state = await failureState?.();
  } catch (stateError) {
    state = `unavailable: ${stateError.message}`;
  }
  const now = Date.now();
  console.error(
    [
      `FAIL ${step.route ?? ""} ${step.input ?? ""} at "${step.phase}" after ${now - started}ms`,
      `error: ${error.stack ?? error}`,
      `origin: ${ORIGIN}`,
      `page state: ${JSON.stringify(state, null, 2)}`,
      `still-pending requests: ${JSON.stringify([...pendingRequests.values()].map((request) => `${now - request.at}ms ${request.url.slice(-100)}`).slice(0, 10))}`,
      `browser log (latest last):\n  ${browserLog.join("\n  ") || "(none)"}`,
    ].join("\n"),
  );
  process.exitCode = 1;
} finally {
  client?.socket.close();
  chrome.kill();
  await new Promise((resolve) => chrome.once("exit", resolve));
  // Deleting the temporary profile can race Chrome's helper processes,
  // still writing into it after the main process exits (ENOTEMPTY): that is
  // a cleanup failure after the checks, not a footer failure. Report it as
  // such (still failing the run, as before).
  try {
    await rm(profile, { recursive: true, force: true });
  } catch (error) {
    console.error(
      `CLEANUP FAIL ${process.exitCode ? "(after a failed check)" : "(all checks passed)"}: could not delete the temporary Chrome profile ${profile}: ${error.code ?? ""} ${error.message}`,
    );
    process.exitCode = 1;
  }
}
