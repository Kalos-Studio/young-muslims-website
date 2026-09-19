# Young Muslims design system

This file is the implementation contract between the Young Muslims 2026 Figma
brand kit and the website. Figma is the visual source of truth. The tokens in
`src/app/globals.css` are the production translation used by Tailwind CSS 4.

The brand kit currently documents its colors and typography on canvas frames;
it does not publish them as Figma variables or text styles. Values therefore
move into code through this reviewed mapping rather than automatic syncing.

## Typography

- **Boldonse Regular** is the display face. Use `font-display` for primary,
  expressive headlines only.
- **Figtree** is the default face. `font-sans` applies it to body copy,
  navigation, controls, labels, and supporting headings.
- **Geist Mono** remains available as `font-mono` for technical and prototype
  tooling. It is not part of the visitor-facing brand system.

The website hierarchy is:

| Role                               | Typeface and weight                           |
| ---------------------------------- | --------------------------------------------- |
| Display and primary page headings  | Boldonse Regular (`font-display font-normal`) |
| Section headings                   | Figtree Bold (`font-bold`)                    |
| Supporting headings and navigation | Figtree Semibold (`font-semibold`)            |
| Body copy                          | Figtree Medium (`font-medium`)                |

Boldonse has one approved weight. Do not combine `font-display` with a bold
utility: that asks the browser to synthesize a weight that does not exist.

Fonts are loaded and self-hosted by Next.js from `src/app/layout.tsx`.

The brand book shows a fixed-format hierarchy, but the responsive website type
scale is not yet specified. The existing `text-display` and `text-h1` through
`text-h4` size tokens remain the prototype scale until responsive page designs
define the production scale. Do not add new one-off heading sizes in the
meantime.

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

## Rules for implementation

1. Search existing semantic and brand tokens before adding a color or font.
2. Do not use raw hex values in page or component class names.
3. Do not create a `tailwind.config.ts`; Tailwind 4 configuration lives in
   `src/app/globals.css`.
4. Do not create another brand shade by lightening, darkening, or mixing a
   primitive. Functional mixtures belong only in the semantic UI layer.
5. Use `font-display` intentionally for page-defining or expressive headings;
   ordinary headings and UI copy use Figtree.
6. Keep wireframe-only `wf-*` tokens isolated. Delete them with the wireframe,
   following `WIREFRAME.md`.
7. The brand kit does not define a dark theme. Do not introduce one without an
   approved design.
