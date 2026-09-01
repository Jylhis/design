{
  description = "Jylhis design system — tokens-driven themes for terminals, editors, desktops";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
  };

  outputs = { self, nixpkgs, ... }:
    let
      systems = [
        "x86_64-linux"
        "aarch64-linux"
        "x86_64-darwin"
        "aarch64-darwin"
      ];

      forAllSystems = f: nixpkgs.lib.genAttrs systems (system: f {
        inherit system;
        pkgs = nixpkgs.legacyPackages.${system};
      });

      # Per-target keys are the source of truth in nix/install-map.nix.
      installMap = import ./nix/install-map.nix;
      targets = builtins.attrNames installMap;

      mkTargetPackages = pkgs:
        nixpkgs.lib.genAttrs targets
          (target: pkgs.callPackage ./nix/themes-per-target.nix { inherit target; });

      mkGhosttyPackage = pkgs:
        pkgs.callPackage ./nix/ghostty.nix {
          ghostty =
            if pkgs.stdenv.isDarwin
            then pkgs.ghostty-bin
            else pkgs.ghostty;
        };
    in
    {
      # packages.<system>.default          — all themes (alias: jylhis-themes)
      # packages.<system>.<target>         — single-target (e.g. .#waybar)
      # packages.<system>.ghostty-jylhis   — Ghostty wrapper with themes baked in
      packages = forAllSystems ({ system, pkgs }:
        {
          default = pkgs.callPackage ./nix/themes.nix { };
          jylhis-themes = pkgs.callPackage ./nix/themes.nix { };
          ghostty-jylhis = mkGhosttyPackage pkgs;
        }
        // mkTargetPackages pkgs
      );

      # Same module, exposed under both the legacy and modern names.
      homeManagerModules.default = import ./nix/home-manager-module.nix;
      homeModules.default        = import ./nix/home-manager-module.nix;

      # System-wide Stylix wiring. One file, both module systems.
      nixosModules.default  = import ./nix/system-stylix-module.nix;
      darwinModules.default = import ./nix/system-stylix-module.nix;

      # Helpers consumers can call from their own configs.
      lib = {
        # Absolute store path to the generated base16 YAML for a
        # { theme; mode; } variant (theme = "survey"|"mono", mode =
        # "light"|"dark"), suitable for `stylix.base16Scheme`. Requires the
        # overlay (or a pkgs set that already has `jylhis-themes`).
        toBase16Scheme = pkgs: { theme, mode }:
          "${pkgs.jylhis-themes}/share/jylhis/base16/jylhis-${theme}-${mode}.yaml";

        # Reads the token sources + committed base16 YAML and returns the
        # palette in the shapes downstream Nix configs need:
        # { hex; ansi; ansi16; base16; }. No pkgs needed.
        mkPalette = { theme, mode }:
          import ./nix/palette.nix { inherit (nixpkgs) lib; inherit theme mode; };
      };

      # Overlay: adds `jylhis-themes` (combined) and `jylhis-themes-targets`
      # (attrset of per-target derivations) into the consuming pkgs set.
      overlays.default = final: prev:
        let
          targetSet = mkTargetPackages final;
        in
        {
          jylhis-themes = final.callPackage ./nix/themes.nix { };
          jylhis-themes-targets = targetSet;
        };

      formatter = forAllSystems ({ system, pkgs }: pkgs.nixpkgs-fmt);
    };
}
