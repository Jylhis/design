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
  ];

  emacs = [
    { src = "platforms/emacs/jylhis-theme-core.el";      dest = "share/jylhis/emacs/jylhis-theme-core.el"; }
    { src = "platforms/emacs/jylhis-sheet-palette.el";   dest = "share/jylhis/emacs/jylhis-sheet-palette.el"; }
    { src = "platforms/emacs/jylhis-field-palette.el";   dest = "share/jylhis/emacs/jylhis-field-palette.el"; }
    { src = "platforms/emacs/jylhis-sheet-theme.el";     dest = "share/jylhis/emacs/jylhis-sheet-theme.el"; }
    { src = "platforms/emacs/jylhis-field-theme.el";     dest = "share/jylhis/emacs/jylhis-field-theme.el"; }
    { src = "platforms/emacs/jylhis-themes.el";          dest = "share/jylhis/emacs/jylhis-themes.el"; }
    { src = "platforms/emacs/jylhis-theme-toggle.el";    dest = "share/jylhis/emacs/jylhis-theme-toggle.el"; }
  ];

  hyprland = [
    { src = "platforms/hyprland/jylhis-sheet.conf"; dest = "share/jylhis/hyprland/jylhis-sheet.conf"; }
    { src = "platforms/hyprland/jylhis-field.conf"; dest = "share/jylhis/hyprland/jylhis-field.conf"; }
    { src = "platforms/hyprland/jylhis.conf";       dest = "share/jylhis/hyprland/jylhis.conf"; }
  ];

  hyprlock = [
    { src = "platforms/hyprlock/jylhis-sheet.conf"; dest = "share/jylhis/hyprlock/jylhis-sheet.conf"; }
    { src = "platforms/hyprlock/jylhis-field.conf"; dest = "share/jylhis/hyprlock/jylhis-field.conf"; }
  ];

  rofi = [
    { src = "platforms/rofi/jylhis-sheet.rasi"; dest = "share/jylhis/rofi/jylhis-sheet.rasi"; }
    { src = "platforms/rofi/jylhis-field.rasi"; dest = "share/jylhis/rofi/jylhis-field.rasi"; }
  ];

  gtk = [
    { src = "platforms/gtk/gtk.css"; dest = "share/jylhis/gtk/gtk.css"; }
  ];

  waybar = [
    { src = "platforms/waybar/style.css";       dest = "share/jylhis/waybar/style.css"; }
    { src = "platforms/waybar/style-sheet.css"; dest = "share/jylhis/waybar/style-sheet.css"; }
  ];

  mako = [
    { src = "platforms/mako/config";       dest = "share/jylhis/mako/config"; }
    { src = "platforms/mako/config-sheet"; dest = "share/jylhis/mako/config-sheet"; }
  ];

  hyperos = [
    { src = "platforms/hyperos/jylhis-sheet.mtz"; dest = "share/jylhis/hyperos/jylhis-sheet.mtz"; }
    { src = "platforms/hyperos/jylhis-field.mtz"; dest = "share/jylhis/hyperos/jylhis-field.mtz"; }
  ];

  kvantum = [
    { src = "platforms/kvantum/JylhisSheet.colors"; dest = "share/jylhis/kvantum/JylhisSheet.colors"; }
    { src = "platforms/kvantum/JylhisField.colors"; dest = "share/jylhis/kvantum/JylhisField.colors"; }
  ];

  base16 = [
    { src = "platforms/base16/jylhis-sheet.yaml"; dest = "share/jylhis/base16/jylhis-sheet.yaml"; }
    { src = "platforms/base16/jylhis-field.yaml"; dest = "share/jylhis/base16/jylhis-field.yaml"; }
  ];

  shell = [
    { src = "platforms/shell/fzf-sheet.sh";   dest = "share/jylhis/shell/fzf-sheet.sh"; }
    { src = "platforms/shell/fzf-field.sh";   dest = "share/jylhis/shell/fzf-field.sh"; }
    { src = "platforms/shell/starship.toml";  dest = "share/jylhis/shell/starship.toml"; }
  ];

  bat = [
    { src = "platforms/bat/jylhis-sheet.tmTheme"; dest = "share/jylhis/bat/jylhis-sheet.tmTheme"; }
    { src = "platforms/bat/jylhis-field.tmTheme"; dest = "share/jylhis/bat/jylhis-field.tmTheme"; }
  ];

  glamour = [
    { src = "platforms/glamour/jylhis-sheet.json"; dest = "share/jylhis/glamour/jylhis-sheet.json"; }
    { src = "platforms/glamour/jylhis-field.json"; dest = "share/jylhis/glamour/jylhis-field.json"; }
    { src = "platforms/glamour/jylhis-notty.json"; dest = "share/jylhis/glamour/jylhis-notty.json"; }
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
  ];
}
