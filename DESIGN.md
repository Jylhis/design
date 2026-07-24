---
name: Jylhis Design System
description: A warm-paper engineering notebook — cream stock, one copper stamp, monospace chrome over serif prose.
colors:
  bg: "#faf7f2"
  bg-subtle: "#f0ebe3"
  surface: "#e8e1d6"
  surface-raised: "#fefdfb"
  text-heading: "#1e1b18"
  text: "#2c2825"
  text-muted: "#6b5f54"
  text-faint: "#6d6155"
  accent: "#8a4f24"
  accent-hover: "#7a4622"
  brand: "#b5703c"
  border: "#d5cec4"
  border-strong: "#b0a898"
  decorator: "#c4baa8"
  status-err: "#a60000"
  status-warn: "#6f5500"
  status-ok: "#006800"
  status-info: "#0031a9"
  syn-keyword: "#4a2d80"
  syn-string: "#3d5a1f"
  syn-number: "#1f4d8a"
  syn-function: "#8a2348"
  syn-builtin: "#6f1f6a"
  syn-type: "#134a4a"
  syn-variable: "#2a4a6a"
  syn-comment: "#6f5e41"
  syn-docstring: "#2a5a3a"
typography:
  display:
    fontFamily: "JetBrains Mono, IBM Plex Mono, Cascadia Code, Fira Code, monospace"
    fontSize: "2rem"
    fontWeight: 700
    lineHeight: 1.25
    letterSpacing: "0.01em"
  headline:
    fontFamily: "JetBrains Mono, IBM Plex Mono, Cascadia Code, Fira Code, monospace"
    fontSize: "1.4rem"
    fontWeight: 600
    lineHeight: 1.25
    letterSpacing: "0.01em"
  title:
    fontFamily: "JetBrains Mono, IBM Plex Mono, Cascadia Code, Fira Code, monospace"
    fontSize: "1.6rem"
    fontWeight: 700
    lineHeight: 1.25
    letterSpacing: "0.01em"
  body:
    fontFamily: "Literata, Charter, Bitstream Charter, Georgia, Noto Serif, serif"
    fontSize: "1.125rem"
    fontWeight: 400
    lineHeight: 1.65
  label:
    fontFamily: "JetBrains Mono, IBM Plex Mono, Cascadia Code, Fira Code, monospace"
    fontSize: "0.8rem"
    fontWeight: 400
    lineHeight: 1.4
    letterSpacing: "0.02em"
  code:
    fontFamily: "JetBrains Mono, IBM Plex Mono, Cascadia Code, Fira Code, monospace"
    fontSize: "0.85em"
    fontWeight: 400
    lineHeight: 1.6
  scale:
    step-0: "2rem"
    step-1: "1.6rem"
    step-2: "1.4rem"
    step-3: "1.15rem"
    step-4: "1rem"
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
    textColor: "{colors.text}"
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
---

# Design System: Jylhis Design System

## Overview

**Creative North Star: "The Engineer's Notebook"**

This is one engineer's technical notebook, printed on warm cream paper and kept
by hand. The page is never white and the ink is never black; everything is set
in the tools of the trade. Headings, labels, dates, and chrome are monospace,
as if typed at a terminal; long-form prose is a warm serif, as if the notebook
were also a book worth reading. A single copper stamp is the only color that
speaks, and it speaks rarely. The chrome is borrowed honestly from the surfaces
the owner lives in all day: man-page headers (`CRAFT(7)`), shell prompts
(`jy ❯`), code-editor gutters, `└──` tree lines, `//` margin comments.

The system is deliberately small and slow-changing, and the restraint is the
personality. There are two themes and only two: **Paper** (warm cream light)
and **Roast** (dark roast), both first-class, both tuned independently for
warmth rather than mirrored. Components feel **tool-honest and utilitarian** —
functional first, unfussy, every affordance earning its place; the warmth comes
from the paper and the type, not from the widgets. Depth is a lie the system
refuses to tell: no shadows, no gradients, no glass. Elevation is four steps of
background color and a 1px hairline border, nothing more. Motion follows the
"ink draws on" grammar — nothing fades or floats; a rule *draws* left-to-right,
a label *types* on, a copper caret *blinks*, and everything else is a color or
translate shift on an `ease-out` curve.

