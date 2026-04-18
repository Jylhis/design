# Jylhis Design System — Platform Tokens

This is the **canonical palette spec**. Every platform-specific file in `platforms/` derives from this table. When a color changes, update the table here first, then propagate to each target by hand (small palette, controlled drift is acceptable).

## 0. Principles

1. **Warm paper, earth copper.** One accent (copper/amber). Everything else is a muted brown/taupe family. No pure white, no pure black.
2. **AAA for body text, AA for meta, no exceptions.** Contrast ratios are inlined in the core palette table below.
3. **Keyboard is first-class on every surface.** Focus must be visible in 2px at AAA contrast. Shortcuts are always labeled. Selected items share one visual language across web, Emacs, rofi.
4. **Both light and dark are first-class.** No "dark mode as an afterthought" — every platform ships both.
5. **Earth-toned ANSI.** Red/green/blue are compromised toward the brand palette. Real red is reserved for errors only.

---

## 1. Core palette

| Role | Light | Dark | Notes |
|---|---|---|---|
| `bg` | `#faf7f2` | `#1a1714` | warm paper / dark roast |
| `bg-subtle` | `#f0ebe3` | `#242019` | |
| `surface` | `#e8e1d6` | `#2a2520` | card fill |
| `surface-raised` | `#fefdfb` | `#363230` | modals, elevated |
| `text` | `#2c2825` | `#e8e0d4` | body (AAA 13.7 / 13.6) |
| `text-muted` | `#6b5f54` | `#b0a496` | meta (AA 5.8 / AAA 7.3) |
| `text-heading` | `#1e1b18` | `#f0eae0` | titles (AAA 16.0) |
| `text-faint` | `#8a7f72` | `#8a7f72` | decorators, disabled only |
| `accent` | `#9a5a2a` | `#e89b5e` | copper UI accent (AA / AAA) |
| `accent-hover` | `#7a4622` | `#f5b07a` | |
| `brand` | `#b5703c` | `#d4884a` | literal logo copper (large marks) |
| `border` | `#d5cec4` | `#3d3830` | |
| `border-strong` | `#b0a898` | `#5a5248` | |
| `decorator` | `#c4baa8` | `#4a4338` | dashed rules |

## 2. Syntax / semantic family

Derived from **Emacs Modus** (Operandi light / Vivendi dark) so highlights are
identical in the editor, in web code blocks, in terminal `bat`/`delta`, and in
Charm TUI renderers. The copper brand accent is deliberately **not** a syntax
colour — it's reserved for UI chrome and brand marks, never used for code.

### Syntax (font-lock)

| Role | Modus name | Light | Dark |
|---|---|---|---|
| `syn-keyword` | magenta-cooler | `#531ab6` | `#b6a0ff` |
| `syn-string` | blue-cooler / blue-warmer | `#0000b0` | `#79a8ff` |
| `syn-number` / constant | blue-warmer / blue-cooler | `#3548cf` | `#00bcff` |
| `syn-function` | magenta | `#721045` | `#feacd0` |
| `syn-builtin` | magenta-warmer | `#8f0075` | `#f78fe7` |
| `syn-type` / `syn-tag` | cyan-cooler | `#005f5f` | `#6ae4b9` |
| `syn-variable` | cyan | `#005e8b` | `#2fafff` |
| `syn-comment` | red-faint | `#7f1010` | `#ff9f80` |
| `syn-docstring` | green-faint | `#2a5045` | `#88c0a1` |

### Status (shared by project badges, flymake, diff markers, notifications)

| Role | Modus accent | Light | Dark |
|---|---|---|---|
| `status-err` | red | `#a60000` | `#ff5f59` |
| `status-warn` | yellow | `#6f5500` | `#d0bc00` |
| `status-ok` | green | `#006800` | `#44bc44` |
| `status-info` | blue | `#0031a9` | `#2fafff` |

## 3. Terminal 16-color ANSI

Light mode is "Jylhis Paper"; dark is "Jylhis Roast". Values pull directly from
the Modus accent family so `ls`, `bat`, `delta`, `git log` and Emacs
`ansi-color` share one palette. ANSI 11 (bright-yellow) is the one intentional
brand-override — the copper lands there so terminal warnings, directory
permissions and prompts carry the Jylhis identity.

| ANSI | Name | Light | Dark | Role |
|---|---|---|---|---|
| 0 | black | `#2c2825` | `#1a1714` | text/bg inversion |
| 1 | red | `#a60000` | `#ff5f59` | Modus red — errors |
| 2 | green | `#006800` | `#44bc44` | Modus green — ok / syn-docstring |
| 3 | yellow | `#6f5500` | `#d0bc00` | Modus yellow — warnings |
| 4 | blue | `#0031a9` | `#2fafff` | Modus blue — info / syn-variable |
| 5 | magenta | `#721045` | `#feacd0` | Modus magenta — syn-function |
| 6 | cyan | `#005f5f` | `#6ae4b9` | Modus cyan-cooler — syn-type/tag |
| 7 | white | `#e8e1d6` | `#e8e0d4` | |
| 8 | bright-black | `#8a7f72` | `#6b6157` | faint |
| 9 | bright-red | `#972500` | `#ff7f7f` | red-warmer |
| 10 | bright-green | `#315b00` | `#70b900` | green-warmer |
| 11 | bright-yellow | `#b5703c` | `#e89b5e` | **brand copper** (intentional override) |
| 12 | bright-blue | `#3548cf` | `#79a8ff` | blue-warmer — syn-number/constant |
| 13 | bright-magenta | `#531ab6` | `#b6a0ff` | magenta-cooler — syn-keyword |
| 14 | bright-cyan | `#005e8b` | `#00d3d0` | cyan — syn-variable |
| 15 | bright-white | `#fefdfb` | `#f0eae0` | |

