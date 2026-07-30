# Deep-research validation — spec, design, implementation, and claims

Audit date: 2026-07-27 · Audited at `tokens.json` meta version 1.0.0
(CHANGELOG `[1.0.0] — 2026-07-25`).

> **Status: findings addressed.** The follow-up commits on this branch fix
> the issues below (accent retuned to AAA, Modus 4 re-sync, `jy ❯` mark
> canonized, StatusBadge glyphs, doc rot rewritten, freshness validator and
> `source_styles/` retired, prototypes refactored onto `mocks/` packages,
> hex gate extended repo-wide). This file is kept as the audit record;
> line references are to the tree as audited.

Six parallel audits: documentation consistency, contrast/token pipeline,
Modus palette fidelity, components library, platform targets + Nix + CI,
and external/live-site claims. Every finding below carries file:line
evidence; contrast ratios were recomputed independently with WCAG 2.1
relative luminance, and upstream Modus sources (current `main` plus the
v3.0.0 release) were fetched for the fidelity check.

## Verdict at a glance

| Area                                                | Verdict                                                                                     |
| --------------------------------------------------- | ------------------------------------------------------------------------------------------- |
| Token pipeline (`generate.mjs --check`, 66 files)   | **Holds** — byte-in-sync, all six validators exit 0                                         |
| Contrast claims (body AAA, muted AA, pairs)         | **Holds** — every enforced number is true, with real margin                                 |
| Accent "AAA-tuned" (DESIGN.md)                      | **False for Sheet** — 6.28:1 is AA; README's "AA Sheet / AAA Field" is the accurate wording |
| Modus "verbatim / pixel-for-pixel"                  | **Overstated** — light palette frozen at Modus v3; several custom values                    |
| Components (20, triples, tokens-only CSS)           | **Holds** — with StatusBadge and one syntax-token misuse as exceptions                      |
| Platforms + Nix + CI                                | **Holds** — builds clean; docs undersell/omit 12 generated targets                          |
| Live-site dogfooding                                | **Holds** — jylhis.com is fully on v2; consumers are real                                   |
| `source_styles/` "verbatim copies of the real site" | **False** — stale v1 snapshot, 0/39 hex overlap with live CSS                               |
| Freshness validator                                 | **Broken** — its hardcoded URLs 404 on the live site; can only exit 2                       |
| Documentation self-consistency                      | **Weakest area** — 40+ contradictions, mostly v1 remnants                                   |

The system's mechanical spine is genuinely sound: what the validators
enforce is true, and what CI gates cannot drift. Nearly every defect
found lives in prose that no validator reads.

## 1. Verified claims (load-bearing)

- **Pipeline.** `bun scripts/generate.mjs --check` passes (66 generated
  files in sync). All six static validators pass: tokens (43 roles, 28
  explicit + 48 swept + 14 pairing + 4 ANSI-fg + 4 TTY + 60 tint + 4
  modeline-sep checks), a11y-html (61 files), a11y-css (6 files),
  cli-conventions (8 scripts), emacs-faces (245 faces / 32 groups),
  preview-hex (55 files). `.github/workflows/validate.yml:30-43` runs
  `--check` plus all six on push/PR (caveat: `paths-ignore: "**/*.md"`).
- **Contrast (recomputed independently).** Body 14.22:1 Sheet / 13.68:1
  Field (AAA); heading 17.30 / 17.41 (AAA); muted 6.50 / 7.29 (clears
  AA; Field is in fact AAA). Status on `bg` ≥ 6.11 both editions; status
  on their own tints ≥ 5.14 (≥ 4.5 floor); body on every tint ≥ 11.2.
- **Paired-Foreground Rule.** `tokens.json:194-202` `pairs` has exactly
  the seven documented surfaces; all 14 pairings pass; `generate.mjs`
  emits every `--color-<surface>-foreground` var
  (`tokens.css:51-57,165-171`); enforced at
  `validate-tokens.mjs:243-257`.
- **"A role below its floor does not print"** is mechanically true for
  every role with a declared floor: failures `process.exit(1)` and CI
  runs the validator on every push. (Not universal — see 3.6.)
