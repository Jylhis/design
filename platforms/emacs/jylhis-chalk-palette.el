;;; jylhis-chalk-palette.el --- Jylhis chalk palette  -*- lexical-binding: t; -*-
;;
;; GENERATED from tokens.json. Do not edit by hand.
;; Run: bun scripts/generate.mjs
;;
;;; Commentary:
;;
;;  Three-tier color palette for the jylhis-chalk theme.
;;  Each entry is (ROLE (GUI-HEX XTERM-256 ANSI-16-NAME)) and is consumed
;;  by `jylhis-apply-faces' in jylhis-theme-core.el.
;;
;;; Code:

(defconst jylhis-chalk-palette
  '(
    (bg              ("#f4f4f4" "color-255" "unspecified-bg"))
    (bg-subtle       ("#ececec" "color-253" "brightblack"))
    (surface         ("#e2e2e2" "color-251" "brightblack"))
    (surface-raised  ("#fcfcfc" "color-231" "brightblack"))
    (fg              ("#2b2b2b" "color-235" "unspecified-fg"))
    (fg-muted        ("#565656" "color-240" "green"))
    (fg-heading      ("#1a1a1a" "color-234" "brightwhite"))
    (fg-faint        ("#7d7d7d" "color-244" "brightblack"))
    (accent          ("#000000" "color-16" "brightyellow"))
    (accent-hover    ("#333333" "color-236" "blue"))
    (accent-subtle   ("#dcdcdc" "color-253" "brightblack"))
    (brand           ("#3a3a3a" "color-237" "magenta"))
    (border          ("#cfcfcf" "color-252" "brightblack"))
    (border-strong   ("#b0b0b0" "color-145" "brightblack"))
    (decorator       ("#bdbdbd" "color-250" "brightblack"))
    (syn-keyword     ("#1c1c1c" "color-234" "brightwhite"))
    (syn-string      ("#3d3d3d" "color-237" "magenta"))
    (syn-number      ("#474747" "color-238" "yellow"))
    (syn-function    ("#262626" "color-235" "black"))
    (syn-builtin     ("#424242" "color-238" "brightblue"))
    (syn-type        ("#2e2e2e" "color-236" "brightred"))
    (syn-variable    ("#333333" "color-236" "blue"))
    (syn-tag         ("#2e2e2e" "color-236" "brightred"))
    (syn-comment     ("#5a5a5a" "color-240" "green"))
    (syn-docstring   ("#505050" "color-239" "brightcyan"))
    (err             ("#1f1f1f" "color-234" "red"))
    (warn            ("#454545" "color-238" "yellow"))
    (ok              ("#565656" "color-240" "green"))
    (info            ("#333333" "color-236" "blue"))

    ;; ANSI 16-color slots (for ansi-color-* faces)
    (ansi-black      ("#242424" "color-235" "black"))
    (ansi-red        ("#1f1f1f" "color-234" "red"))
    (ansi-green      ("#565656" "color-240" "green"))
    (ansi-yellow     ("#454545" "color-238" "yellow"))
    (ansi-blue       ("#333333" "color-236" "blue"))
    (ansi-magenta    ("#3a3a3a" "color-237" "magenta"))
    (ansi-cyan       ("#4a4a4a" "color-239" "cyan"))
    (ansi-white      ("#565656" "color-240" "white"))
    (ansi-bright-black ("#7d7d7d" "color-244" "brightblack"))
    (ansi-bright-red ("#2a2a2a" "color-235" "brightred"))
    (ansi-bright-green ("#6a6a6a" "color-242" "brightgreen"))
    (ansi-bright-yellow ("#000000" "color-16" "brightyellow"))
    (ansi-bright-blue ("#404040" "color-238" "brightblue"))
    (ansi-bright-magenta ("#4a4a4a" "color-239" "brightmagenta"))
    (ansi-bright-cyan ("#555555" "color-240" "brightcyan"))
    (ansi-bright-white ("#1a1a1a" "color-234" "brightwhite"))
    )
  "Three-tier palette for the Jylhis chalk theme.
Each entry is (ROLE (GUI-HEX XTERM-256 ANSI-16-NAME)) and is consumed by
`jylhis-apply-faces' to emit a Custom face SPEC-LIST that degrades
across display classes.")

(defconst jylhis-chalk-hl-todo-faces
  '(("FIXME"      . "#1f1f1f")
    ("BUG"        . "#1f1f1f")
    ("TODO"       . "#454545")
    ("HACK"       . "#454545")
    ("NOTE"       . "#333333")
    ("REVIEW"     . "#333333")
    ("DEPRECATED" . "#7d7d7d"))
  "Suggested `hl-todo-keyword-faces' for the Jylhis chalk theme.")

(provide 'jylhis-chalk-palette)
;;; jylhis-chalk-palette.el ends here
