# Jylhis for Waybar

A `style.css` for the [Waybar](https://github.com/Alexays/Waybar) status bar plus a hand-authored `config.jsonc` covering the modules you'd typically want.

```
platforms/waybar/
├── style.css              ← generated (95 lines)
└── config.jsonc           ← hand-authored (modules, layout, hyprland integration)
```

## Install

```bash
mkdir -p ~/.config/waybar
cp config.jsonc ~/.config/waybar/config.jsonc
cp style.css     ~/.config/waybar/style.css
```

Restart Waybar:

```bash
killall -SIGUSR2 waybar 2>/dev/null || (killall waybar; waybar &)
```

## What's set

- Bar background: `bg-subtle` with a 1px linen border on the bottom edge so it reads as a horizontal rule against the wallpaper.
- Module text: `text-muted` by default, `text` for the active workspace, `accent` for hover/pressed states.
- Status modules use the Signal palette: battery low → `status-warn`; battery critical → `status-err`; network connected → `status-ok`.
- Mono labels (JetBrains Mono fallback chain) at 0.78rem so the bar reads as a chrome surface, not as content.

## Light vs dark

Waybar has no native theme switcher; the generated CSS picks up whatever variables are exposed by the parent compositor or your shell init. If you want auto-switch on Hyprland, run a small `hyprctl dispatch` script that swaps the symlink between two pre-built CSS files on `prefers-color-scheme` change. The current `style.css` ships one mode (Paper); adding a dark sibling is straightforward — extend `generateWaybar()` to emit `style-paper.css` and `style-roast.css`.

> **TODO:** dual-mode emit. Single-mode is fine for most users since most NixOS / Arch ricers want to commit to one theme and use Hyprland animations only on transitions, not Waybar.

## Contract

`style.css` mirrors `tokens.json`. The `config.jsonc` is yours.
