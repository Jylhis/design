<!-- GENERATED from tokens.json by scripts/generate.mjs. Do not edit by hand. -->
# Jylhis Design System — Platform Tokens

This is the human-readable companion to the canonical token source,
[`tokens.json`](./tokens.json). Every platform-specific file in `platforms/`
derives from `tokens.json` through `scripts/generate.mjs`; when a value
changes, update `tokens.json` first, then regenerate and validate the targets.

There are four editions: the colour pair **Sheet** (light) / **Field** (dark)
and the monochrome pair **Chalk** (light) / **Graphite** (dark). `sheet` /
`field` / `chalk` / `graphite` are the identifiers used in generated filenames,
Nix options, Go `Mode` constants, and Emacs theme names.

## 0. Principles

1. **Cool grounds, one bronze accent.** A single desaturated blue-grey ramp carries every surface and every weight of ink. No pure white, no pure black.
2. **AAA for body text, AA for meta, no exceptions.** Ratios are computed from `tokens.json` in the palette table below.
3. **Keyboard is first-class on every surface.** Focus must be visible in 2px at AAA contrast. Shortcuts are always labeled. Selected items share one visual language across web, Emacs, rofi.
4. **Every edition is first-class.** No "dark mode as an afterthought" — every platform ships Sheet, Field, Chalk and Graphite together.
5. **Structure is not interaction.** `contour` blue draws linework; `accent` bronze is the only interactive colour; `brand` vermilion is the benchmark mark alone.

---

## 1. Core palette

| Role | Group | Sheet | Field | Chalk | Graphite | Notes |
|---|---|---|---|---|---|---|
| `bg` | Grounds | `#f6f8fb` | `#0d0f14` | `#f4f4f4` | `#0d0d0d` | Sheet / Field ground; cool near-white / near-black, never pure. On 16-color TTY, inherit terminal's own bg |
| `bg-subtle` | Grounds | `#eef2f6` | `#14171e` | `#ececec` | `#161616` | code fills, zebra, inactive modeline; x256 indices restore the elevation step the cool near-grounds otherwise collapse into bg on a 256-color TTY |
| `surface` | Grounds | `#e6ecf1` | `#1b1f28` | `#e2e2e2` | `#1f1f1f` | card / panel fill (active modeline bg); x256 pinned distinct from bg — see bg-subtle |
| `surface-raised` | Grounds | `#fcfdff` | `#232833` | `#fcfcfc` | `#282828` | plates, modals, dropdowns — above the sheet; x256 dark bumped to stay the most-elevated grayscale step. light quantizes to near-white already |
| `text` | Ink | `#23262e` | `#d6dae2` | `#2b2b2b` | `#dadada` | body (AAA); on 16-color TTY, inherit terminal's own fg |
| `text-muted` | Ink | `#565a63` | `#9aa0ab` | `#565656` | `#9a9a9a` | meta / captions / help (AA) |
| `text-heading` | Ink | `#12141a` | `#f2f4f8` | `#1a1a1a` | `#f2f2f2` | titles (AAA) |
| `text-faint` | Ink | `#878c95` | `#656b76` | `#7d7d7d` | `#6a6a6a` | graticule labels, disabled meta, decoration only (lint keeps faint off body/meta text) |
| `accent` | Bronze | `#6f3e00` | `#e0a33a` | `#000000` | `#ffffff` | bronze interactive accent, used as link text (AAA on every Sheet ground / AAA on the Field ground); ANSI slot 11 is always the bronze accent |
| `accent-hover` | Bronze | `#8a4d00` | `#f0b95c` | `#333333` | `#dcdcdc` | :hover / :active only — lifts one bronze step from the accent |
| `brand` | Bronze | `#b5450e` | `#ef8a4a` | `#3a3a3a` | `#e8e8e8` | benchmark vermilion — the maker's mark and datum triangle (large marks); distinct from status red |
| `contour` | Line | `#2f4fb0` | `#6f9be0` | `#4a4a4a` | `#b0b0b0` | structural Modus-blue linework — contour rings, dividers, diagram strokes; structure only, never interaction |
| `border` | Line | `#cfd6de` | `#2b303b` | `#cfcfcf` | `#333333` | default 1px survey hairline |
| `border-strong` | Line | `#aab4c0` | `#3a4150` | `#b0b0b0` | `#4a4a4a` | table heads, field hover |
| `decorator` | Line | `#7f8fb5` | `#39415a` | `#bdbdbd` | `#3d3d3d` | graticule / dashed rules (contour-faint) |
| `accent-subtle` | Bronze | `#e6e2dd` | `#262119` | `#dcdcdc` | `#242424` | opaque approximation of accent @ ~12% on bg |
| `selection-bg` | Bronze | `#ece0cf` | `#3a2f1c` | `#c8c8c8` | `#3a3a3a` | text selection highlight (bronze-tinted) |
| `cursor` | Bronze | `#6f3e00` | `#e0a33a` | `#000000` | `#ffffff` | input cursor (matches accent) |
| `scrim` | Grounds | `#14171e` | `#05060a` | `#141414` | `#050505` | modal/overlay scrim ink; emitted as translucent rgba --color-scrim in CSS (light 0.4, dark 0.55) |

