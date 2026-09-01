# Pure data only (docs/design/project-nix.md) — build/checks live in package.nix.
{
  meta = {
    name = "design";
    description = "Jylhis design system — tokens-driven themes for terminals, editors, desktops";
    stack = "typescript";
    version = "2.0.0";
    license = "MIT";
    status = "stable";
    platforms = "all";
  };

  package = ./package.nix;

  checks = {
    generated.hermetic = "sandbox";
    validate.hermetic = "sandbox";
  };

  # The public repo is a projection of this tree (DOCTRINE Pillar 2): `just
  # publish design` mirrors the gated export. The showcase site ships via
  # Cloudflare (wiring TBD), so no deploy block is declared here yet.
  publish = {
    outward = true;
    repo = "Jylhis/design";
  };
}