The confirmed anti-references are explicit and load-bearing: **no emoji, no icon
fonts or SVG sprites, no sans-serif, no second accent, no drop shadows, no
gradients, no glassmorphism, no pill buttons, no decorative side-stripes.** The
one bespoke SVG in the entire system is the maker's mark; every other "icon" is
a Unicode glyph.

**Key Characteristics:**
- Warm cream paper and dark roast — never pure white, never pure black.
- One copper accent, reserved for interaction and the maker's mark; never a syntax color.
- Monospace chrome (JetBrains Mono) over serif prose (Literata); no sans-serif exists.
- Flat by doctrine: elevation is background steps + 1px borders, never shadow.
- Unicode glyphs are the icon set; the mark is pure type: `jy ❯`.
- Both themes ship together, always; accessibility is a mechanical contract, not a claim.

## Colors

A warm, low-saturation palette of paper, ink, and linen, lit by a single copper
accent, with a separate Emacs-Modus syntax palette reserved exclusively for
code. Every role carries a **Paper** (light) and a **Roast** (dark) value; the
frontmatter holds the Paper value as canonical, and the Roast twin is noted
alongside. All body-level colors are contrast-verified against the actual
generated CSS by the validators, not asserted.

### Primary
- **Copper** — `accent` (Paper `#8a4f24` / Roast `#e89b5e`): the only interactive
  color. Links, focus rings, button fills, the `// currently` callout border,
  the prompt chevron, the maker's-mark chevron. AA on paper, AAA on dark.
- **Deep Copper** — `accent-hover` (Paper `#7a4622` / Roast `#f5b07a`): the darker
  twin used exclusively for `:hover` and `:active`. Never a base color.
- **Stamp Copper** — `brand` (Paper `#b5703c` / Roast `#d4884a`): the literal
  logo/favicon copper for *large* marks where contrast is not measured against
  text. Not a link color — it does not clear AA on paper.

### Neutral — Paperstock (backgrounds)
- **Warm Paper** — `bg` (Paper `#faf7f2` / Roast `#1a1714`): the page itself. Set
  on `<html>` and almost nothing else.
- **Subtle Paper** — `bg-subtle` (Paper `#f0ebe3` / Roast `#242019`): tag-chip and
  code-block fills, faint zebra striping, one step up from the page.
- **Surface** — `surface` (Paper `#e8e1d6` / Roast `#2a2520`): cards and panels
  that must read as containers.
- **Raised Surface** — `surface-raised` (Paper `#fefdfb` / Roast `#363230`):
  modals, dropdowns, floating panels — anything that must read as *above* the page.

### Neutral — Ink (text)
- **Heading Ink** — `text-heading` (Paper `#1e1b18` / Roast `#f0eae0`): headings
  only. AAA.
- **Body Ink** — `text` (Paper `#2c2825` / Roast `#e8e0d4`): body copy. AAA on both.
- **Muted Ink** — `text-muted` (Paper `#6b5f54` / Roast `#b0a496`): metadata,
  captions, secondary labels, placeholder and help text. AA — the floor for
  anything a sighted user must read.
- **Faint Ink** — `text-faint` (Paper `#6d6155` / Roast `#8a7f72`): decoration only
  — dashed rules, disabled meta, tree-line chrome. Never body copy.

### Neutral — Linen (borders)
- **Border** — `border` (Paper `#d5cec4` / Roast `#3d3830`): the default 1px hairline
  everywhere.
- **Strong Border** — `border-strong` (Paper `#b0a898` / Roast `#5a5248`): table
  `thead` underlines and form-field hover only.
- **Decorator** — `decorator` (Paper `#c4baa8` / Roast `#4a4338`): dashed rules and
  `└──` tree lines. Not a real border color.

