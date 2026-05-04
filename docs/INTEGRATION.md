# Integration Guide

How to consume the Jylhis design system from a real project. The canonical
source of truth is [`tokens.json`](../tokens.json); every platform file is
generated from it by `bun scripts/generate.mjs`.

---

## Web (CSS)

Copy `tokens.css` and `colors_and_type.css` into your project and import
the latter (it imports `tokens.css` internally):

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
missing for a use case, add it to `tokens.json` first, run `bun scripts/generate.mjs`,
then consume it.

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

### Nix (Ghostty with themes)

```nix
# In your NixOS or home-manager config:
ghostty-jylhis = pkgs.callPackage /path/to/design/nix/ghostty.nix {};
```

This wraps Ghostty so that `theme = jylhis-paper` and `theme = jylhis-roast`
work out of the box without manually copying files.

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

### Nix (Emacs package)

```nix
programs.emacs.extraPackages = epkgs: [
  (pkgs.callPackage /path/to/design/nix/emacs.nix {
    inherit (epkgs) trivialBuild;
  })
];
```

---

## Wayland / Linux desktop

### Hyprland

Source the shared file, the variant file, and (optionally) the keybinds
file from `~/.config/hypr/hyprland.conf`. Order matters — variant must
come after the shared base because it overrides `general:col.*` and
`decoration:col.shadow`:

```
source = ~/.config/hypr/jylhis.conf            # shared (general/decoration/animations)
source = ~/.config/hypr/jylhis-roast.conf      # or jylhis-paper.conf
source = ~/.config/hypr/jylhis-keys.conf       # optional
# … your overrides below …
```

### Other Wayland targets

- **Waybar:** `include-path` the CSS in `platforms/waybar/`
- **Mako:** symlink `platforms/mako/config` to `~/.config/mako/config`
- **Rofi:** set `@theme "platforms/rofi/jylhis-paper"` (or `jylhis-roast`)
- **GTK 3/4:** import `platforms/gtk/gtk.css` from your user GTK stylesheet
- **Kvantum/Qt:** point `kvantummanager` at `platforms/kvantum/`

### Stylix base16 one-liner

If you use Stylix, the generated base16 YAML is shipped at a stable
path under the Nix derivation — point Stylix at it directly:

```nix
stylix.base16Scheme = "${pkgs.jylhis-themes}/share/jylhis/base16/jylhis-roast.yaml";
# or jylhis-paper.yaml
```

This avoids re-deriving the palette in your config.

---

## Coexisting with Stylix

Importing the Jylhis Home-Manager module on a system that also runs
Stylix produces several `home.sessionVariables` and config-file
collisions, because both projects target the same applications.

The Jylhis HM module is authoritative for the targets it owns
(`mkForce` on the FZF colors). To avoid the collision, disable
the duplicated Stylix targets on the Home-Manager side:

```nix
stylix.targets = {
  fzf.enable      = false;
  bat.enable      = false;
  gtk.enable      = false;
  starship.enable = false;
  hyprland.enable = false;
  waybar.enable   = false;
  mako.enable     = false;
  ghostty.enable  = false;
  hyprlock.enable = false;
  console.enable  = false;
};
```

Stylix's `qt` target can stay enabled — it derives Qt colors from the
base16 palette, which can also come from `jylhis-themes` via the
`stylix.base16Scheme` one-liner above.

---

## Adding a new platform

1. **Read `tokens.json`** — every value you need is there.
2. **Add a generator** in `scripts/generate.mjs` that reads from `tokens.json`
   and writes the platform file. Register the output with `out()`.
3. **Keep ANSI 11 as the brand copper.** That's the one intentional override
   across all terminal-adjacent targets.
4. **Ship both modes.** Light (Paper) and dark (Roast) are first-class. Do
   not ship a dark-only or light-only theme.
5. **Update `README.md` index table** and add a card to
   `platforms/index.html`.
6. **Add an entry to `CHANGELOG.md`** under the next unreleased version.

---

## Generation

All platform files are generated from `tokens.json`:

```bash
bun scripts/generate.mjs          # generate all targets
bun scripts/generate.mjs --check  # verify committed files match (CI mode)
```

---

## Validation

Run the token validator before committing:

```bash
bun scripts/validate-tokens.mjs
```

It verifies:

- `tokens.json` schema: required fields, hex format
- WCAG contrast ratios meet the AAA/AA claims in tokens.json
- Every `var(--foo)` reference in `colors_and_type.css` is declared

CI runs both generation check and validation on every push and pull request.

---

## Versioning

The design system follows semver. See [`CHANGELOG.md`](../CHANGELOG.md).

- **Major** — renaming or removing a token, changing the meaning of an
  existing token, breaking the platforms index layout.
- **Minor** — adding a token, adding a platform target, adding a preview
  card.
- **Patch** — contrast-preserving hex tweaks, doc fixes, tooling changes.

Consumers should pin a specific tag or commit SHA.
