# AGENTS.md

Guidance for any AI agent or human contributor working in this repository.
This file is the single project-level entrypoint; deeper rules live in the
documents it links to. The concrete working instructions that previously
lived in `CLAUDE.md` (command list, generation pipeline, hand-authored vs
generated files, design rules) are merged into this file; `CLAUDE.md` is
retired.

## What this repo is

The Jylhis design system. A personal, cartographic-survey visual language:
**one theme (`jylhis`) with first-class light and dark modes** (Print and
Negative), one bronze accent plus one destructive role, no emoji, no
gradients. The interaction skeleton descends from the monochrome work:
ramps, the density axis, and tokenized syntax emphasis are shared
structure, while the palette keeps its survey tinting. Every color,
spacing, motion, and ANSI value lives in
[`tokens.core.json`](./tokens.core.json) +
[`themes/jylhis.json`](./themes/jylhis.json); every platform target is
**generated** from them.

## Required reading before you change anything

1. [`README.md`](./README.md) — what the system is, who consumes it, how
   to clone/run, and how releases happen.
2. [`DESIGN.md`](./DESIGN.md) — the design contract: what is fixed, why,
   and how it sounds (constraints, values, foundations, voice).
3. [`docs/ACCESSIBILITY.md`](./docs/ACCESSIBILITY.md),
   [`docs/CLI-TUI-GUIDELINES.md`](./docs/CLI-TUI-GUIDELINES.md),
   [`platforms/KEYBOARD.md`](./platforms/KEYBOARD.md) — specs the CI
   validators enforce.

## Commands

```bash
bun scripts/generate.mjs                  # regenerate all targets from tokens.core.json + themes/jylhis.json
bun scripts/generate.mjs --out <dir>      # same, into a scratch dir (what the determinism gate uses)
bun scripts/validate-tokens.mjs           # schema + grouping + WCAG contrast + CSS var resolution
bun scripts/validate-a11y-html.mjs        # HTML accessibility (lang, alt, labels, status-with-glyph)
bun scripts/validate-a11y-css.mjs         # CSS accessibility (reduced-motion guards; outline:none needs :focus-visible)
bun scripts/validate-cli-conventions.mjs  # scripts follow docs/CLI-TUI-GUIDELINES.md (--help, --version, stderr, exit codes)
just generate-check                       # determinism gate: two generate runs must agree byte-for-byte
serve-pages                               # build + serve the Pages artifact locally
```

All validators and generator scripts support `--help` and `--version`.
Generated outputs are **not committed** — after any token edit, regenerate
locally (or let the Nix/devenv build do it); CI proves the generator is
deterministic rather than diffing committed bytes.

## Architecture

### Sources of truth

| File                  | What                                                       |
| --------------------- | ---------------------------------------------------------- |
| `tokens.core.json`    | theme-independent framework (structure, type, density, …)  |
| `themes/jylhis.json`  | the one theme: palette/syntax/status/ANSI + contrast claims |

The core carries the type stack (Zilla Slab display, Hanken Grotesk body,
IBM Plex Mono readings, IBM Plex Sans Condensed numerals), the type scale
and floors, spacing, layout, radii, breakpoints, z-index, border widths,
focus, the `data-density` axis (emitted as `density.css`), motion, sound,
and the colour-role taxonomy (`groups`, including the `consequence` group
for `destructive`).

### Theming model

- **Jylhis** (`jylhis`, the only theme) — cool sheet grounds, bronze
  accent, vermilion maker's mark, contour-blue linework, Modus syntax.
  Modes: **Print** (light, ink on paper) and **Negative** (dark, the
  developed plate).
- Both modes carry 7-step contrast-solved ramps for every chromatic role
  (`accent`, `destructive`, `brand`, `contour`, `status-*`), a
  `shadowFloat` pair, and a solid `accent-subtle` (ramp step 1).
- **Selection:** `data-mode="light|dark"` on `<html>` (default: light).
  The `data-theme` attribute is retired — there is nothing to select
  between. No emoji, no gradients; Unicode glyphs as icons.
- Syntax emphasis is tokenized: `--syntax-<role>-weight` / `-style`
  accompany the colours so weight/italic carry meaning alongside hue.

