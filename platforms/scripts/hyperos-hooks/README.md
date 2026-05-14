# HyperOS auto-apply hooks

These optional hooks call `apply-hyperos.sh --auto` so your exported HyperOS theme
tracks desktop dark-mode changes.

## systemd user timer (polling)

1. Copy units into your user config directory:

```bash
mkdir -p ~/.config/systemd/user
cp hyperos-auto-apply.{service,timer} ~/.config/systemd/user/
```

2. Update `ExecStart=` in `hyperos-auto-apply.service` to the absolute path of
   your local `apply-hyperos.sh`.

3. Enable timer:

```bash
systemctl --user daemon-reload
systemctl --user enable --now hyperos-auto-apply.timer
```

## Trigger hook pattern (event-driven)

If your compositor/DE exposes a dark-mode change event, call:

```bash
/path/to/apply-hyperos.sh --auto
```

Examples:
- Hyprland: bind to a script that flips your desktop theme and then invokes `--auto`.
- GNOME/KDE: use your settings daemon hook runner if available.
