# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

A personal design system for jylhis.com. Warm cream paper, single copper accent, monospace headings (JetBrains Mono), serif body (Literata). No emoji, no gradients, no shadows. Unicode glyphs as icons. Syntax colors from Emacs Modus (Operandi light, Vivendi dark).

## Commands

```bash
bun scripts/generate.mjs                  # regenerate platform targets from tokens.json
bun scripts/generate.mjs --check          # exit 1 if committed files diverge from tokens.json (CI mode)
bun scripts/validate-tokens.mjs           # tokens.json schema + WCAG contrast + CSS var() resolution
bun scripts/validate-a11y-html.mjs        # HTML accessibility (lang, alt, labels, focus, reduced-motion, status-with-glyph)
bun scripts/validate-a11y-css.mjs         # CSS accessibility (transitions guarded; outline:none has :focus-visible replacement)
bun scripts/validate-cli-conventions.mjs  # bun scripts follow docs/CLI-TUI-GUIDELINES.md (--help, --version, stderr, exit codes)
bun scripts/validate-emacs-faces.mjs      # Emacs face list in jylhis-theme-core.el matches face-manifest.json
serve-pages                               # build the GitHub Pages artifact, serve _site locally, rebuild on changes
```

All six validators support `--help` and `--version`.

Dev environment uses devenv (Nix). Enter with `devenv shell`. Provides `bun`, `go`, and three convenience scripts: `generate`, `validate-tokens`, and `serve-pages`.

CI (`.github/workflows/validate.yml`) runs all five validators on every push/PR. Any token edit must be followed by `bun scripts/generate.mjs` and committed alongside, or CI fails. The Pages workflow (`pages.yml`) regenerates and deploys `index.html` plus all preview/prototype assets to GitHub Pages on `main`.

Specs the validators enforce live in [`docs/ACCESSIBILITY.md`](docs/ACCESSIBILITY.md), [`docs/CLI-TUI-GUIDELINES.md`](docs/CLI-TUI-GUIDELINES.md), and [`platforms/KEYBOARD.md`](platforms/KEYBOARD.md). For deeper review beyond static checks, invoke the `/design-review` skill in `.claude/skills/design-review/`.

## Architecture

### Single source of truth: `tokens.json`

All colors, spacing, typography, motion, ANSI palette, and contrast requirements live in `tokens.json`. Every platform-specific file is **generated** from it.

### Generation pipeline: `scripts/generate.mjs`

A single Bun script with zero dependencies reads `tokens.json` and writes generated files:

| Generated file | What |
|---|---|
| `tokens.css` | CSS custom properties (`:root` + `[data-theme="dark"]`) |
| `tokens-data.js` | JS export for the showcase website (includes derived `contrastPairs` + `swatchContrast`) |
| `platforms/ghostty/jylhis-{paper,roast}` | Ghostty color themes |
| `platforms/charm/jylhis/palette.go` | Go lipgloss palette struct |
| `platforms/emacs/jylhis-theme-core.el` | Shared face spec list + three-tier resolver macro (Tokyo-Themes-style framework) |
| `platforms/emacs/jylhis-{paper,roast}-palette.el` | Three-tier (GUI / xterm-256 / 16-color ANSI) palette alist per variant |
| `platforms/emacs/jylhis-{paper,roast}-theme.el` | Entry point: `require`s core+palette and calls `jylhis-apply-faces` |
| `platforms/hyprland/jylhis-{paper,roast}.conf` | Hyprland border colors |
| `platforms/rofi/jylhis-{paper,roast}.rasi` | Rofi command palette theme |
| `platforms/gtk/gtk.css` | GTK 3/4 Adwaita overrides |
| `platforms/waybar/style.css` | Waybar bar CSS |
| `platforms/mako/config` | Mako notification config |
| `platforms/kvantum/Jylhis{Paper,Roast}.colors` | Qt/Kvantum palette XML |
| `platforms/gimp/jylhis-{paper,roast}.gpl` | GIMP / Inkscape / Krita swatch file |
| `platforms/adobe/jylhis-{paper,roast}.ase` | Adobe Swatch Exchange (binary) — Photoshop / Illustrator / InDesign / Affinity |
| `platforms/hyperos/jylhis-{paper,roast}.mtz` | Xiaomi HyperOS/MIUI theme (ZIP with color overrides) |

The ASE generator emits binary content; the `--check` mode handles both text and binary outputs.

