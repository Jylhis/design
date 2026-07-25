# Integration Guide

How to consume the Jylhis design system from a real project. The canonical
source of truth is [`tokens.json`](../tokens.json); every platform file is
generated from it by `bun scripts/generate.mjs`.

---

## Nix (flake — preferred)

The repository is a flake. Pin it as an input and use the exposed
modules, overlay, and packages directly — no `callPackage` boilerplate
or wrapper packages needed.

```nix
{
  inputs.jylhis-design.url = "github:Jylhis/design";

  outputs = { self, nixpkgs, home-manager, jylhis-design, ... }: {
    homeConfigurations.you = home-manager.lib.homeManagerConfiguration {
      pkgs = import nixpkgs {
        system = "x86_64-linux";
        overlays = [ jylhis-design.overlays.default ];
      };
      modules = [
        jylhis-design.homeManagerModules.default   # or homeModules.default
        ({ ... }: {
          jylhis.theme.enable  = true;
          jylhis.theme.variant = "field";          # or "sheet"
        })
      ];
    };
  };
}
```

After enabling the overlay, `pkgs.jylhis-themes` is available with the
full theme tree under `${pkgs.jylhis-themes}/share/jylhis/`. Per-target
packages (`pkgs.jylhis-themes-targets.waybar`, `…bat`, `…scripts`, …)
expose just one target's files — useful when you only need a single
slice of the system.

Direct package builds:

```bash
nix build github:Jylhis/design#default        # all themes
nix build github:Jylhis/design#waybar         # just waybar/* + tokens
nix build github:Jylhis/design#ghostty-jylhis # ghostty wrapper
```

Available per-target attributes correspond to the keys in
[`nix/install-map.nix`](../nix/install-map.nix).

### Reading the palette in Nix

When you theme an application yourself and just need the colors, call
`lib.mkPalette` instead of parsing `tokens.json` by hand. It reads the
pinned `tokens.json` and returns the palette in the shapes Nix configs
actually use — no `pkgs`, no build:

```nix
let p = inputs.jylhis-design.lib.mkPalette "field";   # or "sheet"
in {
  # role → hex (keeps the leading "#")
  wayland.windowManager.hyprland.settings.general."col.active_border" =
    "rgb(${lib.removePrefix "#" p.hex.accent})";

  # ready-made base16 attrset, the 16-slot ANSI list, or the
  # TTY-readable variant (slots 0/7/15 remapped):
  # p.base16   p.ansi16   p.tty16   p.ansi."bright-yellow"
}
```

`mkPalette` accepts `"sheet"`/`"field"` or `"light"`/`"dark"`. The `base16`
attr equals the shipped `platforms/base16/*.yaml`; `tty16` matches the
console target's slot 0/7/15 override.

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
the Zilla Slab, Hanken Grotesk, and IBM Plex Mono `woff2` files into a `fonts/` folder and
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

t := jylhis.NewTheme(jylhis.Sheet) // or jylhis.Field
fmt.Println(t.Title.Render("Notes"))
fmt.Println(t.Subtle.Render("7 files · updated 2m ago"))
```

Inside Bubble Tea, use `jylhis.Detect(os.Stdin, os.Stdout)` or listen for
`tea.BackgroundColorMsg` to auto-select Sheet vs. Field based on terminal
background luminance. See `platforms/charm/README.md` for the full API and
the runnable demo under `platforms/charm/demo/`.

### Glamour (terminal Markdown)

`platforms/glamour/jylhis-{sheet,field,notty}.json` are Charm
[Glamour](https://github.com/charmbracelet/glamour) stylesheets — the format
that renders Markdown in `glow`, `gh`, `glab`, and any Bubble Tea app. Code
blocks use the Modus syntax roles, so a fenced block reads identically in the
terminal, in Emacs, and on the web. `notty` is the same theme with every colour
and attribute stripped — a clean, pipe- and screen-reader-friendly plain render.

Select a style by path with the `GLAMOUR_STYLE` env var, or per-invocation:

```bash
export GLAMOUR_STYLE=$PWD/platforms/glamour/jylhis-field.json
glow README.md
gh pr view 42                       # gh honours GLAMOUR_STYLE too
glow -s platforms/glamour/jylhis-notty.json CHANGELOG.md | less   # colourless
```

In a Bubble Tea app, load it with
`glamour.NewTermRenderer(glamour.WithStylePath("…/jylhis-field.json"))`, or
`glamour.WithAutoStyle()` to pick Sheet vs. Field from the terminal background.

---

## Terminal (Ghostty + shell)

1. Drop `platforms/ghostty/jylhis-sheet` and `jylhis-field` into
   `~/.config/ghostty/themes/`.
2. Reference one from your Ghostty config: `theme = jylhis-sheet`.
3. Source `platforms/shell/bashrc.bash` or `zshrc.zsh` from your dotfiles,
   and copy `starship.toml` to `~/.config/starship.toml`.
4. `eval $(dircolors platforms/shell/dircolors)` wires `ls` / `eza` to the
   same ANSI palette.

ANSI 11 is always the bronze accent (`#8a4d00` light, `#e0a33a` dark).
That's intentional — prompts and directory permissions carry the Jylhis
identity.

