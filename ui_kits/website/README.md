# Jylhis website UI kit

Click-thru recreation of [jylhis.com](https://jylhis.com) (Astro 5.x) as a React prototype. Visuals lifted 1:1 from `src/styles/*.css` and `src/components/*.astro`.

## Files
- `index.html` — interactive prototype: home → notes list → note detail → projects list → project detail → resume → 404. Includes Tweaks panel (palette + light/dark).
- `Header.jsx` — wordmark lockup + maker's-mark rune + breadcrumb + search trigger + theme toggle.
- `Footer.jsx` — dashed rules, 4-column nav, rune identity strip, colophon.
- `Primitives.jsx` — `TagList`, `StatusBadge`, `DividerLabeled`, `ManHeader`, `FormattedDate`, `CodeBlock`.
- `Pages.jsx` — `HomePage`, `NotesPage`, `NoteDetail`, `ProjectsPage`, `ProjectDetail`, `ResumePage`, `NotFoundPage`.

## Tweaks
The Tweaks panel switches palette between:
- **Jylhis** — original warm copper-on-paper palette (with light/dark subtoggle).
- **Modus Operandi** — Emacs Modus light palette (AAA contrast, Modus blue `#0000c0` as accent).
- **Modus Vivendi** — Emacs Modus dark palette (vivid semantic colors over near-black).

## Gaps
- Search overlay is stubbed (button alerts). In the real site, `/` opens an Orama-powered overlay.
- Data viz pieces in `/craft` (D3 bar chart, Three.js icosahedron) are not recreated.
- Dark-mode FOUC prevention script is replaced by React state.
