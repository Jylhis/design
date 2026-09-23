# Jylhis for GTK 3 / 4

Per-mode stylesheets that retune Adwaita to the Jylhis palette —
backgrounds, text, accent, and the Adwaita `accent_*` named colors.

```
platforms/gtk/
├── gtk.css               ← generated light copy (legacy shared name, untracked)
├── jylhis-light.css      ← generated (committed snapshot)
└── jylhis-dark.css       ← generated (committed snapshot)
```

GTK has no runtime mode switch for user CSS: GTK3 cannot parse custom
properties, and GTK4 loads user CSS after the theme, so any `.dark` block
could never win. The mode is therefore chosen at install time by picking
the file that matches your system preference.

## Install

GTK 3 and GTK 4 each pick up a per-user stylesheet. Copy the file for the
mode you run (example: dark):

```bash
mkdir -p ~/.config/gtk-3.0 ~/.config/gtk-4.0
cp jylhis-dark.css ~/.config/gtk-3.0/gtk.css
cp jylhis-dark.css ~/.config/gtk-4.0/gtk.css
```

`gtk.css` is the same generated light content under the shared name some
consumers hardcode; install it the same way when you want light.

Pair it with the matching gsettings so apps pick the intended widgets:

```bash
# dark
gsettings set org.gnome.desktop.interface color-scheme prefer-dark
gsettings set org.gnome.desktop.interface gtk-theme Adwaita-dark   # GTK 3 apps
# light
gsettings set org.gnome.desktop.interface color-scheme prefer-light
gsettings set org.gnome.desktop.interface gtk-theme Adwaita        # GTK 3 apps
```

Switching mode means installing the other file (and flipping the gsettings
above).

## What it tunes

- Window backgrounds: `bg` / `bg-subtle`.
- Surface chrome: `surface` / `surface-raised`.
- Text: `text-heading` / `text` / `text-muted`.
- Accent: bronze across `accent_color`, `accent_bg_color`, `accent_fg_color` (GTK 4 named colors).
- Borders: linen everywhere; never a hard 1px black.

## Caveats

- **Some GTK apps ignore user themes.** Most notably Firefox and Chromium variants ship their own widget styling. Adjust those at the application level.
- **libadwaita 1.6+** introduced the dynamic accent color API. The stylesheet sets the static fallback; on libadwaita 1.6+ you can additionally pin the accent at runtime if the user-accent feature is enabled.

## Contract

Hex values mirror `tokens.core.json` + `themes/jylhis.json`. Edit the
sources, regenerate (`bun scripts/generate.mjs`).
