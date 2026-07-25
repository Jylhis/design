# Jylhis for Rofi

Two `.rasi` themes — Sheet and Field — for the [Rofi](https://github.com/davatorium/rofi) command palette / launcher.

```
platforms/rofi/
├── jylhis-sheet.rasi      ← generated (light)
└── jylhis-field.rasi      ← generated (dark)
```

## Install

```bash
mkdir -p ~/.config/rofi
cp jylhis-sheet.rasi jylhis-field.rasi ~/.config/rofi/
```

Then in `~/.config/rofi/config.rasi`:

```rasi
@theme "jylhis-sheet"
// or
@theme "jylhis-field"
```

Or invoke ad-hoc:

```bash
rofi -show drun -theme ~/.config/rofi/jylhis-sheet.rasi
```

## What you get

- The same selected-item language as the rest of the system: bronze left bar + bronze title text on a `surface-raised` fill.
- 1px hairline borders, 4px corner radius — matches the "no shadows, flat sheet" aesthetic.
- Result rows hit the same vertical rhythm as the kbd-chip layout in `platforms/KEYBOARD.md`, so a Rofi launcher and a web command palette feel like the same surface.
- Modus syntax accents on highlighted matches — magenta-cooler for keyword matches when you're searching across structured data.

## Pairs with

The selected-item, focus ring, and shortcut conventions match [`../KEYBOARD.md`](../KEYBOARD.md). If you redefine focus colors here, redefine them there too.

## Contract

Hex values mirror `tokens.json`. Regenerate after a token change.
