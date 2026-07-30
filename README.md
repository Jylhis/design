# Jylhis Design System

A design system for **jylhis.com** — the personal site of Markus Jylhänkangas, Senior Software Engineer & DevOps specialist based in Zürich.

The site is personal, technical, and deliberately cartographic: cool near‑neutral grounds, a single bronze accent, engraved plate titles over grotesk body, structure drawn in contour blue. No frameworks, no gradients, no emoji. Everything is hand‑written CSS.

## Principles

1. **Cool grounds, never pure.** Light is `#f6f8fb` (Sheet), dark is `#0d0f14` (Field). White and black are reserved for ink that needs to bleed through, never for the page itself.
2. **One accent, bronze.** A single bronze channels every interactive surface — links, focus rings, primary fills. The benchmark vermilion (`brand`, `#b5450e` / `#ef8a4a`) is the maker's mark alone. Status reuses the Modus reds/yellows/greens/blues; the bronze accent is deliberately _not_ a syntax color, and `contour` blue is structure, never interaction.
3. **Dual-edition parity.** Sheet and Field are both first-class. Every token, every preview card, every platform target ships in both. Neither is a tinted afterthought.
4. **AAA body, AA meta, decorative faint.** Body text is WCAG AAA on both backgrounds. `text-muted` clears AA. `text-faint` is for non-text-critical chrome only — dashed rules, disabled labels.
5. **Modus syntax everywhere.** Code in Emacs, the web showcase, `bat`, `delta`, and Charm TUIs all render with the same Operandi/Vivendi colors. One source, one grammar.
6. **Unicode is the icon set.** `›` `▸` `»` `└──` `☾` `☀` `★` `⑂`. No icon font, no SVG sprite, no emoji.
7. **No shadow, no gradient, no glass.** Elevation is conveyed with 1px borders and background-color steps. Animation is color and translate only — no bounce, no scale, no opacity tricks.
8. **One source of truth.** Every color, spacing, motion, typography, and ANSI value lives in `tokens.json`. Platform targets are generated from it.

## Inspired by, different from

- **Modus Themes** (Protesilaos). We import the Operandi (light) and Vivendi (dark) syntax palettes verbatim (current Modus 4.x values), so any code rendered against Jylhis matches an Emacs Modus session pixel-for-pixel; the Field status colors are the one deliberate deviation, toned so nothing glows. Where Modus ships eight themes (main + tinted + deuteranopia + tritanopia variants) we ship two — the philosophy is "one cool light, one cool dark, both AAA-body."
- **Solarized** (Schoonover). Solarized's selective-contrast and lightness-symmetry ideas underwrite our `text-muted` / `text-faint` ladder. We do not match its CIELAB symmetry between modes — Sheet and Field are tuned independently, not mirrored.
- **Nord**. Nord groups its sixteen named colors thematically (Polar Night, Frost, Aurora). We adopt the same idea — thematic group names _over_ role names — but with a cartographic-survey vocabulary instead of an Arctic one.
- **Catppuccin**. Catppuccin's per-color usage guide and four-flavor parity influenced our integration docs and dual-theme requirements. We do not follow its multi-accent pastel approach — Jylhis is single-accent and cool.
- **Leuven** (Niessen). Leuven's prose-and-Org focus reminded us that a theme is judged on long-form reading first; our Hanken Grotesk body and `72ch` measure are the answer to that.

## Source

- **Source of truth:** [`tokens.json`](./tokens.json) — every color, spacing, motion, and typography value
- **Live site:** https://jylhis.com (Astro, hand‑written CSS, served via Cloudflare)
- **Showcase:** `index.html`, served via Cloudflare

## Architecture

