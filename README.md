# Jylhis Design System

A design system for **jylhis.com** — the personal site of Markus Jylhänkangas, Senior Software Engineer & DevOps specialist based in Zürich.

The site is personal, technical, and deliberately paper‑like: warm cream backgrounds, a single copper accent, monospace headings, serif body. No frameworks, no gradients, no emoji. Everything is hand‑written CSS.

## Principles

1. **Warm paper, never pure.** Light is `#faf7f2` cream, dark is `#1a1714` roast. White and black are reserved for ink that needs to bleed through, never for the page itself.
2. **One accent, copper.** A single burnt-orange channels every interactive surface — links, focus rings, the maker's mark. Status reuses the Modus reds/yellows/greens/blues; the brand copper is deliberately *not* a syntax color.
3. **Dual-theme parity.** Paper and Roast are both first-class. Every token, every preview card, every platform target ships in both. Neither is a tinted afterthought.
4. **AAA body, AA meta, decorative faint.** Body text is WCAG AAA on both backgrounds. `text-muted` clears AA. `text-faint` is for non-text-critical chrome only — dashed rules, disabled labels.
5. **Modus syntax everywhere.** Code in Emacs, the web showcase, `bat`, `delta`, and Charm TUIs all render with the same Operandi/Vivendi colors. One source, one grammar.
6. **Unicode is the icon set.** `›` `▸` `»` `└──` `☾` `☀` `★` `⑂`. No icon font, no SVG sprite, no emoji.
7. **No shadow, no gradient, no glass.** Elevation is conveyed with 1px borders and background-color steps. Animation is color and translate only — no springs, no scale, no opacity tricks.
8. **One source of truth.** Every color, spacing, motion, typography, and ANSI value lives in `tokens.json`. Platform targets are generated from it.

## Inspired by, different from

- **Modus Themes** (Protesilaos). We import the Operandi (light) and Vivendi (dark) syntax palettes verbatim, so any code rendered against Jylhis matches an Emacs Modus session pixel-for-pixel. Where Modus ships eight themes (main + tinted + deuteranopia + tritanopia variants) we ship two — the philosophy is "one warm light, one warm dark, both AAA."
- **Solarized** (Schoonover). Solarized's selective-contrast and lightness-symmetry ideas underwrite our `text-muted` / `text-faint` ladder. We do not match its CIELAB symmetry between modes — Paper and Roast are tuned independently for warmth, not mirrored.
- **Nord**. Nord groups its sixteen named colors thematically (Polar Night, Frost, Aurora). We adopt the same idea — thematic group names *over* role names — but with a paper-and-press vocabulary instead of an Arctic one.
- **Catppuccin**. Catppuccin's per-color usage guide and four-flavor parity influenced our integration docs and dual-theme requirements. We do not follow its multi-accent pastel approach — Jylhis is single-accent and warm.
- **Leuven** (Niessen). Leuven's prose-and-Org focus reminded us that a theme is judged on long-form reading first; our Literata body and `72ch` measure are the answer to that.

## Source

- **Source of truth:** [`tokens.json`](./tokens.json) — every color, spacing, motion, and typography value
- **Live site:** https://jylhis.com (Astro 5.x, hand‑written CSS, Cloudflare Pages)
- **Showcase:** deployed to GitHub Pages (`gh-pages` branch) from `main`; every PR gets a live preview under `pr-preview/pr-<N>/`
- **Key style files mirrored into `source_styles/`:**
  - `global.css` — design tokens + reset + link/skip/utility styles
  - `typography.css` — `@font-face`, font stacks, base scale
  - `content.css` — `.prose` markdown styling
  - `cv.css` — code‑editor line‑numbered CV layout

## Architecture

