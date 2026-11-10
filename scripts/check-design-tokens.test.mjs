import test from "node:test";
import assert from "node:assert/strict";
import { scanSource, compareBaseline } from "./check-design-tokens.mjs";

const scan = (source) => scanSource("src/example.tsx", source);

test("allows named utilities and arbitrary selector variants", () => {
  assert.deepEqual(
    scan(
      'const x = <div className="bg-background text-body px-6 [&>svg]:size-4" />;',
    ),
    [],
  );
});
test("finds arbitrary values in helpers, variants, and templates", () => {
  const findings = scan(
    'const x = cn("hover:mt-[13px]", `[color:red] ${active ? "text-body" : "p-4"}`, "bg-(--custom)");',
  );
  assert.equal(
    findings.filter((f) => f.rule === "arbitrary-utility").length,
    3,
  );
});
test("finds raw colors and indirect inline styles", () => {
  assert.ok(
    scan('const fill = "#ff00ff";').some((f) => f.rule === "raw-color"),
  );
  assert.ok(
    scan("const x = <div style={sharedStyles} />;").some(
      (f) => f.rule === "inline-style",
    ),
  );
});
test("CSS exemptions apply only to central token definitions", () => {
  const source =
    "@theme { --color-brand: #123456; } :root { --space: 12px; } .card { padding: 17px; color: var(--color-brand); }";
  assert.equal(scanSource("src/app/globals.css", source).length, 1);
  assert.equal(scanSource("src/example.css", source).length, 3);
  assert.equal(
    scanSource("src/example.css", ".card { @apply mt-[13px]; }").length,
    1,
  );
});
test("baseline allows existing occurrences but rejects copies and changed values", () => {
  const [finding] = scan('const x = "mt-[13px]";');
  const key = JSON.stringify([finding.file, finding.rule, finding.value]);
  const baseline = { [key]: 1 };
  assert.equal(compareBaseline([{ ...finding, line: 99 }], baseline).length, 0);
  assert.equal(compareBaseline([finding, finding], baseline).length, 1);
  assert.equal(
    compareBaseline([{ ...finding, value: "mt-[14px]" }], baseline).length,
    1,
  );
  assert.equal(
    compareBaseline([{ ...finding, file: "src/new.tsx" }], baseline).length,
    1,
  );
});

test("type roles in @theme must match cn's TYPE_SIZE_TOKENS", async () => {
  const { compareTypeSizes } = await import("./check-design-tokens.mjs");
  const css =
    "@theme { --text-nav: 0.875rem; --text-nav--line-height: normal; --text-body: 1rem; } :root { --text-reveal-rise: 1.25rem; }";
  assert.deepEqual(
    compareTypeSizes(css, 'TYPE_SIZE_TOKENS = ["nav", "body"] as const;'),
    { missingFromCn: [], notInTheme: [] },
  );
  assert.deepEqual(
    compareTypeSizes(css, 'TYPE_SIZE_TOKENS = ["nav", "hero"] as const;'),
    { missingFromCn: ["body"], notInTheme: ["hero"] },
  );
});
