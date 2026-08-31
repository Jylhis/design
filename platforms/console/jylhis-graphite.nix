# Jylhis Graphite — GENERATED from tokens.json. Do not edit by hand.
#
# NixOS Linux virtual console (TTY) palette. Import from your
# configuration.nix or a NixOS module:
#
#   imports = [ "${pkgs.jylhis-themes}/share/jylhis/console/jylhis-graphite.nix" ];
#
# Slots 0/7/15 are derived from the semantic palette (bg / text /
# text-heading) rather than tokens.ansi — the kernel TTY uses slot 0 as the
# actual background, so the ANSI-escape "text/bg inversion" mapping doesn't
# apply here. All other slots match the ANSI Modus accents in tokens.ansi.

{
  console.colors = [
    "0d0d0d" "f0f0f0" "909090" "b8b8b8" "d0d0d0" "c8c8c8" "b0b0b0" "dadada"
    "6a6a6a" "ffffff" "a5a5a5" "ffffff" "dcdcdc" "d5d5d5" "c0c0c0" "f2f2f2"
  ];
}
