# @jylhis/design as an npm package directory (what `npm pack` would tar).
# Exposed as pkgs.j10s.jylhis-design via kit/overlays and reachable through
# the flake's legacyPackages; deliberately NOT part of the kernel's
# packages/checks, so `nix flake check` never evaluates it. Node consumers
# in this repo depend on the source tree directly ("file:../design"); this
# derivation is the same file set materialized as a store path for Nix
# consumers and FOD composition.
#
# The npm package ships generated outputs (tokens.css, tokens-data.js,
# density.css) that are no longer tracked, so the fileset's tracked sources
# are unioned with the `generated` derivation's tree (nix/generated.nix) at
# install time. The generated derivation's hash plays the fileset's old
# churn-contract role: consumer hashes move only when shipped sources or
# generated output actually change.
{
  lib,
  callPackage,
  stdenvNoCC,
}:

let
  generated = callPackage ./generated.nix { };

  fileset = import ./npm-fileset.nix { inherit lib; };
in
stdenvNoCC.mkDerivation {
  pname = "jylhis-design";
  version = (lib.importJSON ../package.json).version;

  src = lib.fileset.toSource {
    root = ../.;
    fileset = fileset;
  };

  dontBuild = true;

  installPhase = ''
    runHook preInstall
    mkdir -p "$out"
    cp -r . "$out"/
    cp "${generated}/tokens.css" "$out"/tokens.css
    cp "${generated}/tokens-data.js" "$out"/tokens-data.js
    cp "${generated}/density.css" "$out"/density.css
    runHook postInstall
  '';

  meta = {
    description = "Jylhis design system as an npm package directory";
    license = lib.licenses.mit;
    platforms = lib.platforms.all;
  };
}
