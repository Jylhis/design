# Jylhis design system — all generated theme files as a single package.
#
# Usage:
#   nix-build -E 'with import <nixpkgs> {}; callPackage ./nix/themes.nix {}'
#
# Or in a NixOS/home-manager config:
#   jylhis-themes = pkgs.callPackage /path/to/design/nix/themes.nix {};
#
# The result contains:
#   share/jylhis/ghostty/    — Ghostty theme files
#   share/jylhis/emacs/      — Emacs theme .el files
#   share/jylhis/tokens.css  — CSS tokens
#   share/jylhis/tokens.json — machine-readable source of truth

{ lib, stdenvNoCC }:

let
  installMap = import ./install-map.nix;

  # Combined package = every target's files (and the shared tokens entries
  # are already only listed once under the `tokens` key).
  allFiles = lib.concatLists (builtins.attrValues installMap);

  installLine = f:
    let mode = f.mode or "0644";
    in "install -D -m ${mode} ${f.src} $out/${f.dest}";

  root = ./..;
  src = lib.cleanSourceWith {
    src = root;
    filter = path: type:
      let
        rel = lib.removePrefix ((toString root) + "/") (toString path);
        first = builtins.head (lib.splitString "/" rel);
      in
        first != ".git"
        && first != "_site"
        && first != "result"
        && !lib.hasPrefix ".devenv" first
        && !lib.hasPrefix "result-" first;
  };
in
stdenvNoCC.mkDerivation {
  pname = "jylhis-themes";
  # Read from tokens.json so the package version can never drift from the
  # design system's own `meta.version`.
  version = (builtins.fromJSON (builtins.readFile ../tokens.json)).meta.version;

  inherit src;

  dontBuild = true;

  installPhase = ''
    runHook preInstall
    ${lib.concatMapStringsSep "\n" installLine allFiles}
    runHook postInstall
  '';

  meta = {
    description = "Jylhis design system — theme files for Ghostty, Emacs, Hyprland, and more";
    homepage = "https://github.com/jylhis/design";
    license = lib.licenses.mit;
  };
}
