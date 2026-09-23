# Jylhis for Emacs

Generated `deftheme` files (light and dark) plus hand-authored helpers. The themes target the same set of faces Modus tunes, so syntax highlighting in code buffers matches the web showcase, the terminal, and the Charm TUIs byte-for-byte.

```
platforms/emacs/
├── jylhis-light-theme.el      ← generated  (full face mapping)
├── jylhis-dark-theme.el       ← generated  (full face mapping)
├── jylhis-themes.el           ← hand-authored  (custom-theme-load-path registration)
├── jylhis-theme-toggle.el     ← hand-authored  (light/dark switcher, default `C-c T`)
└── README.md
```

The `*-theme.el` files are generated from the token sources by `bun scripts/generate.mjs` and are **not committed** — build them (or let the Nix derivations do it). Edit the source, not the theme files.

## Install

Require the `jylhis-themes` feature (it registers the theme directory on `custom-theme-load-path` — for a Nix `trivialBuild` install this is the only registration path, since trivialBuild does not process `###autoload` cookies) and load a theme:

```elisp
(require 'jylhis-themes)
(load-theme 'jylhis-light t)         ; light (Print)
;; (load-theme 'jylhis-dark t)      ; dark (Negative)
```

Or point `custom-theme-load-path` at a checkout that has run the generator:

```elisp
(add-to-list 'custom-theme-load-path
             "~/path/to/design/platforms/emacs/")
(load-theme 'jylhis-light t)
```

### Toggle

`jylhis-theme-toggle.el` provides `M-x jylhis-toggle-theme` for manual light/dark switching. If you use `auto-dark` to follow system appearance, you do not need the toggle -- configure auto-dark directly:

```elisp
(require 'jylhis-themes)
(setq auto-dark-light-theme 'jylhis-light
      auto-dark-dark-theme  'jylhis-dark)
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

See [`../../nix/emacs.nix`](../../nix/emacs.nix). The package unions the generated theme files with the hand-authored `jylhis-themes.el`, so `(require 'jylhis-themes)` works out of the box.

### Batch mode / byte-compilation

When Emacs starts in batch mode (`emacs --batch`), `site-start.el` does not run, so `custom-theme-load-path` is not populated by the Nix wrapper. A top-level `(load-theme ...)` in your init will error during byte-compilation or CI linting. Guard the call:

```elisp
(unless noninteractive
  (load-theme 'jylhis-light t))
```

This affects any Nix-packaged theme, not just Jylhis.

## What you get

- Modus-style syntax palettes re-solved against the theme grounds (`themes/jylhis.json#syntax`), so code rendering matches the web showcase and the terminal targets.
- Full face mapping -- `font-lock-*`, `mode-line-*`, `vertico-*`, `consult-*`, `magit-*`, `org-*`, `markdown-*`, `tab-bar-*`, `corfu-*`, `marginalia-*`, `eshell-*`.
- Background colors that match the terminal exactly so split-window magit / vterm sessions don't show a seam.
- A bronze accent that is *not* used for any syntax token (consistent with the rest of the system).

## Contract

Hex values in the theme files are mirrors of the token sources. To change a color: edit `tokens.core.json` or `themes/jylhis.json`, run `bun scripts/generate.mjs`. Don't edit the `.el` files directly.
