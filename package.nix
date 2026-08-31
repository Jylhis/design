# Build + checks for projects/design (declared in ./project.nix).
# The package reuses the repo's own nix/themes.nix unchanged; the checks wrap
# the zero-dependency bun scripts (no npm install, no network) so they run in
# the Nix sandbox.
{
  pkgs,
  lib,
  ...
}:
let
  project = import ./project.nix;

  src = lib.cleanSourceWith {
    src = ./.;
    filter =
      path: _type:
      let
        rel = lib.removePrefix ((toString ./.) + "/") (toString path);
        first = builtins.head (lib.splitString "/" rel);
      in
      first != ".git"
      && first != "_site"
      && first != "result"
      && !lib.hasPrefix ".devenv" first
      && !lib.hasPrefix "result-" first;
  };

  runBun =
    name: script:
    pkgs.stdenvNoCC.mkDerivation {
      pname = "${project.meta.name}-${name}";
      version = project.meta.version;
      inherit src;
      nativeBuildInputs = [ pkgs.bun ];
      dontBuild = true;
      doCheck = true;
      checkPhase = ''
        export HOME=$TMPDIR
        ${script}
      '';
      installPhase = "touch $out";
    };
in
{
  default = pkgs.callPackage ./nix/themes.nix { };

  checks = {
    generated = runBun "generated" ''
      bun scripts/generate.mjs --check
    '';
    validate = runBun "validate" ''
      bun scripts/validate-tokens.mjs
      bun scripts/validate-a11y-html.mjs
      bun scripts/validate-a11y-css.mjs
      bun scripts/validate-a11y-type.mjs
      bun scripts/validate-preview-hex.mjs
      bun scripts/validate-cli-conventions.mjs
      bun scripts/validate-emacs-faces.mjs
      # package.json (the @jylhis/design npm package) must track tokens.json,
      # the version's source of truth.
      bun -e 'const t = await Bun.file("tokens.json").json(), p = await Bun.file("package.json").json(); if (t.meta.version !== p.version) { console.error(`version drift: tokens.json ''${t.meta.version} != package.json ''${p.version}`); process.exit(1); }'
    '';
  };
}