```
tokens.json                        ← single source of truth
    │
    ├── bun scripts/generate.mjs   ← generates all targets
    │
    ├── tokens.css                 ← CSS custom properties
    ├── tokens-data.js             ← JS for the showcase website
    ├── tokens.md                  ← human-readable spec
    ├── docs/components/           ← per-component reference (from .d.ts + card.html)
    ├── platforms/ghostty/         ← Ghostty themes
    ├── platforms/emacs/           ← Emacs themes (three display tiers)
    ├── platforms/charm/           ← Go palette (lipgloss/Bubble Tea)
    ├── platforms/glamour/         ← Glamour terminal-Markdown styles
    ├── platforms/bat/             ← bat/delta syntax themes
    ├── platforms/hyprland/        ← Hyprland color configs
    ├── platforms/hyprlock/        ← Hyprlock lock-screen theme
    ├── platforms/rofi/            ← Rofi themes
    ├── platforms/gtk/             ← GTK overrides
    ├── platforms/waybar/          ← Waybar CSS (field + sheet)
    ├── platforms/mako/            ← Mako configs (field + sheet)
    ├── platforms/kvantum/         ← Kvantum color palettes
    ├── platforms/base16/          ← base16 schemes (stylix)
    ├── platforms/console/         ← Linux kernel TTY palettes
    ├── platforms/plymouth/        ← Plymouth boot-splash themes
    ├── platforms/gimp/            ← GIMP / Inkscape / Krita swatches
    ├── platforms/adobe/           ← Adobe .ase swatches (binary)
    ├── platforms/hyperos/         ← HyperOS/MIUI phone themes
    └── platforms/shell/fzf-*.sh   ← fzf palettes (rest of shell/ is hand-authored)

colors_and_type.css                ← hand-authored (imports tokens.css + type helpers)
```

Change a color in `tokens.json`, run `bun scripts/generate.mjs`, and every platform updates.

## Index

