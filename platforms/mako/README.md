# Jylhis for Mako

Config files for the [Mako](https://github.com/emersion/mako) Wayland notification daemon.

```
platforms/mako/
├── config                ← generated (Field / dark)
└── config-sheet          ← generated (Sheet / light)
```

## Install

```bash
mkdir -p ~/.config/mako
ln -sf ~/path/to/design/platforms/mako/config ~/.config/mako/config
```

Or, if you'd rather copy:

```bash
cp config ~/.config/mako/config
makoctl reload
```

## What's set

- Background, border, text, and progress colors for the **default** notification class — Grounds surface, bronze border, body ink.
- Per-urgency overrides for `low` (muted), `normal` (grounds), and `critical` (status-err border + warm fill).
- Reasonable defaults for size, anchor, font, and timeout. Mako has a bias toward subtlety; Jylhis matches that tone.

## Light vs dark

Both variants are generated: `config` is Field (dark) and `config-sheet` is Sheet (light). Install (or symlink) the one you want as `~/.config/mako/config` and reload with `makoctl reload`; a switcher script that swaps the symlink is left to the user.

## Contract

Hex values mirror `tokens.json`. Regenerate after a token change.