### Generation pipeline: `scripts/generate.mjs` (+ `scripts/lib/emit.mjs`)

Native emitters produce `tokens.css` (`:root` = Print/light,
`[data-mode="dark"]` = Negative/dark; includes the ramps,
`--color-destructive`, `--shadow-float`, `--font-numeric`, and the default
density box), `density.css` (the `data-density` axis), and
`tokens-data.js` (flat — top level IS the theme, with measured
`contrastPairs` + `swatchContrast`).

Platform targets are derived from committed hand-tuned reference files in
`platforms/_reference/` (their `sheet`/`field` file names are historical
and intentional — never rename them) by role-mapped recoloring + slug
renaming — `ui`-priority for chrome targets, `syntax`-priority for
Emacs/bat. Outputs are uniform `jylhis-light` / `jylhis-dark` files ×2
for: ghostty, rofi, hyprland, gimp, base16, console (nix), kvantum
(`JylhisLight.colors` / `JylhisDark.colors`), mako (`config-light` /
`config-dark`), waybar (`style-light.css` / `style-dark.css`), fzf, bat,
emacs, plymouth (dirs — hand-adapted, values from the theme JSON), plus
gtk (`jylhis-light.css` / `jylhis-dark.css`, with a light `gtk.css` copy).
`waybar/style.css` and `mako/config` stay as light copies for
name-hardcoding consumers.

Not yet themed: `platforms/charm/` (hand-authored Go), `adobe/*.ase` +
`hyperos/*.mtz` (binary, renamed only), `platforms/shell/`
starship/bashrc/zshrc/dircolors (ANSI-name based, theme-agnostic).

**Generated files are gitignored and never committed.** They are built by
the Nix derivations (`nix/themes-per-target.nix` runs the generator inside
the build), by `assemble-pages.sh`, and on demand in dev shells. Use
`just generate-check` (two runs, `diff -r`) to prove determinism after
touching the generator.

### Hand-authored (not generated)

- `colors_and_type.css` — imports `tokens.css` + `fonts.css`, semantic type
  helpers (`.ds-body`, `.ds-h1`, `.ds-meta`, …)
- `components/components.css` + `components/local.css` (local Plate/Legend
  styles)
- `platforms/shell/`, `platforms/ghostty/config`, `platforms/KEYBOARD.md`,
  `platforms/charm/`, `platforms/shadcn/tokens.css` (single hand-maintained
  shadcn token file), the plymouth dirs (GENERATED-adapted headers; palette
  floats maintained by hand from `themes/jylhis.json`)

### Nix packaging (`nix/` + `flake.nix`)

The project ships its own `flake.nix` (nixpkgs-only input): per-target
packages, a Home Manager module, a NixOS/darwin stylix module, an overlay,
and palette helpers for stylix. The `nix/` directory holds the standalone
`.nix` files (`callPackage` pattern, usable without the flake):

- `nix/ghostty.nix` — wraps Ghostty with the light/dark themes in
  `XDG_DATA_DIRS`
- `nix/emacs.nix` — Emacs theme package via `trivialBuild`
- `nix/themes.nix` — every theme file as one derivation (generator runs
  inside the build)
- `nix/install-map.nix`, `nix/palette.nix`, `nix/themes-per-target.nix`,
  `nix/home-manager-module.nix`, `nix/system-stylix-module.nix` — install
  manifest (over light × dark), palette helpers, per-target derivations,
  and the HM/stylix modules (`name` is fixed to `jylhis`; `mode` selects
  light/dark)

### Showcase website

`index.html` renders swatches from `tokens-data.js` and has a **mode
toggle** (persisted in localStorage as `jylhis-theme`). Specimen cards in
`preview/`, component sources in `components/`, prototypes in
`prototypes/`, reusable chrome in `mocks/`.

### Monorepo context

