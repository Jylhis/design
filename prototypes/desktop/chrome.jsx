/* global React */
/* chrome.jsx — desktop chrome: menu bar, function-key bar, and the three
 * discoverability overlays (which-key, help, launcher). All presentational;
 * app.jsx owns state and passes handlers down.
 */

// ── Menu definitions ──
const MENUS = [
  { name: 'System', hot: 'S', rows: [
    { label: 'About this desktop', k: 'F1', action: 'help' },
    { label: 'Command launcher…', k: 'Space', action: 'launcher' },
    { label: 'Reload config', k: '⌘R', action: 'reload' },
    { sep: true },
    { label: 'Lock session', k: '⌘L', action: 'lock' },
    { label: 'Quit to console', k: 'F10', action: 'quit' },
  ]},
  { name: 'Window', hot: 'W', rows: [
    { label: 'Focus next', k: 'Tab', action: 'focus-next' },
    { label: 'Focus terminal', k: 'F9', action: 'focus-term' },
    { group: 'move focus' },
    { label: 'left · right', k: 'h  l', action: 'noop' },
    { label: 'up · down', k: 'k  j', action: 'noop' },
    { sep: true },
    { label: 'Close window', k: 'q', action: 'noop' },
  ]},
  { name: 'View', hot: 'V', rows: [
    { label: 'Toggle sheet / field', k: 'T', action: 'theme' },
    { group: 'wallpaper' },
    { label: 'Hatch', k: '', action: 'wall:hatch' },
    { label: 'Dots', k: '', action: 'wall:dots' },
    { label: 'Scanline', k: '', action: 'wall:scan' },
    { label: 'None', k: '', action: 'wall:none' },
    { sep: true },
    { label: 'Comfortable density', k: '', action: 'dens:comfortable' },
    { label: 'Compact density', k: '', action: 'dens:compact' },
  ]},
  { name: 'Go', hot: 'G', rows: [
    { label: 'Terminal', k: 'F9', action: 'focus-term' },
    { label: 'Files · commander', k: 'F2', action: 'focus-cmdr' },
    { label: 'Monitor', k: '', action: 'focus-mon' },
    { label: 'Now playing', k: '', action: 'focus-now' },
  ]},
  { name: 'Help', hot: 'H', rows: [
    { label: 'Keyboard reference', k: 'F1', action: 'help' },
    { label: 'Which-key cheatsheet', k: 'Space', action: 'whichkey' },
  ]},
];

