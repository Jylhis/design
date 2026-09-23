# Jylhis design system — install map.
#
# Single source of truth for "which files belong to which target,
# and where do they land under $out/share/jylhis/".
#
# Consumed by:
#   - nix/themes-per-target.nix (filters by target name)
#   - nix/themes.nix             (concatenates every target)
#
# Each target is a list of { src, dest, mode? } records.
#   src   — path relative to the design repo root
#   dest  — path relative to $out
#   mode  — octal string (default "0644"); use "0755" for executables
#
# Single theme, two modes: `variants` enumerates light/dark, and generated
# file names carry the mode only (jylhis-light, jylhis-dark — no theme
# segment). Irregular naming (kvantum Pascal case, gtk/mako/waybar legacy
# copies, hand-maintained shadcn) is listed explicitly. Imported with
# `import ./install-map.nix` (no args), so only builtins are used here.
let
  modes = [
    "light"
    "dark"
  ];
  variants = map (m: "${m}") modes;

  # Entries for the plain `platforms/<dir>/jylhis-<variant><suffix>` targets
  # that generate one file per mode (ghostty, rofi, gimp, base16, console,
  # bat).
  jylhisVariant =
    { dir, suffix }:
    map (v: {
      src = "platforms/${dir}/jylhis-${v}${suffix}";
      dest = "share/jylhis/${dir}/jylhis-${v}${suffix}";
    }) variants;
in
{
  # Shared root files. Always included regardless of target.
  tokens = [
    {
      src = "tokens.css";
      dest = "share/jylhis/tokens.css";
    }
    {
      src = "colors_and_type.css";
      dest = "share/jylhis/colors_and_type.css";
    }
    {
      src = "tokens.core.json";
      dest = "share/jylhis/tokens.core.json";
    }
    {
      src = "themes/jylhis.json";
      dest = "share/jylhis/themes/jylhis.json";
    }
  ];

  ghostty = jylhisVariant {
    dir = "ghostty";
    suffix = "";
  };
  rofi = jylhisVariant {
    dir = "rofi";
    suffix = ".rasi";
  };
  gimp = jylhisVariant {
    dir = "gimp";
    suffix = ".gpl";
  };
  base16 = jylhisVariant {
    dir = "base16";
    suffix = ".yaml";
  };
  console = jylhisVariant {
    dir = "console";
    suffix = ".nix";
  };
  bat = jylhisVariant {
    dir = "bat";
    suffix = ".tmTheme";
  };

  hyprland =
    (jylhisVariant {
      dir = "hyprland";
      suffix = ".conf";
    })
    ++ [
      {
        src = "platforms/hyprland/jylhis.conf";
        dest = "share/jylhis/hyprland/jylhis.conf";
      }
    ];

  emacs =
    (map (v: {
      src = "platforms/emacs/jylhis-${v}-theme.el";
      dest = "share/jylhis/emacs/jylhis-${v}-theme.el";
    }) variants)
    ++ [
      {
        src = "platforms/emacs/jylhis-themes.el";
        dest = "share/jylhis/emacs/jylhis-themes.el";
      }
      {
        src = "platforms/emacs/jylhis-theme-toggle.el";
        dest = "share/jylhis/emacs/jylhis-theme-toggle.el";
      }
    ];

  # Kvantum uses PascalCase (Jylhis<Mode>.colors) — two files, enumerated by
  # hand.
  kvantum = [
    {
      src = "platforms/kvantum/JylhisLight.colors";
      dest = "share/jylhis/kvantum/JylhisLight.colors";
    }
    {
      src = "platforms/kvantum/JylhisDark.colors";
      dest = "share/jylhis/kvantum/JylhisDark.colors";
    }
  ];

  # config-light/config-dark are generated; config stays as the generated
  # light-mode copy for name-hardcoding consumers.
  mako =
    (map (v: {
      src = "platforms/mako/config-${v}";
      dest = "share/jylhis/mako/config-${v}";
    }) variants)
    ++ [
      {
        src = "platforms/mako/config";
        dest = "share/jylhis/mako/config";
      }
    ];

  # style-light/style-dark.css are generated; style.css stays as the
  # generated light-mode copy for name-hardcoding consumers.
  waybar =
    (map (v: {
      src = "platforms/waybar/style-${v}.css";
      dest = "share/jylhis/waybar/style-${v}.css";
    }) variants)
    ++ [
      {
        src = "platforms/waybar/style.css";
        dest = "share/jylhis/waybar/style.css";
      }
    ];

  # fzf-light.sh/fzf-dark.sh are generated; starship.toml is hand-authored
  # (ANSI-name based, theme-agnostic).
  shell =
    (map (v: {
      src = "platforms/shell/fzf-${v}.sh";
      dest = "share/jylhis/shell/fzf-${v}.sh";
    }) variants)
    ++ [
      {
        src = "platforms/shell/starship.toml";
        dest = "share/jylhis/shell/starship.toml";
      }
    ];

  # plymouth emits whole per-mode directories (tracked, hand-tuned).
  plymouth = builtins.concatMap (v: [
    {
      src = "platforms/plymouth/jylhis-${v}/jylhis.plymouth";
      dest = "share/jylhis/plymouth/jylhis-${v}/jylhis.plymouth";
    }
    {
      src = "platforms/plymouth/jylhis-${v}/jylhis.script";
      dest = "share/jylhis/plymouth/jylhis-${v}/jylhis.script";
    }
  ]) variants;

  # jylhis-light/jylhis-dark.css are generated; gtk.css stays as the
  # generated light-mode copy for name-hardcoding consumers.
  gtk =
    (jylhisVariant {
      dir = "gtk";
      suffix = ".css";
    })
    ++ [
      {
        src = "platforms/gtk/gtk.css";
        dest = "share/jylhis/gtk/gtk.css";
      }
    ];

  # Hand-maintained shadcn/ui token file (single file, no variants).
  shadcn = [
    {
      src = "platforms/shadcn/tokens.css";
      dest = "share/jylhis/shadcn/tokens.css";
    }
  ];

  # Binary, hand-tuned (not generated) — one per mode.
  adobe = [
    {
      src = "platforms/adobe/jylhis-light.ase";
      dest = "share/jylhis/adobe/jylhis-light.ase";
    }
    {
      src = "platforms/adobe/jylhis-dark.ase";
      dest = "share/jylhis/adobe/jylhis-dark.ase";
    }
  ];

  hyperos = [
    {
      src = "platforms/hyperos/jylhis-light.mtz";
      dest = "share/jylhis/hyperos/jylhis-light.mtz";
    }
    {
      src = "platforms/hyperos/jylhis-dark.mtz";
      dest = "share/jylhis/hyperos/jylhis-dark.mtz";
    }
  ];

  scripts = [
    {
      src = "platforms/scripts/jylhis-theme-toggle.sh";
      dest = "share/jylhis/scripts/jylhis-theme-toggle.sh";
      mode = "0755";
    }
  ];
}
