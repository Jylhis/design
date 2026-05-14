# Jylhis design system — install map.
#
# Single source of truth for "which files belong to which target,
# and where do they land under $out/share/jylhis/".
#
# Consumed by:
#   - nix/themes-per-target.nix (filters by target name)
#   - eventually nix/themes.nix (currently still uses inline cp lines)
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

  ghostty = [
    { src = "platforms/ghostty/jylhis-paper"; dest = "share/jylhis/ghostty/jylhis-paper"; }
    { src = "platforms/ghostty/jylhis-roast"; dest = "share/jylhis/ghostty/jylhis-roast"; }
  ];

  emacs = [
    { src = "platforms/emacs/jylhis-paper-theme.el";  dest = "share/jylhis/emacs/jylhis-paper-theme.el"; }
    { src = "platforms/emacs/jylhis-roast-theme.el";  dest = "share/jylhis/emacs/jylhis-roast-theme.el"; }
    { src = "platforms/emacs/jylhis-theme-toggle.el"; dest = "share/jylhis/emacs/jylhis-theme-toggle.el"; }
  ];

  hyprland = [
    { src = "platforms/hyprland/jylhis-paper.conf"; dest = "share/jylhis/hyprland/jylhis-paper.conf"; }
    { src = "platforms/hyprland/jylhis-roast.conf"; dest = "share/jylhis/hyprland/jylhis-roast.conf"; }
    { src = "platforms/hyprland/jylhis.conf";       dest = "share/jylhis/hyprland/jylhis.conf"; }
  ];

  rofi = [
    { src = "platforms/rofi/jylhis-paper.rasi"; dest = "share/jylhis/rofi/jylhis-paper.rasi"; }
    { src = "platforms/rofi/jylhis-roast.rasi"; dest = "share/jylhis/rofi/jylhis-roast.rasi"; }
  ];

  gtk = [
    { src = "platforms/gtk/gtk.css"; dest = "share/jylhis/gtk/gtk.css"; }
  ];

  waybar = [
    { src = "platforms/waybar/style.css";       dest = "share/jylhis/waybar/style.css"; }
    { src = "platforms/waybar/style-paper.css"; dest = "share/jylhis/waybar/style-paper.css"; }
  ];

  mako = [
    { src = "platforms/mako/config";       dest = "share/jylhis/mako/config"; }
    { src = "platforms/mako/config-paper"; dest = "share/jylhis/mako/config-paper"; }
  ];

  hyperos = [
    { src = "platforms/hyperos/jylhis-paper.mtz"; dest = "share/jylhis/hyperos/jylhis-paper.mtz"; }
    { src = "platforms/hyperos/jylhis-roast.mtz"; dest = "share/jylhis/hyperos/jylhis-roast.mtz"; }
  ];

  kvantum = [
    { src = "platforms/kvantum/JylhisPaper.colors"; dest = "share/jylhis/kvantum/JylhisPaper.colors"; }
    { src = "platforms/kvantum/JylhisRoast.colors"; dest = "share/jylhis/kvantum/JylhisRoast.colors"; }
  ];

  base16 = [
    { src = "platforms/base16/jylhis-paper.yaml"; dest = "share/jylhis/base16/jylhis-paper.yaml"; }
    { src = "platforms/base16/jylhis-roast.yaml"; dest = "share/jylhis/base16/jylhis-roast.yaml"; }
  ];

  shell = [
    { src = "platforms/shell/fzf-paper.sh";   dest = "share/jylhis/shell/fzf-paper.sh"; }
    { src = "platforms/shell/fzf-roast.sh";   dest = "share/jylhis/shell/fzf-roast.sh"; }
    { src = "platforms/shell/starship.toml";  dest = "share/jylhis/shell/starship.toml"; }
  ];

  bat = [
    { src = "platforms/bat/jylhis-paper.tmTheme"; dest = "share/jylhis/bat/jylhis-paper.tmTheme"; }
    { src = "platforms/bat/jylhis-roast.tmTheme"; dest = "share/jylhis/bat/jylhis-roast.tmTheme"; }
  ];

  scripts = [
    { src = "platforms/scripts/jylhis-theme-toggle.sh";
      dest = "share/jylhis/scripts/jylhis-theme-toggle.sh";
      mode = "0755";
    }
  ];

  console = [
    { src = "platforms/console/jylhis-paper.nix"; dest = "share/jylhis/console/jylhis-paper.nix"; }
    { src = "platforms/console/jylhis-roast.nix"; dest = "share/jylhis/console/jylhis-roast.nix"; }
  ];

  plymouth = [
    { src = "platforms/plymouth/jylhis-paper/jylhis.plymouth";
      dest = "share/jylhis/plymouth/jylhis-paper/jylhis.plymouth"; }
    { src = "platforms/plymouth/jylhis-paper/jylhis.script";
      dest = "share/jylhis/plymouth/jylhis-paper/jylhis.script"; }
    { src = "platforms/plymouth/jylhis-roast/jylhis.plymouth";
      dest = "share/jylhis/plymouth/jylhis-roast/jylhis.plymouth"; }
    { src = "platforms/plymouth/jylhis-roast/jylhis.script";
      dest = "share/jylhis/plymouth/jylhis-roast/jylhis.script"; }
  ];
}
