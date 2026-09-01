# Changelog

All notable changes to the Jylhis design system are documented here.
The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/)
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

Canonical token spec: [`tokens.md`](./tokens.md). Consumer guide:
[`docs/INTEGRATION.md`](./docs/INTEGRATION.md).

## [Unreleased]

## [2.0.0] — 2026-09-01

The system becomes a **theming framework**: a theme-independent core plus
swappable themes, each with a first-class light and dark mode. Design rationale
lives in [`docs/THEMING.md`](./docs/THEMING.md).

### Changed — BREAKING

- **Tokens split into a core + themes.** `tokens.json` is retired in favour of
  `tokens.core.json` (theme-independent: type stack, scale, spacing, layout,
  radii, breakpoints, z-index, border widths, focus, density, motion, sound, and
  the colour-role taxonomy) plus `themes/<slug>.json` (palette / syntax / status
  / ANSI + measured contrast claims). Consumers reading `tokens.json` must move to
  the new sources.
- **Selectors are orthogonal theme × mode.** `data-theme="<slug>"` ×
  `data-mode="light|dark"` on `<html>` (defaults: survey, light). The old
  `data-theme="dark|sheet|field"` selectors are retired. `tokens.css` now emits
  `:root` (survey light), `[data-mode="dark"]`, `[data-theme="mono"]`, and
  `[data-theme="mono"][data-mode="dark"]`.
- **Generated targets are uniform `jylhis-<theme>-<light|dark>`.** Every derived
  platform file is emitted in all four variants (survey/mono × light/dark) by
  role-mapped recolouring of the committed Survey reference files in
  `platforms/_reference/`. Filenames move from `jylhis-{sheet,field}.*` to
  `jylhis-{survey,mono}-{light,dark}.*` (Kvantum `Jylhis<Theme><Mode>.colors`,
  mako `config-<t>-<m>`, waybar `style-<t>-<m>.css`). `waybar/style.css` and
  `mako/config` stay as survey-dark copies for name-hardcoding consumers.
- **Nix options are orthogonal.** The single `variant` (sheet|field) option on the
  Home Manager and stylix modules is replaced by `name` (survey|mono) + `mode`
  (light|dark). `lib.variantToBase16Scheme` is replaced by
  `lib.toBase16Scheme pkgs { theme; mode; }`, and `lib.mkPalette { theme; mode; }`
  returns `{ hex; ansi; ansi16; base16; }` read from the token sources + committed
  base16 YAML. `nix/install-map.nix` enumerates the four variants per target from a
  cartesian product and adds `gimp`, `shadcn`, `adobe` targets.

### Added

- **Monochrome theme (`themes/mono.json`).** Neutral grayscale; interaction as
  inverted ink fills; the maker's mark as the one pure black/white; syntax in gray
  steps carrying meaning through weight/italic (`--syntax-<role>-weight/style`);
  chromatic status colours kept for safety.
- **`docs/THEMING.md`** — the framework spec and the add-a-theme recipe.

### Fixed

- **Generator `bare` mode.** base16 and console outputs quote hex without a
  leading `#`, which `recolor()`'s `#`-anchored regex missed — so Monochrome
  base16/console were Survey colours merely renamed. `recolor()` gained a `bare`
  mode threaded through `deriveTarget()`/`generate.mjs`, set on the base16 and
  console targets. Survey output stays byte-identical.
- **Monochrome comment contrast.** `syn-comment` lifts light `#707070`→`#666666`
  and dark `#8c8c8c`→`#929292`; the `syn-comment` contrast claim in both
  `mono.json` and `survey.json` now measures against the true worst ground
  (`surface` light, `surface-raised` dark) instead of `bg`.
- **Validator false positives.** `validate-a11y-html.mjs` now treats an `<input>`
  wrapped in a `<label>` with visible text as labelled; `validate-a11y-css.mjs`
  credits the one universal `prefers-reduced-motion` guard in
  `colors_and_type.css` as covering first-party component/preview/mock CSS, while
  still failing if that guard is removed.

## [1.1.0] — 2026-07-27