function MenuBar({ openMenu, onOpenMenu, onAction, time, date, theme, onToggleTheme, cpu, mem }) {
  return (
    <div className="menubar" onMouseLeave={() => onOpenMenu(null)}>
      <div className="brand">
        <span className="mark">▞</span>
        <span className="name">jylhis</span>
      </div>
      <div className="menu-items">
        {MENUS.map((m) => (
          <div
            key={m.name}
            className={`menu-item ${openMenu === m.name ? 'open' : ''}`}
            onClick={() => onOpenMenu(openMenu === m.name ? null : m.name)}
            onMouseEnter={() => openMenu && onOpenMenu(m.name)}
          >
            <span><span className="hot">{m.name[0]}</span>{m.name.slice(1)}</span>
            {openMenu === m.name && (
              <div className="menu-drop" onClick={(e) => e.stopPropagation()}>
                {m.rows.map((r, i) => (
                  r.sep ? <div key={i} className="sep" /> :
                  r.group ? <div key={i} className="group">{r.group}</div> :
                  <div key={i} className="row" onClick={() => { onAction(r.action); onOpenMenu(null); }}>
                    <span>{r.label}</span>
                    {r.k && <span className="k">{r.k}</span>}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="status">
        <div className="seg accent">
          <span className="g">cpu</span>
          <span className="meter"><i style={{ width: `${cpu}%` }} /></span>
          <span className="v">{cpu}%</span>
        </div>
        <div className="seg">
          <span className="g">mem</span>
          <span className="meter"><i style={{ width: `${mem}%` }} /></span>
          <span className="v">{mem}%</span>
        </div>
        <div className="seg"><span className="g">⎇</span><span className="v">main</span></div>
        <div className="seg"><span className="g">↕</span><span className="v">wlan0</span></div>
        <div className="seg">
          <button className="theme-btn" type="button" onClick={onToggleTheme} aria-label="Toggle sheet / field">
            {theme === 'dark' ? '☾ field' : '☀ sheet'}
          </button>
        </div>
        <div className="seg"><span className="g">{date}</span><span className="v clock">{time}</span></div>
      </div>
    </div>
  );
}

// ── Function-key bar ──
const FKEYS = [
  { n: 1,  label: 'Help',  action: 'help' },
  { n: 2,  label: 'Menu',  action: 'whichkey' },
  { n: 3,  label: 'View',  action: 'focus-cmdr' },
  { n: 4,  label: 'Edit',  action: 'focus-cmdr' },
  { n: 5,  label: 'Launch', action: 'launcher' },
  { n: 6,  label: 'Theme', action: 'theme' },
  { n: 7,  label: 'Files', action: 'focus-cmdr' },
  { n: 8,  label: 'Sysmon', action: 'focus-mon' },
  { n: 9,  label: 'Term',  action: 'focus-term' },
  { n: 10, label: 'Quit',  action: 'quit' },
];

function FKeyBar({ onAction, armed }) {
  return (
    <div className="fkeys">
      {FKEYS.map((f) => (
        <div
          key={f.n}
          className={`fkey ${armed === f.n ? 'armed' : ''}`}
          onClick={() => onAction(f.action)}
          title={`F${f.n} · ${f.label}`}
        >
          <span className="n">{f.n}</span>
          <span className="l">{f.label}</span>
        </div>
      ))}
    </div>
  );
}

// ── Which-key cheatsheet ──
const WK_GROUPS = [
  { h: 'launch', items: [
    { key: 'Spc', lbl: <><span className="em">command launcher</span></> },
    { key: '⏎', lbl: <>run focused terminal line</> },
    { key: ':', lbl: <>type a command</> },
    { key: 'F9', lbl: <>jump to terminal</> },
  ]},
  { h: 'focus windows', items: [
    { key: 'h l', lbl: <>left · right pane</> },
    { key: 'k j', lbl: <>up · down pane</> },
    { key: 'Tab', lbl: <>cycle windows</> },
    { key: '1-4', lbl: <>jump to window n</> },
  ]},
  { h: 'view', items: [
    { key: 'T', lbl: <>toggle <span className="em">sheet / field</span></> },
    { key: 'w', lbl: <>cycle wallpaper</> },
    { key: 'F1', lbl: <>full keyboard help</> },
    { key: 'Esc', lbl: <>close overlay</> },
  ]},
  { h: 'files · commander', items: [
    { key: 'F3', lbl: <>view file</> },
    { key: 'F4', lbl: <>edit file</> },
    { key: 'F7', lbl: <>new folder</> },
    { key: 'F8', lbl: <>delete</> },
  ]},
];

function WhichKey({ onClose }) {
  return (
    <div className="overlay" onClick={onClose}>
      <div className="box whichkey" onClick={(e) => e.stopPropagation()}>
        <div className="box-title">┤ which-key ├</div>
        <div className="box-esc">esc</div>
        <div className="whichkey-lead">
          <span className="accent">▞ leader</span>
          <span className="muted">— start a chord; the next keys appear here. Nothing to memorise.</span>
        </div>
        <div className="wk-grid">
          {WK_GROUPS.map((g) => (
            <div key={g.h} className="wk-grp">
              <div className="h">{g.h}</div>
              {g.items.map((it, i) => (
                <div key={i} className="wk-item">
                  <span className="key">{it.key}</span>
                  <span className="lbl">{it.lbl}</span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Full keyboard help ──
const HELP_SECS = [
  { h: 'getting around', rows: [
    { keys: <><kbd className="ds-kbd">h</kbd><kbd className="ds-kbd">j</kbd><kbd className="ds-kbd">k</kbd><kbd className="ds-kbd">l</kbd></>, desc: 'move focus between tiled windows' },
    { keys: <><kbd className="ds-kbd">Tab</kbd></>, desc: 'cycle to the next window' },
    { keys: <><kbd className="ds-kbd">1</kbd>…<kbd className="ds-kbd">4</kbd></>, desc: 'jump straight to a window' },
    { keys: <><kbd className="ds-kbd">F9</kbd></>, desc: 'focus the terminal centrepiece' },
  ]},
  { h: 'the terminal', rows: [
    { keys: <>type</>, desc: 'when the terminal is focused, just type' },
    { keys: <><kbd className="ds-kbd">⏎</kbd></>, desc: 'run the line — try help, ls, theme, about, clear' },
    { keys: <><kbd className="ds-kbd">:</kbd></>, desc: 'focus terminal and start a command from anywhere' },
  ]},
  { h: 'discover, don\u2019t memorise', rows: [
    { keys: <><kbd className="ds-kbd">F1</kbd></>, desc: 'this reference' },
    { keys: <><kbd className="ds-kbd">Space</kbd></>, desc: 'which-key — shows the next available keys' },
    { keys: <><kbd className="ds-kbd">F1</kbd>…<kbd className="ds-kbd">F10</kbd></>, desc: 'the bottom bar is always live — click or press' },
  ]},
  { h: 'look & feel', rows: [
    { keys: <><kbd className="ds-kbd">T</kbd></>, desc: 'toggle sheet / field' },
    { keys: <><kbd className="ds-kbd">w</kbd></>, desc: 'cycle wallpaper texture' },
    { keys: <><kbd className="ds-kbd">Esc</kbd></>, desc: 'dismiss any overlay' },
  ]},
];

function Help({ onClose }) {
  return (
    <div className="overlay" onClick={onClose}>
      <div className="box help" onClick={(e) => e.stopPropagation()}>
        <div className="box-title">┤ help ├</div>
        <div className="box-esc">esc</div>
        <h2>jylhis · tui desktop</h2>
        <div className="sub">A desktop with no graphics — every window is a terminal. Keyboard-driven, but you never have to remember a binding.</div>
        <div className="help-cols">
          {HELP_SECS.map((s) => (
            <div key={s.h} className="help-sec">
              <div className="h">{s.h}</div>
              {s.rows.map((r, i) => (
                <div key={i} className="help-row">
                  <span className="keys">{r.keys}</span>
                  <span className="desc">{r.desc}</span>
                </div>
              ))}
            </div>
          ))}
        </div>
        <div className="help-foot">
          The bottom row is the contract: <span className="accent">F1–F10</span> are always shown and always live, the
          way Norton Commander taught a generation. Hold <span className="accent">Space</span> and the rest reveals itself.
        </div>
      </div>
    </div>
  );
}

// ── Command launcher ──
function Launcher({ query, items, selected, onClose }) {
  return (
    <div className="overlay" onClick={onClose}>
      <div className="box launcher" onClick={(e) => e.stopPropagation()}>
        <div className="box-title">┤ launch ├</div>
        <div className="launcher-input">
          <span className="g">❯</span>
          {query
            ? <span className="typed">{query}</span>
            : <span className="ph">run an app, file, or action…</span>}
          <span className="cursor"></span>
        </div>
        <div className="launcher-bar">
          <span><span className="k">↑↓</span> move</span>
          <span><span className="k">⏎</span> run</span>
          <span><span className="k">esc</span> close</span>
          <span className="count">{items.length} results</span>
        </div>
        <div className="launcher-list">
          {items.map((it, i) => (
            <div key={i} className={`launcher-row ${i === selected ? 'cur' : ''}`}>
              <span className="ic">{it.ic}</span>
              <span className="lab">
                <span className="kind">{it.kind}</span>
                <span className="t">{it.label}</span>
                {it.desc && <span className="d">{it.desc}</span>}
              </span>
              <span className="hint">{it.hint}</span>
            </div>
          ))}
          {items.length === 0 && (
            <div className="launcher-row"><span className="ic"> </span><span className="lab"><span className="d">no matches</span></span><span /></div>
          )}
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { MenuBar, FKeyBar, WhichKey, Help, Launcher });
