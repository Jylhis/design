# Jylhis for Qt / Kvantum

Two Kvantum `.colors` palette files for Qt 5 / Qt 6 applications, plus a `qt5ct` config fragment.

```
platforms/kvantum/
├── JylhisPaper.colors       ← generated (light)
├── JylhisRoast.colors       ← generated (dark)
└── qt5ct.conf.fragment      ← hand-authored (qt5ct settings to point at Kvantum)
```

## Install

```bash
mkdir -p ~/.config/Kvantum/JylhisPaper ~/.config/Kvantum/JylhisRoast
cp JylhisPaper.colors ~/.config/Kvantum/JylhisPaper/
cp JylhisRoast.colors ~/.config/Kvantum/JylhisRoast/
```

Open `kvantummanager`, select **JylhisPaper** or **JylhisRoast**, click *Use this theme*.

To make Qt 5 apps respect Kvantum, set the platform theme:

```bash
export QT_QPA_PLATFORMTHEME=qt5ct
```

…and merge `qt5ct.conf.fragment` into `~/.config/qt5ct/qt5ct.conf`.

For Qt 6, replace `qt5ct` with `qt6ct` if available, or use the `qt5ct` shim.

## Caveats

- Kvantum ships richer SVG-driven theming for full re-skins. The Jylhis files use only the `.colors` facet — they retune a minimal palette while leaving Kvantum's underlying widget rendering alone. If you want full custom widget skinning, you'll need to author a `.kvconfig` and SVG sprite separately.
- Some Qt apps (especially Telegram, Bitwarden) bypass platform themes entirely. There's nothing the system can do about that.

## Contract

Hex values mirror `tokens.json`. The `qt5ct.conf.fragment` is hand-authored and is yours to evolve.
