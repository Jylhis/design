# Jylhis for GTK 3 / 4

A single `gtk.css` overlay that retunes Adwaita to the Jylhis palette — backgrounds, text, accent, and the Adwaita `accent_*` named colors.

```
platforms/gtk/
└── gtk.css                ← generated (GTK 3/4 Adwaita override)
```

## Install

GTK 3 and GTK 4 each pick up a per-user stylesheet:

```bash
mkdir -p ~/.config/gtk-3.0 ~/.config/gtk-4.0
cp gtk.css ~/.config/gtk-3.0/gtk.css
cp gtk.css ~/.config/gtk-4.0/gtk.css
```

For applications that respect `prefers-color-scheme` via `gsettings`:

```bash
gsettings set org.gnome.desktop.interface color-scheme prefer-dark
# or
gsettings set org.gnome.desktop.interface color-scheme prefer-light
```

The stylesheet sets both light and dark variants; the system color-scheme preference picks one.

## What it tunes

- Window backgrounds: `bg` / `bg-subtle`.
- Surface chrome: `surface` / `surface-raised`.
- Text: `text-heading` / `text` / `text-muted`.
- Accent: copper across `accent_color`, `accent_bg_color`, `accent_fg_color` (GTK 4 named colors).
- Borders: linen everywhere; never a hard 1px black.

## Caveats

- **Some GTK apps ignore user themes.** Most notably Firefox and Chromium variants ship their own widget styling. Adjust those at the application level.
- **libadwaita 1.6+** introduced the dynamic accent color API. The stylesheet sets the static fallback; on libadwaita 1.6+ you can additionally pin the accent at runtime if the user-accent feature is enabled.

## Contract

Hex values mirror `tokens.json`. Edit the source, regenerate.
