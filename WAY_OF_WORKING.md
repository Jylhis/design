# Way of Working

How work moves through this repo. Pair with
[`ENGINEERING_PRINCIPLES.md`](./ENGINEERING_PRINCIPLES.md), which says
*what* the system is, while this document says *how* to change it.

## Dev environment

Nix devenv. Enter with `devenv shell`. Provides `bun`, `go`, and the
convenience scripts `generate`, `validate-tokens`, and `serve-pages`.

If you are not in `devenv shell`, you need `bun` (any 1.x) on `PATH`.
That is the only runtime dependency.

## Workflow for changing a token

1. Edit [`tokens.json`](./tokens.json).
2. Run `bun scripts/generate.mjs`.
3. Run `bun scripts/validate-tokens.mjs` to confirm the schema and
   contrast claims still hold.
4. Commit the `tokens.json` edit and the regenerated files **together**.
   `bun scripts/generate.mjs --check` runs in CI; mismatches block the
   merge.

## Workflow for any other change

1. Branch off `main`. Naming is loose; `feat/…`, `fix/…`, `chore/…` are
   all fine.
2. Make the change. If you touch a Bun script, ensure `--help` and
   `--version` still pass `scripts/validate-cli-conventions.mjs`.
3. Run the six validators locally (see below) before pushing.
4. Open a PR. Write a Conventional Commits-style title. Describe *why*
   the change exists, not just *what* it does.
5. Wait for CI green. Squash-merge.

## Local validation gauntlet

```bash
bun scripts/generate.mjs --check
bun scripts/validate-tokens.mjs
bun scripts/validate-a11y-html.mjs
bun scripts/validate-a11y-css.mjs
bun scripts/validate-cli-conventions.mjs
bun scripts/validate-emacs-faces.mjs
bun scripts/validate-preview-hex.mjs
```

CI runs the same six. If any pass locally but fail in CI, the discrepancy
is a real defect — fix it before merging.

## Branch protection on `main`

`main` is protected. Required state:

- Pull request required, with at least one approving review.
- `validate` CI workflow must pass (all six validators above).
- `commitlint` and `gitleaks` jobs must pass.
- No force-push, no direct push.

The protection settings live in GitHub repository settings, not in the
repo. If they drift, restore them.

## Commit messages

[Conventional Commits](https://www.conventionalcommits.org). Examples:

- `feat(tokens): add accent-muted role`
- `fix(emacs): correct mode-line foreground on Field`
- `chore(ci): add gitleaks secret scan`
- `docs(readme): document release process`

CI lints commit messages on every push and PR title on every PR.

## Release process

This is a semver project. Releases are cut by tagging `main`.

1. **Decide the version.** Patch for fixes, minor for additive changes,
   major if you break a token name or a platform target's path.
2. **Update `CHANGELOG.md`.** Move the `[Unreleased]` items into a new
   dated section. Add the new compare link at the bottom.
3. **Bump the version** referenced inside `tokens.json` metadata (the
   showcase reads it from there).
4. **Run the full validator gauntlet** locally.
5. **Open a PR** titled `release: vX.Y.Z`. Get CI green.
6. **Merge to `main`.** Tag the merge commit:
   ```bash
   git tag vX.Y.Z
   git push origin vX.Y.Z
   ```
7. **GitHub Pages auto-deploys** from `main` via `.github/workflows/pages.yml`.
   Confirm the showcase at `https://jylhis.github.io/design/` (or wherever
   Pages is published) shows the new version badge.
8. **Cut a GitHub Release** from the tag with the CHANGELOG section as
   the body.

Consumers that pin this design system (jylhis.com, Jotain Emacs config,
Marchyo NixOS, nacutils) update their pin in a follow-up PR; the design
repo does not push to consumers.

## When something breaks in CI

- **`generate.mjs --check` fails.** You changed `tokens.json` without
  running `generate.mjs`, or you edited a generated file. Re-run
  `generate.mjs` and commit the result.
- **`validate-tokens.mjs` fails.** Either your contrast claim is wrong
  (fix the value) or the schema is wrong (fix the JSON). The validator
  prints which pair failed and what the actual ratio is.
- **`validate-a11y-html.mjs` fails.** The diff between the spec and the
  HTML you touched is in the error message — match the spec.
- **`validate-a11y-css.mjs` fails.** Either you used `outline:none`
  without a `:focus-visible` replacement, or you added a transition
  without a `prefers-reduced-motion` guard.
- **`validate-cli-conventions.mjs` fails.** Your script is missing
  `--help` or `--version`, writes errors to stdout, or returns the wrong
  exit code. Read `docs/CLI-TUI-GUIDELINES.md`.
- **`commitlint` fails.** Reword the offending commit or PR title.
- **`gitleaks` fails.** A secret leaked. Rotate it first, then scrub the
  history.

## Dogfooding rhythm

The repo's job is to serve real consumers. See
[`README.md#dogfooding`](./README.md#dogfooding) for the current list.
Each release should be exercised against at least the jylhis.com site
and one terminal/Emacs consumer before tagging.

## Out of scope

- New platform targets without a real consumer behind them.
- A second accent color, a third theme, a sans-serif body, an icon font.
- Anything that requires running consumer code in this repo's CI. CI
  validates the design system itself; consumers test their own pins.