### Signal (status)
Status meaning only — never reached for as decoration. For friendliness use
`accent`; for calm use `text-muted`.
- **Error Red** — `status-err` (Paper `#a60000` / Roast `#ff5f59`): error, blocked, destructive.
- **Warning Yellow** — `status-warn` (Paper `#6f5500` / Roast `#d0bc00`): warning, deprecation, caution.
- **Success Green** — `status-ok` (Paper `#006800` / Roast `#44bc44`): success, completed, healthy.
- **Info Blue** — `status-info` (Paper `#0031a9` / Roast `#2fafff`): neutral information, in-progress.

### Modus (syntax) — code rendering only
Tuned to match the Emacs Modus Operandi (light) / Vivendi (dark) themes so code
looks identical in the editor, on the web, in `bat`/`delta`, and in Charm TUIs.
Never repurposed for UI. `syn-keyword` warmed indigo (Paper `#4a2d80`),
`syn-string` olive/sage (`#3d5a1f`), `syn-function` rose-wine (`#8a2348`),
`syn-type` desaturated teal (`#134a4a`), `syn-comment` warm tan italic (`#6f5e41`),
plus `syn-number`, `syn-builtin`, `syn-variable`, `syn-docstring`.

### Named Rules
**The One Voice Rule.** There is exactly one accent, copper, and no screen may
introduce a second. Its rarity is what lets it mean "interact here."

**The Copper-Is-Not-Code Rule.** The brand copper never appears inside a code
block and is never a syntax color. The syntax palette is a contract with editor
users; the accent is a contract with the reader. They never cross.

**The Never-Pure Rule.** No pure white and no pure black anywhere on a surface.
White and black exist only as ink that must bleed through, never as the page.

## Typography

**Display / Chrome Font:** JetBrains Mono (with IBM Plex Mono, Cascadia Code, Fira Code fallbacks)
**Body Font:** Literata (with Charter, Bitstream Charter, Georgia, Noto Serif fallbacks)

**Character:** Monospace-heading-over-serif-body is the whole signature. The mono
carries every heading, label, date, and piece of chrome so the interface reads
like something typed at a terminal; Literata carries prose so the notebook is
also a book. Code is the *same* family as headings on purpose — code reads as a
label. There is no sans-serif and there will not be one.

### Hierarchy
- **Display** (JetBrains Mono, 700, `2rem` / scale-0, line-height 1.25, +0.01em): page `h1`.
- **Title** (JetBrains Mono, 700, `1.6rem` / scale-1, 1.25): `.ds-title`, the compact page title used on most pages.
- **Headline** (JetBrains Mono, 600, `1.4rem` / scale-2, 1.25): `h2`; `h3`/`h4` step down through scale-3 (`1.15rem`) and scale-4 (`1rem`).
- **Body** (Literata, 400, `1.125rem`, 1.65): all prose; drops to `1rem` under 860px. Line length capped at `72ch`.
- **Label** (JetBrains Mono, 400, `0.8rem`, +0.02em): `.ds-meta` role lines, dates, captions. The man-page variant (`.ds-man-label`) is UPPERCASE at +0.08em.
- **Code** (JetBrains Mono, `0.85em`, 1.6): inline code and code blocks.

The full scale is ten fixed rem steps — `2 · 1.6 · 1.4 · 1.15 · 1 · 0.95 · 0.85 · 0.8 · 0.75 · 0.72` — emitted as `--type-scale-0…9`. `0.72rem` is the floor; nothing renders smaller.

### Named Rules
**The Two-Font Rule.** Literata serif for prose, JetBrains Mono for everything
else. No third family, and never a sans-serif.

**The Mono-Chrome Rule.** Navigation, breadcrumbs, labels, dates, tags, and every
`//` margin note are monospace. If it is chrome, it is mono; if it is prose, it
is serif.

**The Oldstyle-In-Prose Rule.** Numbers in serif prose use oldstyle figures (they
sit *in* the text); numbers in mono chrome and code reset to lining figures so
columns stay aligned.

## Layout

