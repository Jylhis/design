# Jylhis design system — Emacs theme package.
#
# Builds the Jylhis Emacs themes (light + dark) as an Emacs package using
# trivialBuild. Add to your Emacs packages and load-theme.
#
# Usage:
#   nix-build -E 'with import <nixpkgs> {}; callPackage ./nix/emacs.nix {
#     inherit (emacsPackages) trivialBuild;
#   }'
#
# Or in home-manager with Emacs overlay:
#   programs.emacs.extraPackages = epkgs: [
#     (pkgs.callPackage /path/to/design/nix/emacs.nix {
#       inherit (epkgs) trivialBuild;
#     })
#   ];

{
  lib,
  callPackage,
  symlinkJoin,
  trivialBuild,
}:

let
  # The theme .el files are generated outputs (untracked) — build from the
  # `generated` derivation, never from the source tree.  The hand-authored
  # entry point (`jylhis-themes.el`) and toggle helper come from the source
  # tree: trivialBuild does not process ###autoload cookies, so consumers
  # need `(require 'jylhis-themes)` to register custom-theme-load-path,
  # and that file is a committed source, not a generator output.
  generated = callPackage ./generated.nix { };
in
trivialBuild {
  pname = "jylhis-emacs-themes";
  version = (lib.importJSON ../tokens.core.json).meta.version;

  src = symlinkJoin {
    name = "jylhis-emacs-themes-src";
    paths = [
      "${generated}/platforms/emacs"
      ./../platforms/emacs
    ];
  };

  meta = {
    description = "Jylhis themes for Emacs — bronze accent, Modus syntax";
    homepage = "https://github.com/jylhis/design";
    license = lib.licenses.mit;
  };
}