This tree is developed in the j10s monorepo at `projects/design/`; the
public github.com/Jylhis/design repo is a publish-outward projection (`just
publish design` from the monorepo root — see `kit/publish/README.md`). The
`project.nix` / `package.nix` / `default.nix` trio is the monorepo
contract; everything else works standalone so the projection stays a
self-building repo. Deliberate deviation: `devenv.yaml` stays self-contained
(no `- /shared` import) so `devenv shell` keeps working in the projection.
The generated outputs (`tokens.css`, `density.css`, `tokens-data.js`,
`platforms/**` minus the hand-authored files) are gitignored and excluded
from the monorepo's treefmt; correctness is enforced by the determinism
gate (`just generate-check`), not by committed bytes.

Consequences of being a **one-directional** mirror, learned the hard way on
the first publish (2026-07-30) — do not re-add any of these:

- **No `.github/workflows/quality.yml`.** Commit linting is meaningless
  here: the only commit the public repo ever carries is
  `publish design from j10s@<sha>`, which is not a Conventional Commit.
  Secret scanning is already the publish gate (`gitleaks dir` in
  `kit/publish/default.nix`). Both jobs also referenced third-party actions
  the destination repo's Actions allowlist rejects, so every run
  **startup-failed**.
- **No `.github/dependabot.yml`.** A PR merged on the mirror is destroyed
  by the next `just publish design`. The Go modules under `platforms/charm`
  are watched from the monorepo's own dependabot config instead.
- **Third-party actions are a hazard in exported workflows.**
  `Jylhis/design` allows only GitHub-owned, Jylhis-owned, and
  `oven-sh/setup-bun@v2`. Prefer `run:` steps. `actionlint` runs over the
  export inside the publish gate.
- **`default.nix` and `flake.lock` must work standalone.** `default.nix`
  detects whether the monorepo is around it; `flake.lock`'s nixpkgs rev is
  held equal to the tree's by the `publish-flake-parity` flake check and
  rewritten by `just update`. Do not bump it independently.
- **The validator lists must stay in lock-step** — `justfile`'s `validate`,
  `package.nix`'s `checks.validate`, and `.github/workflows/validate.yml`.
  All four (`validate-tokens`, `validate-a11y-html`, `validate-a11y-css`,
  `validate-cli-conventions`), always.

## Workflow for changing a token

1. Edit `tokens.core.json` or `themes/jylhis.json`
2. `bun scripts/generate.mjs`
3. `bun scripts/validate-tokens.mjs`

## Editing the theme

There is exactly one theme. Edit `themes/jylhis.json` (or the framework in

## Hard rules

- **Never** edit a generated file directly. Edit `tokens.core.json` /
  `themes/jylhis.json`, then run `bun scripts/generate.mjs`. The generated
  files are catalogued in the Generation pipeline section above.
- **Never** commit generated output — it is gitignored on purpose; Nix and
  the pages assembly build it. Never ship one mode without the other:
  light (Print) and dark (Negative) are both first-class.
- **Never** add emoji, gradients, or scale/spring animations. Elevation is
  tone and line; the one elevation shadow (`--shadow-float`) is for objects
  that float over content, never a decoration on an in-flow surface.
- **Never** introduce a new hex value outside the token sources. Add it to
  `themes/jylhis.json` first.
- **Never** use the accent as a syntax colour, and **never** let the
  status colours drop to grayscale — syntax may grey down, signals never.
  `brand` is the maker's mark alone, distinct from status red, and ANSI 11
  is always the accent; both are validated.
- Contrast is measured, not asserted: body text AAA in both modes,
  `text-muted` AA, `text-faint` decorative only. All claims in
  `themes/jylhis.json#contrast` are measured by `validate-tokens.mjs`.
- Run `just generate-check` (the determinism gate) and all four validators
  before every commit. CI runs the same checks.

## Commit and PR conventions

- Conventional Commits. CI lints commit messages and PR titles.
- Branch off `main`. Open a PR. `main` is protected: PR-required, status
  checks must pass, no force-push.
- One logical change per PR. Generated files are never part of any commit.

## When in doubt

- Look at [`docs/STYLE-GUIDE.md`](./docs/STYLE-GUIDE.md) for _which token
  to pick when_.
- Look at [`docs/INTEGRATION.md`](./docs/INTEGRATION.md) for _how a
  consumer wires this in_.
- If a rule is missing from the canon docs, raise it in a PR comment
  rather than guessing. The principles are deliberately small and we want
  them to stay that way.
