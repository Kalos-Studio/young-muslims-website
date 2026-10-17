import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import ts from "typescript";
import postcss from "postcss";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const baselinePath = path.join(root, "scripts/design-token-baseline.json");
const rawColor =
  /#[\da-f]{3,8}\b|\b(?:rgb|rgba|hsl|hsla|oklch|oklab|lab|lch|color)\(/i;
const dimension =
  /(?:^|[^\w-])-?(?:\d*\.)?\d+(?:px|rem|em|vh|vw|svh|dvh|vmin|vmax|ms|s|deg)\b/i;

export function scanSource(file, source) {
  const findings = [];
  const add = (rule, value, line) => findings.push({ file, rule, value, line });
  if (file.endsWith(".css")) {
    const tree = postcss.parse(source, { from: file });
    tree.walkDecls((decl) => {
      // Only central custom-property definitions are exempt, never the whole file.
      if (
        file === "src/app/globals.css" &&
        decl.prop.startsWith("--") &&
        ((decl.parent.type === "atrule" && decl.parent.name === "theme") ||
          (decl.parent.type === "rule" && decl.parent.selector === ":root"))
      )
        return;
      if (
        decl.prop.startsWith("--") ||
        rawColor.test(decl.value) ||
        dimension.test(decl.value) ||
        (/^(font-family|font-size|font-weight|line-height|letter-spacing|border-radius|box-shadow|text-shadow|color|background-color|border-color|fill|stroke)$/.test(
          decl.prop,
        ) &&
          !/^(?:var\(|inherit$|initial$|unset$|revert$|none$|normal$|currentColor$|transparent$|0$)/i.test(
            decl.value,
          ))
      ) {
        add("css-value", `${decl.prop}: ${decl.value}`, decl.source.start.line);
      }
    });
    tree.walkAtRules("apply", (rule) =>
      checkClasses(rule.params, rule.source.start.line),
    );
  } else {
    const tree = ts.createSourceFile(
      file,
      source,
      ts.ScriptTarget.Latest,
      true,
      /\.[jt]sx$/.test(file) ? ts.ScriptKind.TSX : ts.ScriptKind.TS,
    );
    const visit = (node) => {
      const line =
        tree.getLineAndCharacterOfPosition(node.getStart(tree)).line + 1;
      // Catch literals in className, cn/clsx/cva calls, arrays, and shared constants.
      if (
        ts.isStringLiteral(node) ||
        ts.isNoSubstitutionTemplateLiteral(node) ||
        ts.isTemplateHead(node) ||
        ts.isTemplateMiddle(node) ||
        ts.isTemplateTail(node)
      ) {
        checkClasses(node.text, line);
        if (rawColor.test(node.text)) add("raw-color", node.text, line);
      }
      if (ts.isJsxAttribute(node) && node.name.getText(tree) === "style") {
        add("inline-style", node.getText(tree).replace(/\s+/g, " "), line);
      }
      ts.forEachChild(node, visit);
    };
    visit(tree);
  }
  function checkClasses(value, line) {
    for (const token of value.split(/\s+/)) {
      // Arbitrary selector variants like [&>svg]:size-4 are allowed.
      if (
        /(?:^|:)[!\w-]+-\[[^\]]*\]|(?:^|:)\[[\w-]+:[^\]]+\](?!:)|(?:^|:)[!\w-]+-\(--[^)]+\)/.test(
          token,
        )
      ) {
        add("arbitrary-utility", token, line);
      }
    }
  }
  return findings;
}

export function compareBaseline(findings, baseline) {
  const remaining = new Map(Object.entries(baseline));
  return findings.filter((finding) => {
    const key = JSON.stringify([finding.file, finding.rule, finding.value]);
    const count = remaining.get(key) ?? 0;
    remaining.set(key, Math.max(0, count - 1));
    return count === 0;
  });
}

function main() {
  const findings = [];
  function walk(dir) {
    for (const entry of fs.readdirSync(path.join(root, dir), {
      withFileTypes: true,
    })) {
      const file = `${dir}/${entry.name}`;
      if (entry.isDirectory()) walk(file);
      // Generated upstream component; matches the existing ESLint exclusion.
      else if (
        /\.(?:[jt]sx?|css)$/.test(file) &&
        file !== "src/components/ui/map.tsx"
      ) {
        findings.push(
          ...scanSource(file, fs.readFileSync(path.join(root, file), "utf8")),
        );
      }
    }
  }
  walk("src");
  if (process.argv.includes("--write-baseline")) {
    if (process.env.CI)
      throw new Error("Baseline generation is disabled in CI.");
    const baseline = {};
    for (const finding of findings) {
      const key = JSON.stringify([finding.file, finding.rule, finding.value]);
      baseline[key] = (baseline[key] ?? 0) + 1;
    }
    fs.writeFileSync(baselinePath, JSON.stringify(baseline, null, 2) + "\n");
    console.log(
      `Recorded ${findings.length} existing violations. Review baseline changes before committing.`,
    );
    return;
  }
  const failures = compareBaseline(
    findings,
    JSON.parse(fs.readFileSync(baselinePath, "utf8")),
  );
  for (const finding of failures) {
    console.error(
      `${finding.file}:${finding.line} [${finding.rule}] ${finding.value}`,
    );
  }
  if (failures.length) {
    console.error(
      `\n${failures.length} new token violations. Reuse a theme token or define and document one centrally. See scripts/design-tokens.md.`,
    );
    process.exitCode = 1;
  } else
    console.log(
      `Design tokens passed (${findings.length} existing violations covered by the baseline).`,
    );
}

if (
  process.argv[1] &&
  path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)
)
  main();
