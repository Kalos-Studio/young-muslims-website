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
  `font-heading` is an alias for the same face, for headings that want to say
  so; it is not a separate typeface.
- No other font families are exposed by Tailwind. Technical labels and
  prototype tooling use Figtree too.

The desktop website roles come directly from Figma node `26:188`:

| Role              | Tailwind utility     | Typeface and weight | Size | Tracking |
| ----------------- | -------------------- | ------------------- | ---: | -------: |
| Display           | `text-display`       | Boldonse Regular    | 56px |      -2% |
| Section heading   | `text-section`       | Figtree ExtraBold   | 54px |      -2% |
| Hero introduction | `text-lead`          | Figtree Semibold    | 24px |      -2% |
| Large body        | `text-lead`          | Figtree Medium      | 24px |      -2% |
| Card title        | `text-card-title`    | Figtree Semibold    | 28px |       0% |
| Article title     | `text-article-title` | Figtree Semibold    | 18px |      -2% |
| Article meta      | `text-article-meta`  | Figtree Medium      | 12px |      -2% |
| Body              | `text-body`          | Figtree Regular     | 16px |       0% |
| Navigation        | `text-nav`           | Figtree Bold        | 14px |      -2% |
| Statistic         | `text-stat`          | Boldonse Regular    | 54px |      -2% |

Every role uses Figma's Auto line height, represented by `normal` in CSS.

