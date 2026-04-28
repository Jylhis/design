# Jylhis for Rofi

Two `.rasi` themes — Paper and Roast — for the [Rofi](https://github.com/davatorium/rofi) command palette / launcher.

```
platforms/rofi/
├── jylhis-paper.rasi      ← generated (light)
└── jylhis-roast.rasi      ← generated (dark)
```

## Install

```bash
mkdir -p ~/.config/rofi
cp jylhis-paper.rasi jylhis-roast.rasi ~/.config/rofi/
```

Then in `~/.config/rofi/config.rasi`:

```rasi
@theme "jylhis-paper"
// or
@theme "jylhis-roast"
```

Or invoke ad-hoc:

```bash
rofi -show drun -theme ~/.config/rofi/jylhis-paper.rasi
```

## What you get

- The same selected-item language as the rest of the system: copper left bar + copper title text on a `surface-raised` fill.
- 1px linen borders, 4px corner radius — matches the "no shadows, flat paper" aesthetic.
- Result rows hit the same vertical rhythm as the kbd-chip layout in `platforms/KEYBOARD.md`, so a Rofi launcher and a web command palette feel like the same surface.
- Modus syntax accents on highlighted matches — magenta-cooler for keyword matches when you're searching across structured data.

## Pairs with

The selected-item, focus ring, and shortcut conventions match [`../KEYBOARD.md`](../KEYBOARD.md). If you redefine focus colors here, redefine them there too.

## Contract

Hex values mirror `tokens.json`. Regenerate after a token change.
