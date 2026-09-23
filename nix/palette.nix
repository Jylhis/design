# Jylhis design system — Nix palette reader.
#
# Reads the token sources (tokens.core.json + themes/jylhis.json), exposing
# the palette in the shapes downstream Nix configs actually need, so
# consumers don't have to hand-write a reader.
#
# Usage (via the flake):
#   let p = inputs.jylhis-design.lib.mkPalette { mode = "dark"; }; in
#   p.hex.accent          # "#f5a351"
#   p.ansi."bright-yellow"# "#f5a351"
#   p.ansi16              # 16-slot bare-hex list
#
# Or standalone:
#   import ./nix/palette.nix { lib = pkgs.lib; mode = "dark"; }
#
# Single theme: there is no theme argument. `mode` is "light" | "dark".
# base16 YAML consumers use lib.toBase16Scheme (a derivation path) instead —
# this reader stays pure-eval over the JSON sources.

{
  lib,
  mode ? "dark",
}:
let
  t = builtins.fromJSON (builtins.readFile ../themes/jylhis.json);

  sh = lib.removePrefix "#";

  p = t.palette;
  s = t.status;
  sy = t.syntax;
in
{
  # role name → hex string for the selected mode, across
  # palette/status/syntax (values keep the leading "#"; strip it yourself
  # where a target wants bare hex). e.g. hex.accent == "#f5a351" (dark; light "#693900").
  hex = lib.mapAttrs (_: tok: tok.${mode}) (p // s // sy);

  # ANSI name → hex, e.g. ansi.black, ansi."bright-yellow".
  ansi = lib.listToAttrs (map (e: lib.nameValuePair e.name e.${mode}) t.ansi);

  # Raw 16-slot ANSI palette as bare hex (no leading #), for terminal apps
  # that manage their own background.
  ansi16 = map (e: sh e.${mode}) t.ansi;
}
