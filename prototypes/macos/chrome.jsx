/* global React */
/* chrome.jsx — menu bar (Apple/Jylhis menu + app menus + right-side status),
 * the Dock, and Spotlight. Reskinned in mono chrome; bronze accent on active.
 */

// ── Menu bar dropdown definitions ──
const APPLE_MENU = [
  { label: 'About This Mac', k: '' },
  { sep: true },
  { label: 'System Settings…', k: '' },
  { label: 'App Store…', k: '' },
  { sep: true },
  { label: 'Sleep', k: '' },
  { label: 'Restart…', k: '' },
  { label: 'Shut Down…', k: '' },
  { sep: true },
  { label: 'Lock Screen', k: '⌃⌘Q' },
  { label: 'Log Out jylhis…', k: '⇧⌘Q' },
];
const APP_MENUS = {
  Finder: [
    { label: 'About Finder', k: '' },
    { sep: true },
    { label: 'Settings…', k: '⌘,' },
    { sep: true },
    { label: 'Empty Bin…', k: '⇧⌘⌫' },
    { label: 'Hide Finder', k: '⌘H' },
  ],
  File: [
    { label: 'New Finder Window', k: '⌘N' },
    { label: 'New Folder', k: '⇧⌘N' },
    { label: 'New Smart Folder', k: '' },
    { sep: true },
    { label: 'Open', k: '⌘O' },
    { label: 'Move to Bin', k: '⌘⌫' },
    { sep: true },
    { label: 'Get Info', k: '⌘I' },
  ],
  Edit: [
    { label: 'Undo', k: '⌘Z' },
    { label: 'Redo', k: '⇧⌘Z' },
    { sep: true },
    { label: 'Cut', k: '⌘X' },
    { label: 'Copy', k: '⌘C' },
    { label: 'Paste', k: '⌘V' },
    { label: 'Select All', k: '⌘A' },
  ],
  View: [
    { label: 'as Icons', k: '⌘1' },
    { label: 'as List', k: '⌘2', mark: true },
    { label: 'as Columns', k: '⌘3' },
    { label: 'as Gallery', k: '⌘4' },
    { sep: true },
    { label: 'Show Path Bar', k: '⌥⌘P' },
    { label: 'Hide Sidebar', k: '⌃⌘S' },
  ],
  Go: [
    { label: 'Recents', k: '⇧⌘F' },
    { label: 'Documents', k: '⇧⌘O' },
    { label: 'Desktop', k: '⇧⌘D' },
    { label: 'Home', k: '⇧⌘H' },
    { sep: true },
    { label: 'Connect to Server…', k: '⌘K' },
  ],
  Window: [
    { label: 'Minimise', k: '⌘M' },
    { label: 'Zoom', k: '' },
    { sep: true },
    { label: 'Bring All to Front', k: '' },
  ],
  Help: [
    { label: 'Search', k: '' },
    { label: 'macOS Help', k: '' },
  ],
};
const APP_MENU_ORDER = ['Finder', 'File', 'Edit', 'View', 'Go', 'Window', 'Help'];

function MenuDrop({ items, left }) {
  return (
    <div className="mb-menu" style={{ left }} onMouseDown={(e) => e.stopPropagation()}>
      {items.map((r, i) => (
        r.sep ? <div key={i} className="sep" /> :
        <div key={i} className={`row ${r.disabled ? 'disabled' : ''}`}>
          <span>{r.mark ? '✓ ' : ''}{r.label}</span>
          {r.k && <span className="k">{r.k}</span>}
        </div>
      ))}
    </div>
  );
}

function MenuBar({ openMenu, onOpenMenu, time, date, theme,
  ccOpen, ncOpen, onToggleCC, onToggleNC, onOpenSpotlight, nowPlaying }) {
  const menuLeft = (name) => {
    // crude left offset based on order; good enough for the mock
    const idx = APP_MENU_ORDER.indexOf(name);
    return 10 + 42 /*logo*/ + idx * 64;
  };
  return (
    <div className="menubar" onMouseDown={(e) => e.stopPropagation()}>
      <div className="mb-left">
        <div
          className={`mb-item logo ${openMenu === 'apple' ? 'open' : ''}`}
          onClick={() => onOpenMenu(openMenu === 'apple' ? null : 'apple')}
          onMouseEnter={() => openMenu && onOpenMenu('apple')}
        >▞</div>
        {APP_MENU_ORDER.map((name, i) => (
          <div
            key={name}
            className={`mb-item ${i === 0 ? 'app-name' : 'muted'} ${openMenu === name ? 'open' : ''}`}
            onClick={() => onOpenMenu(openMenu === name ? null : name)}
            onMouseEnter={() => openMenu && onOpenMenu(name)}
          >{name}</div>
        ))}
      </div>

      <div className="mb-right">
        {nowPlaying && (
          <div className="mb-stat now">
            <span className="glyph" style={{ color: 'var(--color-accent)' }}>♪</span>
            <span className="ti">Vespers</span>
          </div>
        )}
        <div className="mb-stat"><span className="batt"><span className="cell"><i style={{ width: '64%' }}></i></span><span className="pct">68%</span></span></div>
        <div className="mb-stat"><span className="bars"><i></i><i></i><i></i><i></i></span></div>
        <div className="mb-stat" onClick={(e) => { e.stopPropagation(); onOpenSpotlight(); }}><span className="glyph">⌕</span></div>
        <div className={`mb-stat ${ccOpen ? 'open' : ''}`} onClick={(e) => { e.stopPropagation(); onToggleCC(); }}>
          <span className="cc-glyph"><i></i><i></i></span>
        </div>
        <div className={`mb-stat ${ncOpen ? 'open' : ''}`} onClick={(e) => { e.stopPropagation(); onToggleNC(); }}>
          <span className="date">{date}</span><span className="clock">{time}</span>
        </div>
      </div>

      {openMenu === 'apple' && <MenuDrop items={APPLE_MENU} left={8} />}
      {APP_MENU_ORDER.includes(openMenu) && <MenuDrop items={APP_MENUS[openMenu]} left={menuLeft(openMenu)} />}
    </div>
  );
}

