# Engineering Principles

The Jylhis design system is small on purpose. These principles are the
shape of "done." If a change conflicts with one of them, the change is
wrong — not the principle.

## 1. One source of truth

`tokens.json` is the spec. Every color, every spacing step, every motion
duration, every ANSI value, every contrast claim lives there. Platform
targets (CSS, Go, Emacs, Ghostty, Rofi, GTK, Waybar, Mako, Kvantum, GIMP,
ASE, HyperOS) are **generated** from `tokens.json` by
`scripts/generate.mjs`.

Never hand-edit a generated file. Never duplicate a hex value. If a value
isn't in `tokens.json`, add it there first.

## 2. Dual-theme parity

Paper (light) and Roast (dark) are both first-class. Never ship one
without the other. Every preview, every platform target, every release
note covers both modes.

## 3. AAA body, AA meta, decorative faint

Body text is WCAG 2.1 AAA on both backgrounds. `text-muted` clears AA.
`text-faint` is decorative only — dashed rules, disabled labels,
non-text-critical chrome. The validators enforce the contrast claims in
`tokens.json` against the actual generated CSS.

## 4. Single copper accent

One brand color, two roles: `--color-brand` for the favicon/maker's mark,
`--color-accent` for any accent that carries text meaning (links, focus
rings, status). The brand copper is **deliberately not a syntax color**.

## 5. Modus syntax everywhere

Code in Emacs, the web showcase, `bat`, `delta`, and Charm TUIs all
render with Modus Operandi (light) / Vivendi (dark). One source, one
grammar, identical pixels across surfaces.

## 6. Unicode is the icon set

`›` `▸` `»` `└──` `☾` `☀` `★` `⑂`. No icon font, no SVG sprite, no
emoji. The only bespoke SVG in the system is the maker's mark.

## 7. Flat paper, no gloss

No gradients. No drop shadows. No backdrop-filter or glass. Elevation is
conveyed with background-color steps and 1px borders. Animation is color
and translate only — no spring, no scale, no opacity tricks. All easings
are `ease-out`. Everything respects `prefers-reduced-motion`.

## 8. CLI/TUI conventions are a first-class spec

Every Bun script in `scripts/` honors [`docs/CLI-TUI-GUIDELINES.md`](./docs/CLI-TUI-GUIDELINES.md):
`--help`, `--version`, errors to stderr, exit codes match
sysexits/GitHub-CLI conventions. The validator
`scripts/validate-cli-conventions.mjs` enforces this on every push.

## 9. The validators are the contract

Five validators run on every push and PR:

- `bun scripts/generate.mjs --check` — committed files must match
  `tokens.json`.
- `bun scripts/validate-tokens.mjs` — schema + WCAG contrast + CSS
  `var()` resolution.
- `bun scripts/validate-a11y-html.mjs` — HTML a11y (lang, alt, labels,
  focus, reduced-motion, status-with-glyph).
- `bun scripts/validate-a11y-css.mjs` — CSS a11y (transitions guarded,
  `outline:none` replaced on `:focus-visible`).
- `bun scripts/validate-cli-conventions.mjs` — script CLI conventions.

If a validator is wrong, fix the validator in the same PR as the change
that reveals it. Do not silence it.

## 10. Small surface, slow change

This is a personal design system. Two themes, one accent, one type
pair, a fixed list of platform targets. Adding a platform target or a
new token group is a deliberate decision, not a drive-by. Anything not
in the canon list above is out of scope until it's argued for in a PR
description.