### Nix (Ghostty with themes)

With flakes (preferred):

```nix
environment.systemPackages = [ jylhis-design.packages.${system}.ghostty-jylhis ];
```

Without flakes:

```nix
ghostty-jylhis = pkgs.callPackage /path/to/design/nix/ghostty.nix {};
```

Either form wraps Ghostty so `theme = jylhis-sheet` and
`theme = jylhis-field` work out of the box without manually copying files.

---

## Emacs

Load the theme file from your `init.el`:

```elisp
(add-to-list 'custom-theme-load-path
             "~/path/to/design/platforms/emacs/")
(load-theme 'jylhis-sheet t)
;; or: (load-theme 'jylhis-field t)

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

With flakes the same callPackage works against
`jylhis-design.outPath`, e.g.
`pkgs.callPackage "${jylhis-design}/nix/emacs.nix" { inherit (epkgs) trivialBuild; }`.
A dedicated emacs flake output is not exposed because it depends on
`epkgs.trivialBuild`, which is only available inside
`programs.emacs.extraPackages`.

---

## Wayland / Linux desktop

### Hyprland

Source the shared file, the variant file, and (optionally) the keybinds
file from `~/.config/hypr/hyprland.conf`. Order matters — variant must
come after the shared base because it overrides `general:col.*` and
`decoration:col.shadow`:

```
source = ~/.config/hypr/jylhis.conf            # shared (general/decoration/animations)
source = ~/.config/hypr/jylhis-field.conf      # or jylhis-sheet.conf
source = ~/.config/hypr/jylhis-keys.conf       # optional
# … your overrides below …
```

### Other Wayland targets

- **Waybar:** `include-path` the CSS in `platforms/waybar/`
- **Hyprlock:** source `platforms/hyprlock/jylhis-sheet.conf` (or
  `jylhis-field.conf`) from `~/.config/hypr/hyprlock.conf`. It ships colors,
  fonts, and field layout only — add your `auth`, `grace`, and monitor
  settings below the source line.
- **Mako:** symlink `platforms/mako/config` to `~/.config/mako/config`
- **Rofi:** set `@theme "platforms/rofi/jylhis-sheet"` (or `jylhis-field`)
- **GTK 3/4:** import `platforms/gtk/gtk.css` from your user GTK stylesheet
- **Kvantum/Qt:** point `kvantummanager` at `platforms/kvantum/`

### Sharing one `jylhis-design` pin across consumers

If your flake pulls in another flake that itself depends on
`jylhis-design`, pin both to the same revision with `follows`:

```nix
inputs.<that-flake>.inputs.jylhis-design.follows = "jylhis-design";
```

This avoids two copies of the design system in your closure and stops
silent palette drift between the two pins.

### Stylix base16 one-liner

If you use Stylix, the generated base16 YAML is shipped at a stable
path under the Nix derivation — point Stylix at it directly:

```nix
stylix.base16Scheme = "${pkgs.jylhis-themes}/share/jylhis/base16/jylhis-field.yaml";
# or jylhis-sheet.yaml
```

Or use the helper exposed by the flake (returns the same path):

```nix
stylix.base16Scheme =
  inputs.jylhis-design.lib.variantToBase16Scheme pkgs "field";
