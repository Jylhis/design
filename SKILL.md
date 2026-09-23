---
name: jylhis-design
description: Use this skill to generate well-branded interfaces and assets in the Jylhis design system (the general-purpose design system of Markus Jylhänkangas — jylhis.com and everything else he builds), for production or for throwaway prototypes, mocks, slides, and docs. Contains essential design guidelines, colors, type, fonts, assets, and components.
user-invocable: true
---

Read [`DESIGN.md`](DESIGN.md) — the contract (constraints, values, foundations, voice). `tokens.core.json` + `themes/jylhis.json` is the source of truth; `tokens.css` is its generated output.

If creating visual artifacts (slides, mocks, throwaway prototypes), copy assets out and create static HTML files for the user to view. If working on production code, copy assets and read the rules here to become an expert in designing with this brand.

If the user invokes this skill without other guidance, ask them what they want to build, ask some questions, and act as an expert designer who outputs HTML artifacts _or_ production code, depending on the need.

## Hard constraints

Violating any of these is a defect, not a style choice, and they are ordered by what the mistake costs. Reasoning and full statements: [`DESIGN.md`](DESIGN.md).

1. **Contrast is measured.** Body AAA, meta AA, extended sweep AA, in every mode. A role below its floor does not ship.
2. **Grayscale first.** The palette is a lightness skeleton with hue on top. Desaturate any design and every distinction must still hold; an accent differs in lightness, not only hue.
3. **Signals carry a glyph and a word.** Every status and every destructive control, in every mode. The colour is the third signal, never the first.
4. **Paired foregrounds.** Every text-bearing fill declares its own `--color-<role>-foreground`. A primary button is `background: var(--color-accent); color: var(--color-accent-foreground)`.
5. **Both modes, always.** One theme — `jylhis` — light and dark. Nothing ships light-only or dark-only.
6. **Never hardcode a hex.** Every value is a `var(--…)` from `tokens.css`.
7. **`tokens.css` is generated — never edit it.** Change the value in `tokens.core.json` / `themes/jylhis.json` and run `bun scripts/generate.mjs`; a contrast claim that no longer measures true fails `validate-tokens.mjs`.
8. **The accent is never a syntax colour.** Code renders from the `--color-syntax-*` roles (Modus-seeded, re-measured here). Brand chrome never enters a code block.
9. **Two chromatic signals, and they don't trade.** Bronze `--color-accent` (`#693900` light / `#f5a351` dark) is interaction — links, focus rings, primary fills, the `›` row affordance. `--color-destructive` is irreversible action only, and is always the higher-contrast of the pair: darker than accent in light, lighter in dark. `--color-brand` (vermilion `#a63800` / `#f8763a`) is the maker's mark alone. `--color-contour` blue is structure. No third accent.
10. **Touch targets.** 40px minimum at the default density, 32px absolute floor at `compact`.
11. **Elevation is tone and line first.** Step up a ground (`bg → bg-subtle → surface → surface-raised`) plus a 1px hairline. `--shadow-float` exists for objects that leave the flow — modal, sheet, popover, toast, dropdown — and nothing else.
12. **Data is not language.** Anything numeric, tabular, or machine-shaped sets in IBM Plex Mono or IBM Plex Sans Condensed, never in Hanken Grotesk.
13. **Radii from the scale.** `2px` rings and small tags, `3px` inline code, `6px` inputs/chips/buttons, `8px` cards/plates/code blocks, `12px` bottom sheets. Pill only for the theme-toggle circle.
14. **Spacing off the 4px grid**, at every density. Content caps at `72ch`.
15. **Unicode is the icon set.** `›` `▸` `»` `└──` `├──` `☾` `☀` `★` `⑂` `$` `//`. No emoji, no icon font, no sprite.
16. **No gradient, glass, `backdrop-filter`, illustration, hero image, or texture.**
17. **Never pure** in light mode. Light ground `#f5f8fc`, dark `#0c0f14`. Ink that needs to bleed through may approach pure; the page grounds never are.
18. **Copy is a design token.** First person singular, lowercase command buttons, errno-style errors (`E404: no such page — see index(1)`), `//` empty states, no exclamation marks or marketing adjectives.

## Quick reference

- Link `styles.css` for everything in one import: tokens, fonts, type helpers, density, motion, component styles. (`colors_and_type.css` alone gets tokens + font families + type helpers.)
- Scopes on `<html>`: `data-mode="light|dark"` × `data-density="comfortable|default|compact"`. Defaults light, default. `data-theme` is retired — there is one theme.
- Look and feel: cool near-white / near-black grounds, one bronze accent, a vermilion benchmark mark, contour-blue linework, mostly flat sheets, dense rows.
- Four families: Zilla Slab (display/plate titles), Hanken Grotesk (UI/body, `1.0625rem / 1.6`), IBM Plex Mono (data, labels, `//` chrome, code), IBM Plex Sans Condensed (amounts, readouts, tabular columns).
- Amounts: currency mark smaller and muted, decimals smaller than the integer, tabular and right-aligned.
- Every chromatic role ramps to seven steps defined by measured contrast against its own ground. Reference the semantic role, not a step number.
- Rows vs tables: one record per row with a label→value→`›` structure is `Cell`; multi-column tabular data is `Table`. A table does not become a list when the screen narrows.
- Density: `--cell-h` / `--control-h` — 48px comfortable, 40px default, 32px compact. Type size does not change with density.
- Spacing: 4px grid, 2px micro-step — `2xs 2 · xs 4 · sm 8 · md 16 · lg 24 · xl 32 · 2xl 48 · 3xl 64`. Breakpoints `sm 40em` / `md 53.75em`.
- Motion: `fast 150ms` · `base 250ms` · `slow 300ms` · `survey 480ms`, all ease-out, colour and translate only. Honour `prefers-reduced-motion`.

## Scope

This is a general design system — use it for anything, production or throwaway, desktop or mobile. This repo is the source of truth: token sources, the generator, tokens, fonts, type helpers, components, specimen cards, and every platform target (terminal, editor, Wayland, Nix, TUI) under `platforms/`.

Deeper reading: `DESIGN.md` (the whole contract, including voice), `docs/STYLE-GUIDE.md` (which token, when), `docs/ACCESSIBILITY.md` (WCAG commitments).