Measured contrast against the page ground (`bg`):

| Role | Sheet ratio | Field ratio | Chalk ratio | Graphite ratio |
|---|---|---|---|---|
| `text` | 14.22:1 | 13.68:1 | 12.87:1 | 13.90:1 |
| `text-heading` | 17.30:1 | 17.41:1 | 15.82:1 | 17.36:1 |
| `text-muted` | 6.50:1 | 7.29:1 | 6.67:1 | 6.91:1 |
| `text-faint` | 3.18:1 | 3.58:1 | 3.74:1 | 3.59:1 |
| `accent` | 8.35:1 | 8.64:1 | 19.09:1 | 19.44:1 |
| `accent-hover` | 6.28:1 | 10.77:1 | 11.49:1 | 14.17:1 |
| `brand` | 5.16:1 | 7.67:1 | 10.34:1 | 15.86:1 |
| `contour` | 6.89:1 | 6.79:1 | 8.06:1 | 8.96:1 |

`text-faint` is decorative/disabled only — it is not a body-text colour.

## 2. Syntax / semantic family

Derived from **Emacs Modus** (Operandi light / Vivendi dark) so highlights are
identical in the editor, in web code blocks, in terminal `bat`/`delta`, and in
Charm TUI renderers. The bronze accent is deliberately **not** a syntax colour
— it is reserved for UI chrome and brand marks, never used for code.

### Syntax (font-lock)

| Role | Modus name | Sheet | Field | Chalk | Graphite |
|---|---|---|---|---|---|
| `syn-keyword` | magenta-cooler — purple keyword (Modus 4 verbatim) | `#531ab6` | `#b6a0ff` | `#1c1c1c` | `#ededed` |
| `syn-string` | blue-warmer — string (Modus 4 verbatim; 6.63:1 on the cool Sheet ground, hence the AA floor) | `#3548cf` | `#79a8ff` | `#3d3d3d` | `#bcbcbc` |
| `syn-number` | blue-cooler — constant (Modus styles numbers as fg-main; we borrow the constant slot so numbers stay distinct) | `#0000b0` | `#00bcff` | `#474747` | `#b0b0b0` |
| `syn-function` | magenta — function name (Modus 4 verbatim) | `#721045` | `#feacd0` | `#262626` | `#e0e0e0` |
| `syn-builtin` | magenta-warmer — builtin (Modus 4 verbatim) | `#8f0075` | `#f78fe7` | `#424242` | `#b6b6b6` |
| `syn-type` | cyan-cooler — type (Modus 4 verbatim) | `#005f5f` | `#6ae4b9` | `#2e2e2e` | `#d6d6d6` |
| `syn-variable` | cyan — variable (Modus 4 verbatim) | `#005e8b` | `#00d3d0` | `#333333` | `#c8c8c8` |
| `syn-comment` | fg-dim — comment (italic; Modus 4 verbatim); AA on every surface | `#595959` | `#989898` | `#5a5a5a` | `#8f8f8f` |
| `syn-docstring` | green-faint (Operandi) / cyan-faint (Vivendi) — docstring, per each edition's own Modus mapping | `#2a5045` | `#9ac8e0` | `#505050` | `#9a9a9a` |

