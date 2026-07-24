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
it. Success is one coherent warm-paper identity rendering identically across
every surface Markus uses, with the accessibility claims mechanically enforced.

## Positioning

- **One warm light, one warm dark, both first-class and both AAA-body.** Not a
  large themed family; Paper and Roast are tuned independently for warmth, never
  mirrored, never a tinted afterthought of each other.
- **Terminal-and-press aesthetic as identity, not decoration.** Man-page
  headers, shell prompts, code-editor gutters, Unicode glyphs as the icon set.
- **Single copper accent, reserved.** Copper is UI chrome and the maker's mark
  only; it is deliberately never a syntax color.
- **Modus syntax everywhere.** Code renders with Emacs Modus (Operandi light /
  Vivendi dark) pixel-identical across Emacs, web, `bat`/`delta`, Charm TUIs.
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
  nearest xterm-256 → named 16-color ANSI slot; ANSI slot 11 is always copper.
- **Hard constraints (from ENGINEERING_PRINCIPLES.md, treat as invariant):**
  no gradients, no drop shadows, no glass/backdrop-filter; elevation via
  bg-color steps + 1px borders; motion is color + translate only, `ease-out`,
  `prefers-reduced-motion` honored; no icon font/SVG sprite/emoji; no
  sans-serif; no hex duplication; dual-theme parity is mandatory.
- **Deliberately small, slow-changing.** Two themes, one accent, one type pair,
  a fixed list of targets. Adding a target or token group is an argued decision.

## Brand Commitments

- **Name:** Jylhis Design System, for jylhis.com (Markus Jylhänkangas, Senior
  Software Engineer & DevOps specialist, Zürich).
- **Palette:** warm cream paper `#faf7f2` / dark roast `#1a1714`, never pure
  white or black; single copper accent (`--color-brand` for the mark,
  `--color-accent` for text-bearing accent).
- **Type:** JetBrains Mono headings/chrome/code over Literata serif body. No
  sans-serif. Monospace-heading-over-serif-body is the signature.
- **Maker's mark:** the inline SVG rune (`assets/favicon.svg`), thin square-cap
  stroke, always in accent color. The one bespoke SVG in the system.
- **Voice:** first-person singular, direct, a little dry, engineer-not-marketer.
  Buttons are lowercase commands; errors are errno-style; empty states are `//`
  comments; no exclamation marks, no marketing adjectives. (docs/VOICE.md)
- **Casing:** lowercase chrome, sentence/title-case prose, `UPPERCASE(7)`
  man-page labels, canonical casing for code and proper nouns.
- **Lineage acknowledged, not copied:** Modus, Solarized, Nord, Catppuccin,
  Leuven inform specific decisions; none is imitated wholesale.

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
2. **Both themes, always.** Nothing ships in Paper without Roast, or vice versa.
3. **Accessibility is a mechanical contract.** AAA body, AA meta, decorative
   faint, enforced by validators against the generated output, not by claim.
4. **The chrome is borrowed from the tools, honestly.** Terminal/man-page/press
   tropes are the identity; no emoji, no gloss, no marketing sheen.
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

- Body text WCAG 2.1 **AAA** on both Paper and Roast; `text-muted` clears **AA**;
  `text-faint` is decorative/non-text-critical only, and lint keeps it off body
  and meta text.
- Status is never conveyed by color alone: every status line pairs a glyph with
  a word (enforced by `validate-a11y-html.mjs`).
- Motion respects `prefers-reduced-motion`; focus is always a visible
  `:focus-visible` ring (`outline:none` must have a replacement).
- CVD policy and the full measurable commitments live in `docs/ACCESSIBILITY.md`;
  non-web surfaces are held to WCAG2ICT-adapted equivalents.
