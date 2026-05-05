# Jylhis Paper — GENERATED from tokens.json. Do not edit by hand.
#
# NixOS Linux virtual console (TTY) palette. Import from your
# configuration.nix or a NixOS module:
#
#   imports = [ "${pkgs.jylhis-themes}/share/jylhis/console/jylhis-paper.nix" ];
#
# Slots 0/7/15 are derived from the semantic palette (bg / text /
# text-heading) rather than tokens.ansi — the kernel TTY uses slot 0 as the
# actual background, so the ANSI-escape "text/bg inversion" mapping doesn't
# apply here. All other slots match the ANSI Modus accents in tokens.ansi.

{
  console.colors = [
    "faf7f2" "a60000" "006800" "6f5500" "0031a9" "721045" "005f5f" "2c2825"
    "8a7f72" "972500" "315b00" "b5703c" "3548cf" "531ab6" "005e8b" "1e1b18"
  ];
}