A single-column reading measure with an optional right rail. Content is capped
at **`72ch`** — wider is hostile to long-form reading. A **16rem** right rail
(with a **2.5rem** gap) carries sidenotes at full width (`main` reserves the
space via `max-width: calc(72ch + 16rem + 2.5rem)`); on narrow viewports the
layout reflows to a single column and sidenotes fall inline. Spacing is a
**4px grid with a 2px micro-step**: `2xs 0.125 · xs 0.25
· sm 0.5 · md 1 · lg 1.5 · xl 2 · 2xl 3 · 3xl 4` (rem). No ad-hoc spacing values
— if a layout needs something between `lg` and `xl`, the layout is wrong.
Breakpoints are `sm 640px` and `md 860px` (hand-authored `@media` rules repeat
the literal values with a `/* breakpoints.<name> */` comment, since CSS media
queries cannot read custom properties). A semantic `z-index` scale
(`base · sticky · scrim · modal · toast · skip`) keeps skip-links above
everything. Three density modes exist — `comfortable` (44px hit targets),
`compact` (36px), and `tui` — for the system's non-web targets.

## Elevation & Depth

**Flat by doctrine. There are no shadows in this system, and there is no shadow
vocabulary to reach for.** Depth is conveyed entirely by tonal layering through
the four Paperstock steps — `bg → bg-subtle → surface → surface-raised` — plus a
1px hairline border. A modal reads as "above" because it sits on
`surface-raised` with a border, not because it casts a shadow. There is no
`backdrop-filter`, no blur, no glass. The single permitted transparency is a
low-percentage tint of a status or accent color behind alerts and callouts
(`color-mix(... 8–12%, transparent)`), always paired with a full hairline border
and a label — never a bare glow.

### Named Rules
**The Flat Paper Rule.** If something needs to feel raised, step it up one
Paperstock level. Never add a shadow, never fake a lift. Elevation is color, not
light.

## Shapes

Small, reserved radii and hairline strokes — a drafting-table geometry, not a
soft-pill one. Corners are `2px` (`xs`) on focus rings and the smallest tags,
`3px` (`sm`) on inline code, chips, inputs, and buttons, and `4px` (`md`) on
cards and code blocks. A `pill` (999px) token exists but is used only where a
true capsule is required, not for buttons. Exactly one element in the entire
system is a full circle: the theme-toggle. Borders are `1px` hairline by default,
`2px` for focus rings and the kbd key-cap bottom edge, and `3px` reserved solely
for the selected-item marker in keyboard-driven surfaces — never a decorative
side-stripe.

### Named Rules
**The Small-Radius Rule.** Nothing rounder than 4px on a container, and no pill
buttons. The system's edges are crisp, like cut paper.

## Components

Sixteen React components, each `<Name>.jsx` + `.d.ts` + a `card.html` specimen,
styled by `components/components.css` with tokens only (no raw hex), one class
per component prefixed `ds-`. Every interactive primitive feels tool-honest:
flat, hairline-bordered, changing only color on interaction.

### Buttons
- **Shape:** small radius (`3px`), mono type at `0.85rem`, `0.5rem 1rem` padding.
- **Primary:** copper fill (`accent`) with paper text (`bg`) and a matching copper border.
- **Ghost:** transparent fill, body-ink text, hairline `border`; on hover the text and border shift to `accent`.
- **Link / Search:** the `--link` variant is bare copper text; the `--search` variant is a `bg-subtle` chip with a `⌘K`-style kbd.
- **Hover / Focus / Active:** hover and active deepen to `accent-hover` (color and border only — **no shrink, no shadow, no scale**). Focus shows the 2px copper `:focus-visible` ring at 2px offset. Disabled goes faint on `bg-subtle`; loading sets `aria-busy` and appends a mono ellipsis — never a spinner.

### Chips (Tags & Status Badges)
- **Tag:** mono `0.8rem` on `bg-subtle`, hairline border, `3px` radius; interactive tags drop the underline and shift to copper on hover/focus.
- **StatusBadge:** UPPERCASE mono at `0.72rem`; four variants (`active`/`archived`/`experimental`/`contributed`) each a 12% status tint + hairline border in the matching color. Color is never alone — the word carries the meaning.

