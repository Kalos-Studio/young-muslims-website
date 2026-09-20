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

These are the approved desktop values. Responsive behavior is not yet defined
by mobile website frames, so do not invent responsive sizes. Keep the desktop
role unchanged until a mobile design supplies its corresponding value.

## Brand color primitives

These values are exact and must not be altered.

| Tailwind token      | Brand name        | Value     | Intended use                        |
| ------------------- | ----------------- | --------- | ----------------------------------- |
| `brand-obsidian`    | Deep Obsidian     | `#171725` | General dark foundation and text    |
| `brand-warm-snow`   | Warm Snow         | `#FCFAF8` | General light foundation            |
| `brand-royal`       | Royal Blue        | `#234080` | General or Brothers accent and text |
| `brand-jade`        | Jade Foliage      | `#397451` | General or Sisters accent and text  |
| `brand-pure-white`  | Pure White        | `#FFFFFF` | Reversed content and clean surfaces |
| `brothers-midnight` | Midnight Blue     | `#16294F` | Brothers dark foundation and text   |
| `brothers-slate`    | Cool Slate        | `#99ADC8` | Brothers large fills and accents    |
| `brothers-sky`      | Sky Blue          | `#4A90D9` | Brothers large fills and accents    |
| `sisters-forest`    | Deep Forest Green | `#043222` | Sisters dark foundation and text    |
| `sisters-brass`     | Warm Brass        | `#D8AA45` | Sisters large fills and accents     |
| `sisters-buttercup` | Buttercup Yellow  | `#EBD255` | Sisters large fills and accents     |
| `landing-cyan`      | Landing Cyan      | `#23B8C0` | Highlighted words on the homepage   |
| `landing-blush`     | Landing Blush     | `#E3D6D6` | Homepage story-card surfaces        |
| `landing-card-ink`  | Card Ink          | `#000000` | Homepage story-card text            |

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