Three threads land together: the v2 spec's validation findings (accent to AAA,
Modus 4 re-sync, one canonical maker's mark, prototypes as thin consumers), a
generated **Tailwind / shadcn target** so those findings reach Tailwind
consumers without a hand conversion, and **font scaling** — the system was
already `rem`-based, but it had no stated commitment about text size, a floor
small enough to be uncomfortable, and three places where scaling was silently
defeated. Scaling spec:
[`docs/ACCESSIBILITY.md` § Text resizing & reflow](./docs/ACCESSIBILITY.md#text-resizing--reflow).

### Changed — BREAKING

- **Sheet accent retuned to AAA.** Light `accent` deepens `#8a4d00`→`#6f3e00`
  (≥7:1 on every Sheet ground; 8.35:1 on `bg`), and light `accent-hover`
  becomes the former accent `#8a4d00`. `cursor`, `accent-subtle`, ANSI 11, and
  every generated target follow. The declared floor in `tokens.json#contrast`
  rises 4.5→7 for the Sheet accent.
- **Syntax palette re-synced to current Modus 4.x, verbatim.** Light
  keyword/string/type were frozen at Modus-v3 values; light variable moves to
  Modus cyan, docstring to green-faint `#2a5045`; dark comment `#989898`,
  docstring follows Vivendi's own cyan-faint mapping `#9ac8e0`. Numbers now
  borrow the Modus `constant` slot (`#0000b0` / `#00bcff`) since upstream
  leaves numbers unstyled. `status-warn` light is Modus yellow-warmer
  `#884900`; ANSI 10 picks up green-warmer `#316500`. `syn-string` carries a
  declared AA floor (6.63:1 on the cool Sheet ground); the other headline
  syntax roles stay AAA.
- **The maker's mark is the prompt.** `jy ❯` — pure type in IBM Plex Mono,
  chevron in benchmark vermilion — is now the single canonical mark
  (README/DESIGN/PRODUCT agreed on three different marks before).
  `assets/favicon.svg` is regenerated as the type mark with scheme-aware ink;
  the v1 copper rune is retired. The benchmark (△ in ◯) remains the
  survey-plate datum symbol.
- **The bottom four steps of the type scale move up.** `--type-scale-6…9` go
  from `0.85 · 0.8 · 0.75 · 0.72` to `0.9 · 0.875 · 0.85 · 0.8125` (rem). Steps
  0–5 are unchanged, so headings, body copy, cards, callouts and CV bodies do not
  move — only chrome grows, and the floor rises from ~11.5px to 13px at a 16px
  root. Consumers of the small steps will render slightly larger.
- **Breakpoints are `em`.** `tokens.json#breakpoints` is now `sm: 40em` /
  `md: 53.75em` (640px / 860px at the 16px default). `em` media queries resolve
  against the browser's default font size, so the layout reflows for a reader who
  raises their default text size — a px query holds the wide layout and cramps
  the text instead. Hand-authored `@media` rules updated to match.
- **`density` padding and gaps are `rem`** (`rowPadY`, `gapInline`, `gapBlock`)
  so row rhythm tracks text size. `hitTargetMin` stays `44px` — WCAG target size
  is a physical minimum.

### Changed

- **StatusBadge renders glyph + word** (`✓ ▪ △ ⑂`, glyph `aria-hidden`),
  closing the gap with DESIGN.md's status rule; the `experimental` variant
  moves off the syntax-keyword token onto contour blue.
- **Readout motion joins the token scale**: `.ds-readout` types on at the
  480ms `survey` duration (was a stray 420ms — the retired v1 `spring`).
- CvEntry skill-line child classes renamed to `ds-`-prefixed names
  (`.k/.b/.v/.c` → `.ds-cv__skill-*`).
- `validate-preview-hex.mjs` now scans the root showcase pages
  (`index.html`, `palette.html`, `md.html`, `font_options.html`,
  `platforms/index.html`), `prototypes/**`, and `mocks/**` — hex provenance
  is enforced everywhere, with no prototype exemption.
- Platform prototypes are thin consumers of the system plus new
  self-contained mock-template packages under `mocks/` (stage scaler, TUI
  shell, macOS chrome, tablet frame) — chrome extracted from the prototypes,
  tokens only, no raw hex.
- Documentation trued up against the shipped system: validator count is seven
  everywhere; deployment story is Cloudflare (no GitHub Pages); README's
  visual-foundations/iconography sections describe v2; INTEGRATION's greeter
  and font guidance match the self-hosted reality; KEYBOARD.md drops its
  box-shadow kbd spec and pure-black backdrops for the `scrim` token;
  ACCESSIBILITY.md states the measured ratios and the cool-ground caveat.

### Added

- `platforms/shadcn/tokens.css` — a Tailwind / shadcn target. The palette under
  the shadcn semantic names as bare HSL triplets, so `bg-primary/10` and the
  rest of Tailwind's opacity modifiers resolve. Self-contained (it restates the
  font families and radii) and emits Field under both `.dark` and
  `[data-theme="dark"]`. Also carries the Jylhis roles, `--chart-1..5`, and
  pre-flattened `--status-*-bg` tints for alert/chip surfaces — the alphas are
  the ones `validate-tokens.mjs` already sweeps, and it now fails loudly if
  those levels are removed from `TINT_LEVELS`.

  Tailwind consumers previously hand-converted the palette to HSL, which is how
  `career-pipeline` ended up still shipping the pre-a11y copper two releases
  after 0.5.0 fixed it. Generated, that cannot recur.
