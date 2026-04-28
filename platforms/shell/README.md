# Jylhis for the shell

Hand-authored shell configs that *use ANSI color names rather than hex values*, so they pick up whatever terminal theme is loaded — Ghostty, kitty, foot, alacritty, anything. They are deliberately **not** generated.

```
platforms/shell/
├── bashrc.bash            ← bash prompt + aliases
├── zshrc.zsh              ← zsh prompt + aliases
├── starship.toml          ← Starship prompt config
└── dircolors              ← LS_COLORS for ls / eza / ranger
```

## Install

### bash / zsh

```bash
# bash
echo 'source ~/path/to/design/platforms/shell/bashrc.bash' >> ~/.bashrc

# zsh
echo 'source ~/path/to/design/platforms/shell/zshrc.zsh' >> ~/.zshrc
```

### Starship

```bash
mkdir -p ~/.config
cp starship.toml ~/.config/starship.toml
```

### Dircolors

```bash
echo 'eval "$(dircolors ~/path/to/design/platforms/shell/dircolors)"' >> ~/.bashrc
```

This wires `ls --color`, `eza`, and any tool that consults `LS_COLORS` to the same earth-toned ANSI palette as the editor.

## Why these are hand-authored

The other platform targets are fully resolved hex (Emacs, Ghostty, GTK, etc.). The shell is the one place where *not* resolving the hex is a feature — by referencing ANSI names like `red`, `green`, `yellow`, the configs adapt to whichever terminal theme is currently loaded. If you swap from Paper to Roast, the prompt repaints automatically without re-sourcing.

This means:

- **Starship config** uses ANSI names (`red`, `bright_yellow`, etc.) for prompt segments.
- **Bashrc / zshrc aliases** rely on terminal-driven colors, never hard-coded ANSI escapes.
- **Dircolors** uses 8-color ANSI codes (30–37, 90–97) — never 256-color or truecolor codes — so the directory listing always blends with the running theme.

## ANSI 11 is brand copper

Slot 11 (`bright-yellow`) is intentionally overridden to copper across every terminal target. The shell configs use `bright_yellow` deliberately for prompt path segments and `dircolors` directory entries — that's where the brand copper shows through.

## Contract

These files are not generated. To change them, edit them directly.
