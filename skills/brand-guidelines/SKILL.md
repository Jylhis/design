---
name: brand-guidelines
description: Applies the Jylhis brand colors and typography to any artifact that benefits from the jylhis.com look-and-feel — slides, docs, mockups, diagrams, exported images, or production UI. Use it when brand colors, type, visual formatting, or company/personal design standards apply.
license: Complete terms in LICENSE (repo root)
user-invocable: true
---

# Jylhis Brand Styling

## Overview

To apply the Jylhis brand identity (the personal/technical brand of Markus
Jylhänkangas, jylhis.com) to any artifact, use this skill. It captures the
canonical colors, typography, and visual rules so anything you produce reads as
on-brand.

The single source of truth for every value here is the repo's
[`tokens.json`](../../tokens.json). When a value is missing, add it there
first and regenerate — never hard-code a new hex. For the full system (platform
themes, UI kit, accessibility specs) invoke the `jylhis-design` skill instead;
this skill is the quick brand-application layer.

**Keywords**: branding, visual identity, post-processing, styling, brand colors,
typography, Jylhis brand, survey-and-bronze, visual formatting, visual design.

## Brand Guidelines

The feel: **cool near-neutral grounds, a single bronze accent, one vermilion
benchmark mark, engraved plate titles over grotesk body, structure drawn in
contour blue. No emoji, no gradients, no shadows.** Unicode glyphs (`›`, `▸`,
`»`, `☾`, `★`, `└──`, `✓`, `✗`, `!`, `i`) do the work icons normally would. Two
editions, both first-class — Sheet (light) and Field (dark). Never ship one
without the other.

### Colors

Two values per role: `light` (Sheet) / `dark` (Field).

**Grounds — backgrounds & surfaces**

- Background: `#f6f8fb` / `#0d0f14` — the page itself
- Subtle bg: `#eef2f6` / `#14171e`
- Surface (card): `#e6ecf1` / `#1b1f28`
- Surface raised (modal/plate): `#fcfdff` / `#232833`

**Ink — text**

- Heading: `#12141a` / `#f2f4f8` — titles (AAA)
- Body: `#23262e` / `#d6dae2` — body (AAA)
- Muted: `#565a63` / `#9aa0ab` — meta (AA)
- Faint: `#878c95` / `#656b76` — decorators, disabled only

**Bronze — the single accent**

- Accent: `#8a4d00` / `#e0a33a` — the only interactive color: links, focus
  rings, primary fills, ghost-button text
- Accent hover: `#a75f0a` / `#f0b95c` — hover/active twin, never a base color
- Brand: `#b5450e` / `#ef8a4a` — the benchmark vermilion. Use for *large* marks
  where contrast isn't measured: the maker's mark, the datum triangle, sticker
  art. Never a link color (doesn't clear AA on the Sheet ground), and never
  `status-err`

**Line — borders, rules & contour**

- Border: `#cfd6de` / `#2b303b`
- Border strong: `#aab4c0` / `#3a4150`
- Decorator (graticule / dashed rules): `#7f8fb5` / `#39415a`
- Contour: `#2f4fb0` / `#6f9be0` — structural linework only: contour rings,
  diagram strokes, meaningful dividers. Structure, never interaction

**Signal — status (always pair with a glyph or word, never color alone)**

- Error `✗`: `#a60000` / `#f0685f`
- Warning `!`: `#8a5000` / `#d9b34a`
- OK `✓`: `#006800` / `#6bbf6b`
- Info `i`: `#005e8b` / `#5fb8cf`

**Syntax (Emacs Modus — Operandi light / Vivendi dark).** Canonical for *all*
code rendering. Full nine-role palette lives in `tokens.json#syntax`. The bronze
accent is brand chrome only — **never a syntax color.**

### Typography

Three roles, three families.

- **Display & titles**: Zilla Slab (fallback: Roboto Slab, Rockwell, Georgia,
  serif). Weight 600–700, line-height 1.02–1.05, letter-spacing −0.01em.
- **UI & body text**: Hanken Grotesk (fallback: Inter, system-ui, -apple-system,
  Segoe UI, sans-serif). Base size 1.0625rem, line-height 1.6.
- **Data, labels & code**: IBM Plex Mono (fallback: JetBrains Mono, Cascadia
  Code, Fira Code, ui-monospace, monospace). Labels are 500 weight, uppercase,
  0.1em tracking.
- Web font files (woff2) ship in [`fonts/`](../../fonts/); the `@font-face`
  blocks are in [`fonts.css`](../../fonts.css) and the family stacks are
  generated into [`tokens.css`](../../tokens.css) as `--font-display` /
  `--font-body` / `--font-mono`.

## How to apply

1. **For HTML / web artifacts** — link `colors_and_type.css` (it `@import`s
   `tokens.css` and adds the font stacks + semantic helpers `.ds-body`,
   `.ds-h1`, `.ds-meta`, `.ds-code-inline`, …). Copy `fonts/`, `tokens.css`,
   and `colors_and_type.css` next to the artifact so it renders self-contained
   — `colors_and_type.css` `@import`s `tokens.css`, so without it every
   `var(--color-*)` lookup 404s and the helpers lose their values. Default to
   the Sheet edition; add `data-theme="dark"` on `<html>` for Field.
2. **For throwaway mocks / slides / specimens** — emit static HTML the user can
   open, using the helpers above. Brand assets (favicon, og image) are in
   [`assets/`](../../assets/).
3. **For non-web / programmatic artifacts** (pptx, image export, diagram tools)
   — read the RGB values above. Apply Zilla Slab to display and titles, Hanken
   Grotesk to body and UI, IBM Plex Mono to data, labels and code, the bronze
   accent (`#8a4d00` / `#e0a33a`) to interactive chrome, the benchmark
   vermilion (`#b5450e` / `#ef8a4a`) to large maker's marks, status colors
   only alongside their glyph.
4. **For production code** — never hard-code hex. Use the CSS custom properties
   from `tokens.css`, which are namespaced `--color-*` (`var(--color-accent)`,
   `var(--color-bg)`, …) or the platform palette for the target.

## Key rules

- **Bronze is the only accent** — and it is brand chrome (links, focus, fills),
  never a syntax color. `contour` blue is structure, never interaction.
- **ANSI slot 11 is always the bronze accent** across every terminal target —
  intentional override.
- **No emoji, no gradients, no shadows.** Glyphs are the icon set.
- **Status is never color-only** — pair with `✓` / `✗` / `!` / `i` or a word
  (CVD safety).
- **Contrast floors**: body text AAA on both editions, muted text AA, faint is
  decorative only. See `tokens.json#contrast`.
- **No hex duplication** — every value derives from `tokens.json`. If it isn't
  there, add it there first.

## Technical details

- **Color application**: use the hex/RGB values above for direct application, or
  `var(--color-<role>)` from `tokens.css` for the web. `accent-subtle` (bronze
  at ~12% on bg) is `var(--color-accent-subtle)`, or `#e9e3dd` / `#262119`
  as an opaque approximation where rgba isn't available.
- **Font management**: the woff2 files in `fonts/` cover all three families;
  fallbacks above keep artifacts readable when the brand fonts aren't installed.
  No installation is required for the fallbacks to work.
- **Themes**: every artifact should support both Sheet and Field. On the web
  that's `:root` (Sheet) plus `[data-theme="dark"]` (Field), both emitted by
  `tokens.css`.
