# Jylhis for Hyprland

Two minimal `*.conf` snippets carrying the Jylhis border colors, plus a hand-authored `jylhis.conf` with broader compositor settings.

```
platforms/hyprland/
├── jylhis-paper.conf      ← generated (light borders)
├── jylhis-roast.conf      ← generated (dark borders)
└── jylhis.conf            ← hand-authored (binds, animations, layout)
```

## Install

Source the relevant theme file from your `~/.config/hypr/hyprland.conf`:

```hyprlang
source = ~/path/to/design/platforms/hyprland/jylhis-paper.conf
# or
source = ~/path/to/design/platforms/hyprland/jylhis-roast.conf
```

Pair it with the broader settings (binds, animations, layout) by also sourcing the hand-authored file:

```hyprlang
source = ~/path/to/design/platforms/hyprland/jylhis.conf
```

## What's set

The generated files set border colors (active / inactive / group) using the Jylhis accent and linen tokens. They deliberately don't set bind keys, layout, animation curves, or input behaviour — that lives in the hand-authored `jylhis.conf` so you can adopt the colors without inheriting opinionated input choices.

## Animation curves

The hand-authored `jylhis.conf` references the system motion tokens: `fast` (150ms), `base` (250ms), `slow` (300ms), `spring` (420ms). Each token is exposed as a Hyprland `bezier` named after the system token, so you can wire bezier `= myCurve, 0.2, 0.6, 0.2, 1` against system tokens directly.

## Contract

Hex values in the generated files mirror `tokens.json`. The hand-authored `jylhis.conf` is yours to evolve.
