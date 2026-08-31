{ pkgs, ... }:

{
  # https://devenv.sh/basics/

  # https://devenv.sh/packages/
  packages = [ pkgs.git pkgs.bun pkgs.python3 ];

  # https://devenv.sh/languages/
  # languages.rust.enable = true;
  languages.go.enable = true;

  # https://devenv.sh/scripts/
  # Validates that tokens.md, colors_and_type.css, platforms/charm/jylhis/palette.go
  # and the Ghostty themes all agree on hex values, that CSS custom properties follow
  # the naming convention, and that contrast ratios meet the AAA/AA claims.
  scripts.validate-tokens.exec = "bun scripts/validate-tokens.mjs";
  scripts.generate.exec = "bun scripts/generate.mjs";
  scripts.serve-pages.exec = "bash scripts/serve-pages.sh";

  # https://devenv.sh/processes/
  # processes.dev.exec = "${lib.getExe pkgs.watchexec} -n -- ls -la";

  # https://devenv.sh/services/
  # services.postgres.enable = true;

  # https://devenv.sh/scripts/

  # https://devenv.sh/basics/

  # https://devenv.sh/tasks/
  # tasks = {
  #   "myproj:setup".exec = "mytool build";
  #   "devenv:enterShell".after = [ "myproj:setup" ];
  # };

  # https://devenv.sh/tests/

  # https://devenv.sh/git-hooks/
  # git-hooks.hooks.shellcheck.enable = true;

  # See full reference at https://devenv.sh/reference/options/
}
