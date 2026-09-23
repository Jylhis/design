# Jylhis Design System

A design system for me.

The site is personal, technical, and deliberately cartographic: cool near‑neutral grounds, a single bronze accent, engraved plate titles over grotesk body, structure drawn in contour blue. No frameworks, no gradients, no emoji.

## Principles

The contract is [`DESIGN.md`](./DESIGN.md): measured contrast, one bronze
accent plus one destructive role, both modes first-class, Unicode-as-icons,
no gradients, tokens-first. The token sources are the only place a value
lives.

## Inspired by, different from

- **Modus Themes** (Protesilaos). We import the Operandi (light) and Vivendi (dark) syntax palettes verbatim (current Modus 4.x values), so any code rendered against Jylhis matches an Emacs Modus session pixel-for-pixel; the Negative status colors are the one deliberate deviation, toned so nothing glows. Where Modus ships eight themes (main + tinted + deuteranopia + tritanopia variants) we ship one theme with two modes — the philosophy is "one cool light, one cool dark, both AAA-body."
- **Solarized** (Schoonover). Solarized's selective-contrast and lightness-symmetry ideas underwrite our `text-muted` / `text-faint` ladder. We do not match its CIELAB symmetry between modes — Print and Negative are tuned independently, not mirrored.
- **Nord**. Nord groups its sixteen named colors thematically (Polar Night, Frost, Aurora). We adopt the same idea — thematic group names _over_ role names — but with a cartographic-survey vocabulary instead of an Arctic one.
- **Catppuccin**. Catppuccin's per-color usage guide and four-flavor parity influenced our integration docs and dual-theme requirements. We do not follow its multi-accent pastel approach — Jylhis is single-accent and cool.
- **Leuven** (Niessen). Leuven's prose-and-Org focus reminded us that a theme is judged on long-form reading first; our Hanken Grotesk body and `72ch` measure are the answer to that.

## Source

- **Source of truth:** [`tokens.core.json`](./tokens.core.json) + [`themes/jylhis.json`](./themes/jylhis.json) — every color, spacing, motion, and typography value
- **Live site:** https://jylhis.com (Astro, hand‑written CSS, served via Cloudflare)
- **Showcase:** `index.html`, served via Cloudflare

## Architecture

```
tokens.core.json + themes/jylhis.json  ← sources of truth
    │
    ├── bun scripts/generate.mjs   ← generates all targets
    │
    ├── tokens.core.json           ← theme-independent framework (source of truth)
    ├── themes/jylhis.json         ← the one theme
    ├── tokens.css                 ← CSS custom properties (light + dark)
    ├── tokens-data.js             ← JS for the showcase website
    ├── platforms/ghostty/         ← Ghostty themes
    ├── platforms/emacs/           ← Emacs themes (three display tiers)
    ├── platforms/charm/           ← Go palette (lipgloss/Bubble Tea)
    ├── platforms/bat/             ← bat/delta syntax themes
    ├── platforms/hyprland/        ← Hyprland color configs
    ├── platforms/rofi/            ← Rofi themes
    ├── platforms/gtk/             ← GTK overrides
    ├── platforms/waybar/          ← Waybar CSS (light + dark)
    ├── platforms/mako/            ← Mako configs (light + dark)
    ├── platforms/kvantum/         ← Kvantum color palettes
    ├── platforms/base16/          ← base16 schemes (stylix)
    ├── platforms/console/         ← Linux kernel TTY palettes
    ├── platforms/plymouth/        ← Plymouth boot-splash themes
    ├── platforms/gimp/            ← GIMP / Inkscape / Krita swatches
    ├── platforms/adobe/           ← Adobe .ase swatches (binary)
    ├── platforms/hyperos/         ← HyperOS/MIUI phone themes
    └── platforms/shell/fzf-*.sh   ← fzf palettes (rest of shell/ is hand-authored)

colors_and_type.css                ← hand-authored (imports tokens.css + type helpers)
```

Change a color in `themes/jylhis.json`, run `bun scripts/generate.mjs`, and every platform updates.

## Index

