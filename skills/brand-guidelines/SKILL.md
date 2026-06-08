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
typography, Jylhis brand, paper-and-copper, visual formatting, visual design.

## Brand Guidelines

The feel: **warm cream paper, a single copper accent, monospace headings, serif
body. No emoji, no gradients, no shadows.** Unicode glyphs (`›`, `▸`, `»`, `☾`,
`★`, `└──`, `✓`, `✗`, `!`, `i`) do the work icons normally would. Two themes,
both first-class — Paper (light) and Roast (dark). Never ship one without the
other.

### Colors

Two values per role: `light` (Paper) / `dark` (Roast).

**Paperstock — backgrounds & surfaces**

- Background: `#faf7f2` / `#1a1714` — the page itself
- Subtle bg: `#f0ebe3` / `#242019`
- Surface (card): `#e8e1d6` / `#2a2520`
- Surface raised (modal): `#fefdfb` / `#363230`

**Ink — text**

- Heading: `#1e1b18` / `#f0eae0` — titles (AAA)
- Body: `#2c2825` / `#e8e0d4` — body (AAA)
- Muted: `#6b5f54` / `#b0a496` — meta (AA)
- Faint: `#8a7f72` / `#8a7f72` — decorators, disabled only

**Copper — the single accent**

- Accent: `#9a5a2a` / `#e89b5e` — links, focus rings, the maker's mark
- Accent hover: `#7a4622` / `#f5b07a`
- Brand: `#b5703c` / `#d4884a` — literal logo copper, large marks only

**Linen — borders & rules**

- Border: `#d5cec4` / `#3d3830`
- Border strong: `#b0a898` / `#5a5248`

**Signal — status (always pair with a glyph or word, never color alone)**

- Error `✗`: `#a60000` / `#ff5f59`
- Warning `!`: `#6f5500` / `#d0bc00`
- OK `✓`: `#006800` / `#44bc44`
- Info `i`: `#0031a9` / `#2fafff`

**Syntax (Emacs Modus — Operandi light / Vivendi dark).** Canonical for *all*
code rendering. Full nine-role palette lives in `tokens.json#syntax`. The copper
accent is brand chrome only — **never a syntax color.**

### Typography

- **Headings & chrome**: JetBrains Mono (fallback: IBM Plex Mono, Cascadia Code,
  Fira Code, Courier New, monospace). Line-height 1.25, letter-spacing 0.01em.
- **Body text**: Literata (fallback: Charter, Bitstream Charter, Georgia, Noto
  Serif, serif). Base size 1.125rem, line-height 1.65.
- **Code**: JetBrains Mono.
- Web font files (woff2, variable weight) ship in [`fonts/`](../../fonts/);
  the `@font-face` + family stacks are in
  [`colors_and_type.css`](../../colors_and_type.css).

## How to apply

1. **For HTML / web artifacts** — link `colors_and_type.css` (it `@import`s
   `tokens.css` and adds the font stacks + semantic helpers `.ds-body`,
   `.ds-h1`, `.ds-meta`, `.ds-code-inline`, …). Copy `fonts/` and
   `colors_and_type.css` next to the artifact so it renders self-contained.
   Default to the Paper theme; add `data-theme="dark"` on `<html>` for Roast.
2. **For throwaway mocks / slides / specimens** — emit static HTML the user can
   open, using the helpers above. Brand assets (favicon, og image) are in
   [`assets/`](../../assets/).
3. **For non-web / programmatic artifacts** (pptx, image export, diagram tools)
   — read the RGB values above. Apply JetBrains Mono to headings, Literata to
   body, copper (`#9a5a2a` light / `#e89b5e` dark) to accents and the brand
   mark, status colors only alongside their glyph.
4. **For production code** — never hard-code hex. Use the CSS custom properties
   from `tokens.css` (`var(--accent)`, `var(--bg)`, …) or the platform palette
   for the target.

## Key rules

- **Copper is the only accent** — and it is brand chrome (links, focus, marks),
  never a syntax color.
- **ANSI slot 11 is always brand copper** across every terminal target —
  intentional override.
- **No emoji, no gradients, no shadows.** Glyphs are the icon set.
- **Status is never color-only** — pair with `✓` / `✗` / `!` / `i` or a word
  (CVD safety).
- **Contrast floors**: body text AAA on both themes, muted text AA, faint is
  decorative only. See `tokens.json#contrast`.
- **No hex duplication** — every value derives from `tokens.json`. If it isn't
  there, add it there first.

## Technical details

- **Color application**: use the hex/RGB values above for direct application, or
  `var(--<role>)` from `tokens.css` for the web. `accent-subtle` (copper at
  ~12–15% on bg) is `#f0e6da` / `#2e2520` where rgba isn't available.
- **Font management**: the variable woff2 files in `fonts/` cover both families;
  fallbacks above keep artifacts readable when the brand fonts aren't installed.
  No installation is required for the fallbacks to work.
- **Themes**: every artifact should support both Paper and Roast. On the web
  that's `:root` (Paper) plus `[data-theme="dark"]` (Roast), both emitted by
  `tokens.css`.
