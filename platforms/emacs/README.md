# Jylhis for Emacs

Two themes (Sheet + Field) sharing one face map. Every face degrades across three display tiers so a `-nw` session in an old console gets named ANSI fallbacks, an xterm-256 session gets indexed colours, and a GUI frame gets full 24-bit hex plus GUI-only attributes (`:inherit variable-pitch`, `:distant-foreground`, …).

```
platforms/emacs/
├── jylhis-theme-core.el      ← generated  (face map + 3-tier resolver, shared by both variants)
├── jylhis-sheet-palette.el   ← generated  (Sheet three-tier palette alist)
├── jylhis-field-palette.el   ← generated  (Field three-tier palette alist)
├── jylhis-sheet-theme.el     ← generated  (entry point: deftheme + apply)
├── jylhis-field-theme.el     ← generated  (entry point: deftheme + apply)
├── jylhis-themes.el          ← hand-authored  (autoload registration for `custom-theme-load-path`)
├── jylhis-theme-toggle.el    ← hand-authored  (light/dark switcher, default `C-c T`)
└── face-manifest.json        ← hand-authored  (curated face list, kept in sync by validate-emacs-faces.mjs)
```

All five generated files come from `tokens.json` via `bun scripts/generate.mjs`. Edit the source, not the theme files. To extend the face map, edit the `EMACS_FACE_SPECS`-shaped Elisp list inside `scripts/generate.mjs::generateEmacsCore`, then add the new face(s) to `face-manifest.json` in lock-step (CI fails otherwise).

## Architecture

The face spec list is a small DSL: each entry is `(face-name :attr value …)` with optional `:gui (…)` for attributes that should only appear in the 24-bit tier. Attribute values that match a palette role symbol (`accent`, `syn-keyword`, `err`, …) are resolved through the per-variant palette into:

| Display class spec                          | Tier         | Value form                  |
|---|---|---|
| `((class color) (min-colors 16777216))`     | GUI / 24-bit | exact hex (`#8a4f24`)       |
| `((class color) (min-colors 256))`          | xterm-256    | indexed slot (`color-94`)   |
| `t`                                          | 16-color     | named ANSI (`brightyellow`) |

The 16-color tier uses each role's optional `ansi` override field in `tokens.json` when set, otherwise the nearest ANSI slot by Euclidean RGB distance. The CLAUDE.md rule "ANSI 11 is always the bronze accent" is pinned: `accent.ansi = "bright-yellow"`.

## Install

Drop the directory on `custom-theme-load-path` and load one of the themes:

```elisp
(add-to-list 'custom-theme-load-path
             "~/path/to/design/platforms/emacs/")
(load-theme 'jylhis-sheet t)         ; light
;; (load-theme 'jylhis-field t)      ; dark
```

Or use the `jylhis-themes` feature file to register the path automatically:

```elisp
(require 'jylhis-themes)
(load-theme 'jylhis-sheet t)
```

### Toggle

`jylhis-theme-toggle.el` provides `M-x jylhis-toggle-theme` for manual light/dark switching. If you use `auto-dark` to follow system appearance, you do not need the toggle -- configure auto-dark directly:

```elisp
(require 'jylhis-themes)
(setq auto-dark-light-theme 'jylhis-sheet
      auto-dark-dark-theme  'jylhis-field)
(auto-dark-mode 1)
```

## Nix

```nix
programs.emacs.extraPackages = epkgs: [
  (pkgs.callPackage /path/to/design/nix/emacs.nix {
    inherit (epkgs) trivialBuild;
  })
];
```

See [`../../nix/emacs.nix`](../../nix/emacs.nix).

Nix's `trivialBuild` does not process `###autoload` cookies into an autoloads file. This means Emacs's `load-theme` will not find the themes on `custom-theme-load-path` automatically. Add `(require 'jylhis-themes)` to your init file before calling `load-theme` -- this registers the theme directory at require time.

### Batch mode / byte-compilation

When Emacs starts in batch mode (`emacs --batch`), `site-start.el` does not run, so `custom-theme-load-path` is not populated by the Nix wrapper. A top-level `(load-theme ...)` in your init will error during byte-compilation or CI linting. Guard the call:

```elisp
(unless noninteractive
  (load-theme 'jylhis-sheet t))
```

This affects any Nix-packaged theme, not just Jylhis.

## What you get

- Modus Operandi (light) and Vivendi (dark) syntax palettes verbatim, so this theme is byte-compatible with `modus-operandi` / `modus-vivendi` for code rendering.
- Full face mapping — `font-lock-*`, `mode-line-*`, `vertico-*`, `consult-*`, `magit-*`, `org-*`, `markdown-*`, `tab-bar-*`, `corfu-*`, `marginalia-*`, `eshell-*`.
- Background colors that match the terminal exactly so split-window magit / vterm sessions don't show a seam.
- A bronze accent that is *not* used for any syntax token (consistent with the rest of the system).

## Contract

Hex values in the theme files are mirrors of `tokens.json`. To change a color: edit `tokens.json`, run `bun scripts/generate.mjs`, commit both. Don't edit the `.el` files directly.
