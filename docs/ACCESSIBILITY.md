# Accessibility

What the system commits to, what it measures, and what it does _not_ solve.

## TL;DR

- **Body text is WCAG AAA on both Sheet and Field.** Headings AAA. `text-muted` AA. `text-faint` is for decoration/disabled only — its use as a text color is lint-enforced off (its light value measures 3.18:1 — AA-Large only, never AA-safe for normal text).
- **The accent is AAA on both editions** — 8.35:1 on the Sheet ground, 8.64:1 on the Field ground. Any link, focus ring, or interactive bronze surface clears at least 7.46:1 against **every** grounds surface (page background _and_ raised card surfaces). Inline prose links also carry a persistent underline, so they never rely on color alone.
- **Color vision deficiency:** the palette is a cool desaturated ramp and avoids red/green parity in chrome. The status family (err/warn/ok/info) is the only red/green pairing in the system, and consumers **must** combine status color with a glyph or label — never rely on color alone.
- **Focus is visible at 2px AAA on every surface.** See [`platforms/KEYBOARD.md`](../platforms/KEYBOARD.md).
- **Text scales with the reader.** Every size is a `rem` or floored `em`; the system never sets `html { font-size }`. Nothing readable renders below `0.9rem`, and nothing at all below `0.8125rem`. See [Text resizing & reflow](#text-resizing--reflow).
- **Animation respects `prefers-reduced-motion`.** Every transition has the appropriate guard.
- **No theme is shipped without the other.** `tokens.css` keys the dark palette off `data-theme="dark"`; the showcase pages read `prefers-color-scheme` in JS and set that attribute. A consumer that imports the CSS without wiring the attribute gets Sheet only.

For exact ratios on every foreground × background pair, open [`palette.html`](../palette.html) — the contrast-pair matrix renders measured numbers from `tokens-data.js`.

---

## Running validation

Seven validators (plus the generator's `--check` mode) enforce the parts of this spec that are
mechanically checkable. CI runs all of them on every push and PR.

```bash
bun scripts/validate-tokens.mjs           # WCAG contrast (explicit + extended sweep), schema, CSS var() resolution
bun scripts/validate-a11y-html.mjs        # lang, alt, labels, heading hierarchy, focus, reduced-motion, status-with-glyph, skip links
bun scripts/validate-a11y-css.mjs         # transitions guarded by prefers-reduced-motion, outline:none paired with :focus-visible
bun scripts/validate-a11y-type.mjs        # px font-size, sub-floor rem, viewport-only clamp(), root font-size override, px breakpoints
bun scripts/validate-cli-conventions.mjs  # bun scripts follow docs/CLI-TUI-GUIDELINES.md (--help, --version, stderr, exit codes)
bun scripts/validate-emacs-faces.mjs      # Emacs face list in jylhis-theme-core.el matches face-manifest.json
bun scripts/validate-preview-hex.mjs      # preview/ + components/*/card.html hex literals exist in tokens.json
bun scripts/generate.mjs --check          # generated files in sync with tokens.json
```

Each validator distinguishes errors (block CI), warnings (visible signal, do not block), and suggestions (advisory). Errors usually mean a documented commitment is being broken; warnings usually mean an embedded preview card is missing the meta-tag rigour expected of a full page. Run `--help` on any script for its specific check list.

For deeper review beyond static checks (manual screen-reader testing, CVD inspection, structured-output alternatives, keyboard walk-throughs), invoke the `/design-review` skill in [`../.claude/skills/design-review/`](../.claude/skills/design-review/).

---

## What we measure

`scripts/validate-tokens.mjs` fails the build if any of these claims drops below its threshold. The claims live in [`tokens.json`](../tokens.json) under `contrast` — 28 entries covering text, accent, contour, and every syntax role. The table below is a representative subset; the `tokens.json` block is the authority:

| Pair                   | Mode  | Threshold  | What it covers                              |
| ---------------------- | ----- | ---------- | ------------------------------------------- |
| `text` on `bg`         | light | 7:1 (AAA)  | body copy on Sheet                          |
| `text` on `bg`         | dark  | 7:1 (AAA)  | body copy on Field                          |
| `text-heading` on `bg` | light | 7:1 (AAA)  | headings on Sheet                           |
| `text-muted` on `bg`   | light | 4.5:1 (AA) | metadata, captions                          |
| `text-muted` on `bg`   | dark  | 4.5:1 (AA) | metadata, captions                          |
| `accent` on `bg`       | light | 7:1 (AAA)  | links, focus rings on Sheet                 |
| `accent` on `bg`       | dark  | 7:1 (AAA)  | links, focus rings on Field                 |
| `syn-string` on `bg`   | light | 4.5:1 (AA) | the one declared AA floor (measures 6.63:1) |

Beyond the hand-listed pairs, an **extended sweep** in `validate-tokens.mjs` requires `text` / `text-heading` (AAA-adjacent AA), `accent`, and `syn-comment` to clear AA (4.5:1) against **every** grounds surface (`bg`, `bg-subtle`, `surface`, `surface-raised`) — not just `bg`. This is why `accent` (used as link text on cards) and `syn-comment` are guaranteed legible on raised surfaces, not only the page background.

`text-faint` is reserved for decoration and disabled states. Using it as a text `color` is a build error (`validate-a11y-css.mjs`) unless the rule is decorative — a `::placeholder` / `:disabled` / `::before` / `::after` selector, or a block that opts out of selection with `user-select: none`. If you find yourself reaching for `text-faint` on readable copy, switch to `text-muted`.

A fuller matrix — every text/accent/status role measured against every background surface — is generated into `tokens-data.js` as `contrastPairs` and rendered by `palette.html`.

---

## Text resizing & reflow

Contrast is only half of legibility. The other half is size, and size belongs to
the reader — some people run their browser at 20px or 24px by default, and the
system has to answer to that setting, not just to page zoom.

The rules below live in [`tokens.json`](../tokens.json) under
`typography.scaling`, are emitted into `tokens.css`, and are enforced by
`scripts/validate-a11y-type.mjs`. The spec, the tokens, and the gate all read
from the same place.

### The root size is the reader's

`colors_and_type.css` sets `html { font-size: 100% }` and nothing else ever
touches it. Every step in the type scale is a `rem` multiple of that, so raising
the browser's default text size scales the entire system proportionally. The
popular `html { font-size: 62.5% }` trick is a build error here — it silently
shrinks the page for anyone who changed their default.

### Two floors

| Floor | Value | Step | Applies to |
|---|---|---|---|
| **Readable** | `0.9rem` | `--type-scale-6` | anything a user must actually read — prose, help text, form labels, table cells, code, and any interactive control's label |
| **Absolute** | `0.8125rem` | `--type-scale-9` | glanceable chrome only — uppercase mono labels, status badges, keycaps, line refs, dates, captions |

Both are emitted as `--type-readable-min` and `--type-floor`. Nothing in the
system renders below the absolute floor; the validator fails the build on a
smaller `rem`.

Components currently sitting below the readable floor, deliberately, are all
short glanceable strings: `.ds-status`, `.ds-alert__head`, `.ds-term__title`,
`.ds-codeblock__filename`, `.ds-cv__num`, `.ds-cv__date`, `.ds-log__ref`,
`.ds-log__date`, `.ds-table caption`, `.ds-table thead th`, `.ds-callout__label`,
`.ds-tag`. If you find yourself putting a sentence in one of those, move it up
the scale instead of shrinking the sentence.

### Relative sizes are floored

`em` sizes track their host, which is what you want for inline code inside a
heading — and a problem when the host is already small, because the shrink
compounds. Anything below `0.85em` carries an explicit floor:

```css
.ds-code-inline, :not(pre) > code { font-size: max(0.85em, var(--type-floor)); }
```

### Fluid type keeps a rem term

```
clamp(<rem-min>, <rem-base> + <vw>, <rem-max>)
```

A `clamp()` whose middle term is pure `vw` stops responding to the reader's font
size everywhere between the bounds — which is most of the time. The middle term
must carry a `rem` component. `clamp(2rem, 5.5vw, 3.25rem)` is a failure;
`clamp(2rem, 1.25rem + 4vw, 3.25rem)` is the fix.

### Breakpoints are em

`tokens.json#breakpoints` is `sm: 40em` / `md: 53.75em` — 640px and 860px at the
16px default. `em` media queries resolve against the browser's default font size
(never against a page's `html { font-size }`), so a reader at 24px crosses into
the narrow layout at the point where the wide one would have started to cramp. A
px breakpoint holds the wide layout regardless and squeezes the text instead.

### Targets

| Criterion | Target |
|---|---|
| WCAG 1.4.4 Resize text | 200% with no loss of content or function |
| WCAG 1.4.10 Reflow | 320px width / 400% zoom, no two-dimensional scrolling |
| WCAG 1.4.12 Text Spacing | line-height 1.5, letter-spacing 0.12em, word-spacing 0.16em, paragraph-spacing 2em, no clipping or overlap |

1.4.4 and the floors are mechanically checked. 1.4.10 and 1.4.12 are manual —
they are in the `/design-review` playbook, and the practical guard in the CSS is
that no rule caps a text container's `height` in px (the validator warns on any
that does).

Three patterns carry reflow in practice, and are worth reaching for before
shrinking anything:

- **Unbreakable strings break.** File paths, hashes, and long mono tokens get
  `overflow-wrap: anywhere` — otherwise they push their container, and the page,
  sideways as text grows.
- **Wide tables scroll in their own box.** Wrap in `.ds-table-scroll`
  (`overflow-x: auto`) rather than letting the table widen the document. Same
  for code blocks, which already carry `overflow-x: auto`.
- **Grids are `auto-fit`, not fixed columns.** `repeat(auto-fit, minmax(min(15rem, 100%), 1fr))`
  — the `min()` is what keeps a `rem` minimum from exceeding a 320px viewport
  once the root size goes up.

### Out of scope, deliberately

- **`prototypes/`** — the macOS, tablet, and Norton-Commander desktop mockups
  are px throughout. They imitate native OS chrome, where px is the honest unit;
  they are not shipped UI and are exempt from the validator.
- **`mocks/`** — the platform-chrome packages the prototypes consume. Same
  reasoning: they draw native widgets, not system UI.
- **`font_options.html`** — a typeface-comparison sandbox where arbitrary sizes
  are the entire point.

## Utilities

- **`.sr-only`** — visually-hidden content that stays in the accessibility tree (standard clip-rect). Use it for screen-reader-only labels: a heading name behind an icon, a semantic label on a visually-titled section (e.g. a man-page-style header rendered as chrome). Pair with `.sr-only-focusable` when the content should reveal itself on focus (skip links). Defined in `colors_and_type.css`.

---

## Color vision deficiency (CVD)

The reference theme nearest to ours, [Modus](https://protesilaos.com/emacs/modus-themes), ships dedicated deuteranopia and tritanopia variants. We do not. We ship two themes — Sheet and Field — and rely on a few constraints that keep the chrome safe:

1. **Most of the system is a single cool neutral ramp.** Backgrounds, text, borders, and decorators all sit on one desaturated blue-grey axis, from the near-white Sheet ground to the near-black Field ground. No information is ever encoded in red-vs-green or blue-vs-yellow chrome.
2. **The accent is a single hue.** Bronze separates from the cool neutrals by both hue and lightness, so it survives all three CVD types — under tritanopia, where the bronze/blue distinction weakens most, the lightness gap still carries it. It is never paired adjacent to a red or green that would be ambiguous.
3. **Code rendering uses Modus syntax.** Modus has been tuned by Protesilaos for accessibility. We adopt the values verbatim, so any CVD work that holds for Modus also holds for our code blocks. One caveat: Modus's 7:1 targets were tuned against pure white/black grounds, and the cool Sheet/Field grounds shave that margin — which is why `syn-string` carries a declared AA floor (6.63:1 on the Sheet ground) while the other headline syntax roles stay AAA.
4. **Status colors are the failure mode.** `status-err` (red), `status-warn` (yellow), `status-ok` (green), `status-info` (blue) form the classic CVD-fragile quartet. The system **requires** that every status indicator carry a glyph or label as well — see the `alerts.html` preview for the canonical pattern (`✗ error`, `! warning`, `✓ success`, `i info`).

### How to verify a change

If you change a hue, run the palette through a CVD simulator and compare. Two reasonable options:

- **macOS:** System Settings → Accessibility → Display → Color Filters → choose Deuteranopia / Protanopia / Tritanopia.
- **Chrome devtools:** Rendering panel → Emulate vision deficiencies.
- **Sim Daltonism** (macOS) for live filtering.

Specifically check:

- The four status alerts in `preview/alerts.html` are still distinguishable as a _set_ (you should be able to tell ok from err even if you can't pick green out of the page).
- The bronze-on-Sheet combination still reads as "this is the link color" rather than blending into the surrounding cool neutrals, and bronze stays distinct from the `contour` blue used for structural linework.
- The Modus syntax palette in `preview/code-languages.html` keeps comments distinct from strings under deuteranopia.

If something fails, open an issue or a PR. Adjusting the offending hex on Sheet and Field in `tokens.json` is the single touchpoint.

---

## Dynamic content & states

- **Live regions.** Anything that updates without a page load — filter counts, form validation, streamed output — sits in an `aria-live="polite"` region (`role="alert"` only for errors that block the user). The showcase filter count is the reference implementation.
- **Loading.** Buttons take `aria-busy="true"` + disabled; the visual is a trailing mono ellipsis, never a spinner. Screen readers get the state change from `aria-busy`.
- **Empty states.** One dry first-person line in `text-muted` mono (e.g. `no results — try fewer letters`), never an illustration. Empty is a normal state, not an error.
- **Touch targets.** The system is desktop-dense by design. On any surface that ships to touch devices, interactive elements get a minimum 44×44px hit area — pad the target, not the glyph.

---

## Out of scope

The system does not currently provide:

- **Dedicated CVD theme variants.** If you need a deuteranopia-tuned terminal, use Modus directly.
- **High-contrast mode beyond AAA.** The body text already clears 14.2:1 on Sheet and 13.7:1 on Field. If you need higher contrast still, override `--color-bg` and `--color-text` at the consumer level.
- **Reduced-transparency mode.** The system uses `accent-subtle` (a 12% rgba on Sheet, 15% on Field) for badge fills only. There's no glassmorphism or backdrop-filter to disable.

---

## Reporting an accessibility issue

Open an issue on [github.com/jylhis/design](https://github.com/jylhis/design) with:

- The mode (Sheet or Field).
- The token roles involved (`text-muted` on `surface`, etc.).
- The measured ratio (or a screenshot showing the failure).
- The platform target if it's a non-web surface (Emacs, Ghostty, etc.).

A failing AAA/AA claim is a release blocker. CVD distinguishability issues are tracked but evaluated case-by-case, since some changes would compromise the cool survey aesthetic the system is built around.
