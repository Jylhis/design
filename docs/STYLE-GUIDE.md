# Style guide

How to _use_ the Jylhis design system in a real product. This is the short, opinionated counterpart to [`tokens.md`](../tokens.md): tokens.md says what each value is; this guide says when to pick which.

The system is small and stays small on purpose. The rules below explain why.

---

## 1. Colors

### Grounds — backgrounds

- **`bg`** is the page itself. Set it on `<html>` (or `<body>`) and almost nothing else.
- **`bg-subtle`** is the next step up. Use it for the tag chip background, code block fills, faint zebra striping.
- **`surface`** is for cards and panels that need to read as containers. 1px border + `surface` fill.
- **`surface-raised`** is for modals, dropdowns, and floating panels — anything that needs to read as _above_ the page.

> Don't gradient between them. Don't add a shadow to fake elevation. The four steps are the elevation system.

### Ink — text

- **`text-heading`** for headings only.
- **`text`** for body copy.
- **`text-muted`** for metadata, captions, secondary labels — anything still readable but pulled back.
- **`text-faint`** is _not_ readable as body copy. It's for dashed rules, disabled meta, and chrome decorations. If a sighted user must read it, use `text-muted` instead.

### Bronze — the single accent

- **`accent`** is the only interactive color: links, focus rings, the "currently" box border, button text on ghost buttons.
- **`accent-hover`** is the darker twin used on hover/active states. Never use it as a base color.
- **`brand`** is the benchmark vermilion — the maker's mark and datum triangle. Use it for _large_ marks where contrast against text isn't measured: the maker's mark, hero strokes, sticker art. Do not use `brand` as a link color — it doesn't clear AA on the Sheet ground, and it is not `status-err`.

> Bronze is not a syntax color. The brand never appears inside a code block.

### Paired foregrounds

Every fill that carries text has a paired foreground token, declared in
`tokens.json#pairs` and emitted as `--color-<surface>-foreground`. Put text on a
fill with its pair, never a guessed colour: a primary button is
`background: var(--color-accent); color: var(--color-accent-foreground)`; a card is
`background: var(--color-surface); color: var(--color-surface-foreground)`. The
validator proves each pair clears its `min` ratio in both editions (the
Paired-Foreground rule, DESIGN.md).

### Line — borders and contour

- **`border`** for everything by default. 1px solid.
- **`border-strong`** is reserved for table thead underlines and form-field hover state.
- **`decorator`** is the graticule — dashed horizontal rules, tick chrome, and the `└──` tree lines. Don't use it as a real border color.
- **`contour`** is structural linework only: contour rings, diagram strokes, dividers that carry meaning. It is _structure, never interaction_ — it must never stand in for `accent`.

### Signal — status

Use these _only_ for status meaning. Don't reach for `status-info` because you want a friendly blue, or `status-ok` because you want a calm green. Pick `accent` for friendliness and `text-muted` for calm.

- **`status-err`** — error, blocked, destructive
- **`status-warn`** — warning, deprecation, caution
- **`status-ok`** — success, completed, healthy
- **`status-info`** — neutral information, in-progress

### Modus — syntax

These exist exclusively for code rendering. They are tuned to match the Modus Operandi (light) and Vivendi (dark) Emacs themes byte-for-byte. Don't repurpose `syn-keyword` for a UI element just because you like the magenta.

### Spectrum — ANSI 16

The terminal palette. Slot 11 (`bright-yellow`) is intentionally overridden to the bronze accent across every terminal target so prompts and `ls` directory permissions carry the system identity.

---

## 2. Type

Three roles, three families — set from `tokens.json#typography` and emitted as `--font-display` / `--font-body` / `--font-mono`.

- **Display & titles** are Zilla Slab — the engraved plate register. Headings and hero titles only.
- **Body & UI** are Hanken Grotesk 1.0625rem / 1.6 line-height. It should be the only font for prose, navigation, and controls.
- **Data, labels & code** are IBM Plex Mono. Labels, meta, `//` chrome, tabular figures, and every code block — data reads as data.

### Type scale (10 steps)

