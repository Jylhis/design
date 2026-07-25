;;; jylhis-sheet-palette.el --- Jylhis sheet palette  -*- lexical-binding: t; -*-
;;
;; GENERATED from tokens.json. Do not edit by hand.
;; Run: bun scripts/generate.mjs
;;
;;; Commentary:
;;
;;  Three-tier color palette for the jylhis-sheet theme.
;;  Each entry is (ROLE (GUI-HEX XTERM-256 ANSI-16-NAME)) and is consumed
;;  by `jylhis-apply-faces' in jylhis-theme-core.el.
;;
;;; Code:

(defconst jylhis-sheet-palette
  '(
    (bg              ("#f6f8fb" "color-231" "unspecified-bg"))
    (bg-subtle       ("#eef2f6" "color-253" "brightblack"))
    (surface         ("#e6ecf1" "color-251" "brightblack"))
    (surface-raised  ("#fcfdff" "color-231" "brightblack"))
    (fg              ("#23262e" "color-235" "unspecified-fg"))
    (fg-muted        ("#565a63" "color-59" "white"))
    (fg-heading      ("#12141a" "color-233" "black"))
    (fg-faint        ("#878c95" "color-245" "brightblack"))
    (accent          ("#8a4d00" "color-94" "brightyellow"))
    (accent-hover    ("#a75f0a" "color-130" "yellow"))
    (accent-subtle   ("#e9e3dd" "color-254" "brightblack"))
    (brand           ("#b5450e" "color-130" "brightyellow"))
    (border          ("#cfd6de" "color-188" "brightblack"))
    (border-strong   ("#aab4c0" "color-249" "brightblack"))
    (decorator       ("#7f8fb5" "color-103" "brightblack"))
    (syn-keyword     ("#5317ac" "color-55" "brightmagenta"))
    (syn-string      ("#2544bb" "color-25" "brightblue"))
    (syn-number      ("#0031a9" "color-25" "blue"))
    (syn-function    ("#721045" "color-53" "magenta"))
    (syn-builtin     ("#8f0075" "color-90" "magenta"))
    (syn-type        ("#005a5f" "color-23" "cyan"))
    (syn-variable    ("#0044aa" "color-25" "blue"))
    (syn-tag         ("#005a5f" "color-23" "cyan"))
    (syn-comment     ("#595959" "color-240" "white"))
    (syn-docstring   ("#2a5a3a" "color-238" "black"))
    (err             ("#a60000" "color-124" "red"))
    (warn            ("#8a5000" "color-94" "yellow"))
    (ok              ("#006800" "color-22" "green"))
    (info            ("#005e8b" "color-24" "blue"))

    ;; ANSI 16-color slots (for ansi-color-* faces)
    (ansi-black      ("#23262e" "color-235" "black"))
    (ansi-red        ("#a60000" "color-124" "red"))
    (ansi-green      ("#006800" "color-22" "green"))
    (ansi-yellow     ("#8a5000" "color-94" "yellow"))
    (ansi-blue       ("#0031a9" "color-25" "blue"))
    (ansi-magenta    ("#721045" "color-53" "magenta"))
    (ansi-cyan       ("#005a5f" "color-23" "cyan"))
    (ansi-white      ("#565a63" "color-59" "white"))
    (ansi-bright-black ("#878c95" "color-245" "brightblack"))
    (ansi-bright-red ("#b60000" "color-124" "brightred"))
    (ansi-bright-green ("#315b00" "color-58" "brightgreen"))
    (ansi-bright-yellow ("#8a4d00" "color-94" "brightyellow"))
    (ansi-bright-blue ("#3548cf" "color-62" "brightblue"))
    (ansi-bright-magenta ("#531ab6" "color-55" "brightmagenta"))
    (ansi-bright-cyan ("#005e8b" "color-24" "brightcyan"))
    (ansi-bright-white ("#23262e" "color-235" "brightwhite"))
    )
  "Three-tier palette for the Jylhis sheet theme.
Each entry is (ROLE (GUI-HEX XTERM-256 ANSI-16-NAME)) and is consumed by
`jylhis-apply-faces' to emit a Custom face SPEC-LIST that degrades
across display classes.")

(defconst jylhis-sheet-hl-todo-faces
  '(("FIXME"      . "#a60000")
    ("BUG"        . "#a60000")
    ("TODO"       . "#8a5000")
    ("HACK"       . "#8a5000")
    ("NOTE"       . "#005e8b")
    ("REVIEW"     . "#005e8b")
    ("DEPRECATED" . "#878c95"))
  "Suggested `hl-todo-keyword-faces' for the Jylhis sheet theme.")

(provide 'jylhis-sheet-palette)
;;; jylhis-sheet-palette.el ends here
