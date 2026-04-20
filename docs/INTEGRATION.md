# Integration Guide

How to consume the Jylhis design system from a real project. The canonical
spec is [`tokens.md`](../tokens.md); every snippet below is derived from it.

---

## Web (CSS)

Copy `colors_and_type.css` into your project and import it once at the top
of your global stylesheet:

```css
@import "./vendor/jylhis/colors_and_type.css";

html { background: var(--color-bg); color: var(--color-text); }
a { color: var(--color-accent); }
a:hover { color: var(--color-accent-hover); }
```

Toggle dark mode by setting `data-theme="dark"` on `<html>` or `<body>`:

```js
document.documentElement.dataset.theme =
  matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "";
```

Fonts are loaded from Google Fonts for prototyping. To self-host, vendor
the Literata and JetBrains Mono `woff2` files into a `fonts/` folder and
swap the `@import` at the top of `colors_and_type.css` for `@font-face`
declarations.

Only use the semantic tokens — never hard-code hex values. If a token is
missing for a use case, add it to `tokens.md` first, regenerate the CSS
entry, then consume it.

### Focus, keyboard, kbd

See `platforms/KEYBOARD.md` for the 2px-at-AAA focus ring, the kbd chip
recipe, the command-palette layout, and the selected-item specification.
These are shared across web, Emacs, and rofi.

---

## Go / Charm TUI

```bash
go get github.com/jylhis/design/platforms/charm/jylhis
```

```go
import "github.com/jylhis/design/platforms/charm/jylhis"

t := jylhis.NewTheme(jylhis.Paper) // or jylhis.Roast
fmt.Println(t.Title.Render("Notes"))
fmt.Println(t.Subtle.Render("7 files · updated 2m ago"))
```

Inside Bubble Tea, use `jylhis.Detect(os.Stdin, os.Stdout)` or listen for
`tea.BackgroundColorMsg` to auto-select Paper vs. Roast based on terminal
background luminance. See `platforms/charm/README.md` for the full API and
the runnable demo under `platforms/charm/demo/`.

---

## Terminal (Ghostty + shell)

1. Drop `platforms/ghostty/jylhis-paper` and `jylhis-roast` into
   `~/.config/ghostty/themes/`.
2. Reference one from your Ghostty config: `theme = jylhis-paper`.
3. Source `platforms/shell/bashrc.bash` or `zshrc.zsh` from your dotfiles,
   and copy `starship.toml` to `~/.config/starship.toml`.
4. `eval $(dircolors platforms/shell/dircolors)` wires `ls` / `eza` to the
   same ANSI palette.

ANSI 11 is always the brand copper (`#b5703c` light, `#e89b5e` dark).
That's intentional — prompts and directory permissions carry the Jylhis
identity.

---

## Emacs

Load the theme file from your `init.el`:

```elisp
(add-to-list 'custom-theme-load-path
             "~/path/to/design/platforms/emacs/")
(load-theme 'jylhis-paper t)
;; or: (load-theme 'jylhis-roast t)

;; Optional light/dark toggle (binds C-c T by default):
(load-file "~/path/to/design/platforms/emacs/jylhis-theme-toggle.el")
```

---

## Wayland / Linux desktop

- **Hyprland:** `source = /path/to/platforms/hyprland/jylhis.conf`
- **Waybar:** `include-path` the CSS in `platforms/waybar/`
- **Mako:** symlink `platforms/mako/config` to `~/.config/mako/config`
- **Rofi:** set `@theme "platforms/rofi/jylhis-paper"` (or `jylhis-roast`)
- **GTK 3/4:** import `platforms/gtk/gtk.css` from your user GTK stylesheet
- **Kvantum/Qt:** point `kvantummanager` at `platforms/kvantum/`

---

## Adding a new platform

1. **Read `tokens.md`** top to bottom. Every value you need is there.
2. **Never hard-code hex twice.** Parse or copy from `platforms/charm/jylhis/palette.go`
   when the target language is Go; otherwise mirror tokens.md by hand.
3. **Keep ANSI 11 as the brand copper.** That's the one intentional override
   across all terminal-adjacent targets.
4. **Ship both modes.** Light (Paper) and dark (Roast) are first-class. Do
   not ship a dark-only or light-only theme.
5. **Add your target to `scripts/validate-tokens.mjs`** so CI catches drift.
   At minimum, declare the file and which tokens.md role each hex maps to.
6. **Update `README.md` index table** and add a card to
   `platforms/index.html`.
7. **Add an entry to `CHANGELOG.md`** under the next unreleased version.

---

## Validation

Run the token validator before committing:

```bash
node scripts/validate-tokens.mjs
```

It verifies:

- Every hex in `colors_and_type.css`, `platforms/charm/jylhis/palette.go`,
  and `platforms/ghostty/jylhis-*` matches `tokens.md`.
- CSS custom property names follow the `--[a-z][a-z0-9-]*` pattern.
- Every `var(--foo)` reference in `colors_and_type.css` is declared.
- Body-text contrast ratios meet the AAA claim in tokens.md.

CI runs the same check on every push and pull request.

---

## Versioning

The design system follows semver. See [`CHANGELOG.md`](../CHANGELOG.md).

- **Major** — renaming or removing a token, changing the meaning of an
  existing token, breaking the platforms index layout.
- **Minor** — adding a token, adding a platform target, adding a preview
  card.
- **Patch** — contrast-preserving hex tweaks, doc fixes, tooling changes.

Consumers should pin a specific tag or commit SHA.
