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
# The four theme variants (survey/mono × light/dark) are enumerated from the
# cartesian product below; irregular naming (kvantum Pascal case, gtk/shadcn
# per-theme, survey-only adobe/hyperos) is listed explicitly. Imported with
# `import ./install-map.nix` (no args), so only builtins are used here.

let
  themes  = [ "survey" "mono" ];
  modes   = [ "light" "dark" ];
  variants = builtins.concatMap (t: map (m: "${t}-${m}") modes) themes;

  # Entries for the plain `platforms/<dir>/jylhis-<slug><suffix>` targets that
  # generate one file per variant (ghostty, rofi, gimp, base16, console, bat).
  jylhisVariant = { dir, suffix }:
    map (v: {
      src = "platforms/${dir}/jylhis-${v}${suffix}";
      dest = "share/jylhis/${dir}/jylhis-${v}${suffix}";
    }) variants;
in
{
  # Shared root files. Always included regardless of target.
  tokens = [
    { src = "tokens.css";           dest = "share/jylhis/tokens.css"; }
    { src = "colors_and_type.css";  dest = "share/jylhis/colors_and_type.css"; }
    { src = "tokens.core.json";     dest = "share/jylhis/tokens.core.json"; }
    { src = "themes/survey.json";   dest = "share/jylhis/themes/survey.json"; }
    { src = "themes/mono.json";     dest = "share/jylhis/themes/mono.json"; }
  ];

  ghostty  = jylhisVariant { dir = "ghostty";  suffix = ""; };
  rofi     = jylhisVariant { dir = "rofi";     suffix = ".rasi"; };
  gimp     = jylhisVariant { dir = "gimp";     suffix = ".gpl"; };
  base16   = jylhisVariant { dir = "base16";   suffix = ".yaml"; };
  console  = jylhisVariant { dir = "console";  suffix = ".nix"; };
  bat      = jylhisVariant { dir = "bat";      suffix = ".tmTheme"; };

  hyprland = (jylhisVariant { dir = "hyprland"; suffix = ".conf"; }) ++ [
    { src = "platforms/hyprland/jylhis.conf"; dest = "share/jylhis/hyprland/jylhis.conf"; }
  ];

  emacs = (map (v: {
    src = "platforms/emacs/jylhis-${v}-theme.el";
    dest = "share/jylhis/emacs/jylhis-${v}-theme.el";
  }) variants) ++ [
    { src = "platforms/emacs/jylhis-themes.el";       dest = "share/jylhis/emacs/jylhis-themes.el"; }
    { src = "platforms/emacs/jylhis-theme-toggle.el"; dest = "share/jylhis/emacs/jylhis-theme-toggle.el"; }
  ];

  # Kvantum uses PascalCase (Jylhis<Theme><Mode>.colors) — enumerated by hand.
  kvantum = [
    { src = "platforms/kvantum/JylhisSurveyLight.colors"; dest = "share/jylhis/kvantum/JylhisSurveyLight.colors"; }
    { src = "platforms/kvantum/JylhisSurveyDark.colors";  dest = "share/jylhis/kvantum/JylhisSurveyDark.colors"; }
    { src = "platforms/kvantum/JylhisMonoLight.colors";   dest = "share/jylhis/kvantum/JylhisMonoLight.colors"; }
    { src = "platforms/kvantum/JylhisMonoDark.colors";    dest = "share/jylhis/kvantum/JylhisMonoDark.colors"; }
  ];

  mako = (map (v: {
    src = "platforms/mako/config-${v}"; dest = "share/jylhis/mako/config-${v}";
  }) variants) ++ [
    { src = "platforms/mako/config"; dest = "share/jylhis/mako/config"; }
  ];

  waybar = (map (v: {
    src = "platforms/waybar/style-${v}.css"; dest = "share/jylhis/waybar/style-${v}.css";
  }) variants) ++ [
    { src = "platforms/waybar/style.css"; dest = "share/jylhis/waybar/style.css"; }
  ];

  shell = (map (v: {
    src = "platforms/shell/fzf-${v}.sh"; dest = "share/jylhis/shell/fzf-${v}.sh";
  }) variants) ++ [
    { src = "platforms/shell/starship.toml"; dest = "share/jylhis/shell/starship.toml"; }
  ];

  plymouth = builtins.concatMap (v: [
    { src = "platforms/plymouth/jylhis-${v}/jylhis.plymouth"; dest = "share/jylhis/plymouth/jylhis-${v}/jylhis.plymouth"; }
    { src = "platforms/plymouth/jylhis-${v}/jylhis.script";   dest = "share/jylhis/plymouth/jylhis-${v}/jylhis.script"; }
  ]) variants;

  # gtk / shadcn are per-theme (not per-mode) plus a shared base.
  gtk = [
    { src = "platforms/gtk/gtk.css";           dest = "share/jylhis/gtk/gtk.css"; }
    { src = "platforms/gtk/jylhis-survey.css"; dest = "share/jylhis/gtk/jylhis-survey.css"; }
    { src = "platforms/gtk/jylhis-mono.css";   dest = "share/jylhis/gtk/jylhis-mono.css"; }
  ];

  shadcn = [
    { src = "platforms/shadcn/tokens.css";        dest = "share/jylhis/shadcn/tokens.css"; }
    { src = "platforms/shadcn/jylhis-survey.css"; dest = "share/jylhis/shadcn/jylhis-survey.css"; }
    { src = "platforms/shadcn/jylhis-mono.css";   dest = "share/jylhis/shadcn/jylhis-mono.css"; }
  ];

  # adobe / hyperos ship Survey only (binary, not themed).
  adobe = [
    { src = "platforms/adobe/jylhis-survey-light.ase"; dest = "share/jylhis/adobe/jylhis-survey-light.ase"; }
    { src = "platforms/adobe/jylhis-survey-dark.ase";  dest = "share/jylhis/adobe/jylhis-survey-dark.ase"; }
  ];

  hyperos = [
    { src = "platforms/hyperos/jylhis-survey-light.mtz"; dest = "share/jylhis/hyperos/jylhis-survey-light.mtz"; }
    { src = "platforms/hyperos/jylhis-survey-dark.mtz";  dest = "share/jylhis/hyperos/jylhis-survey-dark.mtz"; }
  ];

  scripts = [
    { src = "platforms/scripts/jylhis-theme-toggle.sh";
      dest = "share/jylhis/scripts/jylhis-theme-toggle.sh";
      mode = "0755";
    }
  ];
}
