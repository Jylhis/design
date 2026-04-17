;;; jylhis-paper-theme.el --- Jylhis light theme  -*- lexical-binding: t; -*-
;;
;; Author:      Henrik Jylhä
;; Homepage:    https://jylhis.com
;; Keywords:    faces, theme
;; Package-Requires: ((emacs "28.1"))
;;
;;; Commentary:
;;
;;  Light "paper" variant of the Jylhis design system for Emacs.
;;  Modus-style semantic face targeting — see tokens.md §2 for the source-of-truth
;;  palette and platforms/KEYBOARD.md for the shared primitives (focus, kbd,
;;  selected-item language).  A sibling `jylhis-paper-theme.el` ships the light
;;  variant; both reuse the same semantic face map below.
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
;;                                 'jylhis-paper 'jylhis-paper) t))))
;;
;;; Code:

(deftheme jylhis-paper
  "Jylhis — light theme. Copper accent on warm paper, Modus Operandi syntax.")

(let ((class '((class color) (min-colors 256)))

      ;; ── Core palette (tokens.md §1, LIGHT column) ──
      (bg            "#faf7f2")
      (bg-subtle     "#f0ebe3")
      (surface       "#e8e1d6")
      (surface-raised "#fefdfb")
      (fg            "#2c2825")
      (fg-muted      "#6b5f54")
      (fg-heading    "#1e1b18")
      (fg-faint      "#8a7f72")
      (accent        "#9a5a2a")
      (accent-hover  "#7a4622")
      (accent-subtle "#f0e2d1")
      (brand         "#b5703c")
      (border        "#d5cec4")
      (border-strong "#b0a898")
      (decorator     "#c4baa8")

      ;; ── Syntax / semantic — Modus Operandi (tokens.md §2) ──
      (syn-keyword   "#531ab6") ; magenta-cooler
      (syn-string    "#0000b0") ; blue-cooler
      (syn-number    "#3548cf") ; blue-warmer  (constants/numbers)
      (syn-function  "#721045") ; magenta
      (syn-builtin   "#8f0075") ; magenta-warmer
      (syn-type      "#005f5f") ; cyan-cooler
      (syn-variable  "#005e8b") ; cyan
      (syn-tag       "#005f5f") ; cyan-cooler (alias of type)
      (syn-comment   "#7f1010") ; red-faint
      (syn-docstring "#2a5045") ; green-faint
      ;; Semantic status — Modus red/yellow/green/blue accents
      (err  "#a60000")
      (warn "#6f5500")
      (ok   "#006800")
      (info "#0031a9"))

  (custom-theme-set-faces
   'jylhis-paper

   ;; ─────────────────────────────────────────────
   ;; Frame / base
   ;; ─────────────────────────────────────────────
   `(default             ((,class :background ,bg :foreground ,fg)))
   `(cursor              ((,class :background ,accent)))
   `(fringe              ((,class :background ,bg)))
   `(vertical-border     ((,class :foreground ,border)))
   `(window-divider      ((,class :foreground ,border)))
   `(window-divider-first-pixel  ((,class :foreground ,border)))
   `(window-divider-last-pixel   ((,class :foreground ,border)))
   `(shadow              ((,class :foreground ,fg-faint)))

   ;; ─────────────────────────────────────────────
   ;; Text emphasis
   ;; ─────────────────────────────────────────────
   `(bold                ((,class :weight bold :foreground ,fg-heading)))
   `(italic              ((,class :slant italic)))
   `(underline           ((,class :underline (:color ,fg-muted))))
   `(link                ((,class :foreground ,accent :underline (:color ,accent))))
   `(link-visited        ((,class :foreground ,syn-number :underline (:color ,syn-number))))

   ;; ─────────────────────────────────────────────
   ;; Selection + region  (KEYBOARD.md primitives)
   ;; In TUI / GUI: accent-subtle bg. No border-left available on regions,
   ;; so inverse is the fallback for point-indicating faces.
   ;; ─────────────────────────────────────────────
   `(region              ((,class :background ,accent-subtle :extend t)))
   `(secondary-selection ((,class :background ,surface :extend t)))
   `(highlight           ((,class :background ,surface-raised :extend t)))
   `(hl-line             ((,class :background ,bg-subtle :extend t)))
   `(match               ((,class :background ,accent-subtle :foreground ,accent :weight bold)))
   `(isearch             ((,class :background ,accent :foreground ,bg :weight bold)))
   `(isearch-fail        ((,class :background ,err :foreground ,bg)))
   `(lazy-highlight      ((,class :background ,accent-subtle :foreground ,fg)))

   ;; ─────────────────────────────────────────────
   ;; Mode line  (both active and inactive read clearly at TUI density)
   ;; ─────────────────────────────────────────────
   `(mode-line
     ((,class :background ,surface :foreground ,fg
              :box (:line-width 3 :color ,surface))))
   `(mode-line-inactive
     ((,class :background ,bg-subtle :foreground ,fg-muted
              :box (:line-width 3 :color ,bg-subtle))))
   `(mode-line-highlight ((,class :foreground ,accent :background ,surface-raised)))
   `(mode-line-emphasis  ((,class :foreground ,accent :weight bold)))
   `(mode-line-buffer-id ((,class :foreground ,fg-heading :weight bold)))

   ;; Header-line = the "second toolbar". Kept quiet.
   `(header-line          ((,class :background ,bg-subtle :foreground ,fg-muted
                                   :box (:line-width 3 :color ,bg-subtle))))

   ;; Tab-bar / tab-line — selected tab uses the canonical language
   `(tab-bar              ((,class :background ,bg-subtle :foreground ,fg-muted)))
   `(tab-bar-tab          ((,class :background ,surface :foreground ,fg
                                   :box (:line-width 3 :color ,surface)
                                   :weight bold)))
   `(tab-bar-tab-inactive ((,class :background ,bg-subtle :foreground ,fg-muted
                                   :box (:line-width 3 :color ,bg-subtle))))

   ;; ─────────────────────────────────────────────
   ;; Minibuffer / echo area
   ;; ─────────────────────────────────────────────
   `(minibuffer-prompt    ((,class :foreground ,accent :weight bold)))
   `(error                ((,class :foreground ,err   :weight bold)))
   `(warning              ((,class :foreground ,warn  :weight bold)))
   `(success              ((,class :foreground ,ok    :weight bold)))

   ;; ─────────────────────────────────────────────
   ;; Font-lock  (semantic face mapping tokens.md §2)
   ;; ─────────────────────────────────────────────
   `(font-lock-builtin-face          ((,class :foreground ,syn-builtin)))
   `(font-lock-comment-face          ((,class :foreground ,syn-comment :slant italic)))
   `(font-lock-comment-delimiter-face ((,class :foreground ,syn-comment)))
   `(font-lock-constant-face         ((,class :foreground ,syn-number)))
   `(font-lock-doc-face              ((,class :foreground ,syn-docstring :slant italic)))
   `(font-lock-function-name-face    ((,class :foreground ,syn-function :weight bold)))
   `(font-lock-keyword-face          ((,class :foreground ,syn-keyword :weight bold)))
   `(font-lock-negation-char-face    ((,class :foreground ,err)))
   `(font-lock-preprocessor-face     ((,class :foreground ,syn-builtin)))
   `(font-lock-regexp-grouping-backslash ((,class :foreground ,syn-function :weight bold)))
   `(font-lock-regexp-grouping-construct ((,class :foreground ,syn-keyword :weight bold)))
   `(font-lock-string-face           ((,class :foreground ,syn-string)))
   `(font-lock-type-face             ((,class :foreground ,syn-type)))
   `(font-lock-variable-name-face    ((,class :foreground ,syn-variable)))
   `(font-lock-warning-face          ((,class :foreground ,warn :weight bold)))

   ;; Tree-sitter richer faces (Emacs 29+)
   `(font-lock-bracket-face          ((,class :foreground ,fg-muted)))
   `(font-lock-delimiter-face        ((,class :foreground ,fg-muted)))
   `(font-lock-escape-face           ((,class :foreground ,syn-function)))
   `(font-lock-misc-punctuation-face ((,class :foreground ,fg-muted)))
   `(font-lock-number-face           ((,class :foreground ,syn-number)))
   `(font-lock-operator-face         ((,class :foreground ,syn-keyword)))
   `(font-lock-property-name-face    ((,class :foreground ,syn-tag)))
   `(font-lock-property-use-face     ((,class :foreground ,syn-tag)))
   `(font-lock-punctuation-face      ((,class :foreground ,fg-muted)))

   ;; ─────────────────────────────────────────────
   ;; Line numbers
   ;; ─────────────────────────────────────────────
   `(line-number              ((,class :background ,bg :foreground ,fg-faint)))
   `(line-number-current-line ((,class :background ,bg-subtle :foreground ,accent :weight bold)))
   `(line-number-major-tick   ((,class :foreground ,fg-muted)))
   `(line-number-minor-tick   ((,class :foreground ,fg-faint)))

   ;; ─────────────────────────────────────────────
   ;; Parens / structure
   ;; ─────────────────────────────────────────────
   `(show-paren-match         ((,class :background ,accent-subtle :foreground ,accent :weight bold)))
   `(show-paren-mismatch      ((,class :background ,err :foreground ,bg :weight bold)))

   ;; rainbow-delimiters — desaturated earth rainbow
   `(rainbow-delimiters-depth-1-face ((,class :foreground ,syn-keyword)))
   `(rainbow-delimiters-depth-2-face ((,class :foreground ,syn-string)))
   `(rainbow-delimiters-depth-3-face ((,class :foreground ,syn-tag)))
   `(rainbow-delimiters-depth-4-face ((,class :foreground ,syn-number)))
   `(rainbow-delimiters-depth-5-face ((,class :foreground ,syn-function)))
   `(rainbow-delimiters-depth-6-face ((,class :foreground ,accent)))
   `(rainbow-delimiters-depth-7-face ((,class :foreground ,fg-muted)))
   `(rainbow-delimiters-unmatched-face ((,class :foreground ,err :weight bold)))

   ;; ─────────────────────────────────────────────
   ;; Vertico / Consult / Marginalia / Corfu / Orderless
   ;; — this IS the command palette (KEYBOARD.md §"Command palette")
   ;; ─────────────────────────────────────────────
   `(vertico-current        ((,class :background ,accent-subtle
                                     :foreground ,fg :extend t
                                     :weight normal)))
   `(vertico-group-title    ((,class :foreground ,fg-faint :slant italic)))
   `(vertico-group-separator ((,class :foreground ,decorator :strike-through t)))

   `(marginalia-key          ((,class :foreground ,accent :weight bold)))
   `(marginalia-documentation ((,class :foreground ,fg-muted :slant italic)))
   `(marginalia-date         ((,class :foreground ,syn-number)))
   `(marginalia-file-name    ((,class :foreground ,fg)))
   `(marginalia-size         ((,class :foreground ,fg-muted)))
   `(marginalia-mode         ((,class :foreground ,syn-tag)))
   `(marginalia-function     ((,class :foreground ,syn-function)))
   `(marginalia-type         ((,class :foreground ,syn-tag)))
   `(marginalia-null         ((,class :foreground ,fg-faint)))
   `(marginalia-value        ((,class :foreground ,fg)))

   `(consult-file           ((,class :foreground ,fg)))
   `(consult-bookmark       ((,class :foreground ,syn-number)))
   `(consult-line-number    ((,class :foreground ,fg-faint)))
   `(consult-preview-line   ((,class :background ,bg-subtle :extend t)))
   `(consult-preview-match  ((,class :background ,accent-subtle :foreground ,accent)))

   `(orderless-match-face-0  ((,class :foreground ,accent :weight bold)))
   `(orderless-match-face-1  ((,class :foreground ,syn-string :weight bold)))
   `(orderless-match-face-2  ((,class :foreground ,syn-tag :weight bold)))
   `(orderless-match-face-3  ((,class :foreground ,syn-number :weight bold)))

   `(corfu-default           ((,class :background ,surface-raised :foreground ,fg)))
   `(corfu-current           ((,class :background ,accent-subtle :foreground ,fg)))
   `(corfu-border            ((,class :background ,border-strong)))
   `(corfu-bar               ((,class :background ,accent)))
   `(corfu-echo              ((,class :foreground ,fg-muted :slant italic)))

   ;; Eldoc / tooltip
   `(eldoc-highlight-function-argument ((,class :foreground ,accent :weight bold)))
   `(tooltip                 ((,class :background ,surface-raised :foreground ,fg
                                      :inherit variable-pitch)))

   ;; which-key — the leader cheatsheet (KEYBOARD.md §"Leader key cheatsheet")
   `(which-key-key-face        ((,class :foreground ,accent :weight bold)))
   `(which-key-group-description-face ((,class :foreground ,syn-tag)))
   `(which-key-command-description-face ((,class :foreground ,fg)))
   `(which-key-local-map-description-face ((,class :foreground ,syn-string)))
   `(which-key-separator-face  ((,class :foreground ,decorator)))
   `(which-key-note-face       ((,class :foreground ,fg-faint)))

   ;; ─────────────────────────────────────────────
   ;; Org — Modus-style heading scale (§8 of their manual)
   ;; ─────────────────────────────────────────────
   `(org-level-1    ((,class :foreground ,accent       :weight bold :height 1.4)))
   `(org-level-2    ((,class :foreground ,syn-tag      :weight bold :height 1.2)))
   `(org-level-3    ((,class :foreground ,syn-string   :weight bold :height 1.1)))
   `(org-level-4    ((,class :foreground ,syn-number   :weight bold)))
   `(org-level-5    ((,class :foreground ,syn-function :weight bold)))
   `(org-level-6    ((,class :foreground ,syn-keyword)))
   `(org-level-7    ((,class :foreground ,fg-muted)))
   `(org-level-8    ((,class :foreground ,fg-faint)))

   `(org-document-title      ((,class :foreground ,fg-heading :weight bold :height 1.6)))
   `(org-document-info       ((,class :foreground ,fg-muted)))
   `(org-document-info-keyword ((,class :foreground ,fg-faint)))
   `(org-meta-line           ((,class :foreground ,fg-faint :slant italic)))
   `(org-drawer              ((,class :foreground ,fg-faint)))
   `(org-special-keyword     ((,class :foreground ,syn-tag)))

   `(org-todo                ((,class :foreground ,warn :weight bold :box (:line-width 1 :color ,warn))))
   `(org-done                ((,class :foreground ,ok :weight bold :box (:line-width 1 :color ,ok))))
   `(org-headline-done       ((,class :foreground ,fg-muted :strike-through nil)))

   `(org-date                ((,class :foreground ,syn-number :underline nil)))
   `(org-tag                 ((,class :foreground ,fg-muted :weight normal)))
   `(org-priority            ((,class :foreground ,accent :weight bold)))

   `(org-block               ((,class :background ,bg-subtle :extend t)))
   `(org-block-begin-line    ((,class :background ,bg-subtle :foreground ,fg-faint :extend t)))
   `(org-block-end-line      ((,class :background ,bg-subtle :foreground ,fg-faint :extend t)))
   `(org-code                ((,class :foreground ,syn-string :background ,bg-subtle)))
   `(org-verbatim            ((,class :foreground ,syn-string)))
   `(org-quote               ((,class :foreground ,fg-muted :slant italic)))

   `(org-table               ((,class :foreground ,fg :background ,bg-subtle)))
   `(org-table-header        ((,class :foreground ,fg-heading :background ,surface :weight bold)))

   `(org-link                ((,class :inherit link)))
   `(org-footnote            ((,class :foreground ,syn-number :underline t)))
   `(org-ellipsis            ((,class :foreground ,fg-faint :underline nil)))
   `(org-hide                ((,class :foreground ,bg)))

   ;; org-modern helpers
   `(org-modern-tag          ((,class :foreground ,bg :background ,syn-tag :weight bold)))
   `(org-modern-date-active  ((,class :foreground ,bg :background ,accent :weight bold)))

   ;; Agenda
   `(org-agenda-structure    ((,class :foreground ,accent :weight bold)))
   `(org-agenda-date         ((,class :foreground ,syn-tag :weight bold)))
   `(org-agenda-date-today   ((,class :foreground ,accent :weight bold :underline t)))
   `(org-agenda-date-weekend ((,class :foreground ,fg-muted)))
   `(org-scheduled           ((,class :foreground ,syn-string)))
   `(org-scheduled-today     ((,class :foreground ,ok :weight bold)))
   `(org-scheduled-previously ((,class :foreground ,warn)))
   `(org-upcoming-deadline   ((,class :foreground ,warn)))
   `(org-warning             ((,class :foreground ,warn :weight bold)))

   ;; ─────────────────────────────────────────────
   ;; Dired
   ;; ─────────────────────────────────────────────
   `(dired-directory         ((,class :foreground ,syn-tag :weight bold)))
   `(dired-symlink           ((,class :foreground ,info)))
   `(dired-broken-symlink    ((,class :foreground ,err :strike-through t)))
   `(dired-header            ((,class :foreground ,accent :weight bold)))
   `(dired-mark              ((,class :foreground ,accent)))
   `(dired-marked            ((,class :background ,accent-subtle :foreground ,accent :weight bold)))
   `(dired-perm-write        ((,class :foreground ,warn)))
   `(dired-flagged           ((,class :foreground ,err :weight bold)))
   `(dired-ignored           ((,class :foreground ,fg-faint)))

   ;; ─────────────────────────────────────────────
   ;; Magit / diff
   ;; ─────────────────────────────────────────────
   `(diff-added              ((,class :background ,bg-subtle :foreground ,ok)))
   `(diff-removed            ((,class :background ,bg-subtle :foreground ,err)))
   `(diff-context            ((,class :foreground ,fg-muted)))
   `(diff-hunk-header        ((,class :background ,surface :foreground ,fg-heading :weight bold)))
   `(diff-file-header        ((,class :background ,surface :foreground ,accent :weight bold)))
   `(diff-refine-added       ((,class :background ,accent-subtle :foreground ,ok :weight bold)))
   `(diff-refine-removed     ((,class :background ,accent-subtle :foreground ,err :weight bold)))

   `(magit-section-heading           ((,class :foreground ,accent :weight bold)))
   `(magit-section-highlight         ((,class :background ,bg-subtle :extend t)))
   `(magit-branch-local              ((,class :foreground ,syn-tag :weight bold)))
   `(magit-branch-remote             ((,class :foreground ,syn-string :weight bold)))
   `(magit-branch-current            ((,class :foreground ,accent :weight bold
                                              :box (:line-width 1 :color ,accent))))
   `(magit-tag                       ((,class :foreground ,syn-number)))
   `(magit-hash                      ((,class :foreground ,fg-faint)))
   `(magit-log-author                ((,class :foreground ,syn-function)))
   `(magit-log-date                  ((,class :foreground ,fg-faint)))
   `(magit-diff-added                ((,class :background ,bg-subtle :foreground ,ok)))
   `(magit-diff-added-highlight      ((,class :background ,surface :foreground ,ok)))
   `(magit-diff-removed              ((,class :background ,bg-subtle :foreground ,err)))
   `(magit-diff-removed-highlight    ((,class :background ,surface :foreground ,err)))
   `(magit-diff-context              ((,class :foreground ,fg-muted)))
   `(magit-diff-context-highlight    ((,class :background ,bg-subtle :foreground ,fg)))
   `(magit-diff-hunk-heading         ((,class :background ,surface :foreground ,fg-heading)))
   `(magit-diff-hunk-heading-highlight ((,class :background ,surface-raised :foreground ,fg-heading :weight bold)))
   `(magit-diffstat-added            ((,class :foreground ,ok)))
   `(magit-diffstat-removed          ((,class :foreground ,err)))

   ;; ─────────────────────────────────────────────
   ;; Flymake / Flycheck — semantic dots only, no fringe chatter
   ;; ─────────────────────────────────────────────
   `(flymake-error           ((,class :underline (:style wave :color ,err))))
   `(flymake-warning         ((,class :underline (:style wave :color ,warn))))
   `(flymake-note            ((,class :underline (:style wave :color ,info))))
   `(flycheck-error          ((,class :underline (:style wave :color ,err))))
   `(flycheck-warning        ((,class :underline (:style wave :color ,warn))))
   `(flycheck-info           ((,class :underline (:style wave :color ,info))))
   `(compilation-error       ((,class :foreground ,err :weight bold)))
   `(compilation-warning     ((,class :foreground ,warn :weight bold)))
   `(compilation-info        ((,class :foreground ,info)))

   ;; ─────────────────────────────────────────────
   ;; Company (if you're still on it) + Eglot
   ;; ─────────────────────────────────────────────
   `(company-tooltip                      ((,class :background ,surface-raised :foreground ,fg)))
   `(company-tooltip-selection            ((,class :background ,accent-subtle :foreground ,fg)))
   `(company-tooltip-common               ((,class :foreground ,accent :weight bold)))
   `(company-tooltip-annotation           ((,class :foreground ,fg-muted)))
   `(company-scrollbar-bg                 ((,class :background ,surface)))
   `(company-scrollbar-fg                 ((,class :background ,border-strong)))

   `(eglot-highlight-symbol-face          ((,class :background ,surface :weight bold)))
   `(eglot-mode-line                      ((,class :foreground ,accent)))
   `(eglot-diagnostic-tag-deprecated-face ((,class :strike-through t :foreground ,fg-faint)))

   ;; ─────────────────────────────────────────────
   ;; Terminal (vterm / ansi-term)  — tokens.md §3
   ;; ─────────────────────────────────────────────
   `(ansi-color-black          ((,class :foreground "#2c2825" :background "#2c2825")))
   `(ansi-color-red            ((,class :foreground "#a60000" :background "#a60000")))
   `(ansi-color-green          ((,class :foreground "#006800" :background "#006800")))
   `(ansi-color-yellow         ((,class :foreground "#6f5500" :background "#6f5500")))
   `(ansi-color-blue           ((,class :foreground "#0031a9" :background "#0031a9")))
   `(ansi-color-magenta        ((,class :foreground "#721045" :background "#721045")))
   `(ansi-color-cyan           ((,class :foreground "#005f5f" :background "#005f5f")))
   `(ansi-color-white          ((,class :foreground "#e8e1d6" :background "#e8e1d6")))
   `(ansi-color-bright-black   ((,class :foreground "#8a7f72" :background "#8a7f72")))
   `(ansi-color-bright-red     ((,class :foreground "#972500" :background "#972500")))
   `(ansi-color-bright-green   ((,class :foreground "#315b00" :background "#315b00")))
   `(ansi-color-bright-yellow  ((,class :foreground "#b5703c" :background "#b5703c")))
   `(ansi-color-bright-blue    ((,class :foreground "#3548cf" :background "#3548cf")))
   `(ansi-color-bright-magenta ((,class :foreground "#531ab6" :background "#531ab6")))
   `(ansi-color-bright-cyan    ((,class :foreground "#005e8b" :background "#005e8b")))
   `(ansi-color-bright-white   ((,class :foreground "#fefdfb" :background "#fefdfb")))

   ;; ─────────────────────────────────────────────
   ;; Misc
   ;; ─────────────────────────────────────────────
   `(trailing-whitespace       ((,class :background ,err)))
   `(whitespace-tab            ((,class :foreground ,fg-faint)))
   `(whitespace-space          ((,class :foreground ,fg-faint)))
   `(whitespace-newline        ((,class :foreground ,fg-faint)))
   `(whitespace-indentation    ((,class :foreground ,fg-faint)))
   `(whitespace-line           ((,class :background ,bg-subtle)))
   `(whitespace-trailing       ((,class :background ,err)))

   `(hi-yellow                 ((,class :background ,warn :foreground ,bg)))
   `(hi-pink                   ((,class :background ,syn-number :foreground ,bg)))
   `(hi-green                  ((,class :background ,ok :foreground ,bg)))

   ;; tab-line / centaur-tabs — same selected language
   `(tab-line-tab-current      ((,class :background ,surface :foreground ,accent :weight bold)))
   `(tab-line-tab              ((,class :background ,bg-subtle :foreground ,fg-muted)))))

(custom-theme-set-variables
 'jylhis-paper
 '(ansi-color-names-vector
   ["#2c2825" "#a60000" "#006800" "#6f5500"
    "#0031a9" "#721045" "#005f5f" "#e8e1d6"])
 '(ansi-color-faces-vector
   [default default default italic underline success warning error]))

(provide-theme 'jylhis-paper)

;;;###autoload
(and load-file-name
     (boundp 'custom-theme-load-path)
     (add-to-list 'custom-theme-load-path
                  (file-name-as-directory
                   (file-name-directory load-file-name))))

;;; jylhis-paper-theme.el ends here
