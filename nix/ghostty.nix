# Jylhis design system — Ghostty wrapped with Jylhis themes.
#
# Creates a wrapped Ghostty binary that includes the Jylhis Sheet and Field
# themes in its search path. Use `theme = jylhis-sheet` or `theme = jylhis-field`
# in your Ghostty config.
#
# Usage:
#   nix-build -E 'with import <nixpkgs> {}; callPackage ./nix/ghostty.nix {}'
#
# Or in a NixOS/home-manager config:
#   environment.systemPackages = [
#     (pkgs.callPackage /path/to/design/nix/ghostty.nix {})
#   ];

{ lib, ghostty, symlinkJoin, makeWrapper, writeTextDir }:

let
  themeFiles = symlinkJoin {
    name = "jylhis-ghostty-themes";
    paths = [
      (writeTextDir "share/ghostty/themes/jylhis-sheet"
        (builtins.readFile ../platforms/ghostty/jylhis-sheet))
      (writeTextDir "share/ghostty/themes/jylhis-field"
        (builtins.readFile ../platforms/ghostty/jylhis-field))
    ];
  };
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
    description = "Ghostty terminal with Jylhis Sheet and Field themes";
    homepage = "https://github.com/jylhis/design";
    license = lib.licenses.mit;
    mainProgram = "ghostty";
  };
}
