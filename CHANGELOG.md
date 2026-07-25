# Changelog

All notable changes to the Jylhis design system are documented here.
The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/)
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

Canonical token spec: [`tokens.md`](./tokens.md). Consumer guide:
[`docs/INTEGRATION.md`](./docs/INTEGRATION.md).

## [Unreleased]

## [1.0.0] — 2026-07-25

v2, **"The Survey"** — a full retheme. This is a breaking major: theme
identifiers, colour values, type stack, and motion token names all change.
Downstream pins must be updated deliberately. Design rationale lives in
[`DESIGN.md`](./DESIGN.md); the migration sequence is
[`docs/v2/BUILD-PLAN.md`](./docs/v2/BUILD-PLAN.md).

### Changed — BREAKING

- **Theme identifiers renamed `paper`→`sheet`, `roast`→`field`** across every
  generated target, Nix option, Go `Mode` constant, and Emacs theme symbol.
  Files move from `jylhis-{paper,roast}.*` to `jylhis-{sheet,field}.*`
  (`JylhisPaper.colors`→`JylhisSheet.colors`, `style-paper.css`→
  `style-sheet.css`, `config-paper`→`config-sheet`, `fzf-paper.sh`→
  `fzf-sheet.sh`). Emacs users load `jylhis-sheet` / `jylhis-field`; Nix users
  set `jylhis.theme.variant = "sheet" | "field"`. **Sheet** and **Field** are
  the display names.
- **Palette retoned to the Survey world.** Warm cream/roast grounds become cool
  near-white/near-black; the copper accent becomes bronze; a new `brand`
  benchmark vermilion carries the maker's mark; a new `contour` Modus blue
  carries structural linework, and `decorator` becomes the graticule.
- **Type stack replaced.** Literata + JetBrains Mono give way to three roles:
  Zilla Slab (display/titles), Hanken Grotesk (UI/body), IBM Plex Mono
  (data/labels/code). `--font-display` joins `--font-body` / `--font-mono`.
- **Motion token `spring` renamed `survey`** (`--transition-spring` →
  `--transition-survey`), retimed 420ms → 480ms and re-eased from an overshoot
  curve to expo-out. The system now bans bounce outright.
- **Motion idioms renamed** to the "survey renders in" grammar: `.ds-rule-draw`
  → `.ds-line-extend`, `.ds-typed` → `.ds-readout` (state class `.is-typed` →
  `.is-read`, custom property `--ds-type-ch` → `--ds-readout-ch`). `.ds-caret`
  is unchanged.
- **Token groups renamed** — Paperstock → Grounds, Copper → Bronze,
  Linen → Line.

### Added

- `.ds-contour-draw` — the third motion idiom: a stroked path that draws along
  its own length via `stroke-dashoffset`, on the `survey` token.
- `contour` and `scrim` are first-class palette roles; `scrim` is now registered
  under the Grounds group.
- `preview/survey-renders-in.html` (renamed from `preview/ink-draws-on.html`),
  now linked from the showcase index.
- `validate-tokens.mjs`: every colour role must belong to exactly one thematic
  group, no group may claim an undefined role, and no role may be claimed twice
  — ungrouped roles silently fell out of the showcase and the `.gpl` exports.

### Fixed

- `nix/home-manager-module.nix` shipped a **hand-copied v1 palette** for
  `FZF_DEFAULT_OPTS`. It now reads the generated `fzf-{sheet,field}.sh` back out
  of the themes package, so fzf colours can never drift from `tokens.json`.
- `platforms/hyprland/jylhis.conf` and `preview/motion.html` still carried the
  retired 420ms overshoot bezier. Both now use the `survey` curve, and
  `preview/motion.html` consumes `var(--transition-*)` instead of restating
  durations.
- Prototypes (`tablet`, `macos`, `desktop`) carried hard-coded v1 hexes and
  defaulted their font pickers to Literata / JetBrains Mono; all now resolve
  through token vars and the v2 stack.
- The showcase hero `h1` was set in mono, contradicting the page's own type
  claim; it now uses `--font-display`.
- `nix/themes.nix` pinned `version = "0.3.0"` while `tokens.json` said `0.5.0`.
  The package version is now read from `tokens.json`.
- `tokens.md` is now **generated** from `tokens.json` (with measured contrast
  ratios) instead of being a hand-maintained copy of every hex.
- Documentation, skills, and the `.impeccable/design.json` sidecar were still
  describing v1 (warm cream paper, copper, Literata/JetBrains Mono, Paper/Roast)
  after the token layer had moved to v2; all are now in sync.

## [0.5.0] — 2026-07-14

### Added
- Hyprlock lock-screen target (`platforms/hyprlock/jylhis-{paper,roast}.conf`),
  generated from `tokens.json`. Colors, JetBrains Mono, and field layout;
  auth/behavior stays the consumer's. Brings the last piece of Marchyo's
  desktop chrome upstream.
