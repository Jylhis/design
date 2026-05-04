# Jylhis design system — Home Manager module.
#
# Applies the full Jylhis theme to supported applications based on a
# single variant option. Source of truth: nix/themes.nix package.
#
# Usage (in your home-manager config):
#   imports = [ /path/to/design/nix/home-manager-module.nix ];
#   jylhis.theme = { enable = true; variant = "roast"; };
#
# Or with callPackage if you need to pass the themes package:
#   imports = [ (import /path/to/design/nix/home-manager-module.nix { inherit jylhis-themes; }) ];

{ config, lib, pkgs, ... }:

let
  cfg = config.jylhis.theme;
  themes = pkgs.callPackage ./themes.nix {};
  variant = cfg.variant;
  otherVariant = if variant == "roast" then "paper" else "roast";
in
{
  options.jylhis.theme = {
    enable = lib.mkEnableOption "Jylhis design system theme";

    variant = lib.mkOption {
      type = lib.types.enum [ "paper" "roast" ];
      default = "roast";
      description = "Theme variant: paper (light) or roast (dark).";
    };

    ghostty.enable = lib.mkOption {
      type = lib.types.bool;
      default = true;
      description = "Install Ghostty theme files and set theme in config.";
    };

    mako.enable = lib.mkOption {
      type = lib.types.bool;
      default = true;
      description = "Apply Mako notification config.";
    };

    waybar.enable = lib.mkOption {
      type = lib.types.bool;
      default = true;
      description = "Apply Waybar CSS.";
    };

    gtk.enable = lib.mkOption {
      type = lib.types.bool;
      default = true;
      description = "Apply GTK 3/4 CSS overrides.";
    };

    starship.enable = lib.mkOption {
      type = lib.types.bool;
      default = true;
      description = "Apply starship prompt config.";
    };

    fzf.enable = lib.mkOption {
      type = lib.types.bool;
      default = true;
      description = "Apply fzf color scheme.";
    };

    bat.enable = lib.mkOption {
      type = lib.types.bool;
      default = true;
      description = "Install bat/delta tmTheme.";
    };
  };

  config = lib.mkIf cfg.enable {
    # Ghostty themes (both variants installed, active one set in config)
    xdg.configFile = lib.mkMerge [
      (lib.mkIf cfg.ghostty.enable {
        "ghostty/themes/jylhis-paper".source = "${themes}/share/jylhis/ghostty/jylhis-paper";
        "ghostty/themes/jylhis-roast".source = "${themes}/share/jylhis/ghostty/jylhis-roast";
      })

      # Mako
      (lib.mkIf cfg.mako.enable {
        "mako/config".source =
          if variant == "roast"
          then "${themes}/share/jylhis/mako/config"
          else "${themes}/share/jylhis/mako/config-paper";
      })

      # Waybar
      (lib.mkIf cfg.waybar.enable {
        "waybar/style.css".source =
          if variant == "roast"
          then "${themes}/share/jylhis/waybar/style.css"
          else "${themes}/share/jylhis/waybar/style-paper.css";
      })

      # Starship
      (lib.mkIf cfg.starship.enable {
        "starship.toml".source = "${themes}/share/jylhis/shell/starship.toml";
      })

      # bat
      (lib.mkIf cfg.bat.enable {
        "bat/themes/jylhis-paper.tmTheme".source = "${themes}/share/jylhis/bat/jylhis-paper.tmTheme";
        "bat/themes/jylhis-roast.tmTheme".source = "${themes}/share/jylhis/bat/jylhis-roast.tmTheme";
      })
    ];

    # GTK overrides
    gtk = lib.mkIf cfg.gtk.enable {
      gtk3.extraCss = builtins.readFile "${themes}/share/jylhis/gtk/gtk.css";
      gtk4.extraCss = builtins.readFile "${themes}/share/jylhis/gtk/gtk.css";
    };

    # fzf colors via session variables.
    # mkForce: importing this HM module is an explicit ask for jylhis colors —
    # win over Stylix's `programs.fzf` target, which writes the same var.
    home.sessionVariables = lib.mkIf cfg.fzf.enable {
      FZF_DEFAULT_OPTS = lib.mkForce "--color=fg:${
        if variant == "roast" then "#e8e0d4" else "#2c2825"
      },bg:${
        if variant == "roast" then "#1a1714" else "#faf7f2"
      },hl:${
        if variant == "roast" then "#e89b5e" else "#9a5a2a"
      },fg+:${
        if variant == "roast" then "#f0eae0" else "#1e1b18"
      },bg+:${
        if variant == "roast" then "#2e2520" else "#f0e6da"
      },hl+:${
        if variant == "roast" then "#f5b07a" else "#7a4622"
      },info:${
        if variant == "roast" then "#b0a496" else "#6b5f54"
      },prompt:${
        if variant == "roast" then "#e89b5e" else "#9a5a2a"
      },pointer:${
        if variant == "roast" then "#e89b5e" else "#9a5a2a"
      },border:${
        if variant == "roast" then "#3d3830" else "#d5cec4"
      }";
    };
  };
}