### Hand-authored (not generated)

- `styles.css` — one-import entry point: pulls in `colors_and_type.css`, `motion.css`, and `components/components.css`
- `colors_and_type.css` — imports `tokens.css` + `fonts.css`, then adds font stacks, semantic type helpers (`.ds-body`, `.ds-h1`, `.ds-meta`, `.ds-code-inline`, etc.), type craft defaults (oldstyle figures, `text-wrap`, hanging punctuation), and the interaction baseline (selection, caret, `:focus-visible` ring)
- `fonts.css` — self-hosted variable-font `@font-face` blocks (Literata + JetBrains Mono, latin/latin-ext subsets with `unicode-range`)
- `motion.css` — the "ink draws on" motion signature (`.ds-rule-draw`, `.ds-typed`, `.ds-caret`); guardrails in `docs/STYLE-GUIDE.md` §5
- `components/` — React components library: 12 components, each `<Name>/<Name>.jsx` + `<Name>.d.ts` + `card.html` specimen, styled by `components/components.css` (tokens only, class-per-component)
- `platforms/shell/` — starship.toml, bashrc, zshrc, dircolors (use ANSI names, not hex)
- `platforms/ghostty/config` — user preferences, not palette
- `platforms/KEYBOARD.md` — focus ring, kbd chip, command palette, selected-item spec
- `platforms/charm/jylhis/{theme,bubbles,bubbletea}.go` — lipgloss styles and Bubble Tea integration
- `platforms/emacs/jylhis-themes.el` — autoload registration for `custom-theme-load-path`
- `platforms/emacs/jylhis-theme-toggle.el` — `M-x jylhis-toggle-theme` (and `jylhis-load-theme`) helpers
- `platforms/emacs/face-manifest.json` — curated face list for `validate-emacs-faces.mjs`; edit in lock-step with the spec list in `scripts/generate.mjs`

### Nix packaging (`nix/`)

Standalone `.nix` files using `callPackage` pattern (no flakes):
- `nix/ghostty.nix` — wraps Ghostty with themes in `XDG_DATA_DIRS`
- `nix/emacs.nix` — Emacs theme package via `trivialBuild`
- `nix/themes.nix` — all generated theme files as one derivation

### Showcase website

Static HTML at `index.html`, deployed via GitHub Pages. Color swatches render dynamically from `tokens-data.js`. Preview cards in `preview/` are standalone HTML specimens; each component in `components/` also ships its own `card.html` specimen. Prototypes in `prototypes/` are interactive desktop (Norton-Commander TUI), macOS reskin, tablet, and web mockups — the web kit consumes `styles.css` and mirrors the components library.

## Workflow for changing a token

1. Edit `tokens.json`
2. Run `bun scripts/generate.mjs`
3. Verify with `bun scripts/validate-tokens.mjs`
4. Generated files update automatically

## Thematic groups

Roles in `tokens.json` are grouped under a top-level `groups` block — Paperstock (backgrounds), Ink (text), Copper (accent), Linen (borders), Modus (syntax), Signal (status), Spectrum (ANSI). Roles are still the canonical names used in code (`bg`, `accent`, `syn-keyword` …); group names are documentation/UI labels surfaced in the showcase, the per-theme palette page, and the GIMP `.gpl` exports. When adding a new color, register it under the relevant group's `members` list.

## Key design rules

- **Two themes:** Paper (light) and Roast (dark) are both first-class. Never ship one without the other.
- **ANSI 11 is always brand copper** — intentional override across all terminal targets.
- **Copper accent is never a syntax color** — it's reserved for UI chrome and brand marks.
- **No hex duplication** — always derive from `tokens.json`. If a value isn't there, add it to `tokens.json` first.
- **Contrast:** body text AAA on both modes, text-muted AA, text-faint is decorative only.
- **`accent-subtle`** uses rgba with opacity (not in `tokens.json` directly) — defined in `tokens.css` generation and as opaque approximations in Emacs/Rofi where rgba isn't supported.
- **SynTag is an alias of SynType** — maintained in Go palette and CSS for backwards compatibility.
- **Emacs themes ship three display tiers** — every face spec degrades from 24-bit GUI hex → nearest xterm-256 (`color-NNN`) → named ANSI slot (`red`, `brightyellow`). Roles may carry an optional `ansi` override on their token entry to pin the 16-color tier; `accent` is pinned to `bright-yellow` (ANSI 11).
