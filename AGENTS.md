<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Read WIREFRAME.md first

The site is currently a black-and-white wireframe prototype. `WIREFRAME.md` says
which code is real and which is scaffolding, how the sticky notes and the
Agentation feedback toolbar work, and how to remove the wireframe when the time
comes. Read it before changing anything under `src/`.

`grep -rn "WIREFRAME:" src` is the complete inventory of temporary code.
