> **Provenance.** This review was authored inside the claude.ai/design project,
> which carries a curated design-surface copy of this repo — `scripts/` (the
> generator and validators) is intentionally absent there. Finding A1 and the
> "docs drift" item describe that snapshot, not this repository: here the full
> pipeline exists and CI runs it on every push. The component/state and
> preview-de-drift recommendations marked **applied** are included in this repo.

# Design System Review — July 2026 (second edition)

Audited per the AI-tells & structural-quality review guide (detect mode:
findings + recommendations, no rewrites). Supersedes the first review.

> **Historical.** This is the _second edition of the review_, not a review of
> design v2. It audits the system as it stood **before** the v2 "The Survey"
> retheme — warm cream grounds, copper accent, Literata + JetBrains Mono. Its
> palette and type observations describe that state and are kept as-is for the
> record; the current direction is [`../DESIGN.md`](../DESIGN.md).

## 1 · Profile & scope

Reviewed: `tokens.json` (87 tokens), `styles.css` closure (tokens, fonts,
type helpers, `components/components.css`), 11 React components, 34 preview
specimens, showcase `index.html`, platform targets, docs, CI workflows.
Stack: no-framework HTML/CSS + React components, static showcase.
**Render available** — light and dark verified in-browser; palette-dominance
and rhythm findings below are render-backed, not inferred.

## 2 · Audit

### P0

**None.** No gradients anywhere (banned by the system), no stock sans, no
centered-hero/three-cards template, no untouched framework theme, no
gradient text, no glassmorphism. Zero-P0 target met.

### Accessibility-priority (treated as P0 regardless of tier)

- **A1 · Enforcement is broken — code-certain.**
  `.github/workflows/validate.yml` runs five bun scripts
  (`generate.mjs --check`, `validate-tokens`, `validate-a11y-html`,
  `validate-a11y-css`, `validate-cli-conventions`); `scripts/` contains only
  the two Pages shell scripts. Every push fails CI, and the accessibility
  guarantees the docs advertise are currently unenforced. `CLAUDE.md`,
  `README.md`, and `justfile` all reference the missing scripts. This is the
  single most important finding: the system's a11y story is its spine, and
  right now it is documentation, not verification.

### P1

- **K4 · Colored left-border accent cards — code-certain.**
  `.ds-callout` (copper 3px left border) and `.ds-alert` (status 3px left
  border) match the catalog's most reliable AI tell. Calibration applies:
  both are committed, documented patterns — the `//` label prefix and the
  glyph+label status rule are what make them _chosen_ rather than defaulted.
  Verdict: keep, but codify the guardrail (see recommendations); a left-border
  card without its `//` label is indistinguishable from the tell.
  **Superseded (July 2026 Impeccable review):** the owner opted to convert
  alerts, callouts, and blockquotes to a full hairline border + tint; the 3px
  stripe survives only as the selected-item marker (`--border-marker`).
- **K7 · State completeness — code-certain.**
  Hover + `:focus-visible` are consistently defined (good), but `Button` has
  no `:disabled` or loading treatment, `Tag`/`Breadcrumb` no `:active`, and
  the system defines no empty-state or `aria-live` guidance for dynamic
  content. Happy-path bias.
- **Drift · Previews violate the system's own no-duplication rule —
  code-certain.** `preview/tags-badges.html`, `preview/cards.html`, and
  `preview/modal.html` hardcode `rgba(0,104,0,0.12)`-style literals that
  duplicate token values; `components/components.css` already solved this
  with `color-mix(... var(--token) ...)`. One hex literal (`#6b5f54`) in
  tags-badges. The canonical components and their specimens disagree.
- **Docs drift — code-certain.** The generator/validator pipeline described
  at length in `CLAUDE.md` and `README.md` (architecture diagram, workflow
  section, file index) no longer exists on disk. Stale system docs are a
  drift engine: future generation will follow the described-but-absent
  conventions or fill the vacuum with defaults.

### P2

- **CP3 · `GitHub →` ghost button** (`preview/buttons.html`,
  `components/Button/card.html`) — raw arrow stapled to a CTA matches the
  catalog tell. Context lowers it: Unicode glyphs _are_ this system's icon
  language, and `›`/`▸`/`→` are documented decorators. Fine to keep; be
  aware it reads as the tell when seen in isolation.
