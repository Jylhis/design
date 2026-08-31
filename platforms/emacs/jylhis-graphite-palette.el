;;; jylhis-graphite-palette.el --- Jylhis graphite palette  -*- lexical-binding: t; -*-
;;
;; GENERATED from tokens.json. Do not edit by hand.
;; Run: bun scripts/generate.mjs
;;
;;; Commentary:
;;
;;  Three-tier color palette for the jylhis-graphite theme.
;;  Each entry is (ROLE (GUI-HEX XTERM-256 ANSI-16-NAME)) and is consumed
;;  by `jylhis-apply-faces' in jylhis-theme-core.el.
;;
;;; Code:

(defconst jylhis-graphite-palette
  '(
    (bg              ("#0d0d0d" "color-232" "unspecified-bg"))
    (bg-subtle       ("#161616" "color-235" "black"))
    (surface         ("#1f1f1f" "color-237" "black"))
    (surface-raised  ("#282828" "color-239" "black"))
    (fg              ("#dadada" "color-253" "unspecified-fg"))
    (fg-muted        ("#9a9a9a" "color-247" "white"))
    (fg-heading      ("#f2f2f2" "color-255" "brightwhite"))
    (fg-faint        ("#6a6a6a" "color-242" "brightblack"))
    (accent          ("#ffffff" "color-231" "brightyellow"))
    (accent-hover    ("#dcdcdc" "color-253" "brightblue"))
    (accent-subtle   ("#242424" "color-235" "black"))
    (brand           ("#e8e8e8" "color-254" "red"))
    (border          ("#333333" "color-236" "black"))
    (border-strong   ("#4a4a4a" "color-239" "brightblack"))
    (decorator       ("#3d3d3d" "color-237" "brightblack"))
    (syn-keyword     ("#ededed" "color-255" "red"))
    (syn-string      ("#bcbcbc" "color-250" "yellow"))
    (syn-number      ("#b0b0b0" "color-145" "cyan"))
    (syn-function    ("#e0e0e0" "color-254" "brightblue"))
    (syn-builtin     ("#b6b6b6" "color-249" "yellow"))
    (syn-type        ("#d6d6d6" "color-188" "brightmagenta"))
    (syn-variable    ("#c8c8c8" "color-251" "magenta"))
    (syn-tag         ("#d6d6d6" "color-188" "brightmagenta"))
    (syn-comment     ("#8f8f8f" "color-245" "green"))
    (syn-docstring   ("#9a9a9a" "color-247" "white"))
    (err             ("#f0f0f0" "color-255" "red"))
    (warn            ("#b8b8b8" "color-250" "yellow"))
    (ok              ("#909090" "color-246" "green"))
    (info            ("#d0d0d0" "color-252" "blue"))

    ;; ANSI 16-color slots (for ansi-color-* faces)
    (ansi-black      ("#0d0d0d" "color-232" "black"))
    (ansi-red        ("#f0f0f0" "color-255" "red"))
    (ansi-green      ("#909090" "color-246" "green"))
    (ansi-yellow     ("#b8b8b8" "color-250" "yellow"))
    (ansi-blue       ("#d0d0d0" "color-252" "blue"))
    (ansi-magenta    ("#c8c8c8" "color-251" "magenta"))
    (ansi-cyan       ("#b0b0b0" "color-145" "cyan"))
    (ansi-white      ("#9a9a9a" "color-247" "white"))
    (ansi-bright-black ("#6a6a6a" "color-242" "brightblack"))
    (ansi-bright-red ("#ffffff" "color-231" "brightred"))
    (ansi-bright-green ("#a5a5a5" "color-248" "brightgreen"))
    (ansi-bright-yellow ("#ffffff" "color-231" "brightyellow"))
    (ansi-bright-blue ("#dcdcdc" "color-253" "brightblue"))
    (ansi-bright-magenta ("#d5d5d5" "color-188" "brightmagenta"))
    (ansi-bright-cyan ("#c0c0c0" "color-250" "brightcyan"))
    (ansi-bright-white ("#f2f2f2" "color-255" "brightwhite"))
    )
  "Three-tier palette for the Jylhis graphite theme.
Each entry is (ROLE (GUI-HEX XTERM-256 ANSI-16-NAME)) and is consumed by
`jylhis-apply-faces' to emit a Custom face SPEC-LIST that degrades
across display classes.")

(defconst jylhis-graphite-hl-todo-faces
  '(("FIXME"      . "#f0f0f0")
    ("BUG"        . "#f0f0f0")
    ("TODO"       . "#b8b8b8")
    ("HACK"       . "#b8b8b8")
    ("NOTE"       . "#d0d0d0")
    ("REVIEW"     . "#d0d0d0")
    ("DEPRECATED" . "#6a6a6a"))
  "Suggested `hl-todo-keyword-faces' for the Jylhis graphite theme.")

(provide 'jylhis-graphite-palette)
;;; jylhis-graphite-palette.el ends here
