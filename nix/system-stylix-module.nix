# Jylhis design system — system-wide Stylix wiring.
#
# Imported by both `nixosModules.default` and `darwinModules.default`
# in the flake. The two module systems share enough surface for the
# small wiring this module does (option declaration + a few config
# attrs under `stylix.*`).
#
# Usage (NixOS configuration.nix or nix-darwin configuration.nix):
#   imports = [ inputs.jylhis-design.nixosModules.default ];   # or darwinModules.default
#   jylhis.theme = { enable = true; name = "survey"; mode = "dark"; };
#
# Sets:
#   stylix.enable        (mkDefault true — won't fight an existing setting)
#   stylix.polarity      ("light" or "dark", derived from mode)
#   stylix.base16Scheme  (path to the generated YAML in the themes package)
#
# Per-target Stylix toggles (`stylix.targets.*.enable`) are NOT touched
# here — that's the consumer's call. See docs/INTEGRATION.md for the
# list to disable when also importing the Home-Manager module.

{ config, lib, pkgs, ... }:

let
  cfg = config.jylhis.theme;
  themes = pkgs.callPackage ./themes.nix { };
in
{
  options.jylhis.theme = {
    enable = lib.mkEnableOption "Jylhis design system (system-wide Stylix wiring)";

    name = lib.mkOption {
      type = lib.types.enum [ "survey" "mono" ];
      default = "survey";
      description = "Theme: survey (cool bronze) or mono (grayscale).";
    };

    mode = lib.mkOption {
      type = lib.types.enum [ "light" "dark" ];
      default = "dark";
      description = "Mode: light or dark. Every theme ships both.";
    };
  };

  config = lib.mkIf cfg.enable {
    stylix.enable = lib.mkDefault true;
    stylix.polarity = cfg.mode;
    stylix.base16Scheme = "${themes}/share/jylhis/base16/jylhis-${cfg.name}-${cfg.mode}.yaml";
  };
}