```
tokens.json                        ← single source of truth
    │
    ├── bun scripts/generate.mjs   ← generates all targets
    │
    ├── tokens.css                 ← CSS custom properties
    ├── tokens-data.js             ← JS for the showcase website
    ├── tokens.md                  ← human-readable spec
    ├── platforms/ghostty/         ← Ghostty themes
    ├── platforms/emacs/           ← Emacs themes
    ├── platforms/charm/           ← Go palette
    ├── platforms/hyprland/        ← Hyprland color configs
    ├── platforms/hyprlock/        ← Hyprlock lock-screen theme
    ├── platforms/rofi/            ← Rofi themes
    ├── platforms/gtk/             ← GTK overrides
    ├── platforms/waybar/          ← Waybar CSS
    ├── platforms/mako/            ← Mako config
    └── platforms/kvantum/         ← Kvantum color palettes

colors_and_type.css                ← hand-authored (imports tokens.css + type helpers)
```

Change a color in `tokens.json`, run `bun scripts/generate.mjs`, and every platform updates.

## Index

| File | What it is |
|---|---|
| `tokens.json` | **Source of truth.** Machine‑readable palette, syntax, ANSI, typography, spacing, motion, contrast checks. |
| `tokens.css` | Generated CSS custom properties (light + dark). Imported by `colors_and_type.css`. |
| `tokens.md` | Generated human‑readable spec with markdown tables. |
| `tokens-data.js` | Generated JS module for the showcase website. |
| `styles.css` | **One-import entry point** — pulls in `colors_and_type.css`, `motion.css`, and `components/components.css`. |
| `colors_and_type.css` | Hand‑authored font stacks + semantic type helpers. Imports `tokens.css` + `fonts.css`. |
| `fonts.css` | Self-hosted variable-font `@font-face` blocks (Literata + JetBrains Mono, latin/latin-ext subsets). |
| `motion.css` | The "ink draws on" motion signature — `.ds-rule-draw`, `.ds-typed`, `.ds-caret`, mapped to the motion tokens. |
| `components/` | React components library — 12 components (`Button`, `Tag`, `Alert`, `Callout`, `CvEntry`, `Changelog` …), each with JSX, `.d.ts`, and a `card.html` specimen; styled by `components/components.css`. |
| `scripts/generate.mjs` | Reads `tokens.json`, writes generated platform target files. |
| `scripts/validate-tokens.mjs` | Schema validation, contrast checks (explicit + extended sweep), CSS `var()` resolution. |
| `scripts/validate-a11y-html.mjs` | HTML accessibility (lang, alt, labels, focus, reduced-motion, status-with-glyph). |
| `scripts/validate-a11y-css.mjs` | CSS accessibility (transitions guarded, outline replaced on `:focus-visible`). |
| `scripts/validate-cli-conventions.mjs` | bun scripts follow [`docs/CLI-TUI-GUIDELINES.md`](./docs/CLI-TUI-GUIDELINES.md). |
| `scripts/validate-consumer-freshness.mjs` | Fetches the live jylhis.com CSS and diffs against `source_styles/`; exits 1 when drift exceeds `--threshold`. Run manually or via the weekly `freshness-check` GitHub Actions workflow. |
| `nix/ghostty.nix` | Nix derivation: wraps Ghostty with Jylhis themes. |
| `nix/emacs.nix` | Nix derivation: Emacs theme package via `trivialBuild`. |
| `nix/themes.nix` | Nix derivation: all theme files as a single package. |
| `platforms/` | Generated theme files. `shell/` and `KEYBOARD.md` are hand‑authored. |
| `platforms/charm/` | Go package (`jylhis`) for Charm TUIs — palette + pre-built lipgloss styles + themed bubbles + Bubble Tea light/dark detection. |
| `docs/INTEGRATION.md` | How to consume the system from web, Go, terminal, Emacs, Wayland, Nix; how to add a new platform. |
| `docs/CLI-TUI-GUIDELINES.md` | Design conventions for any CLI/TUI shipped with the system. |
| `docs/ACCESSIBILITY.md` | Measurable WCAG commitments, CVD policy, and what the validators enforce. |
| `docs/STYLE-GUIDE.md` | Visual language: when to pick which token. |
| `docs/VOICE.md` | Voice & microcopy — copy is a design token; errno-style errors, lowercase command buttons. |
| `docs/REVIEW.md` | Structural design review (AI-tells audit) with applied recommendations. |
| `platforms/KEYBOARD.md` | Focus, kbd, command-palette, selected-row, canonical shortcuts. |
| `preview/` | HTML specimen cards for the showcase. |
| `prototypes/` | Interactive prototypes — desktop (Norton-Commander TUI), macOS reskin, tablet, web. The web kit consumes `styles.css` + the components library directly. |
| `source_styles/` | Verbatim copies of the real site's CSS for reference. |
| `index.html` | Showcase landing page deployed to GitHub Pages. |

