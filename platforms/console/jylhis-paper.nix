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
    "f6f8fb" "a60000" "006800" "8a5000" "0031a9" "721045" "005a5f" "23262e"
    "878c95" "b60000" "315b00" "8a4d00" "3548cf" "531ab6" "005e8b" "12141a"
  ];
}
