;;; jylhis-theme-core.el --- Shared face map for Jylhis themes  -*- lexical-binding: t; -*-
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
;;  Canonical face spec list for the Jylhis design system, shared by both
;;  the Paper (light) and Roast (dark) variants.  Each variant ships its
;;  own three-tier palette in jylhis-{paper,roast}-palette.el; this file
;;  resolves palette role symbols into per-display-class face specs.
;;
;;  Display tiers, in order of preference:
;;    - GUI / 24-bit  -> (class color) (min-colors 16777216)  exact hex
;;    - xterm-256     -> (class color) (min-colors 256)       "color-NNN"
;;    - 16-color TTY  -> t                                    named ANSI
;;
;;  A face may carry GUI-only attributes via the :gui key in its attribute
;;  plist; those attributes are folded only into the 24-bit tier so they
;;  do not bleed into terminal fallbacks where they would not render
;;  (e.g. :inherit variable-pitch, :distant-foreground).
;;
;;; Code:

(defconst jylhis--display-gui '((class color) (min-colors 16777216))
  "Display-class spec for full 24-bit GUI / true-color terminals.")

(defconst jylhis--display-256 '((class color) (min-colors 256))
  "Display-class spec for xterm-256 terminals.")

(defun jylhis--resolve (value palette tier)
  "Resolve VALUE against PALETTE at TIER (0=GUI, 1=xterm-256, 2=ANSI-16).
Symbols matching a palette role are replaced with their tier value; nested
keyword plists (e.g. \='(:line-width 1 :color border)') are walked
recursively.  All other values pass through unchanged."
  (cond
   ((symbolp value)
    (let ((entry (assq value palette)))
      (if entry (nth tier (cadr entry)) value)))
   ((and (consp value) (keywordp (car value)))
    (jylhis--rewrite-plist value palette tier))
   (t value)))

(defun jylhis--rewrite-plist (plist palette tier)
  "Walk PLIST, resolving each value via \='jylhis--resolve'."
  (let (out)
    (while plist
      (let ((k (pop plist)) (v (pop plist)))
        (push k out)
        (push (jylhis--resolve v palette tier) out)))
    (nreverse out)))

(defun jylhis--strip-key (plist key)
  "Return PLIST with all KEY/value entries removed."
  (let (out)
    (while plist
      (let ((k (pop plist)) (v (pop plist)))
        (unless (eq k key) (push k out) (push v out))))
    (nreverse out)))

(defun jylhis--build-face-spec (attrs palette)
  "Build a three-tier Custom SPEC-LIST from ATTRS using PALETTE.
ATTRS is a plist; an optional :gui key carries attributes that should
appear only in the GUI tier (e.g. :inherit variable-pitch)."
  (let* ((gui-extra (plist-get attrs :gui))
         (base (jylhis--strip-key attrs :gui)))
    (list
     (list jylhis--display-gui
           (append (jylhis--rewrite-plist base palette 0)
                   (and gui-extra (jylhis--rewrite-plist gui-extra palette 0))))
     (list jylhis--display-256
           (jylhis--rewrite-plist base palette 1))
     (list t
           (jylhis--rewrite-plist base palette 2)))))

