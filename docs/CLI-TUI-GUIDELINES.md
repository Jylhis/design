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
| `-o` | `--output PATH` | Write payload to a file. `-` means stdout. |
| `-i` | `--input PATH` | Read payload from a file. `-` means stdin. |
| `-F` | `--format FMT` | Output encoding. `text` (default, human-readable) · `json` · `yaml` · `tsv` · `csv` · `template=<go-template>` · `jsonpath=<expr>`. Only `text` may contain ANSI / decoration. |
|  | `--input-format FMT` | Override input encoding when content-type sniffing isn't enough. Same vocabulary as `--format` minus templating. |
|  | `--json` | Back-compat alias for `--format json`. Mutually exclusive with `--plain`. |
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
- **Structured output** for anything tabular, hierarchical, or long: support `-F`/`--format` with the value vocabulary above. `text` is the human default; `json`, `yaml`, `tsv`, `csv`, `template=…`, `jsonpath=…` are the machine modes. Machine formats always go to **stdout**; progress and errors stay on **stderr** regardless of `--format`. `--json` remains as a back-compat alias for `--format json`. Auto-disable colour and animation when stdout is not a TTY, regardless of `--format` value.

### 2.5 Configuration

- Follow the [XDG Base Directory Specification](https://specifications.freedesktop.org/basedir-spec/latest/). Don't drop dotfiles in `$HOME`. The full path map and the layered-merge order live in §2.5.2 below.
- The full list of cross-tool environment variables every Jylhis tool must respect lives in §2.5.1.
- Document every project-specific env var the tool reads, prefixed with the tool name (`JYLHIS_NO_COLOR`, never bare `NO_COLOR` for tool-specific behaviour — that one is reserved for the cross-tool standard at <https://no-color.org>).
- **Never accept secrets via flags or env vars.** Both leak into `ps`, shell history, `systemctl show`, `docker inspect`. Take secrets from a file path, stdin, or a secret manager.

### 2.5.1 Standard environment variables

Every Jylhis tool honours the following without opt-in. Sources at the bottom of the doc.

**Colour & rendering** — sources: [no-color.org](https://no-color.org/), [bixense.com/clicolors](https://bixense.com/clicolors/), `terminfo(5)`, POSIX.

| Var | Behaviour |
|---|---|
| `NO_COLOR` | Set (any value, including empty) → disable all ANSI colour. |
| `FORCE_COLOR` | `0` disables; `1`/`2`/`3` force-enable at 16 / 256 / 24-bit (Node `supports-color` convention). |
| `CLICOLOR` | Default. Colour iff stdout is a TTY and `TERM != dumb`. `CLICOLOR=0` disables. |
| `CLICOLOR_FORCE` | Force colour even when stdout is piped. |
| `COLORTERM=truecolor`/`24bit` | Opt into 24-bit RGB; otherwise stay on the 16 named ANSI slots. |
| `TERM`, `TERM=dumb` | `dumb` → no escape sequences at all. |
| `TERMINFO`, `TERMCAP` | Override capability database path; respect when set. |
| `LINES`, `COLUMNS` | Override detected terminal size; honour before `ioctl(TIOCGWINSZ)` fallback. |

**Canonical colour-precedence chain** (highest priority first):

1. `NO_COLOR` set → no colour.
2. `--no-color` / `--color=never` flag → no colour.
3. `CLICOLOR_FORCE` set, or `--color=always` flag → force colour.
4. `FORCE_COLOR` non-zero → force colour.
5. Default: colour iff `isatty(stdout)` and `TERM != dumb`.

**Locale** — POSIX, GNU libc `locale(7)`.

| Var | Use |
|---|---|
| `LC_ALL` | Overrides everything else. If set, use it. |
| `LANG` | Default fallback. |
| `LC_MESSAGES` | Translation catalogue selection. |
| `LC_CTYPE` | Character classification (UTF-8 detection). Fall back to ASCII glyphs when locale is `C` / `POSIX`. |

**Paths (XDG Base Directory Spec v0.8)** — [freedesktop.org](https://specifications.freedesktop.org/basedir-spec/latest/). Already honoured by `platforms/scripts/jylhis-theme-toggle.sh` for `active-theme` state.

| Var | Default if unset | Use for |
|---|---|---|
| `XDG_CONFIG_HOME` | `~/.config` | User config files |
| `XDG_DATA_HOME` | `~/.local/share` | App-generated user data (themes, plugins, dbs) |
| `XDG_STATE_HOME` | `~/.local/state` | History, logs, recent-files |
| `XDG_CACHE_HOME` | `~/.cache` | Disposable derived data |
| `XDG_RUNTIME_DIR` | (must be set; usually `/run/user/$UID`) | Sockets, pipes, locks. Mode 0700. |
| `XDG_CONFIG_DIRS` | `/etc/xdg` | System-wide config search path (colon-separated) |
| `XDG_DATA_DIRS` | `/usr/local/share:/usr/share` | System-wide data search path |

All XDG paths must be absolute; treat relative as invalid.

**User & shell** — POSIX + freedesktop mime-apps spec.

| Var | Use |
|---|---|
| `HOME`, `USER` / `LOGNAME`, `SHELL` | Don't re-derive when set. |
| `EDITOR` | Line-based editor. |
| `VISUAL` | Full-screen editor. **`VISUAL` wins over `EDITOR`** (POSIX). |
| `PAGER` | Default `less -FRX`; degrade to `cat` if `TERM=dumb`. |
| `BROWSER` | Colon-separated preference list. |
| `TMPDIR` | Honour before `/tmp`. |
| `HTTP_PROXY` / `HTTPS_PROXY` / `ALL_PROXY` / `NO_PROXY` | Honour both upper- and lower-case forms. |

**Non-interactive / CI**

| Var | Convention |
|---|---|
| `CI` | Any non-empty value → CI environment. Suppress prompts and animation. |
| `DEBIAN_FRONTEND=noninteractive` | "No prompts allowed." |
| `TERM=dumb` | No ANSI, no spinners, line-buffered. Emacs `M-x shell` sets this. |

A robust interactivity check: stdin and stdout are both TTYs, `$CI` is unset, `$TERM != "dumb"`, and `--no-input` was not passed.

**Debug / log verbosity**

| Var | Convention |
|---|---|
| `JYLHIS_LOG=trace`/`debug`/`info`/`warn`/`error` | RUST_LOG-style level. Project-prefixed. |
| `JYLHIS_DEBUG` | Boolean / namespace list. |
| `JYLHIS_NO_COLOR`, `JYLHIS_FORCE_COLOR` | Per-tool overrides where the cross-tool ones are too coarse. |

Read bare `DEBUG`, `RUST_LOG`, `NODE_DEBUG`, `GODEBUG` etc. **only** for tooling that already participates in those ecosystems — never to change cross-tool behaviour. Bare `DEBUG` collides with the npm `debug` package.

### 2.5.2 Configuration file format

**Locations** (XDG, ranked search order):

```
$XDG_CONFIG_HOME/<tool>/config.toml      # primary user config
$XDG_CONFIG_HOME/<tool>/conf.d/*.toml    # drop-ins, applied alphabetically
/etc/xdg/<tool>/config.toml              # system-wide
./<tool>.toml or ./.<tool>.toml          # project-local (walked up from cwd)
```

**Format ranking** (community trend 2024–2026):

1. **TOML** — preferred for human-edited config (Cargo, pyproject, starship, ghostty, gh). Strong typing, comments, predictable.
2. **YAML** — only for k8s-adjacent or CI-pipeline tools. Whitespace-significant, error-prone for hand editing.
3. **JSON** — machine-generated only; no comments. Use JSONC / JSON5 only if your parser supports them.
4. **INI** — legacy git-style. Avoid for new tools.

Don't ship dotfiles in arbitrary formats; pick one.

**Layered resolution** (lowest → highest priority, per [12-factor §III](https://12factor.net/config) and [clig.dev](https://clig.dev/#configuration)):

1. Built-in defaults (compiled in).
2. System config (`/etc/xdg/<tool>/`, `XDG_CONFIG_DIRS`).
3. User config (`$XDG_CONFIG_HOME/<tool>/`).
4. Project config (walk up from cwd).
5. Environment variables (`<TOOL>_*`).
6. Command-line flags.

`tool config show --format json` exposes the resolved values so scripts and humans can introspect what won. `.env` files are acceptable for project-local dev overrides but **not** a substitute for real config — no version history, strings only, security risk.

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

- **GNU/Emacs (readline) bindings by default.** Cursor movement `C-f` / `C-b` / `C-a` / `C-e`, history `C-p` / `C-n` / `C-r`, edit `C-d` / `C-h` / `C-k` / `C-u` / `C-w` / `M-f` / `M-b` / `M-d` / `C-y`, redraw `C-l`, cancel `C-g`. This is the [GNU Readline](https://tiswww.case.edu/php/chet/readline/readline.html) default (`set editing-mode emacs`) and matches the Emacs row of [`../platforms/KEYBOARD.md`](../platforms/KEYBOARD.md#shortcuts--canonical-bindings).
- **Always offer arrow + `Home`/`End`/`PgUp`/`PgDn` fallback.** The WCAG keyboard guideline is "operable through a keyboard interface" — readline bindings aren't universal, and direction keys are.
- **Minimum text-input subset** every Jylhis tool must support: `C-A` `C-E` `C-F` `C-B` `C-K` `C-U` `C-W` `C-D` `C-H` `C-L` `C-Y` `C-R`. The Charm `bubbles/textinput` already implements most of this. `C-S` (forward i-search) is best-effort — terminal flow control intercepts it; suggest `stty -ixon` in shell init for users who want it.
- **Universally honoured**: `C-c` cancels; `C-d` on empty input is EOF.
- **Vim mode is opt-in.** Activated via `--vim`, `set -o vi` / `bindkey -v`, or `set editing-mode vi` in `~/.inputrc`. When active, `h`/`j`/`k`/`l`/`0`/`$`/`g`/`G`/`/` work as expected; the Emacs primaries remain reachable so `?` overlays and footer hints stay accurate. Honour `$EDITOR`/`$VISUAL` for an auto-hint (vi/vim/nvim → suggest `--vim`).
- **Visible hints**: a footer bar with the active bindings in `text-muted`. Even one row is enough. `?` opens a full help overlay. The hints reflect the active mode.
- **Single-character shortcuts must be focus-scoped or remappable** (WCAG 2.1.4). When a text input has focus, `C-a` goes to start of line, not "select all"; `q` types `q`; it doesn't quit. When help is open, `C-n` scrolls help; it doesn't navigate the parent list.
- Canonical action ↔ shortcut pairs shared with the rest of the system live in [`../platforms/KEYBOARD.md#shortcuts---canonical-bindings`](../platforms/KEYBOARD.md#shortcuts--canonical-bindings).

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

### 3.6 Small interactive components

Most tools don't need a full-screen layout — they need one well-behaved widget: a picker, a confirm, a text input. The Charm `bubbles` set wired up in [`../platforms/charm/jylhis/bubbles.go`](../platforms/charm/jylhis/bubbles.go) is the canonical small-component library; the shell-level peers are [`fzf`](https://github.com/junegunn/fzf), [`gum`](https://github.com/charmbracelet/gum), and [`rlwrap`](https://github.com/hanslub42/rlwrap).

| Component | Use for | Charm model | Shell equivalent | Keymap |
|---|---|---|---|---|
| Single-select list | "Pick one of N" | `bubbles/list` (single) | `gum choose --limit 1`, `fzf` | `↓`/`C-n` and `↑`/`C-p` move; `Enter` selects; `C-g`/`Esc` cancels. Vim primaries (`j`/`k`) only when vim mode is on. |
| Multi-select list | "Pick any of N" | `bubbles/list` + selection set | `gum choose --no-limit`, `fzf -m` | Above plus **`Tab`** to toggle. (Matches `fzf`/`gum`; `Space` is reserved for filter-or-pager paging.) |
| Filter / fuzzy-pick | Long lists | `list` with `Filter` enabled | `fzf` | `/` enters filter (vim mode) or just type (default `fzf` style). `C-g` exits filter, restores list. |
| Text input | Free-form value | `bubbles/textinput` | `gum input`; wrap non-readline tools in `rlwrap` | The minimum readline subset from §3.3. |
| Confirm | Y/N gate | inline render or `gum confirm` | `read -r` | `y`/`n`, default capitalised, `Esc` cancels. |
| Help overlay | Discoverable bindings | `bubbles/help` (`Help()` in `bubbles.go`) | n/a | `?` toggles, `Esc` closes. |
| Progress / status | Long-running op | static text + milestone updates; `bubbles/spinner` only when `--no-animation` is *off* | static echo lines | n/a |

Each component must:

- Render an explicit empty-state line (`No items matching "<query>"`) — never a blank pane.
- Restore caller focus on dismiss.
- Honour `--plain`: drop borders and decorative glyphs, fall back to inverse-video for the selected row (per §3.4).
- Announce its result on **stdout** suitable for command substitution (`vim "$(jylhis pick …)"`); send the UI itself to **stderr** if the result must pipe onward (the `fzf`/`gum` pattern, already covered in §3.5).

---

## 4. Accessibility specifics

The terminal predates WCAG. There is no comprehensive standard. WCAG2ICT and the GitHub-CLI accessibility work are the closest things; the rules below are the system's baseline. They apply to CLIs and TUIs equally unless noted.

### 4.1 Colour and decoration

- Honour the colour-precedence chain in §2.5.1 unconditionally: `NO_COLOR` / `CLICOLOR=0` / `TERM=dumb` / `--no-color` disable; `FORCE_COLOR` / `CLICOLOR_FORCE` / `--color=always` force-enable. Honour app-specific `JYLHIS_NO_COLOR` / `JYLHIS_FORCE_COLOR` for finer control.
- Provide `--plain` (or `--no-decoration`) that strips box-drawing characters, Unicode-glyph icons, ASCII art, and styled text. Useful for screen readers and scripts.
- Status colour is **always** paired with a glyph or word. The system's canonical pattern lives in [`../preview/alerts.html`](../preview/alerts.html):

  ```text
  ✓ ok          (status-ok, green)
  ✗ error       (status-err, red)
  ! warning     (status-warn, yellow)
  i info        (status-info, blue)
  ```

  Never `[red]Failed[/red]` with no glyph. A colour-blind or speech user sees a word with no semantic prefix.
- Prefer **named ANSI 4-bit colours** over hex literals in terminal-emitting code. Most terminals only let users remap the named 16. Slot 11 (`bright-yellow`) is intentionally overridden to the bronze accent across every Jylhis terminal target — see [`../tokens.md`](../tokens.md).
- Maintain ≥ 4.5:1 contrast against likely backgrounds. The `tokens.json#contrast` block is the source of truth; `scripts/validate-tokens.mjs` enforces it.

### 4.2 Animation

- **No animation by default** when stdout is not a TTY.
- **No animation under `--no-animation`** even on a TTY.
- Replace spinners with **static contextual progress text**. The GitHub-CLI accessibility work is the canonical example: their braille-character spinner (`⠋⠙⠹⠸…`) was unintelligible to screen readers, so they replaced it with a one-line message ("Fetching pull requests…") and periodic updates.
- Don't redraw the screen on a sub-second cadence. Aria-style assistive tech announces every redraw; the user hears a stutter and loses the message. Update on milestones, not on a wall-clock tick.
- For long-running commands, the timeline is: validate → show plan → execute (with milestone log lines) → summarise. Static text status, milestone updates, final result.

### 4.3 Output structure

- **Tables are an optional visual summary, not the only representation.** Long or hierarchical content needs a structured alternative: `--format json`, `--format yaml`, `--format tsv`/`csv`. Screen readers cannot navigate a wall of cell-aligned ASCII; they can navigate JSON.
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
| `--format json` round-trip | Parse the output with the language's JSON parser; assert structure. Repeat for `yaml`, `tsv`, `csv` if supported. |
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
| Dense ASCII tables as the only output | Unparseable by screen readers; brittle to resize | Plain labels first; `--format json`/`csv` for structure |
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
- [bixense.com/clicolors](https://bixense.com/clicolors/) — `CLICOLOR` / `CLICOLOR_FORCE` convention.
- [npm `supports-color`](https://github.com/chalk/supports-color) — `FORCE_COLOR=0|1|2|3` levels.
- [XDG Base Directory Specification](https://specifications.freedesktop.org/basedir-spec/latest/).
- [GNU Readline manual](https://tiswww.case.edu/php/chet/readline/readline.html) — emacs vs vi editing modes, default keymap.
- [GitHub CLI formatting manual](https://cli.github.com/manual/gh_help_formatting) · [kubectl output reference](https://kubernetes.io/docs/reference/kubectl/jsonpath/) · [aws CLI output formats](https://docs.aws.amazon.com/cli/latest/userguide/cli-usage-output-format.html) · [Docker CLI formatting](https://docs.docker.com/engine/cli/formatting/) · [Azure CLI output](https://learn.microsoft.com/en-us/cli/azure/format-output-azure-cli) — `--format` precedent.
- [`fzf`](https://github.com/junegunn/fzf), [`gum`](https://github.com/charmbracelet/gum), [`rlwrap`](https://github.com/hanslub42/rlwrap) — shell-level small-component reference.
