import { spawn } from "node:child_process";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";

const ORIGIN = process.env.RESPONSIVE_AUDIT_ORIGIN ?? "http://127.0.0.1:3000";
const CHROME =
  process.env.CHROME_PATH ??
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";

const routes = [
  "/",
  "/about",
  "/stories",
  "/support",
  "/store",
  "/blog",
  "/neighbornets",
];

const viewports = [
  { width: 360, height: 800 },
  { width: 768, height: 900 },
  { width: 1024, height: 900 },
  { width: 1280, height: 900 },
  { width: 1440, height: 1000 },
  { width: 1920, height: 1080 },
  { width: 2560, height: 1440 },
  { width: 3840, height: 1600 },
];

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

async function waitForReady(
  client,
  sessionId,
  expectedPathname,
  expectedSearch,
) {
  const deadline = Date.now() + 10_000;
  while (Date.now() < deadline) {
    const ready = await evaluate(
      client,
      sessionId,
      `({ readyState: document.readyState, pathname: location.pathname, search: location.search })`,
    );
    if (
      ready.pathname === expectedPathname &&
      ready.search === expectedSearch &&
      (ready.readyState === "interactive" || ready.readyState === "complete")
    ) {
      return;
    }
    await new Promise((resolve) => setTimeout(resolve, 50));
  }
  throw new Error(`Page did not finish loading ${expectedPathname}.`);
}

const profile = await mkdtemp(join(tmpdir(), "ym-responsive-audit-"));
const chrome = spawn(
  CHROME,
  [
    "--headless=new",
    "--disable-gpu",
    "--hide-scrollbars",
    "--no-first-run",
    "--no-default-browser-check",
    "--remote-debugging-port=0",
    `--user-data-dir=${profile}`,
    "about:blank",
  ],
  { stdio: ["ignore", "ignore", "pipe"] },
);