The landing page and shared components add these roles (from the landing
frames and each component's Figma node). Boldonse roles are `font-display`,
the rest Figtree; line height is `normal` unless noted.

| Role                    | Tailwind utility             | Size | Line height | Tracking | Used by                                                 |
| ----------------------- | ---------------------------- | ---: | ----------: | -------: | ------------------------------------------------------- |
| Mobile display          | `text-mobile-display`        | 32px |      normal |      -2% | Boldonse heroes and figures on mobile                   |
| Mobile section heading  | `text-mobile-section`        | 30px |         1.2 |      -2% | Figtree ExtraBold section headings on mobile            |
| Landing display         | `text-landing-display`       | 48px |      normal |      -2% | The landing and Stories heroes' Boldonse display lines  |
| Landing section heading | `text-landing-section`       | 40px |         1.2 |      -2% | Landing section headings from tablet                    |
| Landing hero subtitle   | `text-landing-hero-subtitle` | 20px |         1.2 |      -2% | The landing and Stories heroes' introductions           |
| Landing copy            | `text-landing-copy`          | 20px |         1.2 |      -2% | Landing sublines and body copy from tablet              |
| Landing statistic       | `text-landing-stat`          | 48px |      normal |      -2% | Boldonse figures (the NeighborNets page)                |
| Landing statistic label | `text-landing-stat-label`    | 24px |         1.2 |      -2% | Labels under landing figures (reserved: no current use) |
| Marquee                 | `text-marquee`               | 60px |      normal |      -2% | Boldonse lettering rows (the highlight reel)            |
| CTA button              | `text-cta`                   | 18px |      normal |      -2% | The closing CTA's box buttons (Figtree Bold)            |
| Footer legal            | `text-footer-legal`          | 10px |      normal |      -2% | The footer's copyright, credit and privacy links (Bold) |
| Footer tagline          | `text-footer-tagline`        | 40px |      normal |      -2% | The footer's Boldonse tagline on desktop                |
| Footer tagline, tablet  | `text-footer-tagline-tablet` | 38px |      normal |      -2% | The footer tagline from `md`                            |
| Footer tagline, mobile  | `text-footer-tagline-mobile` | 29px |      normal |      -2% | The footer tagline below `md`                           |

Boldonse's glyphs stand about 1.21x the font size, which is why the footer
tagline's sizes are smaller than its Figma glyph heights (48.6 / 46.2 / 35.3px).

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

| Semantic token          | Brand mapping            |
| ----------------------- | ------------------------ |
| `background`, `card`    | Warm Snow                |
| `foreground`, `primary` | Deep Obsidian            |
| `secondary`             | Royal Blue               |
| `accent`                | Jade Foliage             |
| `ring`                  | Royal Blue               |
| `caption`               | Caption gray (`#484848`) |

`caption` (`text-caption`, `--color-caption`) is the gray for caption and
description copy on Warm Snow (9.3:1), first used by the landing article
cards' descriptions (Figma 270:289).

Use a brand primitive directly only when a surface explicitly represents the
Brothers identity, Sisters identity, or a prescribed brand treatment.

## Functional UI tokens

Forms and interactive components need states that the brand book does not
define. These are deliberately kept separate from the brand palette:

- `muted`, `muted-foreground`, `border`, and `input` are deterministic mixtures
  of Deep Obsidian and Warm Snow.
- `destructive` uses the system danger color `#B42318` with white foreground.
- Focus rings use Royal Blue.
- `system-danger` (`--color-system-danger`, `#B42318`) is the functional
  danger colour behind `destructive`; it is not a brand colour.

The component-library primitives (shadcn/ui, `src/components/ui/`) read a
standard semantic set, all mapped onto the brand in `globals.css` `:root`:

| Token (utility suffix)                                                                                                                                            | Maps to                                                                                                              | Use                                                                  |
| ----------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------- |
| `primary-foreground`, `secondary-foreground`, `accent-foreground`                                                                                                 | Warm Snow                                                                                                            | Text and icons on `primary` / `secondary` / `accent` fills           |
| `destructive-foreground`                                                                                                                                          | Pure White                                                                                                           | Text on `destructive` fills                                          |
| `card`, `card-foreground`                                                                                                                                         | Warm Snow / Deep Obsidian                                                                                            | Card surfaces and their text                                         |
| `popover`, `popover-foreground`                                                                                                                                   | Pure White / Deep Obsidian                                                                                           | Popovers and dropdowns (the blog's filters, the NeighborNet details) |
| `sidebar`, `sidebar-foreground`, `sidebar-primary`, `sidebar-primary-foreground`, `sidebar-accent`, `sidebar-accent-foreground`, `sidebar-border`, `sidebar-ring` | Warm Snow ground; Obsidian text and primary (Warm Snow on it); `muted` accent (Obsidian on it); `border`; Royal ring | The library's sidebar component (not used by the site yet)           |
| `chart-1` … `chart-5`                                                                                                                                             | Royal, Jade, Brothers Sky, Sisters Brass, Deep Obsidian                                                              | Chart series, in that order (not used by the site yet)               |

Functional tokens may be changed for accessibility or interaction clarity
without changing the official brand primitives.

## Shape and spacing

The landing design defines three reusable radii:

| Role   | Tailwind utility |  Value |
| ------ | ---------------- | -----: |
| Media  | `rounded-media`  |    6px |
| Card   | `rounded-card`   |   16px |
| Button | `rounded-pill`   | 9999px |

The component-library primitives use the standard radius scale, derived from
`--radius` (0.625rem, 10px): `rounded-sm` (x0.6, 6px), `rounded-md` (x0.8,
8px), `rounded-lg` (x1, 10px), `rounded-xl` (x1.4, 14px), `rounded-2xl` (x1.8,
18px), `rounded-3xl` (x2.2, 22px) and `rounded-4xl` (x2.6, 26px). Use them only
inside those primitives (the map's popups, the debug panel, `Button`); site
surfaces use the three roles above.

Repeated spacing uses Tailwind's existing exact values: 16px (`4`), 24px (`6`),
32px (`8`), and 80px (`20`). The landing CTA is exactly `px-6 py-4`, and the
desktop navigation uses `px-20 py-4`.

## Site menu

The full-screen menu (`.ym-menu-*` in `src/app/globals.css`) follows the
Figma menu frames: desktop `298:1507`, tablet `301:1594` and mobile
`301:1667`. Its top bar deliberately uses the header's height (97px, 80px on
mobile) instead of the frames' 123px. That keeps the logo and menu trigger in
place when the menu opens. These approved tokens exist only for the menu:

| Token                                                         | Value                                                                                        | Use                                                                                                                     |
| ------------------------------------------------------------- | -------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| `--ease-menu-reveal`                                          | `cubic-bezier(0.22, 1, 0.36, 1)`                                                             | Reveal and conceal easing                                                                                               |
| `--duration-menu-reveal` / `--duration-menu-conceal`          | 800ms / 550ms                                                                                | Open and close durations                                                                                                |
| `--menu-viewport-width` / `--menu-viewport-height`            | 100vw / 100dvh                                                                               | Size the reveal circle to the farthest viewport corner                                                                  |
| `--menu-primary-line-height` / `--menu-primary-tracking`      | 1.21 / -2%                                                                                   | Boldonse primary links (Obsidian fill, Warm Snow outline)                                                               |
| `--menu-primary-stroke`                                       | 1.2px                                                                                        | The primary links' Warm Snow outline (all sizes)                                                                        |
| `--menu-primary-roll-room` / `--menu-primary-roll-gap`        | 0.125rem / 0.3125rem                                                                         | The primary links' label roll: room in its clip for the outline, and the gap before the rolling copy                    |
| `--menu-fit`                                                  | At most 1px                                                                                  | Scale for every vertical size below; 1px at the frame heights                                                           |
| `--menu-primary-size`                                         | 48 × fit from `md`, 41.36 × fit below                                                        | Primary link size                                                                                                       |
| `--menu-primary-gap` / `--menu-pad-top` / `--menu-pad-bottom` | Frame values × fit                                                                           | Primary spacing and outer padding                                                                                       |
| `--menu-section-gap` / `--menu-footer-gap`                    | Frame values × fit                                                                           | Space between blocks                                                                                                    |
| `--menu-secondary-padding` / `--menu-secondary-gap`           | Frame values × fit                                                                           | Secondary link rows                                                                                                     |
| `--menu-mark-size`                                            | min(91.83vw, 55.36dvh) mobile, min(66.667vw, 50dvh) tablet, min(42.98vw, 60.45dvh) from `xl` | Decorative monogram size: the frame's width share, capped by height so the two marks never overlap                      |
| `--menu-mark-top`                                             | size x 0.0484 mobile, 0vw tablet, size x -0.126 from `xl`                                    | The filled (Brothers) mark's top: it hangs from the top edge                                                            |
| `--menu-mark-outline-bottom`                                  | size x -0.2419 mobile, 0vw tablet, size x -0.2197 from `xl`                                  | The outline (Sisters) mark's bottom: it rises from the bottom edge, so both stay equally in view at any viewport height |
| `--menu-mark-filled-left` / `--menu-mark-outline-left`        | -41.94% / 38.75% mobile, 37.22% / 63.57% tablet, 47.43% / 64.42% from `xl`                   | Monogram left offsets                                                                                                   |

The primary links rest as Obsidian letters with a 1.2px Warm Snow outline: the
fill knocks out the monograms behind them, so the marks never show through the
letterforms. Hover, keyboard focus and the current page fill them Warm Snow;
hover and focus also roll the label (the site's `.ym-cta-roll`, no arrow),
both copies carrying the fill and outline. The roll's clip keeps
`--menu-primary-roll-room` above and below the label so the outline is never
shaved, and the rolling copy waits `--menu-primary-roll-gap` below it. Under
reduced motion there is no roll; the fill still applies.

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
anchored to the viewport and bleed off its edges, at every size (mobile
301:1667 now shows them too). The filled Brothers mark hangs from the top edge
and the outlined Sisters mark rises from the bottom edge, so both are equally
in view whatever the viewport's height; each mark's size is capped by the
height, so the two never overlap (at most their boxes just touch, as in the
frames).

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

- **Width:** full width on mobile (label and arrow centred), for a bigger
  tap target and a clean stacked layout; from `md` it sizes to its label.
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
- **Dark tone (`tone="dark"`, Figma 246:124):** for dark backgrounds such as
  photos under a dark overlay. Resting: Warm Snow text and 2px underline, the
  ↗ arrow in Obsidian on a Warm Snow square. Hover and focus: a Warm Snow
  fill rises and the text turns Obsidian; the square merges into the fill.
  Same mechanics, timing and reduced-motion behaviour as the default `light`
  tone. Used by the principles section's "Learn more" buttons, and by the
  stories snippet's "View the full story" on dark colours.
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

| Token                                                                                            | Value                                       | Use                                                                                                                                                                                                                                                          |
| ------------------------------------------------------------------------------------------------ | ------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `--show-marquee-row-height`                                                                      | 2.4593 / 3.4996 / 3.7599rem                 | One lettering row (39.35 / 55.99 / 60.16 Figma units); spacing and offsets scale with it                                                                                                                                                                     |
| `--show-marquee-drift`                                                                           | 6                                           | Each row's drift in row heights across the section (half either side of rest): 361 / 336 / 236px                                                                                                                                                             |
| `--spacing-show-marquee-top` / `-row-gap` / `-first-offset` / `-second-offset` / `-third-offset` | 23.829 / 1.372 / 27.698 / 42.131 / 1.617rem | Unused: theme spacing from an earlier marquee layout, superseded by the module's row-height-based placement (`--show-marquee-row-height`). Candidates for removal                                                                                            |
| `--show-edge-drift`                                                                              | 6.875rem                                    | How far the blob's top edge rises and bottom edge falls (110px each, so the blob grows 220px); the rims move 1.5x (165px). Keep EDGE_DRIFT in scripts/blob-contours.mjs in step: it sizes the overlaps and refuses to generate if a straight edge could show |
| `--ease-show-you`                                                                                | `cubic-bezier(0.22, 1, 0.36, 1)`            | The card's hover growth and the PLAY label's follow                                                                                                                                                                                                          |
| `--show-reel-hover-scale`                                                                        | 1.025                                       | The card's growth on hover, before it is played                                                                                                                                                                                                              |
| `--duration-show-reel-hover`                                                                     | 450ms                                       | The card's hover growth                                                                                                                                                                                                                                      |
| `--duration-show-reel-follow`                                                                    | 160ms                                       | How far the PLAY label trails the pointer                                                                                                                                                                                                                    |
| `--aspect-show-reel` / `--aspect-show-reel-portrait`                                             | 833 / 529, 296 / 397                        | The card's shape: landscape (tablet, desktop) and portrait (mobile)                                                                                                                                                                                          |
| `--show-blob-top-height` / `--show-blob-bottom-height`                                           | 37.5rem / 32.5rem                           | The drawn caps (600 and 520 Figma units, including the overlap), 1:1 up to 1440px wide                                                                                                                                                                       |
| `--show-blob-overlap`                                                                            | 8.75rem                                     | How far each Obsidian cap reaches back into the section (140 units; 9.7222% of the width once scaled)                                                                                                                                                        |

The video files and how they are encoded are in
`design-assets/video-source/README.md`.

## All about section

The landing page's "This is what we're all about" section (Figma 58:120,
tablet 279:262, mobile 295:1165), built in
`src/app/landing/all-about-section.tsx` with its scroll motion in
`all-about-motion.tsx`. It follows the "show you" section, whose blob's
bottom wave (drawn by that section, above this one) hangs over its top.

- **Copy:** "This is what we're all about." (`text-mobile-section` /
  `text-landing-section`, Figtree ExtraBold, Obsidian; the tablet frame's
  36px has no token, so tablet uses the desktop role), the body
  (`text-body` / `text-landing-copy`, Medium) and an "About us"
  `StandardButton` to `/about` (full width on mobile, the button's default), all
  in one `TextReveal`. Mobile uses the site's 32px (`px-8`) side gutter at
  every phone width, as the hero, belonging and show-you sections do.
- **Tiles:** four static 298 x 482 tiles (on mobile they fill the content
  width at that locked ratio, `aspect-all-about-tile`, up to 384px wide), not links and
  with no hover: photo, Figma's bottom overlay (clear at 9.5% to 48%
  Obsidian at 110%), a `text-card-title` SemiBold title and a `text-body`
  Medium body in Pure White, positioned per tile as in Figma. Each photo is
  vendored pre-cropped to its Figma frame crop
  (`design-assets/figma/landing-2026/all-about/tile-*.jpg`, 3x where the
  source allows), so it simply covers the tile.
- **Layout:** desktop puts the copy on the left (538 wide) and two tile
  columns on the right: tiles 1 and 3, then tiles 2 and 4 starting 90
  lower, 53 apart, 72 between tiles. The 1440 frame's 90 / 71 side insets
  hold; between 1280 and 1440 the copy column narrows. Tablet keeps the two
  offset columns (44 apart) under the copy, in a centred 768 frame. Mobile
  stacks the tiles 46 apart in the order 1, 3, 2, 4, as in its frame.
- **Watermarks:** the YM monogram (Royal) and the "ym" roundel (Jade), both
  at 4% opacity in the vendored SVGs, at their frame positions (the
  monogram right-anchored on desktop).
- **Handoff spacing:** the show-you bottom rim reaches 306 units below that
  section at rest and 471px at full drift, at every width up to 1440 (its
  contour is traced from the desktop wave), and deeper beyond, where the
  caps scale with the width (573px at 1920, 709px at 2560). The tablet and
  mobile frames assumed a shallower wave, so their copy (309 / 267) would
  sit under the rim. The copy therefore starts the rim's drift plus the
  desktop frame's 64 gap below the rim's resting depth on every tier: 535px
  up to 1440 wide, growing with the rim beyond
  (`all-about-section.module.css`). The tiles and watermarks move down with
  it. Tiles from 535 / 824 / 866 (desktop / tablet / mobile), giving
  1835 / 2149px on desktop / tablet up to 1440 wide; on mobile the height
  follows the tiles (3128px at 360, 3562px at 430).
- **Motion** (one scroll-linked value across the section's scroll, 0.5 when
  centred, where everything is at its Figma place; written straight to
  `translate3d` on layers promoted with `will-change`, no per-frame CSS
  transitions, since Lenis smooths the scroll):
  - **Desktop:** the copy is `position: sticky` (not fixed: the footer
    Easter egg transforms the page wrapper). Its `top` is measured as
    (viewport height - copy height) / 2, so it scrolls normally until its
    centre reaches the viewport's centre, pins there, and is released at
    the end of its column (as tall as the tiles). The left column rises and
    the right column descends, sliding past each other: the right one
    starts tucked under the blob's bottom wave and emerges from behind it
    as the section enters. The watermarks rise slowly.
  - **Tablet:** no pin and no opposing motion. Tiles and watermarks both
    lag the scroll, the watermarks twice as far, for depth.
  - **Mobile:** nothing moves or pins.
  - **Reduced motion**, at any width: nothing moves or pins; everything sits
    at its Figma place.

| Token                                                             | Value                         | Use                                                                                                                                                                         |
| ----------------------------------------------------------------- | ----------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `--all-about-column-rise`                                         | 11.25rem                      | Desktop left column: rises 180px either side of its place (360px in all)                                                                                                    |
| `--all-about-column-tuck`                                         | 27.5rem                       | Desktop right column: starts 440px above its place, under the blob's bottom wave as the section enters, and descends to it at the centred point                             |
| `--all-about-column-settle`                                       | 10rem                         | Desktop right column: carries on to 160px below its place, inside the 174px under the last tile, so it never crosses into the next section                                  |
| `--all-about-mark-drift`                                          | 6rem                          | Desktop watermarks: rise 96px in all, half either side                                                                                                                      |
| `--all-about-tablet-card-drift` / `--all-about-tablet-mark-drift` | 4rem / 8rem                   | Tablet depth parallax: tiles and watermarks lag the scroll by 64px / 128px in all, half either side                                                                         |
| `--all-about-wave-depth-base` / `--all-about-wave-depth`          | 19.125rem / max(base, 21.25%) | The show-you rim's resting depth over this section: 306 units, 1:1 up to 1440 wide, then 21.25% of the width. Width-relative, so padding and margin only                    |
| `--all-about-wave-clearance`                                      | 14.3125rem                    | How far below that depth the copy starts: the rim's 165px drift plus the desktop frame's 64px gap (535px in all up to 1440)                                                 |
| `--aspect-all-about-tile`                                         | 298 / 482                     | A tile's Figma shape; mobile tiles scale with the content width at this ratio (296 x 479 at 360, 366 x 592 at 430, at most 384 wide) so their photos keep their proportions |

## Principles section

The landing page's "What we're built on." section (Figma 208:3, tablet
279:334, mobile 295:1194; the scroll mechanic adapts storyboard 572:434),
built in `src/app/landing/principles-section.tsx` with its motion in
`principles-motion.tsx` and its layouts in `principles-section.module.css`.

- **Content:** the heading (`text-mobile-section` / `text-landing-section`)
  and subline (`text-body` / `text-landing-copy`), in `TextReveal`, then four
  full-viewport principles: Tarbiyyah, Diversity, Sustainability, Societal
  Impact. Each is a photo under Figma's overlay (clear at 9.5% to 48%
  Obsidian at 110%), the word in Boldonse (`font-display`, `text-stat` 54px,
  `text-mobile-section` 30px on mobile; no `TextReveal`, the scroll is its
  entrance), a `text-body` Medium description and a dark-tone
  `StandardButton` "Learn more" to `/about`. The tablet frame's 36px heading
  and Figma's 12px mobile description have no tokens, so tablet uses the
  desktop roles and mobile uses `text-body`. Without Figma's -2% tracking,
  Diversity's description needs a 480px measure (Figma 465) to keep its two
  lines. The ghost previews of upcoming words in the frames are dropped.
