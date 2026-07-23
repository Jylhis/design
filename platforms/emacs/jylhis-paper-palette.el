;;; jylhis-paper-palette.el --- Jylhis paper palette  -*- lexical-binding: t; -*-
;;
;; GENERATED from tokens.json. Do not edit by hand.
;; Run: bun scripts/generate.mjs
;;
;;; Commentary:
;;
;;  Three-tier color palette for the jylhis-paper theme.
;;  Each entry is (ROLE (GUI-HEX XTERM-256 ANSI-16-NAME)) and is consumed
;;  by `jylhis-apply-faces' in jylhis-theme-core.el.
;;
;;; Code:

(defconst jylhis-paper-palette
  '(
    (bg              ("#faf7f2" "color-255" "unspecified-bg"))
    (bg-subtle       ("#f0ebe3" "color-253" "brightblack"))
    (surface         ("#e8e1d6" "color-251" "brightblack"))
    (surface-raised  ("#fefdfb" "color-231" "brightblack"))
    (fg              ("#2c2825" "color-235" "unspecified-fg"))
    (fg-muted        ("#6b5f54" "color-59" "white"))
    (fg-heading      ("#1e1b18" "color-234" "black"))
    (fg-faint        ("#6d6155" "color-241" "white"))
    (accent          ("#8a4f24" "color-94" "brightyellow"))
    (accent-hover    ("#7a4622" "color-94" "yellow"))
    (accent-subtle   ("#f0e6da" "color-254" "brightblack"))
    (brand           ("#b5703c" "color-131" "brightyellow"))
    (border          ("#d5cec4" "color-252" "brightblack"))
    (border-strong   ("#b0a898" "color-248" "brightblack"))
    (decorator       ("#c4baa8" "color-250" "brightblack"))
    (syn-keyword     ("#4a2d80" "color-54" "brightmagenta"))
    (syn-string      ("#3d5a1f" "color-237" "brightgreen"))
    (syn-number      ("#1f4d8a" "color-24" "brightcyan"))
    (syn-function    ("#8a2348" "color-89" "magenta"))
    (syn-builtin     ("#6f1f6a" "color-53" "magenta"))
    (syn-type        ("#134a4a" "color-23" "cyan"))
    (syn-variable    ("#2a4a6a" "color-239" "cyan"))
    (syn-tag         ("#134a4a" "color-23" "cyan"))
    (syn-comment     ("#6f5e41" "color-240" "white"))
    (syn-docstring   ("#2a5a3a" "color-238" "black"))
    (err             ("#a60000" "color-124" "red"))
    (warn            ("#6f5500" "color-58" "yellow"))
    (ok              ("#006800" "color-22" "green"))
    (info            ("#0031a9" "color-25" "blue"))

    ;; ANSI 16-color slots (for ansi-color-* faces)
    (ansi-black      ("#2c2825" "color-235" "black"))
    (ansi-red        ("#a60000" "color-124" "red"))
    (ansi-green      ("#006800" "color-22" "green"))
    (ansi-yellow     ("#6f5500" "color-58" "yellow"))
    (ansi-blue       ("#0031a9" "color-25" "blue"))
    (ansi-magenta    ("#721045" "color-53" "magenta"))
    (ansi-cyan       ("#005f5f" "color-23" "cyan"))
    (ansi-white      ("#6b5f54" "color-59" "white"))
    (ansi-bright-black ("#8a7f72" "color-244" "brightblack"))
    (ansi-bright-red ("#972500" "color-88" "brightred"))
    (ansi-bright-green ("#315b00" "color-58" "brightgreen"))
    (ansi-bright-yellow ("#b5703c" "color-131" "brightyellow"))
    (ansi-bright-blue ("#3548cf" "color-62" "brightblue"))
    (ansi-bright-magenta ("#531ab6" "color-55" "brightmagenta"))
    (ansi-bright-cyan ("#005e8b" "color-24" "brightcyan"))
    (ansi-bright-white ("#2c2825" "color-235" "brightwhite"))
    )
  "Three-tier palette for the Jylhis paper theme.
Each entry is (ROLE (GUI-HEX XTERM-256 ANSI-16-NAME)) and is consumed by
`jylhis-apply-faces' to emit a Custom face SPEC-LIST that degrades
across display classes.")

(defconst jylhis-paper-hl-todo-faces
  '(("FIXME"      . "#a60000")
    ("BUG"        . "#a60000")
    ("TODO"       . "#6f5500")
    ("HACK"       . "#6f5500")
    ("NOTE"       . "#0031a9")
    ("REVIEW"     . "#0031a9")
    ("DEPRECATED" . "#6d6155"))
  "Suggested `hl-todo-keyword-faces' for the Jylhis paper theme.")

(provide 'jylhis-paper-palette)
;;; jylhis-paper-palette.el ends here
