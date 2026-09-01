# The @jylhis/design npm package's file set — the single definition of the
# package's shipped files, mirroring package.json "files". Used by
# nix/npm-package.nix and by consumer node_modules FODs
# (kit/lib/node-modules.nix localDepFilesets), so consumer output hashes
# churn only when shipped files change, not on docs/scripts edits.
{ lib }:
lib.fileset.unions [
  ../package.json
  ../styles.css
  ../tokens.css
  ../tokens.core.json
  ../themes
  ../tokens-data.js
  ../colors_and_type.css
  ../motion.css
  ../fonts.css
  ../fonts
  ../components
]
