# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

A personal design system for jylhis.com, restructured as a **theming framework**: a theme-independent core plus swappable themes, each with a first-class light and dark mode.

- **Core** (`tokens.core.json`): type stack (Zilla Slab display, Hanken Grotesk body, IBM Plex Mono readings), type scale + floors, spacing, layout, radii, breakpoints, z-index, border widths, focus, density, motion, sound, and the colour-role taxonomy (`groups`).
- **Themes** (`themes/<slug>.json`): **Survey** (`survey`, default — cool sheet grounds, bronze accent, vermilion maker's mark, contour-blue linework, Modus syntax; modes named Sheet/Field) and **Monochrome** (`mono` — neutral grayscale, interaction as inverted ink fills, the maker's mark as the one pure black/white, syntax in gray steps + weight/italic, chromatic status colors kept for safety).

Selection: `data-theme="<slug>"` × `data-mode="light|dark"` on `<html>` (defaults: survey, light). The old `data-theme="dark|sheet|field"` selectors are retired. No emoji, no gradients, no shadows; Unicode glyphs as icons. Full spec: `docs/THEMING.md`.

## Monorepo context

This tree is developed in the j10s monorepo at `projects/design/`; the public
github.com/Jylhis/design repo is a publish-outward projection (`just publish
design` from the monorepo root — see `kit/publish/README.md`). The
`project.nix` / `package.nix` / `default.nix` trio is the monorepo contract;
everything else works standalone so the projection stays a self-building repo.
Deliberate deviation: `devenv.yaml` stays self-contained (no `- /shared`
import) so `devenv shell` keeps working in the projection. The generator
outputs (`tokens.css`, `tokens-data.js`, `platforms/**`) are excluded from the
monorepo's treefmt to preserve the `generate.mjs --check` byte-parity gate.

Consequences of being a **one-directional** mirror, learned the hard way on the
first publish (2026-07-30) — do not re-add any of these:

- **No `.github/workflows/quality.yml`.** Commit linting is meaningless here:
  the only commit the public repo ever carries is
  `publish design from j10s@<sha>`, which is not a Conventional Commit. Secret
  scanning is already the publish gate (`gitleaks dir` in
  `kit/publish/default.nix`). Both jobs also referenced third-party actions the
  destination repo's Actions allowlist rejects, so every run **startup-failed**.
- **No `.github/dependabot.yml`.** A PR merged on the mirror is destroyed by the
  next `just publish design`. The Go modules under `platforms/charm` are watched
  from the monorepo's own dependabot config instead.
- **Third-party actions are a hazard in exported workflows.** `Jylhis/design`
  allows only GitHub-owned, Jylhis-owned, and `oven-sh/setup-bun@v2`. Prefer
  `run:` steps. `actionlint` runs over the export inside the publish gate.
- **`default.nix` and `flake.lock` must work standalone.** `default.nix`
  detects whether the monorepo is around it; `flake.lock`'s nixpkgs rev is held
  equal to the tree's by the `publish-flake-parity` flake check and rewritten by
  `just update`. Do not bump it independently.
- **The validator lists must stay in lock-step** — `justfile`'s `validate`,
  `package.nix`'s `checks.validate`, and `.github/workflows/validate.yml`. All
  four (`validate-tokens`, `validate-a11y-html`, `validate-a11y-css`,
  `validate-cli-conventions`), always.

## Commands

```bash
bun scripts/generate.mjs                  # regenerate all targets from tokens.core.json + themes/*.json
bun scripts/generate.mjs --check          # exit 1 if committed files diverge (CI mode)
bun scripts/validate-tokens.mjs           # schema + grouping + WCAG contrast + CSS var resolution (all themes)
bun scripts/validate-a11y-html.mjs        # HTML accessibility (lang, alt, labels, status-with-glyph)
bun scripts/validate-a11y-css.mjs         # CSS accessibility (reduced-motion guards; outline:none needs :focus-visible)
bun scripts/validate-cli-conventions.mjs  # scripts follow docs/CLI-TUI-GUIDELINES.md (--help, --version, stderr, exit codes)
serve-pages                               # build + serve the Pages artifact locally
```

All validators support `--help` and `--version`. Any token edit must be followed by `bun scripts/generate.mjs` and committed alongside.

## Architecture

### Sources of truth

