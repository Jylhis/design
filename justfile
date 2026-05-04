set shell := ["bash", "-uc"]

default:
    @just --list

generate:
    bun scripts/generate.mjs

check-generated:
    bun scripts/generate.mjs --check

validate-tokens:
    bun scripts/validate-tokens.mjs

validate-a11y-html:
    bun scripts/validate-a11y-html.mjs

validate-a11y-css:
    bun scripts/validate-a11y-css.mjs

validate-cli-conventions:
    bun scripts/validate-cli-conventions.mjs

validate: validate-tokens validate-a11y-html validate-a11y-css validate-cli-conventions

check: check-generated validate

site:
    bash scripts/assemble-pages.sh

serve:
    bash scripts/serve-pages.sh

build:
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