| File                                   | What it is                                                                                                                                                                                                                               |
| -------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `tokens.json`                          | **Source of truth.** Machine‑readable palette, syntax, ANSI, typography, spacing, motion, contrast checks.                                                                                                                               |
| `tokens.css`                           | Generated CSS custom properties (light + dark). Imported by `colors_and_type.css`.                                                                                                                                                       |
| `tokens.md`                            | Generated human‑readable spec with markdown tables.                                                                                                                                                                                      |
| `tokens-data.js`                       | Generated JS module for the showcase website.                                                                                                                                                                                            |
| `styles.css`                           | **One-import entry point** — pulls in `colors_and_type.css`, `motion.css`, and `components/components.css`.                                                                                                                              |
| `colors_and_type.css`                  | Hand‑authored font stacks + semantic type helpers. Imports `tokens.css` + `fonts.css`.                                                                                                                                                   |
| `fonts.css`                            | Self-hosted `@font-face` blocks (Zilla Slab + Hanken Grotesk + IBM Plex Mono, latin/latin-ext subsets).                                                                                                                                  |
| `motion.css`                           | The "survey renders in" motion signature — `.ds-contour-draw`, `.ds-line-extend`, `.ds-readout`, `.ds-caret`, mapped to the motion tokens.                                                                                               |
| `components/`                          | React components library — 20 components (`Button`, `Tag`, `Alert`, `Callout`, `Terminal`, `Mark`, `Table`, `Tabs`, `Pagination`, `Modal` …), each with JSX, `.d.ts`, and a `card.html` specimen; styled by `components/components.css`. |
| `scripts/generate.mjs`                 | Reads `tokens.json`, writes generated platform target files.                                                                                                                                                                             |
| `scripts/validate-tokens.mjs`          | Schema validation, contrast checks (explicit + extended sweep), CSS `var()` resolution.                                                                                                                                                  |
| `scripts/validate-a11y-html.mjs`       | HTML accessibility (lang, alt, labels, focus, reduced-motion, status-with-glyph).                                                                                                                                                        |
| `scripts/validate-a11y-css.mjs`        | CSS accessibility (transitions guarded, outline replaced on `:focus-visible`).                                                                                                                                                           |
| `scripts/validate-a11y-type.mjs`       | Text resizing (no px `font-size`, no sub-floor `rem`, no viewport-only `clamp()`, em breakpoints).                                                                                                                                       |
| `scripts/validate-cli-conventions.mjs` | bun scripts follow [`docs/CLI-TUI-GUIDELINES.md`](./docs/CLI-TUI-GUIDELINES.md).                                                                                                                                                         |
| `scripts/validate-emacs-faces.mjs`     | Emacs face coverage in the generated theme core matches `platforms/emacs/face-manifest.json`.                                                                                                                                            |
| `scripts/validate-preview-hex.mjs`     | Hex literals in showcase/preview/component HTML exist in `tokens.json`.                                                                                                                                                                  |
| `nix/ghostty.nix`                      | Nix derivation: wraps Ghostty with Jylhis themes.                                                                                                                                                                                        |
| `nix/emacs.nix`                        | Nix derivation: Emacs theme package via `trivialBuild`.                                                                                                                                                                                  |
| `nix/themes.nix`                       | Nix derivation: all theme files as a single package.                                                                                                                                                                                     |
| `platforms/`                           | Generated theme files. `KEYBOARD.md`, `mcp/`, `charm/` Go styles, and `shell/` (except the generated `fzf-*.sh`) are hand‑authored.                                                                                                      |
| `platforms/charm/`                     | Go package (`jylhis`) for Charm TUIs — palette + pre-built lipgloss styles + themed bubbles + Bubble Tea light/dark detection.                                                                                                           |
| `docs/INTEGRATION.md`                  | How to consume the system from web, Go, terminal, Emacs, Wayland, Nix; how to add a new platform.                                                                                                                                        |
| `docs/CLI-TUI-GUIDELINES.md`           | Design conventions for any CLI/TUI shipped with the system.                                                                                                                                                                              |
| `docs/ACCESSIBILITY.md`                | Measurable WCAG commitments, CVD policy, and what the validators enforce.                                                                                                                                                                |
| `docs/PRINCIPLES.md`                   | Design principles — the _why_: values, structural + interaction principles, the named rules.                                                                                                                                             |
| `docs/STYLE-GUIDE.md`                  | Visual language: when to pick which token.                                                                                                                                                                                               |
| `docs/components/`                     | Per-component reference (generated) — summary, props table, accessibility notes.                                                                                                                                                         |
| `docs/VOICE.md`                        | Voice & microcopy — copy is a design token; errno-style errors, lowercase command buttons.                                                                                                                                               |
| `docs/REVIEW.md`                       | Structural design review (AI-tells audit) with applied recommendations.                                                                                                                                                                  |
| `platforms/KEYBOARD.md`                | Focus, kbd, command-palette, selected-row, canonical shortcuts.                                                                                                                                                                          |
| `preview/`                             | HTML specimen cards for the showcase.                                                                                                                                                                                                    |
| `prototypes/`                          | Interactive prototypes — desktop (Norton-Commander TUI), macOS reskin, tablet, web. All are thin consumers of `styles.css` + the components library, with platform chrome from `mocks/`.                                                 |
| `mocks/`                               | Self-contained mock-template packages — `stage/` (fixed-canvas scaler), `tui/`, `macos/`, `tablet/` chrome. Tokens only, no raw hex; see `mocks/README.md`.                                                                              |
| `index.html`                           | Showcase landing page, served via Cloudflare.                                                                                                                                                                                            |

---

## Quick start

### Web (CSS)

```css
@import "./vendor/jylhis/colors_and_type.css";

html {
  background: var(--color-bg);
  color: var(--color-text);
}
a {
  color: var(--color-accent);
}
a:hover {
  color: var(--color-accent-hover);
}
```

```js
document.documentElement.dataset.theme = matchMedia(
  "(prefers-color-scheme: dark)",
).matches
  ? "dark"
  : "";
```

### Nix (Ghostty with themes)

```nix
ghostty-jylhis = pkgs.callPackage /path/to/design/nix/ghostty.nix {};
```

### Development

```bash
bun scripts/generate.mjs                  # regenerate targets from tokens.json
bun scripts/generate.mjs --check          # verify committed files match (CI mode)
bun scripts/validate-tokens.mjs           # schema + contrast validation
bun scripts/validate-a11y-html.mjs        # HTML accessibility
bun scripts/validate-a11y-css.mjs         # CSS accessibility
bun scripts/validate-a11y-type.mjs        # text resizing
bun scripts/validate-cli-conventions.mjs  # CLI conventions audit
bun scripts/validate-emacs-faces.mjs      # Emacs face coverage audit
bun scripts/validate-preview-hex.mjs      # hex provenance audit
serve-pages                               # build the _site showcase artifact, serve locally, rebuild on changes
```

