;;; jylhis-themes.el --- Register Jylhis themes -*- lexical-binding: t; -*-
;;
;; Author:      Markus Jylhänkangas
;; Homepage:    https://jylhis.com
;; Keywords:    faces, theme
;; Package-Requires: ((emacs "28.1"))
;;
;;; Commentary:
;;
;;  Require this file to add the Jylhis theme directory to
;;  `custom-theme-load-path'.  This is the recommended entry point for
;;  Nix consumers (trivialBuild does not process ###autoload cookies
;;  into an autoloads file, so the per-theme autoload forms never run
;;  at package-initialize time).
;;
;;  Usage:
;;    (require 'jylhis-themes)
;;    (load-theme 'jylhis-paper t)              ; light, copper-on-cream
;;    (load-theme 'jylhis-roast t)              ; dark,  copper-on-roast
;;    (load-theme 'jylhis-catppuccin-latte t)   ; light, Catppuccin Latte
;;    (load-theme 'jylhis-catppuccin-mocha t)   ; dark,  Catppuccin Mocha
;;
;;  With auto-dark (paper/roast):
;;    (require 'jylhis-themes)
;;    (setq auto-dark-light-theme 'jylhis-paper
;;          auto-dark-dark-theme  'jylhis-roast)
;;    (auto-dark-mode 1)
;;
;;  With auto-dark (Catppuccin pair):
;;    (setq auto-dark-light-theme 'jylhis-catppuccin-latte
;;          auto-dark-dark-theme  'jylhis-catppuccin-mocha)
;;    (auto-dark-mode 1)
;;
;;  Batch mode: `emacs --batch' does not run site-start.el, so
;;  custom-theme-load-path is not populated by the Nix wrapper.
;;  Guard top-level load-theme calls in init files that are
;;  byte-compiled:
;;    (unless noninteractive
;;      (load-theme 'jylhis-paper t))
;;
;;; Code:

;;;###autoload
(when (boundp 'custom-theme-load-path)
  (add-to-list 'custom-theme-load-path
               (file-name-as-directory
                (file-name-directory
                 (or load-file-name (locate-library "jylhis-themes"))))))

(provide 'jylhis-themes)
;;; jylhis-themes.el ends here
