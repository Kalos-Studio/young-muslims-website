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

Every type role is also listed in `TYPE_SIZE_TOKENS` in `src/lib/utils.ts`,
which registers the roles with `cn` as font sizes. Without that, `cn` reads a
custom size such as `text-nav` as a text colour and silently drops it when a
colour such as `text-brand-obsidian` is in the same call. When you add a
`--text-*` role to `globals.css`, add it there too; `bun run lint:tokens`
fails until the two lists match.

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
| `landing-pale`      | Landing Pale      | `#F7F3F0` | Pale band of the hero's bottom wave  |

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

## Sticky hero

Every hero page uses `StickyHero` (`src/components/site/sticky-hero.tsx`).
The hero is a full-viewport panel, `100dvh` on every device, pinned with
`position: sticky; top: 0` while the rest of the page, passed as children,
scrolls up over it. Pass the media (a video or image with
`stickyHeroMediaClassName`, so it covers) and the centred overlay content.

- The content after the hero begins with `HeroWave`, the bottom wave built
  from the Figma hero blobs (27:251 and 27:253): transparent above the photo
  edge so the hero shows through, the `landing-pale` band, then Warm Snow. It
  is one shape that moves with the content, so it cannot misalign with the
  hero, and it rises over the pinned hero like a mask line.
- At load the wave's top hump peeks above the fold, as in the 1440 x 1024
  frame.
- Sticky rather than fixed: the footer Easter egg transforms the page
  wrapper, which would carry a fixed hero with it.
- Once the page has scrolled past the hero's wave the hero is fully covered,
  so `StickyHeroCover` hides it and pauses its videos until it comes back:
  pinned for the whole page, it would otherwise keep decoding and compositing
  a full-screen video behind everything.
- The header scrim is driven by an invisible 100dvh marker with
  `data-header-hero` that scrolls normally (the pinned hero is always in
  view, so it cannot be the sentinel).
- The media and wave are full-bleed; overlay content caps at the 1440 bound
  with the header's side padding.
- On short viewports the overlay title drops to `text-mobile-display` so it
  does not crowd under the header. `short:` is the project's one height-based
  variant, `@media (max-height: 30rem)` (480px). It catches landscape phones
  (about 360-430px tall) but not landscape tablets or laptops.

| Token                | Value                 | Use                                                                                       |
| -------------------- | --------------------- | ----------------------------------------------------------------------------------------- |
| `--hero-wave-height` | `max(6rem, 16.944vw)` | The wave band: 244 of 1440 units, with a 6rem minimum so it stays a proper wave on phones |
| `--hero-peek`        | 15.57% of the band    | How much of the band shows above the fold at load (38 of 244 units)                       |

Both are rounded to whole pixels. Every section edge below the hero sits over
the pinned hero, and an edge on a fractional pixel lets a hairline of it show
through.

## Standard button

`StandardButton` (`src/components/ui/standard-button.tsx`) is the site's
standard page button, a link: `<StandardButton href="/about" label="Who We
Are" />`. Use it for in-page calls to action everywhere except the header
CTAs and the end-of-page CTA sections, which keep their own styles. Pass
`className` for placement; other link props pass through.

- **Resting (Figma 545:938):** a `text-nav` Figtree Bold label in Obsidian, an
  ↗ arrow in a Royal square, and a 2px Royal underline. It is `px-6`, with
  `pt-4 pb-4.5` so the underline sits inside the 51px height, and `gap-2.5`.
- **Hover and keyboard focus (Figma 544:654):** one orchestrated animation.
  The underline rises into a full Royal fill as the text turns Warm Snow.
  Riding on it, the label rolls (`.ym-cta-roll`) and the arrow launches up
  and to the right (`.ym-cta-arrow--diagonal`, as on the Donate button). The
  arrow's square is the same Royal as the fill, so it merges into it. All
  four share one easing and duration; the roll and launch start just after
  the fill, so the fill leads.
- **Reduced motion:** hover and focus switch straight to the filled state,
  with no fill rise, roll or launch.
- The hover is CSS only, so the component is a Server Component.

