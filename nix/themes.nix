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
  version = "0.3.0";

  inherit src;

  dontBuild = true;

  installPhase = ''
    mkdir -p $out/share/jylhis

    # Ghostty themes
    mkdir -p $out/share/jylhis/ghostty
    cp platforms/ghostty/jylhis-paper $out/share/jylhis/ghostty/
    cp platforms/ghostty/jylhis-roast $out/share/jylhis/ghostty/

    # Emacs themes
    mkdir -p $out/share/jylhis/emacs
    cp platforms/emacs/jylhis-paper-theme.el $out/share/jylhis/emacs/
    cp platforms/emacs/jylhis-roast-theme.el $out/share/jylhis/emacs/
    cp platforms/emacs/jylhis-theme-toggle.el $out/share/jylhis/emacs/

    # CSS tokens
    cp tokens.css $out/share/jylhis/
    cp colors_and_type.css $out/share/jylhis/
    cp tokens.json $out/share/jylhis/

    # Hyprland
    mkdir -p $out/share/jylhis/hyprland
    cp platforms/hyprland/jylhis-paper.conf $out/share/jylhis/hyprland/
    cp platforms/hyprland/jylhis-roast.conf $out/share/jylhis/hyprland/
    cp platforms/hyprland/jylhis.conf $out/share/jylhis/hyprland/

    # Rofi
    mkdir -p $out/share/jylhis/rofi
    cp platforms/rofi/jylhis-paper.rasi $out/share/jylhis/rofi/
    cp platforms/rofi/jylhis-roast.rasi $out/share/jylhis/rofi/

    # GTK
    mkdir -p $out/share/jylhis/gtk
    cp platforms/gtk/gtk.css $out/share/jylhis/gtk/

    # Waybar
    mkdir -p $out/share/jylhis/waybar
    cp platforms/waybar/style.css $out/share/jylhis/waybar/

    # Mako
    mkdir -p $out/share/jylhis/mako
    cp platforms/mako/config $out/share/jylhis/mako/

    # Kvantum
    mkdir -p $out/share/jylhis/kvantum
    cp platforms/kvantum/JylhisPaper.colors $out/share/jylhis/kvantum/
    cp platforms/kvantum/JylhisRoast.colors $out/share/jylhis/kvantum/
  '';

  meta = {
    description = "Jylhis design system — theme files for Ghostty, Emacs, Hyprland, and more";
    homepage = "https://github.com/jylhis/design";
    license = lib.licenses.mit;
  };
}
