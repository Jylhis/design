---
name: jylhis-design
description: Use this skill to generate well-branded interfaces and assets for Jylhis (jylhis.com, the personal/technical site of Markus Jylhänkangas), either for production or throwaway prototypes/mocks/etc. Contains essential design guidelines, colors, type, fonts, assets, and UI kit components for prototyping.
user-invocable: true
---

Read the README.md file within this skill, and explore the other available files.

If creating visual artifacts (slides, mocks, throwaway prototypes, etc), copy assets out and create static HTML files for the user to view. If working on production code, you can copy assets and read the rules here to become an expert in designing with this brand.

If the user invokes this skill without any other guidance, ask them what they want to build or design, ask some questions, and act as an expert designer who outputs HTML artifacts _or_ production code, depending on the need.

## Quick reference

- Link `colors_and_type.css` for tokens + font families (Literata body, JetBrains Mono headings/chrome/code).
- Look and feel: warm cream paper, copper accent, monospace headings, no emoji, no gradients, no shadows. Unicode glyphs (`›`, `▸`, `»`, `☾`, `★`, `└──`) do the job icons normally would.
- `components/` has the React components library (buttons, cards, tags, kbd, alerts, code blocks …); `preview/` has card-sized specimens. Import `styles.css` to get everything (tokens, fonts, type helpers, motion, component styles) in one link.
- **Syntax highlights come from Emacs Modus** (Operandi in light mode, Vivendi in dark). The Modus palette is canonical for code everywhere — Emacs, web `<pre>`, `bat`/`delta`, Charm TUI output. The copper accent is brand chrome only, never a syntax colour.

## Cross-platform

The system extends beyond the web. Canonical palette lives in `tokens.md`; keyboard primitives (focus, kbd, command-palette, selected-item, dismiss) in `platforms/KEYBOARD.md`. CLI/TUI design conventions for any tool that ships with the system in `docs/CLI-TUI-GUIDELINES.md`. Accessibility commitments and what the validators enforce in `docs/ACCESSIBILITY.md`. Platform-specific files (hand-maintained from the token spec):

| Target | Files |
|---|---|
| Ghostty | `platforms/ghostty/{jylhis-paper,jylhis-roast,config}` |
| Shells | `platforms/shell/{bashrc.bash,zshrc.zsh,dircolors,starship.toml}` — bash + zsh supported |
| Hyprland + Waybar + Mako | `platforms/{hyprland,waybar,mako}/` |
| Rofi (command palette) | `platforms/rofi/jylhis-{paper,roast}.rasi` |
| GTK 3/4 | `platforms/gtk/gtk.css` |
| Kvantum / Qt | `platforms/kvantum/` |
| Emacs (Modus-style deftheme) | `platforms/emacs/jylhis-{paper,roast}-theme.el` + `jylhis-theme-toggle.el` |
| **Charm TUI (Go)** | `platforms/charm/jylhis/` — lipgloss palette + styles, themed bubbles (list/help/spinner/textinput), bubbletea light/dark detection, default keymap. Pairs with harmonica and ntcharts. See `platforms/charm/README.md`. |

Visual index: `platforms/index.html`. When extending to a new target, read `tokens.md` first and re-use the same hex values — don't re-derive.