All seven static validators support `--help` and `--version` and run in CI on every push.

Full consumer guide: [`docs/INTEGRATION.md`](./docs/INTEGRATION.md). Design conventions for command-line tools: [`docs/CLI-TUI-GUIDELINES.md`](./docs/CLI-TUI-GUIDELINES.md). Accessibility commitments: [`docs/ACCESSIBILITY.md`](./docs/ACCESSIBILITY.md).
Version history: [`CHANGELOG.md`](./CHANGELOG.md).
Project canon: [`ENGINEERING_PRINCIPLES.md`](./ENGINEERING_PRINCIPLES.md), [`WAY_OF_WORKING.md`](./WAY_OF_WORKING.md), [`AGENTS.md`](./AGENTS.md).

---

## Dogfooding

The design system is not an abstract spec — it ships colors, fonts,
keyboard, and CLI conventions into the surfaces I use every day. Every
release is exercised against the consumers below before tagging.

| Consumer                                                          | What it pins                                                                                                                                                                              | Cadence                                                                                   |
| ----------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------- |
| **jylhis.com** (Astro)                                            | `tokens.css`, `colors_and_type.css`, Zilla Slab + Hanken Grotesk + IBM Plex Mono stack                                                                                                    | Production site; updated on every release.                                                |
| **Jotain** (personal Emacs config)                                | `platforms/emacs/jylhis-sheet-theme.el`, `jylhis-field-theme.el`, Modus syntax mappings                                                                                                   | Daily driver editor; theme is reloaded on every release.                                  |
| **Marchyo** (personal NixOS / Hyprland workstation)               | `platforms/ghostty/`, `platforms/hyprland/`, `platforms/rofi/`, `platforms/waybar/`, `platforms/mako/`, `platforms/hyprlock/`, `platforms/gtk/`, `platforms/kvantum/`, `platforms/shell/` | Full desktop chrome; pinned via `nix/themes.nix`.                                         |
| **nacutils** (personal CLI/TUI toolbox)                           | `platforms/charm/jylhis` Go package (palette, lipgloss styles, Bubble Tea light/dark detection)                                                                                           | Every TUI links the package; CLI conventions enforced via `validate-cli-conventions.mjs`. |
| **Creative tooling** (GIMP, Inkscape, Krita, Affinity, Photoshop) | `platforms/gimp/*.gpl`, `platforms/adobe/*.ase`                                                                                                                                           | Swatch palettes loaded on demand.                                                         |
| **HyperOS / MIUI phone**                                          | `platforms/hyperos/jylhis-{sheet,field}.mtz`                                                                                                                                              | Manual install per device.                                                                |

If a consumer breaks after a release, the bug is in this repo — not in
the consumer. File it here and revert if necessary before the consumer
patches.

---

## Releasing

