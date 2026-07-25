# Accessibility

What the system commits to, what it measures, and what it does *not* solve.

## TL;DR

- **Body text is WCAG AAA on both Sheet and Field.** Headings AAA. `text-muted` AA. `text-faint` is for decoration/disabled only — its use as a text color is lint-enforced off (its light value is nonetheless AA-safe for incidental text).
- **The accent is AA on Sheet, AAA on Field.** Any link, focus ring, or interactive bronze surface clears the AA bar against **every** grounds surface (page background *and* raised card surfaces); on dark it clears AAA. Inline prose links also carry a persistent underline, so they never rely on color alone.
- **Color vision deficiency:** the palette is warm-earth-toned and avoids red/green parity in chrome. The status family (err/warn/ok/info) is the only red/green pairing in the system, and consumers **must** combine status color with a glyph or label — never rely on color alone.
- **Focus is visible at 2px AAA on every surface.** See [`platforms/KEYBOARD.md`](../platforms/KEYBOARD.md).
- **Animation respects `prefers-reduced-motion`.** Every transition has the appropriate guard.
- **No theme is shipped without the other.** `prefers-color-scheme` and `data-theme="dark"` are both supported.

For exact ratios on every foreground × background pair, open [`palette.html`](../palette.html) — the contrast-pair matrix renders measured numbers from `tokens-data.js`.

---

## Running validation

Five scripts enforce the parts of this spec that are mechanically checkable. CI runs all five on every push.

```bash
bun scripts/validate-tokens.mjs           # WCAG contrast (explicit + extended sweep), schema, CSS var() resolution
bun scripts/validate-a11y-html.mjs        # lang, alt, labels, heading hierarchy, focus, reduced-motion, status-with-glyph, skip links
bun scripts/validate-a11y-css.mjs         # transitions guarded by prefers-reduced-motion, outline:none paired with :focus-visible
bun scripts/validate-cli-conventions.mjs  # bun scripts follow docs/CLI-TUI-GUIDELINES.md (--help, --version, stderr, exit codes)
bun scripts/generate.mjs --check          # generated files in sync with tokens.json
```

Each validator distinguishes errors (block CI), warnings (visible signal, do not block), and suggestions (advisory). Errors usually mean a documented commitment is being broken; warnings usually mean an embedded preview card is missing the meta-tag rigour expected of a full page. Run `--help` on any script for its specific check list.

For deeper review beyond static checks (manual screen-reader testing, CVD inspection, structured-output alternatives, keyboard walk-throughs), invoke the `/design-review` skill in [`../.claude/skills/design-review/`](../.claude/skills/design-review/).

---

## What we measure

`scripts/validate-tokens.mjs` fails the build if any of these claims drops below its threshold. The claims live in [`tokens.json`](../tokens.json) under `contrast`:

| Pair | Mode | Threshold | What it covers |
|---|---|---|---|
| `text` on `bg` | light | 7:1 (AAA) | body copy on Sheet |
| `text` on `bg` | dark | 7:1 (AAA) | body copy on Field |
| `text-heading` on `bg` | light | 7:1 (AAA) | headings on Sheet |
| `text-muted` on `bg` | light | 4.5:1 (AA) | metadata, captions |
| `text-muted` on `bg` | dark | 4.5:1 (AA) | metadata, captions |
| `accent` on `bg` | light | 4.5:1 (AA) | links, focus rings on Sheet |
| `accent` on `bg` | dark | 7:1 (AAA) | links, focus rings on Field |

Beyond the hand-listed pairs, an **extended sweep** in `validate-tokens.mjs` requires `text` / `text-heading` (AAA-adjacent AA), `accent`, and `syn-comment` to clear AA (4.5:1) against **every** grounds surface (`bg`, `bg-subtle`, `surface`, `surface-raised`) — not just `bg`. This is why `accent` (used as link text on cards) and `syn-comment` are guaranteed legible on raised surfaces, not only the page background.

`text-faint` is reserved for decoration and disabled states. Using it as a text `color` is a build error (`validate-a11y-css.mjs`) unless the rule is decorative — a `::placeholder` / `:disabled` / `::before` / `::after` selector, or a block that opts out of selection with `user-select: none`. If you find yourself reaching for `text-faint` on readable copy, switch to `text-muted`.

A fuller matrix — every text/accent/status role measured against every background surface — is generated into `tokens-data.js` as `contrastPairs` and rendered by `palette.html`.

## Utilities

- **`.sr-only`** — visually-hidden content that stays in the accessibility tree (standard clip-rect). Use it for screen-reader-only labels: a heading name behind an icon, a semantic label on a visually-titled section (e.g. a man-page-style header rendered as chrome). Pair with `.sr-only-focusable` when the content should reveal itself on focus (skip links). Defined in `colors_and_type.css`.

---

## Color vision deficiency (CVD)

The reference theme nearest to ours, [Modus](https://protesilaos.com/emacs/modus-themes), ships dedicated deuteranopia and tritanopia variants. We do not. We ship two themes — Sheet and Field — and rely on a few constraints that keep the chrome safe:

1. **Most of the system is a single cool neutral ramp.** Backgrounds, text, borders, and decorators all sit on one desaturated blue-grey axis, from the near-white Sheet ground to the near-black Field ground. No information is ever encoded in red-vs-green or blue-vs-yellow chrome.
2. **The accent is a single hue.** Bronze separates from the cool neutrals by both hue and lightness, so it survives all three CVD types — under tritanopia, where the bronze/blue distinction weakens most, the lightness gap still carries it. It is never paired adjacent to a red or green that would be ambiguous.
3. **Code rendering uses Modus syntax.** Modus has been tuned by Protesilaos for accessibility. We adopt the values verbatim, so any CVD work that holds for Modus also holds for our code blocks.
4. **Status colors are the failure mode.** `status-err` (red), `status-warn` (yellow), `status-ok` (green), `status-info` (blue) form the classic CVD-fragile quartet. The system **requires** that every status indicator carry a glyph or label as well — see the `alerts.html` preview for the canonical pattern (`✗ error`, `! warning`, `✓ success`, `i info`).

### How to verify a change

If you change a hue, run the palette through a CVD simulator and compare. Two reasonable options:

- **macOS:** System Settings → Accessibility → Display → Color Filters → choose Deuteranopia / Protanopia / Tritanopia.
- **Chrome devtools:** Rendering panel → Emulate vision deficiencies.
- **Sim Daltonism** (macOS) for live filtering.

Specifically check:
- The four status alerts in `preview/alerts.html` are still distinguishable as a *set* (you should be able to tell ok from err even if you can't pick green out of the page).
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
- **High-contrast mode beyond AAA.** The body text already clears 14:1 on both modes. If you need higher contrast still, override `--color-bg` and `--color-text` at the consumer level.
- **Reduced-transparency mode.** The system uses `accent-subtle` (a 12% rgba) for badge fills only. There's no glassmorphism or backdrop-filter to disable.

---

## Reporting an accessibility issue

Open an issue on [github.com/jylhis/design](https://github.com/jylhis/design) with:

- The mode (Sheet or Field).
- The token roles involved (`text-muted` on `surface`, etc.).
- The measured ratio (or a screenshot showing the failure).
- The platform target if it's a non-web surface (Emacs, Ghostty, etc.).

A failing AAA/AA claim is a release blocker. CVD distinguishability issues are tracked but evaluated case-by-case, since some changes would compromise the warm-earth aesthetic the system is built around.
