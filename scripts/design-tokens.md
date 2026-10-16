# Design token checks

Run `bun run lint:tokens` while building and before opening a pull request.
GitHub Actions runs the same command on every push, pull request, and merge
queue group. The required status check is named **Design tokens**. This is a
standalone checker; it does not yet provide ESLint editor diagnostics.

The checker parses JS/TS/JSX/TSX with TypeScript and CSS with PostCSS. It flags:

- Arbitrary Tailwind values/properties, including responsive and state variants,
  in string literals and template parts (including class helpers).
- Raw hex and CSS color-function strings in source code.
- JSX `style` attributes, including references to externally defined objects.
- CSS literal dimensions, raw colors, common visual declarations, local custom
  properties, and arbitrary values in `@apply`.

Use named Tailwind utilities. New approved tokens belong in `@theme` or
`:root` custom-property definitions in `src/app/globals.css`, and must be
explained in `DESIGN-SYSTEM.md`. Ordinary CSS rules in globals.css are checked.
Arbitrary selector variants such as `[&>svg]:size-4` are permitted.
The vendored `src/components/ui/map.tsx` is excluded, matching ESLint.

## Existing debt

`design-token-baseline.json` records existing violations by file, rule, exact
value, and occurrence count. Line shifts do not invalidate it. New values,
new files, and additional copies fail. Removed violations do not fail CI.
The baseline is temporary debt, not an approved palette.

After cleanup, run `node scripts/check-design-tokens.mjs --write-baseline`
and review the diff: it should remove resolved entries. Do not regenerate the
baseline merely to make new violations pass. Generation is disabled in CI.
Baseline changes need code review; the workflow cannot stop someone changing
its own policy or baseline in a pull request.

## Limits and exceptions

This is a static guardrail, not proof of complete design-system compliance.
It does not validate every named utility against the theme, interpret dynamically
constructed class names, evaluate JavaScript objects passed to animation/map
APIs, or verify token documentation automatically. Do not construct classes
dynamically to evade the check. New runtime inline styles will fail and need
review; prefer narrowly scoped checker exceptions with tests and a documented
reason over disabling a whole file. Current runtime styles are baselined.

To require this check, push the workflow, let it run once, then configure the
protected branch in GitHub Settings → Branches → branch protection rules.
Enable required status checks and choose **Design tokens**.