- **Mobile — inferred.** Previews and prototypes are desktop/tablet;
  body size steps down at 860px but no specimen demonstrates a mobile
  layout, and interactive chips (`.ds-tag` links, search trigger) sit well
  under 44px targets. Desktop-dense is a legitimate stance for this
  audience; a stated position in the docs would make it a decision.
- All-caps mono eyebrow labels are pervasive in specimens — here they are
  the committed man-page idiom (`.ds-man-label`), not the reflex. No flag.

## 3 · Structural report

| Area                      | Verdict                                                                                                                                                                        |
| ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Accessibility spec        | **Pass** — AAA body / AA muted commitments with ratios inlined in tokens.json; universal reduced-motion guard; glyph+label status rule; focus-visible everywhere               |
| Accessibility enforcement | **Gap** — validators missing (A1)                                                                                                                                              |
| State completeness        | **Gap** — disabled/loading/empty undefined (K7)                                                                                                                                |
| Dark patterns             | **Pass** — no money/consent/default flows exist                                                                                                                                |
| Token traceability        | **Pass** in `components.css` (vars + color-mix only); **gap** in three preview files (drift)                                                                                   |
| Negative constraints      | **Pass, exemplary** — "no emoji, no gradients, no shadows, copper never syntax, no pill aesthetic" are written down; this is exactly what keeps future generation on-direction |
| Intent documentation      | **Pass** — tokens carry per-role notes; influences documented with what was _rejected_ from each                                                                               |

## 4 · Direction judgment

1. **Justified** — pass. Choices carry reasons (Finnish diacritic coverage
   for the type pairing, Modus provenance for syntax, ANSI-11 copper as a
   deliberate cross-target override).
2. **Coherent** — pass. Paper-and-press vocabulary, mono headings, glyph
   iconography, keyboard-first primitives, and terminal-depth targets are
   one idea executed everywhere.
3. **Not a re-run** — **qualified pass.** The foundation layer (warm paper +
   serif + single accent) is, verbatim, the guide's named second-order
   default. What clears it: the genre-inverting **mono-display-over-serif-body**
   pairing, Modus fidelity, 14 generated platform targets, and content-native
   components (line-numbered CV, terminal listing, `// currently`). The
   direction is better named **"monospace/terminal executed on warm paper"**
   than "warm minimal." The risk: any surface that shows only the foundation
   (cream bg, serif text, copper link) re-enters the re-run zone. Lead with
   the terminal-native signature.

Five moves, named: mono display over serif body · one copper + Modus-for-code-only ·
72ch measure with man-page labels · four named easings with the underline as
the one high-impact moment · Unicode-glyphs-as-icons with the line-numbered CV
as signature component.

**Verdict: committed direction.** Not manufactured-problem territory — the
audit is clean where it matters; the findings are enforcement and
completeness, not identity.

## 5 · Recommendations (priority order)

1. **Restore or consciously retire the script pipeline** (A1). Either bring
   back `generate.mjs` + the four validators, or update CI, `CLAUDE.md`,
   `README.md`, and `justfile` to the new reality. Currently every push
   fails and the a11y claims are unverified. — **open, needs owner decision**
2. **Complete interactive states** (K7). — **applied**: `Button` `:disabled`,
   `:active`, and `aria-busy` loading (mono ellipsis, no spinner) in
   `components.css` + `Button.jsx`; `:active` on tag/breadcrumb links;
   "Dynamic content & states" section (aria-live, loading, empty states,
   touch targets) added to `docs/ACCESSIBILITY.md`.
3. **De-drift the three preview files.** — **applied**: rgba/hex literals
   replaced with `color-mix()` token derivations in `tags-badges`, `cards`,
   and `modal` (scrim now derives from `text-heading`).
4. **Codify the K4 guardrail.** — **applied**, then **superseded** by the
   July 2026 Impeccable review below: the left-border pattern itself was
   retired in favor of hairline + tint; the Don't-list constraint now guards
   unlabeled tinted cards instead.
5. **State the mobile position.** — **applied** as part of the
   ACCESSIBILITY.md addition: desktop-dense by design, 44px minimum targets
   on touch surfaces.

Items kept deliberately, no action: copper callout pattern, `→` in ghost
buttons, all-caps mono labels, the restrained single-accent palette —
restraint here is executed, not timid.

---

# Impeccable Review — July 2026

