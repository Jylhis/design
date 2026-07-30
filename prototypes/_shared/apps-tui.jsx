/* global React */
// apps-tui.jsx — terminal, btop, file manager, email, spotify, emacs

const { useState, useEffect, useRef, useMemo } = React;

// ── Ghostty + tmux + TUI ──
function Terminal() {
  return (
    <div className="tui" style={{ position: 'relative', height: '100%', paddingBottom: 22 }}>
      <div className="line"><span className="muted">~/projects/jylhis-site</span> <span className="accent">on</span> <span className="key">⎇ main</span> <span className="warn">!2</span></div>
      <div className="line"><span className="accent">❯</span> npm run dev</div>
      <div className="line muted">  </div>
      <div className="line"><span className="brand">▲</span> <span className="muted">Astro</span> <span className="faint">v5.4.2</span></div>
      <div className="line muted">  </div>
      <div className="line"><span className="ok">┃</span>  Local    <span className="info">http://localhost:4321/</span></div>
      <div className="line"><span className="ok">┃</span>  Network  <span className="faint">use --host to expose</span></div>
      <div className="line muted">  </div>
      <div className="line faint">14:02:14 [vite] hmr update <span className="str">/src/pages/index.astro</span></div>
      <div className="line faint">14:02:18 [vite] hmr update <span className="str">/src/styles/global.css</span></div>
      <div className="line muted">  </div>
      <div className="line"><span className="muted">~/projects/jylhis-site</span> <span className="accent">on</span> <span className="key">⎇ main</span> <span className="warn">!2</span></div>
      <div className="line"><span className="accent">❯</span> git status</div>
      <div className="line muted">On branch <span className="key">main</span></div>
      <div className="line muted">Changes not staged for commit:</div>
      <div className="line">  <span className="warn">modified:</span>   src/styles/global.css</div>
      <div className="line">  <span className="warn">modified:</span>   src/pages/index.astro</div>
      <div className="line muted">  </div>
      <div className="line"><span className="muted">~/projects/jylhis-site</span> <span className="accent">on</span> <span className="key">⎇ main</span> <span className="warn">!2</span></div>
      <div className="line"><span className="accent">❯</span> <span className="mock-tui-cursor"></span></div>

      <div className="tmux-status">
        <span className="tab active">[1] zsh*</span>
        <span className="tab">[2] dev</span>
        <span className="tab">[3] watch</span>
        <span style={{ marginLeft: 'auto' }}>session: <span style={{ color: 'var(--color-accent)' }}>jylhis</span> · <span style={{ color: 'var(--color-text-faint)' }}>14:02</span></span>
      </div>
    </div>
  );
}

