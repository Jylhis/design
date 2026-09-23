# Jylhis design system — Ghostty wrapped with Jylhis themes.
#
# Creates a wrapped Ghostty binary that includes the Jylhis themes
# (light + dark) in its search path. Use `theme = jylhis-light` or
# `theme = jylhis-dark` in your Ghostty config.
#
# Usage:
#   nix-build -E 'with import <nixpkgs> {}; callPackage ./nix/ghostty.nix {}'
#
# Or in a NixOS/home-manager config:
#   environment.systemPackages = [
#     (pkgs.callPackage /path/to/design/nix/ghostty.nix {})
#   ];

{
  lib,
  callPackage,
  runCommand,
  ghostty,
  symlinkJoin,
  makeWrapper,
}:

let
  # The theme files are generated outputs (untracked) — read them from the
  # `generated` derivation, never from the source tree.
  generated = callPackage ./generated.nix { };

  themeFiles = runCommand "jylhis-ghostty-themes" { } ''
    mkdir -p "$out/share/ghostty/themes"
    install -m 0644 "${generated}/platforms/ghostty/jylhis-light" \
      "$out/share/ghostty/themes/jylhis-light"
    install -m 0644 "${generated}/platforms/ghostty/jylhis-dark" \
      "$out/share/ghostty/themes/jylhis-dark"
  '';
in
symlinkJoin {
  name = "ghostty-jylhis-${ghostty.version or "unknown"}";
  paths = [ ghostty ];
  nativeBuildInputs = [ makeWrapper ];
  postBuild = ''
    # Wrap the ghostty binary to include Jylhis themes in XDG_DATA_DIRS
    wrapProgram $out/bin/ghostty \
      --prefix XDG_DATA_DIRS : "${themeFiles}/share"
  '';

  meta = {
    description = "Ghostty terminal with Jylhis themes (light + dark)";
    homepage = "https://github.com/jylhis/design";
    license = lib.licenses.mit;
    mainProgram = "ghostty";
  };
}
