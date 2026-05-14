;;; jylhis-roast-palette.el --- Jylhis roast palette  -*- lexical-binding: t; -*-
;;
;; GENERATED from tokens.json. Do not edit by hand.
;; Run: bun scripts/generate.mjs
;;
;;; Commentary:
;;
;;  Three-tier color palette for the jylhis-roast theme.
;;  Each entry is (ROLE (GUI-HEX XTERM-256 ANSI-16-NAME)) and is consumed
;;  by `jylhis-apply-faces' in jylhis-theme-core.el.
;;
;;; Code:

(defconst jylhis-roast-palette
  '(
    (bg              ("#1a1714" "color-233" "black"))
    (bg-subtle       ("#242019" "color-234" "black"))
    (surface         ("#2a2520" "color-235" "black"))
    (surface-raised  ("#363230" "color-236" "black"))
    (fg              ("#e8e0d4" "color-253" "white"))
    (fg-muted        ("#b0a496" "color-144" "brightyellow"))
    (fg-heading      ("#f0eae0" "color-254" "brightwhite"))
    (fg-faint        ("#8a7f72" "color-244" "brightblack"))
    (accent          ("#e89b5e" "color-173" "brightyellow"))
    (accent-hover    ("#f5b07a" "color-216" "brightyellow"))
    (accent-subtle   ("#2e2520" "color-235" "black"))
    (brand           ("#d4884a" "color-173" "brightyellow"))
    (border          ("#3d3830" "color-237" "black"))
    (border-strong   ("#5a5248" "color-239" "brightblack"))
    (decorator       ("#4a4338" "color-238" "brightblack"))
    (syn-keyword     ("#c8a5ff" "color-183" "brightmagenta"))
    (syn-string      ("#b3c785" "color-150" "brightyellow"))
    (syn-number      ("#a8b4dc" "color-146" "brightmagenta"))
    (syn-function    ("#f0a8c3" "color-217" "magenta"))
    (syn-builtin     ("#e3a0d8" "color-182" "magenta"))
    (syn-type        ("#80c8b3" "color-115" "cyan"))
    (syn-variable    ("#95b3cc" "color-110" "brightblue"))
    (syn-tag         ("#80c8b3" "color-115" "cyan"))
    (syn-comment     ("#9c8c6e" "color-137" "brightblack"))
    (syn-docstring   ("#9bbf9b" "color-248" "cyan"))
    (err             ("#ff5f59" "color-203" "red"))
    (warn            ("#d0bc00" "color-178" "yellow"))
    (ok              ("#44bc44" "color-71" "green"))
    (info            ("#2fafff" "color-39" "blue"))

    ;; ANSI 16-color slots (for ansi-color-* faces)
    (ansi-black      ("#1a1714" "color-233" "black"))
    (ansi-red        ("#ff5f59" "color-203" "red"))
    (ansi-green      ("#44bc44" "color-71" "green"))
    (ansi-yellow     ("#d0bc00" "color-178" "yellow"))
    (ansi-blue       ("#2fafff" "color-39" "blue"))
    (ansi-magenta    ("#feacd0" "color-218" "magenta"))
    (ansi-cyan       ("#6ae4b9" "color-79" "cyan"))
    (ansi-white      ("#e8e0d4" "color-253" "white"))
    (ansi-bright-black ("#6b6157" "color-241" "brightblack"))
    (ansi-bright-red ("#ff7f7f" "color-210" "brightred"))
    (ansi-bright-green ("#70b900" "color-70" "brightgreen"))
    (ansi-bright-yellow ("#e89b5e" "color-173" "brightyellow"))
    (ansi-bright-blue ("#79a8ff" "color-111" "brightblue"))
    (ansi-bright-magenta ("#b6a0ff" "color-147" "brightmagenta"))
    (ansi-bright-cyan ("#00d3d0" "color-44" "brightcyan"))
    (ansi-bright-white ("#f0eae0" "color-254" "brightwhite"))
    )
  "Three-tier palette for the Jylhis roast theme.
Each entry is (ROLE (GUI-HEX XTERM-256 ANSI-16-NAME)) and is consumed by
`jylhis-apply-faces' to emit a Custom face SPEC-LIST that degrades
across display classes.")

(defconst jylhis-roast-hl-todo-faces
  '(("FIXME"      . "#ff5f59")
    ("BUG"        . "#ff5f59")
    ("TODO"       . "#d0bc00")
    ("HACK"       . "#d0bc00")
    ("NOTE"       . "#2fafff")
    ("REVIEW"     . "#2fafff")
    ("DEPRECATED" . "#8a7f72"))
  "Suggested `hl-todo-keyword-faces' for the Jylhis roast theme.")

(provide 'jylhis-roast-palette)
;;; jylhis-roast-palette.el ends here
