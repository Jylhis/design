# Jylhis design system — system-wide Stylix wiring.
#
# Imported by both `nixosModules.default` and `darwinModules.default`
# in the flake. The two module systems share enough surface for the
# small wiring this module does (option declaration + a few config
# attrs under `stylix.*`).
#
# Usage (NixOS configuration.nix or nix-darwin configuration.nix):
#   imports = [ inputs.jylhis-design.nixosModules.default ];   # or darwinModules.default
#   jylhis.theme = { enable = true; variant = "field"; };      # or "sheet"
#
# Sets:
#   stylix.enable        (mkDefault true — won't fight an existing setting)
#   stylix.polarity      ("light" or "dark", derived from variant)
#   stylix.base16Scheme  (path to the generated YAML in the themes package)
#
# Per-target Stylix toggles (`stylix.targets.*.enable`) are NOT touched
# here — that's the consumer's call. See docs/INTEGRATION.md for the
# list to disable when also importing the Home-Manager module.

{ config, lib, pkgs, ... }:

let
  cfg = config.jylhis.theme;
  themes = pkgs.callPackage ./themes.nix { };
  polarity = {
    sheet = "light";
    field = "dark";
    chalk = "light";
    graphite = "dark";
  }.${cfg.variant};
in
{
  options.jylhis.theme = {
    enable = lib.mkEnableOption "Jylhis design system (system-wide Stylix wiring)";

    variant = lib.mkOption {
      type = lib.types.enum [ "sheet" "field" "chalk" "graphite" ];
      default = "field";
      description = ''
        Theme variant: sheet (light) or field (dark) for the colour editions,
        chalk (light) or graphite (dark) for the monochrome editions.
      '';
    };
  };

  config = lib.mkIf cfg.enable {
    stylix.enable = lib.mkDefault true;
    stylix.polarity = polarity;
    stylix.base16Scheme = "${themes}/share/jylhis/base16/jylhis-${cfg.variant}.yaml";
  };
}
