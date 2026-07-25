# Design principles

The *why* behind the system, in one place. [`DESIGN.md`](../DESIGN.md) is the
visual contract and [`STYLE-GUIDE.md`](STYLE-GUIDE.md) is the token reference;
this file is the reasoning they both answer to. When a decision is hard, decide
it here first.

The frame is a **topographic survey**: `tokens.json` is the one datum, and every
surface (web, terminal, editor, desktop, phone) is a sheet triangulated back to
it. Change the datum and every sheet re-surveys.

## Values

Four values, in priority order. When two conflict, the earlier one wins.

1. **One source or it does not exist.** Every value derives from `tokens.json`;
   generated targets are never hand-edited. A colour, size, or ratio that is not
   in the datum is not in the system. This is what lets one identity render
   identically across twenty-odd targets.

2. **Accessibility is measured, not asserted.** The contour *is* the contrast
   threshold. Body text is AAA and meta is AA on both editions, proven by the
   validators against generated output, not by claim; a role below its floor does
   not print. Status never rides on colour alone (glyph + word, always). See
   [`ACCESSIBILITY.md`](ACCESSIBILITY.md).

3. **Both editions, always.** Nothing ships in Sheet without Field, or the
   reverse. The two are tuned independently, never mirrored or algorithmically
   derived — they are the source and output of one survey. Optional colour-vision
   editions may be added as a bonus, never at the cost of Sheet/Field parity.

4. **Small surface, slow change.** Additions are argued, not drive-by. The system
   stays legible because it stays small: two editions, one accent, one type
   triad, a fixed-but-growing target list. Ceremony that presumes a team is out
   of scope — this is one engineer's instrument.

## Structural principles

How a surface is composed. Borrowed honestly from the survey, and from the
classic four (proximity, alignment, contrast, repetition).

- **Triangulate to the datum.** Colour, type, spacing, and motion resolve to
  tokens; nothing floats free. Repetition of the same tokens across surfaces is
  the identity.
- **Elevation is tone and line, never light.** Depth is the four ground steps
  plus a 1px hairline. No shadow, gradient, glass, or `backdrop-filter`.
- **Align to the grid.** A 4px grid with a 2px micro-step; the reading measure
  caps at `72ch`. No ad-hoc values.
- **One accent carries meaning.** Bronze is the only interactive colour; contour
  blue is structure; benchmark vermilion is the datum mark. Contrast comes from
  restraint, not from adding hues.
- **Paired foregrounds.** Every fill that carries text ships its guaranteed-
  contrast foreground token; a surface never guesses its own ink.

## Interaction principles

How a surface behaves. The visitor is usually here to *operate* or to *read*, so
the interface recedes and the work leads.

- **Be direct.** Buttons are lowercase commands; errors are errno-style; empty
  states are `//` comments. Say the thing; no marketing sheen, no exclamation
  marks. See [`VOICE.md`](VOICE.md).
- **React immediately, and flatly.** Interaction changes colour and border, not
  scale or shadow. Motion is the "survey renders in" grammar — draw-in, extend,
  count-up — eased, never bouncing, and fully disabled under
  `prefers-reduced-motion`.
- **Keep the keyboard first-class.** Every interactive element has a visible
  `:focus-visible` ring; overlays trap and restore focus; lists rove tabindex.
  See [`../platforms/KEYBOARD.md`](../platforms/KEYBOARD.md).
- **Stay lightweight.** Prefer the platform primitive (native `<dialog>`, a
  Unicode glyph, a `<details>`) over a dependency. Fewer moving parts is the
  accessible, durable choice.

## The named rules

The hard lines, enforced by review and (where mechanical) by validators. Each is
stated in full in [`DESIGN.md`](../DESIGN.md):

- **One-Accent** — exactly one interactive colour (bronze).
- **Accent-Is-Not-Code** — the accent never appears in a code block or as a
  syntax colour.
- **Never-Pure** — no pure white, no pure black on any surface.
- **Contour-Is-Contrast** — a role below its measured floor does not print.
- **Paired-Foreground** — every text-bearing fill declares its foreground.
- **Three-Role / Mono-Is-Data** — Zilla Slab titles, Hanken Grotesk language,
  IBM Plex Mono data and code; no fourth family.
- **Small-Radius** — nothing rounder than 4px on a container; no pill buttons.
- **Flat-Survey** — to feel raised, step up one ground level and draw the
  hairline. Elevation is tone and line, never light.
