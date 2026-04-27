# Jylhis design system — Ghostty wrapped with Jylhis themes.
#
# Creates a wrapped Ghostty binary that includes the Jylhis Paper and Roast
# themes in its search path. Use `theme = jylhis-paper` or `theme = jylhis-roast`
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
      (writeTextDir "share/ghostty/themes/jylhis-paper"
        (builtins.readFile ../platforms/ghostty/jylhis-paper))
      (writeTextDir "share/ghostty/themes/jylhis-roast"
        (builtins.readFile ../platforms/ghostty/jylhis-roast))
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
    description = "Ghostty terminal with Jylhis Paper and Roast themes";
    homepage = "https://github.com/jylhis/design";
    license = lib.licenses.mit;
    mainProgram = "ghostty";
  };
}
