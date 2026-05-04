#!/usr/bin/env bash
# jylhis-theme-toggle.sh — flip the active Jylhis variant on a Wayland desktop.
#
# Hand-authored (not generated). Mirrors platforms/emacs/jylhis-theme-toggle.el.
#
# Behavior:
#   1. Read $XDG_STATE_HOME/jylhis/active-theme (defaults to ~/.local/state).
#      The file is a single line: "paper" or "roast". If absent, defaults to roast.
#   2. Flip the value and rewrite the file atomically.
#   3. Reload the desktop daemons that pick up the change:
#        - waybar  (SIGUSR2 — config reload)
#        - mako    (makoctl reload)
#        - hyprland (hyprctl reload)
#        - emacs   (emacsclient -e (jylhis-toggle-theme), if running)
#   4. Print the new variant on stdout for callers that want to chain.
#
# Exit codes:
#   0 — toggled successfully (some reload calls may have warned, see stderr)
#   1 — could not write the state file (refusing to leave inconsistent state)
#
# Pairs with the SUPER+SHIFT+T binding in platforms/hyprland/jylhis-keys.conf.

set -euo pipefail

state_dir="${XDG_STATE_HOME:-$HOME/.local/state}/jylhis"
state_file="$state_dir/active-theme"

mkdir -p "$state_dir"

current="roast"
[[ -r "$state_file" ]] && current="$(cat "$state_file")"

case "$current" in
  paper) next="roast" ;;
  roast) next="paper" ;;
  *)     next="roast" ;;  # unknown contents → reset to roast
esac

# Atomic write: tmp file + rename.
tmp="$(mktemp "$state_dir/.active-theme.XXXXXX")"
printf '%s\n' "$next" > "$tmp"
mv -f "$tmp" "$state_file"

# Best-effort reloads — don't fail the toggle just because a daemon isn't running.
# All output suppressed: hyprctl reload prints "ok" on stdout; we want only
# the new variant on our own stdout for callers that want to chain.
pkill -SIGUSR2 waybar               >/dev/null 2>&1 || true
makoctl reload                      >/dev/null 2>&1 || true
hyprctl reload                      >/dev/null 2>&1 || true
command -v emacsclient >/dev/null && \
  emacsclient -e '(jylhis-toggle-theme)' >/dev/null 2>&1 || true

printf '%s\n' "$next"