Audited against the [Impeccable](https://github.com/pbakaus/impeccable)
frontend-design skill (SKILL + audit / critique / polish / layout / typeset /
colorize / animate / harden / brand references), cross-checked with the
system's own specs. All decisions below were made by the owner.

## Findings

- **Accent drift (fixed).** The pre-a11y-tuning accent `#9a5a2a` survived in
  `preview/colors-core.html`, `preview/tables.html` (with a doubly stale
  4.62:1 ratio), `preview/code-languages.html`, and — worse — prescriptive
  docs: `tokens.md`, `README.md`, `skills/brand-guidelines/SKILL.md`,
  `platforms/emacs/README.md`, plus ~13 spots and a stale selection-bg
  (`#f0dcc4`) in `platforms/index.html`. All updated to `#8a4f24`
  (6.09:1 on paper bg, AA). `scripts/validate-preview-hex.mjs` now fails CI
  when `preview/` or `components/*/card.html` contain a non-token hex.
- **Field a11y gap (fixed).** `Field.jsx` set `aria-invalid` but never linked
  help/error text to the input; screen readers announced "invalid" with no
  reason. Now wired via `aria-describedby` (also in `preview/forms.html`).
- **K4 reversal — side-stripes retired (fixed).** Impeccable's strongest ban
  (side-stripe borders >1px) collided with the kept-K4 alert/callout stripe.
  Owner chose conversion: alerts get hairline status border + 10% tint,
  callouts hairline copper + 8% tint, blockquotes hairline `border` +
  `bg-subtle` — everywhere on system surfaces (components.css, previews,
  md.html, source_styles/content.css). `validate-tokens.mjs` §2e proves
  head/body legibility on every tint level in both modes. The 3px stripe now
  exists only as the KEYBOARD.md selected-item marker (`--border-marker`).
- **Off-scale spacing (fixed).** components.css used raw px (8/16, 10/14,
  18/22, 4, 6) beside an unused `--space-*` scale. Snapped to tokens after
  adding `2xs` (2px); worst shift ±2px.
- **Missing token categories (fixed).** Added `breakpoints` (sm 640 / md 860,
  matching the only hand-authored media queries), semantic `zIndex`
  (base/sticky/scrim/modal/toast/skip → `--z-*`; skip-links and toolbars now
  consume them), `borderWidth` (hairline/focus/marker → `--border-*`), and
  `--type-scale-0…7` emission from `typography.scale` (h1–h4 now consume the
  vars instead of duplicating values).
- **Version drift (fixed).** `meta.version` said 0.3.0 while CHANGELOG had
  released 0.4.0; bumped to 0.5.0 with this work.

## Kept deviations from Impeccable (intentional)

- **Warm cream paper.** Impeccable flags "the cream default"; here cream IS
  the brand (Grounds group), chosen and executed, not defaulted.
- **Monospace headings.** Impeccable's brand register warns against mono as
  lazy "technical" shorthand — this system's mono/serif pairing is its
  documented signature, with craft defaults (lining vs oldstyle figures).
- **Spring motion curve** (`cubic-bezier(0.34, 1.25, 0.64, 1)`) has a mild
  overshoot; Impeccable bans bounce. Kept: it is subtle, token-governed, and
  guarded by the universal reduced-motion rule.
- **`.ds-kbd` 2px bottom border** — key-cap depth, not a stripe.

## Recorded, no action

- `.ds-meta` (0.8rem) and `.ds-title` (1.6rem) sit off the 8-step type
  scale; `--font-size-base` is hand-authored in colors_and_type.css while
  `typography.body.sizeBase` holds the same value. Candidates for a later
  generator pass.
- `zIndex.scrim/modal/toast` have no consumer yet in system CSS —
  forward-looking names for overlay surfaces.
- Follow-up: prototypes still carry the old accent in places
  (`brutal-neu.html`; the `prototypes/_shared/` stylesheet is gone — the
  mockups now link the root `colors_and_type.css`) and stay outside
  `validate-preview-hex.mjs` scope by design (intentional off-palette
  mockups).

---

# WCAG review — July 2026

**Date:** 2026-07-28
**Surfaces audited:** `projects/design/` (tokens, showcase, previews, components,
prototypes, platform targets, scripts) per the `/design-review` skill, plus the
monorepo consumers that vendor the system (`jylhis-com`, `docs-site`,
`career-pipeline`, `knowledge-feed`, `close-the-window`, `marchyo-os`).
**Result:** design system itself **passes** — every validator green and all 28
contrast claims independently reconfirmed. **3 blockers**, all at the edges: the
Modal's missing ESC hint, and two consumer-side breaks of the system's
documented commitments.

## Validators

All run from `projects/design/` with bun 1.3.11; identical to the CI set.

| Validator                | Exit | Errors | Warnings | Notes                                                             |
| ------------------------ | ---- | ------ | -------- | ----------------------------------------------------------------- |
| validate-tokens          | 0    | 0      | —        | 28 explicit + 48 swept + 14 pairing + 4 ANSI-fg + 4 TTY + 60 tint |
| validate-a11y-html       | 0    | 0      | 0        | 60 files                                                          |
| validate-a11y-css        | 0    | 0      | 0        | hand-authored + prototype CSS                                     |
| validate-cli-conventions | 0    | 0      | 0        | 7 scripts                                                         |
| validate-emacs-faces     | 0    | 0      | —        | 245 faces / 32 groups in sync                                     |
| validate-preview-hex     | 0    | 0      | —        | 86 files, 67 allowed colors                                       |
| generate.mjs --check     | 0    | 0      | —        | 67 generated files in sync                                        |

## Independent verification (not just the validators' word)

All 28 `tokens.json#contrast` claims were recomputed with an independent WCAG
relative-luminance implementation. Every measured value matches the published
numbers in `tokens.md` exactly (body 14.22/13.68, accent 8.35/8.64, the declared
`syn-string` AA floor 6.63, …). The extended sweep (text / text-heading /
accent / syn-comment ≥ 4.5:1 against all four grounds, both modes) also
reconfirms: worst case is `syn-comment` on `surface-raised` Field at 5.12:1.

CVD separability was checked with Viénot/Brettel dichromacy simulation (Lab ΔE):

- `status-err` vs `status-warn` under deuteranopia, Sheet mode: **ΔE 0.02 —
  visually identical.** `status-warn` vs `status-ok` under protanopia: ΔE 3.55.
  `status-ok` vs `status-info` under tritanopia: ΔE 5.19. This confirms what
  `ACCESSIBILITY.md §CVD` already states: the status quartet is the failure mode
  and **the glyph/label rule is the only thing carrying it**. The rule is
  enforced by `validate-a11y-html.mjs` — but only inside this repo (see W3).
- `accent` vs `contour` stays separable under all three deficiency types
  (worst ΔE 51.7, tritanopia) — the lightness-gap argument in the docs holds.
- `syn-comment` vs `syn-string` worst case ΔE 25.8 (tritanopia) — fine.

## Findings

### Blockers (documented commitment broken)

- (`components/Modal/Modal.jsx:22`) — The canonical Modal renders a `×` close
  button but **no visible `esc` label**. `platforms/KEYBOARD.md §Dismiss / ESC
hint` commits: _"if a modal, popover, overlay, or palette is open, the label
  `ESC` is visible … top-right of the modal. Always."_ Neither `Modal.jsx`,
  `components.css §.ds-modal`, nor the modal previews carry it. (jylhis-com's
  `SearchOverlay.astro:10` does it correctly — the reference implementation
  exists, just not in the canonical component.)
- (`projects/jylhis-com/src/styles/design/tokens.css:20`) — The flagship ships
  `--color-accent: #8a4d00` (the v2 _hover_ value); canonical `tokens.css` has
  `#6f3e00`. Measured on the Sheet ground: **6.28:1 — AA, not the AAA (≥7:1)
  that `ACCESSIBILITY.md` commits to for the accent**. 4 of 5 vendored files
  have drifted from byte-parity (`tokens.css`, `fonts.css`, `motion.css`,
  `components.css`; only `colors_and_type.css` matches), so `just sync-design`
  has not been run since the accent retune. One sync fixes all of this.
- (`projects/knowledge-feed/web/src/styles/tokens.css:15,116`) — Two hard WCAG
  failures: accent `#b5703c` on the cream ground measures **3.67:1** (below AA
  4.5:1, WCAG 1.4.3) while the same file styles `a` and `button` with it; and
  `textarea:focus, input:focus, select:focus { outline: none }` with only a 1px
  border-color swap suppresses focus visibility (WCAG 2.4.7) — precisely the
  pattern `validate-a11y-css.mjs` exists to fail, out of its scope here.

### Warnings (visible signal, do not block)

- (`docs/ACCESSIBILITY.md:8`) — Doc overstates a measurement: _"clears at least
  7.46:1 against every grounds surface"_ is true on Sheet, but Field-mode
  accent on `surface-raised` measures **6.66:1**. Still comfortably AA and the
  validator floor (4.5) passes; the sentence needs the number corrected or
  scoped to Sheet.
- (`scripts/validate-a11y-html.mjs`, `validate-a11y-css.mjs`) — The a11y
  validators walk only this repo. No consumer — including jylhis-com's 31
  `.astro` files — runs any a11y check (`projects/jylhis-com/justfile` `test`
  is typecheck only; no axe/pa11y/`eslint-plugin-jsx-a11y` anywhere in the
  monorepo). The vendored `colors_and_type.css` gives consumers the baseline;
  nothing verifies they haven't broken it. knowledge-feed (B3) is the proof.
- (v1 stragglers) — `docs-site`, `close-the-window`, `marchyo-os`,
  `knowledge-feed`, `suomi-flick`, `read-code-flow` still ship the v1 palette
  (copper `#9a5a2a`-family on cream `#faf7f2`). Measured light-mode accents run
  5.08–6.09:1 — meets v1's old "AA on Paper" bar, not v2's AAA. This is the
  exact drift class `career-pipeline/src/styles/tokens.test.js` documents from
  its own history ("a copper the design system had already fixed for a11y two
  releases earlier").
- (`projects/knowledge-feed/web/src/`) — Zero `aria-*` attributes across all 13
  TSX components and no `prefers-reduced-motion` guard anywhere in its CSS.
- (fonts) — `marchyo-os`, `read-code-flow`, `suomi-flick`, `knowledge-feed`
  load Literata/JetBrains Mono from `fonts.googleapis.com`, against the
  system's self-hosting stance (`fonts.css`: "No third-party requests").

### Suggestions (advisory)

- Adopt `career-pipeline`'s byte-parity guard (`src/styles/tokens.test.js`) for
  jylhis-com — it is the only consumer that machine-checks its vendored copy,
  and it would have caught B2 at commit time.
- `scripts/assemble-pages.sh` and `serve-pages.sh` answer to none of
  `--help`/`--version`; `validate-cli-conventions.mjs` walks only `.mjs`
  files. Small, but `CLI-TUI-GUIDELINES §2` says "every script".
- jylhis-com's skip link uses `:focus` rather than the documented
  `.sr-only-focusable` utility. Functionally correct for a skip link (it should
  reveal on any focus); noting only the divergence from the shared utility.

## Manual checks performed

- [x] Web a11y (Phase 2) — via validators + static inspection
- [x] Non-web a11y (Phase 3) — token-level contrast sweep covers the four
      grounds; platform files are generated from the same verified values
- [x] CLI conventions (Phase 4) — validator + shell-script gap noted above
- [ ] TUI conventions (Phase 5) — N/A: `platforms/charm/` is a style library,
      not a shipped TUI
- [x] CVD spot-check (Phase 6) — simulated (Viénot/Brettel ΔE), not visual
- [x] Keyboard walk-through (Phase 7) — static: focus tokens, kbd usage, ESC
      hints, native `<dialog>` focus trap

**Requires a human with a browser:** 200 % zoom / reflow (WCAG 1.4.4, 1.4.10),
live Tab order and focus-ring rendering, a real screen-reader pass, and visual
CVD simulation of `preview/alerts.html` and `preview/code-languages.html`.

## Notes

What holds up well: the universal reduced-motion guard and `:focus-visible`
ring in `colors_and_type.css` propagate to every importing consumer; the Modal
is a native `<dialog>` (focus trap, inert backdrop, ESC handling for free);
prose links carry a persistent underline (WCAG 1.4.1); `text-faint`-as-text is
a build error; both themes always ship together; and the published contrast
numbers are honest — every one reproduced independently to the second decimal.

The pattern across all three blockers: **the system's guarantees stop at the
repo boundary.** The tokens are right, the validators are right, and the
commitments erode exactly where the validators stop running — a vendored copy
one release stale, a hand-copied subset, a component spec detail no validator
asserts. The highest-leverage follow-ups are boundary enforcement (parity tests
in consumers, an ESC-hint assertion in `validate-a11y-html.mjs` for
`.ds-modal`), not token changes.