### Status (project badges, flymake, diff markers, notifications)

| Role | Modus accent | ANSI slot | Sheet | Field | Chalk | Graphite |
|---|---|---|---|---|---|---|
| `status-err` | red | `red` | `#a60000` | `#f0685f` | `#1f1f1f` | `#f0f0f0` |
| `status-warn` | yellow-warmer (orange-leaning; avoids blue-vs-yellow tritanopia trap) | `yellow` | `#884900` | `#d9b34a` | `#454545` | `#b8b8b8` |
| `status-ok` | green | `green` | `#006800` | `#6bbf6b` | `#565656` | `#909090` |
| `status-info` | cyan-blue (teal-leaning for tritanopia) | `blue` | `#005e8b` | `#5fb8cf` | `#333333` | `#d0d0d0` |

Status colour never travels alone — every status carries a glyph **and** a word.

## 3. Terminal 16-color ANSI

The colour editions are "Jylhis Sheet" (light) / "Jylhis Field" (dark); the
monochrome editions are "Jylhis Chalk" (light) / "Jylhis Graphite" (dark).
Colour values pull from the Modus accent family so `ls`, `bat`, `delta`,
`git log` and Emacs `ansi-color` share one palette; the mono editions grade
the same slots to grayscale. ANSI 11 (bright-yellow) is the one intentional
brand override —
the bronze accent lands there so terminal warnings, directory permissions and
prompts carry the Jylhis identity.

| ANSI | Name | Sheet | Field | Chalk | Graphite | Role |
|---|---|---|---|---|---|---|
| 0 | black | `#23262e` | `#0d0f14` | `#242424` | `#0d0d0d` | text/bg inversion |
| 1 | red | `#a60000` | `#f0685f` | `#1f1f1f` | `#f0f0f0` | Modus red — errors |
| 2 | green | `#006800` | `#6bbf6b` | `#565656` | `#909090` | Modus green — ok |
| 3 | yellow | `#884900` | `#d9b34a` | `#454545` | `#b8b8b8` | Modus yellow-warmer — warnings |
| 4 | blue | `#0031a9` | `#79a8ff` | `#333333` | `#d0d0d0` | Modus blue — info |
| 5 | magenta | `#721045` | `#feacd0` | `#3a3a3a` | `#c8c8c8` | Modus magenta |
| 6 | cyan | `#005a5f` | `#6ae4b9` | `#4a4a4a` | `#b0b0b0` | Modus cyan-cooler |
| 7 | white | `#565a63` | `#c9dedf` | `#565656` | `#9a9a9a` | ANSI 7 — text-muted on Sheet, body-dim on Field |
| 8 | bright-black | `#878c95` | `#656b76` | `#7d7d7d` | `#6a6a6a` | faint |
| 9 | bright-red | `#b60000` | `#ff7f7f` | `#2a2a2a` | `#ffffff` | red-warmer |
| 10 | bright-green | `#316500` | `#70b900` | `#6a6a6a` | `#a5a5a5` | green-warmer |
| 11 | bright-yellow | `#6f3e00` | `#e0a33a` | `#000000` | `#ffffff` | bronze accent (intentional override — ANSI 11) |
| 12 | bright-blue | `#3548cf` | `#79a8ff` | `#404040` | `#dcdcdc` | Modus blue-warmer / contour |
| 13 | bright-magenta | `#531ab6` | `#b6a0ff` | `#4a4a4a` | `#d5d5d5` | Modus magenta-cooler |
| 14 | bright-cyan | `#005e8b` | `#00d3d0` | `#555555` | `#c0c0c0` | Modus cyan |
| 15 | bright-white | `#23262e` | `#f2f4f8` | `#1a1a1a` | `#f2f2f2` | ANSI 15 — text on Sheet, heading on Field |

**Selection bg / cursor:** `selection-bg` / `cursor`.

## 4. Typography

