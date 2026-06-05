/* global React */
/* panes.jsx — TUI window frame + the individual "apps" that live inside it.
 * Everything here is presentational; interaction/state lives in app.jsx so a
 * single global key handler can drive the whole desktop.
 */

// ── Window frame: double-line box with the title embedded in the top border ──
function Frame({ title, tag, hint, focused, gridStyle, children, onClick }) {
  return (
    <div
      className={`win ${focused ? 'focused' : ''}`}
      style={gridStyle}
      onClick={onClick}
    >
      <div className="win-title">
        <span className="br">┤</span>
        <span className="name">{title}</span>
        {tag && <span className="tag">· {tag}</span>}
        <span className="br">├</span>
      </div>
      {hint && <div className="win-hint">{hint}</div>}
      <div className="win-body">{children}</div>
    </div>
  );
}

// ── A block meter built from cell glyphs ──
function Meter({ value, width = 26, tone }) {
  const on = Math.round((value / 100) * width);
  const cells = [];
  for (let i = 0; i < width; i++) {
    cells.push(
      <span key={i} className={i < on ? `on ${tone || ''}` : 'off'}>
        {i < on ? '█' : '─'}
      </span>
    );
  }
  return <span className="meterbar">{cells}</span>;
}

// ── Terminal — the centrepiece ──
function Terminal({ transcript, input, focused, suggestions }) {
  return (
    <div className="term tui">
      <div className="term-scroll">
        {transcript.map((blk, i) => (
          <div key={i}>
            {blk.cmd !== undefined && (
              <div className="ln">
                <span className="prompt-path">~/projects/jylhis</span>{' '}
                <span className="prompt-git">main</span>{' '}
                <span className="prompt-arrow">❯</span>{' '}
                <span className="cmd">{blk.cmd}</span>
              </div>
            )}
            {(blk.out || []).map((line, j) => (
              <div key={j} className="ln">{line}</div>
            ))}
          </div>
        ))}
        <div className="ln term-input">
          <span className="prompt-path">~/projects/jylhis</span>{' '}
          <span className="prompt-git">main</span>{' '}
          <span className="prompt-arrow">❯</span>{' '}
          <span className="typed">{input}</span>
          <span className={`cursor ${focused ? '' : 'hollow'}`}></span>
        </div>
        {focused && suggestions && suggestions.length > 0 && (
          <div className="term-suggest">
            {suggestions.map((s, i) => (
              <div key={i} className={`row ${i === 0 ? 'cur' : ''}`}>
                <span className="k">{s.k}</span>
                <span>{s.d}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ── Commander — dual-pane file manager (Norton homage) ──
const CMDR_FILES = [
  { nm: '..', kind: 'dir', sz: '▲up dir', dt: '04-30 08:12' },
  { nm: 'jylhis-site', kind: 'dir', sz: '<dir>', dt: '04-30 08:41' },
  { nm: 'design-system', kind: 'dir', sz: '<dir>', dt: '04-29 17:03' },
  { nm: 'desktop-tui', kind: 'dir', sz: '<dir>', dt: '04-28 11:55' },
  { nm: 'notes', kind: 'dir', sz: '<dir>', dt: '04-30 07:20' },
  { nm: 'astro.config.mjs', kind: 'file', sz: '1.4 K', dt: '04-30 08:39' },
  { nm: 'flake.nix', kind: 'file', sz: '892 B', dt: '04-27 22:14' },
  { nm: 'justfile', kind: 'file', sz: '410 B', dt: '04-30 08:02' },
  { nm: 'build.sh', kind: 'exe', sz: '2.1 K', dt: '04-29 19:48' },
  { nm: 'README.md', kind: 'file', sz: '6.0 K', dt: '04-30 08:40' },
];

function Commander({ cursor = 1 }) {
  return (
    <div className="cmdr tui">
      <div className="cmdr-panes">
        <div className="cmdr-pane left">
          <div className="cmdr-colhead">
            <span>name</span><span>size</span><span>modified</span>
          </div>
          <div className="cmdr-list">
            {CMDR_FILES.map((f, i) => (
              <div key={f.nm} className={`cmdr-row ${f.kind} ${i === cursor ? 'cur' : ''}`}>
                <span className="nm">{f.kind === 'dir' ? '▸ ' : '  '}{f.nm}</span>
                <span className="sz">{f.sz}</span>
                <span className="dt">{f.dt}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="cmdr-pane right">
          <div className="cmdr-info">
            <div className="big accent">jylhis-site</div>
            <div className="faint" style={{ fontSize: 11, marginBottom: 6 }}>directory · 14 items</div>
            <div><span className="k">2 147 480 K</span> <span className="muted">bytes on volume</span></div>
            <div><span className="v accent">561 204 K</span> <span className="muted">bytes free</span></div>
            <div className="rule"></div>
            <div><span className="v">9</span> <span className="muted">files,</span> <span className="v">4</span> <span className="muted">directories</span></div>
            <div><span className="muted">using</span> <span className="v">38 220 K</span> <span className="muted">in</span></div>
            <div className="faint">~/projects/jylhis-site</div>
            <div className="rule"></div>
            <div><span className="k">volume</span> &nbsp; <span className="v accent">JYLHIS</span></div>
            <div><span className="k">serial</span> &nbsp; <span className="v">3E53:10FE</span></div>
            <div><span className="k">git</span> &nbsp;&nbsp;&nbsp; <span className="ok">main</span> <span className="faint">·</span> <span className="warn">!2</span></div>
          </div>
        </div>
      </div>
      <div className="cmdr-path">
        <span className="frag">~/projects/</span><span className="here">jylhis-site</span>
        <span className="faint" style={{ marginLeft: 'auto' }}>F3 view · F4 edit · ⏎ open</span>
      </div>
    </div>
  );
}

// ── Monitor — system resources ──
function Monitor({ cpu = 34, mem = 58, swp = 9, net = 21 }) {
  const procs = [
    { nm: 'astro dev', cpu: '12', mem: '418M', cur: true },
    { nm: 'emacs', cpu: '6', mem: '512M' },
    { nm: 'ghostty', cpu: '4', mem: '96M' },
    { nm: 'desktop-tui', cpu: '3', mem: '24M' },
    { nm: 'hyprland', cpu: '2', mem: '88M' },
  ];
  return (
    <div className="mon tui">
      <div className="mon-row">
        <span className="lbl">cpu</span>
        <Meter value={cpu} width={22} />
        <span className="val">{cpu}%</span>
      </div>
      <div className="mon-row">
        <span className="lbl">mem</span>
        <Meter value={mem} width={22} tone={mem > 80 ? 'warn' : ''} />
        <span className="val">{mem}%</span>
      </div>
      <div className="mon-row">
        <span className="lbl">swp</span>
        <Meter value={swp} width={22} />
        <span className="val">{swp}%</span>
      </div>
      <div className="mon-row">
        <span className="lbl">net</span>
        <Meter value={net} width={22} />
        <span className="val">{net}↓</span>
      </div>
      <div className="mon-rule"></div>
      <div className="mon-proc">
        <div className="row head"><span>process</span><span className="r">cpu</span><span className="r">mem</span></div>
        {procs.map((p) => (
          <div key={p.nm} className={`row ${p.cur ? 'cur' : ''}`}>
            <span>{p.cur ? '▸ ' : '  '}{p.nm}</span>
            <span className="r">{p.cpu}</span>
            <span className="r">{p.mem}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Now panel — music + agenda ──
function NowPanel({ playing = true, seek = 38 }) {
  const agenda = [
    { t: '11:00', d: 'design review · desktop', done: false },
    { t: '13:30', d: 'pairing · token refactor', done: false },
    { t: '09:15', d: 'standup', done: true },
  ];
  return (
    <div className="now tui">
      <div className="now-music">
        <div><span className="accent">{playing ? '▶' : '❚❚'}</span> <span className="title">Vespers</span></div>
        <div className="by">— Strands · Anatole</div>
        <div className="seek">
          <span>1:14</span>
          <span className="track"><i style={{ width: `${seek}%` }} /></span>
          <span>3:12</span>
        </div>
      </div>
      <div className="now-rule"></div>
      <div className="now-agenda">
        {agenda.map((e, i) => (
          <div key={i} className={`ev ${e.done ? 'dim' : ''}`}>
            <span className="t">{e.t}</span>
            <span className="d">{e.done ? '✓ ' : ''}{e.d}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

Object.assign(window, { Frame, Meter, Terminal, Commander, Monitor, NowPanel });
