# Jylhis Chalk — GENERATED from tokens.json. Do not edit by hand.
#
# NixOS Linux virtual console (TTY) palette. Import from your
# configuration.nix or a NixOS module:
#
#   imports = [ "${pkgs.jylhis-themes}/share/jylhis/console/jylhis-chalk.nix" ];
#
# Slots 0/7/15 are derived from the semantic palette (bg / text /
# text-heading) rather than tokens.ansi — the kernel TTY uses slot 0 as the
# actual background, so the ANSI-escape "text/bg inversion" mapping doesn't
# apply here. All other slots match the ANSI Modus accents in tokens.ansi.

{
  console.colors = [
    "f4f4f4" "1f1f1f" "565656" "454545" "333333" "3a3a3a" "4a4a4a" "2b2b2b"
    "7d7d7d" "2a2a2a" "6a6a6a" "000000" "404040" "4a4a4a" "555555" "1a1a1a"
  ];
}
