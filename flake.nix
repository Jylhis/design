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
    in
    {
      # packages.<system>.default          — all themes (alias: jylhis-themes)
      # packages.<system>.<target>         — single-target (e.g. .#waybar)
      # packages.<system>.ghostty-jylhis   — Ghostty wrapper with themes baked in
      packages = forAllSystems ({ system, pkgs }:
        {
          default = pkgs.callPackage ./nix/themes.nix { };
          jylhis-themes = pkgs.callPackage ./nix/themes.nix { };
          ghostty-jylhis = pkgs.callPackage ./nix/ghostty.nix { };
        }
        // mkTargetPackages pkgs
      );

      # Same module, exposed under both the legacy and modern names.
      homeManagerModules.default = import ./nix/home-manager-module.nix;
      homeModules.default        = import ./nix/home-manager-module.nix;

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
