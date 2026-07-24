---
name: Jylhis Design System — The Survey
description: A topographic survey of one engineering identity — cool near-white/near-black grounds, Modus-grounded palette, one bronze benchmark, contour linework over engraved plate titles.
colors:
  bg: "#f6f8fb"
  bg-subtle: "#eef2f6"
  surface: "#e6ecf1"
  surface-raised: "#fcfdff"
  text-heading: "#12141a"
  text: "#23262e"
  text-muted: "#565a63"
  text-faint: "#878c95"
  accent: "#8a4d00"
  accent-hover: "#a75f0a"
  benchmark: "#b5450e"
  contour: "#2f4fb0"
  contour-faint: "#7f8fb5"
  border: "#cfd6de"
  border-strong: "#aab4c0"
  status-err: "#a60000"
  status-warn: "#8a5000"
  status-ok: "#006800"
  status-info: "#005e8b"
  syn-keyword: "#5317ac"
  syn-string: "#2544bb"
  syn-number: "#0031a9"
  syn-function: "#721045"
  syn-builtin: "#8f0075"
  syn-type: "#005a5f"
  syn-variable: "#0044aa"
  syn-comment: "#595959"
  syn-docstring: "#2a5045"
typography:
  display:
    fontFamily: "Zilla Slab, Roboto Slab, Rockwell, Georgia, serif"
    fontSize: "3.25rem"
    fontWeight: 700
    lineHeight: 1.02
    letterSpacing: "0"
  title:
    fontFamily: "Zilla Slab, Roboto Slab, Rockwell, Georgia, serif"
    fontSize: "2rem"
    fontWeight: 600
    lineHeight: 1.05
    letterSpacing: "0"
  headline:
    fontFamily: "Hanken Grotesk, Inter, system-ui, sans-serif"
    fontSize: "1.4rem"
    fontWeight: 600
    lineHeight: 1.3
    letterSpacing: "0"
  body:
    fontFamily: "Hanken Grotesk, Inter, system-ui, sans-serif"
    fontSize: "1.0625rem"
    fontWeight: 400
    lineHeight: 1.6
  label:
    fontFamily: "IBM Plex Mono, JetBrains Mono, ui-monospace, monospace"
    fontSize: "0.75rem"
    fontWeight: 500
    lineHeight: 1.4
    letterSpacing: "0.1em"
  code:
    fontFamily: "IBM Plex Mono, JetBrains Mono, ui-monospace, monospace"
    fontSize: "0.85em"
    fontWeight: 400
    lineHeight: 1.6
  scale:
    step-0: "3.25rem"
    step-1: "2rem"
    step-2: "1.4rem"
    step-3: "1.15rem"
    step-4: "1.0625rem"
    step-5: "0.95rem"
    step-6: "0.85rem"
    step-7: "0.8rem"
    step-8: "0.75rem"
    step-9: "0.72rem"
rounded:
  xs: "2px"
  sm: "3px"
  md: "4px"
  pill: "999px"
spacing:
  2xs: "0.125rem"
  xs: "0.25rem"
  sm: "0.5rem"
  md: "1rem"
  lg: "1.5rem"
  xl: "2rem"
  2xl: "3rem"
  3xl: "4rem"
components:
  button-primary:
    backgroundColor: "{colors.accent}"
    textColor: "{colors.bg}"
    rounded: "{rounded.sm}"
    padding: "0.5rem 1rem"
  button-primary-hover:
    backgroundColor: "{colors.accent-hover}"
    textColor: "{colors.bg}"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.text-heading}"
    rounded: "{rounded.sm}"
    padding: "0.5rem 1rem"
  button-ghost-hover:
    textColor: "{colors.accent}"
  tag:
    backgroundColor: "{colors.bg-subtle}"
    textColor: "{colors.text-muted}"
    rounded: "{rounded.sm}"
    padding: "0.15em 0.55em"
  card:
    backgroundColor: "{colors.surface-raised}"
    textColor: "{colors.text}"
    rounded: "{rounded.md}"
    padding: "1rem"
  card-subtle:
    backgroundColor: "{colors.bg-subtle}"
    textColor: "{colors.text}"
    rounded: "{rounded.md}"
    padding: "1rem"
  input:
    backgroundColor: "{colors.bg}"
    textColor: "{colors.text}"
    rounded: "{rounded.sm}"
    padding: "0.5rem"
  callout:
    backgroundColor: "transparent"
    textColor: "{colors.text}"
    rounded: "{rounded.md}"
    padding: "1rem 1.5rem"
  plate:
    backgroundColor: "{colors.surface-raised}"
    textColor: "{colors.text}"
    rounded: "{rounded.sm}"
    padding: "1.5rem"
