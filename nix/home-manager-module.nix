# Jylhis design system — Home Manager module.
#
# Applies the Jylhis theme to supported applications, selected by the
# `mode` option (light | dark); `name` remains as a single-value option so
# existing configs that set it keep evaluating. Source of truth:
# nix/themes.nix package.
#
# Evaluating this module builds the themes derivation (its generated files
# — fzf colours, GTK CSS — are read from the package, not the source tree;
# generated outputs are untracked).
#
# Usage (in your home-manager config):
#   imports = [ /path/to/design/nix/home-manager-module.nix ];
#   jylhis.theme = { enable = true; mode = "dark"; };

{
  config,
  lib,
  pkgs,
  ...
}:

let
  cfg = config.jylhis.theme;
  themes = pkgs.callPackage ./themes.nix { };
  variant = "${cfg.mode}";

  # fzf colours come from the generated shell/fzf-<mode>.sh instead of
  # being inlined here — the file is `--color=…` after FZF_DEFAULT_OPTS.
  # Read from the themes derivation: the generated outputs are untracked,
  # so the old source-tree readFile would break in a clean checkout.
  fzfColor =
    let
      m = builtins.match ''.*--color=([^"]*)".*'' (
        builtins.readFile "${themes}/share/jylhis/shell/fzf-${variant}.sh"
      );
    in
    if m == null then "" else builtins.head m;
in
{
  options.jylhis.theme = {
    enable = lib.mkEnableOption "Jylhis design system theme";

    name = lib.mkOption {
      type = lib.types.enum [ "jylhis" ];
      default = "jylhis";
      description = "Theme slug. Single-theme system; kept for config compat.";
    };

    mode = lib.mkOption {
      type = lib.types.enum [
        "light"
        "dark"
      ];
      default = "dark";
      description = "Mode: light or dark. Both are first-class.";
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
    # Ghostty themes (both modes installed; active set in config)
    xdg.configFile = lib.mkMerge [
      (lib.mkIf cfg.ghostty.enable {
        "ghostty/themes/jylhis-light".source = "${themes}/share/jylhis/ghostty/jylhis-light";
        "ghostty/themes/jylhis-dark".source = "${themes}/share/jylhis/ghostty/jylhis-dark";
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
        "bat/themes/jylhis-light.tmTheme".source = "${themes}/share/jylhis/bat/jylhis-light.tmTheme";
        "bat/themes/jylhis-dark.tmTheme".source = "${themes}/share/jylhis/bat/jylhis-dark.tmTheme";
      })
    ];

    # GTK overrides — per-mode polarity (jylhis-<mode>.css). GTK3 cannot
    # parse custom properties and GTK4 user CSS loads after the theme, so
    # polarity is chosen by installing the matching generated file, not by
    # a runtime .dark block. Read from the themes derivation (generated
    # outputs are untracked).
    gtk = lib.mkIf cfg.gtk.enable {
      gtk3.extraCss = builtins.readFile "${themes}/share/jylhis/gtk/jylhis-${variant}.css";
      gtk4.extraCss = builtins.readFile "${themes}/share/jylhis/gtk/jylhis-${variant}.css";
    };

    # fzf colours via session variables.
    # mkForce: importing this HM module is an explicit ask for jylhis colours —
    # win over Stylix's `programs.fzf` target, which writes the same var.
    home.sessionVariables = lib.mkIf cfg.fzf.enable {
      FZF_DEFAULT_OPTS = lib.mkForce "--color=${fzfColor}";
    };
  };
}