| File                                   | What it is                                                                                                                                                                                                                               |
| -------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `tokens.core.json` + `themes/jylhis.json` | **Sources of truth.** Machine‑readable core framework and the theme's palette, syntax, ANSI, ramps, contrast claims.                                                                                                                               |
| `tokens.css`                           | Generated CSS custom properties (light + dark). Imported by `colors_and_type.css`.                                                                                                                                                       |
| `tokens-data.js`                       | Generated JS module for the showcase website.                                                                                                                                                                                            |
| `styles.css`                           | **One-import entry point** — pulls in `colors_and_type.css`, `motion.css`, and `components/components.css`.                                                                                                                              |
| `colors_and_type.css`                  | Hand‑authored font stacks + semantic type helpers. Imports `tokens.css` + `fonts.css`.                                                                                                                                                   |
| `fonts.css`                            | Self-hosted `@font-face` blocks (Zilla Slab + Hanken Grotesk + IBM Plex Mono, latin/latin-ext subsets).                                                                                                                                  |
| `motion.css`                           | The "survey renders in" motion signature — `.ds-contour-draw`, `.ds-line-extend`, `.ds-readout`, `.ds-caret`, mapped to the motion tokens.                                                                                               |
| `components/`                          | React component library; each component ships JSX, `.d.ts`, and a `card.html` specimen, styled by `components/components.css`. The showcase lists them all.                                                                          |
| `scripts/generate.mjs`                 | Reads the token sources, writes generated platform target files.                                                                                                                                                                             |
| `scripts/validate-tokens.mjs`          | Schema validation, contrast checks (explicit + extended sweep), CSS `var()` resolution.                                                                                                                                                  |
| `scripts/validate-a11y-html.mjs`       | HTML accessibility (lang, alt, labels, focus, reduced-motion, status-with-glyph).                                                                                                                                                        |
| `scripts/validate-a11y-css.mjs`        | CSS accessibility (transitions guarded, outline replaced on `:focus-visible`).                                                                                                                                                           |
| `scripts/validate-cli-conventions.mjs` | bun scripts follow [`docs/CLI-TUI-GUIDELINES.md`](./docs/CLI-TUI-GUIDELINES.md).                                                                                                                                                         |
| `nix/ghostty.nix`                      | Nix derivation: wraps Ghostty with Jylhis themes.                                                                                                                                                                                        |
| `nix/emacs.nix`                        | Nix derivation: Emacs theme package via `trivialBuild`.                                                                                                                                                                                   |
| `nix/themes.nix`                       | Nix derivation: all theme files as a single package.                                                                                                                                                                                     |
| `platforms/`                           | Generated theme files. `KEYBOARD.md`, `charm/` Go styles, and `shell/` (except the generated `fzf-*.sh`) are hand‑authored.                                                                                                             |
| `platforms/charm/`                     | Go package (`jylhis`) for Charm TUIs — palette + pre-built lipgloss styles + themed bubbles + Bubble Tea light/dark detection.                                                                                                           |
| `docs/INTEGRATION.md`                  | How to consume the system from web, Go, terminal, Emacs, Wayland, Nix; how to add a new platform.                                                                                                                                        |
| `docs/CLI-TUI-GUIDELINES.md`           | Design conventions for any CLI/TUI shipped with the system.                                                                                                                                                                              |
| `docs/ACCESSIBILITY.md`                | Measurable WCAG commitments, CVD policy, and what the validators enforce.                                                                                                                                                                |
| `docs/STYLE-GUIDE.md`                  | Visual language: when to pick which token.                                                                                                                                                                                               |
| `platforms/KEYBOARD.md`                | Focus, kbd, command-palette, selected-row, canonical shortcuts.                                                                                                                                                                          |
| `preview/`                             | HTML specimen cards for the showcase.                                                                                                                                                                                                    |
| `prototypes/`                          | Interactive prototypes — desktop (Norton-Commander TUI), macOS reskin, tablet, web. All are thin consumers of `styles.css` + the components library, with platform chrome from `mocks/`.                                                 |
| `mocks/`                               | Self-contained mock-template packages — `stage/` (fixed-canvas scaler), `tui/`, `macos/`, `tablet/` chrome. Tokens only, no raw hex; see `mocks/README.md`.                                                                              |
| `index.html`                           | Showcase landing page, served via Cloudflare.                                                                                                                                                                                            |

---

## Quick start

### Web (CSS)

```css
@import "./vendor/jylhis/colors_and_type.css";

html {
  background: var(--color-bg);
  color: var(--color-text);
}
a {
  color: var(--color-accent);
}
a:hover {
  color: var(--color-accent-hover);
}
```

```js
document.documentElement.dataset.mode = matchMedia(
  "(prefers-color-scheme: dark)",
).matches
  ? "dark"
  : "";
```

### Nix (Ghostty with themes)

```nix
ghostty-jylhis = pkgs.callPackage /path/to/design/nix/ghostty.nix {};
```

### Development

