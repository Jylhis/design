{ pkgs, ... }:

{
  # https://devenv.sh/basics/

  # https://devenv.sh/languages/
  languages = {
    go.enable = true;
    python.enable = true;
    javascript = {
      enable = true;
      bun.enable = true;
      bun.install.enable = true;
    };
  };

  # https://devenv.sh/scripts/
  scripts.validate-tokens.exec = "bun scripts/validate-tokens.mjs";
  scripts.generate.exec = "bun scripts/generate.mjs";
  scripts.serve-pages.exec = "bash scripts/serve-pages.sh";

}