**Selection bg / cursor:** `accent-subtle` / `accent`.

## 4. Typography

| Role | Family | Fallback |
|---|---|---|
| Body | Literata (variable, OFL) | Charter, Georgia, serif |
| Mono / headings | JetBrains Mono (variable, OFL) | IBM Plex Mono, Fira Code, Cascadia Code, Courier New, monospace |
| **TUI / Emacs / terminal fallback** | JetBrains Mono | **Iosevka → IBM Plex Mono → Fira Mono → DejaVu Sans Mono → monospace** |

Size scale: `2 / 1.4 / 1.15 / 1 / 0.85 / 0.75 / 0.72 / 0.65` rem.
Line height: `1.25` for headings, `1.65` for body, `1.3` for TUI / dense lists.

## 5. Density

| Token | Web comfortable | Web compact | TUI/Emacs | Role |
|---|---|---|---|---|
| `line-height` | 1.65 | 1.5 | 1.3 | base |
| `row-pad-y` | 12px | 6px | 2px | list rows |
| `hit-target-min` | 44px | 36px | n/a | interactive |
| `gap-inline` | 12px | 8px | 1ch | chips, tags |
| `gap-block` | 24px | 16px | 1 line | sections |

Default: **comfortable** on web, **TUI** in terminal / Emacs. Compact is an opt-in for data-dense UI (tables, file lists).

## 6. Motion

Every token is defined in both CSS (seconds) and Hyprland (deciseconds + bezier).

| Token | Duration | Easing (CSS) | Hypr bezier |
|---|---|---|---|
| `fast` | 150ms | `cubic-bezier(0.25, 0.1, 0.25, 1)` | `0.25,0.1,0.25,1` |
| `base` | 250ms | `cubic-bezier(0.2, 0.6, 0.2, 1)` | `0.2,0.6,0.2,1` |
| `slow` | 300ms | `cubic-bezier(0.16, 1, 0.3, 1)` | `0.16,1,0.3,1` |
| `spring` | 420ms | `cubic-bezier(0.34, 1.25, 0.64, 1)` | `0.34,1.25,0.64,1` |

Philosophy: motion is *functional* (masking repaint, suggesting direction). Never decorative. Reduce-motion respected everywhere.

## 7. Sound / notification vocabulary

Three tones only. Mapped to `libcanberra` sound theme names so GNOME/KDE/mako can pick them up.

| Token | Sound theme name | Meaning |
|---|---|---|
| `sound-tap` | `bell` | generic acknowledgement (notification land) |
| `sound-error` | `dialog-error` | something went wrong |
| `sound-complete` | `complete` | long task finished |

No continuous / ambient sounds. Default volume: 60%.

## 8. Iconography (non-web)

- **Web:** Unicode glyphs only (`›`, `▸`, `»`, `☾`, `★`, `└──`). No icon font.
- **TUI / Waybar / Rofi:** Nerd Font glyphs (CodiconFont subset). Shortlist: `` (home) `` (file) `` (folder) `` (git) `` (terminal) `` (nix) `` (package) `` (bell) `` (warn) `` (ok) `` (err) `` (gear). Font fallback for systems without Nerd Fonts: Unicode equivalents (`~`, `•`, `▸`, etc.).
- **Emacs:** `all-the-icons` → same Nerd Font codepoints. Modeline segments use Unicode `▸ ` `☾ ` `▲ ` as minor decorators.

## 9. Keyboard primitives

See `platforms/KEYBOARD.md`. Summary:
- **Focus ring:** 2px solid `accent`, 2px offset, 2px radius. AAA on every bg. Never removed.
- **kbd:** `border: 1px solid border-strong; background: bg-subtle; color: text-muted; font: mono 0.7em; padding: 0.15em 0.4em; border-radius: 3px;`
- **Leader key:** after hold, a bottom-anchored cheatsheet appears (which-key style). Paper bg, accent left-border, monospace.
- **Command palette:** centered modal, `bg-subtle` backdrop at 85% opacity, 560px max, `>` prefix, selected row uses `accent-subtle` bg + `accent` left-border. Identical on web (Orama), Emacs (`M-x`/Vertico), rofi.
- **Selected item:** `accent-subtle` background + `accent` 3px left-border. No other marker.
- **Dismiss:** ESC always labeled in top-right of modals. Never hidden.

---

## Change log

See [`CHANGELOG.md`](./CHANGELOG.md) for versioned history. Summary of the `0.1.0` release: initial spec extracted from `colors_and_type.css`; ANSI / density / motion / sound / icon / keyboard sections added; Charm TUI target landed; fish dropped in favour of bash + zsh; body/mono switched to Literata + JetBrains Mono; syntax / status / ANSI palettes swapped to Emacs Modus so highlights stay uniform across Emacs, web, terminal, and TUI, with brand copper retained on UI accent and ANSI 11.
