# Jylhis Design System

A design system for **jylhis.com** — the personal site of Markus Jylhänkangas, Senior Software Engineer & DevOps specialist based in Zürich.

The site is personal, technical, and deliberately paper‑like: warm cream backgrounds, a single copper accent, monospace headings, serif body. No frameworks, no gradients, no emoji. Everything is hand‑written CSS.

## Source

- **Codebase (read‑only):** `jylhis.com-main/` (attached via the Import menu)
- **Stack:** Astro 5.x, hand‑written CSS, deployed to Cloudflare Pages
- **Live URL:** https://jylhis.com
- **Key style files mirrored into `source_styles/`:**
  - `global.css` — design tokens + reset + link/skip/utility styles
  - `typography.css` — `@font-face`, font stacks, base scale
  - `content.css` — `.prose` markdown styling
  - `cv.css` — code‑editor line‑numbered CV layout

## Index

| File | What it is |
|---|---|
| `README.md` | This file. Content + visual + iconography foundations. |
| `SKILL.md` | Agent‑Skills‑compatible entry point. |
| `colors_and_type.css` | The CSS variable token set + semantic type helpers. Import into any artifact. |
| `assets/` | Logos, favicon, OG image. |
| `source_styles/` | Verbatim copies of the real site's CSS for reference. |
| `preview/` | Small HTML cards that render on the Design System tab. |
| `ui_kits/website/` | React recreation of the Astro site (home, notes, projects, resume, 404). |
| `tokens.md` | **Canonical palette spec.** Source of truth for every platform-specific file. |
| `platforms/` | Platform-specific theme files — Ghostty, bash/zsh, Hyprland, Waybar, Mako, Rofi, GTK, Kvantum/Qt, Emacs, **Charm TUI (Go)**. |
| `platforms/charm/` | Go package (`jylhis`) for Charm TUIs — palette + pre-built lipgloss styles + themed bubbles + Bubble Tea light/dark detection. Runnable demo under `platforms/charm/demo/`. |
| `platforms/KEYBOARD.md` | Keyboard / accessibility primitives (focus, kbd, command palette, selected item). |
| `platforms/index.html` | Visual overview of every target in light + dark. |

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
  - `--color-accent` `#9a5a2a` (light) / `#e89b5e` (dark) — an accessibility‑tuned darker twin used for links, interactive UI, focus rings, and any accent that carries text meaning. WCAG AA on the paper bg; AAA on dark.
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

- **Fonts:** the design system now pairs **Literata** (body) with **JetBrains Mono** (headings / chrome / code). Both are OFL, variable, and ship full Finnish diacritic coverage. They are imported from **Google Fonts** for prototyping; vendor the `woff2` files into a `fonts/` folder and swap the `@import` at the top of `colors_and_type.css` for `@font-face` declarations when self‑hosting. `source_styles/typography.css` still reflects the real site's historical Source Serif 4 + IBM Plex Mono stack and is kept for reference only — not a live target.
- **No slide template** was provided with the codebase — this design system has no `slides/` folder.
