{
  pkgs,
  lib,
  ...
}:
let
  project = import ./project.nix;

  # Generated outputs excluded: they live in derivations (nix/generated.nix),
  # and checks.generated asserts none of them are committed.
  generatedFiles = import ./nix/generated-files.nix;

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
      && !lib.hasPrefix "result-" first
      && first != "node_modules"
      && first != "tokens.css"
      && first != "tokens-data.js"
      && first != "density.css"
      && first != "_ds_bundle.js"
      && !builtins.elem rel generatedFiles;
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
    # Determinism gate: two runs from the token sources must agree
    # byte-for-byte, and no generated output may be committed (generated
    # files live in derivations now — see nix/generated.nix).
    generated = runBun "generated" ''
      bun scripts/generate.mjs --out "$TMP/a" > /dev/null
      bun scripts/generate.mjs --out "$TMP/b" > /dev/null
      diff -r "$TMP/a" "$TMP/b"
      test ! -e tokens.css && test ! -e platforms/ghostty/jylhis-light || {
        echo "generated files must not be committed"
        exit 1
      }
    '';
    # The validators read generated files from the working tree (tokens.css
    # var() resolution, a11y walks), so materialize once from the sources
    # before running them. Validator list stays in lock-step with the
    # justfile and .github/workflows/validate.yml.
    validate = runBun "validate" ''
      bun scripts/generate.mjs --out . > /dev/null
      bun scripts/validate-tokens.mjs
      bun scripts/validate-a11y-html.mjs
      bun scripts/validate-a11y-css.mjs
      bun scripts/validate-cli-conventions.mjs
      # package.json (the @jylhis/design npm package) must track tokens.core.json,
      # the version's source of truth.
      bun -e 'const t = await Bun.file("tokens.core.json").json(), p = await Bun.file("package.json").json(); if (t.meta.version !== p.version) { console.error(`version drift: tokens.core.json ''${t.meta.version} != package.json ''${p.version}`); process.exit(1); }'
    '';
  };
}
