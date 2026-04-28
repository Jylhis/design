# Accessibility

What the system commits to, what it measures, and what it does *not* solve.

## TL;DR

- **Body text is WCAG AAA on both Paper and Roast.** Headings AAA. `text-muted` AA. `text-faint` is decorative only.
- **The accent is AA on Paper, AAA on Roast.** Any link, focus ring, or interactive copper surface clears the AA bar against the page background; on dark it clears AAA.
- **Color vision deficiency:** the palette is warm-earth-toned and avoids red/green parity in chrome. The status family (err/warn/ok/info) is the only red/green pairing in the system, and consumers **must** combine status color with a glyph or label — never rely on color alone.
- **Focus is visible at 2px AAA on every surface.** See [`platforms/KEYBOARD.md`](../platforms/KEYBOARD.md).
- **Animation respects `prefers-reduced-motion`.** Every transition has the appropriate guard.
- **No theme is shipped without the other.** `prefers-color-scheme` and `data-theme="dark"` are both supported.

For exact ratios on every foreground × background pair, open [`palette.html`](../palette.html) — the contrast-pair matrix renders measured numbers from `tokens-data.js`.

---

## What we measure

`scripts/validate-tokens.mjs` fails the build if any of these claims drops below its threshold. The claims live in [`tokens.json`](../tokens.json) under `contrast`:

| Pair | Mode | Threshold | What it covers |
|---|---|---|---|
| `text` on `bg` | light | 7:1 (AAA) | body copy on Paper |
| `text` on `bg` | dark | 7:1 (AAA) | body copy on Roast |
| `text-heading` on `bg` | light | 7:1 (AAA) | headings on Paper |
| `text-muted` on `bg` | light | 4.5:1 (AA) | metadata, captions |
| `text-muted` on `bg` | dark | 4.5:1 (AA) | metadata, captions |
| `accent` on `bg` | light | 4.5:1 (AA) | links, focus rings on Paper |
| `accent` on `bg` | dark | 7:1 (AAA) | links, focus rings on Roast |

`text-faint` is **not measured** because it is reserved for non-text-critical roles. If you find yourself using `text-faint` for copy, switch to `text-muted`.

A fuller matrix — every text/accent/status role measured against every background surface — is generated into `tokens-data.js` as `contrastPairs` and rendered by `palette.html`.

---

## Color vision deficiency (CVD)

The reference theme nearest to ours, [Modus](https://protesilaos.com/emacs/modus-themes), ships dedicated deuteranopia and tritanopia variants. We do not. We ship two themes — Paper and Roast — and rely on a few constraints that keep the chrome safe:

1. **Most of the system is monochrome warm.** Backgrounds, text, borders, and decorators are all on the cream/brown axis. No information is ever encoded in red-vs-green or blue-vs-yellow chrome.
2. **The accent is a single hue.** Copper has reasonable separation from the surrounding browns under all three CVD types. It is never paired adjacent to a red or green that would be ambiguous.
3. **Code rendering uses Modus syntax.** Modus has been tuned by Protesilaos for accessibility. We adopt the values verbatim, so any CVD work that holds for Modus also holds for our code blocks.
4. **Status colors are the failure mode.** `status-err` (red), `status-warn` (yellow), `status-ok` (green), `status-info` (blue) form the classic CVD-fragile quartet. The system **requires** that every status indicator carry a glyph or label as well — see the `alerts.html` preview for the canonical pattern (`✗ error`, `! warning`, `✓ success`, `i info`).

### How to verify a change

If you change a hue, run the palette through a CVD simulator and compare. Two reasonable options:

- **macOS:** System Settings → Accessibility → Display → Color Filters → choose Deuteranopia / Protanopia / Tritanopia.
- **Chrome devtools:** Rendering panel → Emulate vision deficiencies.
- **Sim Daltonism** (macOS) for live filtering.

Specifically check:
- The four status alerts in `preview/alerts.html` are still distinguishable as a *set* (you should be able to tell ok from err even if you can't pick green out of the page).
- The accent-on-paper combination still reads as "this is the link color" rather than blending into surrounding browns.
- The Modus syntax palette in `preview/code-languages.html` keeps comments distinct from strings under deuteranopia.

If something fails, open an issue or a PR. Adjusting the offending hex on Paper and Roast in `tokens.json` is the single touchpoint.

---

## Out of scope

The system does not currently provide:

- **Dedicated CVD theme variants.** If you need a deuteranopia-tuned terminal, use Modus directly.
- **High-contrast mode beyond AAA.** The body text already clears 14:1 on both modes. If you need higher contrast still, override `--color-bg` and `--color-text` at the consumer level.
- **Reduced-transparency mode.** The system uses `accent-subtle` (a 12% rgba) for badge fills only. There's no glassmorphism or backdrop-filter to disable.

---

## Reporting an accessibility issue

Open an issue on [github.com/jylhis/design](https://github.com/jylhis/design) with:

- The mode (Paper or Roast).
- The token roles involved (`text-muted` on `surface`, etc.).
- The measured ratio (or a screenshot showing the failure).
- The platform target if it's a non-web surface (Emacs, Ghostty, etc.).

A failing AAA/AA claim is a release blocker. CVD distinguishability issues are tracked but evaluated case-by-case, since some changes would compromise the warm-earth aesthetic the system is built around.
