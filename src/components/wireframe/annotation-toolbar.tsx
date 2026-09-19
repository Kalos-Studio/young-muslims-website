"use client";

import dynamic from "next/dynamic";

/**
 * WIREFRAME: mounts Agentation, the feedback toolbar.
 *
 * Click any element on the page, type a comment, and Agentation produces
 * markdown carrying the element's selector, path, classes and position. That
 * markdown pastes straight into Claude Code, which is the whole point: review
 * notes arrive as something actionable rather than "the thing under the video
 * is too big".
 *
 * NEXT_PUBLIC_ENABLE_AGENTATION gates it. netlify.toml sets that for deploy
 * previews and branch deploys and leaves it unset for production, and Next
 * inlines NEXT_PUBLIC_* at build time, so the check below folds to a constant
 * per deploy.
 *
 * `ssr: false` is required — Agentation renders through a portal to
 * document.body and has no server rendering — and `ssr: false` is only allowed
 * inside a Client Component, which is why this wrapper exists at all.
 *
 * Worth being precise about what the gate buys: next/dynamic puts the library
 * in its own ~413KB chunk, and returning null before that lazy component
 * renders means no browser ever requests it while the flag is off. The chunk is
 * still *written* into the build output either way — a bundler cannot drop a
 * dynamic import sitting behind a runtime check — so this costs deploy size and
 * nothing else. Removing the dependency, not a build trick, is the real fix.
 *
 * Removal: delete this file, drop the <AnnotationToolbar /> from the layout,
 * `bun remove agentation`, and delete the netlify.toml context blocks.
 */

const AGENTATION_ENABLED = process.env.NEXT_PUBLIC_ENABLE_AGENTATION === "true";

/**
 * Where annotations sync to. With no endpoint, Agentation keeps them in the
 * annotator's own `localStorage` and the only way to hand them over is the
 * toolbar's Copy button. Pointed at a running `agentation-mcp server`, they
 * also land somewhere Claude Code can read directly through MCP, which removes
 * the copy-paste step.
 *
 * Defaulted on in local dev because it degrades well: if nothing is listening,
 * Agentation catches the failure, logs one console warning, and carries on
 * against localStorage. Better still, it backfills — annotations made while the
 * server was down sync as soon as a session is established, so notes taken
 * before the server was started are not lost.
 *
 * Left unset everywhere else, including Netlify previews: a reviewer opening a
 * preview URL has no server of their own, so pointing their browser at
 * localhost would only produce warnings. There, Copy is the handoff.
 *
 * Set NEXT_PUBLIC_AGENTATION_ENDPOINT to override, or to "" to force local-only.
 */
const AGENTATION_ENDPOINT =
  process.env.NEXT_PUBLIC_AGENTATION_ENDPOINT ??
  (process.env.NODE_ENV === "development"
    ? "http://localhost:4747"
    : undefined);

const Agentation = dynamic(
  () => import("agentation").then((mod) => mod.Agentation),
  { ssr: false },
);

export function AnnotationToolbar() {
  if (!AGENTATION_ENABLED) return null;

  return <Agentation endpoint={AGENTATION_ENDPOINT || undefined} />;
}
