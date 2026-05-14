;;; jylhis-paper-theme.el --- Jylhis light theme  -*- lexical-binding: t; -*-
;;
;; GENERATED from tokens.json. Do not edit by hand.
;; Run: bun scripts/generate.mjs
;;
;; Author:      Markus Jylhänkangas
;; Homepage:    https://jylhis.com
;; Keywords:    faces, theme
;; Package-Requires: ((emacs "28.1"))
;;
;;; Commentary:
;;
;;  Light "paper" variant of the Jylhis design system for Emacs.
;;  Modus-style semantic face targeting — see tokens.md §2 for the source-of-truth
;;  palette and platforms/KEYBOARD.md for the shared primitives (focus, kbd,
;;  selected-item language).  A sibling `jylhis-roast-theme.el` ships the dark
;;  variant; both reuse the same semantic face map in jylhis-theme-core.el.
;;
;;  Install:
;;    (add-to-list 'custom-theme-load-path "~/.config/emacs/themes/")
;;    (load-theme 'jylhis-paper t)
;;    ;; Toggle:
;;    (defun jylhis-toggle-theme ()
;;      (interactive)
;;      (if (car custom-enabled-themes)
;;          (progn (disable-theme (car custom-enabled-themes))
;;                 (load-theme (if (eq (car custom-enabled-themes) 'jylhis-paper)
;;                                 'jylhis-roast 'jylhis-paper) t))))
;;
;;; Code:

(require 'jylhis-theme-core)
(require 'jylhis-paper-palette)

(deftheme jylhis-paper
  "Jylhis — light theme. Copper accent on warm paper, Modus-derived syntax tuned for paper.")

(jylhis-apply-faces 'jylhis-paper jylhis-paper-palette)

(custom-theme-set-variables
 'jylhis-paper
 '(ansi-color-names-vector
   ["#2c2825" "#a60000" "#006800" "#6f5500"
    "#0031a9" "#721045" "#005f5f" "#6b5f54"])
 '(ansi-color-faces-vector
   [default default default italic underline success warning error])
 `(hl-todo-keyword-faces ',jylhis-paper-hl-todo-faces))

(provide-theme 'jylhis-paper)

;;;###autoload
(and load-file-name
     (boundp 'custom-theme-load-path)
     (add-to-list 'custom-theme-load-path
                  (file-name-as-directory
                   (file-name-directory load-file-name))))

;;; jylhis-paper-theme.el ends here
