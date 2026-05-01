# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

A personal design system for jylhis.com. Warm cream paper, single copper accent, monospace headings (JetBrains Mono), serif body (Literata). No emoji, no gradients, no shadows. Unicode glyphs as icons. Syntax colors from Emacs Modus (Operandi light, Vivendi dark).

## Commands

```bash
bun scripts/generate.mjs          # regenerate all 20 platform targets from tokens.json
bun scripts/generate.mjs --check  # exit 1 if committed files diverge from tokens.json (CI mode)
bun scripts/validate-tokens.mjs   # validate tokens.json schema + WCAG contrast + CSS var() resolution
```

Dev environment uses devenv (Nix). Enter with `devenv shell`. Provides `bun`, `go`, and two convenience scripts: `generate` and `validate-tokens`.

CI (`.github/workflows/validate.yml`) runs `generate.mjs --check` and `validate-tokens.mjs` on every push/PR — so any token edit must be followed by `bun scripts/generate.mjs` and committed alongside, or CI fails. The Pages workflow (`pages.yml`) regenerates and deploys `index.html` plus all preview/prototype assets to GitHub Pages on `main`.

## Architecture

### Single source of truth: `tokens.json`

All colors, spacing, typography, motion, ANSI palette, and contrast requirements live in `tokens.json`. Every platform-specific file is **generated** from it.

### Generation pipeline: `scripts/generate.mjs`

A single Bun script with zero dependencies reads `tokens.json` and writes 20 files:

| Generated file | What |
|---|---|
| `tokens.css` | CSS custom properties (`:root` + `[data-theme="dark"]`) |
| `tokens-data.js` | JS export for the showcase website (includes derived `contrastPairs` + `swatchContrast`) |
| `platforms/ghostty/jylhis-{paper,roast}` | Ghostty color themes |
| `platforms/charm/jylhis/palette.go` | Go lipgloss palette struct |
| `platforms/emacs/jylhis-{paper,roast}-theme.el` | Emacs deftheme (430 lines each with face mappings) |
| `platforms/hyprland/jylhis-{paper,roast}.conf` | Hyprland border colors |
| `platforms/rofi/jylhis-{paper,roast}.rasi` | Rofi command palette theme |
| `platforms/gtk/gtk.css` | GTK 3/4 Adwaita overrides |
| `platforms/waybar/style.css` | Waybar bar CSS |
| `platforms/mako/config` | Mako notification config |
| `platforms/kvantum/Jylhis{Paper,Roast}.colors` | Qt/Kvantum palette XML |
| `platforms/gimp/jylhis-{paper,roast}.gpl` | GIMP / Inkscape / Krita swatch file |
| `platforms/adobe/jylhis-{paper,roast}.ase` | Adobe Swatch Exchange (binary) — Photoshop / Illustrator / InDesign / Affinity |

The ASE generator emits binary content; the `--check` mode handles both text and binary outputs.

### Hand-authored (not generated)

- `colors_and_type.css` — imports `tokens.css`, then adds font stacks and semantic type helpers (`.ds-body`, `.ds-h1`, `.ds-meta`, `.ds-code-inline`, etc.)
- `platforms/shell/` — starship.toml, bashrc, zshrc, dircolors (use ANSI names, not hex)
- `platforms/ghostty/config` — user preferences, not palette
- `platforms/KEYBOARD.md` — focus ring, kbd chip, command palette, selected-item spec
- `platforms/charm/jylhis/{theme,bubbles,bubbletea}.go` — lipgloss styles and Bubble Tea integration

### Nix packaging (`nix/`)

Standalone `.nix` files using `callPackage` pattern (no flakes):
- `nix/ghostty.nix` — wraps Ghostty with themes in `XDG_DATA_DIRS`
- `nix/emacs.nix` — Emacs theme package via `trivialBuild`
- `nix/themes.nix` — all generated theme files as one derivation

### Showcase website

Static HTML at `index.html`, deployed via GitHub Pages. Color swatches render dynamically from `tokens-data.js`. Preview cards in `preview/` are standalone HTML specimens. Prototypes in `prototypes/` are interactive desktop/tablet mockups.

## Workflow for changing a token

1. Edit `tokens.json`
2. Run `bun scripts/generate.mjs`
3. Verify with `bun scripts/validate-tokens.mjs`
4. All 20 generated files update automatically

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
