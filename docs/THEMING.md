# Theming

The design system is split into a **core framework** and **themes**.

- **Core** (`tokens.core.json`): everything theme-independent — type stack and scale, spacing, layout, radii, breakpoints, z-index, border widths, focus ring, density, motion, sound, and the role taxonomy (`groups`). Roles like `accent`, `contour`, `syn-keyword` are the contract every theme fulfils.
- **Theme** (`themes/<slug>.json`): one visual identity — a value for every colour role, in a **light and a dark mode** (both are mandatory), plus optional overrides for typography, radii, motion, and border widths.

## Selecting a theme

Two orthogonal attributes on `<html>`:

```html
<html>                                   <!-- Survey, light (defaults) -->
<html data-mode="dark">                  <!-- Survey, dark -->
<html data-theme="mono">                 <!-- Monochrome, light -->
<html data-theme="mono" data-mode="dark"><!-- Monochrome, dark -->
```

`tokens.css` is generated with the default theme in `:root`, its dark mode under `[data-mode="dark"]`, and every other theme under `[data-theme="<slug>"]` / `[data-theme="<slug>"][data-mode="dark"]`. The pre-framework selectors (`data-theme="dark|sheet|field"`) are retired — this was a clean break.

## Shipped themes

| Theme | Slug | Modes | Character |
|---|---|---|---|
| Survey | `survey` (default) | Sheet / Field | bronze accent, vermilion maker's mark, contour-blue linework, Modus syntax |
| Monochrome | `mono` | Print / Negative | neutral grayscale; interaction is inverted ink fills; the maker's mark is the one pure black/white; syntax is gray steps + weight/italic; **status colors stay chromatic** (safety) |

Rules every theme must satisfy (enforced by `validate-tokens.mjs`): all roles defined in both modes; ANSI slot 11 equals the accent; `brand` distinct from `status-err`; all declared contrast claims measured true; status colors may not be dropped to grayscale.

## Adding a theme

1. Create `themes/<slug>.json` — copy `themes/mono.json` as a template. Define `meta` (name, slug, mode labels), `palette`, `syntax` (optionally with `weight`/`style` per role), `status`, the 16-slot `ansi` array, `pairs`, and `contrast` claims.
2. Register it in `tokens.core.json` under `meta.themes`.
3. `bun scripts/generate.mjs` — regenerates `tokens.css`, `tokens-data.js`, and every platform target (`platforms/<target>/jylhis-<slug>-{light,dark}.*`).
4. `bun scripts/validate-tokens.mjs`.

## How platform targets are generated

Web targets (`tokens.css`, `tokens-data.js`) are emitted natively from the token sources. Platform targets (Ghostty, Emacs, bat, rofi, Hyprland, GIMP, base16, kvantum, mako, waybar, fzf, console, Plymouth, GTK, shadcn) are derived from the **committed Survey reference files** in `platforms/_reference/` by role-mapped recoloring plus slug renaming (`scripts/lib/emit.mjs`). Where Survey aliases one hex across several roles, a priority class decides ownership: `ui` targets resolve toward palette/status/ANSI, `syntax` targets (Emacs, bat) toward the syntax roles — so a theme that greys its syntax but keeps chromatic status recolors both target families correctly.

Filenames are uniform: `jylhis-<theme>-<light|dark>` (Kvantum: `Jylhis<Theme><Mode>.colors`). `platforms/waybar/style.css` and `platforms/mako/config` remain as copies of the survey-dark output for consumers that hardcode those names.

### Not yet themed

- `platforms/charm/` (Go API is hand-authored; survey only)
- `platforms/adobe/*.ase`, `platforms/hyperos/*.mtz` (binary; survey files renamed, mono pending a binary emitter)
- `platforms/shell/` starship/bashrc/zshrc/dircolors are ANSI-name based and theme-agnostic by design.

## Syntax emphasis tokens

`tokens.css` emits `--syntax-<role>-weight` / `--syntax-<role>-style` alongside the colours. Monochrome carries meaning in weight (`keyword`, `function` = 700) and style (`builtin`, `comment`, `docstring` = italic); consumers that render code should apply these vars, not hardcoded weights.