### Cards / Containers
- **Corner Style:** `4px` (`md`).
- **Background:** `surface-raised` by default; the `--subtle` variant uses `bg-subtle` + `border-strong` for featured items.
- **Elevation Strategy:** tonal only (see Elevation) — no shadow.
- **Border:** 1px hairline; the wrapping `<a>` receives the focus ring, not the card.
- **Internal Padding:** `md` (1rem).

### Inputs / Fields
- **Style:** mono type, `bg` fill, hairline `border`, `3px` radius.
- **Hover / Focus:** hover strengthens the border to `border-strong`; focus shows the copper `:focus-visible` ring and shifts the border to `accent`.
- **Error / Disabled:** `aria-invalid` turns the border `status-err` and help text red; disabled goes faint on `bg-subtle`.

### Navigation (Breadcrumb)
- Mono `0.8rem`, muted-ink with copper links (no underline), `▸` separators in faint ink, current page in body ink. Collapses gracefully on narrow widths.

### Signature Components
- **Callout — the `// currently` pattern:** an 8% copper tint with a hairline copper border and a lowercase mono `// label`; list items bulleted with a copper `›`. The `//` label is what makes it a callout, not a stripe.
- **Alert:** full hairline border + 10% status tint, with a glyph + UPPERCASE word head. Four status variants; the glyph never carries meaning alone.
- **Terminal:** a mono session frame on `surface` with a dashed title rule; the prompt chevron is always copper (the ANSI-11 rule). Output color is the consumer's job via Modus/status tokens, never the accent.
- **Maker's Mark (`jy ❯`):** pure type in JetBrains Mono, chevron always copper, optionally carrying the blinking `.ds-caret` on live surfaces. Appears once per surface; never above 56px; never inside code. The terminal fallback *is* the mark.
- **CvEntry / Changelog:** line-numbered code-editor and commit-log layouts — the notebook's most literal "borrowed chrome" pieces.

### Motion
The "ink draws on" grammar, mapped to four tokens (`fast 150ms`, `base 250ms`,
`slow 300ms`, `spring 420ms`). Animate **color** and **translate** only, plus
three named idioms: `rule-draw` (a rule draws in via `scaleX`), `type-on` (a mono
label types on with `steps()`), and `caret` (a stepped copper blink for prompts
and loading). Continuous easings are `ease-out`; the idioms are stepped like a
terminal. Max one drawn entrance per viewport; the caret never appears twice on
one surface. Everything honors `prefers-reduced-motion` via the universal guard.

## Do's and Don'ts

### Do:
- **Do** set `html { background: var(--color-bg); color: var(--color-text); }` and let everything inherit.
- **Do** convey elevation by stepping `bg → bg-subtle → surface → surface-raised`, plus a 1px border.
- **Do** use `accent` for anything interactive that has no color of its own; use `accent-hover` only for hover/active.
- **Do** render code with the Modus syntax tokens so blocks match Emacs, `bat`, `delta`, and the Charm TUIs.
- **Do** ship every interactive primitive with hover, `:focus-visible`, active, and — where inert — disabled and loading (`aria-busy` + mono ellipsis).
- **Do** ship both themes together; keep body text AAA, meta AA, and `text-faint` decorative only.
- **Do** pair every status color with a glyph + word (alerts) or a `//` label (callouts).

### Don't:
- **Don't** add a shadow, a gradient, a `backdrop-filter`, or glass. Elevation is color, never light.
- **Don't** introduce a second accent, or use `text-faint` for body copy.
- **Don't** pick a color from the syntax palette because you like the hue — it is a contract with editor users.
- **Don't** introduce a sans-serif, or a type size outside the ten-step scale.
- **Don't** ship pill buttons or a 12–16px rounded-card aesthetic; radii stop at 4px on containers.
- **Don't** ship a tinted status card without its label, and never a decorative 3px side-stripe (that stroke is the selected-item marker only).
- **Don't** use emoji, an icon font, or an SVG sprite; default to a Unicode glyph, and only draw a thin square-capped `currentColor` SVG if a glyph genuinely cannot.
- **Don't** duplicate a hex value in consumer code — every color derives from `tokens.json`.
