#!/usr/bin/env bash
set -euo pipefail

bun scripts/generate.mjs
bun scripts/validate-tokens.mjs

rm -rf _site
mkdir -p _site

# Core entry points + generated tokens + hand-authored CSS
cp index.html md.html palette.html tokens.css tokens-data.js _site/
cp colors_and_type.css fonts.css motion.css styles.css font_options.html _site/
cp -r assets fonts components preview platforms docs _site/
cp tokens.json tokens.md CHANGELOG.md README.md SKILL.md _site/

# Prototypes + the mock-template packages they consume
cp -r prototypes mocks _site/

# .nojekyll keeps files starting with _ or . servable on any static host
touch _site/.nojekyll