```bash
bun scripts/generate.mjs                  # regenerate targets from tokens.core.json + themes/jylhis.json
just generate-check                       # determinism gate: two generate runs must agree
bun scripts/validate-tokens.mjs           # schema + contrast validation
bun scripts/validate-a11y-html.mjs        # HTML accessibility
bun scripts/validate-a11y-css.mjs         # CSS accessibility
bun scripts/validate-cli-conventions.mjs  # CLI conventions audit
serve-pages                               # build the _site showcase artifact, serve locally, rebuild on changes
```

All four static validators support `--help` and `--version` and run in CI on every push.

Full consumer guide: [`docs/INTEGRATION.md`](./docs/INTEGRATION.md). Design conventions for command-line tools: [`docs/CLI-TUI-GUIDELINES.md`](./docs/CLI-TUI-GUIDELINES.md). Accessibility commitments: [`docs/ACCESSIBILITY.md`](./docs/ACCESSIBILITY.md).
Version history: [`CHANGELOG.md`](./CHANGELOG.md).
Project canon: [`DESIGN.md`](./DESIGN.md) (the contract), [`AGENTS.md`](./AGENTS.md) (repo mechanics).

---

## Dogfooding

The design system is not an abstract spec — it ships colors, fonts,
keyboard, and CLI conventions into the surfaces I use every day. Every
release is exercised against the consumers below before tagging.

| Consumer                                                          | What it pins                                                                                                                                                                              | Cadence                                                                                   |
| ----------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------- |
| **jylhis.com** (Astro)                                            | `tokens.css`, `colors_and_type.css`, Zilla Slab + Hanken Grotesk + IBM Plex Mono stack                                                                                                    | Production site; updated on every release.                                                |
| **Jotain** (personal Emacs config)                                | `platforms/emacs/jylhis-light-theme.el`, `jylhis-dark-theme.el`, Modus syntax mappings                                                                                                   | Daily driver editor; theme is reloaded on every release.                                  |
| **Marchyo** (personal NixOS / Hyprland workstation)               | `platforms/ghostty/`, `platforms/hyprland/`, `platforms/rofi/`, `platforms/waybar/`, `platforms/mako/`, `platforms/gtk/`, `platforms/kvantum/`, `platforms/shell/` | Full desktop chrome; pinned via `nix/themes.nix`.                                         |
| **nacutils** (personal CLI/TUI toolbox)                           | `platforms/charm/jylhis` Go package (palette, lipgloss styles, Bubble Tea light/dark detection)                                                                                           | Every TUI links the package; CLI conventions enforced via `validate-cli-conventions.mjs`. |
| **Creative tooling** (GIMP, Inkscape, Krita, Affinity, Photoshop) | `platforms/gimp/*.gpl`, `platforms/adobe/*.ase`                                                                                                                                           | Swatch palettes loaded on demand.                                                         |
| **HyperOS / MIUI phone**                                          | `platforms/hyperos/jylhis-light.mtz` / `jylhis-dark.mtz`                                                                                                                                 | Manual install per device.                                                                |

If a consumer breaks after a release, the bug is in this repo — not in
the consumer. File it here and revert if necessary before the consumer
patches.

---

## Known substitutions / gaps

- **Fonts:** the design system uses four roles — **Zilla Slab** (display/titles), **Hanken Grotesk** (UI/body), **IBM Plex Mono** (data/labels/code), **IBM Plex Sans Condensed** (amounts/readouts). All are OFL and ship full Finnish diacritic coverage. They are already self‑hosted: `fonts.css` carries the `@font-face` blocks and `fonts/` carries the subsetted `woff2` files.
- **No slide template** — this design system has no `slides/` folder.
- **Shell configs not generated** — `platforms/shell/` (starship.toml, bashrc, zshrc, dircolors) use ANSI color names rather than hex values, so they work with whatever terminal theme is loaded and are not generated from the token sources.

---

## Theming

One theme — **Jylhis** — with a first-class light and dark mode. Select with `data-mode="light|dark"` on `<html>`; `data-theme` is retired. Modes are named Print (light) and Negative (dark). Platform targets are generated as `jylhis-<light|dark>`; the edit recipe is in [`AGENTS.md`](./AGENTS.md).

## Releases

Semver; releases are cut by tagging `main`. Bump `meta.version` in
`tokens.core.json` (`package.json` must match — the validate check enforces
parity), move `[Unreleased]` into a dated CHANGELOG section, run `just
check`, open a release PR, then tag `vX.Y.Z` and push the tag. Consumers
(jylhis.com, Jotain, Marchyo, nacutils) move their pins on their side.

## License

MIT — see [`LICENSE`](./LICENSE).