- **Photos:** pre-cropped by `scripts/principles-photos.mjs` from the masters
  in `design-assets/figma/landing-2026/new-sections/` to the desktop frame
  (1440 x 1024 at 2560 wide, used on tablet too) and the mobile frame
  (360 x 808), and served art-directed through a `<picture>` built with
  `getImageProps`. They are decoded before the section arrives.
- **Pinned and scrubbed** (no reduced-motion preference, viewport taller
  than 30rem): the section is the stage plus a scroll runway. The stage
  sticks to the viewport (`position: sticky`, not fixed: the footer Easter
  egg transforms the page wrapper) and the runway's scroll scrubs the reveal
  (Motion `useScroll` across the section; Lenis drives the real scroll, so
  no Lenis code is involved). The heading opens on Warm Snow with Tarbiyyah
  peeking from below; Tarbiyyah rises to full, and the heading turns light
  where the photo reaches it. Each later principle rises over the one before
  until only that one's strip shows at the top: its word, centred, over a
  slice of its photo. Once the collapse is complete, a 40% Obsidian scrim
  fades in over the strip, the last beat. The strips accumulate below
  the header, so with Societal Impact full all four words are on screen. A
  short hold follows each principle; then the section releases straight
  into the next section (Figma's closing wave, 208:4, is not used).
- **Compositing:** panels never change size. Panel i (from 1) always fills
  the stage from the header clearance plus i strips down to its foot; it
  rises with `translate3d`, and the next panel covering it is what leaves
  its strip. The collapsing panel's word slides into its strip (scaled only
  if the strip is shorter than the word), its description and button fade
  and its photo slides up (capped so it never uncovers the panel's
  background). Its scrim stays clear throughout and fades in only once the
  collapse has finished, over the start of the hold that follows. The heading is drawn twice, Obsidian on the stage and
  Warm Snow inside the first panel (held still against its rise), so its
  colour change is the panel uncovering one copy over the other. Only
  `translate3d`, `scale` and `opacity` change per frame, on layers promoted
  with `will-change`, and only for elements whose value changed. Keyboard
  focus on a hidden "Learn more" scrolls to where that principle is fully
  revealed.
