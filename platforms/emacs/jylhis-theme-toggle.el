;;; jylhis-theme-toggle.el --- Switch Jylhis themes -*- lexical-binding: t; -*-

;;; Commentary:
;;  Minimal toggle helper. Binds to M-x jylhis-toggle-theme.
;;  Pairs with platforms/hyprland/jylhis.conf bind: SUPER+SHIFT+T.
;;
;;  Four editions: the colour pair sheet (light) / field (dark) and the
;;  monochrome pair chalk (light) / graphite (dark).  `jylhis-toggle-theme'
;;  cycles through all four; `jylhis-load-theme' picks one by name.
;;
;;  If you use auto-dark to follow system appearance, you do not need
;;  this file.  Configure auto-dark-light-theme / auto-dark-dark-theme
;;  instead (see jylhis-themes.el for an example).  This toggle helper
;;  is for consumers who want a manual keybinding to switch themes.

;;; Code:

(defvar jylhis-themes '(jylhis-sheet jylhis-field jylhis-chalk jylhis-graphite)
  "Ordered list of Jylhis themes cycled by `jylhis-toggle-theme'.")

(defvar jylhis-theme-light 'jylhis-sheet)
(defvar jylhis-theme-dark  'jylhis-field)
(defvar jylhis-theme-mono-light 'jylhis-chalk)
(defvar jylhis-theme-mono-dark  'jylhis-graphite)

;;;###autoload
(defun jylhis-load-theme (&optional theme)
  "Load a Jylhis THEME by name (sheet, field, chalk, or graphite)."
  (interactive
   (list (intern (completing-read "Theme: " jylhis-themes nil t))))
  (mapc #'disable-theme custom-enabled-themes)
  (load-theme theme t))

;;;###autoload
(defun jylhis-toggle-theme ()
  "Cycle to the next Jylhis theme: sheet -> field -> chalk -> graphite -> sheet."
  (interactive)
  (let* ((current (car custom-enabled-themes))
         (rest (cdr (member current jylhis-themes)))
         (next (or (car rest) (car jylhis-themes))))
    (mapc #'disable-theme custom-enabled-themes)
    (load-theme next t)))

(provide 'jylhis-theme-toggle)
;;; jylhis-theme-toggle.el ends here