function Btop() {
  const [cpu, setCpu] = useState(34);
  const [mem, setMem] = useState(58);
  const [net, setNet] = useState(12);
  useEffect(() => {
    const id = setInterval(() => {
      setCpu(c => Math.max(8, Math.min(94, c + (Math.random() * 30 - 15))));
      setMem(m => Math.max(20, Math.min(80, m + (Math.random() * 6 - 3))));
      setNet(n => Math.max(2, Math.min(40, n + (Math.random() * 10 - 5))));
    }, 1500);
    return () => clearInterval(id);
  }, []);

  const cores = [42, 28, 56, 31, 22, 44, 18, 33];
  const procs = [
    { pid: 4821, cmd: 'emacs --daemon', cpu: 4.2, mem: 312, cur: false },
    { pid: 5912, cmd: 'astro/dev', cpu: 18.4, mem: 287, cur: true },
    { pid: 6004, cmd: 'chromium', cpu: 8.9, mem: 612, cur: false },
    { pid: 3210, cmd: 'hyprland', cpu: 1.4, mem: 142, cur: false },
    { pid: 7011, cmd: 'rust-analyzer', cpu: 12.1, mem: 421, cur: false },
    { pid: 7102, cmd: 'tmux: server', cpu: 0.2, mem: 18, cur: false },
    { pid: 8221, cmd: 'spotifyd', cpu: 1.1, mem: 64, cur: false },
    { pid: 8302, cmd: 'mpd', cpu: 0.1, mem: 32, cur: false },
  ];

  return (
    <div className="btop">
      <div className="panel">
        <div className="panel-title">cpu — Ryzen 7 7840U</div>
        <div className="bar-row">
          <span className="lbl">all</span>
          <div className="bargraph"><div className={`fill ${cpu > 80 ? 'err' : cpu > 60 ? 'warn' : ''}`} style={{ width: `${cpu}%` }} /></div>
          <span className="val">{Math.round(cpu)}%</span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 6, marginTop: 4 }}>
          {cores.map((v, i) => (
            <div key={i} className="bar-row" style={{ gridTemplateColumns: '24px 1fr 32px' }}>
              <span className="lbl">c{i}</span>
              <div className="bargraph"><div className="fill" style={{ width: `${v + (cpu - 34) * 0.4}%` }} /></div>
              <span className="val">{Math.round(v + (cpu - 34) * 0.4)}%</span>
            </div>
          ))}
        </div>
      </div>

      <div className="panel">
        <div className="panel-title">mem · net</div>
        <div className="bar-row">
          <span className="lbl">mem</span>
          <div className="bargraph"><div className={`fill ${mem > 75 ? 'warn' : ''}`} style={{ width: `${mem}%` }} /></div>
          <span className="val">{Math.round(mem)}%</span>
        </div>
        <div className="bar-row">
          <span className="lbl">swp</span>
          <div className="bargraph"><div className="fill" style={{ width: `4%` }} /></div>
          <span className="val">4%</span>
        </div>
        <div className="bar-row">
          <span className="lbl">↓</span>
          <div className="bargraph"><div className="fill" style={{ width: `${net * 2}%` }} /></div>
          <span className="val">{Math.round(net * 64)}KB/s</span>
        </div>
      </div>

      <div className="panel">
        <div className="panel-title">processes — 142 total · 4 running</div>
        <div className="proc-list">
          <div className="row head"><span className="right">pid</span><span>command</span><span className="right">cpu%</span><span className="right">mem M</span></div>
          {procs.map((p) => (
            <div key={p.pid} className={`row ${p.cur ? 'cur' : ''}`}>
              <span className="right" style={{ color: 'var(--color-text-faint)' }}>{p.pid}</span>
              <span>{p.cmd}</span>
              <span className="right">{p.cpu.toFixed(1)}</span>
              <span className="right">{p.mem}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Yazi() {
  const left = [
    { t: 'dir', n: 'Documents' },
    { t: 'dir', n: 'Downloads' },
    { t: 'dir', n: 'Music' },
    { t: 'dir', n: 'Pictures' },
    { t: 'dir', n: 'projects', cur: true },
    { t: 'dir', n: 'tmp' },
    { t: 'file', n: '.zshrc' },
  ];
  const mid = [
    { t: 'dir', n: 'jylhis-site', cur: true },
    { t: 'dir', n: 'desktop-env' },
    { t: 'dir', n: 'dotfiles' },
    { t: 'dir', n: 'nixos-config' },
    { t: 'dir', n: 'cli-tools' },
    { t: 'file', n: 'README.md' },
  ];
  const right = [
    { t: 'dir', n: 'src', cur: true, m: '32 files' },
    { t: 'dir', n: 'public', m: '12 files' },
    { t: 'dir', n: 'node_modules', m: '—' },
    { t: 'file', n: 'astro.config.mjs', m: '1.2 KB' },
    { t: 'file', n: 'package.json', m: '0.8 KB' },
    { t: 'file', n: 'README.md', m: '4.1 KB' },
    { t: 'exe', n: 'build.sh', m: '420 B' },
    { t: 'file', n: '.gitignore', m: '120 B' },
  ];
  return (
    <div className="yazi">
      <div className="yazi-head">
        <span className="path-frag">/home/markus/projects/jylhis-site/</span><span className="path-here">src</span>
      </div>
      <div className="yazi-cols">
        <div className="yazi-col">
          {left.map((r, i) => (
            <div key={i} className={`row ${r.t} ${r.cur ? 'cur' : ''}`}>
              <span className="icon">{r.t === 'dir' ? '' : ''}</span>
              <span className="name">{r.n}</span>
            </div>
          ))}
        </div>
        <div className="yazi-col">
          {mid.map((r, i) => (
            <div key={i} className={`row ${r.t} ${r.cur ? 'cur' : ''}`}>
              <span className="icon">{r.t === 'dir' ? '' : ''}</span>
              <span className="name">{r.n}</span>
            </div>
          ))}
        </div>
        <div className="yazi-col">
          {right.map((r, i) => (
            <div key={i} className={`row ${r.t} ${r.cur ? 'cur' : ''}`}>
              <span className="icon">{r.t === 'dir' ? '' : r.t === 'exe' ? '' : ''}</span>
              <span className="name">{r.n}</span>
              <span className="meta">{r.m}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="yazi-foot">
        <span><span className="accent">5/8</span> · 142 KB</span>
        <span style={{ color: 'var(--color-text-faint)' }}>q quit · h up · l in · / find · y yank · p paste</span>
      </div>
    </div>
  );
}

function Aerc() {
  const messages = [
    { unread: true, from: 'GitHub', flag: '⑂', subj: '[markusj/jylhis] PR #42 ready for review', when: '14:02', cur: true },
    { unread: true, from: 'Cloudflare', flag: '', subj: 'Build succeeded for jylhis.com', when: '13:48' },
    { unread: false, from: 'Astro Newsletter', flag: '', subj: 'Astro 5.5 — content collections become typed', when: '12:11' },
    { unread: false, from: 'Anna Kuusisto', flag: '★', subj: 're: notes on the desktop env', when: '11:23' },
    { unread: false, from: 'NixOS Discourse', flag: '', subj: 'flake-parts: composing nixosConfigurations', when: 'Mon' },
    { unread: false, from: 'Markus (drafts)', flag: '', subj: '[draft] Why I run my own infra', when: 'Sun' },
    { unread: false, from: 'sourcehut', flag: '', subj: 'Build 1208 passed', when: 'Sun' },
  ];
  return (
    <div className="aerc">
      <div className="aerc-list">
        {messages.map((m, i) => (
          <div key={i} className={`row ${m.unread ? 'unread' : ''} ${m.cur ? 'cur' : ''}`}>
            <div className="from">
              <span className="flag">{m.flag}</span>
              <span>{m.from}</span>
              <span className="when">{m.when}</span>
            </div>
            <div className="subj">{m.subj}</div>
          </div>
        ))}
      </div>
      <div className="aerc-msg">
        <div className="aerc-headers">
          <div className="h"><span className="k">from</span><span className="v">GitHub &lt;notifications@github.com&gt;</span></div>
          <div className="h"><span className="k">to</span><span className="v">markus@jylhis.com</span></div>
          <div className="h"><span className="k">date</span><span className="v">Mon, 27 Apr 2026 14:02:11 +0200</span></div>
          <div className="subj">[markusj/jylhis] PR #42 ready for review</div>
        </div>
        <div className="aerc-body">{`Anna Kuusisto requested your review on PR #42:

  feat(desktop): scrolling workspace metaphor

This change reworks the workspace switcher to use a horizontal scrolling
strip instead of fixed numbered slots. Workspaces gain names and persist
across reboots. Demo recording attached at /uploads/scrolling-ws.webm.

Files changed: 14
Additions: +482   Deletions: -118

`}<span className="quote">{`> The named-workspace approach maps better to how I actually
> think about context: not "1, 2, 3" but "site, comms, ai, mail".
> Curious to hear if the visual rhythm reads from the bar.`}</span>
{`

— Open in browser: https://github.com/markusj/jylhis/pull/42`}
        </div>
      </div>
      <div className="aerc-foot">
        <span><span className="key">j/k</span> next/prev</span>
        <span><span className="key">r</span> reply</span>
        <span><span className="key">R</span> reply-all</span>
        <span><span className="key">D</span> archive</span>
        <span><span className="key">/</span> search</span>
        <span style={{ marginLeft: 'auto', color: 'var(--color-text-faint)' }}>2 unread · 472 in inbox</span>
      </div>
    </div>
  );
}

function Spotty({ playing = true, progress = 38 }) {
  return (
    <div className="spotty">
      <div className="spotty-head">
        <span className="accent">spotify-tui</span>
        <span style={{ color: 'var(--color-text-faint)' }}>·</span>
        <span>markus@jylhis</span>
        <span style={{ marginLeft: 'auto', color: 'var(--color-text-faint)' }}>premium · CH</span>
      </div>
      <div className="spotty-body">
        <div className="spotty-side">
          <div className="group">library</div>
          <div className="row">recently played</div>
          <div className="row">liked songs</div>
          <div className="row">albums</div>
          <div className="row">artists</div>
          <div className="group">playlists</div>
          <div className="row cur">deep work</div>
          <div className="row">late night</div>
          <div className="row">commute</div>
          <div className="row">discover weekly</div>
        </div>
        <div className="spotty-tracks">
          <div className="row head"><span></span><span>title</span><span>album</span><span className="right">time</span></div>
          <div className="row"><span style={{ color: 'var(--color-text-faint)' }}>1</span><span className="title">Lava</span><span className="album">Lateralus</span><span className="right">4:38</span></div>
          <div className="row cur"><span style={{ color: 'var(--color-accent)' }}>►</span><span className="title">Vespers</span><span className="album">Strands</span><span className="right">5:12</span></div>
          <div className="row"><span style={{ color: 'var(--color-text-faint)' }}>3</span><span className="title">Glassworks I</span><span className="album">Glassworks</span><span className="right">6:24</span></div>
          <div className="row"><span style={{ color: 'var(--color-text-faint)' }}>4</span><span className="title">Underwater</span><span className="album">Helios</span><span className="right">3:48</span></div>
          <div className="row"><span style={{ color: 'var(--color-text-faint)' }}>5</span><span className="title">Anemone</span><span className="album">Helios</span><span className="right">4:01</span></div>
          <div className="row"><span style={{ color: 'var(--color-text-faint)' }}>6</span><span className="title">Karst</span><span className="album">Strands</span><span className="right">7:22</span></div>
        </div>
      </div>
      <div className="spotty-foot">
        <span className="now">{playing ? '▶' : '⏸'} Vespers <span className="by">— Strands · Anatole</span></span>
        <div className="progress"><div className="fill" style={{ width: `${progress}%` }} /></div>
        <span style={{ color: 'var(--color-text-faint)' }}>1:58 / 5:12</span>
      </div>
    </div>
  );
}

function Emacs() {
  const code = [
    { t: <><span className="key">import</span> <span className="tag">{`{ defineConfig }`}</span> <span className="key">from</span> <span className="str">'astro/config'</span>;</>, ln: 1 },
    { t: <><span className="key">import</span> mdx <span className="key">from</span> <span className="str">'@astrojs/mdx'</span>;</>, ln: 2 },
    { t: '', ln: 3 },
    { t: <><span className="com">// jylhis.com — personal site config.</span></>, ln: 4 },
    { t: <><span className="com">// Build pipeline reads notes/* and projects/* as content collections.</span></>, ln: 5 },
    { t: '', ln: 6 },
    { t: <><span className="key">export default</span> <span className="fn">defineConfig</span>(<span className="tag">{`{`}</span></>, ln: 7 },
    { t: <>  site: <span className="str">'https://jylhis.com'</span>,</>, ln: 8 },
    { t: <>  output: <span className="str">'static'</span>,</>, ln: 9 },
    { t: <>  integrations: [<span className="fn">mdx</span>(<span className="tag">{`{`}</span></>, ln: 10, cur: true },
    { t: <>    syntaxHighlight: <span className="str">'shiki'</span>,</>, ln: 11 },
    { t: <>    shikiConfig: <span className="tag">{`{ theme: 'jylhis-sheet' }`}</span>,</>, ln: 12 },
    { t: <>  <span className="tag">{`}`}</span>)],</>, ln: 13 },
    { t: <>  vite: <span className="tag">{`{`}</span></>, ln: 14 },
    { t: <>    css: <span className="tag">{`{ devSourcemap: true }`}</span>,</>, ln: 15 },
    { t: <>  <span className="tag">{`}`}</span></>, ln: 16 },
    { t: <><span className="tag">{`}`}</span>);</>, ln: 17 },
  ];
  return (
    <div className="emacs">
      <div className="emacs-tabbar">
        <div className="tab active">astro.config.mjs</div>
        <div className="tab">notes/desktop.md</div>
        <div className="tab">styles/global.css</div>
        <div className="tab">*magit: jylhis-site*</div>
      </div>
      <div className="emacs-body">
        <div className="emacs-gutter">
          {code.map((r) => (
            <div key={r.ln} className={`ln ${r.cur ? 'cur' : ''}`}>{r.ln}</div>
          ))}
        </div>
        <div className="emacs-edit">
          {code.map((r) => (
            <div key={r.ln} className={`row ${r.cur ? 'sel-line' : ''}`}>
              {r.t || '\u00A0'}
              {r.cur && <span className="point">&nbsp;</span>}
            </div>
          ))}
        </div>
      </div>
      <div className="modeline">
        <span className="seg buf">▸ astro.config.mjs</span>
        <span className="seg mode">[JS-TS]</span>
        <span className="seg git">⎇ main !2</span>
        <span className="seg flycheck">▲ 1</span>
        <span className="right" style={{ color: 'var(--color-text-faint)' }}>L10:C20  17%</span>
      </div>
      <div className="minibuffer">
        <span className="prompt">M-x</span>
        <span style={{ color: 'var(--color-text-faint)' }}>type to search commands…</span>
      </div>
    </div>
  );
}

Object.assign(window, { Terminal, Btop, Yazi, Aerc, Spotty, Emacs });