---

# Design System: Jylhis Design System — The Survey (v2)

## Direction contract

<!-- The five-block contract this world was committed against. The build is
     audited against this, not against a mood. -->

- **THESIS.** The design system *is a topographic survey*: one datum
  (`tokens.json`), every surface a sheet triangulated to it. It refuses both
  category defaults it was born between — the neutral Storybook swatch-grid, and
  its warm-cream-editorial opposite (which was v1). It is not warm, not neon, not
  empty; it is calm, cool, precise, and information-dense in an *ordered* way.
- **OWN-WORLD.** Cool near-white (`Sheet`) / near-black (`Field`) grounds, never
  pure. Modus-grounded palette (AAA, tritanopia-aware): one **bronze** interactive
  accent, **Modus blue** structural contour linework, a **benchmark vermilion**
  datum mark. **Zilla Slab** plate titles over **Hanken Grotesk** UI/body
  and **IBM Plex Mono** data. Chrome is cartographic: graticule ticks, contour
  rings, trig-station triangles, scale bars, legends, title blocks.
- **STORY.** The visitor understands that a single measured source produces one
  identity everywhere, that its accessibility is *plotted, not asserted*, and
  that this is one engineer's instrument for keeping every tool in register.
- **FIRST VIEWPORT.** Left: eyebrow, engraved title "One datum. / Every sheet.",
  lede, bronze primary + ghost CTA. Right: the survey plate — concentric contour
  rings around the central `tokens.json` datum benchmark, dashed triangulation
  lines out to labelled surface trig-stations, scale bar, coordinate collar.
- **FORM.** Cartographic survey (grounded direction "The Survey"), staged as a
  self-surveying plate that renders in on load. Seed key `c9c7e1b7` (re-roll of
  `7330754f`); committed over dealt challengers by user brief-pin on calm/cool/
  precise/instrument qualities.

## Overview

**Creative North Star: "The Survey."**

This is one engineer's identity kept as a topographic survey. `tokens.json` is
the **datum** — the single geodetic reference every surface is fixed to. The
terminal, the editor, the tiling desktop, the phone, and the website are each a
**sheet** of one atlas, a **trig station** triangulated back to that datum;
change the datum and every sheet re-surveys. Accessibility is not claimed, it is
**contoured**: every contrast floor is a measured threshold, and a role that
falls below its floor does not print.

The system has two editions and only two, both first-class, tuned independently
rather than mirrored: **Sheet** (the light, printed survey) and **Field** (the
dark, night field-book). They are the *source and output* of one survey. Extra
colour-vision editions (tritanopia, deuteranopia, following Modus) may ship as a
bonus, but never at the expense of Sheet/Field parity.

Depth is flat by doctrine: no shadow, no gradient, no glass. Elevation is tonal
layering across the ground steps plus 1px **hairlines** drawn like survey
linework. Motion is the "survey renders in" grammar — the plate draws its
contours outer-to-inner, extends its triangulation lines, and counts its readout
up, the way a terminal redisplays: quick, eased, staggered, no bounce, and fully
disabled under `prefers-reduced-motion`.

**Key characteristics**
- Cool near-white / near-black grounds — never pure white, never pure black.
- Modus-grounded palette: AAA by construction, tritanopia-checked.
- One bronze accent (interaction + mark); Modus-blue contour is structure only;
  benchmark vermilion marks the datum. The accent is never a syntax colour.
- Three type roles: Zilla Slab (plate titles), Hanken Grotesk (UI/body), Spline
  Sans Mono (data/code). The v1 mono-over-serif signature is retired.
- Flat: elevation is ground steps + 1px hairlines, never shadow.
- Unicode glyphs + thin `currentColor` survey marks are the icon set; the mark is
  the benchmark (△ in ◯).
- Both editions ship together, always; accessibility is a mechanical contract.

## Colors