- **Stacked** (reduced motion, or a viewport 30rem tall or less): the four
  panels as normal full-height sections (at least 808px, 1024px from `md`),
  the heading in Warm Snow over the first, scrolling normally. Both layouts
  come from one server-rendered DOM and are chosen by the CSS media query
  (kept in step with `PINNED_QUERY` in the motion component), so nothing
  differs between the server and the client.
- **Mobile** pins too: profiled under mobile emulation (390 x 844, DPR 3,
  touch flings) at 4x and 6x CPU throttling, no frame exceeded 20ms while
  pinned. To fall back to the stacked layout on mobile, add
  `and (width >= 48rem)` to both queries.

Mobile values first; tablet and desktop from `md`:

| Token                                                        | Value                                               | Use                                                                                                                                                                                      |
| ------------------------------------------------------------ | --------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `--principles-stage-height`                                  | 100dvh                                              | The pinned stage, as the sticky hero                                                                                                                                                     |
| `--principles-strip-max`                                     | 6.25rem / 10.4375rem                                | A strip's height: 100px on mobile, Figma's 167px from `md`                                                                                                                               |
| `--principles-strip`                                         | min(max, room / 3)                                  | The strip: its max, or less on short screens, so the header clearance and three strips end the strip gap above the last word                                                             |
| `--principles-header-clearance`                              | 5rem / 6.0625rem                                    | The strips stack below the fixed header (80 / 97px); the first strip's band includes it                                                                                                  |
| `--principles-strip-gap`                                     | 1.5rem                                              | The least space between the last strip and the last principle's word                                                                                                                     |
| `--principles-content-bottom`                                | 5.375rem / clamp(3rem, stage - 52.5rem, 11.5625rem) | How far the button sits above a panel's foot: Figma's 86px on mobile; 185px from `md` at a 1024px stage, closing to 48px on shorter ones                                                 |
| `--principles-content-height` / `--principles-content-reach` | 13.6875rem / bottom + height                        | The tallest word-to-button block (219px), and how far its top sits above the foot                                                                                                        |
| `--principles-peek`                                          | 0.6436                                              | Where the first principle peeks from as the section arrives (Figma y 659 of 1024)                                                                                                        |
| `--principles-rise`                                          | 0.65                                                | Stage heights of scroll for the first principle to rise to full                                                                                                                          |
| `--principles-step`                                          | 0.75                                                | Stage heights of scroll for each later principle to rise and collapse the one before                                                                                                     |
| `--principles-hold`                                          | 0.5                                                 | Stage heights of scroll held after each principle, fully revealed (a long beat before the next takes over)                                                                               |
| `--principles-scrim-fade`                                    | 0.6                                                 | A fresh strip's scrim waits for its collapse to finish, then fades in over this share of the hold after it (0.09 stage heights, about 92px of scroll at 1024 tall)                       |
| `--principles-runway`                                        | stage x (rise + 4 holds + 3 steps)                  | The pinned scroll: 4.9 stages, so the section is 5.9 stages tall (6042px at 1024 tall, 4980px at 844)                                                                                    |
| `--principles-photo-shift`                                   | 0.5625                                              | How far a collapsing principle's photo slides up (Figma 576 of 1024), so its strip shows the heart of it                                                                                 |
| `--principles-photo-lower-sustainability` / `-impact`        | 0.2 / 0.16                                          | Sustainability and Societal Impact (`lowerPhoto`): drawn from their top and lowered this share of the stage on the pinned panels from tablet up, so their faces clear the earlier strips |

## Everywhere section

The landing page's "everywhere" impact section (Figma 73:164; the tablet
279:437 and mobile 296:1237 frames' layouts hold the desktop content, which
is the content of record), built in `src/app/landing/everywhere-section.tsx`
with its motion in `everywhere-motion.tsx`.

- **Wave:** the section owns its top edge, a subtle organic wave over the
  principles section above. It is the hero blob's edge (27:253, shared with
  `HeroWave`; 97 units of travel across 1440) pressed into a band
  `--everywhere-wave-height` tall: 32px at 1440, scaling with the width,
  never under 20px. It does not move.
- **Copy:** the heading ("everywhere" in `landing-cyan`) and subline in
  `TextReveal`; the closing line and "See our impact", a `StandardButton`
  that opens the 2025 annual report PDF in a new tab (full width on mobile).
- **Stats:** 200+ NeighborNets, 26 States, 10,000s of young Muslims, in
  Boldonse Royal (`text-stat` on desktop with Figma's 60px `add` icon;
  `text-mobile-display` with a "+" below `xl`) over `text-lead` /
  `text-body` SemiBold labels. A row from tablet (on desktop at Figma's 323
  and 223 gaps), a column on mobile.
- **Map:** a static image of the globe (`map.jpg`, the map clipped to the
  1440 globe with its rim, built by `scripts/everywhere-assets.mjs`), 85
  NeighborNet markers (Royal for brothers, Jade for sisters, the Figma pins)
  at their Figma places, and Figma's fade into Warm Snow over both. The frame
  is `--everywhere-map-width` wide (1440 / 1210 / 488, the globe at
  1 / 0.8406 / 0.3388 scale), centred and cropped by the section. The
  markers' positions are generated as percentages into
  `everywhere-markers.module.css`, numbered left to right.
- **Shape-photos:** four, each a tinted rim and a masked group photo
  composited into one image by the same script. On desktop at their Figma
  places, anchored to the screen's corners and drawn above the map's fade;
  on tablet (0.72x) and mobile (0.6x) at their frames' places, bleeding off
  the sides.
- **Motion,** all on the compositor (one-shot Web Animations of transform and
  opacity, created paused on their first frame and played as each part
  comes 15% into view; scroll parallax written straight to `translate3d`; no
  per-frame easing, Lenis smooths the scroll):
  - Shapes grow from 0.92 as they fade in; drift up through the section's
    scroll (`--everywhere-shape-drift` times their depth: 0.9, 0.6, 1 and
    0.75); and, with a fine pointer only, drift towards the cursor
    (`--everywhere-pointer-drift` times their depth), eased there by a CSS
    transform transition. Pointer moves are read at most once a frame and
    only while the section is on screen. No hover effect.
  - Stats rise and fade in one by one, in reading order (no count-up).
  - The map fades in growing from 0.96 as it enters view. The markers have
    their own trigger: once the map's top has risen `--everywhere-pin-trigger`
    (45%) up the viewport, so the map is properly on screen, they pin on left
    to right, each dropping in from nothing with a slight overshoot, 12ms
    after the last (about 1.4s for all 85). Once only.
  - Reduced motion: nothing is created; everything is in place. The DOM is
    the same either way, so the server and client always agree.