`3.25 · 2 · 1.4 · 1.15 · 1.0625 · 0.95 · 0.9 · 0.875 · 0.85 · 0.8125` (rem) — emitted as `--type-scale-0…9` from `tokens.json`. Pick from the scale. Don't introduce custom sizes.

- `3.25` is the hero display (`h1` / `.ds-h1`); `2` is the compact page title (`.ds-title`); `0.95` is component body copy (cards, alerts, CV); `0.875` is mono chrome (meta, tags).
- Placeholder and help text use `text-muted`, never `text-faint` — anything a user must read has to clear AA.

### Two floors

Every step is a `rem` multiple of the reader's root font size, and the system
never sets `html { font-size }`.

- **`0.9rem` (scale-6) is the readable floor** — prose, help text, form labels, table cells, code, and any interactive control's label sit here or higher.
- **`0.8125rem` (scale-9) is the absolute floor** — glanceable chrome only: uppercase mono labels, badges, keycaps, refs, dates, captions. Nothing renders smaller.

Emitted as `--type-readable-min` / `--type-floor`. Relative sizes below `0.85em`
must be floored — `font-size: max(0.85em, var(--type-floor))` — so nesting can't
compound the shrink. Fluid type keeps a rem term in the middle:
`clamp(<rem-min>, <rem-base> + <vw>, <rem-max>)`; a pure-`vw` middle stops
answering to the reader's font size between the bounds. Breakpoints are `em`
(`40em` / `53.75em`) for the same reason. Enforced by
`scripts/validate-a11y-type.mjs`; full spec in [`ACCESSIBILITY.md`](ACCESSIBILITY.md#text-resizing--reflow).

### Casing

- **Lowercase**: navigation, breadcrumbs, footer, tag chips, page titles on subpages, section labels (`home`, `notes`, `/now`).
- **Title Case or Sentence case**: prose headings inside articles.
- **UPPERCASE with section number**: man-page-style labels (`CRAFT(7)`, `NOTES(7)`).
- **Canonical**: code, command names, tech proper nouns (`NixOS`, `Cloudflare Pages`).

---

## 3. Spacing & layout

- 4px grid with a 2px micro-step. Tokens: `2xs · xs · sm · md · lg · xl · 2xl · 3xl`.
- `72ch` max content width. Wider than that is hostile to long-form reading.
- 16rem right rail for sidenotes; collapses below 1100px.
- Don't introduce ad-hoc spacing values. If a layout needs something between `lg` and `xl`, the layout is wrong.

---

## 4. Borders & radii

- 1px solid `border` everywhere by default (`--border-hairline`).
- No decorative side-stripes. The 3px stripe (`--border-marker`) exists only as the selected-item marker in keyboard-driven surfaces (platforms/KEYBOARD.md). Alerts, callouts, and blockquotes use a full hairline border + a subtle tint of their status/accent color instead.
- Radii: `2px` on focus rings + smallest tags, `3px` on inline code + chips, `4px` on cards + code blocks, `50%` on the theme-toggle circle (the one circle).
- No pill-shaped buttons. No 12–16px rounded card aesthetic.

---

## 5. Motion

The signature is **“survey renders in”**: nothing fades or floats — a surface is _drawn_, _extended_, or _read out_, the way a plate is plotted and a terminal reports. Helpers live in `motion.css` (`.ds-contour-draw`, `.ds-line-extend`, `.ds-readout`, `.ds-caret`).

| Token    | Duration | Easing          | Use for                                   |
| -------- | -------- | --------------- | ----------------------------------------- |
| `fast`   | 150ms    | ease-out        | hover/focus color shifts                  |
| `base`   | 250ms    | ease-out        | link underline, theme toggle, drawer open |
| `slow`   | 300ms    | ease-out        | page enter, rule-draw entrances           |
| `survey` | 480ms    | ease-out (expo) | the full plate render — contour draw-in   |

Three signature idioms, mapped to the tokens above:

- **contour-draw** — a stroke draws along its own length (`survey`, dashoffset to 0).
- **line-extend** — a rule extends from the datum (`slow`, scaleX from 0).
- **readout** — a mono value types on with `steps()` (`survey`, 480ms).
- **caret** — a bronze block caret blinks (1.1s, stepped) for prompts and loading.

Rules:

- Animate **color** and **translate** only — plus the idioms above, which are the _named_ exceptions (contour-draw = dashoffset, line-extend = scaleX, readout = stepped width, caret = stepped opacity). No scale pops, no rotates, no crossfades, no bounce.
- Max **one** full plate render per viewport. The caret never appears twice on one surface.
- All continuous easings are `ease-out`; the idioms use `steps()` — stepped, like a terminal, never tweened.
- Always honor `prefers-reduced-motion` (the universal guard in `colors_and_type.css` covers every helper; drawn/typed elements land in their final state).

---

## 6. Iconography

- Default to a Unicode glyph: `›` `▸` `»` `└──` `├──` `─` `☾` `☀` `★` `⑂` `$` `//`.
- If a Unicode glyph genuinely can't carry the meaning, draw a 1.5–2.2px stroked SVG in `currentColor`, square caps, at 1em.
- **No emoji.** Not in headings, not in nav, not in body, not in commit messages.
- **No icon fonts.** No SVG sprites. No Heroicons / Lucide / Feather.

### The personal mark

The mark is the prompt: **`jy ❯`** — pure type, set in IBM Plex Mono, chevron always bronze. On live surfaces it may carry the blinking caret (`.ds-caret`); in print and tty it is static.

- Appears **once per surface**: footer sign-off, contact line, man-page footer, 404.
- Never scaled above 56px; never used as a syntax element or inside code blocks.
- Because it is text, it renders identically in web, terminal, Emacs, and git — the terminal fallback IS the mark.

---

## 7. Type craft defaults

Set system-wide in `colors_and_type.css`; consumers get them for free.

- **Oldstyle figures in serif prose** (`font-variant-numeric: oldstyle-nums`) — numbers sit in the text. Mono chrome (headings, meta, code) resets to lining figures so numbers in chrome stay aligned.
- **Hanging punctuation on blockquotes** — opening quotes hang into the margin (progressive enhancement).
- **`text-wrap: pretty`** on body, **`text-wrap: balance`** on headings.

---

## 8. Voice

Copy is a design token. Five rules — first person singular; buttons are lowercase commands; errors use errno style; empty states are `//` comments; no exclamation marks or marketing adjectives. See [`docs/VOICE.md`](VOICE.md).

---

## 9. Do / don't

### Do

- Set `html { background: var(--color-bg); color: var(--color-text); }` and let everything else inherit.
- Layer surfaces by stepping through `bg → bg-subtle → surface → surface-raised`.
- Use `accent` for _anything_ the user can interact with that doesn't already have its own color (errors, etc.).
- Render code with the Modus syntax classes — your blocks will match Emacs, `bat`, `delta`, and the Charm TUIs without a second thought.

### Don't

- Don't pick a color from the syntax palette because you like the hue. The syntax palette is a contract with editor users.
- Don't add a shadow. If something needs to feel raised, step it up to `surface-raised`.
- Don't add a gradient.
- Don't use `text-faint` for body copy.
- Don't introduce a fourth family. Display is Zilla Slab, body and UI are Hanken Grotesk, data and code are IBM Plex Mono.
- Don't introduce a second accent. The system has one accent on purpose.
- Don't ship a feature in only one theme.
- Don't ship a tinted status card without its label. The tint + hairline border only appears with a `//` label (callout) or a status glyph + word (alert) — color alone is decoration, not meaning. And never a side-stripe: 3px left borders are reserved for the selected-item marker.
- Don't ship an interactive element with only a hover state. Every primitive defines hover, `:focus-visible`, active, and — where it can be inert — disabled and loading (`aria-busy` + mono ellipsis, no spinners).

---

## 10. When you need a new token

1. Check whether an existing token covers it. Most of the time one does.
2. If not, file an issue or a PR adding it to `tokens.json` first. Don't fork the value into a hex literal in your consumer code.
3. Document why it can't be solved by an existing token. The bar to add a token is high — keeping the system small is the system's main value.