- **Components.** Exactly 20 directories, every `<Name>.jsx` +
  `<Name>.d.ts` + `card.html` triple present. `components.css`: zero raw
  hex, zero shadow/gradient/backdrop-filter, radii capped at 4px, no
  pill misuse. Alert, Callout, Modal, Field, and Tabs match their specs
  (Tabs: real roving tabindex + Arrow/Home/End). No emoji anywhere
  (codepoint scan). `docs/components/*.md` are genuinely generated from
  the `.d.ts` + `card.html` + `.jsx` (parser at
  `scripts/generate.mjs:2695-2735`), and `--check` proves freshness.
- **Platforms.** Every target in CLAUDE.md's table exists;
  `platforms/charm` and `platforms/mcp` both `go build && go vet` clean;
  MCP server is stdlib-only with exactly the five tools
  `docs/INTEGRATION.md:505-535` documents; Emacs palettes carry the
  three tiers (GUI hex / `color-NNN` / ANSI name) per role; ANSI 11 is
  the bronze accent in tokens.json, Ghostty, and the Emacs palettes.
- **Nix.** `project.nix` is pure data; `package.nix` checks
  (`generated`, `validate`) match the declarations; `default.nix` is the
  flakeless entry via `kit/lib/pkgs.nix`; all 12 `.nix` files parse;
  `nix/{ghostty,emacs,themes}.nix` do what their descriptions say.
- **Dogfooding is real, not aspirational.**
  `kit/lib/shared-modules.nix:55` overlays `jylhis-design-src`;
  `hosts/markus/default.nix:108` pins the Ghostty sheet/field themes;
  `hosts/finthai-pro/default.nix:159` derives its stylix palette from
  `tokens.json`; public Jylhis/jotain and Jylhis/marchyo consume the
  themes; the Jylhis/design projection repo exists and was updated
  2026-07-26; `just publish` exists (`just/publish.just:13`).
- **Live site.** jylhis.com is up, on Cloudflare, Astro-built, loading
  exactly Zilla Slab + Hanken Grotesk + IBM Plex Mono, and its CSS
  custom properties match v2 tokens (bg `#f6f8fb`/`#0d0f14`, accent,
  hover, brand, borders, surfaces all verified). The "production site
  updated on every release" claim is current.
- **Fonts.** 16 `@font-face` blocks ↔ 16 woff2 files, weights match the
  docs, latin ranges cover Finnish diacritics, all three OFL license
  files present.
- **Version sync.** tokens.json 1.0.0 == project.nix 1.0.0 == CHANGELOG
  1.0.0. Showcase `index.html` reads the version and swatches
  dynamically from `tokens-data.js`; all 50+ local links resolve.

## 2. False or broken claims (high severity)

1. **Freshness validator cannot work.**
   `scripts/validate-consumer-freshness.mjs:98-109` diffs
   `https://jylhis.com/global.css` and `.../typography.css` — both
   **404** (the live site ships one hashed Astro bundle,
   `/_astro/BaseLayout.*.css`). The drift gate always exits 2; it can
   neither pass nor fail. README.md:140's "runs on a separate weekly
   schedule" is also false in this tree — no scheduled workflow exists
   in `.github/workflows/`.
2. **`source_styles/` are not "verbatim copies of the real site's CSS"
   (README.md:98).** They are a v1 snapshot: warm palette
   (`#faf7f2`/`#1a1714`, accent `#b5703c`) with **0 of 39** hex values
   surviving in the live bundle. README.md:321 also misdescribes the
   historical stack as "Source Serif 4 + IBM Plex Mono" —
   `source_styles/typography.css:9-29` actually uses **Literata +
   JetBrains Mono**. (`source_styles/README.md` honestly says
   "snapshot"; the root README does not.)
