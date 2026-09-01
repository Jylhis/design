# Jylhis Field — GENERATED from tokens.json. Do not edit by hand.
#
# NixOS Linux virtual console (TTY) palette. Import from your
# configuration.nix or a NixOS module:
#
#   imports = [ "${pkgs.jylhis-themes}/share/jylhis/console/jylhis-field.nix" ];
#
# Slots 0/7/15 are derived from the semantic palette (bg / text /
# text-heading) rather than tokens.ansi — the kernel TTY uses slot 0 as the
# actual background, so the ANSI-escape "text/bg inversion" mapping doesn't
# apply here. All other slots match the ANSI Modus accents in tokens.ansi.

{
  console.colors = [
    "0d0f14" "f0685f" "6bbf6b" "d9b34a" "5fb8cf" "feacd0" "5fb8cf" "d6dae2"
    "656b76" "ff7f7f" "70b900" "e0a33a" "6f9be0" "b6a0ff" "00d3d0" "f2f4f8"
  ];
}