| Token                                   | Value                            | Use                                                                     |
| --------------------------------------- | -------------------------------- | ----------------------------------------------------------------------- |
| `--duration-standard-button`            | 360ms                            | The fill rising and the colour change; also the roll and launch         |
| `--duration-standard-button-swap-delay` | 40ms                             | How long after the fill starts the roll and launch begin                |
| `--ease-standard-button`                | `cubic-bezier(0.22, 1, 0.36, 1)` | The one easing for the whole hover: quick start, soft settle, no bounce |
| `--standard-button-underline`           | 0.125rem                         | The resting underline, which grows into the fill                        |

## Text reveal

Every section below the hero wraps its text in `TextReveal`
(`src/components/site/text-reveal.tsx`). When the text scrolls into view, its
lines fade in and rise into place one after another, once. It is not
re-triggered.

- Wrap a heading, a paragraph, or a block holding both. The stagger then runs
  through the heading's lines into the body's. Lines are measured when the
  reveal starts, so they follow however the text wraps at that width.
- Spread `textRevealUnit` (from `text-reveal-unit.ts`, importable by Server
  Components) on a link or button inside the block to reveal it
  whole, as one more line.
- The reveal starts when the text's top is 15% up from the bottom of the
  viewport. Text that is already above the viewport (skipped by a jump) is
  revealed too.
- Under reduced motion, and before JavaScript runs, the text is shown in
  place.

| Token                            | Value                            | Use                                    |
| -------------------------------- | -------------------------------- | -------------------------------------- |
| `--duration-text-reveal`         | 700ms                            | Each line's fade and rise              |
| `--duration-text-reveal-stagger` | 90ms                             | Delay between one line and the next    |
| `--text-reveal-rise`             | 1.25rem                          | How far below its place a line starts  |
| `--ease-text-reveal`             | `cubic-bezier(0.22, 1, 0.36, 1)` | The menu's gentle deceleration, reused |

## Belonging section

The landing page's second section, "More than a program" (Figma 37:19, tablet
279:150, mobile 294:1078). It is built in
`src/app/landing/belonging-section.tsx`, and it rides up over the hero behind
the hero wave.

- The copy (`text-mobile-section` / `text-landing-section` in Jade,
  `text-body` / `text-landing-copy` in Obsidian, and the "Who We Are" link) is
  centred in a stage, inside an oval ring of 20 faces (Figma 37:37).
- The ring is one SVG drawn in Figma's desktop units and scaled by
  `--belonging-ring-width`, so every breakpoint shows the same full ring. On
  tablet and mobile it is wider than the screen and bleeds off both sides:
  you see its top and bottom arcs around the copy. This is intended.
- The faces are spaced evenly along an oval fitted to the Figma face
  centres: centre (742.6, 859.6), radii 951 x 414.6, tilted -19.7 degrees.
  They are drawn at 84% of their Figma size, so they don't touch.
- **Motion, in two phases.**
  - **Stream-in (time-based, once per page load).** When the section
    scrolls into view, the faces enter one after another from beyond the
    viewport's right edge and sweep along the oval into place, like beads
    threading onto it: top-arc faces along the top, bottom-arc faces along
    the bottom, farthest first so none pass each other. Each fades in as it
    comes. Where each enters depends on the screen: just past the right edge
    on its arc, or, when the whole oval fits on screen, from beyond its right
    end. Durations scale with on-screen path length (paced by the longest
    path at 1440px), so the stream moves at the same pace on every width. It plays to the end on its own timeline, whatever the scroll does,
    and scrolling back up never replays it. Scrolling does not rotate the
    ring until it has finished.
  - **Drift (scroll-linked).** From the moment the stream-in ends, the ring
    drifts gently around the oval: counter-clockwise as the page scrolls
    down, clockwise as it scrolls up. The drift is measured from the scroll
    position at that moment, so it starts at zero and the faces continue
    from exactly where the stream-in left them.
  - Under reduced motion the faces simply sit in place.
