# Jylhis Monochrome Light — GENERATED from tokens.json. Do not edit by hand.
#
# NixOS Linux virtual console (TTY) palette. Import from your
# configuration.nix or a NixOS module:
#
#   imports = [ "${pkgs.jylhis-themes}/share/jylhis/console/jylhis-mono-light.nix" ];
#
# Slots 0/7/15 are derived from the semantic palette (bg / text /
# text-heading) rather than tokens.ansi — the kernel TTY uses slot 0 as the
# actual background, so the ANSI-escape "text/bg inversion" mapping doesn't
# apply here. All other slots match the ANSI Modus accents in tokens.ansi.

{
  console.colors = [
    "f7f7f7" "a60000" "006800" "8a5000" "005e8b" "1c1c1c" "005e8b" "212121"
    "828282" "972500" "315b00" "000000" "4a4a4a" "5317ac" "2b2b2b" "0f0f0f"
  ];
}
