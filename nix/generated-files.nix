# Jylhis design system — generated output registry.
#
# Repo-relative paths that scripts/generate.mjs emits and that are NOT
# committed (untracked). Single source of truth for "is this file generated":
# nix/themes*.nix copy these from the `generated` derivation (nix/generated.nix)
# instead of the source tree, and nix/generated.nix excludes them from its src
# so a stale local copy can never leak into a build.
#
# Deliberately absent: the committed generated snapshots (platforms/gtk/
# jylhis-{light,dark}.css — the per-polarity pair consumers read at eval
# time without import-from-derivation, platforms/gtk/gtk.css,
# platforms/waybar/style.css, platforms/mako/config — refreshed in-tree by
# the generator but shipped from the source tree) and _ds_bundle.js (emitted
# by scripts/make-bundle.mjs, consumed only via the whole ${generated} tree).
[
  "tokens.css"
  "tokens-data.js"
  "density.css"
  "platforms/base16/jylhis-light.yaml"
  "platforms/base16/jylhis-dark.yaml"
  "platforms/bat/jylhis-light.tmTheme"
  "platforms/bat/jylhis-dark.tmTheme"
  "platforms/console/jylhis-light.nix"
  "platforms/console/jylhis-dark.nix"
  "platforms/emacs/jylhis-light-theme.el"
  "platforms/emacs/jylhis-dark-theme.el"
  "platforms/ghostty/jylhis-light"
  "platforms/ghostty/jylhis-dark"
  "platforms/gimp/jylhis-light.gpl"
  "platforms/gimp/jylhis-dark.gpl"
  "platforms/hyprland/jylhis-light.conf"
  "platforms/hyprland/jylhis-dark.conf"
  "platforms/kvantum/JylhisLight.colors"
  "platforms/kvantum/JylhisDark.colors"
  "platforms/mako/config-light"
  "platforms/mako/config-dark"
  "platforms/rofi/jylhis-light.rasi"
  "platforms/rofi/jylhis-dark.rasi"
  "platforms/shell/fzf-light.sh"
  "platforms/shell/fzf-dark.sh"
  "platforms/waybar/style-light.css"
  "platforms/waybar/style-dark.css"
  # Generator-written legacy shared name for consumers that import gtk.css.
  "platforms/gtk/gtk.css"
]