- The waves into the next (Obsidian) section, Figma 165:1221 and 165:1223,
  are drawn by that section as its wavy top edge (see "Show you section"),
  over the band at the foot of this one, so the dark blob's outline can drift
  as one shape. They keep Figma's size up to 1440px wide and scale with the
  width beyond, so they always reach both edges.

Mobile values first; tablet from `md`, desktop from `xl`:

| Token                                | Mobile / tablet / desktop         | Use                                                                                                                                                                                           |
| ------------------------------------ | --------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `--belonging-ring-width`             | 109.696 / 116.811 / 143.75rem     | The ring SVG (2300 Figma units) at scale 0.7631 / 0.8126 / 1                                                                                                                                  |
| `--belonging-stage-height`           | 70.0625 / 62.8125 / 77.8125rem    | The area the ring and copy are centred in (twice the hero wave's bottom to the copy's centre)                                                                                                 |
| `--belonging-wave-band`              | 14.5625 / 24.875 / 28.75rem       | The band the next section's top edge is drawn over                                                                                                                                            |
| `--duration-belonging-swirl`         | 1400ms                            | Each face's stream-in. The longest path at 1440px takes this, which sets the pace; a longer on-screen path (wider screens) takes proportionally longer at that pace, shorter ones take 1400ms |
| `--duration-belonging-swirl-fade`    | 700ms                             | Each face's fade-in, over the first half of its stream-in                                                                                                                                     |
| `--duration-belonging-swirl-stagger` | 60ms                              | Delay between one face's stream-in and the next (about 2.5s in all at 1440: 1.4s + 19 x 60ms; a little longer on wide screens)                                                                |
| `--ease-belonging-swirl`             | `cubic-bezier(0.3, 0.6, 0.25, 1)` | Each face's stream-in: already moving as it enters (about twice its average speed), settling softly                                                                                           |
| `--belonging-ring-drift`             | 36deg                             | The ring's drift across the section's whole scroll, starting from zero at the handoff                                                                                                         |

## Show you section

The landing page's dark "show you" section (Figma 53:73, tablet 279:208,
mobile 294:1136), built in `src/app/landing/show-you-section.tsx`: the
warm-to-dark handoff and the page's first deliberate parallax moment.

- **The dark blob.** One contained organic shape: the section's Obsidian
  body plus a top cap and a bottom cap whose contours are traced from Figma's
  waves around the section (top: 165:1221 Landing Twilight, 165:1223
  Obsidian; bottom: 165:1225, 165:1227), each Obsidian contour with its
  Twilight rim behind it. The contours are generated into
  `src/app/landing/show-you-blob.ts` by `scripts/blob-contours.mjs` (`bun run
generate:show-you-blob`; edit the script, not its output; reference renders `blob-top.svg` and
  `blob-bottom.svg` in `design-assets/figma/landing-2026/show-you/`): each
  shape's outer edge across the full width, so no notch, lobe or straight
  edge shows at any width. The contours follow Figma exactly, including the bottom shape curving back into the section at the far left (visible on 1440px+ screens), where the Twilight rim shows through. Each Obsidian cap reaches 140 units back into the section, the top rim 64 and the bottom rim 134 (sized by the script for that curve-back and the drift), more than they ever move, so no straight inner edge shows. The generator refuses a contour with a vertical jump or a flattened shelf near either side, and `bun run test:show-you` (against a running server, like `test:footer`) checks the rendered blob at five widths through the whole scroll for straight vertical and horizontal edges, squared corners and page overflow. The section sits above its neighbours (`z-20`) so
  the caps can overlap them, and clips sideways only. Each cap keeps Figma's
  size up to 1440px wide and scales with the width beyond.
