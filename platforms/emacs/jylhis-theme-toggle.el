;;; jylhis-theme-toggle.el --- Switch Jylhis paper/roast -*- lexical-binding: t; -*-

;;; Commentary:
;;  Minimal toggle helper. Binds to M-x jylhis-toggle-theme.
;;  Pairs with platforms/hyprland/jylhis.conf bind: SUPER+SHIFT+T.

;;; Code:

(defvar jylhis-theme-light 'jylhis-paper)
(defvar jylhis-theme-dark  'jylhis-roast)

;;;###autoload
(defun jylhis-load-theme (&optional mode)
  "Load the Jylhis theme for MODE (`light' or `dark')."
  (interactive
   (list (intern (completing-read "Mode: " '(light dark) nil t))))
  (let ((target (if (eq mode 'light) jylhis-theme-light jylhis-theme-dark)))
    (mapc #'disable-theme custom-enabled-themes)
    (load-theme target t)))

;;;###autoload
(defun jylhis-toggle-theme ()
  "Toggle between Jylhis paper and roast."
  (interactive)
  (let ((current (car custom-enabled-themes)))
    (mapc #'disable-theme custom-enabled-themes)
    (load-theme (if (eq current jylhis-theme-dark)
                    jylhis-theme-light
                  jylhis-theme-dark)
                t)))

(provide 'jylhis-theme-toggle)
;;; jylhis-theme-toggle.el ends here
