#!/usr/bin/env bash
# apply-hyperos.sh — apply Jylhis HyperOS variant manually or via auto-detect.
set -euo pipefail

state_dir="${XDG_STATE_HOME:-$HOME/.local/state}/jylhis"
state_file="$state_dir/active-theme"
mkdir -p "$state_dir"

usage() {
  cat <<'USAGE'
Usage:
  apply-hyperos.sh paper|roast
  apply-hyperos.sh --auto

Behavior:
  --auto tries to follow desktop dark-mode state and maps:
    dark  -> roast
    light -> paper

Environment:
  HYPEROS_APPLY_CMD
    Optional command template to perform the real HyperOS apply step.
    Use "{variant}" as a placeholder (example: 'mtz-apply ~/themes/jylhis-{variant}.mtz').
USAGE
}

detect_system_mode() {
  local v

  if command -v gsettings >/dev/null 2>&1; then
    v="$(gsettings get org.gnome.desktop.interface color-scheme 2>/dev/null || true)"
    case "$v" in
      *prefer-dark*) printf 'dark\n'; return 0 ;;
      *default*|*prefer-light*) printf 'light\n'; return 0 ;;
    esac

    v="$(gsettings get org.gnome.desktop.interface gtk-theme 2>/dev/null || true)"
    case "$v" in
      *[Dd]ark*) printf 'dark\n'; return 0 ;;
      *)
        if [[ -n "$v" ]]; then
          printf 'light\n'
          return 0
        fi
      ;;
    esac
  fi

  if [[ -r "$state_file" ]]; then
    case "$(cat "$state_file")" in
      roast) printf 'dark\n'; return 0 ;;
      paper) printf 'light\n'; return 0 ;;
    esac
  fi

  printf 'light\n'
}

apply_variant() {
  local variant="$1"
  case "$variant" in
    paper|roast) ;;
    *) echo "invalid variant: $variant" >&2; exit 2 ;;
  esac

  printf '%s\n' "$variant" > "$state_file"

  if [[ -n "${HYPEROS_APPLY_CMD:-}" ]]; then
    local cmd="${HYPEROS_APPLY_CMD//\{variant\}/$variant}"
    eval "$cmd"
  fi

  printf '%s\n' "$variant"
}

main() {
  if [[ ${1:-} == "-h" || ${1:-} == "--help" || $# -eq 0 ]]; then
    usage
    exit 0
  fi

  if [[ "$1" == "--auto" ]]; then
    local mode variant
    mode="$(detect_system_mode)"
    if [[ "$mode" == "dark" ]]; then
      variant="roast"
    else
      variant="paper"
    fi
    apply_variant "$variant"
    exit 0
  fi

  if [[ $# -ne 1 ]]; then
    usage >&2
    exit 2
  fi

  apply_variant "$1"
}

main "$@"
