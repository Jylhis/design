# CLI & TUI design guidelines

How to build command interfaces that fit the Jylhis design system. Sibling to [`STYLE-GUIDE.md`](STYLE-GUIDE.md) (visual language), [`ACCESSIBILITY.md`](ACCESSIBILITY.md) (commitments), and [`../platforms/KEYBOARD.md`](../platforms/KEYBOARD.md) (focus, kbd, palette).

This document is the canonical spec for any tool that ships with the system: the bun scripts in `scripts/`, the Charm/Bubbletea integration in `platforms/charm/`, the shell init in `platforms/shell/`, and any future utility. The validators in `scripts/validate-cli-conventions.mjs` enforce the parts that are mechanically checkable.

---

## 1. Scope and terminology

| Type | Interaction model | Strengths | Risks |
|---|---|---|---|
| CLI | Invoke, get output, exit | Scriptable, composable, reproducible | Unstructured help, cryptic errors, undiscoverable verbs |
| TUI | Persistent screen, focus, multiple views | Efficient expert workflows, dense info | Lost focus, redraw noise, mode confusion, screen-reader ambiguity |

Many tools blend the two — a CLI subcommand may open a TUI (`git`, `gh`, `kubectl edit`); a TUI may expose a command prompt or pipe-friendly export (`htop`, `tig`, `lazygit`). Treat the boundary as fluid and design for both shapes when both are useful.

A terminal does not give you a DOM or an ARIA layer. Assistive tech receives a matrix of characters and infers structure from whitespace, ordering, and the host platform's accessibility APIs. **Plain text, but well-structured plain text** is the design contract.

---

## 2. CLI conventions

### 2.1 Argument parsing

Use a real argument parser. Don't hand-roll `argv` walking past the simplest cases.

| Language | Parser |
|---|---|
| Rust | `clap` |
| Go | `cobra` (or `urfave/cli`) |
| Python | `argparse` (stdlib) |
| Node / Bun | `node:util` `parseArgs` |
| Bash | hand-rolled `case` over `$1`, with `--` handling and `getopt` only when nothing else fits |

The parser is also where help, version, and tab completion live. Don't reinvent them.

### 2.2 Flag conventions

Stable across the system. New tools adopt these names verbatim before inventing their own.

| Short | Long | Meaning |
|---|---|---|
| `-h` | `--help` | Print help and exit 0. Required on every tool. |
|  | `--version` | Print version and exit 0. Required on every tool. |
| `-v` | `--verbose` | More log output. Repeatable (`-vv`) for higher verbosity. |
| `-q` | `--quiet` | Suppress non-error output. |
| `-n` | `--dry-run` | Show what would happen; do not mutate. |
| `-f` | `--force` | Skip confirmation. Reserve for destructive commands. |
| `-o` | `--output` | Write to path. `-` means stdout. |
| `-i` |  | Read from stdin (or `--input`); `-` means stdin. |
|  | `--json` | Emit machine-readable JSON. Mutually exclusive with `--plain`. |
|  | `--plain` | Strip colour, animation, decoration, box-drawing. |
|  | `--no-color` | Force no colour even on a TTY. |
|  | `--no-input` | Disable interactive prompts; fail on required input. |
|  | `--no-animation` | Replace spinners and progress bars with static text. |

Reserve one-letter aliases for the most common flags. Don't burn `-r` on `--readme` when half your users expect it to mean `--recursive`.

### 2.3 Command-tree shape

Group by **noun** (area), then **verb** (action). Subcommands as grouping areas, not incomplete actions.

```text
tool                      # top-level help
tool <area>               # help for the area
tool <area> <verb>        # action
tool <area> <verb> [opts] # parameters
tool <area> <verb> --help # detailed help with examples
```

`tool db migrate` is clearer than `tool migrate-db`. `tool config show` beats `tool show-config`. The shape should walkable through tab completion.

### 2.4 Output discipline