| Token                                                                                          | Value                               | Use                                                                                                                                                            |
| ---------------------------------------------------------------------------------------------- | ----------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `--aspect-everywhere-map`                                                                      | 1440 / 795                          | The map frame                                                                                                                                                  |
| `--everywhere-map-width`                                                                       | 30.4936rem / 75.6549rem / 90rem     | The map frame's width (mobile / tablet / desktop)                                                                                                              |
| `--everywhere-wave-height`                                                                     | max(1.25rem, 2.2222vw rounded)      | The subtle top edge's band                                                                                                                                     |
| `--ease-everywhere-enter`                                                                      | `cubic-bezier(0.22, 1, 0.36, 1)`    | Shape, stat and map entrances; the pointer drift                                                                                                               |
| `--ease-everywhere-pin`                                                                        | `cubic-bezier(0.34, 1.56, 0.64, 1)` | A marker pinning on: a slight overshoot, then settle                                                                                                           |
| `--duration-everywhere-shape` / `--everywhere-shape-from-scale`                                | 900ms / 0.92                        | A shape's grow-and-fade entrance                                                                                                                               |
| `--everywhere-shape-drift`                                                                     | 5rem                                | A shape's scroll drift across the section, times its depth                                                                                                     |
| `--everywhere-pointer-drift` / `--duration-everywhere-pointer`                                 | 0.875rem / 700ms                    | A shape's furthest drift towards the cursor (times its depth), and how long it trails it                                                                       |
| `--duration-everywhere-stat` / `--duration-everywhere-stat-stagger` / `--everywhere-stat-rise` | 700ms / 140ms / 1.5rem              | Each stat's rise-and-fade, the delay between stats, and how far each rises                                                                                     |
| `--duration-everywhere-map` / `--everywhere-map-from-scale`                                    | 900ms / 0.96                        | The map's fade-and-grow entrance                                                                                                                               |
| `--everywhere-pin-trigger`                                                                     | 45%                                 | How far up the viewport the map's top must rise before the markers start (a line, not a share of the map, which is wider than the screen on tablet and mobile) |
| `--duration-everywhere-pin` / `--duration-everywhere-pin-stagger` / `--everywhere-pin-drop`    | 420ms / 12ms / 0.75rem              | Each marker's drop-in, the delay between markers (left to right), and how far each drops                                                                       |

## Stories snippet

The landing page's stories snippet (Figma 84:219, tablet 279:507, mobile
296:1295; hover 249:59; story views 246:85 and 249:18, and their tablet and
mobile frames), built in `src/app/landing/people-stories-section.tsx`,
`people-stories-field.tsx` and `story-overlay.tsx`.

- **Content:** "But a number can't show you what it actually feels like. The
  people can." ("The people can" in `landing-cyan`) and "View Stories" (to
  `/stories`), in `TextReveal`, with six floating headshot shapes round them.
  The six stories are placeholders in one file, `story-snippets.ts` (four
  invented, flagged `placeholderStory`); the portraits and story photos are
  real. Swap the file for YM's real stories.
- **Layout:** the field follows the frames (360 x 734, 768 x 886,
  1440 x 1114), centred and capped at their widths; the headshots scale
  0.489 / 0.674 / 1. On mobile three sit above the copy and three below. On
  desktop the two right-hand headshots are placed from the right edge, so
  they stay on screen down to 1280.
- **Motion:** the shared shape motion (`src/lib/shape-motion.ts`, also used
  by the everywhere section): each headshot grows and fades in on entering
  view and, with a fine pointer, drifts towards the cursor; a slow CSS float
  (`--stories-float-*`) keeps them alive, each on its own period. They do not
  orbit.
- **Hover pop** (fine pointer, or keyboard focus): the headshot's own
  silhouette (`mask-*.png`, its alpha, built by `scripts/stories-assets.mjs`)
  sits behind it at `--stories-pop-size`, in a colour picked at random from
  the brand palette less Warm Snow and white (never the colour that headshot
  showed last), and slides out from `--stories-pop-from-scale`. Transform and
  opacity only; no other hover effect.
