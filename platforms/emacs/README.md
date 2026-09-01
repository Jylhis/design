# Jylhis for Emacs

Generated `deftheme` files (Survey and Monochrome, each in a light and dark mode) plus a small toggle helper. The themes target the same set of faces Modus tunes, so syntax highlighting in code buffers matches the web showcase, the terminal, and the Charm TUIs byte-for-byte.

```
platforms/emacs/
├── jylhis-survey-light-theme.el   ← generated  (full face mapping)
├── jylhis-survey-dark-theme.el    ← generated  (full face mapping)
├── jylhis-mono-light-theme.el     ← generated  (full face mapping)
├── jylhis-mono-dark-theme.el      ← generated  (full face mapping)
├── jylhis-themes.el               ← hand-authored  (custom-theme-load-path registration)
└── jylhis-theme-toggle.el         ← hand-authored  (light/dark switcher, default `C-c T`)
```

The `*-theme.el` files are generated from the token sources by `bun scripts/generate.mjs`. Edit the source, not the theme files.

## Install

Drop the directory on `custom-theme-load-path` and load one of the themes:

```elisp
(add-to-list 'custom-theme-load-path
             "~/path/to/design/platforms/emacs/")
(load-theme 'jylhis-survey-light t)         ; Survey, light
;; (load-theme 'jylhis-survey-dark t)      ; Survey, dark
;; (load-theme 'jylhis-mono-light t)       ; Monochrome, light
;; (load-theme 'jylhis-mono-dark t)        ; Monochrome, dark
```

Or use the `jylhis-themes` feature file to register the path automatically:

```elisp
(require 'jylhis-themes)
(load-theme 'jylhis-survey-light t)
```

### Toggle

`jylhis-theme-toggle.el` provides `M-x jylhis-toggle-theme` for manual light/dark switching. If you use `auto-dark` to follow system appearance, you do not need the toggle -- configure auto-dark directly:

```elisp
(require 'jylhis-themes)
(setq auto-dark-light-theme 'jylhis-survey-light
      auto-dark-dark-theme  'jylhis-survey-dark)
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
  (load-theme 'jylhis-survey-light t))
```

This affects any Nix-packaged theme, not just Jylhis.

## What you get

- Modus Operandi (light) and Vivendi (dark) syntax palettes verbatim for the Survey theme, so it is byte-compatible with `modus-operandi` / `modus-vivendi` for code rendering. Monochrome greys the syntax and carries emphasis in weight/italic instead.
- Full face mapping — `font-lock-*`, `mode-line-*`, `vertico-*`, `consult-*`, `magit-*`, `org-*`, `markdown-*`, `tab-bar-*`, `corfu-*`, `marginalia-*`, `eshell-*`.
- Background colors that match the terminal exactly so split-window magit / vterm sessions don't show a seam.
- A bronze accent (Survey) that is *not* used for any syntax token (consistent with the rest of the system).

## Contract

Hex values in the theme files are mirrors of the token sources. To change a color: edit `tokens.core.json` or `themes/<slug>.json`, run `bun scripts/generate.mjs`, commit both. Don't edit the `.el` files directly.