---

## Quick start

### Web (CSS)

```css
@import "./vendor/jylhis/colors_and_type.css";

html { background: var(--color-bg); color: var(--color-text); }
a { color: var(--color-accent); }
a:hover { color: var(--color-accent-hover); }
```

```js
document.documentElement.dataset.theme =
  matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "";
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
bun scripts/validate-cli-conventions.mjs  # CLI conventions audit
bun scripts/validate-consumer-freshness.mjs           # check live site for CSS drift
bun scripts/validate-consumer-freshness.mjs --threshold 20  # exit 1 if drift > 20 lines
serve-pages                               # build the GitHub Pages artifact, serve locally, rebuild on changes
```

All five static validators support `--help` and `--version` and run in CI on every push. The freshness check requires network access and runs on a separate weekly schedule.

Full consumer guide: [`docs/INTEGRATION.md`](./docs/INTEGRATION.md). Design conventions for command-line tools: [`docs/CLI-TUI-GUIDELINES.md`](./docs/CLI-TUI-GUIDELINES.md). Accessibility commitments: [`docs/ACCESSIBILITY.md`](./docs/ACCESSIBILITY.md).
Version history: [`CHANGELOG.md`](./CHANGELOG.md).
Project canon: [`ENGINEERING_PRINCIPLES.md`](./ENGINEERING_PRINCIPLES.md), [`WAY_OF_WORKING.md`](./WAY_OF_WORKING.md), [`AGENTS.md`](./AGENTS.md).

---

## Dogfooding

The design system is not an abstract spec — it ships colors, fonts,
keyboard, and CLI conventions into the surfaces I use every day. Every
release is exercised against the consumers below before tagging.

| Consumer | What it pins | Cadence |
|---|---|---|
| **jylhis.com** (Astro) | `tokens.css`, `colors_and_type.css`, Literata + JetBrains Mono stack, `source_styles/` reference | Production site; updated on every release. |
| **Jotain** (personal Emacs config) | `platforms/emacs/jylhis-paper-theme.el`, `jylhis-roast-theme.el`, Modus syntax mappings | Daily driver editor; theme is reloaded on every release. |
| **Marchyo** (personal NixOS / Hyprland workstation) | `platforms/ghostty/`, `platforms/hyprland/`, `platforms/rofi/`, `platforms/waybar/`, `platforms/mako/`, `platforms/hyprlock/`, `platforms/gtk/`, `platforms/kvantum/`, `platforms/shell/` | Full desktop chrome; pinned via `nix/themes.nix`. |
| **nacutils** (personal CLI/TUI toolbox) | `platforms/charm/jylhis` Go package (palette, lipgloss styles, Bubble Tea light/dark detection) | Every TUI links the package; CLI conventions enforced via `validate-cli-conventions.mjs`. |
| **Creative tooling** (GIMP, Inkscape, Krita, Affinity, Photoshop) | `platforms/gimp/*.gpl`, `platforms/adobe/*.ase` | Swatch palettes loaded on demand. |
| **HyperOS / MIUI phone** | `platforms/hyperos/jylhis-{paper,roast}.mtz` | Manual install per device. |

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
6. `pages.yml` deploys the showcase from `main` automatically; verify
   the version badge on Pages.
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
- Hero headline: `Build More, Work Less`
- Role line: `senior software engineer · Zürich, CH`
- Footer colophon: `set in literata & jetbrains mono · built with astro · hosted on cloudflare`
- Note excerpt: `Modern replacements for traditional Unix tools`
- Project description: `Personal spin of Omarchy with NixOS`