(defconst jylhis--face-specs
  '(
    ;; ── Frame / base ─────────────────────────────────────────────────
    (default                            :background bg :foreground fg)
    (cursor                             :background accent :gui (:distant-foreground bg))
    (fringe                             :background bg)
    (vertical-border                    :foreground border)
    (window-divider                     :foreground border)
    (window-divider-first-pixel         :foreground border)
    (window-divider-last-pixel          :foreground border)
    (shadow                             :foreground fg-faint)

    ;; ── Text emphasis ────────────────────────────────────────────────
    (bold                               :weight bold :foreground fg-heading)
    (italic                             :slant italic)
    (underline                          :underline (:color fg-muted))
    (link                               :foreground accent     :underline (:color accent))
    (link-visited                       :foreground syn-number :underline (:color syn-number))

    ;; ── Selection + region (KEYBOARD.md primitives) ─────────────────
    (region                             :background accent-subtle  :extend t)
    (secondary-selection                :background surface        :extend t)
    (highlight                          :background surface-raised :extend t)
    (hl-line                            :background bg-subtle      :extend t)
    (match                              :background accent-subtle :foreground accent :weight bold)
    (isearch                            :background accent        :foreground bg     :weight bold)
    (isearch-fail                       :background err           :foreground bg)
    (lazy-highlight                     :background accent-subtle :foreground fg)

    ;; ── Mode line ───────────────────────────────────────────────────
    (mode-line                          :background surface :foreground fg
                                        :box (:line-width 3 :color surface))
    (mode-line-inactive                 :background bg-subtle :foreground fg-muted
                                        :box (:line-width 3 :color bg-subtle))
    (mode-line-highlight                :foreground accent :background surface-raised)
    (mode-line-emphasis                 :foreground accent :weight bold)
    (mode-line-buffer-id                :foreground fg-heading :weight bold)

    ;; doom-modeline
    (doom-modeline-bar                  :background accent)
    (doom-modeline-bar-inactive         :background surface)
    (doom-modeline-buffer-file          :foreground fg-heading :weight bold)
    (doom-modeline-buffer-modified      :foreground warn :weight bold)
    (doom-modeline-buffer-major-mode    :foreground syn-tag :weight bold)
    (doom-modeline-project-dir          :foreground fg-muted)
    (doom-modeline-info                 :foreground ok)
    (doom-modeline-warning              :foreground warn)
    (doom-modeline-urgent               :foreground err)
    (doom-modeline-lsp-success          :foreground ok)
    (doom-modeline-lsp-warning          :foreground warn)
    (doom-modeline-lsp-error            :foreground err)

    (header-line                        :background bg-subtle :foreground fg-muted
                                        :box (:line-width 3 :color bg-subtle))

    ;; ── Tab-bar / tab-line ──────────────────────────────────────────
    (tab-bar                            :background bg-subtle :foreground fg-muted)
    (tab-bar-tab                        :background surface :foreground fg
                                        :box (:line-width 3 :color surface)
                                        :weight bold)
    (tab-bar-tab-inactive               :background bg-subtle :foreground fg-muted
                                        :box (:line-width 3 :color bg-subtle))

    ;; ── Minibuffer / echo area ──────────────────────────────────────
    (minibuffer-prompt                  :foreground accent :weight bold)
    (error                              :foreground err  :weight bold)
    (warning                            :foreground warn :weight bold)
    (success                            :foreground ok   :weight bold)

    ;; ── Font-lock ───────────────────────────────────────────────────
    (font-lock-builtin-face              :foreground syn-builtin)
    (font-lock-comment-face              :foreground syn-comment :slant italic)
    (font-lock-comment-delimiter-face    :foreground syn-comment)
    (font-lock-constant-face             :foreground syn-number)
    (font-lock-doc-face                  :foreground syn-docstring :slant italic)
    (font-lock-function-name-face        :foreground syn-function :weight bold)
    (font-lock-keyword-face              :foreground syn-keyword  :weight bold)
    (font-lock-negation-char-face        :foreground err)
    (font-lock-preprocessor-face         :foreground syn-builtin)
    (font-lock-regexp-grouping-backslash :foreground syn-function :weight bold)
    (font-lock-regexp-grouping-construct :foreground syn-keyword  :weight bold)
    (font-lock-string-face               :foreground syn-string)
    (font-lock-type-face                 :foreground syn-type)
    (font-lock-variable-name-face        :foreground syn-variable)
    (font-lock-warning-face              :foreground warn :weight bold)

    ;; Tree-sitter richer faces (Emacs 29+)
    (font-lock-bracket-face              :foreground fg-muted)
    (font-lock-delimiter-face            :foreground fg-muted)
    (font-lock-escape-face               :foreground syn-function)
    (font-lock-misc-punctuation-face     :foreground fg-muted)
    (font-lock-number-face               :foreground syn-number)
    (font-lock-operator-face             :foreground syn-keyword)
    (font-lock-property-name-face        :foreground syn-tag)
    (font-lock-property-use-face         :foreground syn-tag)
    (font-lock-punctuation-face          :foreground fg-muted)

    ;; ── Line numbers ────────────────────────────────────────────────
    (line-number                        :background bg :foreground fg-faint)
    (line-number-current-line           :background bg-subtle :foreground accent :weight bold)
    (line-number-major-tick             :foreground fg-muted)
    (line-number-minor-tick             :foreground fg-faint)

    ;; ── Parens / structure ──────────────────────────────────────────
    (show-paren-match                   :background accent-subtle :foreground accent :weight bold)
    (show-paren-mismatch                :background err :foreground bg :weight bold)

    (rainbow-delimiters-depth-1-face    :foreground syn-keyword)
    (rainbow-delimiters-depth-2-face    :foreground syn-string)
    (rainbow-delimiters-depth-3-face    :foreground syn-tag)
    (rainbow-delimiters-depth-4-face    :foreground syn-number)
    (rainbow-delimiters-depth-5-face    :foreground syn-function)
    (rainbow-delimiters-depth-6-face    :foreground accent)
    (rainbow-delimiters-depth-7-face    :foreground fg-muted)
    (rainbow-delimiters-unmatched-face  :foreground err :weight bold)

    ;; ── Vertico / Consult / Marginalia / Corfu / Orderless ─────────
    (vertico-current                    :background accent-subtle :foreground fg :extend t :weight normal)
    (vertico-group-title                :foreground fg-faint :slant italic)
    (vertico-group-separator            :foreground decorator :strike-through t)

    (marginalia-key                     :foreground accent :weight bold)
    (marginalia-documentation           :foreground fg-muted :slant italic)
    (marginalia-date                    :foreground syn-number)
    (marginalia-file-name               :foreground fg)
    (marginalia-size                    :foreground fg-muted)
    (marginalia-mode                    :foreground syn-tag)
    (marginalia-function                :foreground syn-function)
    (marginalia-type                    :foreground syn-tag)
    (marginalia-null                    :foreground fg-faint)
    (marginalia-value                   :foreground fg)

    (consult-file                       :foreground fg)
    (consult-bookmark                   :foreground syn-number)
    (consult-line-number                :foreground fg-faint)
    (consult-preview-line               :background bg-subtle :extend t)
    (consult-preview-match              :background accent-subtle :foreground accent)

    (orderless-match-face-0             :foreground accent     :weight bold)
    (orderless-match-face-1             :foreground syn-string :weight bold)
    (orderless-match-face-2             :foreground syn-tag    :weight bold)
    (orderless-match-face-3             :foreground syn-number :weight bold)

    (corfu-default                      :background surface-raised :foreground fg)
    (corfu-current                      :background accent-subtle  :foreground fg)
    (corfu-border                       :background border-strong)
    (corfu-bar                          :background accent)
    (corfu-echo                         :foreground fg-muted :slant italic)

    (eldoc-highlight-function-argument  :foreground accent :weight bold)
    (tooltip                            :background surface-raised :foreground fg
                                        :gui (:inherit variable-pitch))

    (which-key-key-face                 :foreground accent :weight bold)
    (which-key-group-description-face   :foreground syn-tag)
    (which-key-command-description-face :foreground fg)
    (which-key-local-map-description-face :foreground syn-string)
    (which-key-separator-face           :foreground decorator)
    (which-key-note-face                :foreground fg-faint)

    ;; ── Org ─────────────────────────────────────────────────────────
    (org-level-1                        :foreground accent       :weight bold :height 1.4
                                        :gui (:inherit variable-pitch))
    (org-level-2                        :foreground syn-tag      :weight bold :height 1.2
                                        :gui (:inherit variable-pitch))
    (org-level-3                        :foreground syn-string   :weight bold :height 1.1
                                        :gui (:inherit variable-pitch))
    (org-level-4                        :foreground syn-number   :weight bold)
    (org-level-5                        :foreground syn-function :weight bold)
    (org-level-6                        :foreground syn-keyword)
    (org-level-7                        :foreground fg-muted)
    (org-level-8                        :foreground fg-faint)

    (org-document-title                 :foreground fg-heading :weight bold :height 1.6
                                        :gui (:inherit variable-pitch))
    (org-document-info                  :foreground fg-muted)
    (org-document-info-keyword          :foreground fg-faint)
    (org-meta-line                      :foreground fg-faint :slant italic)
    (org-drawer                         :foreground fg-faint)
    (org-special-keyword                :foreground syn-tag)

    (org-todo                           :foreground warn :weight bold :box (:line-width 1 :color warn))
    (org-done                           :foreground ok   :weight bold :box (:line-width 1 :color ok))
    (org-headline-done                  :foreground fg-muted :strike-through nil)

    (org-date                           :foreground syn-number :underline nil)
    (org-tag                            :foreground fg-muted :weight normal)
    (org-priority                       :foreground accent :weight bold)

    (org-block                          :background bg-subtle :extend t)
    (org-block-begin-line               :background bg-subtle :foreground fg-faint :extend t)
    (org-block-end-line                 :background bg-subtle :foreground fg-faint :extend t)
    (org-code                           :foreground syn-string :background bg-subtle)
    (org-verbatim                       :foreground syn-string)
    (org-quote                          :foreground fg-muted :slant italic)

    (org-table                          :foreground fg :background bg-subtle)
    (org-table-header                   :foreground fg-heading :background surface :weight bold)

    (org-link                           :inherit link)
    (org-footnote                       :foreground syn-number :underline t)
    (org-ellipsis                       :foreground fg-faint :underline nil)
    (org-hide                           :foreground bg)

    (org-modern-tag                     :foreground bg :background syn-tag :weight bold)
    (org-modern-date-active             :foreground bg :background accent  :weight bold)

    (org-agenda-structure               :foreground accent :weight bold)
    (org-agenda-date                    :foreground syn-tag :weight bold)
    (org-agenda-date-today              :foreground accent :weight bold :underline t)
    (org-agenda-date-weekend            :foreground fg-muted)
    (org-scheduled                      :foreground syn-string)
    (org-scheduled-today                :foreground ok :weight bold)
    (org-scheduled-previously           :foreground warn)
    (org-upcoming-deadline              :foreground warn)
    (org-warning                        :foreground warn :weight bold)

    ;; ── Dired ───────────────────────────────────────────────────────
    (dired-directory                    :foreground syn-tag :weight bold)
    (dired-symlink                      :foreground info)
    (dired-broken-symlink               :foreground err :strike-through t)
    (dired-header                       :foreground accent :weight bold)
    (dired-mark                         :foreground accent)
    (dired-marked                       :background accent-subtle :foreground accent :weight bold)
    (dired-perm-write                   :foreground warn)
    (dired-flagged                      :foreground err :weight bold)
    (dired-ignored                      :foreground fg-faint)

    ;; ── Magit / diff ────────────────────────────────────────────────
    (diff-added                         :background bg-subtle :foreground ok)
    (diff-removed                       :background bg-subtle :foreground err)
    (diff-context                       :foreground fg-muted)
    (diff-hunk-header                   :background surface :foreground fg-heading :weight bold)
    (diff-file-header                   :background surface :foreground accent     :weight bold)
    (diff-refine-added                  :background accent-subtle :foreground ok  :weight bold)
    (diff-refine-removed                :background accent-subtle :foreground err :weight bold)

    (magit-section-heading              :foreground accent :weight bold)
    (magit-section-highlight            :background bg-subtle :extend t)
    (magit-branch-local                 :foreground syn-tag :weight bold)
    (magit-branch-remote                :foreground syn-string :weight bold)
    (magit-branch-current               :foreground accent :weight bold :box (:line-width 1 :color accent))
    (magit-tag                          :foreground syn-number)
    (magit-hash                         :foreground fg-faint)
    (magit-log-author                   :foreground syn-function)
    (magit-log-date                     :foreground fg-faint)
    (magit-diff-added                   :background bg-subtle :foreground ok)
    (magit-diff-added-highlight         :background surface   :foreground ok)
    (magit-diff-removed                 :background bg-subtle :foreground err)
    (magit-diff-removed-highlight       :background surface   :foreground err)
    (magit-diff-context                 :foreground fg-muted)
    (magit-diff-context-highlight       :background bg-subtle :foreground fg)
    (magit-diff-hunk-heading            :background surface   :foreground fg-heading)
    (magit-diff-hunk-heading-highlight  :background surface-raised :foreground fg-heading :weight bold)
    (magit-diffstat-added               :foreground ok)
    (magit-diffstat-removed             :foreground err)

    ;; ── Flymake / Flycheck ──────────────────────────────────────────
    (flymake-error                      :underline (:style wave :color err))
    (flymake-warning                    :underline (:style wave :color warn))
    (flymake-note                       :underline (:style wave :color info))
    (flycheck-error                     :underline (:style wave :color err))
    (flycheck-warning                   :underline (:style wave :color warn))
    (flycheck-info                      :underline (:style wave :color info))
    (compilation-error                  :foreground err  :weight bold)
    (compilation-warning                :foreground warn :weight bold)
    (compilation-info                   :foreground info)

    ;; ── Company + Eglot ─────────────────────────────────────────────
    (company-tooltip                    :background surface-raised :foreground fg)
    (company-tooltip-selection          :background accent-subtle  :foreground fg)
    (company-tooltip-common             :foreground accent :weight bold)
    (company-tooltip-annotation         :foreground fg-muted)
    (company-scrollbar-bg               :background surface)
    (company-scrollbar-fg               :background border-strong)

    (eglot-highlight-symbol-face        :background surface :weight bold)
    (eglot-mode-line                    :foreground accent)
    (eglot-diagnostic-tag-deprecated-face :strike-through t :foreground fg-faint)

    ;; ── Terminal (vterm / ansi-term) — tokens.json ANSI palette ─────
    (ansi-color-black                   :foreground ansi-black          :background ansi-black)
    (ansi-color-red                     :foreground ansi-red            :background ansi-red)
    (ansi-color-green                   :foreground ansi-green          :background ansi-green)
    (ansi-color-yellow                  :foreground ansi-yellow         :background ansi-yellow)
    (ansi-color-blue                    :foreground ansi-blue           :background ansi-blue)
    (ansi-color-magenta                 :foreground ansi-magenta        :background ansi-magenta)
    (ansi-color-cyan                    :foreground ansi-cyan           :background ansi-cyan)
    (ansi-color-white                   :foreground ansi-white          :background ansi-white)
    (ansi-color-bright-black            :foreground ansi-bright-black   :background ansi-bright-black)
    (ansi-color-bright-red              :foreground ansi-bright-red     :background ansi-bright-red)
    (ansi-color-bright-green            :foreground ansi-bright-green   :background ansi-bright-green)
    (ansi-color-bright-yellow           :foreground ansi-bright-yellow  :background ansi-bright-yellow)
    (ansi-color-bright-blue             :foreground ansi-bright-blue    :background ansi-bright-blue)
    (ansi-color-bright-magenta          :foreground ansi-bright-magenta :background ansi-bright-magenta)
    (ansi-color-bright-cyan             :foreground ansi-bright-cyan    :background ansi-bright-cyan)
    (ansi-color-bright-white            :foreground ansi-bright-white   :background ansi-bright-white)

    ;; ── Misc ────────────────────────────────────────────────────────
    (trailing-whitespace                :background err)
    (whitespace-tab                     :foreground fg-faint)
    (whitespace-space                   :foreground fg-faint)
    (whitespace-newline                 :foreground fg-faint)
    (whitespace-indentation             :foreground fg-faint)
    (whitespace-line                    :background bg-subtle)
    (whitespace-trailing                :background err)

    (hi-yellow                          :background warn       :foreground bg)
    (hi-pink                            :background syn-number :foreground bg)
    (hi-green                           :background ok         :foreground bg)

    (tab-line-tab-current               :background surface   :foreground accent :weight bold)
    (tab-line-tab                       :background bg-subtle :foreground fg-muted)

    (hl-todo                            :foreground warn :weight bold)
    (indent-bars-face                   :foreground fg-faint))
  "Canonical face spec list shared by all Jylhis theme variants.
Each entry is (FACE :ATTR VALUE … [:gui (:ATTR VALUE …)]).
Symbols in attribute positions are resolved against the active palette to a
three-tier value (24-bit GUI / xterm-256 / 16-color ANSI). The :gui plist
folds attributes into the GUI tier only — use it for attributes like
`:inherit variable-pitch' that do not render on a TTY.")

(defun jylhis-apply-faces (theme palette)
  "Apply the canonical Jylhis face mapping to THEME using PALETTE.
PALETTE is the value of \='jylhis-paper-palette' or \='jylhis-roast-palette'
(or any alist of (ROLE (GUI-HEX XTERM-256 ANSI-16-NAME)))."
  (let ((args (mapcar
               (lambda (spec)
                 (list 'quote
                       (list (car spec)
                             (jylhis--build-face-spec (cdr spec) palette))))
               jylhis--face-specs)))
    (eval `(custom-theme-set-faces ',theme ,@args) t)))

(provide 'jylhis-theme-core)
;;; jylhis-theme-core.el ends here
