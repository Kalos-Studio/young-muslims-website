---
name: research
description: Investigate a question against high-trust primary sources and capture the findings as a Markdown file in the repo. Use when the user wants a topic researched, docs or API facts gathered, or reading legwork delegated to a background agent.
---

## Young Muslims project requirements

Before doing any work in this repository:

1. Read `AGENTS.md`, `CLAUDE.md`, `WIREFRAME.md`, and `DESIGN-SYSTEM.md` in full. Treat them as required context for analysis, design, review, research, writing, and implementation, and respect the current wireframe-versus-production boundary they define.
2. For every Next.js question or change, locate the installed `next` package and read the relevant guide under `node_modules/next/dist/docs/` before drawing conclusions or writing code. These bundled docs are the framework authority for this repository and override remembered conventions or external guides when they differ.
3. Run `git status --short` before editing. Preserve all unrelated dirty-worktree changes: do not reset, restore, overwrite, stage, reformat, or otherwise absorb them into the task.
4. Never commit or push unless the user explicitly requests that action in the current task.

For reviews and validation:

- Review user-facing changes for fidelity to the approved Figma source and its `DESIGN-SYSTEM.md` translation; accessibility, including semantics, keyboard use, focus, contrast, and appropriate ARIA; responsive behavior at the currently supported widths without inventing undesigned mobile behavior; reduced-motion behavior; and asset provenance, licensing, source, and approved usage.
- Do not perform browser-based or screenshot-based visual comparison unless the user explicitly requests it. Functional browser testing remains available when it is the right non-visual verification tool.
- Choose checks in proportion to change risk. Run `bun run format:check` for edited repository files, `bun run lint` for source changes, `bun run typecheck` for TypeScript, JavaScript, Next.js, configuration, or type-surface changes, and `bun run build` when routing, rendering, assets, dependencies, build configuration, or other production behavior could change. Run all four for broad or high-risk application changes. If an applicable check cannot run or is intentionally skipped, state why and report any failure without modifying unrelated code to make it pass.

Spin up a **background agent** to do the research, so you keep working while it reads.

Its job:

1. Investigate the question against **primary sources** (official docs, source code, specs, first-party APIs), not a secondary write-up of them. Follow every claim back to the source that owns it.
2. Write the findings to a single Markdown file, citing each claim's source.
3. Save it where the repo already keeps such notes; match the existing convention, and if there is none, put it somewhere sensible and say where.