- **stdout** is for the data the user (or the next program in a pipe) asked for. Nothing else.
- **stderr** is for diagnostics: progress, prompts, warnings, errors.
- **Exit codes**: `0` success; `1` runtime failure (couldn't find file, network error, validation failed); `2` usage error (bad flags, missing required arg). Reserve other codes for tool-specific signal and document them.
- **TTY detection** drives default behaviour: colour, paging, prompts, animation only when stdout is a TTY (`process.stdout.isTTY` / `[ -t 1 ]` / `isatty(1)`). Piped output is plain by default.
- **Structured output** for anything tabular, hierarchical, or long: support `--json` (and where useful `--yaml`, `--csv`). The plain text is for humans skimming; the structured form is for scripts and screen readers.

### 2.5 Configuration

- Follow the [XDG Base Directory Specification](https://specifications.freedesktop.org/basedir-spec/latest/): `$XDG_CONFIG_HOME/<tool>/config` (default `~/.config/<tool>/`), `$XDG_DATA_HOME`, `$XDG_CACHE_HOME`. Don't drop dotfiles in `$HOME`.
- Precedence, highest first: command-line flags → environment variables → project config (`./.<tool>rc`) → user config (`~/.config/<tool>/`) → system config (`/etc/<tool>/`).
- Document every env var the tool reads, prefixed with the tool name (`JYLHIS_NO_COLOR`, never bare `NO_COLOR` for tool-specific behaviour — that one is reserved for the cross-tool standard at <https://no-color.org>).
- **Never accept secrets via flags or env vars.** Both leak into `ps`, shell history, `systemctl show`, `docker inspect`. Take secrets from a file path, stdin, or a secret manager.

### 2.6 Errors and prompts

Error messages name the field, the expected shape, and the recovery action.

```text
✗ Error: invalid --format value: "yml"
  Expected one of: text, json, yaml
  Try: tool report ./src --format yaml
```

Three things matter:

1. The leading glyph (`✗`, `!`, `i`) is always paired with a word — never colour-only.
2. The recovery line names the next safe command. `Try:` is enough.
3. Errors go to stderr, even when the tool is otherwise quiet.

Prompts are explicit, serial, reversible:

```text
Destination ./docs.bak exists. Overwrite? [y/N]
```

Name the field, the accepted values (case-insensitive), the default (capitalised), the cancel key (`Esc`/`C-c` always works). Never rely on a constantly-redrawing selector for a binary question.

### 2.7 Destructive actions

Preview before mutate. The shape is always: validate → show plan → confirm → execute → summarise.

- `--dry-run` runs the full plan and exits before any state changes.
- `--diff` (where applicable) shows the server-side or filesystem-side delta.
- Confirmation prompts state the operation (`Delete 14 files?`), default to the safe answer (`[y/N]`), and accept `Esc` as cancel.
- Reversibility is part of the help text. `git revert`, `restore`, and `reset` all do "undo," but their help makes the difference explicit. New tools follow that pattern.

---

## 3. TUI conventions

### 3.1 Layout patterns

| Pattern | Example | Use when |
|---|---|---|
| Floating overlay | `fzf` | Augmenting the shell without disturbing scrollback. |
| Dashboard | `htop`, `btop` | Overview-then-detail reading; static structure with live data. |
| Multi-pane | `lazygit`, `k9s`, `tig` | Managing related collections side-by-side. |
| Pager | `less`, `bat`, `tig log` | Showing long content, optionally interactive. |

Pick one. Don't combine "floating overlay" and "multi-pane" in one screen — it confuses focus.

### 3.2 Responsiveness

- Minimum viable size: **80×24**. Below that, render a graceful fallback ("Window too small — resize to 80×24") rather than a broken layout.
- Handle `SIGWINCH` (POSIX) / resize events: re-flow, never assume size after startup.
- Use **constraint-based layouts** (Ratatui's `Layout`, Bubble Tea's lipgloss `Width`/`Height`, Textual's CSS-grid). Avoid absolute coordinates.
- Test small (80×24), medium (120×30), large (180×50). Layouts should remain understandable when text is enlarged in the host terminal.

### 3.3 Keybindings

- **vim-style by default**: `h`/`j`/`k`/`l` for navigation, `/` for search, `?` for help, `q` to quit, `g`/`G` for top/bottom.
- **Always offer arrow-key fallback** — vim isn't universal, and the WCAG keyboard guideline is "operable through a keyboard interface", not "operable through a vim user".
- **Visible hints**: a footer bar with the active bindings in muted text. Even one row is enough. `?` opens a full help overlay.
- **Single-character shortcuts must be focus-scoped or remappable** (WCAG 2.1.4). When a text input has focus, `q` types `q`; it doesn't quit. When help is open, `j` scrolls help; it doesn't navigate the parent list.
- Canonical bindings shared with the rest of the system live in [`../platforms/KEYBOARD.md#shortcuts---canonical-bindings`](../platforms/KEYBOARD.md#shortcuts--canonical-bindings).

### 3.4 Focus and selection

Reuse the cross-platform language from [`KEYBOARD.md`](../platforms/KEYBOARD.md):

- One entry point per pane. Tab moves between panes; arrows move within.
- The selected row is `accent-subtle` background + 3px `accent` left-border. In TUIs without true colour or borders, fall back to inverse video.
- The active pane carries a 1-character marker in its title (`▸ files` vs ` files`) or a brighter border colour. Never *only* a colour shift.
- Focus restoration: closing a dialog returns focus to the trigger. No keyboard traps — Tab eventually wraps back to the first pane.

### 3.5 Render-target choice

Where a TUI writes its UI matters because it changes piping behaviour:

- **stdout** for self-contained apps where the UI *is* the product (`htop`, `lazygit`).
- **stderr** for selectors that pipe their result onward (`fzf`, `gum choose`). Run-and-pipe (`vim $(fzf)`) breaks if the UI competes with the result for stdout.

Document which mode the tool uses, and provide a `--once` / `--plain` static path when both makes sense (a process viewer should also have `tool --once` that prints once and exits).

---

## 4. Accessibility specifics

The terminal predates WCAG. There is no comprehensive standard. WCAG2ICT and the GitHub-CLI accessibility work are the closest things; the rules below are the system's baseline. They apply to CLIs and TUIs equally unless noted.

### 4.1 Colour and decoration

- Honour `NO_COLOR`, `TERM=dumb`, and `--no-color` unconditionally. Honour an app-specific `JYLHIS_NO_COLOR` for finer control where the cross-tool one is too coarse.
- Provide `--plain` (or `--no-decoration`) that strips box-drawing characters, Unicode-glyph icons, ASCII art, and styled text. Useful for screen readers and scripts.
- Status colour is **always** paired with a glyph or word. The system's canonical pattern lives in [`../preview/alerts.html`](../preview/alerts.html):

  ```text
  ✓ ok          (status-ok, green)
  ✗ error       (status-err, red)
  ! warning     (status-warn, yellow)
  i info        (status-info, blue)
  ```

  Never `[red]Failed[/red]` with no glyph. A colour-blind or speech user sees a word with no semantic prefix.
- Prefer **named ANSI 4-bit colours** over hex literals in terminal-emitting code. Most terminals only let users remap the named 16. Slot 11 (`bright-yellow`) is intentionally overridden to brand copper across every Jylhis terminal target — see [`../tokens.md`](../tokens.md).
- Maintain ≥ 4.5:1 contrast against likely backgrounds. The `tokens.json#contrast` block is the source of truth; `scripts/validate-tokens.mjs` enforces it.

### 4.2 Animation

- **No animation by default** when stdout is not a TTY.
- **No animation under `--no-animation`** even on a TTY.
- Replace spinners with **static contextual progress text**. The GitHub-CLI accessibility work is the canonical example: their braille-character spinner (`⠋⠙⠹⠸…`) was unintelligible to screen readers, so they replaced it with a one-line message ("Fetching pull requests…") and periodic updates.
- Don't redraw the screen on a sub-second cadence. Aria-style assistive tech announces every redraw; the user hears a stutter and loses the message. Update on milestones, not on a wall-clock tick.
- For long-running commands, the timeline is: validate → show plan → execute (with milestone log lines) → summarise. Static text status, milestone updates, final result.

### 4.3 Output structure

- **Tables are an optional visual summary, not the only representation.** Long or hierarchical content needs a structured alternative: `--json`, `--yaml`, `--csv`. Screen readers cannot navigate a wall of cell-aligned ASCII; they can navigate JSON.
- **Labels before values, one concept per line.** Prefer `Path: ./docs` over `┌─────┐ ./docs ┌─────┐`. Whitespace beats box-drawing for assistive tech.
- **Decorative Unicode glyphs** (`›`, `▸`, `└──`, `★`) inside output should be discardable by `--plain`. They are ornament; the meaning is in the words next to them.

### 4.4 Documentation

- `--help` is example-led. Lead with one or two `Examples:` lines, then arguments, then options. Avoid exhaustive flag dumps as the first thing the user sees.
- Long-form docs live in HTML (the GitHub Pages build, `docs/`), not only in `man` pages or `--help` text. The Sampath/Merrick/Macvean CHI study found screen-reader users explicitly avoid `--help` and `man` for documentation because terminal reflow makes them painful to navigate.

### 4.5 Internationalisation and Unicode width

- Use `gettext` (or the language equivalent: `i18next`, `gettext-go`, Python's `gettext`) for translatable strings. Honour `LC_ALL`, `LC_MESSAGES`, `LANG`. Handle plural forms — pluralisation rules vary by language.
- Measure display width using `wcwidth` / `wcswidth` / Unicode East Asian Width / grapheme segmentation, not `string.length` or `byte_length`. CJK characters, emoji, and combining marks are not one cell wide. Mis-measuring breaks alignment, truncation, cursor movement, and selection.
- The Jylhis system uses no emoji and a small set of Unicode glyphs (`›`, `▸`, `»`, `└──`, `├──`, `─`, `☾`, `☀`, `★`, `⑂`, `$`, `//`). All of these are 1 cell wide in a monospace terminal. Tools may extend the set; new glyphs must be verified for terminal width before adoption.

---

## 5. Testing

| What | How |
|---|---|
| Argument parsing & exit codes | Unit tests over `argv` permutations: bad flag → exit 2, missing arg → exit 2, success → exit 0. |
| `--help` snapshot | Render at 80, 100, 120 cols. Compare to a committed fixture. CI fails on diff. |
| TTY vs pipe | Run with stdout piped to `cat`; assert no ANSI escapes leak through. |
| `NO_COLOR` | Set env var; assert plain output. |
| `--json` round-trip | Parse the output with the language's JSON parser; assert structure. |
| Unicode width | Render content containing CJK, combining marks, zero-width joiners; assert no overflow. |
| Destructive paths | `--dry-run` produces full plan with zero side effects; `--force` skips confirmation; cancel at the prompt produces exit 0 with no changes. |
| Keyboard-only walkthrough | Hands off the mouse for an entire scenario. |
| Assistive tech | Manual session on the target stack: VoiceOver + macOS Terminal, NVDA + Windows Terminal, Orca + GNOME Terminal. At least one stack per release. |

---

## 6. Anti-patterns

| Avoid | Because | Do instead |
|---|---|---|
| Colour-only error/success/warning | Colour-blind and speech users see no signal | Glyph + word + colour |
| Spinner-only progress | Unintelligible to screen readers; redraw stutter | Static text milestones |
| Dense ASCII tables as the only output | Unparseable by screen readers; brittle to resize | Plain labels first; `--json`/`--csv` for structure |
| Hidden modes (no visible mode indicator) | Users get lost; speech users especially | Mode in the status bar at all times |
| Shortcut overload (no `?` help) | Discoverability collapses | `?`/`F1` help; visible binding hints |
| Box-drawing decoration around prose | Read aloud as punctuation noise | Whitespace, single rule character if needed |
| Truecolor-only palette | Many terminals remap only the 16 ANSI slots | Named ANSI; truecolor as enhancement |
| Secrets via `--token` flag or env | Leaks into `ps`, history, container metadata | File path, stdin, secret manager |
| Amending a published commit / `git push --force` from a script | Destructive and irreversible | New commit, `--force-with-lease` only with explicit user opt-in |
| `--no-verify` / `--no-gpg-sign` to bypass hooks | Bypasses the user's safety net | Fix the underlying issue |

---

## 7. Pointers

- [`STYLE-GUIDE.md`](STYLE-GUIDE.md) — visual language, type, spacing, motion.
- [`ACCESSIBILITY.md`](ACCESSIBILITY.md) — measurable WCAG commitments and CVD policy.
- [`../platforms/KEYBOARD.md`](../platforms/KEYBOARD.md) — focus ring, kbd chip, command palette, selected-row, canonical shortcuts.
- [`../platforms/charm/`](../platforms/charm/) — the system's reference TUI integration (Bubble Tea + lipgloss + bubbles).
- [`../platforms/shell/`](../platforms/shell/) — bash/zsh init, starship prompt, dircolors.
- [`../tokens.md`](../tokens.md) — palette + ANSI slot map.
- The validators in [`../scripts/`](../scripts/) — `validate-tokens.mjs`, `validate-a11y-html.mjs`, `validate-a11y-css.mjs`, `validate-cli-conventions.mjs` — encode the parts of this spec that are mechanically checkable.

---

## 8. References

The guidelines above are a synthesis of:

- [clig.dev](https://clig.dev/) — *Command Line Interface Guidelines.*
- [12 Factor CLI Apps](https://medium.com/@jdxcode/12-factor-cli-apps-dd3c227a0e46) — Jeff Dickey.
- [GNU Coding Standards §4.7–4.8](https://www.gnu.org/prep/standards/standards.html) — argument and option conventions.
- [Heroku CLI Style Guide](https://devcenter.heroku.com/articles/cli-style-guide).
- [POSIX Utility Conventions](https://pubs.opengroup.org/onlinepubs/9699919799/basedefs/V1_chap12.html).
- [W3C WCAG 2.1](https://www.w3.org/TR/WCAG21/) and [WCAG2ICT](https://www.w3.org/TR/wcag2ict-22/).
- [GitHub: *Building a more accessible GitHub CLI*](https://github.blog/engineering/user-experience/building-a-more-accessible-github-cli/).
- Sampath, Merrick & Macvean (2021), *Accessibility of Command Line Interfaces*, CHI.
- [Ratatui FAQ](https://ratatui.rs/faq/), [Bubble Tea](https://github.com/charmbracelet/bubbletea), [Textual docs](https://textual.textualize.io/).
- [WAI-ARIA Authoring Practices: Keyboard Interaction](https://www.w3.org/WAI/ARIA/apg/practices/keyboard-interface/).
- [no-color.org](https://no-color.org/) — the `NO_COLOR` standard.
- [XDG Base Directory Specification](https://specifications.freedesktop.org/basedir-spec/latest/).