- **"But it's easier to just show you."** Figtree ExtraBold in Warm Snow,
  `text-mobile-section` / `text-landing-section` (tablet uses the desktop
  role; its frame's 36px has no token), wrapped in `TextReveal`.
- **Background lettering.** Three rows of BROTHERHOOD. SISTERHOOD. COMMUNITY
  SERVICE. TARBIYYAH., from Figma's vector rows: solid Warm Snow, outlined
  (a 1.5px Warm Snow line outside the letters), solid. Each row repeats one
  four-phrase tile (`design-assets/figma/landing-2026/show-you/`) so it never
  shows an end, and bleeds off both sides.
- **The highlight-reel card** (`show-you-reel.tsx`): the Figma photo under a
  40% Obsidian overlay, the `play_arrow` Material Symbol (66px, 100px on
  desktop), "2 MIN WATCH" (the reel runs 1:55; `text-xs`, `text-body` on desktop) and "Young
  Muslims Highlight Reel" (`text-landing-copy` / `text-lead` /
  `text-mobile-display`, the 32px role). Landscape on tablet and desktop,
  portrait on mobile; on desktop it sits 200px right of centre, as in Figma; from `2xl` (1536px) it centres, with the stage spanning the viewport, per the approved wide-screen layout that `test:responsive` checks.
  With a fine pointer it grows slightly on hover and a PLAY label follows the
  pointer (standing in for it). A click plays the reel in place, with sound
  and the browser's own controls; from then on the hover effects stop.
- **Parallax**, from one scroll-linked value across the section's scroll,
  written straight to GPU-composited transforms (`translate3d` on HTML
  layers; no per-frame CSS transitions, since Lenis already smooths the
  scroll). The blob breathes outward from its Figma shape: its top edge rises
  over the first half of the scroll (while it is on screen) and its bottom
  edge falls over the second half, the Twilight rims half as much again, so
  the shape visibly grows as it passes and shrinks back on the way up. The
  edges only move outward, so the outline never dips into the section. The
  marquee rows drift in opposite directions (top and bottom left as the page
  scrolls down, middle right), reaching their Figma places when the section
  is centred.
- **Height.** Content-driven: heading top / gap to card / space under it are
  51 / 67 / 168 on mobile, 51 / 137 / 216 on tablet and 120 / 108 / 120 on
  desktop, giving a 755 / 848 / 925px section (Figma's frames were 808 / 894
  / 1087, with dead dark space above the heading and below the card).
- **Reduced motion:** no parallax (everything at its Figma place), no hover
  growth, no PLAY label.

Spacing uses Tailwind's spacing scale; mobile values first, tablet from `md`,
desktop from `xl`:

| Token                                                  | Value                            | Use                                                                                                                                                                                                                                                          |
| ------------------------------------------------------ | -------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `--show-marquee-row-height`                            | 2.4593 / 3.4996 / 3.7599rem      | One lettering row (39.35 / 55.99 / 60.16 Figma units); spacing and offsets scale with it                                                                                                                                                                     |
| `--show-marquee-drift`                                 | 6                                | Each row's drift in row heights across the section (half either side of rest): 361 / 336 / 236px                                                                                                                                                             |
| `--show-edge-drift`                                    | 6.875rem                         | How far the blob's top edge rises and bottom edge falls (110px each, so the blob grows 220px); the rims move 1.5x (165px). Keep EDGE_DRIFT in scripts/blob-contours.mjs in step: it sizes the overlaps and refuses to generate if a straight edge could show |
| `--ease-show-you`                                      | `cubic-bezier(0.22, 1, 0.36, 1)` | The card's hover growth and the PLAY label's follow                                                                                                                                                                                                          |
| `--show-reel-hover-scale`                              | 1.025                            | The card's growth on hover, before it is played                                                                                                                                                                                                              |
| `--duration-show-reel-hover`                           | 450ms                            | The card's hover growth                                                                                                                                                                                                                                      |
| `--duration-show-reel-follow`                          | 160ms                            | How far the PLAY label trails the pointer                                                                                                                                                                                                                    |
| `--aspect-show-reel` / `--aspect-show-reel-portrait`   | 833 / 529, 296 / 397             | The card's shape: landscape (tablet, desktop) and portrait (mobile)                                                                                                                                                                                          |
| `--show-blob-top-height` / `--show-blob-bottom-height` | 37.5rem / 32.5rem                | The drawn caps (600 and 520 Figma units, including the overlap), 1:1 up to 1440px wide                                                                                                                                                                       |
| `--show-blob-overlap`                                  | 8.75rem                          | How far each Obsidian cap reaches back into the section (140 units; 9.7222% of the width once scaled)                                                                                                                                                        |

