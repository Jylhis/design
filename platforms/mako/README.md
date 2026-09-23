# Jylhis for Mako

Per-mode config files for the [Mako](https://github.com/emersion/mako) Wayland notification daemon.

```
platforms/mako/
├── config-light      ← generated (light)
├── config-dark       ← generated (dark)
└── config            ← hand-maintained light copy (legacy shared name)
```

## Install

```bash
mkdir -p ~/.config/mako
ln -sf ~/path/to/design/platforms/mako/config-dark ~/.config/mako/config
makoctl reload
```

Or, if you'd rather copy:

```bash
cp config-dark ~/.config/mako/config   # or config-light
makoctl reload
```

## What's set

- Background, border, text, and progress colors for the **default** notification class — Grounds surface, bronze border, body ink.
- Per-urgency overrides for `low` (muted), `normal` (grounds), and `critical` (status-err border + warm fill).
- Reasonable defaults for size, anchor, font, and timeout. Mako has a bias toward subtlety; Jylhis matches that tone.

## Light vs dark

Mako has no mode switch. Install the file for the mode you run
(`config-light` or `config-dark`). The tracked `config` here is a
hand-maintained light-mode copy kept for consumers that hardcode the shared
name — refresh it by hand when the generated light output changes.
`platforms/scripts/jylhis-theme-toggle.sh` flips modes and reloads Mako
(`makoctl reload`).

## Contract

Hex values in `config-light` / `config-dark` mirror `tokens.core.json` +
`themes/jylhis.json`. Regenerate after a token change.
