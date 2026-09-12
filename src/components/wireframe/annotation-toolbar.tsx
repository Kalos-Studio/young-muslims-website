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

const Agentation = dynamic(
  () => import("agentation").then((mod) => mod.Agentation),
  { ssr: false },
);

export function AnnotationToolbar() {
  if (!AGENTATION_ENABLED) return null;

  return <Agentation />;
}