The video files and how they are encoded are in
`design-assets/video-source/README.md`.

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
| `--ease-blob-reveal`            | `cubic-bezier(0.33, 0, 0.15, 1)` | Wipe easing: a soft start and a long, gentle deceleration                          |
| `--duration-blob-reveal`        | 850ms                            | Wipe duration (the entry wipe and the page-transition reveal)                      |
| `--duration-blob-cover`         | 750ms                            | Sweeping back in to cover (the reverse, used by the page transition)               |
| `--blob-reveal-size`            | 200vmax                          | Full blob size; every shape's narrowest radius covers any viewport from the centre |
| `--blob-reveal-travel`          | 155vmax                          | How far a directional mask slides; takes the blob fully off-screen                 |
| `--blob-reveal-shape-1` to `-6` | Inline SVGs                      | The curated organic blobs, one picked per play                                     |
| `--blob-reveal-solid`           | Inline SVG                       | The solid layer the centre mode excludes the blob from                             |

Under reduced motion the wipe is instant.

`BlobReveal` also runs in reverse: mounted with `revealing` true it starts
off-screen, and setting `revealing` false sweeps it in to cover the viewport
(`onCovered`). Callbacks fire only for a change of state, never on mount.

## Page transition

Client-side navigation between pages plays a cover-then-reveal with
`BlobReveal` (`src/components/site/page-transition.tsx`, mounted once in the
root layout). A capture-phase click listener on the document takes over
internal link clicks and calls `preventDefault()`, so next/link skips its own
navigation while other click handlers (such as the menu closing) still run.

1. A blob in a random brand colour sweeps in from a random direction with a
   random shape, the stacked YM composition centred on it.
2. Once covered, the app navigates with `router.push` inside a React
   transition.
3. The cover holds on the composition while that transition is pending and the
   destination's fonts and visible images load, for at most the max hold.
   When the destination is already loaded there is no hold.
4. The same blob continues across and off-screen, revealing the new page,
   which has already scrolled to the top or to its `#anchor`.

The cover colours are the full brand palette: Deep Obsidian, Warm Snow, Royal
Blue, Jade Foliage, Pure White, Midnight Blue, Cool Slate, Sky Blue, Deep
Forest Green, Warm Brass and Buttercup Yellow (`COVER_COLORS` in
page-transition.tsx). The cover shows the entry's stacked YM composition
(`YmComposition`, shared with the entry screen and scaled the same way) in
one solid colour with no grain: Deep Obsidian on colours whose relative
luminance is above the contrast threshold and Warm Snow below it, which
gives at least 5.3:1 on every colour.

| Token                                  | Value  | Use                                                                                                          |
| -------------------------------------- | ------ | ------------------------------------------------------------------------------------------------------------ |
| `--duration-blob-cover`                | 750ms  | The cover sweeping in                                                                                        |
| `--duration-blob-reveal`               | 850ms  | The reveal sweeping out                                                                                      |
| `--duration-page-transition-max-hold`  | 3000ms | Longest the cover waits for a slow destination; after it, the cover reveals whatever is there                |
| `--page-transition-contrast-threshold` | 0.195  | Relative luminance above which the composition is Obsidian; where Obsidian and Warm Snow have equal contrast |

Not intercepted: modified clicks, new-tab and download links, external
links, same-page links (a `#hash` or a query change), back and forward
navigation (the browser restores scroll natively), clicks while the entry
animation plays, and links inside `[data-page-transition="off"]`, which the
Stories portraits use to keep their own expanding-image transition. Under
reduced motion links navigate directly.

During the transition smooth scrolling is stopped through
`stopSmoothScroll()` / `startSmoothScroll()` (smooth-scroll-provider.tsx),
which cancels Lenis momentum and re-syncs it afterwards. It deliberately does
not use the `<html>` overflow flag, which Base UI's menu scroll lock also
writes.

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
