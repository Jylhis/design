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

{
  # Shared root files. Always included regardless of target.
  tokens = [
    { src = "tokens.css";           dest = "share/jylhis/tokens.css"; }
    { src = "colors_and_type.css";  dest = "share/jylhis/colors_and_type.css"; }
    { src = "tokens.json";          dest = "share/jylhis/tokens.json"; }
  ];

  # Tailwind / shadcn bridge — the palette as bare HSL triplets under the
  # shadcn semantic names. Self-contained; see docs/INTEGRATION.md.
  shadcn = [
    { src = "platforms/shadcn/tokens.css"; dest = "share/jylhis/shadcn/tokens.css"; }
  ];

  ghostty = [
    { src = "platforms/ghostty/jylhis-sheet"; dest = "share/jylhis/ghostty/jylhis-sheet"; }
    { src = "platforms/ghostty/jylhis-field"; dest = "share/jylhis/ghostty/jylhis-field"; }
    { src = "platforms/ghostty/jylhis-chalk"; dest = "share/jylhis/ghostty/jylhis-chalk"; }
    { src = "platforms/ghostty/jylhis-graphite"; dest = "share/jylhis/ghostty/jylhis-graphite"; }
  ];

  emacs = [
    { src = "platforms/emacs/jylhis-theme-core.el";      dest = "share/jylhis/emacs/jylhis-theme-core.el"; }
    { src = "platforms/emacs/jylhis-sheet-palette.el";   dest = "share/jylhis/emacs/jylhis-sheet-palette.el"; }
    { src = "platforms/emacs/jylhis-field-palette.el";   dest = "share/jylhis/emacs/jylhis-field-palette.el"; }
    { src = "platforms/emacs/jylhis-chalk-palette.el";   dest = "share/jylhis/emacs/jylhis-chalk-palette.el"; }
    { src = "platforms/emacs/jylhis-graphite-palette.el"; dest = "share/jylhis/emacs/jylhis-graphite-palette.el"; }
    { src = "platforms/emacs/jylhis-sheet-theme.el";     dest = "share/jylhis/emacs/jylhis-sheet-theme.el"; }
    { src = "platforms/emacs/jylhis-field-theme.el";     dest = "share/jylhis/emacs/jylhis-field-theme.el"; }
    { src = "platforms/emacs/jylhis-chalk-theme.el";     dest = "share/jylhis/emacs/jylhis-chalk-theme.el"; }
    { src = "platforms/emacs/jylhis-graphite-theme.el";  dest = "share/jylhis/emacs/jylhis-graphite-theme.el"; }
    { src = "platforms/emacs/jylhis-themes.el";          dest = "share/jylhis/emacs/jylhis-themes.el"; }
    { src = "platforms/emacs/jylhis-theme-toggle.el";    dest = "share/jylhis/emacs/jylhis-theme-toggle.el"; }
  ];

  hyprland = [
    { src = "platforms/hyprland/jylhis-sheet.conf"; dest = "share/jylhis/hyprland/jylhis-sheet.conf"; }
    { src = "platforms/hyprland/jylhis-field.conf"; dest = "share/jylhis/hyprland/jylhis-field.conf"; }
    { src = "platforms/hyprland/jylhis-chalk.conf"; dest = "share/jylhis/hyprland/jylhis-chalk.conf"; }
    { src = "platforms/hyprland/jylhis-graphite.conf"; dest = "share/jylhis/hyprland/jylhis-graphite.conf"; }
    { src = "platforms/hyprland/jylhis.conf";       dest = "share/jylhis/hyprland/jylhis.conf"; }
  ];

  hyprlock = [
    { src = "platforms/hyprlock/jylhis-sheet.conf"; dest = "share/jylhis/hyprlock/jylhis-sheet.conf"; }
    { src = "platforms/hyprlock/jylhis-field.conf"; dest = "share/jylhis/hyprlock/jylhis-field.conf"; }
    { src = "platforms/hyprlock/jylhis-chalk.conf"; dest = "share/jylhis/hyprlock/jylhis-chalk.conf"; }
    { src = "platforms/hyprlock/jylhis-graphite.conf"; dest = "share/jylhis/hyprlock/jylhis-graphite.conf"; }
  ];

  rofi = [
    { src = "platforms/rofi/jylhis-sheet.rasi"; dest = "share/jylhis/rofi/jylhis-sheet.rasi"; }
    { src = "platforms/rofi/jylhis-field.rasi"; dest = "share/jylhis/rofi/jylhis-field.rasi"; }
    { src = "platforms/rofi/jylhis-chalk.rasi"; dest = "share/jylhis/rofi/jylhis-chalk.rasi"; }
    { src = "platforms/rofi/jylhis-graphite.rasi"; dest = "share/jylhis/rofi/jylhis-graphite.rasi"; }
  ];

  gtk = [
    { src = "platforms/gtk/gtk.css"; dest = "share/jylhis/gtk/gtk.css"; }
  ];

  waybar = [
    { src = "platforms/waybar/style.css";          dest = "share/jylhis/waybar/style.css"; }
    { src = "platforms/waybar/style-sheet.css";    dest = "share/jylhis/waybar/style-sheet.css"; }
    { src = "platforms/waybar/style-chalk.css";    dest = "share/jylhis/waybar/style-chalk.css"; }
    { src = "platforms/waybar/style-graphite.css"; dest = "share/jylhis/waybar/style-graphite.css"; }
  ];

  mako = [
    { src = "platforms/mako/config";          dest = "share/jylhis/mako/config"; }
    { src = "platforms/mako/config-sheet";    dest = "share/jylhis/mako/config-sheet"; }
    { src = "platforms/mako/config-chalk";    dest = "share/jylhis/mako/config-chalk"; }
    { src = "platforms/mako/config-graphite"; dest = "share/jylhis/mako/config-graphite"; }
  ];

  hyperos = [
    { src = "platforms/hyperos/jylhis-sheet.mtz"; dest = "share/jylhis/hyperos/jylhis-sheet.mtz"; }
    { src = "platforms/hyperos/jylhis-field.mtz"; dest = "share/jylhis/hyperos/jylhis-field.mtz"; }
    { src = "platforms/hyperos/jylhis-chalk.mtz"; dest = "share/jylhis/hyperos/jylhis-chalk.mtz"; }
    { src = "platforms/hyperos/jylhis-graphite.mtz"; dest = "share/jylhis/hyperos/jylhis-graphite.mtz"; }
  ];

  kvantum = [
    { src = "platforms/kvantum/JylhisSheet.colors";    dest = "share/jylhis/kvantum/JylhisSheet.colors"; }
    { src = "platforms/kvantum/JylhisField.colors";    dest = "share/jylhis/kvantum/JylhisField.colors"; }
    { src = "platforms/kvantum/JylhisChalk.colors";    dest = "share/jylhis/kvantum/JylhisChalk.colors"; }
    { src = "platforms/kvantum/JylhisGraphite.colors"; dest = "share/jylhis/kvantum/JylhisGraphite.colors"; }
  ];

  base16 = [
    { src = "platforms/base16/jylhis-sheet.yaml"; dest = "share/jylhis/base16/jylhis-sheet.yaml"; }
    { src = "platforms/base16/jylhis-field.yaml"; dest = "share/jylhis/base16/jylhis-field.yaml"; }
    { src = "platforms/base16/jylhis-chalk.yaml"; dest = "share/jylhis/base16/jylhis-chalk.yaml"; }
    { src = "platforms/base16/jylhis-graphite.yaml"; dest = "share/jylhis/base16/jylhis-graphite.yaml"; }
  ];

  shell = [
    { src = "platforms/shell/fzf-sheet.sh";    dest = "share/jylhis/shell/fzf-sheet.sh"; }
    { src = "platforms/shell/fzf-field.sh";    dest = "share/jylhis/shell/fzf-field.sh"; }
    { src = "platforms/shell/fzf-chalk.sh";    dest = "share/jylhis/shell/fzf-chalk.sh"; }
    { src = "platforms/shell/fzf-graphite.sh"; dest = "share/jylhis/shell/fzf-graphite.sh"; }
    { src = "platforms/shell/starship.toml";   dest = "share/jylhis/shell/starship.toml"; }
  ];

  bat = [
    { src = "platforms/bat/jylhis-sheet.tmTheme"; dest = "share/jylhis/bat/jylhis-sheet.tmTheme"; }
    { src = "platforms/bat/jylhis-field.tmTheme"; dest = "share/jylhis/bat/jylhis-field.tmTheme"; }
    { src = "platforms/bat/jylhis-chalk.tmTheme"; dest = "share/jylhis/bat/jylhis-chalk.tmTheme"; }
    { src = "platforms/bat/jylhis-graphite.tmTheme"; dest = "share/jylhis/bat/jylhis-graphite.tmTheme"; }
  ];

  glamour = [
    { src = "platforms/glamour/jylhis-sheet.json";    dest = "share/jylhis/glamour/jylhis-sheet.json"; }
    { src = "platforms/glamour/jylhis-field.json";    dest = "share/jylhis/glamour/jylhis-field.json"; }
    { src = "platforms/glamour/jylhis-chalk.json";    dest = "share/jylhis/glamour/jylhis-chalk.json"; }
    { src = "platforms/glamour/jylhis-graphite.json"; dest = "share/jylhis/glamour/jylhis-graphite.json"; }
    { src = "platforms/glamour/jylhis-notty.json";    dest = "share/jylhis/glamour/jylhis-notty.json"; }
  ];

  scripts = [
    { src = "platforms/scripts/jylhis-theme-toggle.sh";
      dest = "share/jylhis/scripts/jylhis-theme-toggle.sh";
      mode = "0755";
    }
  ];

  console = [
    { src = "platforms/console/jylhis-sheet.nix"; dest = "share/jylhis/console/jylhis-sheet.nix"; }
    { src = "platforms/console/jylhis-field.nix"; dest = "share/jylhis/console/jylhis-field.nix"; }
    { src = "platforms/console/jylhis-chalk.nix"; dest = "share/jylhis/console/jylhis-chalk.nix"; }
    { src = "platforms/console/jylhis-graphite.nix"; dest = "share/jylhis/console/jylhis-graphite.nix"; }
  ];

  plymouth = [
    { src = "platforms/plymouth/jylhis-sheet/jylhis.plymouth";
      dest = "share/jylhis/plymouth/jylhis-sheet/jylhis.plymouth"; }
    { src = "platforms/plymouth/jylhis-sheet/jylhis.script";
      dest = "share/jylhis/plymouth/jylhis-sheet/jylhis.script"; }
    { src = "platforms/plymouth/jylhis-field/jylhis.plymouth";
      dest = "share/jylhis/plymouth/jylhis-field/jylhis.plymouth"; }
    { src = "platforms/plymouth/jylhis-field/jylhis.script";
      dest = "share/jylhis/plymouth/jylhis-field/jylhis.script"; }
    { src = "platforms/plymouth/jylhis-chalk/jylhis.plymouth";
      dest = "share/jylhis/plymouth/jylhis-chalk/jylhis.plymouth"; }
    { src = "platforms/plymouth/jylhis-chalk/jylhis.script";
      dest = "share/jylhis/plymouth/jylhis-chalk/jylhis.script"; }
    { src = "platforms/plymouth/jylhis-graphite/jylhis.plymouth";
      dest = "share/jylhis/plymouth/jylhis-graphite/jylhis.plymouth"; }
    { src = "platforms/plymouth/jylhis-graphite/jylhis.script";
      dest = "share/jylhis/plymouth/jylhis-graphite/jylhis.script"; }
  ];
}