- **`typography.scaling` in `tokens.json`** — the declarative commitment:
  `readableFloor` (`0.9rem`, for anything a user must read), `absoluteFloor`
  (`0.8125rem`, glanceable chrome only), `minRelativeEm`, the fluid-type recipe,
  and the 1.4.4 / 1.4.10 / 1.4.12 targets. Emitted as `--type-readable-min` and
  `--type-floor` in `tokens.css`, and rendered into `tokens.md` §4.
- **`scripts/validate-a11y-type.mjs`** — seventh validator, wired into CI and
  the Nix `validate` check. Errors on px `font-size`, sub-floor `rem`,
  viewport-only `clamp()` middles, and any `html`/`:root` font-size that isn't
  `100%`; warns on unfloored small `em`, off-scale `rem`, px `@media` bounds, and
  px-capped boxes around text.
- **`preview/type-scaling.html`** — specimen listing all ten steps with their
  rendered size at a 16px and a 24px browser default, and both floors marked.
- **`.ds-table-scroll`** — opt-in wrapper that lets a wide table scroll inside
  its own box instead of pushing the page sideways once text grows.
- **`html { font-size: 100% }` in `colors_and_type.css`** — restates the
  user-agent default so the "never override the reader's root size" rule is
  explicit and lint-checkable.

### Fixed

- **Relative sizes no longer compound.** `.ds-code-inline` / `:not(pre) > code`
  and `.ds-kbd` are now `max(<em>, var(--type-floor))`; nested in small chrome
  they previously resolved to ~9.8px.
- **Readable text lifted to the readable floor** — `.ds-field__label`,
  `.ds-field__help`, `.ds-table` cells, `.ds-codeblock pre`, `.ds-btn--search`,
  and the interactive labels `.ds-btn--link`, `.ds-breadcrumb`, `.ds-tabs__tab`,
  `.ds-pager`.
- **Fluid type keeps a `rem` term.** The showcase hero was
  `clamp(var(--type-scale-1), 5.5vw, var(--type-scale-0))` — viewport-only
  between the bounds, so it ignored the reader's font size entirely.
- **~190 hard-coded `px` and off-scale `rem` sizes** across `preview/*.html`,
  `components/*/card.html`, `index.html`, `palette.html` and `md.html` snapped
  onto the ten-step scale. `prototypes/` and `mocks/` (native-OS reskins and
  their chrome packages) and `font_options.html` (typeface sandbox) are
  deliberately exempt.
- **Reflow at 320px / 24px default text size.** The showcase and every specimen
  now fit without horizontal scrolling: card titles and file paths break
  (`overflow-wrap: anywhere`), the card grid is `auto-fit`, and wide tables and
  syntax blocks scroll in their own box. Verified headless at 320px and 1200px
  against a 16px and a 24px root.

### Removed

- `scripts/validate-consumer-freshness.mjs` and `source_styles/` — the live
  site ships a hashed CSS bundle, so URL-diffing was permanently broken and
  the snapshot had drifted a full palette generation; git history keeps both.
- `prototypes/brutal-neu.html` and `prototypes/hybrid.css` — v1
  warm-paper/neumorphism explorations, incompatible with the now-universal
  hex-provenance gate.

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

[Unreleased]: https://github.com/jylhis/design/compare/v2.0.0...main
[2.0.0]: https://github.com/jylhis/design/compare/v1.0.0...v2.0.0
[1.0.0]: https://github.com/jylhis/design/compare/v0.5.0...v1.0.0
[0.5.0]: https://github.com/jylhis/design/compare/v0.4.0...v0.5.0
[0.4.0]: https://github.com/jylhis/design/compare/v0.3.0...v0.4.0
[0.3.0]: https://github.com/jylhis/design/releases/tag/v0.3.0

<!-- Restore [0.1.0] link once the v0.1.0 tag is cut. -->
