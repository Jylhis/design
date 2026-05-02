# Jylhis for Emacs

Two `deftheme` files (Paper + Roast) plus a small toggle helper. The themes target the same set of faces Modus tunes, so syntax highlighting in code buffers matches the web showcase, the terminal, and the Charm TUIs byte-for-byte.

```
platforms/emacs/
├── jylhis-paper-theme.el     ← generated  (430 lines, full face mapping)
├── jylhis-roast-theme.el     ← generated  (430 lines, full face mapping)
└── jylhis-theme-toggle.el    ← hand-authored  (light/dark switcher, default `C-c T`)
```

Both `*-theme.el` files are generated from `tokens.json` by `bun scripts/generate.mjs`. Edit the source, not the theme files.

## Install

Drop the directory on `custom-theme-load-path` and load one of the themes:

```elisp
(add-to-list 'custom-theme-load-path
             "~/path/to/design/platforms/emacs/")
(load-theme 'jylhis-paper t)         ; light
;; (load-theme 'jylhis-roast t)      ; dark
```

Or use the `jylhis-themes` feature file to register the path automatically:

```elisp
(require 'jylhis-themes)
(load-theme 'jylhis-paper t)
```

### Toggle

`jylhis-theme-toggle.el` provides `M-x jylhis-toggle-theme` for manual light/dark switching. If you use `auto-dark` to follow system appearance, you do not need the toggle -- configure auto-dark directly:

```elisp
(require 'jylhis-themes)
(setq auto-dark-light-theme 'jylhis-paper
      auto-dark-dark-theme  'jylhis-roast)
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

## What you get

- Modus Operandi (light) and Vivendi (dark) syntax palettes verbatim, so this theme is byte-compatible with `modus-operandi` / `modus-vivendi` for code rendering.
- Full face mapping — `font-lock-*`, `mode-line-*`, `vertico-*`, `consult-*`, `magit-*`, `org-*`, `markdown-*`, `tab-bar-*`, `corfu-*`, `marginalia-*`, `eshell-*`.
- Background colors that match the terminal exactly so split-window magit / vterm sessions don't show a seam.
- A copper accent that is *not* used for any syntax token (consistent with the rest of the system).

## Contract

Hex values in the theme files are mirrors of `tokens.json`. To change a color: edit `tokens.json`, run `bun scripts/generate.mjs`, commit both. Don't edit the `.el` files directly.