```

This avoids re-deriving the palette in your config.

### NixOS / Darwin system module

For system-wide Stylix wiring, import the system module instead of
hand-writing `stylix.base16Scheme`:

```nix
# NixOS configuration.nix
{ inputs, ... }: {
  imports = [ inputs.jylhis-design.nixosModules.default ];
  jylhis.theme = { enable = true; variant = "field"; };
}

# nix-darwin
{ inputs, ... }: {
  imports = [ inputs.jylhis-design.darwinModules.default ];
  jylhis.theme = { enable = true; variant = "sheet"; };
}
```

The module sets `stylix.enable` (via `mkDefault`), `stylix.polarity`,
and `stylix.base16Scheme` from one variant choice. Per-target Stylix
toggles (`stylix.targets.*.enable`) stay yours to set — see
"Coexisting with Stylix" below for the list to disable when also
importing the Home-Manager module.

### Variant switching

A small shell helper at `platforms/scripts/jylhis-theme-toggle.sh`
flips between sheet and field and reloads waybar / mako / hyprland.
It mirrors `platforms/emacs/jylhis-theme-toggle.el` for the desktop
side, so a single keybind can flip both.

```bash
# Path under the Nix package:
$(jylhis-themes)/share/jylhis/scripts/jylhis-theme-toggle.sh

# Bind in Hyprland:
bind = SUPER SHIFT, T, exec, ~/.local/bin/jylhis-theme-toggle.sh
```

State lives at `$XDG_STATE_HOME/jylhis/active-theme` (defaults to
`~/.local/state/jylhis/active-theme`). The script writes atomically
and prints the new variant on stdout for callers that want to chain.

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

### Handing off targets to another HM module

If another Home-Manager module in your config writes the same files
(Ghostty, Mako, Waybar, Hyprland, Starship, FZF, GTK, bat), let it own
those targets and disable the Jylhis side per-target:

```nix
jylhis.theme = {
  enable  = true;
  variant = "field";
  ghostty.enable  = false;
  mako.enable     = false;
  waybar.enable   = false;
  gtk.enable      = false;
  starship.enable = false;
  fzf.enable      = false;
  bat.enable      = false;
};
```

Combine with the system module above to keep the Stylix palette pin
authoritative — the other module's targets pick the palette up via
Stylix, no duplicate paths.

---

## Boot path (Plymouth + NixOS console)

The boot path is covered end-to-end so the look stays cohesive from
power-on to login: Plymouth splash → kernel TTY palette → greeter →
desktop.

### Plymouth splash

A minimal text-and-spinner Plymouth theme is shipped per variant.
No PNG assets — every color is derived from `tokens.json` at
generation time, so the splash always matches the active palette.

```nix
{ pkgs, ... }:
{
  boot.plymouth = {
    enable = true;
    themePackages = [ pkgs.jylhis-themes ];
    theme = "jylhis-field";  # or "jylhis-sheet"
  };
}
```

Plymouth searches `themePackages` for `share/plymouth/themes/<theme>`,
so a small overlay (or a shim package) may be needed to symlink
`share/jylhis/plymouth/jylhis-{sheet,field}/` into the path Plymouth
expects:

```nix
nixpkgs.overlays = [(final: prev: {
  plymouth-theme-jylhis = final.runCommand "plymouth-theme-jylhis" {} ''
    mkdir -p $out/share/plymouth/themes
    ln -s ${final.jylhis-themes}/share/jylhis/plymouth/jylhis-sheet $out/share/plymouth/themes/jylhis-sheet
    ln -s ${final.jylhis-themes}/share/jylhis/plymouth/jylhis-field $out/share/plymouth/themes/jylhis-field
  '';
})];
boot.plymouth.themePackages = [ pkgs.plymouth-theme-jylhis ];
```

Untested on real hardware; verified by `nix build` only. Boot-test
in a NixOS VM before rolling out.

### Linux virtual console

The Linux virtual console (`Ctrl-Alt-F1..F6`) reads its 16-color
palette from `console.colors`. The Jylhis console palette is shipped
as a ready-to-import NixOS fragment:

```nix
imports = [
  "${pkgs.jylhis-themes}/share/jylhis/console/jylhis-field.nix"
  # or jylhis-sheet.nix
];
```

After `nixos-rebuild switch`, the kernel TTY and any greeter that
inherits the console palette (tuigreet over `console-on-tty1`, etc.)
will use the Jylhis colors. ANSI 11 is intentionally the bronze accent
across all targets, so prompts and active controls carry the Jylhis
identity from the very first line of console output.

The console palette is **not** a verbatim copy of `tokens.ansi` — slot
0 (background), slot 7 (default foreground), and slot 15 (bright
foreground) are derived from the semantic palette (`bg`, `text`,
`text-heading`) so the kernel TTY renders readably in both Sheet and
Field. The kernel virtual console uses slot 0 as the actual background
and has no separate page-bg channel, so the "text/bg inversion" role
that `ansi.black` carries for terminal apps doesn't apply here.

---

## Greeters (tuigreet / regreet)

Login greeters render in the kernel/console palette, so they pick up
whatever the active console palette looks like — there's no separate
Jylhis theme file to drop in. The mapping below is what you should
pass to `tuigreet --theme` (or set in regreet's TOML) to get a
coherent look across boot → login → desktop.

| Greeter slot | ANSI name        | Role / hex (sheet · field)     |
|---|---|---|
| `border`     | `bright-black`   | faint — `#8a7f72` · `#6b6157`  |
| `text`       | `white`          | body text — `#2c2825` · `#e8e0d4` |
| `time`       | `cyan`           | syn-type — Modus cyan-cooler   |
| `container`  | `black`          | bg — `#faf7f2` · `#1a1714`     |
| `prompt`     | `bright-yellow`  | **bronze accent** — `#8a4d00` · `#e0a33a` |
| `input`      | `white`          | body text (foreground)         |
| `action`     | `bright-yellow`  | bronze accent                  |
| `button`     | `magenta`        | Modus magenta                  |
| `greet`      | `bright-white`   | text-heading — `#1e1b18` · `#f0eae0` |

