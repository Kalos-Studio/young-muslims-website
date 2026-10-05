import { execFileSync } from "node:child_process";
import { load } from "cheerio";

// Read-only, bounded public audit. No forms, logins, or transactional actions.
const seeds = [
  "https://ymsite.com/",
  "https://ymsite.com/about-young-muslims/",
  "https://ymsite.com/our-programs/neighbornets/",
  "https://ymsite.com/resources/",
  "https://ymsisters.com/",
  "https://ymsisters.com/who-we-are-2/",
  "https://ymsisters.com/leadership/",
  "https://ymsisters.com/for-parents/",
  "https://ymsisters.com/faq/",
  "https://ymsisters.com/locations/",
  "https://ymsisters.com/start-a-new-neighbornet/",
  "https://ymsisters.com/our-programs/",
  "https://ymsisters.com/donation-confirmation/",
  "https://giving.ymsite.com/page/YM2026",
];
const hosts = new Set(["ymsite.com", "ymsisters.com", "youngmuslims.com"]);
const supplied = process.argv.slice(2);
const targeted = supplied.length > 0;
const queue = targeted ? [...supplied] : [...seeds];
if (!targeted)
  for (const host of hosts)
    queue.push(
      `https://${host}/robots.txt`,
      `https://${host}/sitemap_index.xml`,
      `https://${host}/`,
    );
const results = [],
  discovered = new Map(),
  seen = new Set();
function discover(raw, source) {
  try {
    const u = new URL(raw, source);
    u.hash = "";
    if (!/^https?:$/.test(u.protocol)) return;
    const url = u.href;
    if (!discovered.has(url)) discovered.set(url, new Set());
    discovered.get(url).add(source);
    if (
      !targeted &&
      hosts.has(u.hostname.replace(/^www\./, "")) &&
      !u.search &&
      !/\/(wp-admin|wp-login|feed|cart|checkout|my-account)\b/i.test(
        u.pathname,
      ) &&
      !/\.(png|jpe?g|webp|svg|gif|mp4|mp3|css|js|woff2?)$/i.test(u.pathname)
    )
      queue.push(url);
  } catch {
    /* Ignore malformed links. */
  }
}
while (queue.length && results.length < 130) {
  const url = queue.shift();
  if (seen.has(url)) continue;
  seen.add(url);
  const file = /\.(pdf|docx?|xlsx?|pptx?|zip)(?:$|\?)/i.test(url);
  try {
    const out = execFileSync(
      "curl",
      [
        "-sS",
        "-L",
        "--max-redirs",
        "8",
        "--max-time",
        "12",
        ...(file ? ["-I"] : ["--max-filesize", "5000000"]),
        "-w",
        "\nAUDIT_META:%{http_code}\t%{url_effective}\t%{content_type}\t%{num_redirects}",
        url,
      ],
      { encoding: "utf8", maxBuffer: 6000000 },
    );
    const split = out.lastIndexOf("\nAUDIT_META:");
    const body = out.slice(0, split),
      [status, finalUrl, type, redirects] = out.slice(split + 12).split("\t");
    const row = {
      url,
      status: Number(status),
      finalUrl,
      type,
      redirects: Number(redirects),
      method: file ? "HEAD" : "GET",
    };
    if (!file && /html/i.test(type)) {
      const $ = load(body);
      row.title = $("title").first().text().trim();
      row.canonical = $("link[rel=canonical]").attr("href") || null;
      row.robots = $("meta[name=robots]").attr("content") || null;
      row.headings = $("h1,h2")
        .map((_, el) => $(el).text().trim())
        .get()
        .slice(0, 12);
      $("a[href]").each((_, el) => discover($(el).attr("href"), finalUrl));
    } else if (!file && /xml|text\/plain/i.test(type)) {
      if (url.endsWith("robots.txt"))
        for (const m of body.matchAll(/^Sitemap:\s*(\S+)/gim))
          discover(m[1], finalUrl);
      else {
        const $ = load(body, { xmlMode: true });
        const locations = $("url > loc, sitemap > loc");
        locations.each((_, el) => discover($(el).text(), finalUrl));
        row.entries = locations.length;
      }
    }
    results.push(row);
  } catch (e) {
    results.push({ url, error: String(e.message).slice(0, 300) });
  }
}
console.log(
  JSON.stringify(
    {
      checkedAt: new Date().toISOString(),
      limit: 130,
      remainingQueued: [...new Set(queue)].filter((u) => !seen.has(u)).length,
      results,
      discovered: [...discovered].map(([url, sources]) => ({
        url,
        sources: [...sources],
      })),
    },
    null,
    2,
  ),
);