// ── Dock ──
const DOCK_APPS = [
  { id: 'finder', glyph: '◧', name: 'Finder', accent: true, running: true },
  { id: 'spotlight', glyph: '⌕', name: 'Spotlight', action: 'spotlight' },
  { id: 'safari', glyph: '◍', name: 'Browser', running: true },
  { id: 'mail', glyph: '✉', name: 'Mail' },
  { id: 'messages', glyph: '◗', name: 'Messages' },
  { id: 'notes', glyph: '▤', name: 'Notes', action: 'notes', running: true },
  { id: 'calendar', cal: true, name: 'Calendar' },
  { id: 'music', glyph: '♪', name: 'Music', accent: true, running: true },
  { id: 'code', mono: 'λ', name: 'Editor' },
  { id: 'terminal', mono: '>_', name: 'Terminal', running: true },
  { id: 'settings', glyph: '⚙', name: 'Settings' },
  { sep: true },
  { id: 'downloads', glyph: '↓', name: 'Downloads' },
  { id: 'trash', glyph: '◌', name: 'Bin' },
];

function Dock({ onApp, bouncing, calDay, calDow }) {
  return (
    <div className="dock-wrap">
      <div className="dock" onMouseDown={(e) => e.stopPropagation()}>
        {DOCK_APPS.map((a, i) => (
          a.sep ? <div key={i} className="sep" /> :
          <div
            key={a.id}
            className={`dock-app ${a.accent ? 'accent' : ''} ${a.mono ? 'mono' : ''} ${a.cal ? 'cal' : ''} ${a.running ? 'running' : ''} ${bouncing === a.id ? 'bounce' : ''}`}
            onClick={() => onApp(a)}
          >
            {a.cal
              ? <><span className="dow">{calDow}</span><span className="day">{calDay}</span></>
              : (a.mono || a.glyph)}
            <span className="run"></span>
            <span className="tip">{a.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Spotlight ──
const SPOT_RESULTS = [
  { grp: 'Top Hit' },
  { ic: '◐', kind: 'Action', t: 'Toggle Appearance — Sheet / Field', d: 'switch the whole desktop', action: 'theme' },
  { grp: 'Applications' },
  { ic: '◧', kind: 'App', t: 'Finder', d: 'file manager', action: 'finder' },
  { ic: '▤', kind: 'App', t: 'Notes', d: 'desktop-notes.md open', action: 'notes' },
  { ic: '>_', kind: 'App', t: 'Terminal', d: 'zsh · ghostty', action: null },
  { grp: 'Files & Folders' },
  { ic: '◦', kind: 'File', t: 'tokens.json', d: '~/projects/jylhis · 11 KB', action: null },
  { ic: '◦', kind: 'File', t: 'theming.md', d: '~/projects/notes · edited just now', action: 'notes' },
];

function Spotlight({ query, results, selected, onPick, onClose }) {
  return (
    <div className="overlay spot" onMouseDown={onClose}>
      <div className="spotlight" onMouseDown={(e) => e.stopPropagation()}>
        <div className="spot-input">
          <span className="g">⌕</span>
          {query ? <span className="typed">{query}</span> : <span className="ph">Spotlight Search</span>}
          <span className="cur"></span>
        </div>
        <div className="spot-list">
          {results.map((r, i) => (
            r.grp ? <div key={i} className="spot-grouphead">{r.grp}</div> :
            <div key={i} className={`spot-row ${i === selected ? 'sel' : ''}`} onClick={() => onPick(r)}>
              <span className="ic">{r.ic}</span>
              <span className="body"><span className="t">{r.t}</span><span className="d">{r.d}</span></span>
              <span className="kind">{r.kind}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { MenuBar, Dock, Spotlight, SPOT_RESULTS });
