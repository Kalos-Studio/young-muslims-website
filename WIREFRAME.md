# The wireframe prototype

This branch is a clickable, black-and-white wireframe of the whole site. It
exists to get the information architecture in front of the client before anyone
argues about colour or copy, and it is also the foundation the real site gets
built on, one page at a time.

**If you are an agent working in this repo, read this file before you touch
anything under `src/`.** It tells you which code is real and which is
scaffolding, so you replace the right things.

## The two rules

1. **Everything disposable is isolated and marked.** Disposable components live
   in `src/components/wireframe/`. Every integration point outside that folder
   carries a `WIREFRAME:` comment. `grep -rn "WIREFRAME:" src` is the complete
   inventory — there is nothing temporary that this grep does not find.
2. **Nothing permanent depends on anything disposable.**
   `src/components/site/` imports nothing from `src/components/wireframe/`, and
   it must stay that way. Deleting the wireframe folder must never break the
   shell. Check with:

   ```bash
   grep -rn "wireframe" src/components/site/   # must return nothing
   ```

## What is real and what is not

| Real, keep it                                | Scaffolding, replace it                  |
| -------------------------------------------- | ---------------------------------------- |
| Routes and folder structure under `src/app/` | The body of each `page.tsx`              |
| `src/components/site/nav-links.ts` — the IA  | Grey boxes (`<Frame>`)                   |
| `SiteHeader`, `SideNav`, `SiteFooter`        | Yellow sticky notes and the notes toggle |
| Page `metadata` exports                      | The Agentation feedback toolbar          |
| The NeighborNets map and its data            | The map's wireframe settings override    |

The logo in the header and footer is the real asset, not a placeholder box, on
purpose: a grey rectangle there would make the permanent shell depend on a
disposable component, and removing the wireframe would then mean rebuilding the
header. `src/components/site/logo.tsx` inlines the SVG with `fill="currentColor"`
so the mark takes the colour of whatever it sits in.

## Information architecture

`src/components/site/nav-links.ts` is the single source of truth. The header and
the drawer both render from it, so adding a page means adding it there once. The
footer carries no link index — it is the mark, the credit and the legal line.

| Route           | In nav as   | Holds                                                                                                       |
| --------------- | ----------- | ----------------------------------------------------------------------------------------------------------- |
| `/`             | Wordmark    | Hero over a background video loop, tagline, highlight reel                                                  |
| `/about`        | Header      | Rotating images of people beside what YM is and how friendships turn into service, relief work and advocacy |
| `/stories`      | Header      | A scattered field of portraits; clicking one scroll-stops into that person's full story                     |
| `/support`      | Header      | Hero, mission, full-bleed image beside the donation widget, a story block, recent supporters                |
| `/neighbornets` | Header CTA  | The interactive map of brothers' and sisters' circles                                                       |
| `/store`        | Drawer only | A split screen out to the brothers' and sisters' stores                                                     |
| `/blog`         | Drawer only | Featured post carousel, then a grid of post cards                                                           |

Every route in the table is wireframed, so the whole prototype is clickable
end to end — a prototype where half the links 404 tests nothing.

## Building a real page

1. Open that route's `page.tsx`.
2. Replace the `<PageFrame>` body with real components.
3. Delete the `WIREFRAME:` comment at the top of the file.
4. Leave the route, the `metadata`, and the nav entry alone — they are already
   correct.

Keep using `src/components/site/` for anything the whole site shares. Put
page-specific components next to the page, the way `src/app/neighbornets/`
already does.

## The two annotation layers

They do different jobs and both work on Netlify deploy previews.

### Sticky notes — "here's why I did it this way"

Omar's design rationale, authored into the page next to the block it explains,
mirroring the notes in the Figma file. Add one by passing `note` to
`<Annotate>`:

```tsx
<Annotate note="background video clips of people having fun">
  <Frame variant="fill" label="Background video loop" />
</Annotate>
```

Notes are absolutely positioned over the top-right of the section they annotate,
so they take up no space and the page reads at the width it will really be. An
earlier version gave them a fixed rail down the right-hand side, which narrowed
every section to make room for commentary — the wireframe was showing a layout
that was never going to exist. They behave like sticky notes on a Figma artboard
now: on top, `pointer-events-none`, and turning them off changes nothing
underneath.

`<Annotate>` also carries the shared content width, so pass `bleed` for a
full-width section — the landing hero, the store's split screen. Width lives
here rather than in `<PageFrame>`, which is why a contained section and a
full-page hero can sit on the same page.

### Agentation — "here's what to change"

