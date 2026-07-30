;;; jylhis-field-palette.el --- Jylhis field palette  -*- lexical-binding: t; -*-
;;
;; GENERATED from tokens.json. Do not edit by hand.
;; Run: bun scripts/generate.mjs
;;
;;; Commentary:
;;
;;  Three-tier color palette for the jylhis-field theme.
;;  Each entry is (ROLE (GUI-HEX XTERM-256 ANSI-16-NAME)) and is consumed
;;  by `jylhis-apply-faces' in jylhis-theme-core.el.
;;
;;; Code:

(defconst jylhis-field-palette
  '(
    (bg              ("#0d0f14" "color-233" "unspecified-bg"))
    (bg-subtle       ("#14171e" "color-235" "black"))
    (surface         ("#1b1f28" "color-237" "black"))
    (surface-raised  ("#232833" "color-239" "black"))
    (fg              ("#d6dae2" "color-253" "unspecified-fg"))
    (fg-muted        ("#9aa0ab" "color-247" "cyan"))
    (fg-heading      ("#f2f4f8" "color-255" "brightwhite"))
    (fg-faint        ("#656b76" "color-242" "brightblack"))
    (accent          ("#e0a33a" "color-179" "brightyellow"))
    (accent-hover    ("#f0b95c" "color-215" "yellow"))
    (accent-subtle   ("#262119" "color-234" "black"))
    (brand           ("#ef8a4a" "color-209" "brightyellow"))
    (border          ("#2b303b" "color-236" "black"))
    (border-strong   ("#3a4150" "color-238" "brightblack"))
    (decorator       ("#39415a" "color-238" "brightblack"))
    (syn-keyword     ("#b6a0ff" "color-147" "brightmagenta"))
    (syn-string      ("#79a8ff" "color-111" "blue"))
    (syn-number      ("#00bcff" "color-39" "brightcyan"))
    (syn-function    ("#feacd0" "color-218" "magenta"))
    (syn-builtin     ("#f78fe7" "color-212" "magenta"))
    (syn-type        ("#6ae4b9" "color-79" "cyan"))
    (syn-variable    ("#00d3d0" "color-44" "brightcyan"))
    (syn-tag         ("#6ae4b9" "color-79" "cyan"))
    (syn-comment     ("#989898" "color-246" "green"))
    (syn-docstring   ("#9ac8e0" "color-116" "white"))
    (err             ("#f0685f" "color-203" "red"))
    (warn            ("#d9b34a" "color-179" "yellow"))
    (ok              ("#6bbf6b" "color-71" "green"))
    (info            ("#5fb8cf" "color-74" "blue"))

    ;; ANSI 16-color slots (for ansi-color-* faces)
    (ansi-black      ("#0d0f14" "color-233" "black"))
    (ansi-red        ("#f0685f" "color-203" "red"))
    (ansi-green      ("#6bbf6b" "color-71" "green"))
    (ansi-yellow     ("#d9b34a" "color-179" "yellow"))
    (ansi-blue       ("#79a8ff" "color-111" "blue"))
    (ansi-magenta    ("#feacd0" "color-218" "magenta"))
    (ansi-cyan       ("#6ae4b9" "color-79" "cyan"))
    (ansi-white      ("#c9dedf" "color-188" "white"))
    (ansi-bright-black ("#656b76" "color-242" "brightblack"))
    (ansi-bright-red ("#ff7f7f" "color-210" "brightred"))
    (ansi-bright-green ("#70b900" "color-70" "brightgreen"))
    (ansi-bright-yellow ("#e0a33a" "color-179" "brightyellow"))
    (ansi-bright-blue ("#79a8ff" "color-111" "brightblue"))
    (ansi-bright-magenta ("#b6a0ff" "color-147" "brightmagenta"))
    (ansi-bright-cyan ("#00d3d0" "color-44" "brightcyan"))
    (ansi-bright-white ("#f2f4f8" "color-255" "brightwhite"))
    )
  "Three-tier palette for the Jylhis field theme.
Each entry is (ROLE (GUI-HEX XTERM-256 ANSI-16-NAME)) and is consumed by
`jylhis-apply-faces' to emit a Custom face SPEC-LIST that degrades
across display classes.")

(defconst jylhis-field-hl-todo-faces
  '(("FIXME"      . "#f0685f")
    ("BUG"        . "#f0685f")
    ("TODO"       . "#d9b34a")
    ("HACK"       . "#d9b34a")
    ("NOTE"       . "#5fb8cf")
    ("REVIEW"     . "#5fb8cf")
    ("DEPRECATED" . "#656b76"))
  "Suggested `hl-todo-keyword-faces' for the Jylhis field theme.")

(provide 'jylhis-field-palette)
;;; jylhis-field-palette.el ends here
