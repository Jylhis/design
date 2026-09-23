# Jylhis design system — the generator's outputs as one derivation.
#
# Runs scripts/generate.mjs + scripts/make-bundle.mjs against a sources-only
# tree (generated outputs excluded, so stale local copies can never poison the
# build) and installs the results preserving repo-relative paths. Consumers:
#   - nix/themes.nix, nix/themes-per-target.nix — copy their generated
#     install-map entries from here (see nix/generated-files.nix)
#   - nix/npm-package.nix — unions this tree over the npm fileset
#   - nix/ghostty.nix, nix/emacs.nix — pull their generated files from here
{
  lib,
  stdenvNoCC,
  bun,
}:

let
  root = ./..;
  generatedFiles = import ./generated-files.nix;

  # Sources only. Besides the usual checkout noise this drops the four root
  # generated outputs and every untracked generated platform file, so the
  # derivation's hash tracks sources, not local generator droppings.
  src = lib.cleanSourceWith {
    src = root;
    filter =
      path: _type:
      let
        rel = lib.removePrefix ((toString root) + "/") (toString path);
        first = builtins.head (lib.splitString "/" rel);
      in
      first != ".git"
      && first != "_site"
      && first != "result"
      && !lib.hasPrefix ".devenv" first
      && !lib.hasPrefix "result-" first
      && first != "node_modules"
      && first != "tokens.css"
      && first != "tokens-data.js"
      && first != "density.css"
      && first != "_ds_bundle.js"
      && !builtins.elem rel generatedFiles;
  };
in
stdenvNoCC.mkDerivation {
  pname = "jylhis-generated";
  version = (lib.importJSON ../tokens.core.json).meta.version;

  inherit src;

  nativeBuildInputs = [ bun ];

  dontConfigure = true;

  buildPhase = ''
    runHook preBuild
    export HOME=$TMPDIR
    bun scripts/generate.mjs --out gen
    bun scripts/make-bundle.mjs --out gen/_ds_bundle.js
    runHook postBuild
  '';

  installPhase = ''
    runHook preInstall
    mkdir -p "$out"
    cp -R gen/. "$out"/
    runHook postInstall
  '';

  meta = {
    description = "Jylhis design system — generated token + platform outputs";
    homepage = "https://github.com/jylhis/design";
    license = lib.licenses.mit;
  };
}
