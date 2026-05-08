/* global React */
// shell.jsx — bar, palette, cheatsheet, walkthrough

const { useState: useShellState, useEffect: useShellEffect, useMemo: useShellMemo, useRef: useShellRef } = React;

// ── Top/Bottom bar ──
function Bar({ position = 'top', activeWs, workspaces, onSelectWs, mode, time, music, theme, density, onToggleTheme, proseTicker, rooms, activeRoom, onSelectRoom, inkActive }) {
  if (position === 'none') return null;
  return (
    <div className={`bar ${position}`}>
      <div className="bar-section left">
        <div className="bar-mode">
          <span className="key">{mode}</span>
          <span style={{ color: 'var(--color-text-faint)' }}>·</span>
          <span>jylhis</span>
        </div>
        {rooms ? (
          <div className="rooms">
            {rooms.map(r => (
              <span
                key={r.id}
                className={`room ${activeRoom?.id === r.id ? 'active' : ''}`}
                onClick={() => onSelectRoom?.(r.id)}
                title={r.desc}
              >
                <span className="glyph">{r.glyph}</span>
                <span>{r.name}</span>
                <span className="key">·{r.key}</span>
              </span>
            ))}
          </div>
        ) : (
          <div className="bar-ws">
            {workspaces.map((w, i) => (
              <span
                key={w.id}
                className={`ws ${w.id === activeWs ? 'active' : ''} ${w.windows > 0 ? 'has-windows' : ''}`}
                onClick={() => onSelectWs(w.id)}
              >
                <span className="num">{i + 1}</span>
                <span className="name">{w.name}</span>
                {w.windows > 0 && <span style={{ color: 'var(--color-text-faint)', fontSize: 10 }}>·{w.windows}</span>}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="bar-section center">
        {proseTicker ? (
          <div className="prose-ticker">{proseTicker}</div>
        ) : (
          <div className="bar-prompt">
            <span className="prompt-glyph">{'>'}</span>
            <span className="ctx">{music?.playing ? `♪ ${music.title}` : 'jylhis ▸ desktop'}</span>
            <span className="hint">— press <kbd>Super</kbd>+<kbd>Space</kbd> for palette · <kbd>Super</kbd>+<kbd>/</kbd> for keys</span>
          </div>
        )}
      </div>

      <div className="bar-section right">
        {inkActive && (
          <div className="bar-item experiment-on" title="ink mode active">
            <span>✎ ink</span>
          </div>
        )}
        <div className="bar-item" title="git status">
          <span className="glyph">⎇</span>
          <span>main</span>
          <span className="accent">!2</span>
        </div>
        <div className="bar-item" title="cpu">
          <span className="glyph">▮</span>
          <span>34%</span>
        </div>
        <div className="bar-item" title="memory">
          <span className="glyph">▤</span>
          <span>58%</span>
        </div>
        <div className="bar-item" title="network">
          <span className="glyph">↕</span>
          <span>wlan0</span>
        </div>
        <div className="bar-item" onClick={onToggleTheme} title="toggle theme">
          <span className="accent">{theme === 'dark' ? '☾' : '☀'}</span>
        </div>
        <div className="bar-item">
          <span style={{ color: 'var(--color-text-faint)' }}>mon 27 apr</span>
          <span style={{ color: 'var(--color-accent)' }}>{time}</span>
        </div>
      </div>
    </div>
  );
}

// ── Whisper bar (novel) ──
function Whisper({ music, lastCmd, aiSuggestion }) {
  return (
    <div className="whisper">
      <span className="seg accent"><span className="lbl">♪</span><span className="val">{music?.title || '—'}</span><span style={{ color: 'var(--color-text-faint)' }}>{music?.by || ''}</span></span>
      <span className="seg"><span className="lbl">$</span><span className="val">{lastCmd}</span></span>
      <span className="seg"><span className="lbl">◆</span><span className="val">{aiSuggestion}</span></span>
      <span className="right">whisper · super+. to silence</span>
    </div>
  );
}

// ── Command palette ──
const PALETTE_ITEMS = [
  { kind: 'app',    icon: '', label: 'ghostty', desc: 'open terminal', hint: 'Super+Return' },
  { kind: 'app',    icon: '', label: 'emacs', desc: 'open editor', hint: 'Super+E' },
  { kind: 'app',    icon: '', label: 'qutebrowser', desc: 'open browser', hint: 'Super+B' },
  { kind: 'app',    icon: '', label: 'slack', desc: 'open chat', hint: 'Super+S' },
  { kind: 'window', icon: '▦', label: 'emacs · astro.config.mjs', desc: 'workspace 1 · site', hint: '↵ focus' },
  { kind: 'window', icon: '▦', label: 'ghostty · npm run dev', desc: 'workspace 1 · site', hint: '↵ focus' },
  { kind: 'window', icon: '▦', label: 'slack · #desktop-env', desc: 'workspace 2 · comms', hint: '↵ focus' },
  { kind: 'ws',     icon: '◆', label: 'site', desc: 'workspace 1', hint: 'Super+1' },
  { kind: 'ws',     icon: '◆', label: 'comms', desc: 'workspace 2', hint: 'Super+2' },
  { kind: 'ws',     icon: '◆', label: 'ai', desc: 'workspace 3', hint: 'Super+3' },
  { kind: 'ws',     icon: '◆', label: 'mail', desc: 'workspace 4', hint: 'Super+4' },
  { kind: 'file',   icon: '', label: 'src/pages/index.astro', desc: 'recent · 2m ago', hint: '↵ open' },
  { kind: 'file',   icon: '', label: 'notes/desktop.md', desc: 'recent · 18m ago', hint: '↵ open' },
  { kind: 'ai',     icon: '◆', label: 'ask claude…', desc: 'inline · uses selection if any', hint: 'Super+;' },
  { kind: 'ai',     icon: '◆', label: 'ask claude · with current buffer', desc: 'attach emacs buffer', hint: '' },
  { kind: 'web',    icon: '', label: 'search docs.astro.build', desc: 'web · current query', hint: '' },
  { kind: 'sys',    icon: '', label: 'toggle theme', desc: 'paper ↔ roast', hint: 'Super+Shift+T' },
  { kind: 'sys',    icon: '', label: 'lock screen', desc: '', hint: 'Super+Shift+L' },
  { kind: 'sys',    icon: '', label: 'sound: pause spotify', desc: 'media', hint: '' },
];

function Palette({ query, selected, onClose }) {
  const items = useShellMemo(() => {
    if (!query) return PALETTE_ITEMS;
    const q = query.toLowerCase();
    return PALETTE_ITEMS.filter(i =>
      i.label.toLowerCase().includes(q) || i.desc.toLowerCase().includes(q) || i.kind.includes(q)
    );
  }, [query]);

  return (
    <div className="overlay" onClick={onClose}>
      <span className="hint-esc">esc to close</span>
      <div className="palette" onClick={(e) => e.stopPropagation()}>
        <div className="palette-prompt">
          <span className="glyph">{'>'}</span>
          <span className="input">
            {query || <span className="placeholder">type to search apps · windows · files · workspaces · ai · web…</span>}
            <span className="cursor" style={{ marginLeft: 1 }}></span>
          </span>
        </div>
        <div className="palette-hints">
          <span><span className="key">tab</span> filter kind</span>
          <span style={{ marginLeft: 16 }}><span className="key">↑↓</span> navigate</span>
          <span style={{ marginLeft: 16 }}><span className="key">↵</span> activate</span>
          <span style={{ marginLeft: 16 }}><span className="key">esc</span> close</span>
          <span style={{ marginLeft: 'auto', float: 'right' }}>{items.length} results</span>
        </div>
        <div className="palette-list">
          {items.slice(0, 10).map((it, i) => (
            <div key={i} className={`palette-row ${i === selected ? 'selected' : ''}`}>
              <span className="icon">{it.icon}</span>
              <span className="label">
                <span className="kind">{it.kind}</span>
                <span>{it.label}</span>
                <span className="desc">{it.desc}</span>
              </span>
              <span className="hint">{it.hint && <kbd>{it.hint}</kbd>}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Leader cheatsheet ──
function Cheatsheet({ onClose }) {
  return (
    <div className="overlay" style={{ background: 'rgba(0,0,0,0.25)' }} onClick={onClose}>
      <div className="cheatsheet" onClick={(e) => e.stopPropagation()}>
        <div className="col-title">
          <span style={{ color: 'var(--color-accent)' }}>SUPER</span>
          <span style={{ color: 'var(--color-text-muted)' }}>· leader · which-key</span>
          <span className="esc">esc to close</span>
        </div>

        <div className="grp-h">apps</div>
        <div className="item"><span className="key">Return</span><span className="lbl"><span className="em">ghostty</span> · terminal</span></div>
        <div className="item"><span className="key">e</span><span className="lbl"><span className="em">emacs</span> · editor</span></div>
        <div className="item"><span className="key">b</span><span className="lbl"><span className="em">browser</span> · qutebrowser</span></div>
        <div className="item"><span className="key">s</span><span className="lbl"><span className="em">slack</span> · chat</span></div>
        <div className="item"><span className="key">m</span><span className="lbl"><span className="em">mail</span> · aerc</span></div>
        <div className="item"><span className="key">f</span><span className="lbl"><span className="em">files</span> · yazi</span></div>
        <div className="item"><span className="key">t</span><span className="lbl"><span className="em">btop</span> · monitor</span></div>
        <div className="item"><span className="key">p</span><span className="lbl"><span className="em">spotify</span> · music</span></div>

        <div className="grp-h">windows</div>
        <div className="item"><span className="key">h j k l</span><span className="lbl">focus left/down/up/right</span></div>
        <div className="item"><span className="key">⇧h⇧j⇧k⇧l</span><span className="lbl">move window</span></div>
        <div className="item"><span className="key">f</span><span className="lbl">fullscreen</span></div>
        <div className="item"><span className="key">Space</span><span className="lbl">toggle floating</span></div>
        <div className="item"><span className="key">v</span><span className="lbl">toggle split</span></div>
        <div className="item"><span className="key">q</span><span className="lbl">close window</span></div>

        <div className="grp-h">workspaces · scrolling strip</div>
        <div className="item"><span className="key">1…9</span><span className="lbl">jump to numbered slot</span></div>
        <div className="item"><span className="key">[ ]</span><span className="lbl">prev / next workspace</span></div>
        <div className="item"><span className="key">⇧[ ⇧]</span><span className="lbl">drag workspace</span></div>
        <div className="item"><span className="key">n</span><span className="lbl">name current ws</span></div>

        <div className="grp-h">palette · ai · system</div>
        <div className="item"><span className="key">d</span><span className="lbl">command palette</span></div>
        <div className="item"><span className="key">;</span><span className="lbl"><span className="em">ask claude</span> · with selection</span></div>
        <div className="item"><span className="key">·</span><span className="lbl">summon ai overlay (quake)</span></div>
        <div className="item"><span className="key">⇧t</span><span className="lbl">toggle paper / roast</span></div>
      </div>
    </div>
  );
}

// ── Walkthrough chip ──
function Walkthrough({ step, total, scenario, onPrev, onNext, onJump }) {
  return (
    <div className="walkthrough">
      <div className="step-title">{scenario.title}</div>
      <div className="step-body">{scenario.body}</div>
      <div className="progress"><div className="fill" style={{ width: `${((step + 1) / total) * 100}%` }} /></div>
      <div className="controls">
        <button onClick={onPrev} disabled={step === 0}>← prev</button>
        <button onClick={onNext} disabled={step === total - 1}>next →</button>
        <span className="step-num">scene {step + 1} / {total}</span>
      </div>
    </div>
  );
}

// ── Toasts ──
function Toasts({ list }) {
  return (
    <div className="toasts">
      {list.map((t, i) => (
        <div key={i} className={`toast ${t.kind || ''}`}>
          <div className="title">{t.title}</div>
          <div className="body">{t.body}</div>
        </div>
      ))}
    </div>
  );
}

Object.assign(window, { Bar, Whisper, Palette, Cheatsheet, Walkthrough, Toasts });
