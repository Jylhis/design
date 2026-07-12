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
        # Returns the absolute store path to the generated base16 YAML
        # for a given variant ("paper" or "roast"), suitable for
        # `stylix.base16Scheme`. Requires the overlay (or a pkgs set
        # that already has `jylhis-themes`).
        variantToBase16Scheme = pkgs: variant:
          "${pkgs.jylhis-themes}/share/jylhis/base16/jylhis-${variant}.yaml";

        # Reads tokens.json and returns the palette in the shapes downstream
        # Nix configs need: { base16, ansi16, tty16, hex, ansi, variantKey }.
        # `variant` accepts "paper"/"roast" or "light"/"dark". No pkgs needed.
        mkPalette = variant:
          import ./nix/palette.nix { inherit (nixpkgs) lib; inherit variant; };
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
