# Jylhis design system — single-target derivation.
#
# Companion to nix/themes.nix (which installs every target). This
# derivation copies just one target's files plus the shared `tokens`
# pseudo-target (tokens.css, tokens.core.json, themes/jylhis.json,
# colors_and_type.css), so a
# consumer that only wants e.g. waybar gets a small closure.
#
# Generated files (see nix/generated-files.nix) are copied from the
# `generated` derivation (nix/generated.nix), never from the source tree —
# generated outputs are untracked, so a source-tree read would break in a
# clean checkout. Hand-authored files come from `src`.
#
# Usage:
#   pkgs.callPackage ./nix/themes-per-target.nix { target = "waybar"; }
#
# Targets correspond to the keys in nix/install-map.nix:
#   ghostty, emacs, hyprland, rofi, gtk, waybar, mako, kvantum, base16,
#   console, shell, bat, scripts, plymouth, gimp, shadcn, adobe, hyperos
#   (and `tokens` for just the root files).
#
# Used by flake.nix to expose packages.<system>.<target>.
{
  lib,
  pkgs,
  stdenvNoCC,
  target,
}:

let
  installMap = import ./install-map.nix;
  generatedFiles = import ./generated-files.nix;

  knownTargets = builtins.attrNames installMap;

  selected =
    if !(installMap ? ${target}) then
      throw "themes-per-target: unknown target \"${target}\". Known: ${lib.concatStringsSep ", " knownTargets}"
    else
      installMap.${target} ++ (lib.optionals (target != "tokens") installMap.tokens);

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
  pname = "jylhis-themes-${target}";
  version = (lib.importJSON ../tokens.core.json).meta.version;

  inherit src;

  dontBuild = true;

  installPhase = ''
    runHook preInstall
    ${lib.concatMapStringsSep "\n" installLine selected}
    runHook postInstall
  '';

  meta = {
    description = "Jylhis design system — ${target} theme files only";
    homepage = "https://github.com/jylhis/design";
    license = lib.licenses.mit;
  };
}