3. **README.md "VISUAL FOUNDATIONS" (:230-291) and "ICONOGRAPHY"
   (:294-315) are wholesale v1 remnants** presented as current: text
   `#1e1b18`/`#2c2825` (v2: `#12141a`/`#23262e`), brand `#b5703c` (v2:
   `#b5450e`), browns/taupes `#d5cec4`/`#c4baa8`/`#8a7f72` (v2 cool:
   `#cfd6de`/`#7f8fb5`/`#878c95`), `accent-subtle rgba(181,112,60,.12)`
   (v2: `rgba(138,77,0,.12)`), accent used for "code-string quotes"
   (violates the Accent-Is-Not-Code rule and README's own :243), the
   retired 3px "currently" side-stripe (:264), spacing scale missing the
   0.5.0 `2xs` step (:247), and "one warm light, one warm dark" /
   "single-accent and warm" (:20, :23) against the cool v2 thesis.
   CHANGELOG.md:77-79's "all are now in sync" claim is therefore false.
4. **The maker's mark has three conflicting canonical definitions.**
   README.md:296: hand-drawn Nordic rune in accent color; DESIGN.md:424:
   benchmark △ in ◯ in vermilion; docs/STYLE-GUIDE.md:149: "the mark is
   the prompt: `jy ❯` — pure type" (which also contradicts
   ENGINEERING_PRINCIPLES.md:47 "the only bespoke SVG is the maker's
   mark"). Additionally `assets/favicon.svg` bakes v1 copper `#B5703C`
   while the live site's favicon bakes v2 vermilion `#B5450E` — the repo
   asset is one generation behind its own brand-guidelines skill.
5. **"Verbatim Modus / pixel-for-pixel with an Emacs session"
   (README.md:20,243; DESIGN.md:261-264; docs/ACCESSIBILITY.md:68) is
   overstated.** Field (Vivendi): 7/9 syntax tokens verbatim. Sheet
   (Operandi): only 4/9 verbatim against current Modus — `syn-keyword`
   `#5317ac`, `syn-string` `#2544bb`, `syn-type` `#005a5f` are **Modus
   v3 values changed upstream in Modus 4.0 (2023)** (now `#531ab6`,
   `#3548cf`, `#005f5f`); `syn-variable` `#0044aa`, `syn-docstring`
   `#2a5a3a`, and dark `syn-number` `#79bbff` appear in **no** Modus
   release; all four **Field status colors are custom-toned**
   (tokens.json admits "toned"; README.md:243 doesn't). Internal
   inconsistency: ANSI 12/13 use _current_ Modus v4 values while the
   syntax tokens use v3 ones, so terminal-ANSI syntax ≠ GUI syntax
   within the system's own targets — against the "code is identical
   everywhere" premise. Also, Modus renders numbers in `fg-main`, not
   blue, so the `syn-number` face mapping is not a Modus behavior.
6. **"AAA by construction" (DESIGN.md:198) and "AAA-tuned" accent
   (DESIGN.md:219) are not what ships.** Accent on Sheet is **6.28:1 =
   AA** (README.md:239 and docs/ACCESSIBILITY.md:8 state this
   correctly); `syn-comment` measures 6.58:1 Sheet / 6.81:1 Field
   (below AAA — Modus's 7:1 was tuned against pure white/black, and the
   cool grounds shave ~6-8% off every ratio); `status-ok`/`status-info`
   light are 6.62/6.64. The validator honestly enforces AA (4.5) for
   these — enforcement is right, the adjective is wrong.
   docs/ACCESSIBILITY.md never acknowledges the ground-shift caveat.
7. **Phantom GitHub Pages deploy.** WAY_OF_WORKING.md:91-93 ("GitHub
   Pages auto-deploys from `main` via `.github/workflows/pages.yml`,
   confirm at jylhis.github.io/design") and PRODUCT.md:128 describe a
   workflow that does not exist; CLAUDE.md:39 correctly says Cloudflare
   and no Pages workflow. `scripts/serve-pages.sh` log text still says
   "GitHub Pages artifact".
8. **PRODUCT.md:158 says "Currently `0.5.0`"** while everything else is
   at 1.0.0, and **CHANGELOG.md:179's link block still ends at v0.5.0**
   — the `[1.0.0]` section heading has no compare link, contradicting
   the repo's own release process (WAY_OF_WORKING.md:80-82).
9. **StatusBadge contradicts DESIGN.md:392-393** ("always with the glyph
   - word"): `StatusBadge.d.ts:4` declares it "glyph-free" and the JSX
     renders word only (the a11y validator deliberately exempts chips, so
     meaning-not-by-color-alone still holds — but the spec and the
     implementation disagree). Worse, the `experimental` variant uses
     `--color-syntax-keyword` (`components.css:137-139`) — a Modus syntax
     token repurposed for UI, directly against "never repurposed for UI"
     (DESIGN.md:263, tokens.json:29).
10. **motion.css ships a non-token duration.** motion.css:7-8 promises
    "no new durations"; motion.css:73 animates the readout at **420ms**
    — precisely the retired v1 `spring` duration CHANGELOG.md:38 says
    was retimed to 480ms. DESIGN.md:365 ("mapped to four tokens") is
    contradicted; docs/STYLE-GUIDE.md:128 documents the stray literal.

## 3. Documentation drift (medium severity)

1. **Validator count is stated four different ways.** Ground truth: six
   static validators + `generate --check` in CI. README.md:140 says
   five (its index table :76-81 omits emacs-faces and preview-hex);
   ENGINEERING_PRINCIPLES.md:65 says five but lists four;
   docs/ACCESSIBILITY.md:20 says five; AGENTS.md:44 says four;
   docs/CLI-TUI-GUIDELINES.md:398 lists four. CLAUDE.md and
   WAY_OF_WORKING.md are correct.
2. **CLAUDE.md's generated-files table omits 12 targets** that
   `generate.mjs:3025-3069` emits: hyprlock ×2, waybar
   `style-sheet.css`, mako `config-sheet`, base16 ×2, `shell/fzf-*.sh`
   ×2, bat `.tmTheme` ×2, console `.nix` ×2, plymouth ×4. README's
   architecture tree (:47-56) likewise lists only 10 platform dirs
   while disk has 21+.
3. **CLAUDE.md:93-95 "no flakes"** contradicts the project's own
   `flake.nix`/`flake.lock`, which docs/INTEGRATION.md:9 calls the
   _preferred_ consumption path, and which the justfile `build` recipe
   depends on. `nix/` holds 8 files, not the 3 listed.
4. **README.md:85 "shell/ … hand-authored" is a half-truth** —
   `fzf-{sheet,field}.sh` in that directory are generated and full of
   hex; the four named files (starship, bashrc, zshrc, dircolors) are
   indeed hex-free ANSI as claimed.
5. **DESIGN.md:201-202 names "Spline Sans Mono"** as the third type role
   — a font that appears nowhere else in the repo (everything else,
   including the same file's frontmatter and :296, says IBM Plex Mono).
6. **DESIGN.md:31 frontmatter `syn-docstring: "#2a5045"`** vs tokens.json
   `#2a5a3a` — the only frontmatter/tokens mismatch out of 29 hexes.
7. **Enforcement boundary is narrower than the prose.** Roles with no
   declared floor (border, border-strong, decorator, contour-on-surface,
   the keyword-tint chip) are asserted, not checked; tint checks blend
   over `bg` only; `validate-preview-hex.mjs` scans only `preview/` and
   `card.html` — `index.html` (raw `#8a4d00` at :535), `palette.html`,
   `md.html`, `font_options.html`, and `prototypes/**` are ungoverned.
8. **docs/INTEGRATION.md carries v1 leftovers**: greeter table
   (:467-475) ships eight retired hexes (`#faf7f2`, `#2c2825`,
   `#8a7f72`, …) violating the no-hex-duplication rule with dead
   values; :100-103 claims fonts come from Google Fonts with an
   `@import` to swap — self-hosting has already shipped
   (`colors_and_type.css:18-19`, `fonts.css`).
9. **docs/ACCESSIBILITY.md v1 remnants and overstatements**: :9
   "warm-earth-toned" and :116 "warm-earth aesthetic" (v1 language
   contradicting its own :66); :102 "body clears 14:1 on both modes"
   (Field is 13.68); :7 text-faint "AA-safe for incidental text" (3.18:1
   is AA-Large only); its "what we measure" table lists 7 of the 28
   enforced checks (understated, not false).
10. **platforms/KEYBOARD.md drift**: :21 quotes v1 copper contrast
    numbers (5.1/7.9 vs actual 6.28/8.64); :39 specs a `box-shadow` on
    the kbd chip (implementation avoids it via 2px bottom border;
    exemption recorded only in docs/REVIEW.md); :70 hardcodes pure-black
    `rgba(0,0,0,…)` backdrops despite the `scrim` token and the
    Never-Pure rule.
11. **Stale scope/identity lines**: WAY*OF_WORKING.md:131 rules out "a
    sans-serif body" (v2's body \_is* sans-serif; PRODUCT.md:92 retires
    that rule); ENGINEERING*PRINCIPLES.md:82 "one type pair" (v2 is a
    triad) and :34 lists "status" among accent uses (status is never the
    accent); root SKILL.md:22 labels the platform files "hand-maintained"
    (they're generated). The \_deployed* copy of the jylhis-design skill
    still advertises v1 vocabulary ("warm paper, copper accent,
    monospace headings, serif body").
12. **docs/REVIEW.md:218-221** references
    `prototypes/_shared/colors_and_type.css`, which no longer exists
    (brutal-neu.html links the root file).
13. **dependabot.yml** covers github-actions only — the two Go modules
    (`platforms/charm`, `platforms/mcp`) have no update coverage.
    `sonar-project.properties` is wired to nothing in-repo (external
    SonarCloud scanner config; `.sonarcloud.properties` self-documents
    the split).

## 4. Minor implementation drift

- Button label size: DESIGN.md says "label size" (0.75rem/scale-8);
  `components.css:11` uses scale-6 (0.85rem). Ghost text uses
  `--color-text`, frontmatter says `text-heading`. Tag uses scale-7,
  DESIGN.md:390 says scale-8.
- `components.css:450` styles the table head rule with
  `var(--border-focus)` (the 2px focus width token) — semantic misuse;
  `.ds-kbd`'s 2px bottom border is a kept deviation recorded in
  docs/REVIEW.md.
- Four non-`ds-` child classes `.k .b .v .c`
  (`components.css:352-355`), scoped under a ds- parent.
- ProjectCard: the focus ring is on a title link, not a "wrapping
  `<a>`" as DESIGN.md:397-398 words it (spirit holds, letter doesn't).
- `Field.jsx`/`Modal.jsx`/`Tabs.jsx` use `React.*` without importing
  React — valid in the UMD card/prototype runtime, not portable as ES
  modules.
- `prototypes/brutal-neu.html` + `prototypes/hybrid.css` are v1
  exploration artifacts with 36 shadow/gradient occurrences, pure
  `#ffffff`/`#000000`, and off-palette hexes; docs/REVIEW.md documents
  them as intentional mockups but no README in `prototypes/` says so.
  `tablet.css`, `macos.css`, `desktop.css`, `_shared/tweaks-panel.jsx`
  also carry off-palette hex (all outside validator scope by design).
- `prototypes/web/index.html` uses `linear-gradient` as an animated link
  underline (single color — the banned property name, not a visual
  gradient) and `border-radius: 50%` on the theme toggle.
- `bg` on `accent-hover` (light) passes its 4.5 floor at **4.61** —
  the tightest margin in the system; a small lightening of `#a75f0a`
  breaks the build.
- README.md:29 "Astro 5.x, … Cloudflare Pages": the live page has no
  generator meta (5.x unverifiable) and headers prove only "Cloudflare";
  the Jylhis/design projection repo carries a `github-pages` topic.
- The 1100px right-rail collapse (README.md:247, STYLE-GUIDE.md:99) is
  not a breakpoint token and appears in no CSS.

## 5. Recommended fixes, in order

1. Rewrite README.md "VISUAL FOUNDATIONS"/"ICONOGRAPHY" (and :20, :23,
   :140) against v2 tokens; fix the INTEGRATION.md greeter table and
   Google-Fonts paragraph; purge "warm-earth" from ACCESSIBILITY.md.
2. Point `validate-consumer-freshness.mjs` at the real live CSS bundle
   (or fetch the page and resolve the hashed href), and either add the
   weekly workflow or drop the claim; refresh `source_styles/` to an
   actual current snapshot and fix its README description.
3. Pick one maker's mark definition; regenerate `assets/favicon.svg`
   with the v2 color.
4. Decide the Modus stance: either re-sync Sheet syntax to Modus v4
   values (also fixing the ANSI 12/13 vs syn-token mismatch) or soften
   "verbatim / pixel-for-pixel" to "grounded in Modus v3, toned".
   Replace "AAA by construction" / "AAA-tuned" with the honest AA/AAA
   split the validator enforces.
5. Reconcile StatusBadge with DESIGN.md (glyph-free chips are fine —
   update the spec) and give `experimental` a non-syntax color.
6. Retime the readout idiom to 480ms (or add a token).
7. Sweep the version/deploy drift: PRODUCT.md 0.5.0, CHANGELOG 1.0.0
   compare link, WAY_OF_WORKING/PRODUCT GitHub Pages sections,
   serve-pages.sh log text.
8. Normalize the validator count everywhere to six (+ freshness); update
   CLAUDE.md's generated-files table and "no flakes" note; fix
   DESIGN.md's "Spline Sans Mono" and `syn-docstring` frontmatter hex.
9. Consider extending `validate-preview-hex.mjs` to `index.html` and the
   other root HTML pages, and adding `gomod` to dependabot.
