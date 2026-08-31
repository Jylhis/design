;;; jylhis-chalk-theme.el --- Jylhis light theme  -*- lexical-binding: t; -*-
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
;;  Light "chalk" variant of the Jylhis design system for Emacs.
;;  Modus-style semantic face targeting — see tokens.md §2 for the source-of-truth
;;  palette and platforms/KEYBOARD.md for the shared primitives (focus, kbd,
;;  selected-item language).  A sibling `jylhis-graphite-theme.el` ships the dark
;;  variant; both reuse the same semantic face map in jylhis-theme-core.el.
;;
;;  Install:
;;    (add-to-list 'custom-theme-load-path "~/.config/emacs/themes/")
;;    (load-theme 'jylhis-chalk t)
;;    ;; Toggle:
;;    (defun jylhis-toggle-theme ()
;;      (interactive)
;;      (if (car custom-enabled-themes)
;;          (progn (disable-theme (car custom-enabled-themes))
;;                 (load-theme (if (eq (car custom-enabled-themes) 'jylhis-chalk)
;;                                 'jylhis-graphite 'jylhis-chalk) t))))
;;
;;; Code:

;; `load-theme` calls `load` against `custom-theme-load-path`, which does not
;; touch `load-path`. Users who only add this directory to
;; `custom-theme-load-path` (the documented install path) would otherwise hit
;; "Cannot open load file: jylhis-theme-core" on the requires below. Add the
;; file's own directory to load-path so the sibling core + palette resolve.
(eval-and-compile
  (let ((dir (file-name-directory (or load-file-name buffer-file-name ""))))
    (when (and dir (not (member dir load-path)))
      (add-to-list 'load-path dir))))

(require 'jylhis-theme-core)
(require 'jylhis-chalk-palette)

(deftheme jylhis-chalk
  "Jylhis — light monochrome theme. Ink accent on the Chalk ground, grayscale syntax.")

(jylhis-apply-faces 'jylhis-chalk jylhis-chalk-palette)

(custom-theme-set-variables
 'jylhis-chalk
 '(ansi-color-names-vector
   ["#242424" "#1f1f1f" "#565656" "#454545"
    "#333333" "#3a3a3a" "#4a4a4a" "#565656"])
 '(ansi-color-faces-vector
   [default default default italic underline success warning error])
 `(hl-todo-keyword-faces ',jylhis-chalk-hl-todo-faces))

(provide-theme 'jylhis-chalk)

;;;###autoload
(and load-file-name
     (boundp 'custom-theme-load-path)
     (add-to-list 'custom-theme-load-path
                  (file-name-as-directory
                   (file-name-directory load-file-name))))

;;; jylhis-chalk-theme.el ends here
