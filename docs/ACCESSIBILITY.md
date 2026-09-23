# Accessibility

What the system commits to, what it measures, and what it does _not_ solve.

## TL;DR

- **Body text is WCAG AAA in both modes.** Headings AAA. `text-muted` AA. `text-faint` is for decoration/disabled only — using it as a text colour is a review finding (its light value measures 3.18:1 — AA-Large only, never AA-safe for normal text).
- **The accent is AAA in both modes** — 8.35:1 on the light ground, 8.64:1 on the dark ground. Any link, focus ring, or interactive bronze surface clears at least 7.46:1 against **every** grounds surface (page background _and_ raised card surfaces). Inline prose links also carry a persistent underline, so they never rely on color alone.
The ratios quoted throughout are the theme's, whose margins are the tightest; both modes clear the same floors by construction.

**Everything works on a black-and-white display.** Meaning lives in lightness, not hue: the palette is a lightness skeleton with hue on top, so desaturating it loses no distinction. Chromatic status colours are the one exception and always carry a glyph and a word.

- **Color vision deficiency:** the palette is a cool desaturated ramp and avoids red/green parity in chrome. The status family (err/warn/ok/info) is the only red/green pairing in the system, and consumers **must** combine status color with a glyph or label — never rely on color alone.
- **Focus is visible at 2px AAA on every surface.** `outline: 2px solid var(--color-accent); outline-offset: 2px` on every `:focus-visible`.
- **Text scales with the reader.** Every size is a `rem` or floored `em`; the system never sets `html { font-size }`. Nothing readable renders below `0.9rem`, and nothing at all below `0.8125rem`. See [Text resizing & reflow](#text-resizing--reflow).
- **Animation respects `prefers-reduced-motion`.** Every transition has the appropriate guard.
- **No mode is shipped without the other.** The one theme ships both a light and a dark mode. `tokens.css` puts light in `:root` and keys the dark palette off `data-mode="dark"`; the showcase pages read `prefers-color-scheme` in JS and set `data-mode`. A consumer that imports the CSS without wiring the attribute gets light mode only.

---

## Checking a change

The claims below are measured, not asserted. When you change a colour, re-measure
every pair it appears in before committing, and open the affected `preview/` and
`components/*/card.html` cards in both modes.

Beyond static ratios, the parts that need a human: screen-reader passes, CVD
inspection, and keyboard walk-throughs.

---

## What is measured

Each claim below is a floor, not a goal. The commitments cover text, accent, contour, and every syntax role in both modes; the table is a representative subset:

| Pair                   | Mode  | Threshold  | What it covers                              |
| ---------------------- | ----- | ---------- | ------------------------------------------- |
| `text` on `bg`         | light | 7:1 (AAA)  | body copy, light                            |
| `text` on `bg`         | dark  | 7:1 (AAA)  | body copy, dark                             |
| `text-heading` on `bg` | light | 7:1 (AAA)  | headings, light                             |
| `text-muted` on `bg`   | light | 4.5:1 (AA) | metadata, captions                          |
| `text-muted` on `bg`   | dark  | 4.5:1 (AA) | metadata, captions                          |
| `accent` on `bg`       | light | 7:1 (AAA)  | links, focus rings, light                   |
| `accent` on `bg`       | dark  | 7:1 (AAA)  | links, focus rings, dark                    |
| `syn-string` on `bg`   | light | 4.5:1 (AA) | the one declared AA floor (measures 6.63:1) |

Beyond the hand-listed pairs, an **extended sweep** requires `text` / `text-heading` (AAA-adjacent AA), `accent`, and `syn-comment` to clear AA (4.5:1) against **every** grounds surface (`bg`, `bg-subtle`, `surface`, `surface-raised`) — not just `bg`. This is why `accent` (used as link text on cards) and `syn-comment` are guaranteed legible on raised surfaces, not only the page background.

`text-faint` is reserved for decoration and disabled states. Using it as a text `color` is a defect unless the rule is decorative — a `::placeholder` / `:disabled` / `::before` / `::after` selector, or a block that opts out of selection with `user-select: none`. If you find yourself reaching for `text-faint` on readable copy, switch to `text-muted`.

---

## Text resizing & reflow

Contrast is only half of legibility. The other half is size, and size belongs to
the reader — some people run their browser at 20px or 24px by default, and the
system has to answer to that setting, not just to page zoom.

The floors below are emitted into `tokens.css` as `--type-readable-min` and
`--type-floor`, and are enforced by review.

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
system renders below the absolute floor; a smaller `rem` on readable copy is a
review finding.

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

The breakpoints are `sm: 40em` / `md: 53.75em` — 640px and 860px at the
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

All three are checked in review. The practical CSS guard is that no rule caps a
text container's `height` in px.

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

## Utilities

- **`.sr-only`** — visually-hidden content that stays in the accessibility tree (standard clip-rect). Use it for screen-reader-only labels: a heading name behind an icon, a semantic label on a visually-titled section (e.g. a man-page-style header rendered as chrome). Pair with `.sr-only-focusable` when the content should reveal itself on focus (skip links). Defined in `colors_and_type.css`.

---

## Color vision deficiency (CVD)

The nearest reference theme, [Modus](https://protesilaos.com/emacs/modus-themes),
ships dedicated deuteranopia and tritanopia variants. This system does not:
there is one theme with a light and a dark mode, and the chrome is kept CVD-safe
by construction:

1. **Lightness carries the meaning.** The palette is a lightness skeleton with hue on top: every role differs from its neighbours in lightness before it differs in hue. A monochrome display, a photocopy, or a full-CVD reader loses nothing structural.
2. **Most of the system is a single cool neutral ramp.** Backgrounds, text, borders, and decorators all sit on one desaturated blue-grey axis, from the near-white light ground to the near-black dark ground. No information is ever encoded in red-vs-green or blue-vs-yellow chrome.
3. **The accent is a single hue.** Bronze separates from the cool neutrals by both hue and lightness, so it survives all three CVD types — under tritanopia, where the bronze/blue distinction weakens most, the lightness gap still carries it. It is never paired adjacent to a red or green that would be ambiguous.
4. **The syntax palette is based on Modus, not copied from it.** Modus is the starting point and its role vocabulary is sound, but Modus's 7:1 targets were tuned against pure white and black grounds; these grounds are cool and never pure, so every role is re-picked and re-measured here. A Modus contrast or CVD claim is therefore not automatically a claim about this system. `syn-string` carries a declared AA floor (6.63:1 light) while the other headline roles stay AAA — an accepted cost, measured, not inherited.
5. **Status colors are the failure mode.** `status-err` (red), `status-warn` (yellow), `status-ok` (green), `status-info` (blue) form the classic CVD-fragile quartet. The system **requires** that every status indicator carry a glyph or label as well — see the Alert component card for the canonical pattern (`✗ error`, `! warning`, `✓ success`, `i info`). Desaturate the set once before calling a change done: the glyph and the word are what carry it when hue collapses.

### How to verify a change

First, desaturate. A grayscale screenshot of the changed surface must keep every distinction it had in colour — that check subsumes most CVD cases, because it is the strictest one.

Then run the palette through a CVD simulator and compare. Two reasonable options:

- **macOS:** System Settings → Accessibility → Display → Color Filters → choose Deuteranopia / Protanopia / Tritanopia.
- **Chrome devtools:** Rendering panel → Emulate vision deficiencies.
- **Sim Daltonism** (macOS) for live filtering.

Specifically check:

- The four status alerts in `components/Alert/card.html` are still distinguishable as a _set_ (you should be able to tell ok from err even if you can't pick green out of the page).
- The bronze-on-light-ground combination still reads as "this is the link color" rather than blending into the surrounding cool neutrals, and bronze stays distinct from the `contour` blue used for structural linework.
- The syntax palette in `preview/code-languages.html` keeps comments distinct from strings under deuteranopia.

If something fails, adjust the offending hex in the token sources — in every
scope that declares it, light and dark alike.

---

## Dynamic content & states

- **Live regions.** Anything that updates without a page load — filter counts, form validation, streamed output — sits in an `aria-live="polite"` region (`role="alert"` only for errors that block the user). The showcase filter count is the reference implementation.
- **Loading.** Buttons take `aria-busy="true"` + disabled; the visual is a trailing mono ellipsis, never a spinner. Screen readers get the state change from `aria-busy`.
- **Empty states.** One dry first-person line in `text-muted` mono (e.g. `no results — try fewer letters`), never an illustration. Empty is a normal state, not an error.
- **Touch targets.** The system is desktop-dense by design. On any surface that ships to touch devices, interactive elements get a minimum 44×44px hit area — pad the target, not the glyph.

---

## Out of scope

The system does not currently provide:

- **Dedicated CVD theme variants.** If you need a deuteranopia-tuned editor or terminal, use Modus directly.
- **High-contrast mode beyond AAA.** The body text already clears 14.2:1 light and 13.7:1 dark. If you need higher contrast still, override `--color-bg` and `--color-text` at the consumer level.
- **Reduced-transparency mode.** The system uses `accent-subtle` (12% light, 15% dark) for badge fills only. There's no glassmorphism or backdrop-filter to disable.

---

## Reporting an accessibility issue

Open an issue on [`Jylhis/j10s`](https://github.com/Jylhis/j10s) with:

- The mode (light/dark).
- The token roles involved (`text-muted` on `surface`, etc.).
- The measured ratio (or a screenshot showing the failure).
- The surface, if it isn't the web system (Emacs, Ghostty, etc. live upstream).

A failing AAA/AA claim is a release blocker. CVD distinguishability issues are evaluated case-by-case, since some fixes would compromise the cool survey palette the system is built around.