A cool, measured palette grounded in Emacs **Modus** (Operandi / Vivendi), whose
whole reason for being is WCAG-AAA legibility and colour-vision safety. Every
role carries a **Sheet** (light) and a **Field** (dark) value; the frontmatter
holds the Sheet value as canonical, with the Field twin noted here. Body-level
colours are contrast-verified against the generated CSS by the validators, not
asserted.

### Accent — the benchmark
- **Bronze** — `accent` (Sheet `#8a4d00` / Field `#e0a33a`): the only interactive
  colour. Links, focus rings, primary fills, the datum label, CTAs. AAA-tuned.
- **Deep/Lit Bronze** — `accent-hover` (Sheet `#a75f0a` / Field `#f0b95c`):
  `:hover`/`:active` only, never a base colour.
- **Benchmark Vermilion** — `benchmark` (Sheet `#b5450e` / Field `#ef8a4a`): the
  maker's-mark and datum triangle; a survey benchmark, distinct from status red.

### Structure — contour
- **Contour Blue** — `contour` (Sheet `#2f4fb0` / Field `#6f9be0`): structural
  linework — contour rings, dividers, diagram strokes. A Modus blue. It is
  structure, never interaction; it never competes with the bronze accent.
- **Graticule** — `contour-faint` (Sheet `#7f8fb5` / Field `#39415a`): fine
  grid, triangulation dashes, and tick chrome. Decorative structural line only.

### Neutral — grounds (four steps)
- **Sheet / Field ground** — `bg` (`#f6f8fb` / `#0d0f14`): the page. Cool,
  never pure. Set on `<html>` and little else.
- `bg-subtle` (`#eef2f6` / `#14171e`): code fills, zebra, one step up.
- `surface` (`#e6ecf1` / `#1b1f28`): cards and panels that read as containers.
- `surface-raised` (`#fcfdff` / `#232833`): plates, modals, dropdowns — above.

### Neutral — ink
- `text-heading` (`#12141a` / `#f2f4f8`): headings. AAA.
- `text` (`#23262e` / `#d6dae2`): body. AAA on both.
- `text-muted` (`#565a63` / `#9aa0ab`): metadata, captions, help. AA floor.
- `text-faint` (`#878c95` / `#656b76`): decoration only — graticule labels,
  disabled meta. Never body copy.

### Neutral — hairlines
- `border` (`#cfd6de` / `#2b303b`): the default 1px survey hairline.
- `border-strong` (`#aab4c0` / `#3a4150`): table heads, field hover.

### Signal — status (Modus, tritanopia-checked)
Meaning only, never decoration, and never carried by colour alone — every status
pairs a glyph + word. Separations lean red/amber/green/teal, avoiding a
blue-vs-yellow reliance that fails tritanopes; Field values are toned so nothing
glows.
- **Error** — `status-err` (`#a60000` / `#f0685f`).
- **Warning** — `status-warn` (`#8a5000` / `#d9b34a`).
- **Success** — `status-ok` (`#006800` / `#6bbf6b`).
- **Info** — `status-info` (`#005e8b` / `#5fb8cf`).

### Modus (syntax) — code rendering only
Tuned to Emacs Modus Operandi (light) / Vivendi (dark) so code is identical in
the editor, on the web, in `bat`/`delta`, and in Charm TUIs. Never repurposed for
UI: `syn-keyword` purple, `syn-string`/`syn-number` blue, `syn-function`/
`syn-builtin` magenta, `syn-type`/`syn-docstring` teal-green, `syn-comment` grey.
Field twins follow Vivendi. Exact values finalised in `tokens.json` against the
contrast validator.

### Named rules
**The One-Accent Rule.** Exactly one interactive colour, bronze. Contour blue is
structure and benchmark vermilion is the datum mark; neither is an interaction
colour, and no screen introduces a second accent.

**The Accent-Is-Not-Code Rule.** Bronze never appears inside a code block and is
never a syntax colour. Modus syntax is a contract with editor users; the accent
is a contract with the reader. They never cross.

**The Never-Pure Rule.** No pure white and no pure black on any surface. Grounds
are cool near-white / near-black; ink bleeds through, it is never the page.

**The Contour-Is-Contrast Rule.** Contour intervals map to contrast steps. A role
below its measured floor does not print — the legend proves the level.

