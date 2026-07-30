# Flakeless entry point: `nix-build projects/design` with no flake command.
# pkgs is built from the repo flake.lock via flake-compat (default.nix carries
# `inputs`), so pins match the flake path exactly. flake.lock is the source of
# truth either way. (Standalone consumers of the public projection use its own
# flake.nix instead — this file is monorepo-relative.)
{
  system ? builtins.currentSystem,
}:
let
  root = import ../../.;
  pkgs = import ../../kit/lib/pkgs.nix {
    inherit (root) inputs;
    inherit system;
  };
in
(pkgs.callPackage ./package.nix { }).default
