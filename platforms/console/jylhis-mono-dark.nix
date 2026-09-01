# Jylhis Monochrome Dark — GENERATED from tokens.json. Do not edit by hand.
#
# NixOS Linux virtual console (TTY) palette. Import from your
# configuration.nix or a NixOS module:
#
#   imports = [ "${pkgs.jylhis-themes}/share/jylhis/console/jylhis-mono-dark.nix" ];
#
# Slots 0/7/15 are derived from the semantic palette (bg / text /
# text-heading) rather than tokens.ansi — the kernel TTY uses slot 0 as the
# actual background, so the ANSI-escape "text/bg inversion" mapping doesn't
# apply here. All other slots match the ANSI Modus accents in tokens.ansi.

{
  console.colors = [
    "121212" "f0685f" "6bbf6b" "d9b34a" "5fb8cf" "e3e3e3" "5fb8cf" "d9d9d9"
    "6e6e6e" "ff7f7f" "70b900" "e6e6e6" "8f8f8f" "f0f0f0" "5fb8cf" "f5f5f5"
  ];
}