- **Story overlay:** clicking opens that person's story over the page (not a
  route) in the hover's colour (on touch, a colour picked then). The overlay
  is the `BlobReveal` layer itself: it sweeps in from a random side to cover
  the page, the content fades in (`--duration-stories-fade`); closing fades
  the content and sweeps the blob back out the way it came. It is a Base UI
  dialog portalled into `<body>` (focus trap, Escape, inert page, scroll lock;
  Lenis stopped while open); Back closes it (one same-URL history entry), and
  the page keeps its scroll position. Text, and the "View the full story"
  button's tone, flip by the colour's luminance (`needsDarkText` in
  `brand-palette.ts`, the page transition's threshold). The button goes to
  `/stories/[slug]` through the page transition, whose cover sweeps over the
  overlay.
- **Story view layout:** the whole story fits one screen with no scrolling
  (the overlay's scroller is only a fallback for extreme screens): the text
  keeps its natural height (sizes trimmed from Figma's: pull-quote
  `text-landing-copy`, `text-mobile-display` from `xl`; narrative and
  attribution `text-body`, `text-landing-copy` from `xl`) and the photo band
  takes the rest, up to `--stories-photo-height` and down to
  `--stories-photo-min`. On landscape phones (the `short:` height) the photo
  is a column beside the text. Each photo is pre-cropped to its Figma framing
  (`scripts/stories-assets.mjs`; Mustafa's to the front row, as in 249:18).
  Desktop's band is wide and short, so Maryam, Layla, Bilal and Yusuf have a
  wider desktop crop each (art-directed from `xl`), 2.4:1 with the face 30%
  down and shown at `object-position: 50% 30%`, keeping the face above the
  wavy edge at any desktop band height.
- **Layered edges (desktop):** the hero wave's own pair, as in `HeroWave`:
  one blob, and the same blob bigger and offset below it, drawn in one frame
  `--stories-pair-height` tall at the photo's foot (masks `edge-pair-photo`
  and `edge-pair-band`). The photo shows above the smaller copy's edge, the
  random colour between the two, and the lighter band (Warm Snow at 10% over
  the colour) below the bigger copy's edge: the site's two-tone layered
  depth, with no new shade. Tablet and mobile keep their single-edge masks.
  The photo band is cut along a wavy edge, then the colour with a lighter band (Warm Snow at 10%) under
  a mirrored wavy edge (both edges the site's hero-blob edge, as masks), the
  quote mark (Figma's vector, white at 6%), the pull-quote, the narrative and
  the attribution. Desktop sets the quote beside the narrative; tablet stacks
  them (the quote centred); mobile centres everything, with a full-width
  button. The close button is the site's shared `.ym-close` (Material
  `close` on a white square, turning 90deg on hover, as in the menu; no turn
  under reduced motion) and stays top right.
- **Reduced motion:** no entrance, drift or float; the pop appears without
  sliding; the overlay opens and closes at once. The DOM is the same either
  way, so the server and client agree.

| Token                                                                        | Value                            | Use                                                                                                                                                       |
| ---------------------------------------------------------------------------- | -------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `--duration-stories-shape` / `--stories-shape-from-scale`                    | 900ms / 0.92                     | A headshot's grow-and-fade entrance (the everywhere section's values)                                                                                     |
| `--stories-pointer-drift` / `--duration-stories-pointer`                     | 0.875rem / 700ms                 | A headshot's furthest drift towards the cursor (times its depth), and how long it trails                                                                  |
| `--stories-float-distance` / `--duration-stories-float`                      | 0.5rem / 6s                      | The idle float's rise and period (each headshot 0.9 to 1.2 times it, out of step)                                                                         |
| `--stories-pop-size` / `--stories-pop-from-scale` / `--duration-stories-pop` | 135% / 0.74 / 420ms              | The pop's size behind the headshot (1.35x, subtler than Figma's 1.54x), its resting scale (about 1 / 1.35, hidden behind the portrait), and its slide-out |
| `--ease-stories`                                                             | `cubic-bezier(0.22, 1, 0.36, 1)` | The pop, the drift and the content fade                                                                                                                   |
| `--stories-photo-height` / `--stories-photo-min`                             | 22rem / 28rem / 37.5rem; 6.25rem | The story view's photo band at most (mobile / tablet / desktop), and at least when the text needs the room                                                |
| `--stories-edge-height` / `--stories-edge-seam`                              | max(2.5rem, 4.5vw rounded) / 1px | The wavy edges' height, and their masks' overlap so no hairline shows                                                                                     |
| `--stories-pair-height`                                                      | min(11vw, 14dvh), rounded        | Desktop's layered-edge frame (143px at 1440 x 1024, 101px at 1280 x 720)                                                                                  |
| `--duration-stories-fade`                                                    | 400ms                            | The story's content fading in once covered, and out before the blob leaves                                                                                |

## Site footer

The shared footer (Figma 273:618, tablet 280:843, mobile 298:1459), in
`src/components/site/site-footer.tsx`, with `footer-scroll-layers.tsx`
(client: the shapes and tagline motion), `footer-shapes.ts` (the shape
paths) and `site-footer.module.css`. Every page inherits it from the root
layout.

- **Easter egg (load-bearing, unchanged):** the bottom-edge montage, its
  listeners (scroll, resize, wheel, touch, keydown), `isAtPageBottom`,
  `canPlay` (footer on screen, no `<html>` overflow lock from the entry
  animation or menu, no open dialog), the page translation it shares with
  the header through `FooterPageStage`, and its timings are left exactly as
  they were. The visual layers below only write transforms on their own
  elements inside the clipped wrapper and change no layout. Verify with
  `bun run test:footer` (batch routes with `FOOTER_AUDIT_ROUTES`).
- **Dark surface:** one organic shape (`.surface`): the Obsidian ground with
  the wavy top as its own edge (`footer/wave.svg`, a vector band over the
  solid body), rising `--footer-wave-height` above the footer's box. It is
  absolutely positioned, so the box (794px on mobile, 525 from tablet, its
  bottom the document's bottom, which the Easter egg reads) is unchanged.
  It is the clip for the shapes and tagline, so the shapes rise into the
  wave and are cut by its curve, not a straight line.
- **Layout:** Desktop: the
  logo (to `/`), the nav and the contact block in a row at 80px insets;
  tablet: logo and contact left, nav right; mobile: stacked and centred at
  32px gutters. The bottom line: "© Young Muslims 2026" and "Made by Kalos
  Studio" (Slate, underlined, to kalos.so in a new tab), the four social
  links (32px, new tabs) and Privacy Policy / Donor Privacy (PLACEHOLDER
  links, `/privacy` and `/donor-privacy`), all `text-footer-legal` Bold.
- **Nav:** two columns (Find a Chapter, Who We Are, Stories, Donate; The
  Feed, Store), `text-nav` SemiBold Warm Snow; hover is the label roll only
  (`.ym-cta-roll`, no arrow).
- **Contact:** the copy and "Contact us", the dark `StandardButton` (Warm
  Snow on Obsidian), to `/contact`.
- **Shapes (all sizes; tablet and mobile added beyond the frames):** a
  royal pair from the left
  and a jade pair from the right (the green turned
  `--footer-shape-rotation`), each the brand colour with its smaller partner
  under a 10% Warm Snow layer (Figma's lighter shades, no extra colours).
  Placed in units of `--footer-shape-unit` (the desktop frame's height;
  10rem on mobile and 15rem on tablet, so they read subtly), so they keep
  their size at any width. On mobile and tablet each pair rests lower
  (`--footer-shape-offset-*`), so its crest stays below the seam with the
  section above. As the footer scrolls into view they slide in from
  `--footer-shape-drift` out, and recede on the way back up.
- **Tagline:** "FOR THE YOUTH. BY THE YOUTH." in Boldonse, Warm Snow at 12%
  (`text-footer-tagline`, `-tablet`, `-mobile`: 40 / 38 / 29px, as
  Boldonse's glyphs stand about 1.21x the font size), drifting `--footer-marquee-drift` with the scroll (the show-you
  marquee's mechanic).
- **Wavy top:** the surface's own edge is the hand-off on pages without
  `ClosingCta`; where `ClosingCta` is used, its wavy foot (with the
  parallax) meets it over the Obsidian band.
- **Social icons:** each `footer-*.svg` holds its own glyph (Facebook and X
  were swapped on disk and are fixed), which also fixes the menu's icons.
- **Reduced motion:** the shapes sit in place and the tagline is still; the
  label roll and button hover are instant; the Easter egg is suppressed as
  before. The DOM is the same either way.

| Token                                           | Value                                                         | Use                                                                                                             |
| ----------------------------------------------- | ------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------- |
| `--text-footer-legal`                           | 0.625rem, -2%                                                 | The bottom line                                                                                                 |
| `--text-footer-tagline` / `-tablet` / `-mobile` | 2.5rem / 2.375rem / 1.8125rem, -2%                            | The tagline (Figma's 48.6 / 46.2 / 35.3px-tall glyphs)                                                          |
| `--footer-frame-height`                         | 32.8125rem                                                    | The desktop frame's height: the unit the shapes are placed in                                                   |
| `--footer-shape-unit`                           | 10rem / 15rem / frame height                                  | The shapes' unit on mobile / tablet / desktop                                                                   |
| `--footer-shape-offset-blue` / `-green`         | 1rem / 12.5rem (mobile), 1.5rem / 18rem (tablet), 0 (desktop) | How much lower each pair rests on the smaller screens, so its crest stays below the seam with the section above |
| `--footer-wave-height` / `--footer-wave-seam`   | 6.875rem / 1px                                                | The wavy top band above the box, and its mask seam                                                              |
| `--footer-shape-rotation`                       | 30deg                                                         | The green pair's turn                                                                                           |
| `--footer-shape-drift`                          | 3rem / 4.5rem / 6rem                                          | How far out the shapes start (mobile / tablet / desktop)                                                        |
| `--footer-marquee-drift`                        | 30rem                                                         | The tagline's drift (half either side of its place)                                                             |

## Closing CTA

The closing call to action above the footer (Figma 270:301, tablet 280:788,
mobile 297:1442): `ClosingCta` in `src/components/site/closing-cta.tsx`
(server), with `closing-cta-photo.tsx` (client: the photo's parallax only)
and `closing-cta.module.css`. Shared by every page, each with its own photo.

- **API:** `<ClosingCta image={photo} alt="…" imageFocus="low" />`. `image`
  is a static import, `alt` its description, and `imageFocus` frames it
  (`"center"` by default; `"low"` for a tall photo whose subject sits low
  in it: on mobile and tablet the photo's box is made taller than its layer
  (`--closing-cta-low-height-mobile` / `-tablet`), anchored at its foot, so
  the photo is drawn larger and the subject rides higher; desktop anchors the
  subject with `--closing-cta-low-focus-desktop`, so it stays the same
  distance below the top at any width and is never cropped on ultra-wide
  screens). The mission line ("Seeking the pleasure of Allah (SWT) by
  empowering Muslim youth.") is the same everywhere and is not a prop. The
  landing page and the blog pass the YMATX railing photo
  (`landing-2026/cta/ymatx-railing.jpg`).
- **Shape:** each frame's organic silhouette is a vector mask (an SVG
  path, crisp at any width) over the whole section
  (`shape-{mobile,tablet,desktop}.svg`, traced by
  `scripts/closing-cta-assets.mjs` from Figma's exports), stretched to the
  width. Its wavy top hands off from the Warm Snow section above. Its wavy
  foot is an Obsidian cap over the photo (`foot-*.svg`, running 120 units
  past the section's foot), which drifts `--closing-cta-foot-drift` with the
  scroll (the footer's wave parallax lives here, where it shows), over an
  Obsidian band that runs into the footer. The photo is full-bleed
  inside it, under a 40% Obsidian overlay.
- **Parallax:** the photo drifts `--closing-cta-drift` in all within the
  shape as the section scrolls past (translate3d on its own layer, which is
  that much taller than the shape); the shape stays put. Under reduced
  motion the photo is still.
- **Layout:** desktop sets the mission line (`text-landing-section`
  ExtraBold, Warm Snow, 692 wide) left and the buttons (312 wide, stacked
  32 apart) right, both centred vertically (Figma's 129 / 226 insets);
  tablet stacks them left-aligned, centred in the section; mobile centres the
  line (`text-mobile-section`) and stacks full-width buttons between the
  32px gutters. Content caps at 1440.
- **Buttons** (box buttons, `text-cta` Bold, 61px tall): "Get involved"
  (Warm Snow fill, Obsidian text, to `/contact`) and "Support us" (1px Warm
  Snow outline, Warm Snow text, to `/support`), both with the label roll
  and the diagonal ↗ launch (`AnimatedCtaLabel arrowMotion="diagonal"`) on
  the standard button's timing. "Support us" also fills: a Warm Snow fill
  rises from the bottom (a compositor `scaleY`) as its text and arrow turn
  Obsidian. Under reduced motion there is no roll or launch and the fill is
  there at once.

| Token                                                                                             | Value                   | Use                                                                                                                                                    |
| ------------------------------------------------------------------------------------------------- | ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `--text-cta`                                                                                      | 1.125rem, -2%           | The box buttons' labels                                                                                                                                |
| `--closing-cta-drift`                                                                             | 10rem                   | The photo's scroll drift within its shape (160px in all; its layer is that much taller, so no edge shows)                                              |
| `--closing-cta-foot-drift`                                                                        | 4rem                    | The wavy foot cap's scroll drift (64px in all)                                                                                                         |
| `--closing-cta-low-height-mobile` / `-tablet`                                                     | 130% / 150%             | `imageFocus="low"`: the photo box's height against its layer on mobile / tablet                                                                        |
| `--closing-cta-low-focus-desktop`                                                                 | calc(14.4375rem - 87vw) | `imageFocus="low"` on desktop: the photo's top against its box, keeping the subject fixed as the frame widens (1440 unchanged; heads in frame at 2560) |
| `--duration-standard-button` / `--ease-standard-button` / `--duration-standard-button-swap-delay` | (Standard button)       | The buttons' fill, roll and launch timing                                                                                                              |

## Word on the street

The landing page's blog snippet (Figma 270:289, tablet 280:735, mobile
297:1394; hover 270:511), built in `src/app/landing/word-on-the-street-section.tsx`
(server), `street-articles.ts` (data), `street-cards-motion.tsx` (client: the
cards' entrance only) and `word-on-the-street-section.module.css`.

- **Content:** "Word on the street." and its subline (Obsidian, in
  `TextReveal`) with "View latest" (`StandardButton`, to `/blog`) beside them
  from tablet, under them (full width) on mobile; then three article cards,
  one swappable array in `street-articles.ts`. Each whole card is a link to
  its report's PDF (new tab, `rel="noopener noreferrer"`): the photo in its
  organic blob, the title (`text-article-title`, Obsidian), the date and
  author (`text-article-meta`, Jade; Figma's placeholder "October 1, 2026 •
  Muneeb Syed", flagged editable in the data) and the description
  (`text-nav` Medium, `text-caption`).
- **Layout:** desktop sets the cards in a row of three, 378 wide and 68
  apart (Figma's 90 / 80 insets, capped at 1440); tablet in two columns;
  mobile in one, spanning the full width between the 32px gutters.
- **Photos:** each is pre-cropped to its card's image box exactly as the
  Figma frame places it, and each blob's silhouette is a mask from the Figma
  vector's alpha (`scripts/street-assets.mjs`: `photo-*.jpg`,
  `mask-*.png`). The judgement card uses its desktop blob at every size
  (Figma's tablet and mobile frames use a slightly wider variant).
- **Hover** (fine pointer, or keyboard focus): the blob grows into the full
  square. The photo never moves: over it sits a Warm Snow frame (the
  section's colour) with the blob cut out of it (`mask-*.png`, excluded from
  a full rect), and the frame scales up from the blob's centre to
  `--street-reveal-scale`, past the 1.862 the widest blob needs to clear its
  box's corners; the box clips the frame, so the hole opens out to the
  square's edges. One compositor transform, no path morph and no mask
  animation. The 32% Obsidian overlay (under the frame, so only the revealed
  photo darkens) fades in faster (`--duration-street-label`), and "Read article" (`text-landing-copy`
  Bold, white, Material `arrow_outward`) rises `--street-label-rise` into
  the middle, over `--duration-street-hover`. Un-hovering shrinks the frame
  back to the blob. No hover on touch.
- **Entrance:** the heading's `TextReveal`; each card's photo grows from
  `--street-card-from-scale` as it fades in (the shared shape motion).
- **Reduced motion:** no entrance; on hover the square, overlay and label
  appear at once, with no growth. The DOM is the same either way, so the server and client
  agree.

| Token                                                 | Value                               | Use                                                                                              |
| ----------------------------------------------------- | ----------------------------------- | ------------------------------------------------------------------------------------------------ |
| `--color-caption` (`text-caption`)                    | `#484848`                           | The cards' descriptions                                                                          |
| `--text-article-title` / `--text-article-meta`        | 1.125rem / 0.75rem, -2%             | The cards' title and date + author                                                               |
| `--duration-street-card` / `--street-card-from-scale` | 900ms / 0.92                        | A card photo's grow-and-fade entrance                                                            |
| `--street-reveal-scale`                               | 2                                   | How far the Warm Snow frame scales on hover, so the blob clears the box (the widest needs 1.862) |
| `--duration-street-hover` / `--street-label-rise`     | 800ms / 0.5rem                      | The shape's growth into the square, and how far "Read article" rises                             |
| `--duration-street-label`                             | 320ms                               | The overlay and "Read article" fading (and rising) in: quicker than the shape                    |
| `--ease-street`                                       | `cubic-bezier(0.22, 1, 0.36, 1)`    | The card entrance                                                                                |
| `--ease-street-hover`                                 | `cubic-bezier(0.45, 0.05, 0.25, 1)` | The hover: a gentle ease-in-out, so the blob swells into the square fluidly                      |

## NeighborNet switcher

The landing page's "Let's find your story" section (Figma 251:509, tablet
279:645, mobile 296:1365), built in `src/app/landing/neighbornets-section.tsx`
(server: the section, the copy and "View all NeighborNets"),
`neighbornets-backdrop.tsx` (client: the section's background shape and its
parallax) and `neighbornet-switcher.tsx` (client: the names, the tile, its
shape and their motion), styled by `neighbornets-section.module.css`.

- **Content:** "Let's find your story." and its subline (Warm Snow, in
  `TextReveal`), the NeighborNet names in Boldonse caps (`text-stat` on
  desktop, `text-landing-section` below), "View all NeighborNets" (dark
  `StandardButton`, to `/neighbornets`), and the selected NeighborNet's photo
  tile: its city in Boldonse, its state (Figtree Bold caps) and "Visit" (dark
  `StandardButton` at its own width, to `/neighbornets`), over a gradient
  into Obsidian. The NeighborNets are one swappable array, `neighbornets.ts`
  (Houston, Stamford, Suwanee, Tampa, Brooklyn): city, state, highlight
  colour class (Brass, Slate, Jade, Sky, Buttercup), photo (pre-cropped to the tile by `scripts/neighbornets-assets.mjs`: Houston framed from its full-resolution original, the group across the tile with faces about 30% down and its exposure matched to the Figma fill; the others to their Figma framing) and shape
  (the Figma vector's path, Houston's 29.9deg turn baked in). The selected
  name shows in its highlight colour, the others in white; Houston is
  selected at first.
- **Background shape (two-tone pair + parallax):** the section's backdrop is
  a dark organic shape on the Warm Snow of its neighbours, as the show-you
  section's blob: an Obsidian body with an organic cap at each end, and
  behind each cap the same shape, bigger and offset, in Landing Twilight (the
  show-you rims' colour). The edges are the hero wave's own pair (`HeroWave`:
  the photo blob for the bigger copy, the pale blob for the Obsidian edge) in
  their 246-unit frame, pressed into `--neighbornets-edge-height`; the
  bottom cap is the top one turned round. As the section scrolls past, the
  top edge rises `--neighbornets-edge-drift` (110px, the show-you blob's
  drift) over the first half and the bottom edge falls by the same over the
  second, the bigger copies moving half as much again (165px), so the pair parts as it breathes (one translate3d per
  cap). The edges only move outward, into `--neighbornets-edge-headroom`:
  Warm Snow room the section keeps above and below the shape (the bigger
  copy's 165px and a little more), so no edge is ever cut off, and each cap
  draws far enough into the body that no gap opens. The caps stay inside
  the section (they would otherwise cover the stories
  snippet's headshots), and the content is masked to the Obsidian edge at
  rest (`edge-mask-*.svg`, built by the script), so the tile's shape never
  shows past it.
- **Layout:** desktop puts the copy, names and button in the left column and
  the 484 x 547.6 tile (`aspect-neighbornets-tile`) on the right (Figma's 90
  / 140 insets); tablet sets the copy across the top, then the names and the
  tile, against the right edge; mobile sets the tile with the names over it.
  The tile is the desktop tile at most and scales down proportionally
  (`--neighbornets-tile-width`: the full width on phones, half of it on
  tablets, never over 484px), with the same photo framing and overlay
  composition at every size.
- **Selection, tablet and desktop:** click or tap a name. The tile pins at
  the viewport's centre (`position: sticky`, never fixed: the footer Easter
  egg transforms the page; `--neighbornets-tile-top`) while the left column
  scrolls by. The tile sits in its own grid-area wrapper, which is its sticky
  containing block (a grid item's would be the whole grid).
- **Selection, mobile:** scroll-driven, no tapping. The tile pins near the
  top; the names run in a long column over it, each in a
  `--neighbornets-name-step` step, centred. The name in the tile's name slot
  (`--neighbornets-name-inset` down, where the tile's own, hidden, name would
  be) sticks there until the next pushes it out, and the script makes the
  name nearest the slot the selection. The last name holds the slot for a
  full step; the list ends `--neighbornets-names-end` below it, so the last
  name and the tile leave together.
- **Card-stack switch:** every NeighborNet's card is stacked in the tile, and
  every NeighborNet's shape behind it. On a switch the old card and its shape
  slide right `--neighbornets-slide` and fade away above the new ones,
  quickly (`--duration-neighbornets-slide`), while the new ones expand into
  place from `--neighbornets-reveal-from-scale` over the longer
  `--duration-neighbornets-reveal`, so the expand-in still reads after the
  old card has gone, as if stacked just behind: card and shape move as one stack (Web Animations of
  translate3d, opacity and scale; each card clips its own photo, so it can
  slide out past the tile). A switch mid-reveal cancels it cleanly.
- **The tile's shape:** a single organic shape per NeighborNet (Warm Snow at
  7% over Obsidian, Figma's `#262639`), placed as in Figma relative to the
  tile so it pins with it, drifting up to `--neighbornets-shape-drift` as the
  section scrolls past (one translate3d on its layer).
- **Reduced motion:** the cards and shapes swap at once, nothing drifts.
  Mobile has no scroll-driven progression: the names become a plain list of
  buttons under the tile, tapped to switch, and the tile shows its own name
  (CSS, under `prefers-reduced-motion: reduce`). The DOM is the same either
  way, so the server and client agree.

| Token                                                              | Value                                               | Use                                                                                                                                      |
| ------------------------------------------------------------------ | --------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| `--aspect-neighbornets-tile`                                       | 484 / 547.6                                         | The photo tile                                                                                                                           |
| `--neighbornets-tile-width`                                        | min(100vw, 30.25rem); min(50vw, 30.25rem); 30.25rem | The tile: the desktop tile at most, scaled down proportionally                                                                           |
| `--neighbornets-tile-top`                                          | 5rem; max(1rem, 50dvh - tile width x 0.5657)        | Where the tile pins: under the header on mobile, centred in the viewport from tablet                                                     |
| `--neighbornets-edge-height`                                       | clamp(4rem, 7.5vw rounded, 7rem)                    | The background shape's caps (the hero pair's 246-unit frame)                                                                             |
| `--neighbornets-edge-drift` / `--neighbornets-edge-headroom`       | 6.875rem / 1.5 x drift + 0.5rem                     | How far the Obsidian edges drift outward (110px, as show-you; the bigger copies 1.5x, 165px), and the Warm Snow room kept for it (173px) |
| `--neighbornets-edge-seam`                                         | 1px                                                 | The content mask's overlap, so no hairline shows                                                                                         |
| `--neighbornets-name-step` / `--neighbornets-name-inset`           | 26.5rem / tile width x 0.448                        | Mobile: the names' spacing, and the tile's name slot (217 / 484 of the tile down)                                                        |
| `--neighbornets-name-top` / `--neighbornets-names-end`             | tile top + name inset / tile width x 0.6834 - 3rem  | Mobile: where a name sticks, and the list's end below the last step                                                                      |
| `--neighbornets-slide` / `--neighbornets-reveal-from-scale`        | 5rem / 0.94                                         | The switch: how far the old card and shape slide right, and the scale the new ones expand from                                           |
| `--duration-neighbornets-slide` / `--duration-neighbornets-reveal` | 380ms / 600ms                                       | The switch: the old card and shape sliding out (snappy), and the new ones expanding in                                                   |
| `--neighbornets-shape-drift`                                       | 3rem                                                | The tile's shape's scroll drift across the section                                                                                       |
| `--ease-neighbornets`                                              | `cubic-bezier(0.33, 1, 0.68, 1)`                    | The switch (an ease-out cubic, so the expand-in reads across it)                                                                         |

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

The cover colours (and their contrast check) live in `src/lib/brand-palette.ts`, shared with the stories snippet. They are the full brand palette: Deep Obsidian, Warm Snow, Royal
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
landing page's fonts, images and hero video (the video capped at 5s, and the
whole asset wait, entry photos included, capped at 5s from mount so a stalled
or failed asset can never trap the visitor), then wipes away
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
