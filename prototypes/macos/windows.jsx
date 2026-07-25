/* global React */
/* windows.jsx — macOS windows reskinned in the Jylhis language.
 * Traffic-light chrome, flat fills, and a bronze hairline border when
 * focused (the bridge to the TUI desktop's `.win.focused`). All presentational;
 * app.jsx owns focus + position state.
 */

// ── Traffic lights ──
function Lights({ onClose }) {
  return (
    <div className="lights" title="close · minimise · zoom">
      <span className="lt close" onClick={onClose}>✕</span>
      <span className="lt min">－</span>
      <span className="lt zoom">＋</span>
    </div>
  );
}

// ── Generic window shell ──
function Win({ id, title, sub, focused, style, plainTitle, onFocus, onClose, titleExtra, children }) {
  return (
    <div
      className={`win ${focused ? 'focused' : ''} ${plainTitle ? 'plain-title' : ''}`}
      style={style}
      data-screen-label={`window-${id}`}
      onMouseDown={() => onFocus(id)}
    >
      <div className="titlebar">
        <Lights onClose={(e) => { e.stopPropagation(); onClose(id); }} />
        {titleExtra}
        <span className="tb-title">{title}{sub && <span className="tb-sub"> · {sub}</span>}</span>
      </div>
      <div className="win-body">{children}</div>
    </div>
  );
}

// ── Finder ──
const FINDER_SIDE = [
  { grp: 'Favourites' },
  { ic: '◷', lb: 'Recents' },
  { ic: '⊞', lb: 'Applications' },
  { ic: '▢', lb: 'Desktop' },
  { ic: '▤', lb: 'Documents' },
  { ic: '↓', lb: 'Downloads' },
  { grp: 'Locations' },
  { ic: '◆', lb: 'jylhis', sel: true, accent: true },
  { ic: '⊟', lb: 'Macintosh HD' },
  { ic: '◍', lb: 'Network' },
  { grp: 'Tags' },
  { tag: 'var(--color-accent)', lb: 'bronze' },
  { tag: 'var(--color-syntax-string)', lb: 'olive' },
  { tag: 'var(--color-syntax-tag)', lb: 'slate' },
];

const FINDER_FILES = [
  { nm: 'jylhis-site', kind: 'dir', ic: '▸', dt: 'Today, 08:41', sz: '—', ty: 'Folder' },
  { nm: 'design-system', kind: 'dir', ic: '▸', dt: 'Yesterday, 17:03', sz: '—', ty: 'Folder' },
  { nm: 'desktop-tui', kind: 'dir', ic: '▸', dt: '28 May, 11:55', sz: '—', ty: 'Folder' },
  { nm: 'notes', kind: 'dir', ic: '▸', dt: 'Today, 07:20', sz: '—', ty: 'Folder' },
  { nm: 'astro.config.mjs', kind: 'file', ic: '◦', dt: 'Today, 08:39', sz: '1.4 KB', ty: 'JS Module', sel: true },
  { nm: 'flake.nix', kind: 'file', ic: '◦', dt: '27 May, 22:14', sz: '892 B', ty: 'Nix Source' },
  { nm: 'justfile', kind: 'file', ic: '◦', dt: 'Today, 08:02', sz: '410 B', ty: 'Justfile' },
  { nm: 'tokens.json', kind: 'file', ic: '◦', dt: 'Yesterday, 09:18', sz: '11 KB', ty: 'JSON' },
  { nm: 'build.sh', kind: 'exe', ic: '▸_', dt: '29 May, 19:48', sz: '2.1 KB', ty: 'Shell Script' },
  { nm: 'README.md', kind: 'file', ic: '◦', dt: 'Today, 08:40', sz: '6.0 KB', ty: 'Markdown' },
];

