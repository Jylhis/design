set shell := ["bash", "-uc"]

default:
    @just --list --justfile {{ justfile() }}

# Monorepo helpers; absent (and silently skipped) in the public projection.
# Because the import is optional, the canonical recipe set
# (docs/design/just-interface.md) is defined in full below rather than
# inherited — the projection has no shared fragment to inherit from.
import? '../../shared/just/project.just'

# === check ===

# Regenerate every platform target from the token sources
build: generate

generate:
    bun scripts/generate.mjs

# Determinism gate: two runs from sources must agree byte-for-byte.
generate-check:
    tmp=$(mktemp -d); bun scripts/generate.mjs --out "$tmp/a" >/dev/null; bun scripts/generate.mjs --out "$tmp/b" >/dev/null; diff -r "$tmp/a" "$tmp/b"; rm -rf "$tmp"
check-bundle:
    tmp=$(mktemp -d); bun scripts/make-bundle.mjs --out "$tmp/x.js" >/dev/null; bun scripts/make-bundle.mjs --out "$tmp/y.js" >/dev/null; cmp "$tmp/x.js" "$tmp/y.js"; rm -rf "$tmp"

validate-tokens:
    bun scripts/validate-tokens.mjs

validate-a11y-html:
    bun scripts/validate-a11y-html.mjs

validate-a11y-css:
    bun scripts/validate-a11y-css.mjs

validate-cli-conventions:
    bun scripts/validate-cli-conventions.mjs

# All four validators — the same set package.nix's `validate` check and
# .github/workflows/validate.yml run. Keep the three in lock-step.
validate: validate-tokens validate-a11y-html validate-a11y-css validate-cli-conventions

# Root `just test` auto-discovers this recipe (monorepo contract).
test: generate-check check-bundle validate

# Static analysis: the validators are this project's linters, and the
# determinism gate is what keeps generated output honest.
lint: generate-check

# The local pre-commit gate
check: lint test

# Generated output is deliberately excluded from the monorepo's treefmt, so
# `fmt` regenerates from the token sources instead of reformatting.
fmt: generate

# === nix ===

# Build every package this project's own flake exposes
nix-build:
    #!/usr/bin/env bash
    set -euo pipefail

    system="$(nix eval --impure --raw --expr builtins.currentSystem)"
    mapfile -t packages < <(
      nix eval --json ".#packages.${system}" --apply builtins.attrNames \
        | python3 -c 'import json, sys; print("\n".join(json.load(sys.stdin)))'
    )

    refs=()
    for package in "${packages[@]}"; do
      refs+=(".#${package}")
    done

    nix build --no-link "${refs[@]}"

# Build the flake checks (the monorepo declares design-generated/design-validate;
# standalone, the project's own flake has none, so this is a no-op there).
nix-check:
    #!/usr/bin/env bash
    set -euo pipefail
    if [ ! -e ../../kit/kernel/outputs.nix ]; then
      echo "design: no checks outside the monorepo (see package.nix)"
      exit 0
    fi
    system=$(nix eval --impure --raw --expr builtins.currentSystem)
    cd ../.. && nix build --no-link \
      ".#checks.${system}.design-generated" ".#checks.${system}.design-validate"

# === site ===

site:
    bash scripts/assemble-pages.sh

serve:
    bash scripts/serve-pages.sh

# === housekeeping ===

clean:
    rm -rf _site result result-*

info:
    @python3 -c "import json; t = json.load(open('tokens.core.json')); print('design', t['meta']['version'])"

# Snapshot the gated export to github.com/Jylhis/design (monorepo only)
publish:
    cd ../.. && just publish design
