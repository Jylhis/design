# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

The interactive design surfaces this repo authors and reviews (the showcase
`index.html`, `preview/` specimen cards, `prototypes/`) are web. The product
as a whole also emits generated, non-web theme targets (terminal, Emacs,
Wayland desktop, Qt/GTK, phone) from the same source, but those are generated
color/config files rather than per-OS native app design languages, so `web`
is the design-language platform for interactive work.

## Users

Primary: **Markus Jylhänkangas** himself, as the sole maintainer and daily
consumer. The showcase, preview cards, and prototypes exist first as his own
working reference while dogfooding the system across editor, desktop, CLI, and
site. Utility and correctness outrank persuasion.

Secondary, real but not the surface these repo surfaces must succeed for first:
downstream integrators (himself and any AI agents extending the system) who
read tokens, specimens, and integration docs to consume the system correctly.

## Product Purpose

A single-source-of-truth design system for a personal engineering identity.
`tokens.json` holds every color, spacing step, type, motion value, ANSI slot,
and contrast claim; `scripts/generate.mjs` generates every platform target from
it. Success is one coherent surveyed identity rendering identically across every
surface Markus uses — each surface a sheet triangulated from the same datum —
with the accessibility claims mechanically enforced.

## Positioning

- **One cool light, one cool dark, both first-class and both AAA-body.** Not a
  large themed family; **Sheet** (light, the printed survey) and **Field** (dark,
  the night field-book) are tuned independently, never mirrored. They are the
  *source and output* of one survey, not tinted twins.
- **Cartographic-survey aesthetic as identity, not decoration.** `tokens.json` is
  the **datum**; each surface is a **sheet** of one atlas, a **trig station**
  triangulated to that datum. Contours, graticule, legend, scale bar, title
  block; Unicode glyphs as the icon set.
- **Single bronze accent, reserved.** Bronze/amber is interaction and the maker's
  mark only; a Modus blue carries structural linework; a benchmark vermilion
  marks the datum. The accent is deliberately never a syntax color.
- **Modus palette everywhere.** The whole system is grounded in Emacs Modus
  (Operandi / Vivendi), AAA by construction and tritanopia-aware; code renders
  pixel-identical across Emacs, web, `bat`/`delta`, Charm TUIs.
- **Generated, never hand-duplicated.** No hex lives outside `tokens.json`.

## Operating Context

The product boundary is the design system **plus every dogfooded consumer**,
treated as one holistic system. The generated targets are exercised against
these real surfaces before each release (see README "Dogfooding"):

- **jylhis.com** — Astro personal site, pins `tokens.css` + type stack.
- **Jotain** — personal Emacs config; the two Emacs themes reload each release.
- **Marchyo** — personal NixOS / Hyprland workstation; full desktop chrome
  (Ghostty, Hyprland, Rofi, Waybar, Mako, Hyprlock, GTK, Kvantum, shell).
- **nacutils** — personal CLI/TUI toolbox; links the Charm Go palette.
- **Creative tooling** — GIMP/Inkscape/Krita/Affinity/Photoshop swatch files.
- **HyperOS / MIUI phone** — `.mtz` theme.

A consumer breaking after a release means the bug is in this repo, not the
consumer. Development runs on devenv (Nix); Bun drives generation and the
validator gauntlet; CI enforces every validator on push/PR.

## Capabilities and Constraints

- **Generation pipeline:** `bun scripts/generate.mjs` writes ~30 platform files
  (text + one binary ASE) from `tokens.json`; `--check` gates CI on divergence.
- **Validator contract (the spec of "done"):** token schema + WCAG contrast +
  CSS `var()` resolution; HTML a11y; CSS a11y; CLI/TUI conventions; Emacs face
  manifest; preview hex provenance. If a validator is wrong, fix it in the same
  PR; never silence it.
- **Components:** a React library of 16 components, each `<Name>.jsx` + `.d.ts`
  + `card.html` specimen, styled by `components/components.css` using tokens
  only, one class per component.
- **Emacs three-tier degradation:** every face spec degrades 24-bit GUI hex →
  nearest xterm-256 → named 16-color ANSI slot; ANSI slot 11 is always the
  bronze accent.
- **Hard constraints (from ENGINEERING_PRINCIPLES.md, treat as invariant):**
  no gradients, no drop shadows, no glass/backdrop-filter; elevation via
  bg-color steps + 1px hairlines (survey linework); motion is the "survey
  renders in" grammar — draw-in / extend / count-up, `ease-out`, no bounce,
  `prefers-reduced-motion` honored; no icon font/SVG sprite/emoji, Unicode glyphs
  + thin `currentColor` survey marks instead; no hex duplication; dual-theme
  (Sheet/Field) parity is mandatory. (v2 note: the former no-sans-serif rule is
  retired — the type system is a three-role stack; see Brand Commitments.)
- **Deliberately small, slow-changing.** Two themes, one accent, one type pair,
  a fixed list of targets. Adding a target or token group is an argued decision.

## Brand Commitments