## Typography

**Display / titles:** Zilla Slab (technical slab serif) — plate and page
titles only. **UI / body:** Hanken Grotesk (humanist grotesk) — navigation,
labels, and all prose. **Data / code:** IBM Plex Mono — coordinates, ledger
digits, tables, captions set as readings, and code.

**Character.** The register is a technical atlas: a slab plate title over
clean grotesk annotation over precise monospaced readings. Code is the same mono
family as data on purpose — code reads as a measured value. The v1
mono-heading-over-serif-body signature is retired; the new signature is
slab-serif-title over grotesk-body with mono data.

### Hierarchy
- **Display** (Zilla Slab, 700, `3.25rem` / scale-0, 1.02): page `h1` / plate title.
- **Title** (Zilla Slab, 600, `2rem` / scale-1, 1.05): section titles.
- **Headline** (Hanken Grotesk, 600, `1.4rem` / scale-2, 1.3): `h2`; `h3`/`h4`
  step down through scale-3 (`1.15rem`) and scale-4 (`1.0625rem`).
- **Body** (Hanken Grotesk, 400, `1.0625rem`, 1.6): all prose. Measure capped at
  `72ch`.
- **Label** (IBM Plex Mono, 500, `0.75rem`, +0.1em, UPPERCASE): survey labels,
  coordinates, ticks, captions.
- **Code** (IBM Plex Mono, `0.85em`, 1.6): inline code and code blocks.

The scale is ten fixed rem steps — `3.25 · 2 · 1.4 · 1.15 · 1.0625 · 0.95 · 0.85
· 0.8 · 0.75 · 0.72` — emitted as `--type-scale-0…9`. `0.72rem` is the floor.

### Named rules
**The Three-Role Rule.** Zilla Slab for titles, Hanken Grotesk for everything read
as language, IBM Plex Mono for everything read as data. No fourth family.

**The Mono-Is-Data Rule.** Coordinates, ticks, hex values, table figures, ledger
digits, and code are monospace so columns and readings align. Prose is grotesk.

## Layout

A single-column reading measure with an optional right rail, capped at **`72ch`**.
A map "collar" of graticule ticks frames the top edge; a title/sheet block sits
top-right (sheet no., edition, projection, scale). Spacing is a **4px grid with a
2px micro-step**: `2xs 0.125 · xs 0.25 · sm 0.5 · md 1 · lg 1.5 · xl 2 · 2xl 3 ·
3xl 4` (rem); no ad-hoc values. Breakpoints are `sm 640px` and `md 860px`. A
semantic z-index scale keeps skip-links above everything. Density modes
`comfortable` (44px), `compact` (36px), and `tui` carry to non-web targets.

## Elevation & Depth

**Flat by doctrine — no shadows, no shadow vocabulary.** Depth is tonal layering
through the four ground steps (`bg → bg-subtle → surface → surface-raised`) plus a
1px hairline. A plate or modal reads as "above" because it sits on
`surface-raised` inside a hairline (optionally with the inset "map margin"
double-rule), never because it casts a shadow. No `backdrop-filter`, no blur, no
glass. The only permitted transparency is a low-percentage tint of a status or
accent colour behind alerts/callouts (`color-mix(... 8–12%, transparent)`),
always with a full hairline and a label.

**The Flat Survey Rule.** To feel raised, step up one ground level and draw the
hairline. Elevation is tone and line, never light.

## Shapes

Drafting-table geometry: small radii, hairline strokes. Corners are `2px` (`xs`)
on focus rings and smallest tags, `3px` (`sm`) on inline code, chips, inputs,
buttons, and plates, `4px` (`md`) on cards and code blocks. A `pill` token exists
only for true capsules. Borders are `1px` hairline by default, `2px` for focus
rings, `3px` reserved solely for the selected-item marker in keyboard surfaces.
The benchmark triangle and trig-station marks are thin `currentColor` strokes,
never filled ornaments.

**The Small-Radius Rule.** Nothing rounder than 4px on a container; no pill
buttons. Edges are crisp, like a cut survey sheet.

## Motion

