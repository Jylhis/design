# Design contract

The whole contract for the Jylhis design system: what is fixed, why it is fixed, and how it sounds. `docs/` holds the rest: `INTEGRATION.md` (how to consume), `STYLE-GUIDE.md` (which token when), `ACCESSIBILITY.md` (measurement floors), and `CLI-TUI-GUIDELINES.md` (terminal conventions).

Audience: me, later. It records decisions so I don't relitigate them.

---

## What this is

A general design system, from me to me. Not a site theme — the shared palette for everything I build: the site, tools, docs, slides, prototypes, throwaway mocks, production UI. The tools I use all day given one set of values, so the surfaces I make are the same surface at different magnifications.

One theme — **Jylhis** (`jylhis`) — with first-class light and dark modes (Print, Negative), selected with `data-mode` on `<html>`. A second scope, `data-density`, sits across both.

The system is generated. `tokens.core.json` + `themes/*.json` are the sources of truth (seeds, structure, contrast claims); `tokens.css`, `density.css`, `tokens-data.js` and every platform target are emitted by `scripts/generate.mjs` and are not edited. See [Changing a token](#changing-a-token).

---

## Constraints

The hard lines, ordered by what the mistake costs. Everything above the rule is a defect; everything below it is drift worth catching in review.

1. A role that does not clear its measured contrast floor does not ship. Body AAA, meta AA, and the extended sweep at AA, in every mode of every theme.
2. Desaturate the palette and every distinction must still hold. No meaning rests on hue alone.
3. Status and destructive signals carry a glyph and a word, always, in every theme.
4. Every fill that carries text declares its own foreground token. A surface never guesses its ink.
5. Nothing ships one mode without the other.
6. No value outside the token sources. No hex literal, no ad-hoc size, no ad-hoc ratio; a new hex enters via `themes/*.json` first.
7. `tokens.css` is generated. Edits go to `tokens.core.json` / `themes/*.json`; a contrast claim that no longer measures true fails `validate-tokens.mjs`.
8. The accent and the brand never appear inside a code block or as a syntax colour.
9. Interactive means accent. Destructive means the destructive role. Neither borrows the other's colour, and `contour` and `brand` are neither.
10. Touch targets are 40px minimum at the default density, and nothing interactive goes below 32px at any density.
11. Elevation is tone and line first. The one elevation shadow is for objects that float over content; it is never a decoration on an in-flow surface.
12. Anything numeric, tabular, or machine-shaped is set in a mono or condensed face, not in the language face.
13. Radii come from the scale: 2px rings and small tags, 6px controls, 8px cards and sheets, 12px bottom sheets. `--radius-pill` for true capsules only.
14. Spacing comes off the 4px grid. Reading measure caps at `72ch`.
15. Unicode is the icon set. No emoji, no icon font, no sprite.
16. No gradient, glass, or `backdrop-filter`. No illustration, no full-bleed hero, no texture.

---

## Values

Five, in priority order. When two conflict, the earlier wins.

1. **One source or it does not exist.** Every value resolves to `tokens.css`, and `tokens.css` resolves to `tokens.core.json` + `themes/*.json`. A colour, size, or ratio outside that chain is outside the system.
2. **Accessibility is measured, not asserted.** The contrast threshold is the contour. A role below its floor does not ship, and no signal rides on colour alone.
3. **Grayscale first, colour second.** Meaning lives in lightness; hue is added on top. The palette is a lightness skeleton with survey tinting on top of it.
4. **Both modes, always.** Nothing ships light-only or dark-only.
5. **Small surface, slow change.** Additions are argued, not drive-by. One base plus one coloured theme, one accent, one destructive signal, four families. Ceremony that presumes a team is out of scope — this is one engineer's instrument.

---

## Why the theme is what it is

The palette is a lightness skeleton first — the monochrome base the theme was built on.

### Why Monochrome is the base

Every theme has to work on a black-and-white display — a grayscale screen, a laser printer, e-ink, a photocopy, a screenshot someone desaturates. So the system is built in that order: first a lightness skeleton that carries all the meaning, then hue added on top of it.

Monochrome *is* that skeleton, shipped as a usable theme. Its ramp — ground steps, ink ladder, border and decorator steps, syntax grays, and the inverted-ink interaction fills — is the structure every other theme inherits. A coloured theme may re-tint those values and add accent hues; it may not change what the lightness relationships say. Which is why Monochrome carries syntax meaning in `--syntax-<role>-weight` and `--syntax-<role>-style` (`keyword` 700, `builtin` italic, `docstring` italic): those tokens exist for the base, and coloured themes keep them rather than letting hue take over the job.

The practical test: desaturate the palette. If any distinction disappears, the distinction was riding on hue and is a defect. This holds without exception, status signals included — Monochrome greys `status-err`, `warn`, `ok` and `info` into a severity ladder of lightness, because every status indicator is already required to carry a glyph and a word. If greying a signal loses meaning, the glyph or the word was missing and the hue was covering for it.

This also makes Monochrome the theme for surfaces where colour is a distraction, and a continuous check on the rest: the same test colour-vision deficiency imposes, run all the time instead of occasionally.

### Why Survey — the cartographic frame

The work is infrastructure: statements that are true about a system, recorded so someone can act on them later. A survey plate is the same artifact — measured, annotated, dated, undecorated. The frame stays because it answers questions a colour list can't: what is the ground, what is ink, what is structure (contour), what is the one measured reference point (the benchmark). Every naming decision falls out of it, which is cheaper than inventing a vocabulary per role.

Survey is the Monochrome skeleton with hue added: the neutrals take a cool cast, bronze marks interaction, contour blue marks structure, vermilion marks the maker.

### Why exactly one

A theme is a maintenance liability, not a feature. The monochrome skeleton and the survey tinting it carried were merged into the single `jylhis` theme (values from the survey palette, structure from the skeleton): ramps, the density axis, and tokenized syntax emphasis carry the grayscale discipline, and one theme is half the scopes to justify. A second would have to argue itself against the grayscale it already has.

### Why dark derives from light

The seeds are stated once, in light. Dark is derived from them by the generator and then hand-corrected where the derivation is wrong, and the correction is the shipped value.

The derivation is not an inversion. Light ink on a dark ground blooms, so a mirrored body colour reads heavier and glarier than its light twin; the rules compensate for that, and where they can't, a correction does. Dark ink is `#d1d4dc`, not the inverse of `#2a2d33`. Dark bronze is lighter and more saturated (`#f5a351` against `#693900`) because the light-mode bronze on a dark ground reads as mud.

What this buys: a seed changes in one place and both modes move together, and the values that genuinely need independent judgement are now the short, visible, annotated list rather than the whole palette.

### Why bronze

Constraints picked it, not taste. The accent had to clear AAA on a near-white ground **and** a near-black one — which eliminates most mid-lightness hues, since one mode always loses; separate from the neutral ramp by **lightness as well as hue**, so it still reads as interactive in grayscale; stay distinct from `contour` blue, from the destructive role, and from all four status colours; and stay clear of the syntax palette, which already occupies magenta, blue, cyan, and green.

What survives is the warm yellow-brown band: `#693900` light, `#f5a351` dark. It is also the colour of a survey benchmark disc, which is where the name stuck.

### Why there is a second signal colour

One accent held as long as nothing in the system was irreversible. It isn't true any more: a destructive action next to a safe one, both in bronze, asks the reader to get the difference from the verb alone at exactly the moment a misread is unrecoverable.

So `--color-destructive` exists, and it does one job: irreversible actions. It is not status red — status describes what happened, destructive describes what will happen if you proceed. It is not brand vermilion.

In grayscale the pair has to separate too, so destructive is always the higher-contrast of the two: darker than the accent in light mode, lighter in dark. A destructive control still carries a glyph and a word, as status does; the colour is the third signal, never the first.

### Why the accent is barred from syntax

Code blocks are a contract with the editor. A snippet rendered here should match the same snippet in Emacs; the moment the accent takes a token role, the two diverge and the brand becomes noise inside someone's reading grammar.

Independently: the accent means *you can operate this*. Nothing in a code block is interactive, so an accent-coloured keyword is a lie about affordance.

### Why Modus is a base, not the source

The syntax palette starts from Emacs Modus — Operandi for light, Vivendi for dark — because Protesilaos has already done the contrast work and the role vocabulary (keyword, string, builtin, docstring, type) is the right decomposition. Starting there beats inventing one.

But the values shipped in `tokens.css` are this system's own. Modus targets pure white and pure black grounds; these grounds are cool and never pure, which shifts every measured ratio, and Modus's eight-variant palette carries hues that collide with the bronze accent and the contour blue. So the Modus value is the seed for each syntax role, the generator derives from it, and every role is then re-measured against the actual grounds and hand-corrected where it fails. Close to Modus by design, identical to it only where nothing argued for a change.

Two consequences worth stating: a Modus contrast claim is not automatically a claim about this system — re-measure — and `syn-string` declares an AA floor (6.63:1 light) where the other headline roles stay AAA, which is a deliberate accepted cost, not a Modus inheritance.

### Why there is a ramp

Three accent roles were never enough, so the missing shades got invented per component: one card's selected-row tint against another's, two disabled greys, three hairlines. The ramp replaces that improvisation with seven measured steps per chromatic seed, defined by contrast against their own ground so a step number means the same thing in every scope.

Every chromatic seed is ramped on the same seven-step definition — accent, the four status roles, contour, brand, destructive. Uniform because a per-hue ramp shape is a per-hue judgement call, and those are what the generator exists to remove.

Components reference semantic roles, not step numbers. The steps exist so the roles have somewhere honest to resolve to.

### Why density is an axis

Mobile is a first-class target now, and the reading density that suits a 72ch essay is wrong for a list of forty hosts on a phone. One density can't serve both.

Default rows and controls are 40px. This is under the 44px touch guideline and that is accepted: 44 is a guideline drawn for imprecise thumbs on glass, the rows here are full-width with the whole row as the target, and 40px buys a visible extra row on a phone screen. The floor is 32px, at the compact setting, on fine pointers only.

---

## Foundations

**Grounds.** Four steps per mode: `bg`, `bg-subtle`, `surface`, `surface-raised`. They are the primary elevation system.

**Ink.** `text-heading`, `text`, `text-muted`, `text-faint`. `text-faint` is decoration and disabled states only — never readable copy.

**Line.** `border` hairline by default, `border-strong` for thead underlines and field hover, `decorator` for the graticule (dashed rules, tick chrome, `└──` trees), `contour` for structural linework. Widths: `1px` hairline, `2px` focus, `3px` selected-item marker only.

**Chromatic roles.** `accent` (interaction), `destructive` (irreversible action), `contour` (structure), `brand` (the maker's mark), `status-err|warn|ok|info` (what happened), `syntax-*` (code). Each ramps to seven steps.

**Type.** Four families: Zilla Slab for display and plate titles, Hanken Grotesk for language and controls, IBM Plex Mono for data, labels, `//` chrome and code, and IBM Plex Sans Condensed for numeric display — amounts, readouts, and tabular figure columns, where mono is too wide and Hanken too soft. The condensed face is kin to the Plex Mono already here, so the fourth family costs the system no new voice.

Ten-step scale, `3.25 · 2 · 1.4 · 1.15 · 1.0625 · 0.95 · 0.9 · 0.875 · 0.85 · 0.8125` rem. Body is `1.0625rem / 1.6`. Titles run tight: 1.02–1.05 line-height, `−0.01em` tracking. Readable floor `0.9rem`, absolute floor `0.8125rem`. The system never sets `html { font-size }`.

**Amounts.** A currency mark sets smaller than its integer and in `text-muted`; decimals set smaller than the integer; the whole figure is tabular and right-aligned in a column. An amount is a readout, not a sentence.

**Spacing.** 4px grid with a 2px micro-step: `2xs 2 · xs 4 · sm 8 · md 16 · lg 24 · xl 32 · 2xl 48 · 3xl 64`. The scale remaps under `data-density`.

**Density.** Row and control heights are tokens (`--cell-h`, `--control-h`), remapped per `data-density` scope alongside the spacing steps. `comfortable` 48px, default 40px, `compact` 32px. Type size does not change with density; only the box does.

**Layout.** Content caps at `72ch`; a `16rem` right rail carries sidenotes on wide viewports and collapses at the `md` breakpoint. Breakpoints are `em`: `sm 40em`, `md 53.75em` (640px / 860px at a 16px default).

**Radius.** `2px` focus rings and smallest tags, `3px` inline code, `6px` inputs, chips and buttons, `8px` cards, plates and code blocks, `12px` bottom sheets. `--radius-pill` for true capsules only; the theme-toggle circle is the sole instance.

**Elevation.** Step up one ground and draw the hairline — that remains the default, and it is how in-flow surfaces separate. One shadow token exists, `--shadow-float`, for objects that leave the flow: modal, bottom sheet, popover, toast, dropdown. It is a low, wide, near-neutral shadow, stated per mode; dark mode carries its own, not the light value at higher opacity.

**Motion.** Four tokens — `fast 150ms`, `base 250ms`, `slow 300ms`, `survey 480ms` — all ease-out. Colour and translate only, plus four named idioms: contour-draw (dashoffset), line-extend (scaleX), readout (stepped width), caret (stepped opacity). No scale, rotate, crossfade, or bounce. `prefers-reduced-motion` is honoured everywhere; drawn and typed elements land in their final state.

**Transparency.** Low tints only: the pale ramp steps and the 8–12% `color-mix` status tints, each with a full hairline and a label. The modal scrim uses `--color-scrim`. No blur.

**Imagery.** Almost none by design. If an image is added it is cool, low-saturation, unfiltered. No full-bleed heroes, no illustrations, no repeating textures, no gradients.

**Iconography.** Unicode is the icon set: `›` `▸` `»` `└──` `├──` `─` `☾` `☀` `★` `⑂` `$` `//`. No icon font, no sprite, no emoji, ever. If a glyph genuinely can't carry the meaning, draw a 1.5–2.2px stroked SVG in `currentColor`, square caps, at 1em.

**The mark.** `jy ❯` — pure type, IBM Plex Mono, chevron in `--color-brand`. Once per surface: footer sign-off, contact line, man-page footer, 404. Live surfaces may carry the blinking caret; print and tty are static. Never above 56px, never inside a code block. `assets/favicon.svg` renders the same mark as type. There is no glyph or rune alternative — the mark is only ever this type.

---

## Composition

- **Triangulate to the datum.** Colour, type, spacing, and motion resolve to tokens; nothing floats free. Repetition of the same tokens is the identity.
- **One accent carries interaction, one carries consequence.** Everything else that wants attention uses a ground step, a hairline, or a glyph. Contrast comes from restraint.
- **Rows over cells.** A list of records is a row per record: label, value, affordance. A grid of columns is a table. The two are separate components and the line between them is the number of columns, not the viewport — a table does not become a list when the screen narrows.
- **The affordance is a glyph in the accent.** `›` in `--color-accent` on a tappable row, so the row reads as operable in grayscale as well as in colour.
- **Paired foregrounds.** Every fill that carries text ships its guaranteed-contrast foreground token.
- **Align to the grid.** No ad-hoc values, at any density.

---

## Interaction

The visitor is here to *operate* or to *read*, so the interface recedes and the work leads.

- **Be direct.** Buttons are lowercase commands; errors are errno-style; empty states are `//` comments. No marketing sheen, no exclamation marks.
- **React immediately, and flatly.** Interaction changes colour and border, not scale. Motion is the "survey renders in" grammar — draw-in, extend, count-up — eased, never bouncing, and disabled under `prefers-reduced-motion`.
- **Reserve the space a message will need.** A field's explain line holds its height whether or not there is an error; layout does not jump on validation.
- **Say it once, transiently, for what doesn't need acknowledging.** A toast reports; it never asks. Anything requiring a decision is a dialog.
- **Keep the keyboard first-class.** Every interactive element has a visible `:focus-visible` ring; overlays trap and restore focus; lists rove tabindex.
- **Stay lightweight.** Prefer the platform primitive — native `<dialog>`, a Unicode glyph, a `<details>` — over a dependency.

---

## Voice

Copy is a design token: the surveyor register collapses if the words read like a SaaS landing page.

**First person singular.** One person's work, and it says so. "I read everything", never "we're thrilled". No royal we, no brand-as-person. **I** for self-description; **you** sparingly, and only when genuinely addressing the reader.

**Buttons are commands, lowercase.** A button does what a shell command does: names the action, nothing else. `say hello ›`, `read more ›`, `copy`. Never "Get In Touch Today!", never Title Case, never a verb dressed as an invitation.

**Errors use errno style.** Code, fact, pointer — in that order. Calm, technical, useful: `E404: no such page — see index(1)`. No theatrical apology, no blaming the user, no hiding the pointer.

**Empty states are comments.** Annotated absence, in the system's own `//` voice. It may be wry; it may not be cute: `// nothing here yet — drafts live longer than they should`.

**No exclamation marks, no marketing adjectives.** No "amazing", "powerful", "seamless", "delightful". If the work is good, plain description carries it. The one permitted `!` is in code samples where the language requires it.

### Reference pairs

| Context | Generic | Jylhis |
|---|---|---|
| CTA button | Get In Touch Today! | `say hello ›` |
| 404 page | Oops! We couldn't find that page. | `E404: no such page — see index(1)` |
| Empty state | Nothing here yet. Check back soon! | `// nothing here yet — drafts live longer than they should` |
| Loading | Loading, please wait… | `fetching` + caret (see `motion.css`) |
| Form success | Thank you! Your message has been sent successfully. | `✓ sent — I read everything, reply within a week` |
| Destructive confirm | Are you sure? This cannot be undone! | `✕ delete plate — this is not reversible` |

### Casing

- **Lowercase** — nav, breadcrumbs, footer, tag chips, section labels, page titles on subpages: `home`, `notes`, `projects`, `rss feed`, `tags`, `/now`, `/uses`.
- **Title Case or Sentence case** — prose headings inside articles: `Work & Career`, `Modern Linux Command-Line Tools`.
- **Canonical** — code, commands, tech proper nouns: `NixOS`, `Emacs`, `Cloudflare Pages`, `Astro`.
- **UPPERCASE with section number** — man-page labels: `CRAFT(7)`, `NOTES(7)`.

### Decorators

The visual voice leans on typewriter, man-page, and terminal tropes rather than ornament: `//` prefixes a "currently" comment block; `›` is the list bullet and the row affordance; `▸` is the breadcrumb separator; `»` opens a blockquote, in accent, in mono; `$ ls -la ~/projects/` heads the projects index; `drwxr-xr-x` permission strings serve as status tags; `└──` and `├──` draw project link trees; `────────` draws the footer rule; `☾` / `☀` toggle the mode; `★` / `⑂` are stars and forks.

Unicode characters, not emoji. Emoji are not used anywhere — not in headings, nav, body, or commit messages.

### Length and dates

Short. The hero is three lines. Note excerpts fit on two. Long-form lives in notes and projects; landing surfaces stay terse. Month-year in the CV (`May 2025 — present`), human dates in lists (`Oct 19, 2025`), seasons (`autumn 2024`) only in prose.

---

## Changing a token

`tokens.css` is generated output. Do not edit it.

1. Edit `themes/<slug>.json` (palette, syntax, status, ramps, shadowFloat) or `tokens.core.json` (structure, type, spacing, motion, density). State the light value once; dark lives beside it and the ramps with it.
2. Run the generator (`bun scripts/generate.mjs`). It rewrites `tokens.css`, `density.css`, `tokens-data.js` and every platform target.
3. Run `bun scripts/validate-tokens.mjs`. A contrast claim that no longer measures true fails here — fix the value or the claim, knowingly.
4. Review the diff, platform references included. The `_reference/` survey files carry committed hexes; a palette change must retune them or derived targets silently keep old colours.
5. Check the affected `preview/` and `components/*/card.html` cards in both modes of both themes, at all three densities, and once in grayscale.

The generated `tokens.css` is committed. The diff on a derived value is the point of review.
