# Jylhis for Mako

A single `config` file for the [Mako](https://github.com/emersion/mako) Wayland notification daemon.

```
platforms/mako/
└── config                ← generated
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

The generated `config` ships only one edition (Field). If you switch the system to Sheet, regenerate after toggling the `mode` constant in `scripts/generate.mjs#generateMako`, or add a second config and reload Mako with `makoctl reload`.

> **TODO:** the generator could emit two configs (`config-survey-light` and `config-field`) and a small switcher script. Not done yet — the current single-mode behaviour matches how Mako is typically deployed.

## Contract

Hex values mirror `tokens.json`. Regenerate after a token change.