try {
  const client = await connect(await waitForBrowserUrl(chrome));
  const { targetId } = await client.send("Target.createTarget", {
    url: "about:blank",
  });
  const { sessionId } = await client.send("Target.attachToTarget", {
    targetId,
    flatten: true,
  });
  await client.send("Page.enable", {}, sessionId);
  await client.send("Runtime.enable", {}, sessionId);

  const failures = [];

  for (const route of routes) {
    for (const viewport of viewports) {
      await client.send(
        "Emulation.setDeviceMetricsOverride",
        { ...viewport, deviceScaleFactor: 1, mobile: false },
        sessionId,
      );
      const pageUrl = new URL(route, ORIGIN);
      pageUrl.searchParams.set("__responsiveAudit", String(viewport.width));
      await client.send("Page.navigate", { url: pageUrl.href }, sessionId);
      await waitForReady(client, sessionId, route, pageUrl.search);

      const result = await evaluate(
        client,
        sessionId,
        `(() => {
          const visible = (element) => {
            const style = getComputedStyle(element);
            const rect = element.getBoundingClientRect();
            return style.display !== "none" && style.visibility !== "hidden" && rect.width > 0 && rect.height > 0;
          };
          const controls = [...document.querySelectorAll("a, button, input, select, textarea")]
            .filter(visible)
            .map((element) => {
              const rect = element.getBoundingClientRect();
              return {
                label: (element.getAttribute("aria-label") || element.textContent || element.tagName)
                  .trim()
                  .replace(/\\s+/g, " ")
                  .slice(0, 64),
                left: Math.round(rect.left),
                right: Math.round(rect.right),
              };
            })
            .filter(({ left, right }) => left < -1 || right > innerWidth + 1);

          const headerRect = document
            .querySelector("[data-site-header-inner]")
            ?.getBoundingClientRect();
          const footerWaveRect = document
            .querySelector("footer > [aria-hidden='true'] svg")
            ?.getBoundingClientRect();
          const wideStageHeadings = [
            "But it's easier to just show you.",
            "Word on the street.",
            "Seeking the pleasure of Allah (SWT) by empowering Muslim youth.",
          ];
          const wideStages = location.pathname === "/" && innerWidth >= 1920
            ? wideStageHeadings.map((headingText) => {
                const heading = [...document.querySelectorAll("h2")].find(
                  (element) => element.textContent?.trim() === headingText,
                );
                const section = heading?.closest("section");
                let stage = heading?.parentElement ?? null;
                while (stage?.parentElement && stage.parentElement !== section) {
                  stage = stage.parentElement;
                }
                const rect = stage?.getBoundingClientRect();
                let contentLeft = 0;
                let contentRight = 0;
                let contentCenter = 0;
                if (headingText === "Word on the street.") {
                  const articles = stage?.lastElementChild?.getBoundingClientRect();
                  contentLeft = articles ? Math.round(articles.left) : 0;
                  contentRight = articles ? Math.round(articles.right) : 0;
                } else if (
                  headingText ===
                  "Seeking the pleasure of Allah (SWT) by empowering Muslim youth."
                ) {
                  const headingRect = heading?.getBoundingClientRect();
                  const controls = stage?.querySelector("div.flex")?.getBoundingClientRect();
                  contentLeft = headingRect ? Math.round(headingRect.left) : 0;
                  contentRight = controls ? Math.round(controls.right) : 0;
                } else {
                  const media = stage
                    ?.querySelector('img[alt="Young Muslims gathered together"]')
                    ?.parentElement?.getBoundingClientRect();
                  contentCenter = media
                    ? Math.round(media.left + media.width / 2)
                    : 0;
                }
                return {
                  heading: headingText,
                  width: rect ? Math.round(rect.width) : 0,
                  left: rect ? Math.round(rect.left) : 0,
                  right: rect ? Math.round(rect.right) : 0,
                  contentLeft,
                  contentRight,
                  contentCenter,
                };
              })
            : [];
          return {
            innerWidth,
            scrollWidth: document.documentElement.scrollWidth,
            controls,
            sharedShell: {
              header: headerRect
                ? {
                    width: Math.round(headerRect.width),
                    left: Math.round(headerRect.left),
                    right: Math.round(headerRect.right),
                  }
                : null,
              footerWave: footerWaveRect
                ? {
                    width: Math.round(footerWaveRect.width),
                    left: Math.round(footerWaveRect.left),
                    right: Math.round(footerWaveRect.right),
                  }
                : null,
            },
            wideStages,
          };
        })()`,
      );

      if (result.scrollWidth > result.innerWidth + 1) {
        failures.push(
          `${route} at ${viewport.width}px scrolls horizontally (${result.scrollWidth}px document width).`,
        );
      }
      for (const control of result.controls) {
        failures.push(
          `${route} at ${viewport.width}px clips “${control.label}” (${control.left}px to ${control.right}px).`,
        );
      }
      const expectedHeaderWidth = Math.min(result.innerWidth, 1440);
      const expectedHeaderLeft = Math.round(
        (result.innerWidth - expectedHeaderWidth) / 2,
      );
      if (
        !result.sharedShell.header ||
        Math.abs(result.sharedShell.header.width - expectedHeaderWidth) > 1 ||
        Math.abs(result.sharedShell.header.left - expectedHeaderLeft) > 1
      ) {
        failures.push(
          `${route} at ${viewport.width}px does not keep the shared header centered within its 1440px content bound.`,
        );
      }
      if (
        !result.sharedShell.footerWave ||
        result.sharedShell.footerWave.width < result.innerWidth - 1 ||
        result.sharedShell.footerWave.left > 1 ||
        result.sharedShell.footerWave.right < result.innerWidth - 1
      ) {
        const wave = result.sharedShell.footerWave;
        failures.push(
          wave
            ? `${route} at ${viewport.width}px keeps the footer wave inside a ${wave.width}px fixed surface (${wave.left}px to ${wave.right}px).`
            : `${route} at ${viewport.width}px is missing the shared footer wave.`,
        );
      }
      for (const stage of result.wideStages) {
        if (
          stage.width < result.innerWidth - 1 ||
          stage.left > 1 ||
          stage.right < result.innerWidth - 1
        ) {
          failures.push(
            `${route} at ${viewport.width}px keeps “${stage.heading}” inside a ${stage.width}px fixed stage (${stage.left}px to ${stage.right}px) instead of a viewport-wide responsive stage.`,
          );
        }
        if (
          stage.heading === "Word on the street." ||
          stage.heading ===
            "Seeking the pleasure of Allah (SWT) by empowering Muslim youth."
        ) {
          if (
            stage.contentLeft > 81 ||
            stage.contentRight < result.innerWidth - 81
          ) {
            failures.push(
              `${route} at ${viewport.width}px does not distribute “${stage.heading}” across the approved 80px wide-screen inset (${stage.contentLeft}px to ${stage.contentRight}px).`,
            );
          }
        } else if (Math.abs(stage.contentCenter - result.innerWidth / 2) > 1) {
          failures.push(
            `${route} at ${viewport.width}px leaves the highlight media off-center (${stage.contentCenter}px instead of ${result.innerWidth / 2}px).`,
          );
        }
      }
    }
  }

  if (failures.length) {
    console.error(`Responsive audit failed with ${failures.length} issue(s):`);
    failures.forEach((failure) => console.error(`- ${failure}`));
    process.exitCode = 1;
  } else {
    console.log(
      `Responsive audit passed for ${routes.length} routes across ${viewports.length} viewport sizes.`,
    );
  }
} finally {
  if (chrome.exitCode === null) {
    const exited = new Promise((resolve) => chrome.once("close", resolve));
    chrome.kill("SIGTERM");
    const result = await Promise.race([
      exited.then(() => "exited"),
      new Promise((resolve) => setTimeout(() => resolve("timeout"), 2_000)),
    ]);
    if (result === "timeout" && chrome.exitCode === null) {
      chrome.kill("SIGKILL");
      await exited;
    }
  }
  await rm(profile, {
    recursive: true,
    force: true,
    maxRetries: 5,
    retryDelay: 100,
  });
}
