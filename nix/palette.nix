# Jylhis design system — Nix palette reader.
#
# Reads tokens.json (the single source of truth) and exposes the palette in
# the shapes downstream Nix configs actually need, so consumers don't have to
# hand-write a tokens.json reader. Ships the same derivations Marchyo used
# in-tree; upstreamed here so there is one canonical copy.
#
# Usage (via the flake):
#   let p = inputs.jylhis-design.lib.mkPalette "roast"; in
#   p.hex.accent          # "#e89b5e"
#   p.base16              # base16 attrset (base00..base0F, scheme, author)
#   p.tty16               # 16-color list, slots 0/7/15 made TTY-readable
#
# Or standalone:
#   import ./nix/palette.nix { lib = pkgs.lib; variant = "paper"; }
#
# `variant` accepts "paper"/"roast" or "light"/"dark".

{
  lib,
  variant ? "roast",
}:
let
  tokens = builtins.fromJSON (builtins.readFile ../tokens.json);

  # Normalise variant → tokens.json key ("light" | "dark").
  key =
    if variant == "light" || variant == "paper" then
      "light"
    else if variant == "dark" || variant == "roast" then
      "dark"
    else
      throw "jylhis palette: unknown variant \"${variant}\" (want paper/roast or light/dark)";

  sh = lib.removePrefix "#";

  p = tokens.palette;
  s = tokens.status;
  sy = tokens.syntax;
in
{
  # base16 mapping — semantic slots → design tokens. Matches
  # platforms/base16/jylhis-{paper,roast}.yaml.
  base16 = {
    scheme = if key == "dark" then "Jylhis Roast" else "Jylhis Paper";
    author = "Markus Jylhankangas (https://jylhis.com)";
    base00 = sh p.bg.${key};
    base01 = sh p."bg-subtle".${key};
    base02 = sh p.surface.${key};
    base03 = sh p."text-faint".${key};
    base04 = sh p."text-muted".${key};
    base05 = sh p.text.${key};
    base06 = sh p."text-heading".${key};
    base07 = sh p."surface-raised".${key};
    base08 = sh s."status-err".${key};
    base09 = sh p.accent.${key};
    base0A = sh s."status-warn".${key};
    base0B = sh sy."syn-string".${key};
    base0C = sh sy."syn-type".${key};
    base0D = sh s."status-info".${key};
    base0E = sh sy."syn-keyword".${key};
    base0F = sh p.brand.${key};
  };

  # Raw 16-slot ANSI palette (for terminal apps that manage their own bg).
  ansi16 = map (e: sh e.${key}) tokens.ansi;

  # Kernel-TTY palette: slots 0/7/15 come from the semantic palette
  # (bg / text / text-heading) so the console renders readably in both
  # variants. Mirrors platforms/console/jylhis-{paper,roast}.nix.
  tty16 =
    let
      overrides = {
        "0" = sh p.bg.${key};
        "7" = sh p.text.${key};
        "15" = sh p."text-heading".${key};
      };
    in
    lib.imap0 (i: e: overrides.${toString i} or (sh e.${key})) tokens.ansi;

  # role name → hex string for the selected variant, across
  # palette/status/syntax (e.g. hex.accent == "#e89b5e"). Values keep the
  # leading "#"; strip it yourself where a target wants bare hex.
  hex = lib.mapAttrs (_: tok: tok.${key}) (p // s // sy);

  # ANSI name → hex, e.g. ansi.black, ansi."bright-yellow".
  ansi = lib.listToAttrs (map (e: lib.nameValuePair e.name e.${key}) tokens.ansi);

  variantKey = key;
}
