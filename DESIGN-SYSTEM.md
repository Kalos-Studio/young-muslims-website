# Young Muslims design system

This file is the implementation contract between the Young Muslims brand kit,
the [Young Muslims Website Figma
file](https://www.figma.com/design/RJBqBhkp33opITNp7yXU81/Young-Muslims-Website?node-id=26-188),
and the website. Figma is the visual source of truth. The tokens in
`src/app/globals.css` are the production translation used by Tailwind CSS 4.

The Figma file publishes the four foundation colors as paint styles. It does
not currently publish variables, text styles, or effect styles. Typography and
layout values therefore move into code through this reviewed mapping rather
than automatic syncing.

## Typography

- **Boldonse Regular** is the display face. Use `font-display` for primary,
  expressive headlines only.
- **Figtree** is the default face. `font-sans` applies it to body copy,
  navigation, controls, labels, and supporting headings.
- No other font families are exposed by Tailwind. Technical labels and
  prototype tooling use Figtree too.

The desktop website roles come directly from Figma node `26:188`:

| Role              | Tailwind utility  | Typeface and weight | Size | Tracking |
| ----------------- | ----------------- | ------------------- | ---: | -------: |
| Display           | `text-display`    | Boldonse Regular    | 56px |      -2% |
| Section heading   | `text-section`    | Figtree ExtraBold   | 54px |      -2% |
| Hero introduction | `text-lead`       | Figtree Semibold    | 24px |      -2% |
| Large body        | `text-lead`       | Figtree Medium      | 24px |      -2% |
| Card title        | `text-card-title` | Figtree Semibold    | 28px |       0% |
| Body              | `text-body`       | Figtree Regular     | 16px |       0% |
| Navigation        | `text-nav`        | Figtree Bold        | 14px |      -2% |
| Statistic         | `text-stat`       | Boldonse Regular    | 54px |      -2% |

Every role uses Figma's Auto line height, represented by `normal` in CSS.

Boldonse has one approved weight. Do not combine `font-display` with a bold
utility: that asks the browser to synthesize a weight that does not exist.

Fonts are loaded and self-hosted by Next.js from `src/app/layout.tsx`.
Tailwind's default font namespace is reset in `src/app/globals.css`, so
`font-serif` and `font-mono` are deliberately unavailable.

These are the approved desktop values. The Support mobile frame (`447:2754`)
now supplies the corresponding mobile layout. Use the existing
`text-mobile-display` (32px) for its Boldonse hero and `text-mobile-section`
(30px) for its Figtree headings, with `text-nav` for the hero introduction and
`text-body` for body copy. Keep the desktop roles at the desktop breakpoint.
The Store mobile frame (`456:3697`) also uses these mobile display and section-heading tokens. Do not invent responsive sizes for other pages without an approved mobile frame.

## Brand color primitives

These values are exact and must not be altered.

| Tailwind token      | Brand name        | Value     | Intended use                         |
| ------------------- | ----------------- | --------- | ------------------------------------ |
| `brand-obsidian`    | Deep Obsidian     | `#171725` | General dark foundation and text     |
| `brand-warm-snow`   | Warm Snow         | `#FCFAF8` | General light foundation             |
| `brand-royal`       | Royal Blue        | `#234080` | General or Brothers accent and text  |
| `brand-jade`        | Jade Foliage      | `#397451` | General or Sisters accent and text   |
| `brand-pure-white`  | Pure White        | `#FFFFFF` | Reversed content and clean surfaces  |
| `brothers-midnight` | Midnight Blue     | `#16294F` | Brothers dark foundation and text    |
| `brothers-slate`    | Cool Slate        | `#99ADC8` | Brothers large fills and accents     |
| `brothers-sky`      | Sky Blue          | `#4A90D9` | Brothers large fills and accents     |
| `sisters-forest`    | Deep Forest Green | `#043222` | Sisters dark foundation and text     |
| `sisters-brass`     | Warm Brass        | `#D8AA45` | Sisters large fills and accents      |
| `sisters-buttercup` | Buttercup Yellow  | `#EBD255` | Sisters large fills and accents      |
| `landing-cyan`      | Landing Cyan      | `#23B8C0` | Highlighted words on the homepage    |
| `landing-blush`     | Landing Blush     | `#E3D6D6` | Homepage story-card surfaces         |
| `landing-twilight`  | Landing Twilight  | `#34344C` | Homepage highlight-reel outer curves |
| `landing-card-ink`  | Card Ink          | `#000000` | Homepage story-card text             |

Slate, Sky, Brass, and Buttercup do not have enough contrast for normal-sized
text on white or Warm Snow. Use them for fills, decoration, and large graphical
elements, matching the brand guidance.

## Semantic website tokens

Components should use semantic utilities by default:

| Semantic token          | Brand mapping |
| ----------------------- | ------------- |
| `background`, `card`    | Warm Snow     |
| `foreground`, `primary` | Deep Obsidian |
| `secondary`             | Royal Blue    |
| `accent`                | Jade Foliage  |
| `ring`                  | Royal Blue    |

Use a brand primitive directly only when a surface explicitly represents the
Brothers identity, Sisters identity, or a prescribed brand treatment.

## Functional UI tokens

Forms and interactive components need states that the brand book does not
define. These are deliberately kept separate from the brand palette:

- `muted`, `muted-foreground`, `border`, and `input` are deterministic mixtures
  of Deep Obsidian and Warm Snow.
- `destructive` uses the system danger color `#B42318` with white foreground.
- Focus rings use Royal Blue.

Functional tokens may be changed for accessibility or interaction clarity
without changing the official brand primitives.

## Shape and spacing

The landing design defines three reusable radii:

| Role   | Tailwind utility |  Value |
| ------ | ---------------- | -----: |
| Media  | `rounded-media`  |    6px |
| Card   | `rounded-card`   |   16px |
| Button | `rounded-pill`   | 9999px |

Repeated spacing uses Tailwind's existing exact values: 16px (`4`), 24px (`6`),
32px (`8`), and 80px (`20`). The landing CTA is exactly `px-6 py-4`, and the
desktop navigation uses `px-20 py-4`.

## Site menu

The full-screen menu (`.ym-menu-*` in `src/app/globals.css`) follows the
Figma menu frames: desktop `298:1507`, tablet `301:1594` and mobile
`301:1667`. Its top bar deliberately uses the header's height (97px, 80px on
mobile) instead of the frames' 123px. That keeps the logo and menu trigger in
place when the menu opens. These approved tokens exist only for the menu:

| Token                                                         | Value                                             | Use                                                           |
| ------------------------------------------------------------- | ------------------------------------------------- | ------------------------------------------------------------- |
| `--ease-menu-reveal`                                          | `cubic-bezier(0.22, 1, 0.36, 1)`                  | Reveal and conceal easing                                     |
| `--duration-menu-reveal` / `--duration-menu-conceal`          | 800ms / 550ms                                     | Open and close durations                                      |
| `--menu-viewport-width` / `--menu-viewport-height`            | 100vw / 100dvh                                    | Size the reveal circle to the farthest viewport corner        |
| `--menu-primary-line-height` / `--menu-primary-tracking`      | 1.21 / -2%                                        | Outlined Boldonse primary links                               |
| `--menu-fit`                                                  | At most 1px                                       | Scale for every vertical size below; 1px at the frame heights |
| `--menu-primary-size`                                         | 48 × fit from `md`, 41.36 × fit below             | Primary link size                                             |
| `--menu-primary-gap` / `--menu-pad-top` / `--menu-pad-bottom` | Frame values × fit                                | Primary spacing and outer padding                             |
| `--menu-section-gap` / `--menu-footer-gap`                    | Frame values × fit                                | Space between blocks                                          |
| `--menu-secondary-padding` / `--menu-secondary-gap`           | Frame values × fit                                | Secondary link rows                                           |
| `--menu-mark-size`                                            | 66.667vw tablet, 42.98vw from `xl`                | Decorative monogram size                                      |
| `--menu-mark-top`                                             | 0vw tablet, -5.417vw from `xl`                    | Filled monogram top; the outline mark sits directly below     |
| `--menu-mark-filled-left` / `--menu-mark-outline-left`        | 37.22% / 63.57% tablet, 47.43% / 64.42% from `xl` | Monogram left offsets                                         |

The primary-link sizes are measured from the Figma outlines: with the standard
-2% tracking, rendered glyph bounds match the frames (WHO WE ARE is 344×58 on
desktop and 296×50 on mobile). Do not tighten their tracking to fit; that makes
Boldonse glyphs collide.

**Viewport fit.** The menu never scrolls. `--menu-fit` is the viewport height
minus the fixed parts (top bar, secondary text lines and socials), divided by
the sum of the scalable sizes plus 8px of slack, capped at 1px. At or above the
frame heights everything matches Figma and the spare height opens between the
two blocks. Below them, every scalable size shrinks in proportion, so the stack
always sums to the viewport. Below 30rem tall on mobile, or 35rem from `md`,
the primary links and the secondary block sit side by side, and `--menu-fit`
sizes the primary links to the remaining height. Fitting the viewport takes
priority over the frames' exact proportions.

**Reveal.** The reveal is a clip, not an overlay: the popup's `clip-path` is a
circle centred on the menu trigger whose final radius reaches the farthest
viewport corner, so the whole duration is visible motion and the static menu is
only visible inside the circle. A single radius interpolates reliably; do not
animate between two sets of corner radii. Closing shrinks the circle back into
the trigger. Under reduced motion both are instant.

The decorative monograms are full-opacity Royal Blue and Jade assets in
`design-assets/figma/menu/`. They sit outside the menu's content so they stay
anchored to the viewport and bleed off its edges, and they are hidden below
`md`.

## Blob reveal

`BlobReveal` (`src/components/site/blob-reveal.tsx`) is the reusable wipe for
covering layers: the entry screen now, page transitions later. It has two
modes, chosen with `origin`:

- **Directional** (`"top"`, `"bottom"`, `"left"`, `"right"` or a corner, or a
  random one from `pickBlobRevealOrigin()`): the layer is visible only inside
  a blob-shaped mask that starts large enough to cover the viewport, and
  revealing slides the mask off-screen away from the origin, so the page
  appears from that side behind the blob's trailing organic edge. Only
  `mask-position` animates.
- **Centre** (`"center"`, used by the entry animation): the layer is visible
  outside a blob (a solid mask layer with the blob excluded), and revealing
  grows the blob from nothing at the viewport centre, so the page appears from
  the middle outward. Only the blob's `mask-size` animates.

Neither the layer nor the page fades or moves, and both mask properties
interpolate reliably as plain lengths. Do not animate morphing `clip-path`
radii instead. The shapes are inline data URIs, so the mask is ready at first
paint without an image request.

Every play uses one of six curated blob shapes, picked at random on the client
(`pickBlobRevealShape()`, or pin one with the `shape` prop): 1 classic, 2
pebble (the roundest), 3 trefoil, 4 drift, 5 clover and 6 river. Each is a
smooth closed curve built from a few soft lobes, centred, with a narrowest
radius of at least 36.5% and a widest of at most 49.5% of its box, so it covers
any viewport at 200vmax and never clips flat. Shapes are chosen from this set,
never generated at runtime. In the centre mode the cut-out is the same blob
layer excluded from the solid layer, so its edge always matches the growing
blob. To add a shape, add a token, a pair of `data-blob-shape` rules in
globals.css, and raise `BLOB_REVEAL_SHAPE_COUNT`.

| Token                           | Value                            | Use                                                                                |
| ------------------------------- | -------------------------------- | ---------------------------------------------------------------------------------- |
| `--ease-blob-reveal`            | `cubic-bezier(0.65, 0, 0.35, 1)` | Wipe easing                                                                        |
| `--duration-blob-reveal`        | 700ms                            | Wipe duration                                                                      |
| `--blob-reveal-size`            | 200vmax                          | Full blob size; every shape's narrowest radius covers any viewport from the centre |
| `--blob-reveal-travel`          | 155vmax                          | How far a directional mask slides; takes the blob fully off-screen                 |
| `--blob-reveal-shape-1` to `-6` | Inline SVGs                      | The curated organic blobs, one picked per play                                     |
| `--blob-reveal-solid`           | Inline SVG                       | The solid layer the centre mode excludes the blob from                             |

Under reduced motion the wipe is instant.

## Entry animation

The first-load entry screen (`EntryScreen` inside `EntryAnimation`) follows
Figma frame `273:620`: Brothers Slate monograms above "YOUNG MUSLIMS" in live
Boldonse, whose letterforms window group photos, with film grain. It is on
screen at first paint, flashes the photos through the wordmark, waits for the
landing page's fonts, images and hero video (capped at 5s), then wipes away
with a centre-origin `BlobReveal`: a blob grows from the middle of the
composition and uncovers the page outward. Photo 7 is vendored pre-cropped to
its Figma frame crop, so its subjects sit as high as the design.

| Token                    | Value                           | Use                                                 |
| ------------------------ | ------------------------------- | --------------------------------------------------- |
| `--duration-entry-flash` | 1200ms                          | The whole photo flash, shared equally by the photos |
| `--duration-entry-hold`  | 140ms                           | Hold on the last photo before the wipe              |
| `--entry-unit`           | One Figma unit in screen pixels | Scales the 1073.78×926 composition to the viewport  |

`--entry-unit` is width-limited to the frame's 74.57vw, never narrower than
18.5rem or wider than the viewport less 2rem margins, and height-limited to
the viewport less 2rem margins. At 1440×1024 it reproduces the frame exactly.
On portrait phones the composition holds a 296px width (a 75px wordmark cap
height) until the screen is narrower than 360px.

The monograms are the menu's full-opacity marks used as CSS masks. Their pale
slate is Brothers Slate at 65% over Warm Snow, matching the frame. The
wordmark is an SVG clip path of the live text, sized so both lines are 271
units tall and pinned to the frame's widths with `textLength`. The grain is an
SVG noise filter (`#entry-grain`: fractal noise at base frequency 0.85, added
as ±12% around the source colour), confined to the shapes so the Warm Snow
background stays clean. The photos are a single list in
`src/components/site/entry-photos.ts`.

## Rules for implementation

1. Search existing semantic and brand tokens before adding a color or font.
2. Do not use raw hex values in page or component class names.
3. Do not create a `tailwind.config.ts`; Tailwind 4 configuration lives in
   `src/app/globals.css`.
4. Do not create another brand shade by lightening, darkening, or mixing a
   primitive. Functional mixtures belong only in the semantic UI layer.
5. Use the named website typography and radius roles. Do not reassemble their
   size, tracking, line height, or radius from arbitrary utilities.
6. Use `font-display` intentionally for page-defining or expressive headings;
   ordinary headings and UI copy use Figtree.
7. Keep wireframe-only `wf-*` tokens isolated. Delete them with the wireframe,
   following `WIREFRAME.md`.
8. The brand kit does not define a dark theme. Do not introduce one without an
   approved design.
