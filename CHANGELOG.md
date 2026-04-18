# Changelog

All notable changes to the Jylhis design system are documented here.
The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/)
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

Canonical token spec: [`tokens.md`](./tokens.md). Consumer guide:
[`docs/INTEGRATION.md`](./docs/INTEGRATION.md).

## [Unreleased]

### Added
- `docs/INTEGRATION.md` — web, Go, terminal, Emacs, Wayland quick-starts
  plus a "how to add a new platform" checklist.
- `CHANGELOG.md` (this file) with semver policy.
- `source_styles/README.md` — clarifies that the files in `source_styles/`
  are read-only reference copies of the real site and that `tokens.md` is
  the canonical direction of truth.
- `scripts/validate-tokens.mjs` — validates hex-drift between `tokens.md`,
  `colors_and_type.css`, `platforms/charm/jylhis/palette.go`, and the
  Ghostty themes; checks CSS custom property naming and `var(--…)`
  resolution; verifies AAA body-text contrast claims.
- `index.html` — Pages landing page with links to previews, platform
  gallery, token spec, UI kit, and integration guide.
- `.github/workflows/validate.yml` — runs the token validator on every
  push and pull request.
- `.github/workflows/pages.yml` — builds and deploys the static site to
  GitHub Pages on pushes to the default branch.

### Changed
- `README.md` — added a web quick-start snippet and a link to
  `docs/INTEGRATION.md` and `CHANGELOG.md`.
- `devenv.nix` — documents the Node-based validation entrypoint.

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

[Unreleased]: https://github.com/jylhis/design/compare/v0.1.0...HEAD
[0.1.0]: https://github.com/jylhis/design/releases/tag/v0.1.0