[Agentation](https://github.com/benjitaylor/agentation) puts a feedback toolbar
in the bottom-right corner. Click any element, type a comment, and it produces
markdown carrying that element's selector, path, classes and position. Paste
that into Claude Code and the feedback is immediately actionable.

**The review loop:** open the preview URL → annotate → Copy → paste to Claude.

#### Letting Claude read the notes directly, over MCP

Annotating locally, Claude Code can pull your notes itself instead of you
pasting them. Two halves have to line up, and **both** are required:

1. **The page has to sync somewhere.** `<AnnotationToolbar>` points at
   `http://localhost:4747` in dev by default, so this half is already done.
2. **That server has to exist, and Claude has to know about it.** One-time, on
   your machine:

   ```bash
   claude mcp add agentation -- npx agentation-mcp server
   ```

   Then restart Claude Code so it picks the server up. Verify with
   `claude mcp list` — you want an `agentation` row, and
   `curl -s -o /dev/null -w "%{http_code}" http://localhost:4747/sessions` to
   answer rather than hang.

With both in place, ask Claude for the pending annotations and it reads them
through the MCP tools (`agentation_get_all_pending` and friends), replies on
threads, and marks them resolved.

Nothing is lost if you annotate before starting the server: Agentation catches
the failed connection, warns once in the console, keeps writing to
`localStorage`, and **backfills the unsynced annotations** as soon as a session
is established.

**On deploy previews it stays copy-paste**, and that is deliberate. A reviewer
opening a preview URL has no server of their own, so `NEXT_PUBLIC_AGENTATION_ENDPOINT`
is left unset there and annotations live in that reviewer's browser
(`localStorage`, keyed by pathname, surviving reload). They click Copy and send
you the markdown. Shared sessions across people would need a server we host —
Agentation supports it via `endpoint`/`sessionId` and `webhookUrl`, but it is
not worth standing up unless client review gets heavy.

### How both reach the Netlify previews

`NEXT_PUBLIC_SHOW_NOTES` and `NEXT_PUBLIC_ENABLE_AGENTATION` gate them. Both are
on in local dev, and `netlify.toml` turns them on for the `deploy-preview` and
`branch-deploy` contexts while deliberately leaving them unset for production.
`NEXT_PUBLIC_*` values are inlined at build time and every Netlify context is its
own build, so the gate is decided once per deploy rather than at runtime.

What that does and does not guarantee, precisely:

- **Note text does not ship to production.** Verified: build without the flags
  and `grep "background video clips" .next/server/app/index.html` finds nothing.
  This only holds because `<Annotate>` is a server component. If you ever make
  it a client component again, every note's text lands back in the RSC payload
  even on builds where the notes do not render — a client component's props are
  serialised regardless of what it decides to render.
- **The Agentation chunk is emitted but never requested.** `next/dynamic` puts
  it in its own ~413KB chunk, which is written into the build output either way
  because the bundler cannot drop a dynamic import behind a runtime check. It is
  not part of the initial bundle and no browser fetches it while the flag is
  off, so it costs deploy size and nothing else. If that ever matters, removing
  it is the checklist item below, not a build trick.

To see what the client sees, locally:

```bash
NEXT_PUBLIC_SHOW_NOTES=true NEXT_PUBLIC_ENABLE_AGENTATION=true bun run dev
```

## Conventions

- **Go one level deeper than a labelled box where it earns it.** A box saying
  "donation widget" hides the fact that its height drives the row beside it; a
  grey circle reads as "something goes here" where a head-and-shoulders outline
  reads as "a person goes here". Draw the shapes when the shapes carry
  information. `<PersonOutline>` and the Support page's widgets are the pattern.
- **Sample content is allowed when it is doing a job**, and labelled as invented
  where it might be mistaken for a draft. The Blog page uses real article titles
  from the existing youngmuslims.com so the grid is judged against headline
  lengths they actually publish; Stories carries a made-up example capped with a
  line saying so.
- **One placeholder primitive.** Every other slot is a `<Frame>` — a box with a
  plain sentence inside saying what will live there. Never lorem ipsum: fake sentences
  invite the client to respond to the words instead of the structure. Where a
  real example helps them picture the slot, put it in `detail` in quotes. The
  landing hero's headline is the one deliberate exception, because Omar supplied
  the actual line.
- **No all-caps, anywhere.** No letterspaced small capitals for labels or
  headings. Nothing on this site is going to be set that way, so using it in the
  wireframe makes it look like a design decision rather than a description of
  one. Sentence case, normal tracking.
- **Greyscale only.** The only colour in the prototype is the sticky-note
  yellow, which is what makes a note read as commentary sitting on top of the
  wireframe rather than as part of the design. Use `bg-background`,
  `text-foreground`, `border-border`, `bg-muted`, and the `wf-*` tokens.
- **Tailwind 4 has no config file.** Design tokens live in the `@theme` block of
  `src/app/globals.css`. The wireframe's own tokens are in a fenced
  `WIREFRAME:start` / `WIREFRAME:end` block at the bottom of that file.
- **Desktop only for now.** No mobile work has been done — no breakpoint tuning,
  no mobile nav variant, no narrow-width QA. Tailwind is mobile-first by default
  so adding breakpoints later is additive, not a rewrite. Two places will need
  real work when we do responsive, and both carry a `WIREFRAME:` note: the
  header collapsing its centre links into the drawer (`site-header.tsx`), and
  the notes rail, which has nowhere to go on a narrow screen and will need to
  stack inline (`annotate.tsx`).

## How to remove the wireframe

Work through this list; `grep -rn "WIREFRAME:" src` confirms when you are done.

| Kind                               | Where                                               | Removal                                                                                               |
| ---------------------------------- | --------------------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| Disposable components              | `src/components/wireframe/`                         | Delete the folder                                                                                     |
| Imports and wrappers in real pages | `src/app/**`                                        | `grep -rn "WIREFRAME:" src/app`                                                                       |
| CSS tokens                         | `src/app/globals.css`                               | Delete the fenced `WIREFRAME:start`/`end` block                                                       |
| Map settings override              | `src/app/neighbornets/page.tsx`                     | Drop `initialSettings`/`showDebugPanel`, and the props on `NeighborNetsMap` if nothing else uses them |
| `noindex` metadata                 | `src/app/layout.tsx`                                | Remove when there is real content to find                                                             |
| Feedback toolbar                   | `src/app/layout.tsx`, `package.json`                | Remove `<AnnotationToolbar />`, then `bun remove agentation`                                          |
| Env gates                          | `netlify.toml`                                      | Delete both `[context.*.environment]` blocks                                                          |
| Route stubs                        | `about/`, `stories/`, `support/`, `store/`, `blog/` | Replaced as each page is built                                                                        |
| This file                          | `WIREFRAME.md`                                      | Delete it, and the pointer in `README.md`                                                             |
