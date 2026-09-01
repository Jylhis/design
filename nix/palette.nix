# Jylhis design system — Nix palette reader.
#
# Reads the token sources (tokens.core.json + themes/<theme>.json) and the
# committed base16 YAML, exposing the palette in the shapes downstream Nix
# configs actually need, so consumers don't have to hand-write a reader.
#
# Usage (via the flake):
#   let p = inputs.jylhis-design.lib.mkPalette { theme = "survey"; mode = "dark"; }; in
#   p.hex.accent          # "#e0a33a"
#   p.ansi."bright-yellow"# "#e0a33a"
#   p.ansi16              # 16-slot bare-hex list
#   p.base16              # base16 attrset (base00..base0F, scheme, author)
#
# Or standalone:
#   import ./nix/palette.nix { lib = pkgs.lib; theme = "survey"; mode = "dark"; }
#
# `theme` is a slug from tokens.core.json#meta.themes ("survey" | "mono");
# `mode` is "light" | "dark".

{
  lib,
  theme ? "survey",
  mode ? "dark",
}:
let
  t = builtins.fromJSON (builtins.readFile (../themes + "/${theme}.json"));

  sh = lib.removePrefix "#";

  p = t.palette;
  s = t.status;
  sy = t.syntax;

  # Parse the committed base16 YAML for this variant — simple `key: "value"`
  # lines, so the returned attrset is byte-faithful to the shipped file.
  base16Yaml = builtins.readFile (../platforms/base16 + "/jylhis-${theme}-${mode}.yaml");
  parseLine =
    l:
    let
      m = builtins.match "([a-zA-Z0-9]+): \"([^\"]*)\"" l;
    in
    if m == null then null else lib.nameValuePair (builtins.elemAt m 0) (builtins.elemAt m 1);
  base16 = builtins.listToAttrs (
    lib.filter (x: x != null) (map parseLine (lib.splitString "\n" base16Yaml))
  );
in
{
  inherit base16;

  # role name → hex string for the selected variant, across
  # palette/status/syntax (values keep the leading "#"; strip it yourself
  # where a target wants bare hex). e.g. hex.accent == "#e0a33a".
  hex = lib.mapAttrs (_: tok: tok.${mode}) (p // s // sy);

  # ANSI name → hex, e.g. ansi.black, ansi."bright-yellow".
  ansi = lib.listToAttrs (map (e: lib.nameValuePair e.name e.${mode}) t.ansi);

  # Raw 16-slot ANSI palette as bare hex (no leading #), for terminal apps
  # that manage their own background.
  ansi16 = map (e: sh e.${mode}) t.ansi;
}
