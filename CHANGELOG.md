# Changelog

All notable changes to the Jylhis design system are documented here.
The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/)
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

Canonical token spec: [`tokens.md`](./tokens.md). Consumer guide:
[`docs/INTEGRATION.md`](./docs/INTEGRATION.md).

## [Unreleased]

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

[Unreleased]: https://github.com/jylhis/design/commits/main
<!-- Restore [0.1.0] link once the v0.1.0 tag is cut. -->