- `lib.mkPalette` flake helper (`nix/palette.nix`): reads `tokens.json` and
  returns `{ base16, ansi16, tty16, hex, ansi, variantKey }` for a variant, so
  downstream Nix configs stop hand-writing a tokens reader. Accepts
  `paper`/`roast` or `light`/`dark`.
- New token categories in `tokens.json`, emitted into `tokens.css`:
  `breakpoints` (`--breakpoint-*` + literal-value convention for media
  queries), semantic `zIndex` layers (`--z-*`), `borderWidth`
  (`--border-hairline/focus/marker`), and a `2xs` (2px) spacing micro-step.
- Generated type scale: `typography.scale` now emits `--type-scale-0…7`;
  headings consume the vars so sizes cannot drift from `tokens.json`.
- `scripts/validate-preview-hex.mjs` — CI fails when `preview/` or
  `components/*/card.html` contain a hex literal not present in
  `tokens.json` (wired into `validate.yml` and the `just validate`
  aggregate).
- `validate-tokens.mjs`: schema checks for the new categories, a
  `borderWidth.focus == focus.width` drift guard, and a tint sweep proving
  status/accent text stays legible on the 8/10/12% `color-mix` tints in
  both themes.

### Changed
- Alerts, callouts, and blockquotes retire the 3px left-border side-stripe
  in favor of a full hairline border + status/accent tint (owner decision
  per the Impeccable review; see `docs/REVIEW.md`). The 3px stripe remains
  only as the selected-item marker (`--border-marker`,
  `platforms/KEYBOARD.md`).
- `components/components.css` spacing snapped to the `--space-*` scale
  (was raw px; worst visual shift ±2px) and 1px borders now use
  `--border-hairline`.
- `Field` links help/error text to the input via `aria-describedby`
  (screen readers previously heard only "invalid").

### Fixed
- Stale pre-a11y accent `#9a5a2a` replaced with `#8a4f24` across previews,
  `tokens.md`, `README.md`, the brand-guidelines skill, the Emacs README,
  and `platforms/index.html` (which also carried the old selection-bg
  `#f0dcc4`); `preview/tables.html` now shows the real 6.09:1 ratio.
- `meta.version` drift: tokens.json said 0.3.0 while CHANGELOG had released
  0.4.0; the showcase badge now renders v0.5.0.

## [0.4.0] — 2026-06-01

### Fixed
- CSS transition tokens now preserve the cubic-bezier easing values from
  `tokens.json`.
- The showcase version badge is rendered from token metadata instead of
  hardcoded page text.
- Website UI kit note/project rows are keyboard-accessible native links.

## [0.3.0] — 2026-04-30

### Added
- Integration guide at `docs/INTEGRATION.md`.
- Semver changelog and policy (this file).
- Read-only notice for `source_styles/`.
- Token validator (`scripts/validate-tokens.mjs`): hex drift, CSS custom
  property naming, `var(--…)` resolution, WCAG contrast claims.
- Pages landing `index.html` with live swatches and theme toggle.
- GitHub Actions: token validation on every push; Pages deploy on `main`.

### Changed
- README web quick-start snippet; `devenv.nix` `validate-tokens` script.
- `tokens.md` changelog section defers to this file.

## [0.1.0] — 2026-04-17

### Added
- Initial spec in `tokens.md` (core palette, syntax/status family, ANSI
  16, typography, density, motion, sound, iconography, keyboard
  primitives).
- `colors_and_type.css` — CSS variable implementation plus semantic type
  helpers (`.ds-body`, `.ds-h1`–`.ds-h4`, `.ds-meta`, `.ds-code-inline`,
  `.ds-man-label`, `.ds-divider-label`).
- Platform targets under `platforms/`: Ghostty (Paper + Roast),
  bash/zsh/dircolors/starship, Hyprland, Waybar, Mako, Rofi (Paper +
  Roast), GTK 3/4, Kvantum, Emacs (Paper + Roast + toggle), Charm TUI Go
  package (`platforms/charm/jylhis` + runnable demo).
- `preview/` — 23 self-contained HTML cards exercising every token in
  both themes.
- `ui_kits/website/` — React recreation of the Astro site.
- `platforms/KEYBOARD.md` — focus ring, kbd, leader key, command palette,
  selected item, dismiss hints, audit checklist.
- `platforms/index.html` — visual overview across all targets.
- Literata + JetBrains Mono type pairing; Modus Operandi / Vivendi
  syntax palette so highlights are uniform across Emacs, web, terminal,
  and TUI.
- Charm TUI target (`platforms/charm/`) with Bubble Tea light/dark
  detection and pre-built lipgloss styles.

### Removed
- Fish support (kept bash and zsh only).

[Unreleased]: https://github.com/jylhis/design/compare/v0.5.0...main
[0.5.0]: https://github.com/jylhis/design/compare/v0.4.0...v0.5.0
[0.4.0]: https://github.com/jylhis/design/compare/v0.3.0...v0.4.0
[0.3.0]: https://github.com/jylhis/design/releases/tag/v0.3.0
<!-- Restore [0.1.0] link once the v0.1.0 tag is cut. -->