| File | What |
|---|---|
| `tokens.core.json` | theme-independent framework + theme registry (`meta.themes`) |
| `themes/survey.json` | Survey palette/syntax/status/ANSI + contrast claims |
| `themes/mono.json` | Monochrome ditto |

### Generation pipeline: `scripts/generate.mjs` (+ `scripts/lib/emit.mjs`)

Native emitters produce `tokens.css` (`:root` = survey light, `[data-mode="dark"]`, `[data-theme="mono"]`, `[data-theme="mono"][data-mode="dark"]`) and `tokens-data.js` (top level mirrors the default theme; every theme under `themes`, with measured `contrastPairs` + `swatchContrast`).

Platform targets are derived from committed Survey reference files in `platforms/_reference/` by role-mapped recoloring + slug renaming — `ui`-priority for chrome targets, `syntax`-priority for Emacs/bat. Outputs are uniform `jylhis-<theme>-<light|dark>` files ×4 for: ghostty, rofi, hyprland, gimp, base16, console (nix), kvantum (`Jylhis<Theme><Mode>.colors`), mako (`config-<t>-<m>`), waybar (`style-<t>-<m>.css`), fzf, bat, emacs, plymouth (dirs), plus per-theme gtk (`jylhis-<t>.css`) and shadcn (`jylhis-<t>.css`). `waybar/style.css` and `mako/config` stay as survey-dark copies for name-hardcoding consumers.

Not yet themed: `platforms/charm/` (hand-authored Go, survey only), `adobe/*.ase` + `hyperos/*.mtz` (binary, survey renamed only), `platforms/shell/` starship/bashrc/zshrc/dircolors (ANSI-name based, theme-agnostic).

### Hand-authored (not generated)

- `colors_and_type.css` — imports `tokens.css` + `fonts.css`, semantic type helpers (`.ds-body`, `.ds-h1`, `.ds-meta`, …)
- `components/components.css` + `components/local.css` (local Plate/Legend styles)
- `platforms/shell/`, `platforms/ghostty/config`, `platforms/KEYBOARD.md`, `platforms/charm/`
- `tokens.md` — hand-maintained Survey spec

### Nix packaging (`nix/` + `flake.nix`)

The project ships its own `flake.nix` (nixpkgs-only input): per-target packages, a Home Manager module, a NixOS/darwin stylix module, an overlay, and palette helpers for stylix. The `nix/` directory holds the standalone `.nix` files (`callPackage` pattern, usable without the flake):

- `nix/ghostty.nix` — wraps Ghostty with the Survey themes in `XDG_DATA_DIRS`
- `nix/emacs.nix` — Emacs theme package via `trivialBuild`
- `nix/themes.nix` — every generated theme file as one derivation
- `nix/install-map.nix`, `nix/palette.nix`, `nix/themes-per-target.nix`,
  `nix/home-manager-module.nix`, `nix/system-stylix-module.nix` — install
  manifest (cartesian over theme × mode), palette helpers, per-target
  derivations, and the HM/stylix modules (orthogonal `name` + `mode` options)

### Showcase website

`index.html` renders swatches from `tokens-data.js` and has a **theme select + mode toggle** (persisted in localStorage as `jylhis-ds-theme` / `jylhis-theme`). Specimen cards in `preview/`, component sources in `components/`, prototypes in `prototypes/`, reusable chrome in `mocks/`.

## Workflow for changing a token

1. Edit `tokens.core.json` or `themes/<slug>.json`
2. `bun scripts/generate.mjs`
3. `bun scripts/validate-tokens.mjs`

## Adding a theme

Copy `themes/mono.json`, register the slug in `tokens.core.json#meta.themes`, regenerate, validate. Full recipe: `docs/THEMING.md`.

## Key design rules

- **Every theme ships light AND dark.** Never one without the other.
- **ANSI 11 is always the theme's accent** — validated.
- **The accent is never a syntax colour; `brand` is the maker's mark alone, distinct from status red** — validated.
- **Status colors never drop to grayscale** — a theme may grey its syntax, never its signals.
- **Contrast:** body text AAA in both modes of every theme, text-muted AA, text-faint decorative only; all claims in `themes/*.json#contrast` are measured by `validate-tokens.mjs`.
- **No hex duplication** — always derive from the token sources; add missing values there first.
- **Syntax emphasis is tokenized**: `--syntax-<role>-weight/style` accompany the colours so grayscale themes can carry meaning in weight/italic.
