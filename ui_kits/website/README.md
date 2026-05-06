# Website UI kit

Click-thru recreation of a personal site as a React prototype, using the Jylhis design system tokens. Generic placeholder copy throughout — fork and replace with your own.

## Files
- `index.html` — interactive prototype: home → notes list → note detail → projects list → project detail → resume → 404. Includes Tweaks panel (palette + light/dark).
- `Header.jsx` — wordmark lockup + maker's-mark rune + breadcrumb + search trigger + theme toggle.
- `Footer.jsx` — dashed rules, 4-column nav, rune identity strip, colophon.
- `Primitives.jsx` — `TagList`, `StatusBadge`, `DividerLabeled`, `ManHeader`, `FormattedDate`, `CodeBlock`.
- `Pages.jsx` — `HomePage`, `NotesPage`, `NoteDetail`, `ProjectsPage`, `ProjectDetail`, `ResumePage`, `NotFoundPage`.

## Tweaks
The Tweaks panel switches **light / dark**. There is only one palette:
the warm copper-on-paper Jylhis design system. Syntax highlights inside
code blocks are drawn from **Emacs Modus** (Operandi light / Vivendi dark)
so code looks identical in the browser, in the editor, and in the terminal.

## Gaps
- Search overlay is stubbed (button alerts). In the real site, `/` opens an Orama-powered overlay.
- Data viz pieces in `/craft` (D3 bar chart, Three.js icosahedron) are not recreated.
- Dark-mode FOUC prevention script is replaced by React state.
