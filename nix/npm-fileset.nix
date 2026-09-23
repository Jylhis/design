# The @jylhis/design npm package's file set — the single definition of the
# package's shipped files, mirroring package.json "files". Used by
# nix/npm-package.nix and by consumer node_modules FODs
# (kit/lib/node-modules.nix localDepFilesets), so consumer output hashes
# churn only when shipped files change, not on docs/scripts edits.
#
# Generated outputs (tokens.css, tokens-data.js, density.css — consumers
# import tokens.css via colors_and_type.css) are covered by passing
# nix/generated.nix's `generated` derivation alongside this fileset (see
# nix/npm-package.nix); this fileset carries the tracked sources only.
{ lib }:
lib.fileset.unions [
  ../package.json
  ../styles.css
  ../tokens.core.json
  ../themes
  ../colors_and_type.css
  ../motion.css
  ../fonts.css
  ../fonts
  ../components
  # Hand-maintained shadcn/ui token theme (single file, single theme) for
  # Tailwind consumers.
  ../platforms/shadcn
]
