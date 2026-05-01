#!/usr/bin/env bash
set -euo pipefail

bun scripts/generate.mjs
bun scripts/validate-tokens.mjs

rm -rf _site
mkdir -p _site

# Core entry point + generated tokens + hand-authored CSS
cp index.html md.html tokens.css tokens-data.js colors_and_type.css font_options.html _site/
cp -r assets preview platforms ui_kits source_styles docs _site/
cp tokens.json tokens.md CHANGELOG.md README.md SKILL.md _site/

# Prototypes
cp -r prototypes _site/

# .nojekyll so GitHub Pages serves files that start with _ or .
touch _site/.nojekyll