**Emoji.** Not used. Not in headings, not in nav, not in content. The star / fork glyphs on project cards are Unicode characters (★ ⑂), not emoji.

**Unicode as icons.** Heavily. `☾` / `☀` for dark‑mode toggle. `›` `▸` `»` `└──` `├──` `─` as UI chrome. This IS the icon system — see the Iconography section.

**Length.** Short. Hero is three lines. Note excerpts fit on two. The site does long‑form in notes and projects, but landing surfaces are terse.

**Dates.** ISO‑adjacent month‑year in the CV (`May 2025 — present`), human dates (`Oct 19, 2025`) in notes list, seasons (`autumn 2024`) only in copy.

---

## VISUAL FOUNDATIONS

**Overall vibe.** A personal engineering notebook printed on warm cream paper, with a single shop‑stamp of copper accent. Code‑editor gutters, man‑page headers, shell prompts — the chrome is literally borrowed from the tools the owner uses all day.

**Colors.**
- Backgrounds are never pure white. Light mode is `#faf7f2` (warm paper). Dark mode is `#1a1714` (dark roast, never pure black).
- Text is never pure black (`#1e1b18` for headings, `#2c2825` for body).
- A single accent — **copper / burnt orange**. Two roles:
  - `--color-brand` `#b5703c` — the literal favicon/rune/logo color. Use on large strokes and hero marks where contrast is not measured against text.
  - `--color-accent` `#8a4f24` (light) / `#e89b5e` (dark) — an accessibility‑tuned darker twin used for links, interactive UI, focus rings, and any accent that carries text meaning. WCAG AA on the paper bg; AAA on dark.
- Used for links, the maker's‑mark, code‑string quotes, the "currently" border, and nothing else.
- A muted family of browns/taupes carries everything else: borders (`#d5cec4`), decorator lines (`#c4baa8`), faint text (`#8a7f72`).
- **Accessibility.** All body text hits WCAG AAA on both paper and dark backgrounds. `--color-text-muted` is AA. `--color-text-faint` is reserved for decorative / non‑text‑critical roles only (dashed rules, disabled meta).
- Syntax‑highlight colors come from **Emacs Modus** (Operandi in light, Vivendi in dark) so code blocks look identical in the editor, on the web, in `bat` / `delta`, and inside Charm TUIs. Keyword `#531ab6` (magenta‑cooler), string `#0000b0` (blue‑cooler), function `#721045` (magenta), type/tag `#005f5f` (cyan‑cooler), comment `#7f1010` (red‑faint). Status badges (err/warn/ok/info) reuse the Modus red/yellow/green/blue accents — the brand copper is deliberately **not** a syntax colour.

**Type.** Monospace headings over serif body is the signature. Headings, nav, dates, labels, and chrome use **JetBrains Mono**. Long‑form reading uses **Literata** at 1.125rem / 1.65 line‑height. There is no sans‑serif in this system. Headings are tight (1.25 line‑height, +0.01em tracking).

**Spacing.** A 4px grid. Tokens go `xs 4 · sm 8 · md 16 · lg 24 · xl 32 · 2xl 48 · 3xl 64`. The page is a two‑column grid: content `72ch max` + a right rail of `16rem` used for sidenotes; collapses to single‑column under 1100px.

**Backgrounds.** Flat warm paper. **No gradients.** **No full‑bleed hero images.** **No hand‑drawn illustrations.** **No repeating patterns or textures.** The one visual flourish is `craft.astro`, which hosts three scroll‑triggered pieces (D3 bar chart, SVG infra topology, Three.js wireframe icosahedron) — but those are demonstrations, not page chrome.

**Animation.** Subdued and purposeful.
- Page enter: 8px translate‑up + opacity fade, 300ms ease‑out.
- Links underline via an animated `background-size: 0% → 100% 1px` at 250ms ease‑out.
- HR's are scroll‑revealed (scaleX 0.4 → 1) using CSS `animation-timeline: view()`.
- Theme toggle transitions bg/color over 300ms.
- All easings are `ease-out`. No springs, no bounces, no delays. Respects `prefers-reduced-motion`.

