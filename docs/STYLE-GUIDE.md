# Style guide

How to *use* the Jylhis design system in a real product. This is the short, opinionated counterpart to [`tokens.md`](../tokens.md): tokens.md says what each value is; this guide says when to pick which.

The system is small and stays small on purpose. The rules below explain why.

---

## 1. Colors

### Paperstock — backgrounds

- **`bg`** is the page itself. Set it on `<html>` (or `<body>`) and almost nothing else.
- **`bg-subtle`** is the next step up. Use it for the tag chip background, code block fills, faint zebra striping.
- **`surface`** is for cards and panels that need to read as containers. 1px border + `surface` fill.
- **`surface-raised`** is for modals, dropdowns, and floating panels — anything that needs to read as *above* the page.

> Don't gradient between them. Don't add a shadow to fake elevation. The four steps are the elevation system.

### Ink — text

- **`text-heading`** for headings only.
- **`text`** for body copy.
- **`text-muted`** for metadata, captions, secondary labels — anything still readable but pulled back.
- **`text-faint`** is *not* readable as body copy. It's for dashed rules, disabled meta, and chrome decorations. If a sighted user must read it, use `text-muted` instead.

### Copper — the single accent

- **`accent`** is the only interactive color: links, focus rings, the "currently" box border, button text on ghost buttons.
- **`accent-hover`** is the darker twin used on hover/active states. Never use it as a base color.
- **`brand`** is the literal logo copper. Use it for *large* marks where contrast against text isn't measured: the maker's mark, hero strokes, sticker art. Do not use `brand` as a link color — it doesn't clear AA on the paper background.

> Copper is not a syntax color. The brand never appears inside a code block.

### Linen — borders

- **`border`** for everything by default. 1px solid.
- **`border-strong`** is reserved for table thead underlines and form-field hover state.
- **`decorator`** is for dashed horizontal rules and the `└──` tree lines. Don't use it as a real border color.

### Signal — status

Use these *only* for status meaning. Don't reach for `status-info` because you want a friendly blue, or `status-ok` because you want a calm green. Pick `accent` for friendliness and `text-muted` for calm.

- **`status-err`** — error, blocked, destructive
- **`status-warn`** — warning, deprecation, caution
- **`status-ok`** — success, completed, healthy
- **`status-info`** — neutral information, in-progress

### Modus — syntax

These exist exclusively for code rendering. They are tuned to match the Modus Operandi (light) and Vivendi (dark) Emacs themes byte-for-byte. Don't repurpose `syn-keyword` for a UI element just because you like the magenta.

### Spectrum — ANSI 16

The terminal palette. Slot 11 (`bright-yellow`) is intentionally overridden to brand copper across every terminal target so prompts and `ls` directory permissions carry the system identity.

---

## 2. Type

- **Body** is Literata 1.125rem / 1.65 line-height. It should be the only font for prose.
- **Headings** are JetBrains Mono. They should be the only font for navigation, labels, and `//` chrome.
- **Code** is JetBrains Mono inline and in blocks. It is the same family as headings on purpose — code reads as a label.

### Type scale (10 steps)

`2 · 1.6 · 1.4 · 1.15 · 1 · 0.95 · 0.85 · 0.8 · 0.75 · 0.72` (rem) — emitted as `--type-scale-0…9` from `tokens.json`. Pick from the scale. Don't introduce custom sizes.

- `1.6` is the compact page title (`.ds-title`); `0.95` is component body copy (cards, alerts, CV); `0.8` is mono chrome (meta, tags, breadcrumbs); `0.72` is the floor — nothing renders smaller.
- Placeholder and help text use `text-muted`, never `text-faint` — anything a user must read has to clear AA.

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

The signature is **“ink draws on”**: nothing fades or floats — things are *drawn*, *typed*, or *blinked* onto the paper, the way ink and terminals behave. Helpers live in `motion.css` (`.ds-rule-draw`, `.ds-typed`, `.ds-caret`).

| Token | Duration | Easing | Use for |
|---|---|---|---|
| `fast` | 150ms | ease-out | hover/focus color shifts |
| `base` | 250ms | ease-out | link underline, theme toggle, drawer open |
| `slow` | 300ms | ease-out | page enter, rule-draw entrances |
| `spring` | 420ms | overshoot | the rare playful affordance |

Three signature idioms, mapped to the tokens above:

- **rule-draw** — a horizontal rule draws in left→right (`slow`, scaleX from 0).
- **type-on** — a mono label types on with `steps()` (420ms).
- **caret** — a copper block caret blinks (1.1s, stepped) for prompts and loading.

Rules:

- Animate **color** and **translate** only — plus the three idioms above, which are the *named* exceptions (draw = scaleX, type-on = stepped width, caret = stepped opacity). No scale pops, no rotates, no crossfades.
- Max **one** drawn entrance per viewport. The caret never appears twice on one surface.
- All continuous easings are `ease-out`; the idioms use `steps()` — stepped, like a terminal, never tweened.
- Always honor `prefers-reduced-motion` (the universal guard in `colors_and_type.css` covers every helper; drawn/typed elements land in their final state).

---

## 6. Iconography

- Default to a Unicode glyph: `›` `▸` `»` `└──` `├──` `─` `☾` `☀` `★` `⑂` `$` `//`.
- If a Unicode glyph genuinely can't carry the meaning, draw a 1.5–2.2px stroked SVG in `currentColor`, square caps, at 1em.
- **No emoji.** Not in headings, not in nav, not in body, not in commit messages.
- **No icon fonts.** No SVG sprites. No Heroicons / Lucide / Feather.

### The personal mark

The mark is the prompt: **`jy ❯`** — pure type, set in JetBrains Mono, chevron always copper. On live surfaces it may carry the blinking caret (`.ds-caret`); in print and tty it is static.

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
- Use `accent` for *anything* the user can interact with that doesn't already have its own color (errors, etc.).
- Render code with the Modus syntax classes — your blocks will match Emacs, `bat`, `delta`, and the Charm TUIs without a second thought.

### Don't

- Don't pick a color from the syntax palette because you like the hue. The syntax palette is a contract with editor users.
- Don't add a shadow. If something needs to feel raised, step it up to `surface-raised`.
- Don't add a gradient.
- Don't use `text-faint` for body copy.
- Don't introduce a sans-serif. Body is Literata serif; everything else is JetBrains Mono.
- Don't introduce a second accent. The system has one accent on purpose.
- Don't ship a feature in only one theme.
- Don't ship a tinted status card without its label. The tint + hairline border only appears with a `//` label (callout) or a status glyph + word (alert) — color alone is decoration, not meaning. And never a side-stripe: 3px left borders are reserved for the selected-item marker.
- Don't ship an interactive element with only a hover state. Every primitive defines hover, `:focus-visible`, active, and — where it can be inert — disabled and loading (`aria-busy` + mono ellipsis, no spinners).

---

## 10. When you need a new token

1. Check whether an existing token covers it. Most of the time one does.
2. If not, file an issue or a PR adding it to `tokens.json` first. Don't fork the value into a hex literal in your consumer code.
3. Document why it can't be solved by an existing token. The bar to add a token is high — keeping the system small is the system's main value.
