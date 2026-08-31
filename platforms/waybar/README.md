# Jylhis for Waybar

A `style.css` for the [Waybar](https://github.com/Alexays/Waybar) status bar plus a hand-authored `config.jsonc` covering the modules you'd typically want.

```
platforms/waybar/
├── style.css              ← generated (Field / dark)
├── style-sheet.css        ← generated (Sheet / light)
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

Both modes are generated: `style.css` is Field (dark) and `style-sheet.css` is Sheet (light). Waybar has no native theme switcher, so install the one you want as `~/.config/waybar/style.css`. If you want auto-switch on Hyprland, run a small `hyprctl dispatch` script that swaps a symlink between the two files on `prefers-color-scheme` change and reloads Waybar.

## Contract

`style.css` and `style-sheet.css` mirror `tokens.json`. The `config.jsonc` is yours.
