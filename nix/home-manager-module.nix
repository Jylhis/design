# Jylhis design system — Home Manager module.
#
# Applies the full Jylhis theme to supported applications, selected by two
# orthogonal options: `name` (survey | mono) and `mode` (light | dark).
# Source of truth: nix/themes.nix package.
#
# Usage (in your home-manager config):
#   imports = [ /path/to/design/nix/home-manager-module.nix ];
#   jylhis.theme = { enable = true; name = "survey"; mode = "dark"; };

{ config, lib, pkgs, ... }:

let
  cfg = config.jylhis.theme;
  themes = pkgs.callPackage ./themes.nix {};
  variant = "${cfg.name}-${cfg.mode}";

  # fzf colours come from the generated shell/fzf-<theme>-<mode>.sh instead of
  # being inlined here — the file is `--color=…` after FZF_DEFAULT_OPTS.
  fzfColor =
    let
      m = builtins.match ''.*--color=([^"]*)".*''
        (builtins.readFile "${themes}/share/jylhis/shell/fzf-${variant}.sh");
    in
    if m == null then "" else builtins.head m;
in
{
  options.jylhis.theme = {
    enable = lib.mkEnableOption "Jylhis design system theme";

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
    # Ghostty themes (both modes of the active theme installed; active set in config)
    xdg.configFile = lib.mkMerge [
      (lib.mkIf cfg.ghostty.enable {
        "ghostty/themes/jylhis-${cfg.name}-light".source =
          "${themes}/share/jylhis/ghostty/jylhis-${cfg.name}-light";
        "ghostty/themes/jylhis-${cfg.name}-dark".source =
          "${themes}/share/jylhis/ghostty/jylhis-${cfg.name}-dark";
      })

      # Mako
      (lib.mkIf cfg.mako.enable {
        "mako/config".source = "${themes}/share/jylhis/mako/config-${variant}";
      })

      # Waybar
      (lib.mkIf cfg.waybar.enable {
        "waybar/style.css".source = "${themes}/share/jylhis/waybar/style-${variant}.css";
      })

      # Starship
      (lib.mkIf cfg.starship.enable {
        "starship.toml".source = "${themes}/share/jylhis/shell/starship.toml";
      })

      # bat
      (lib.mkIf cfg.bat.enable {
        "bat/themes/jylhis-${cfg.name}-light.tmTheme".source =
          "${themes}/share/jylhis/bat/jylhis-${cfg.name}-light.tmTheme";
        "bat/themes/jylhis-${cfg.name}-dark.tmTheme".source =
          "${themes}/share/jylhis/bat/jylhis-${cfg.name}-dark.tmTheme";
      })
    ];

    # GTK overrides — per-theme file (jylhis-<theme>.css switches on .dark).
    gtk = lib.mkIf cfg.gtk.enable {
      gtk3.extraCss = builtins.readFile "${themes}/share/jylhis/gtk/jylhis-${cfg.name}.css";
      gtk4.extraCss = builtins.readFile "${themes}/share/jylhis/gtk/jylhis-${cfg.name}.css";
    };

    # fzf colours via session variables.
    # mkForce: importing this HM module is an explicit ask for jylhis colours —
    # win over Stylix's `programs.fzf` target, which writes the same var.
    home.sessionVariables = lib.mkIf cfg.fzf.enable {
      FZF_DEFAULT_OPTS = lib.mkForce "--color=${fzfColor}";
    };
  };
}