| Role | Family | Fallback |
|---|---|---|
| Display / titles | Zilla Slab | "Roboto Slab", Rockwell, Georgia, serif |
| UI / body | Hanken Grotesk | Inter, system-ui, -apple-system, "Segoe UI", sans-serif |
| Data / labels / code | IBM Plex Mono | "JetBrains Mono", "Cascadia Code", "Fira Code", ui-monospace, monospace |
| **TUI / Emacs / terminal fallback** | IBM Plex Mono | "IBM Plex Mono", "JetBrains Mono", Iosevka, "Fira Mono", "DejaVu Sans Mono", monospace |

Size scale: `3.25 / 2 / 1.4 / 1.15 / 1.0625 / 0.95 / 0.9 / 0.875 / 0.85 / 0.8125` — emitted as `--type-scale-0…9` in
`tokens.css`; headings consume the vars so sizes cannot drift.

Line height: `1.05` for plate titles, `1.6` for body, `1.3` for TUI / dense lists.

### Scaling

Every step is a `rem` multiple of the root font size, and the system never
sets `html { font-size }` — so all text answers to the reader's browser
setting, not just to zoom.

| Floor | Value | Step | Applies to |
|---|---|---|---|
| Readable | `0.9rem` | `--type-scale-6` | anything a user must read — prose, help text, labels, table cells, code |
| Absolute | `0.8125rem` | `--type-scale-9` | glanceable chrome only — uppercase mono labels, badges, keycaps, refs |

Emitted as `--type-readable-min` / `--type-floor`. Relative (`em`) sizes below `0.85em` must be floored with `max(…, var(--type-floor))` so nesting cannot compound below the hard minimum.

Fluid type: `clamp(<rem-min>, <rem-base> + <vw>, <rem-max>)` — the middle term must carry a `rem` component, or the size stops responding to the reader's font size between the bounds.

Targets: text resize to **200%** (WCAG 1.4.4), reflow at **320px** / **400%** zoom (1.4.10), and the 1.4.12 text-spacing set (line-height `1.5`, letter-spacing `0.12em`, word-spacing `0.16em`, paragraph-spacing `2em`).

Enforced by `scripts/validate-a11y-type.mjs`; specified in `docs/ACCESSIBILITY.md`.

## 5. Density

| Token | Web comfortable | Web compact | TUI/Emacs |
|---|---|---|---|
| `line-height` | 1.6 | 1.5 | 1.3 |
| `row-pad-y` | 0.75rem | 0.375rem | 2px |
| `hit-target-min` | 44px | 36px | n/a |
| `gap-inline` | 0.75rem | 0.5rem | 1ch |
| `gap-block` | 1.5rem | 1rem | 1 line |

Default: **comfortable** on web, **TUI** in terminal / Emacs. Compact is an
opt-in for data-dense UI (tables, file lists).

## 6. Motion

Every token is defined in both CSS and Hyprland (named bezier).

| Token | Duration | Easing (CSS) | Hypr bezier |
|---|---|---|---|
| `fast` | 150ms | `cubic-bezier(0.25, 0.1, 0.25, 1)` | `0.25,0.1,0.25,1` |
| `base` | 250ms | `cubic-bezier(0.2, 0.6, 0.2, 1)` | `0.2,0.6,0.2,1` |
| `slow` | 300ms | `cubic-bezier(0.16, 1, 0.3, 1)` | `0.16,1,0.3,1` |
| `survey` | 480ms | `cubic-bezier(0.2, 0.8, 0.2, 1)` | `0.2,0.8,0.2,1` |

The signature is "survey renders in": `contour-draw`, `line-extend`, `readout`
(see `motion.css`). Motion is *functional* — masking repaint, suggesting
direction — never decorative. Nothing bounces. Reduce-motion respected
everywhere.

## 7. Sound / notification vocabulary

Three tones only. Mapped to `libcanberra` sound theme names so GNOME/KDE/mako
can pick them up.

| Token | Sound theme name | Meaning |
|---|---|---|
| `sound-tap` | `bell` | generic acknowledgement |
| `sound-error` | `dialog-error` | something went wrong |
| `sound-complete` | `complete` | long task finished |

No continuous / ambient sounds. Default volume: 60%.
