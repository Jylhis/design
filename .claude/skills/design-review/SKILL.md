---
name: design-review
description: Use this skill to audit a Jylhis design-system surface (web showcase, preview card, prototype, terminal theme, CLI script, or TUI integration) against the system's accessibility commitments and the CLI/TUI design conventions. Combines automated validators with a manual review playbook covering web a11y (WCAG 2.1 AA/AAA), non-web a11y (WCAG2ICT), CLI conventions (clig.dev / GNU / 12-Factor / GitHub-CLI accessibility work), TUI design (Ratatui / Bubble Tea / Textual + WAI APG), CVD spot-checking, and keyboard / focus walk-through. Produces a structured markdown report with severity-tagged findings and pointers back to the canonical specs.
user-invocable: true
---

# Design review — accessibility + CLI/TUI conventions

This skill audits any surface in the Jylhis design system end-to-end. It runs the static validators first, then walks a structured manual checklist that the validators cannot cover, then writes a markdown report.

The canonical specs are:
- [`docs/ACCESSIBILITY.md`](../../../docs/ACCESSIBILITY.md) — measurable WCAG commitments, CVD policy, what the validators enforce.
- [`docs/CLI-TUI-GUIDELINES.md`](../../../docs/CLI-TUI-GUIDELINES.md) — CLI and TUI conventions synthesised from clig.dev, GNU, 12-Factor CLI, WCAG2ICT, GitHub-CLI accessibility work, the Sampath/Merrick/Macvean CHI paper, and Ratatui/Bubble Tea/Textual.
- [`platforms/KEYBOARD.md`](../../../platforms/KEYBOARD.md) — focus ring, kbd chip, command palette, selected row, canonical bindings, audit checklist.
- [`docs/STYLE-GUIDE.md`](../../../docs/STYLE-GUIDE.md) — visual language; what each token is for.

## When to invoke

Invoke `/design-review` when:
- A new HTML preview, prototype, or showcase page is being added or significantly modified.
- A new platform target is being added (terminal theme, GTK theme, etc.).
- A new CLI/TUI tool is being added or an existing one substantially changed.
- Before a release that touches any user-facing surface.

Skip for trivial token-only edits — the validators in CI already cover those.

## Phase 1 — Pre-flight: run the validators

Run all five from the repo root and capture the output. Do not proceed to manual review until the validators pass or known failures are explicitly waived.

```bash
bun scripts/validate-tokens.mjs
bun scripts/validate-a11y-html.mjs
bun scripts/validate-a11y-css.mjs
bun scripts/validate-cli-conventions.mjs
bun scripts/generate.mjs --check
```

Summarise in the report:
- Which validators exited 0 vs 1.
- The list of errors (must be fixed before merge).
- The count of warnings (acceptable but worth noting).
- Any suggestions the auditor wants to act on.

## Phase 2 — Web accessibility (WCAG 2.1 AA/AAA)

For HTML files in `index.html`, `palette.html`, `font_options.html`, `md.html`, `platforms/index.html`, `preview/*.html`, and `prototypes/*.html`:

| Check | Method | Spec |
|---|---|---|
| `<html lang>` set | grep | WCAG 3.1.1 |
| Single `<h1>` per page; no skipped heading levels | manual scan | WCAG 1.3.1, 2.4.6 |
| Every `<img>` has `alt` (empty for decorative) | grep | WCAG 1.1.1 |
| Every interactive element has an accessible name | manual + DevTools | WCAG 4.1.2 |
| Form fields have `<label>` (or `aria-label`) | grep | WCAG 1.3.1, 3.3.2 |
| Focus visible on every focusable element at 2px | manual Tab through | WCAG 2.4.7, 2.4.11; KEYBOARD.md |
| `prefers-reduced-motion` respected | DevTools emulation | WCAG 2.3.3 |
| Skip-to-content link is the first focusable element on full pages | manual Tab from address bar | KEYBOARD.md |
| Status indicators carry a glyph or word, not colour-only | inspect each `.status*`/`.alert*` | ACCESSIBILITY.md §CVD |
| Resizing text to 200% in the browser keeps content usable | DevTools zoom | WCAG 1.4.4 |

## Phase 3 — Non-web accessibility (WCAG2ICT)

For terminal themes (`platforms/ghostty/`, `platforms/emacs/`, `platforms/shell/`), Wayland chrome (`platforms/hyprland/`, `platforms/waybar/`, `platforms/mako/`, `platforms/rofi/`), and GUI themes (`platforms/gtk/`, `platforms/kvantum/`):

- Foreground/background pairs meet the contrast floors documented in `tokens.json#contrast`. The token validator's extended sweep covers the four grounds surfaces; if a platform composes its own surfaces (e.g. mako notification body), spot-check those manually with [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/) or `bun scripts/validate-tokens.mjs`'s helpers.
- Named ANSI colours are used in any terminal-emitting code (slot 11 = the bronze accent across the system). Hex literals only where the target requires them (Ghostty, Rofi).
- Status colour is never the only signal — pairs with a glyph (`✓`/`✗`/`!`/`i`) or word.
- The theme works in a remapped terminal: the user can override ANSI 0–15 via terminal preferences without breaking the design.

## Phase 4 — CLI conventions

For every script in `scripts/` and any consumer CLI built on top of the system, walk `docs/CLI-TUI-GUIDELINES.md §2`:

- [ ] Real argument parser (clap / cobra / argparse / `parseArgs` — not hand-rolled `argv` walking).
- [ ] `-h` / `--help` and `--version` handled, exit 0.
- [ ] Help is example-led (lead with `Examples:`, then args, then options).
- [ ] Stdout for data, stderr for diagnostics. No mixing.
- [ ] Exit codes: `0` success, `1` runtime failure, `2` usage error. Documented when the tool defines extras.
- [ ] TTY detection drives default colour, paging, prompts, animation.
- [ ] `NO_COLOR` honoured. `--no-color` and `--plain` available. `--json` (or other structured format) available for tabular/hierarchical output.
- [ ] Configuration follows XDG. Precedence: flags > env > project > user > system.
- [ ] No secrets accepted via flags or env vars.
- [ ] Errors name the field, the expected value, the recovery action.
- [ ] Destructive actions have `--dry-run`, confirmation prompt with safe default, `Esc` cancel.

## Phase 5 — TUI conventions

For TUIs built on the Charm stack (`platforms/charm/`) or any other framework, walk `docs/CLI-TUI-GUIDELINES.md §3`:

- [ ] One layout pattern (overlay / dashboard / multi-pane / pager). Not hybrids.
- [ ] Renders correctly at 80×24, 120×30, 180×50. SIGWINCH handled.
- [ ] vim-style keybindings + arrow-key fallback. `?` / `F1` opens help. `q` quits.
- [ ] Active bindings visible in a footer or hint bar.
- [ ] Single-character shortcuts are focus-scoped (don't fire when a text input has focus) or remappable.
- [ ] Selected-row language matches `KEYBOARD.md`: `accent-subtle` background + 3px `accent` left-border (or inverse video where borders aren't available).
- [ ] Active pane has a visible indicator beyond colour (marker character, brighter border).
- [ ] Closing a dialog returns focus to the trigger. No keyboard traps.
- [ ] Render target chosen deliberately (stdout for self-contained, stderr for selectors that pipe their result).
- [ ] `--once` / `--plain` non-TUI fallback exists for any tool that has a non-interactive use case.
- [ ] No animation by default when stdout is not a TTY. `--no-animation` available. Spinners replaced with static contextual progress text.

## Phase 6 — CVD spot-check

Use the simulators listed in `docs/ACCESSIBILITY.md§How to verify a change`:

- macOS: System Settings → Accessibility → Display → Color Filters → Deuteranopia / Protanopia / Tritanopia.
- Chrome DevTools: Rendering panel → Emulate vision deficiencies.
- [Sim Daltonism](https://michelf.ca/projects/sim-daltonism/) (macOS).

Specifically check:
- The four status alerts in `preview/alerts.html` are still distinguishable as a *set* under deuteranopia.
- The bronze-on-Sheet combination still reads as "this is the link colour" rather than blending into the surrounding cool neutrals, and stays distinct from `contour` blue.
- The Modus syntax palette in `preview/code-languages.html` keeps comments distinct from strings.
- Any new colour added to `tokens.json` is checked under all three CVD types.

## Phase 7 — Keyboard / focus walk-through

For every full page, walk the `KEYBOARD.md` audit checklist hands-off-the-mouse:

- [ ] Every focusable element has a visible 2px focus ring.
- [ ] Every shortcut mentioned in copy is wrapped in `<kbd>` (or equivalent).
- [ ] No action is mouse-only.
- [ ] `Esc` dismisses every transient overlay; the hint is on-screen.
- [ ] Selected rows use the shared language (`accent-subtle` bg + `accent` left-border).
- [ ] `prefers-reduced-motion` fully respected.
- [ ] Skip-to-content link present and is the first focusable element.

## Phase 8 — Reporting

Write the report directly into the user's working buffer or a file the user names. Use this template:

```markdown
# Design review — <surface or PR>

**Date:** <YYYY-MM-DD>
**Surfaces audited:** <list>
**Result:** <pass | fail with N blockers>

## Validators

| Validator | Exit | Errors | Warnings | Suggestions |
|---|---|---|---|---|
| validate-tokens | 0 | 0 | — | — |
| validate-a11y-html | 0 | 0 | 46 | 40 |
| validate-a11y-css | 0 | 0 | 0 | — |
| validate-cli-conventions | 0 | 0 | 0 | — |
| generate.mjs --check | 0 | 0 | — | — |

## Findings

### Blockers (must fix before merge)
- (file:line) — <description> — fix per <spec link>

### Warnings (visible signal, do not block)
- (file:line) — <description> — fix per <spec link>

### Suggestions (advisory)
- (file:line) — <description>

## Manual checks performed

- [x] Web a11y (Phase 2)
- [x] Non-web a11y (Phase 3)
- [ ] CLI conventions (Phase 4) — N/A
- [ ] TUI conventions (Phase 5) — N/A
- [x] CVD spot-check (Phase 6)
- [x] Keyboard walk-through (Phase 7)

## Notes

<freeform observations, follow-up tickets, scope decisions>
```

## Report severity rules

- **Blocker**: a documented commitment in `ACCESSIBILITY.md`, `KEYBOARD.md`, or `CLI-TUI-GUIDELINES.md` is being broken; or a validator emits an error.
- **Warning**: a recommended pattern is not followed but the page/tool is still usable; or a validator emits a warning.
- **Suggestion**: a stylistic improvement that the auditor judges worth filing as a follow-up.

When in doubt about severity, link the spec section that applies. If no spec section applies, the finding is a suggestion.

## Common pitfalls to flag explicitly

- A new full page without a skip-to-content link.
- A new HTML file that does not import `colors_and_type.css` (and therefore inherits no `prefers-reduced-motion` guard, no shared font stacks, no tokens).
- A new status indicator (red/green/yellow/blue) without a glyph or word — the CVD-fragile case.
- A new CLI script without `--help` or that mixes data and diagnostics on stdout.
- A new TUI without a `--once` / `--plain` non-interactive fallback.
- A truecolor-only theme (most terminals only let users remap the named ANSI 16).
- An emoji or icon-font dependency added to the system (the Jylhis palette is glyphs-only by design — see `STYLE-GUIDE.md §6`).