**Hover states.** Color shift only. Links go from `--color-accent` to `--color-accent-hover` (darker). Nav/footer links go from muted‑text to accent. Buttons swap border color to accent. **No scale, no shadow lift, no opacity tricks.**

**Press / active.** Uses `--color-accent-hover` (the darker copper). No shrink transform.

**Focus.** `outline: 2px solid var(--color-accent); outline-offset: 2px; border-radius: 2px` on all focus‑visible. Accessible and visible.

**Borders.** 1px solid `--color-border` almost everywhere. Accent left‑border (3px) is used on exactly two things: the home‑page "currently" box, and mobile sidenotes. Tables get a 2px strong border under `thead`.

**Shadows.** **None.** There is no shadow system. Elevation is conveyed with background‑color steps (bg → bg‑subtle → surface → surface‑raised) and 1px borders. This is a deliberate flat‑paper aesthetic.

**Corner radii.** Reserved and small.
- `2px` on focus rings and the smallest tech tags.
- `3px` on the search trigger, inline code, tag chips, mobile sidenotes.
- `4px` on project cards, code blocks, the "currently" box (right side only: `0 4px 4px 0`).
- `50%` on exactly one element — the theme‑toggle circle.
- Cards do **not** have large rounding. No 12‑16px pill aesthetics.

**Cards.** 1px border, 4px radius, bg = `--color-bg-subtle` or `--color-surface-raised`. Padding `--space-lg` (24px). Hover = border‑color shifts to `--color-border`, bg steps up one surface level. No drop shadow. Featured projects use `--color-bg-subtle` + stronger border.

**Transparency / blur.** Used once: `--color-accent-subtle` is `rgba(181,112,60,0.12)` for status‑badge backgrounds. **No backdrop‑filter, no glassmorphism.**

**Imagery.** Cool? Warm? **There is almost no imagery** on the real site. The OG image exists, the apple‑touch‑icon exists, and that's it. If images are added, they should be warm, low‑saturation, and slightly desaturated to sit alongside the cream paper palette. No heavy filters.

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

**Primary "logo" — the maker's mark.** An inline SVG rune (32×32, `stroke="currentColor"`, 2.2px stroke, square line‑caps) that sits in the site header next to the wordmark, and again in the footer identity strip. It's a hand‑drawn arrow/peak silhouette with crossed inner lines — a Nordic/typesetter feel. Always rendered in accent color. File: `assets/favicon.svg` (same art, color baked in).

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

**SVGs.** The only bespoke SVG is the maker's mark. Data‑viz components (`InfraDiagram`, `DeployChart`) draw their own SVG at runtime; they're not part of the icon system.

**PNG icons.** `assets/apple-touch-icon.png` for iOS home screens, `assets/og-default.png` for social cards. No other raster icons.

**If you need a new "icon" for a design:** default to a Unicode glyph or a thin monospace character. If that genuinely can't do the job, draw a thin‑stroke (1.5–2.2px) square‑capped SVG in `currentColor` at 1em size, matching the maker's mark's line style.

---

## Known substitutions / gaps

- **Fonts:** the design system pairs **Literata** (body) with **JetBrains Mono** (headings / chrome / code). Both are OFL, variable, and ship full Finnish diacritic coverage. They are imported from **Google Fonts** for prototyping; vendor the `woff2` files into a `fonts/` folder and swap the `@import` at the top of `colors_and_type.css` for `@font-face` declarations when self‑hosting. `source_styles/typography.css` still reflects the real site's historical Source Serif 4 + IBM Plex Mono stack and is kept for reference only — not a live target.
- **No slide template** — this design system has no `slides/` folder.
- **Shell configs not generated** — `platforms/shell/` (starship.toml, bashrc, zshrc, dircolors) use ANSI color names rather than hex values, so they work with whatever terminal theme is loaded and are not generated from `tokens.json`.

---

## License

MIT — see [`LICENSE`](./LICENSE).