function Finder({ id, focused, style, onFocus, onClose, onOpenSearch }) {
  return (
    <Win id={id} title="jylhis" focused={focused} style={style}
      onFocus={onFocus} onClose={onClose}
      titleExtra={
        <>
          <span className="tb-nav"><span>‹</span><span>›</span></span>
          <span className="tb-spacer"></span>
          <span className="tb-tools">
            <span className="seg">
              <b>▦</b><b className="on">≣</b><b>◫</b><b>⊞</b>
            </span>
            <span className="tb-search" onClick={(e) => { e.stopPropagation(); onOpenSearch && onOpenSearch(); }}>⌕ Search</span>
          </span>
        </>
      }
    >
      <div className="finder-side">
        {FINDER_SIDE.map((r, i) => (
          r.grp ? <div key={i} className="grp">{r.grp}</div> :
          <div key={i} className={`side-row ${r.sel ? 'sel' : ''}`}>
            {r.tag
              ? <span className="tagdot" style={{ background: r.tag }}></span>
              : <span className="ic" style={r.accent ? { color: 'var(--color-accent)' } : null}>{r.ic}</span>}
            <span className="lb">{r.lb}</span>
          </div>
        ))}
      </div>
      <div className="finder-main">
        <div className="finder-list">
          <div className="fl-head">
            <span>Name</span><span>Date Modified</span><span>Size</span><span>Kind</span>
          </div>
          {FINDER_FILES.map((f) => (
            <div key={f.nm} className={`fl-row ${f.kind} ${f.sel ? 'sel' : ''}`}>
              <span className="nm"><span className="ic">{f.ic}</span><span className="t">{f.nm}</span></span>
              <span className="c">{f.dt}</span>
              <span className="c">{f.sz}</span>
              <span className="c">{f.ty}</span>
            </div>
          ))}
        </div>
        <div className="finder-foot">
          <div className="path">
            <span className="frag">◆ jylhis</span><span className="frag">›</span>
            <span className="frag">projects</span><span className="frag">›</span>
            <span className="here">jylhis</span>
          </div>
          <span className="count">10 items · 561 GB available</span>
        </div>
      </div>
    </Win>
  );
}

// ── Notes window — the one place prose runs in the grotesk body face ──
function Notes({ id, focused, style, onFocus, onClose }) {
  return (
    <Win id={id} title="desktop-notes" sub="iCloud" plainTitle focused={focused} style={style}
      onFocus={onFocus} onClose={onClose}
      titleExtra={<span className="tb-spacer"></span>}
    >
      <div className="win-body notes-body">
        <div className="notes-toolbar">
          <span className="tool">⊞ Aa</span>
          <span className="tool">☰</span>
          <span className="tool">☑ Checklist</span>
          <span className="tool">⊞ Table</span>
          <span className="spacer"></span>
          <span className="tool">⤢ Share</span>
        </div>
        <div className="notes-sheet">
          <div className="meta">edited just now · ~/projects/notes/theming.md</div>
          <h1>Theming macOS in the Jylhis language</h1>
          <p>The trick isn't to fight the platform — it's to <span className="accent">strip the gloss</span> and let the bones show. Keep the menu bar, keep the Dock, keep the traffic lights. Then replace every gradient and shadow with a single hairline, and every system font with the mono.</p>
          <div className="check done"><span className="box">☑</span><span>cool sheet / field grounds, one bronze accent</span></div>
          <div className="check done"><span className="box">☑</span><span>IBM Plex Mono for chrome, Hanken Grotesk for prose</span></div>
          <div className="check"><span className="box">☐</span><span>focused window borrows the bronze border from the TUI desktop</span></div>
          <div className="check"><span className="box">☐</span><span>traffic lights reuse the err / warn / ok status palette</span></div>
          <p>What you're reading right now is set in Hanken Grotesk — the only surface on the whole desktop that isn't monospace. That contrast <span className="accent">is</span> the system.</p>
        </div>
      </div>
    </Win>
  );
}

Object.assign(window, { Win, Lights, Finder, Notes });
