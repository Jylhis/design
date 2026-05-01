#!/usr/bin/env bash
set -euo pipefail

port="${PORT:-8000}"
watch_paths=(
  tokens.json
  index.html
  md.html
  colors_and_type.css
  font_options.html
  README.md
  CHANGELOG.md
  SKILL.md
  assets
  docs
  preview
  prototypes
  source_styles
  ui_kits
  scripts/assemble-pages.sh
  platforms/index.html
  platforms/KEYBOARD.md
  platforms/shell
)

snapshot() {
  python - "$@" <<'PY'
import hashlib
import os
import sys

entries = []
for path in sys.argv[1:]:
    if os.path.isdir(path):
        for root, dirs, files in os.walk(path):
            dirs.sort()
            files.sort()
            for name in files:
                full = os.path.join(root, name)
                stat = os.stat(full)
                entries.append(f"{full}\0{stat.st_mtime_ns}\0{stat.st_size}")
    elif os.path.exists(path):
        stat = os.stat(path)
        entries.append(f"{path}\0{stat.st_mtime_ns}\0{stat.st_size}")

print(hashlib.sha256("\n".join(entries).encode()).hexdigest())
PY
}

bash scripts/assemble-pages.sh

python -m http.server "$port" --bind 127.0.0.1 --directory _site &
server_pid=$!

cleanup() {
  kill "$server_pid" 2>/dev/null || true
}

trap cleanup EXIT INT TERM

echo "Serving GitHub Pages artifact at http://127.0.0.1:${port}/index.html"
echo "Watching source files for changes..."

baseline="$(snapshot "${watch_paths[@]}")"

while sleep 1; do
  current="$(snapshot "${watch_paths[@]}")"
  if [[ "$current" != "$baseline" ]]; then
    echo "Change detected, rebuilding GitHub Pages artifact..."
    if bash scripts/assemble-pages.sh; then
      echo "Rebuild succeeded."
    else
      echo "Rebuild failed."
    fi
    baseline="$current"
  fi
done
