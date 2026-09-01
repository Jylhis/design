#!/usr/bin/env bash
set -euo pipefail

bun scripts/generate.mjs
bun scripts/validate-tokens.mjs

rm -rf _site
mkdir -p _site

# Core entry points + generated tokens + hand-authored CSS
cp index.html tokens.css tokens-data.js styles.css fonts.css colors_and_type.css motion.css _site/
cp -r assets fonts preview components platforms docs _site/
cp tokens.core.json tokens.md README.md SKILL.md _site/
cp -r themes _site/

# Prototypes
cp -r prototypes _site/

# .nojekyll so GitHub Pages serves files that start with _ or .
touch _site/.nojekyll
