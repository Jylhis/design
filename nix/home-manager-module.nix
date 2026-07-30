# Jylhis design system — Home Manager module.
#
# Applies the full Jylhis theme to supported applications based on a
# single variant option. Source of truth: nix/themes.nix package.
#
# Usage (in your home-manager config):
#   imports = [ /path/to/design/nix/home-manager-module.nix ];
#   jylhis.theme = { enable = true; variant = "field"; };
#
# Or with callPackage if you need to pass the themes package:
#   imports = [ (import /path/to/design/nix/home-manager-module.nix { inherit jylhis-themes; }) ];

{ config, lib, pkgs, ... }:

let
  cfg = config.jylhis.theme;
  themes = pkgs.callPackage ./themes.nix {};
  variant = cfg.variant;
  otherVariant = if variant == "field" then "sheet" else "field";

  # fzf colors are GENERATED into platforms/shell/fzf-{sheet,field}.sh from
  # tokens.json (see `generateFzf` in scripts/generate.mjs). Read the value back
  # out rather than restating hexes here — this module must never carry its own
  # copy of the palette.
  fzfColors =
    let
      file = builtins.readFile "${themes}/share/jylhis/shell/fzf-${variant}.sh";
      m = builtins.match "(.|\n)*--color=([^\"]*)\"(.|\n)*" file;
    in
      if m == null
      then throw "jylhis: could not read --color= out of fzf-${variant}.sh"
      else builtins.elemAt m 1;
in
{
  options.jylhis.theme = {
    enable = lib.mkEnableOption "Jylhis design system theme";

    variant = lib.mkOption {
      type = lib.types.enum [ "sheet" "field" ];
      default = "field";
      description = "Theme variant: sheet (light) or field (dark).";
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
        "ghostty/themes/jylhis-sheet".source = "${themes}/share/jylhis/ghostty/jylhis-sheet";
        "ghostty/themes/jylhis-field".source = "${themes}/share/jylhis/ghostty/jylhis-field";
      })

      # Mako
      (lib.mkIf cfg.mako.enable {
        "mako/config".source =
          if variant == "field"
          then "${themes}/share/jylhis/mako/config"
          else "${themes}/share/jylhis/mako/config-sheet";
      })

      # Waybar
      (lib.mkIf cfg.waybar.enable {
        "waybar/style.css".source =
          if variant == "field"
          then "${themes}/share/jylhis/waybar/style.css"
          else "${themes}/share/jylhis/waybar/style-sheet.css";
      })

      # Starship
      (lib.mkIf cfg.starship.enable {
        "starship.toml".source = "${themes}/share/jylhis/shell/starship.toml";
      })

      # bat
      (lib.mkIf cfg.bat.enable {
        "bat/themes/jylhis-sheet.tmTheme".source = "${themes}/share/jylhis/bat/jylhis-sheet.tmTheme";
        "bat/themes/jylhis-field.tmTheme".source = "${themes}/share/jylhis/bat/jylhis-field.tmTheme";
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
      FZF_DEFAULT_OPTS = lib.mkForce "--color=${fzfColors}";
    };
  };
}