Example tuigreet invocation:

```
tuigreet \
  --theme 'border=bright_black;text=white;time=cyan;container=black;prompt=bright_yellow;input=white;action=bright_yellow;button=magenta;greet=bright_white'
```

`bright-yellow` is the intentional override — it's always the brand
bronze across all terminal-adjacent targets, so prompts and active
controls carry the Jylhis identity even on the login screen.

---

## Adding a new platform

1. **Read `tokens.json`** — every value you need is there.
2. **Add a generator** in `scripts/generate.mjs` that reads from `tokens.json`
   and writes the platform file. Register the output with `out()`.
3. **Keep ANSI 11 as the bronze accent.** That's the one intentional override
   across all terminal-adjacent targets.
4. **Ship both modes.** Light (Sheet) and dark (Field) are first-class. Do
   not ship a dark-only or light-only theme.
5. **Update `README.md` index table** and add a card to
   `platforms/index.html`.
6. **Add an entry to `CHANGELOG.md`** under the next unreleased version.

---

## Design system over MCP (AI agents)

PRODUCT.md names AI agents extending the system as a secondary user. The
`platforms/mcp/` server exposes the datum to any MCP client (Claude Code,
Cursor, …) so an agent reads the system instead of guessing token values or
component props. It is stdlib-only Go — a single static binary, no
dependencies — and speaks MCP stdio (newline-delimited JSON-RPC).

The repo ships a ready [`.mcp.json`](../.mcp.json); Claude Code picks it up
automatically when the project is opened. To register it elsewhere:

```json
{
  "mcpServers": {
    "jylhis-design": { "command": "sh", "args": ["-c", "cd platforms/mcp && exec go run ."] }
  }
}
```

Tools:

- `list_tokens` — every colour role, grouped, with blurbs and members.
- `get_token {role}` — a role's Sheet/Field hex, notes, paired foreground, and
  every WCAG contrast claim it appears in.
- `list_components` / `get_component {name}` — the generated per-component
  reference (summary, props table, accessibility notes).
- `get_principles` — the design principles ([`PRINCIPLES.md`](PRINCIPLES.md)).

The server resolves the repo root by walking up from its working directory to
the folder holding `tokens.json`, so it needs no configuration. Build a static
binary for distribution with `cd platforms/mcp && go build -o jylhis-design-mcp .`.

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
