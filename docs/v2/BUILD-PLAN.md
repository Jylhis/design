# v2 "The Survey" — build plan

Branch: `v2-survey`. Direction locked; palette final (Modus-lean, cool,
tritanopia-checked). This plan sequences the engineering migration so the
validator gauntlet stays green at every step. Nothing is committed until you ask.

## Phase 0 — Record the decision  ✅ done
- `DESIGN.md` rewritten to The Survey world (Sheet/Field, palette, type, motion,
  components, direction contract).
- `PRODUCT.md` brand sections updated (name/world, palette, type, mark, voice,
  lineage, principles) — product truth and invariants preserved.
- North-star reference captured in `docs/v2/reference/` (final comp + screenshots).

## Phase 1 — `tokens.json` (the single source)  ✅ done
- Rewrite the palette per role with **Sheet + Field** values (was Paper/Roast):
  grounds, ink, hairlines, `accent` (bronze), `accent-hover`, `benchmark`
  (vermilion), `contour` + `contour-faint` (Modus blue), status (Modus toned),
  Modus syntax (Operandi/Vivendi). Retire copper.
- Type: three roles (Zilla Slab / Hanken Grotesk / IBM Plex Mono); keep the
  10-step scale (rebased top steps), spacing grid, radii.
- Motion: replace ink-draw idioms with `contour-draw` / `line-extend` / `readout`
  + `fast/base/slow/survey` durations.
- ANSI: slot 11 → bronze accent (was copper).
- Update `contrastRequirements` (AAA body / AA muted) and group names
  (Paperstock→Grounds, Ink, Copper→Bronze, Linen→Line, Modus, Signal,
  Spectrum).
- Gate: `bun scripts/validate-tokens.mjs` green (schema + WCAG + var() resolution).

## Phase 2 — generation (`scripts/generate.mjs`)  ✅ done
- Rename theme keys `paper→sheet`, `roast→field` across emitted targets and file
  names (`jylhis-{sheet,field}`). **Decided: full rename.** `sheet`/`field` are
  now the identifiers in filenames, Nix options, Go `Mode` constants, and Emacs
  theme names; `Sheet`/`Field` are the display names.
- Regenerate all ~30 targets; update the Emacs face spec list + `face-manifest.json`
  in lock-step; ANSI-11 → bronze everywhere.
- Gate: `bun scripts/generate.mjs` then `--check` clean; `validate-emacs-faces`,
  `validate-preview-hex` green.

## Phase 3 — hand-authored CSS  ✅ done
- `fonts.css`: self-hosted `@font-face` for Zilla Slab (display), Hanken Grotesk
  (UI/body), IBM Plex Mono (data/code) (latin/latin-ext, `unicode-range`),
  replacing Literata/JetBrains Mono.
- `colors_and_type.css`: new font stacks + type helpers (`.ds-display`,
  `.ds-title`, `.ds-body`, `.ds-label`, `.ds-code`), interaction baseline.
- `motion.css`: `.ds-contour-draw`, `.ds-line-extend`, `.ds-readout`, reduced-motion
  guard.
- Gate: `validate-a11y-css` green.

## Phase 4 — components  ◐ partial — Plate / Legend / Benchmark components not yet built
- Restyle `components/components.css` to new roles; add **Plate**, **Legend**,
  **Benchmark** (maker's mark); update StatusBadge (glyph+word), Callout (`// note`),
  Terminal (bronze prompt). Update `.d.ts`/`card.html` specimens.
- Gate: `validate-a11y-html`, `validate-preview-hex` green.

## Phase 5 — showcase + prototypes  ◐ partial — prototypes/ still carry v1 defaults
- New `index.html` Survey showcase (promote `docs/v2/reference/survey-showcase-comp.html`
  to production, tokens-driven, full sections). Update `preview/` and `prototypes/`.
- Inspect desktop + mobile in Playwright; fix; re-inspect.

## Phase 6 — validators + docs  ✅ done
- Update `docs/ACCESSIBILITY.md` (tritanopia editions, Modus grounding),
  `STYLE-GUIDE.md` (motion), `VOICE.md` (surveyor register), `INTEGRATION.md`.
- Refresh the impeccable design sidecar (`.impeccable/design.json`) to the new world.

## Phase 7 — release + dogfood  ◐ in progress
- Version bump + `CHANGELOG.md` (v2 is a major, breaking downstream pins by design).
- Dogfood the generated targets against jylhis.com, Jotain, Marchyo, nacutils,
  creative tooling, phone.
- Run the shipped `impeccable-finish-reviewer` against the built showcase.

## Optional (bonus, not blocking)
- Tritanopia / deuteranopia editions alongside Sheet/Field, following Modus.
