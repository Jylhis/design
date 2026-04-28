# Jylhis for Ghostty

Two color themes for [Ghostty](https://ghostty.org/) plus a sample `config` showing the recommended user preferences.

```
platforms/ghostty/
├── jylhis-paper           ← generated (light)
├── jylhis-roast           ← generated (dark)
└── config                 ← hand-authored (font, padding, opacity — not the palette)
```

The two theme files are generated from `tokens.json`. The `config` file is a starting point you copy and own — it deliberately doesn't ship a palette, only ergonomic defaults (font, padding, opacity).

## Install

```bash
mkdir -p ~/.config/ghostty/themes
cp jylhis-paper jylhis-roast ~/.config/ghostty/themes/
```

Then in `~/.config/ghostty/config`:

```
theme = jylhis-paper
# or
theme = jylhis-roast
```

For automatic light/dark following the system:

```
theme = light:jylhis-paper,dark:jylhis-roast
```

## Nix

```nix
ghostty-jylhis = pkgs.callPackage /path/to/design/nix/ghostty.nix {};
```

This wraps Ghostty with the themes available via `XDG_DATA_DIRS` so you don't have to copy files. See [`../../nix/ghostty.nix`](../../nix/ghostty.nix).

## ANSI 11 is brand copper

Slot 11 (`bright-yellow`) is intentionally overridden to the brand copper across every terminal target — Ghostty included. That's why prompts, directory permissions, and `ls --color` carry the Jylhis identity. Don't "fix" it.

## Pairs with

- [`../shell/`](../shell/) — `bashrc.bash` / `zshrc.zsh` / `starship.toml` / `dircolors` use ANSI names (not hex) so they pick up whichever theme Ghostty is running.
- [`../emacs/`](../emacs/) — same hexes; `vterm` and `eshell` blend into the editor without a seam.
- [`../charm/`](../charm/) — Bubble Tea apps use the same Modus syntax palette as terminal output.