- **Name:** Jylhis Design System — **v2, "The Survey"**, for jylhis.com (Markus
  Jylhänkangas, Senior Software Engineer & DevOps specialist, Zürich). The
  design system as a topographic survey: one datum, every sheet.
- **Palette (Modus-lean, cool, tritanopia-checked):** two editions —
  **Sheet** (light, ground `#f6f8fb`) and **Field** (dark, ground `#0d0f14`);
  cool near-white / near-black, never pure. Single **bronze** interactive accent
  (Sheet `#8a4d00` / Field `#e0a33a`); **Modus blue** structural contour
  (`#2f4fb0` / `#6f9be0`); **benchmark vermilion** for the datum mark
  (`#b5450e` / `#ef8a4a`). Status is Modus red/amber/green/cyan, toned so nothing
  glows and always paired with a glyph + word.
- **Type (three roles, retiring the old two-font rule):** **Zilla Slab** technical
  slab serif for plate/display titles; **Hanken Grotesk** humanist grotesk for UI
  and body; **IBM Plex Mono** for coordinates, data, ledger digits, and code.
- **Maker's mark:** the **benchmark** — a thin `currentColor` triangle inside a
  survey circle (a trig-station/benchmark glyph), the datum symbol, always in the
  accent/vermilion. The one bespoke SVG in the system.
- **Voice:** first-person singular, direct, a little dry, engineer-not-marketer,
  now in the surveyor's register (datum, sheet, contour, benchmark, edition).
  Buttons are lowercase commands; errors are errno-style; empty states are `//`
  comments; no exclamation marks, no marketing adjectives. (docs/VOICE.md)
- **Casing:** lowercase chrome, sentence/title-case prose, `UPPERCASE` mono
  survey labels, canonical casing for code and proper nouns.
- **Lineage acknowledged, not copied:** **Modus** is now the primary palette
  ground (AAA + tritanopia); Solarized (measured lightness), Leuven, Catppuccin
  (cool grounds) inform specific decisions; none is imitated wholesale.

## Evidence on Hand

- Live production site: https://jylhis.com (Astro, Cloudflare Pages).
- Deployed showcase on GitHub Pages (`index.html` + preview/prototype assets).
- Real site CSS mirrored verbatim in `source_styles/` for reference/drift check.
- Full docs set: README, CHANGELOG, ENGINEERING_PRINCIPLES, WAY_OF_WORKING,
  and `docs/` (ACCESSIBILITY, STYLE-GUIDE, VOICE, INTEGRATION, REVIEW,
  CLI-TUI-GUIDELINES), plus `platforms/KEYBOARD.md`.
- Assets present: `assets/favicon.svg`, `apple-touch-icon.png`, `og-default.png`
  only. There is deliberately almost no other imagery; future work must not
  fabricate testimonials, customers, metrics, or stock photography.

## Product Principles

1. **One source of truth or it does not exist.** Every value derives from
   `tokens.json`; generated targets are never hand-edited.
2. **Both editions, always.** Nothing ships in Sheet without Field, or vice
   versa. Optional CVD editions (tritanopia/deuteranopia, per Modus) may be added
   as a bonus, but never at the expense of Sheet/Field parity.
3. **Accessibility is a mechanical contract.** AAA body, AA meta, decorative
   faint, enforced by validators against the generated output, not by claim. The
   contour *is* the contrast threshold; a role below its floor does not print.
4. **The chrome is borrowed from the survey, honestly.** Cartographic and
   drafting tropes (datum, contour, graticule, legend, title block) are the
   identity; no emoji, no gloss, no marketing sheen.
5. **Small surface, slow change.** Additions are deliberate and argued, never
   drive-by. The system stays legible because it stays small.

## Roadmap Constraints

- **Stays single-maintainer.** Deliberately one person's system; it is not
  headed toward a governed public library with a contributor process. Design
  work should not add ceremony that presumes a team.
- **Road to v1.0.** Currently `0.5.0`; a near-term goal is stabilizing toward
  1.0. Avoid churn that needlessly breaks downstream consumer pins.
- **Expanding platform targets is an ongoing goal.** New generated targets will
  be added over time (deliberately, per Principle 5); future work should
  anticipate the target list growing rather than treat it as fixed.

## Accessibility & Inclusion

- Body text WCAG 2.1 **AAA** on both Sheet and Field; `text-muted` clears **AA**;
  `text-faint` is decorative/non-text-critical only, and lint keeps it off body
  and meta text. Palette is Modus-grounded (AAA by construction) and
  tritanopia-checked; status separations avoid blue-vs-yellow reliance.
- Status is never conveyed by color alone: every status line pairs a glyph with
  a word (enforced by `validate-a11y-html.mjs`).
- Motion respects `prefers-reduced-motion`; focus is always a visible
  `:focus-visible` ring (`outline:none` must have a replacement).
- CVD policy and the full measurable commitments live in `docs/ACCESSIBILITY.md`;
  non-web surfaces are held to WCAG2ICT-adapted equivalents.