The "survey renders in" grammar, mapped to four tokens (`fast 150ms`, `base
250ms`, `slow 300ms`, `survey 480ms`). Animate **stroke draw-in**, **line
extend**, **count-up**, and colour/translate only. Three named idioms:
`contour-draw` (rings draw outer→inner via dashoffset), `line-extend`
(triangulation extends from the datum), and `readout` (a mono value counts up
then resolves, terminal-style). Continuous easings are `ease-out`; nothing
bounces. Max one full plate render per viewport; everything honours
`prefers-reduced-motion` via the universal guard (draws resolve instantly).

## Components

Component tokens use roles only (no raw hex), one class per component prefixed
`ds-`. Every interactive primitive is flat, hairline-bordered, and changes only
colour on interaction.

### Buttons
- Small radius (`3px`), IBM Plex Mono at label size, `0.5rem 1rem` padding.
- **Primary:** bronze `accent` fill, `bg` text, matching bronze border.
- **Ghost:** transparent, heading-ink text, hairline border; hover shifts text +
  border to `accent`.
- Hover/active deepen to `accent-hover` (colour + border only — no scale, no
  shadow). Focus shows the 2px bronze `:focus-visible` ring at 2px offset.
  Disabled goes faint on `bg-subtle`; loading sets `aria-busy` + a mono ellipsis.

### Chips
- **Tag:** mono at scale-8 on `bg-subtle`, hairline, `3px`; interactive tags shift
  to bronze on hover/focus.
- **StatusBadge:** UPPERCASE mono; four status variants, each a low-% status tint
  + hairline in the matching colour, always with the glyph + word.

### Cards / Plates
- **Card:** `surface-raised`, 1px hairline, `4px`, `md` padding; the wrapping `<a>`
  takes the focus ring.
- **Plate:** the signature container — `surface-raised` with an inset "map margin"
  double-rule, a coordinate/label corner, and an optional scale bar; used for
  diagrams, specimens, and hero visualisations.

### Inputs
- Mono type, `bg` fill, hairline, `3px`. Hover strengthens the border; focus
  shows the bronze ring and shifts the border to `accent`. `aria-invalid` turns
  the border `status-err` with red help text; disabled goes faint on `bg-subtle`.

### Navigation
- Mono at scale-8, muted ink with bronze links (no underline), `·`/`▸`
  separators in faint ink, current page in heading ink. The collar of graticule
  ticks is the top-edge chrome.

### Signature components
- **Survey plate:** the datum-and-contour hero — concentric contour rings around
  the `tokens.json` datum benchmark, dashed triangulation to labelled trig
  stations, with the render-in motion. The system's most literal borrowed chrome.
- **Legend:** the palette/role table rendered as a map key (swatch + name + hex +,
  for status, glyph + word).
- **Callout — `// note`:** a low-% bronze tint with a hairline bronze border and a
  lowercase mono `// label`. The `//` label makes it a callout, not a stripe.
- **Alert:** full hairline + low-% status tint, glyph + UPPERCASE word head; four
  status variants; the glyph never carries meaning alone.
- **Terminal / CvEntry / Changelog:** mono readings on `surface`; the prompt/mark
  in bronze. Code output uses Modus/status tokens, never the accent.
- **Maker's mark — the benchmark (△ in ◯):** the datum symbol in thin
  `currentColor` stroke, benchmark vermilion. Appears once per surface.

### Do's and Don'ts

**Do**
- Set `html { background: var(--color-bg); color: var(--color-text); }` and inherit.
- Convey elevation by stepping the ground + a 1px hairline.
- Use `accent` (bronze) for interaction; `contour` (blue) for structure only;
  `benchmark` for the datum mark only.
- Render code with the Modus syntax tokens.
- Pair every status with a glyph + word; keep body AAA, meta AA, faint decorative.
- Ship both editions together (Sheet + Field).

**Don't**
- Add a shadow, gradient, `backdrop-filter`, or glass.
- Introduce a second interactive accent, use `contour` as interaction, or reach
  for a syntax colour because you like the hue.
- Use `text-faint` for body copy, or a type size off the ten-step scale.
- Ship pill buttons or a soft 12–16px rounded-card aesthetic; radii stop at 4px.
- Ship a tinted status card without its label, or a decorative 3px side-stripe.
- Use emoji, an icon font, or an SVG sprite; use a Unicode glyph or a thin
  `currentColor` survey mark.
- Duplicate a hex outside `tokens.json`.
