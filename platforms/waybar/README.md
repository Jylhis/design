# Jylhis for Waybar

Stylesheets for the [Waybar](https://github.com/Alexays/Waybar) status bar plus a hand-authored `config.jsonc` covering the modules you'd typically want.

```
platforms/waybar/
├── style-light.css       ← generated (light)
├── style-dark.css        ← generated (dark)
├── style.css             ← hand-maintained light copy (legacy shared name)
└── config.jsonc          ← hand-authored (modules, layout, hyprland integration)
```

## Install

```bash
mkdir -p ~/.config/waybar
cp config.jsonc ~/.config/waybar/config.jsonc
cp style-dark.css ~/.config/waybar/style.css   # or style-light.css
```

Restart Waybar:

```bash
killall -SIGUSR2 waybar 2>/dev/null || (killall waybar; waybar &)
```

## What's set

- Bar background: `bg-subtle` with a 1px hairline border on the bottom edge so it reads as a horizontal rule against the wallpaper.
- Module text: `text-muted` by default, `text` for the active workspace, `accent` for hover/pressed states.
- Status modules use the Signal palette: battery low → `status-warn`; battery critical → `status-err`; network connected → `status-ok`.
- Mono labels (IBM Plex Mono fallback chain) at 0.78rem so the bar reads as a chrome surface, not as content.

## Light vs dark

Waybar has no native theme switcher. Install the mode you run: copy
`style-light.css` or `style-dark.css` to `~/.config/waybar/style.css`. The
tracked `style.css` here is a hand-maintained light-mode copy kept for
consumers that hardcode the shared name — refresh it by hand when the
generated light output changes. For keybind-driven switching,
`platforms/scripts/jylhis-theme-toggle.sh` flips modes and reloads Waybar.

## Contract

`style-light.css` / `style-dark.css` mirror `tokens.core.json` +
`themes/jylhis.json` (regenerate with `bun scripts/generate.mjs`). The
hand-maintained `style.css` and the `config.jsonc` are yours.
