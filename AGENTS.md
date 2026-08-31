# AGENTS.md

Guidance for any AI agent or human contributor working in this repository.
This file is the single project-level entrypoint; deeper rules live in the
documents it links to.

## What this repo is

The Jylhis design system. A personal, cartographic-survey visual language with
two editions (Sheet light, Field dark), one bronze accent, no emoji, no
gradients, no shadows. Every color, spacing, motion, and ANSI value lives
in [`tokens.json`](./tokens.json); every platform target is **generated**
from it.

## Required reading before you change anything

1. [`README.md`](./README.md) — what the system is, who consumes it, how
   to clone/run, and how releases happen.
2. [`CLAUDE.md`](./CLAUDE.md) — concrete working instructions for code
   agents: command list, generation pipeline, hand-authored vs generated
   files, and key design rules.
3. [`ENGINEERING_PRINCIPLES.md`](./ENGINEERING_PRINCIPLES.md) — the
   non-negotiable principles (tokens-first, dual-theme parity, AAA body
   contrast, Unicode-as-icons, no emoji).
4. [`WAY_OF_WORKING.md`](./WAY_OF_WORKING.md) — how work flows through
   the repo (branch model, Conventional Commits, validators that gate
   merges, release rhythm).
5. [`docs/ACCESSIBILITY.md`](./docs/ACCESSIBILITY.md),
   [`docs/CLI-TUI-GUIDELINES.md`](./docs/CLI-TUI-GUIDELINES.md),
   [`platforms/KEYBOARD.md`](./platforms/KEYBOARD.md) — specs the CI
   validators enforce.

## Hard rules

- **Never** edit a generated file directly. Edit `tokens.json`, then run
  `bun scripts/generate.mjs`. The list of generated files is in
  [`CLAUDE.md`](./CLAUDE.md#generation-pipeline-scriptsgeneratemjs).
- **Never** ship one edition without the other. Sheet and Field are both
  first-class.
- **Never** add emoji, gradients, drop shadows, or scale/spring
  animations. The aesthetic is a flat survey sheet.
- **Never** introduce a new hex value that isn't in `tokens.json`. Add it
  to `tokens.json` first.
- Run `bun scripts/generate.mjs --check` and all six validators before
  every commit. CI runs the same checks.

## Commit and PR conventions

- Conventional Commits. CI lints commit messages and PR titles.
- Branch off `main`. Open a PR. `main` is protected: PR-required, status
  checks must pass, no force-push.
- One logical change per PR. Generated files belong in the same commit
  as the `tokens.json` change that produced them.

## When in doubt

- Look at [`docs/STYLE-GUIDE.md`](./docs/STYLE-GUIDE.md) for _which token
  to pick when_.
- Look at [`docs/INTEGRATION.md`](./docs/INTEGRATION.md) for _how a
  consumer wires this in_.
- If a rule is missing from the canon docs, raise it in a PR comment
  rather than guessing. The principles are deliberately small and we want
  them to stay that way.
