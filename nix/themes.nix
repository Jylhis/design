# Jylhis design system — all generated theme files as a single package.
#
# Usage:
#   nix-build -E 'with import <nixpkgs> {}; callPackage ./nix/themes.nix {}'
#
# Or in a NixOS/home-manager config:
#   jylhis-themes = pkgs.callPackage /path/to/design/nix/themes.nix {};
#
# The result contains:
#   share/jylhis/ghostty/         — Ghostty theme files
#   share/jylhis/emacs/           — Emacs theme .el files
#   share/jylhis/tokens.css       — CSS tokens
#   share/jylhis/tokens.core.json — theme-independent core (source of truth)
#   share/jylhis/themes/          — jylhis.json
#
# Generated files (see nix/generated-files.nix) are copied from the
# `generated` derivation (nix/generated.nix), never from the source tree —
# generated outputs are untracked, so a source-tree read would break in a
# clean checkout. Hand-authored files come from `src`.

{
  lib,
  pkgs,
  stdenvNoCC,
}:

let
  installMap = import ./install-map.nix;
  generatedFiles = import ./generated-files.nix;

  # Combined package = every target's files (and the shared tokens entries
  # are already only listed once under the `tokens` key).
  allFiles = lib.concatLists (builtins.attrValues installMap);

  root = ./..;
  src = lib.cleanSourceWith {
    src = root;
    filter =
      path: type:
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

  generated = pkgs.callPackage ./generated.nix { };

  # Generated content is copied from the `generated` derivation; everything
  # else from the source tree.
  installLine =
    f:
    let
      mode = f.mode or "0644";
      from = if builtins.elem f.src generatedFiles then "${generated}" else src;
    in
    "install -D -m ${mode} ${from}/${f.src} $out/${f.dest}";
in
stdenvNoCC.mkDerivation {
  pname = "jylhis-themes";
  version = (lib.importJSON ../tokens.core.json).meta.version;

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
