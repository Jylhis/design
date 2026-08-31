# @jylhis/design as an npm package directory (what `npm pack` would tar).
# Exposed as pkgs.j10s.jylhis-design via kit/overlays and reachable through
# the flake's legacyPackages; deliberately NOT part of the kernel's
# packages/checks, so `nix flake check` never evaluates it. Node consumers
# in this repo depend on the source tree directly ("file:../design"); this
# derivation is the same file set materialized as a store path for Nix
# consumers and FOD composition.
{ lib, stdenvNoCC }:
stdenvNoCC.mkDerivation {
  pname = "jylhis-design";
  version = (lib.importJSON ../package.json).version;

  src = lib.fileset.toSource {
    root = ../.;
    fileset = import ./npm-fileset.nix { inherit lib; };
  };

  dontBuild = true;

  installPhase = ''
    runHook preInstall
    mkdir -p "$out"
    cp -r . "$out"/
    runHook postInstall
  '';

  meta = {
    description = "Jylhis design system as an npm package directory";
    license = lib.licenses.mit;
    platforms = lib.platforms.all;
  };
}