Semantic versioning. Releases are cut by tagging `main`. The full
process lives in
[`WAY_OF_WORKING.md#release-process`](./WAY_OF_WORKING.md#release-process);
the short form:

1. Move `CHANGELOG.md` `[Unreleased]` items into a new dated section,
   add the compare link.
2. Bump the version field inside `tokens.json` metadata (the showcase
   reads it from there).
3. Run the validator gauntlet locally — every check must pass.
4. Open a PR titled `release: vX.Y.Z`; wait for CI green; squash-merge.
5. Tag the merge commit (`git tag vX.Y.Z && git push origin vX.Y.Z`).
6. The showcase ships via Cloudflare from the monorepo; verify the
   version badge on the live site.
7. Cut a GitHub Release from the tag with the CHANGELOG section as the
   body.
8. Consumers update their pins in their own follow-up PRs.

---

## CONTENT FUNDAMENTALS

**Voice.** First‑person, direct, a little dry. Written by an engineer, not a marketer. "I don't have enough hours in the day to build everything I want — and neither do you." "The kind of engineer who fixes problems before customers notice them."

**You/I.** Uses **I** for self‑description, **you** sparingly and only when genuinely speaking to the reader. No "we" — this is one person's site.

**Casing.**

- Nav, breadcrumbs, footer, tag chips, page titles on subpages: **all lowercase** (`home`, `notes`, `projects`, `rss feed`, `tags`, `/now`, `/uses`).
- Prose headings inside articles: **Title Case or Sentence case** (`Work & Career`, `Modern Linux Command-Line Tools`).
- Code/commands/tech names: keep canonical casing (`NixOS`, `Emacs`, `Cloudflare Pages`, `Astro`).
- Man‑page style labels: **UPPERCASE with section number** — `CRAFT(7)`, `NOTES(7)`.

**Decorators.** The visual voice leans on typewriter/man‑page/terminal tropes, not emoji:

- `//` prefix for "currently" style comment blocks — `// currently`.
- `›` chevron as list bullet in the hero.
- `▸` as breadcrumb separator.
- `»` as blockquote opener (accent color, mono).
- `$ ls -la ~/projects/` — the `/projects` index uses a literal shell prompt.
- `drwxr-xr-x` Unix permission strings as status tags (active/archived/experimental/contributed).
- `└──` and `├──` tree characters for project links.
- Horizontal rules drawn with `────────` in the footer.

**Tone examples from the real site:**

- Hero headline: `I build systems that make teams faster`
- Role line: `senior software engineer · Zürich, CH`
- Footer colophon: `set in zilla slab, hanken grotesk & ibm plex mono · built with astro · hosted on cloudflare`
- Note excerpt: `Modern replacements for traditional Unix tools`
- Project description: `Personal spin of Omarchy with NixOS`

**Emoji.** Not used. Not in headings, not in nav, not in content. The star / fork glyphs on project cards are Unicode characters (★ ⑂), not emoji.

**Unicode as icons.** Heavily. `☾` / `☀` for dark‑mode toggle. `›` `▸` `»` `└──` `├──` `─` as UI chrome. This IS the icon system — see the Iconography section.

**Length.** Short. Hero is three lines. Note excerpts fit on two. The site does long‑form in notes and projects, but landing surfaces are terse.

**Dates.** ISO‑adjacent month‑year in the CV (`May 2025 — present`), human dates (`Oct 19, 2025`) in notes list, seasons (`autumn 2024`) only in copy.

---

## VISUAL FOUNDATIONS

**Overall vibe.** A topographic survey plate of one engineering practice, with a single bronze accent and one vermilion benchmark stamp. Code‑editor gutters, man‑page headers, shell prompts, map collars — the chrome is literally borrowed from the tools the owner uses all day.

**Colors.**

- Backgrounds are never pure white. Light mode is `#f6f8fb` (Sheet). Dark mode is `#0d0f14` (Field, never pure black).
- Text is never pure black (`#12141a` for headings, `#23262e` for body; Field ink `#f2f4f8` / `#d6dae2`).
- A single accent — **bronze** — plus one mark color:
  - `--color-accent` `#6f3e00` (light) / `#e0a33a` (dark) — the only interactive colour: links, focus rings, primary fills, any accent that carries text meaning. WCAG AAA on every Sheet ground and on the Field ground.
  - `--color-accent-hover` `#8a4d00` / `#f0b95c` — `:hover`/`:active` only.
  - `--color-brand` `#b5450e` / `#ef8a4a` — benchmark vermilion; the maker's‑mark chevron and the datum mark only, never a link colour.
- `--color-contour` `#2f4fb0` / `#6f9be0` — Modus‑blue structural linework (contour rings, dividers, diagram strokes); structure only, never interaction.
- A cool neutral family carries everything else: borders (`#cfd6de` / `#2b303b`), graticule decorator lines (`#7f8fb5` / `#39415a`), faint text (`#878c95` / `#656b76`).
- **Accessibility.** All body text hits WCAG AAA on both Sheet and Field grounds. `--color-text-muted` is AA. `--color-text-faint` is reserved for decorative / non‑text‑critical roles only (dashed rules, disabled meta).
- Syntax‑highlight colors come from **Emacs Modus** (Operandi in light, Vivendi in dark; current 4.x values, verbatim) so code blocks look identical in the editor, on the web, in `bat` / `delta`, and inside Charm TUIs. Keyword `#531ab6` (magenta‑cooler), string `#3548cf` (blue‑warmer), function `#721045` (magenta), type/tag `#005f5f` (cyan‑cooler), comment `#595959` (faint). Status badges (err/warn/ok/info) reuse the Modus red/yellow/green/cyan accents — the bronze accent is deliberately **not** a syntax colour.

**Type.** Three roles is the signature. Display and plate titles use **Zilla Slab**; body, navigation, and controls use **Hanken Grotesk** at 1.0625rem / 1.6 line‑height; data, dates, labels, `//` chrome, and code use **IBM Plex Mono**. Titles are tight (1.02–1.05 line‑height, −0.01em tracking).

**Spacing.** A 4px grid with a 2px micro‑step. Tokens go `2xs 2 · xs 4 · sm 8 · md 16 · lg 24 · xl 32 · 2xl 48 · 3xl 64`. The page is a two‑column grid: content `72ch max` + a right rail of `16rem` used for sidenotes; collapses to single‑column on narrow viewports (breakpoints: `sm 640px`, `md 860px`).

**Backgrounds.** Flat survey sheet. **No gradients.** **No full‑bleed hero images.** **No hand‑drawn illustrations.** **No repeating patterns or textures.** The one visual flourish is `craft.astro`, which hosts three scroll‑triggered pieces (D3 bar chart, SVG infra topology, Three.js wireframe icosahedron) — but those are demonstrations, not page chrome.

**Animation.** Subdued and purposeful.

- Page enter: 8px translate‑up + opacity fade, 300ms ease‑out.
- Links underline via an animated `background-size: 0% → 100% 1px` at 250ms ease‑out.
- HR's are scroll‑revealed (scaleX 0.4 → 1) using CSS `animation-timeline: view()`.
- Theme toggle transitions bg/color over 250ms (`base`).
- The "survey renders in" signature: contour rings draw outer→inner, triangulation lines extend, mono readouts count up (`motion.css`, 480ms `survey` token).
- All easings are `ease-out`. No bounces, no delays. Respects `prefers-reduced-motion` (opacity fades and the caret blink are the named exceptions — see `docs/STYLE-GUIDE.md` §5).

**Hover states.** Color shift only. Links go from `--color-accent` to `--color-accent-hover` (darker). Nav/footer links go from muted‑text to accent. Buttons swap border color to accent. **No scale, no shadow lift, no opacity tricks.**

**Press / active.** Uses `--color-accent-hover` (the deeper bronze). No shrink transform.

**Focus.** `outline: 2px solid var(--color-accent); outline-offset: 2px; border-radius: 2px` on all focus‑visible. Accessible and visible.

**Borders.** 1px solid `--color-border` almost everywhere; 2px is the focus ring; 3px is reserved solely for the selected‑item marker in keyboard surfaces (the decorative side‑stripe is retired). Tables get a 2px strong border under `thead`. Callouts and alerts carry a full hairline, never a stripe.

**Shadows.** **None.** There is no shadow system. Elevation is conveyed with background‑color steps (bg → bg‑subtle → surface → surface‑raised) and 1px borders. This is a deliberate flat‑sheet aesthetic.

**Corner radii.** Reserved and small.

- `2px` (`xs`) on focus rings and the smallest tech tags.
- `3px` (`sm`) on inputs, inline code, chips, buttons, and plates.
- `4px` (`md`) on cards and code blocks.
- `pill` exists only for true capsules — the theme‑toggle circle is the one such element.
- Cards do **not** have large rounding. No 12‑16px pill aesthetics.

**Cards.** 1px border, 4px radius, bg = `--color-bg-subtle` or `--color-surface-raised`. Padding `--space-lg` (24px). Hover = border‑color shifts toward the accent, bg steps up one surface level. No drop shadow. Featured projects use `--color-bg-subtle` + stronger border.

**Transparency / blur.** Low‑percentage tints only: `--color-accent-subtle` (the accent at ~12% light / ~15% dark) and the 8–12% `color-mix` status tints behind alerts, callouts, and badges — always with a full hairline and a label. The modal scrim uses the `scrim` token. **No backdrop‑filter, no glassmorphism.**

**Imagery.** Cool? Warm? **There is almost no imagery** on the real site. The OG image exists, the apple‑touch‑icon exists, and that's it. If images are added, they should be cool, low‑saturation, and slightly desaturated to sit alongside the survey palette. No heavy filters.

**Layout rules.**

- Fixed max content width: `72ch`.
- Header is left‑aligned at `margin-left: 10vw`, balanced by breadcrumb on the right.
- Footer is full‑width and center‑aligned.
- Sticky/fixed elements: none on the page body. The search overlay is modal on activation.
- `main` has a centered grid; the right rail is reserved for sidenotes on desktop only.

**Text wrapping.** Body uses browser defaults. `overflow: hidden` + `white-space: nowrap` applied to the footer's `─────────` rule so the dashes don't wrap.

**Focus states on cards.** Cards are wrappers, not buttons — the `<a>` inside gets the outline, not the card.

---

## ICONOGRAPHY

**Primary "logo" — the maker's mark.** The prompt: **`jy ❯`** — pure type, set in IBM Plex Mono, the chevron always in benchmark vermilion (`--color-brand`). On live surfaces it may carry the blinking caret (`.ds-caret`); in print and tty it is static. It appears once per surface — footer sign‑off, contact line, man‑page footer, 404 — and because it is text, it renders identically in web, terminal, Emacs, and git. `assets/favicon.svg` renders the same mark as type (scheme‑aware ink, vermilion chevron). The benchmark glyph (△ in ◯) is not the mark; it is the survey‑plate datum symbol, drawn as a thin `currentColor` stroke.

**Icon set — there isn't one.** No icon font, no Heroicons, no Lucide, no SVG sprite. The design intentionally uses Unicode glyphs as UI chrome:

- `›` — list bullets in the "currently" block.
- `▸` — breadcrumb separator.
- `»` — blockquote marker.
- `☾` / `☀` — theme toggle.
- `★` / `⑂` — GitHub stars / forks on project cards.
- `└──` / `├──` — tree lines on project link lists.
- `─` / `────────` — horizontal rules drawn with box‑drawing dashes.
- `$` — shell prompt on the projects index.
- `//` — comment prefix on "currently" label.

**Emoji.** Never.

**SVGs.** The only bespoke SVG is `assets/favicon.svg`, which renders the type mark. Survey marks (the benchmark △ in ◯, trig‑station triangles) are drawn inline as thin `currentColor` strokes where a diagram needs them; data‑viz components draw their own SVG at runtime. None of these are an icon set.

**PNG icons.** `assets/apple-touch-icon.png` for iOS home screens, `assets/og-default.png` for social cards. No other raster icons.

**If you need a new "icon" for a design:** default to a Unicode glyph or a thin monospace character. If that genuinely can't do the job, draw a thin‑stroke (1.5–2.2px) square‑capped SVG in `currentColor` at 1em size, matching the maker's mark's line style.

---

## Known substitutions / gaps

- **Fonts:** the design system uses three roles — **Zilla Slab** (display/titles), **Hanken Grotesk** (UI/body), **IBM Plex Mono** (data/labels/code). All are OFL and ship full Finnish diacritic coverage. They are already self‑hosted: `fonts.css` carries the `@font-face` blocks and `fonts/` carries the subsetted `woff2` files.
- **No slide template** — this design system has no `slides/` folder.
- **Shell configs not generated** — `platforms/shell/` (starship.toml, bashrc, zshrc, dircolors) use ANSI color names rather than hex values, so they work with whatever terminal theme is loaded and are not generated from `tokens.json`.

---

## License

MIT — see [`LICENSE`](./LICENSE).
