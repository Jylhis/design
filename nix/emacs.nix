# Jylhis design system — Emacs theme package.
#
# Builds the Jylhis Paper and Roast Emacs themes as an Emacs package
# using trivialBuild. Add to your Emacs packages and load-theme.
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

{ lib, trivialBuild }:

trivialBuild {
  pname = "jylhis-emacs-themes";
  version = "0.3.0";

  src = ../platforms/emacs;

  meta = {
    description = "Jylhis Paper and Roast themes for Emacs — copper accent, Modus syntax";
    homepage = "https://github.com/jylhis/design";
    license = lib.licenses.mit;
  };
}
