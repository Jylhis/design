# Jylhis Roast — GENERATED from tokens.json. Do not edit by hand.
#
# NixOS Linux virtual console (TTY) palette. Import from your
# configuration.nix or a NixOS module:
#
#   imports = [ "${pkgs.jylhis-themes}/share/jylhis/console/jylhis-roast.nix" ];
#
# Slots 0/7/15 are derived from the semantic palette (bg / text /
# text-heading) rather than tokens.ansi — the kernel TTY uses slot 0 as the
# actual background, so the ANSI-escape "text/bg inversion" mapping doesn't
# apply here. All other slots match the ANSI Modus accents in tokens.ansi.

{
  console.colors = [
    "1a1714" "ff5f59" "44bc44" "d0bc00" "2fafff" "feacd0" "6ae4b9" "e8e0d4"
    "6b6157" "ff7f7f" "70b900" "e89b5e" "79a8ff" "b6a0ff" "00d3d0" "f0eae0"
  ];
}
