# Website UI kit

Click-thru recreation of a personal site as a React prototype, consuming the Jylhis design system directly: `../../styles.css` (tokens + motion + `components/components.css`) plus thin JSX bridges that mirror the `components/*` markup. Generic placeholder copy throughout — fork and replace with your own.

## Files
- `index.html` — interactive prototype: home → notes list → note detail → projects list → project detail → resume → 404. Includes Tweaks panel (palette + light/dark).
- `header.jsx` — wordmark lockup + DS `Mark` + DS `Breadcrumb` + DS `Button` (search) + theme toggle.
- `footer.jsx` — dashed rules, 4-column nav, DS `Mark` identity strip, colophon.
- `primitives.jsx` — no reimplementation: pulls `Tag`, `TagList`, `StatusBadge`, `CodeBlock`, `CvEntry`, `Callout`, `Breadcrumb`, `Button`, `Kbd`, `Divider`, `ManLabel`, `Mark` from the component JSX files loaded in `index.html` (`window.exports`), plus a page-local `FormattedDate` helper.
- `pages.jsx` — `HomePage`, `NotesPage`, `NoteDetail`, `ProjectsPage`, `ProjectDetail`, `ResumePage`, `NotFoundPage`.

## Tweaks
The Tweaks panel switches **light / dark**. There is only one palette:
the warm copper-on-paper Jylhis design system. Syntax highlights inside
code blocks are drawn from **Emacs Modus** (Operandi light / Vivendi dark)
so code looks identical in the browser, in the editor, and in the terminal.

## Gaps
- Search overlay is stubbed (button alerts). In the real site, `/` opens an Orama-powered overlay.
- Data viz pieces in `/craft` (D3 bar chart, Three.js icosahedron) are not recreated.
- Dark-mode FOUC prevention script is replaced by React state.
