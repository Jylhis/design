# Flakeless entry point: `nix-build projects/design` with no flake command.
#
# Valid in BOTH worlds, because this file is exported verbatim to the public
# projection (github.com/Jylhis/design) where `../..` does not exist:
#
#   monorepo   — pkgs from the repo flake.lock via flake-compat (the root
#                default.nix carries `inputs`), so pins match the flake path.
#   projection — pkgs from THIS project's own flake.lock, fetched by rev+narHash
#                so no flake command and no experimental features are needed.
#
# Either way a flake.lock is the single pin source, and publish-flake-parity
# (kit/kernel/outputs.nix) keeps the two locks on the same nixpkgs rev.
{
  system ? builtins.currentSystem,
}:
let
  inMonorepo = builtins.pathExists ../../kit/lib/pkgs.nix;

  monorepoPkgs =
    let
      root = import ../../.;
    in
    import ../../kit/lib/pkgs.nix {
      inherit (root) inputs;
      inherit system;
    };

  standalonePkgs =
    let
      locked = (builtins.fromJSON (builtins.readFile ./flake.lock)).nodes.nixpkgs.locked;
      src = builtins.fetchTarball {
        url = "https://github.com/${locked.owner}/${locked.repo}/archive/${locked.rev}.tar.gz";
        sha256 = locked.narHash;
      };
    in
    import src { inherit system; };
in
((if inMonorepo then monorepoPkgs else standalonePkgs).callPackage ./package.nix { }).default
