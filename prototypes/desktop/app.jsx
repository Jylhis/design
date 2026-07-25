/* global React, ReactDOM, Frame, Terminal, Commander, Monitor, NowPanel, MenuBar, FKeyBar, WhichKey, Help, Launcher, useTweaks, TweaksPanel, TweakSection, TweakRadio, TweakSelect, TweakSlider, TweakToggle */

const { useState, useEffect, useLayoutEffect, useRef, useMemo, useCallback } = React;

// ── Windows + spatial focus map ──
const WINDOWS = ['cmdr', 'term', 'mon', 'now'];
const NEIGHBORS = {
  cmdr: { l: 'term' },
  term: { h: 'cmdr', l: 'mon' },
  mon:  { h: 'term', j: 'now' },
  now:  { h: 'term', k: 'mon' },
};
const NUM_TO_WIN = { '1': 'cmdr', '2': 'term', '3': 'mon', '4': 'now' };

// ── Terminal command vocabulary (for suggestions + run) ──
const COMMANDS = [
  { k: 'help',     d: 'show what you can do here' },
  { k: 'ls',       d: 'list ~/projects/jylhis' },
  { k: 'about',    d: 'about this desktop' },
  { k: 'theme',    d: 'toggle sheet / field' },
  { k: 'launch',   d: 'open the command launcher' },
  { k: 'date',     d: 'current date & time' },
  { k: 'clear',    d: 'clear the screen' },
];

// ── Launcher catalogue ──
const LAUNCH_ITEMS = [
  { kind: 'app',  ic: '▸', label: 'terminal',   desc: 'zsh · ghostty',     hint: 'F9',    action: 'focus-term' },
  { kind: 'app',  ic: '▸', label: 'commander',  desc: 'dual-pane files',   hint: 'F2',    action: 'focus-cmdr' },
  { kind: 'app',  ic: '▸', label: 'monitor',    desc: 'btop · resources',  hint: '',      action: 'focus-mon' },
  { kind: 'app',  ic: '▸', label: 'now playing',desc: 'music · agenda',    hint: '',      action: 'focus-now' },
  { kind: 'file', ic: '·', label: 'astro.config.mjs', desc: 'recent · 2m', hint: '⏎',    action: 'focus-cmdr' },
  { kind: 'file', ic: '·', label: 'notes/desktop.md', desc: 'recent · 18m', hint: '⏎',   action: 'focus-cmdr' },
  { kind: 'act',  ic: '◆', label: 'toggle theme',  desc: 'sheet ↔ field',  hint: 'T',     action: 'theme' },
  { kind: 'act',  ic: '◆', label: 'cycle wallpaper',desc: 'hatch · dots · scan', hint: 'w', action: 'wall-cycle' },
  { kind: 'act',  ic: '◆', label: 'keyboard help',  desc: 'full reference', hint: 'F1',    action: 'help' },
];

const WALLPAPERS = ['hatch', 'dots', 'scan', 'none'];

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "theme": "light",
  "wallpaper": "hatch",
  "density": "comfortable",
  "fontMono": "IBM Plex Mono",
  "fontBody": "Hanken Grotesk",
  "centerWide": true
}/*EDITMODE-END*/;

function App() {
  const [tweaks, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const [focus, setFocus] = useState('term');
  const [overlay, setOverlay] = useState(null); // 'help' | 'whichkey' | 'launcher'
  const [openMenu, setOpenMenu] = useState(null);
  const [armedFkey, setArmedFkey] = useState(null);
  const [toasts, setToasts] = useState([]);

  // terminal state
  const [transcript, setTranscript] = useState([
    { out: [
      <span className="banner">▞▞  J Y L H I S  ·  tui desktop</span>,
      <span className="dim">────────────────────────────────────────────</span>,
      <span className="dim">no graphics — every window is a terminal.</span>,
      <span className="dim">type <span className="fn">help</span>, or press <span className="accent">Space</span> for which-key.</span>,
    ]},
    { cmd: 'just dev', out: [
      <span><span className="ok">✓</span> astro <span className="num">5.2</span> dev server ready on <span className="info">localhost:4321</span></span>,
      <span className="dim">  watching src/ · 14 routes · press : to type a command</span>,
    ]},
  ]);
  const [input, setInput] = useState('');

  // launcher state
  const [launchQuery, setLaunchQuery] = useState('');
  const [launchSel, setLaunchSel] = useState(0);

  // ── theme ──
  const theme = tweaks.theme === 'dark' ? 'dark' : 'light';
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);
  const toggleTheme = useCallback(() => setTweak('theme', theme === 'dark' ? 'light' : 'dark'), [theme, setTweak]);

  // ── fonts ──
  useEffect(() => {
    document.documentElement.style.setProperty('--font-mono', `"${tweaks.fontMono}", "IBM Plex Mono", "Cascadia Code", monospace`);
    document.documentElement.style.setProperty('--font-body', `"${tweaks.fontBody}", Charter, Georgia, serif`);
  }, [tweaks.fontMono, tweaks.fontBody]);

  // ── clock + live resources ──
  const [now, setNow] = useState(() => new Date());
  const [cpu, setCpu] = useState(34);
  const [mem, setMem] = useState(58);
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000 * 20);
    const r = setInterval(() => {
      setCpu((c) => Math.max(8, Math.min(92, c + Math.round((Math.random() - 0.5) * 10))));
      setMem((m) => Math.max(40, Math.min(82, m + Math.round((Math.random() - 0.5) * 4))));
    }, 2600);
    return () => { clearInterval(t); clearInterval(r); };
  }, []);
  const hh = String(now.getHours()).padStart(2, '0');
  const mm = String(now.getMinutes()).padStart(2, '0');
  const timeStr = `${hh}:${mm}`;
  const dateStr = now.toLocaleDateString('en-GB', { weekday: 'short', day: '2-digit', month: 'short' }).toLowerCase();

  // ── stage scaler ──
  const [scale, setScale] = useState(() => Math.min(window.innerWidth / 1920, window.innerHeight / 1080));
  useLayoutEffect(() => {
    const fit = () => {
      const w = document.documentElement.clientWidth || window.innerWidth;
      const h = document.documentElement.clientHeight || window.innerHeight;
      setScale(Math.min(w / 1920, h / 1080));
    };
    fit();
    window.addEventListener('resize', fit);
    window.addEventListener('orientationchange', fit);
    return () => {
      window.removeEventListener('resize', fit);
      window.removeEventListener('orientationchange', fit);
    };
  }, []);

  // ── toast helper ──
  const pushToast = useCallback((t, b) => {
    const id = Math.random().toString(36).slice(2);
    setToasts((list) => [...list, { id, t, b }]);
    setTimeout(() => setToasts((list) => list.filter((x) => x.id !== id)), 2600);
  }, []);

  // ── terminal command runner ──
  const runCommand = useCallback((raw) => {
    const cmd = raw.trim();
    const lower = cmd.toLowerCase();
    let out = null;
    if (lower === 'clear') { setTranscript([]); setInput(''); return; }
    if (lower === '' ) { out = []; }
    else if (lower === 'help') {
      out = [
        <span className="accent">commands</span>,
        ...COMMANDS.map((c) => <span><span className="fn">{c.k.padEnd(8)}</span><span className="dim">{c.d}</span></span>),
        <span className="dim">— or press <span className="accent">Space</span> for which-key, <span className="accent">F1</span> for full help.</span>,
      ];
    } else if (lower === 'ls' || lower === 'ls -l') {
      out = [
        <span><span className="ty">drwxr-xr-x</span>  jylhis-site/   <span className="dim">astro.config.mjs, src/</span></span>,
        <span><span className="ty">drwxr-xr-x</span>  design-system/ <span className="dim">tokens.json, platforms/</span></span>,
        <span><span className="ty">drwxr-xr-x</span>  desktop-tui/   <span className="dim">src/, shortcuts/</span></span>,
        <span><span className="str">-rwxr-xr-x</span>  build.sh       <span className="dim">2.1K</span></span>,
        <span><span className="fn">-rw-r--r--</span>  README.md      <span className="dim">6.0K</span></span>,
      ];
    } else if (lower === 'about' || lower === 'neofetch') {
      out = [
        <span><span className="accent">     ▞▚     </span>  <span className="ty">jylhis</span><span className="dim">@</span><span className="ty">desktop</span></span>,
        <span><span className="accent">    ▞  ▚    </span>  <span className="dim">os</span>     nixos · hyprland</span>,
        <span><span className="accent">   ▞ ▞▚ ▚   </span>  <span className="dim">wm</span>     tui-desktop (tmux-like)</span>,
        <span><span className="accent">  ▞▖    ▗▚  </span>  <span className="dim">shell</span>  zsh · starship</span>,
        <span><span className="accent">  ▝▘▘▘▘▘▘▝▘ </span>  <span className="dim">theme</span>  jylhis · {theme === 'dark' ? 'field' : 'sheet'}</span>,
        <span className="dim">  one accent (bronze) · monospace · no graphics.</span>,
      ];
    } else if (lower.startsWith('theme')) {
      const arg = lower.split(/\s+/)[1];
      const next = arg === 'field' ? 'dark' : arg === 'sheet' ? 'light' : (theme === 'dark' ? 'light' : 'dark');
      setTweak('theme', next);
      out = [<span><span className="ok">✓</span> switched to <span className="accent">{next === 'dark' ? 'field' : 'sheet'}</span> · every surface follows</span>];
    } else if (lower === 'launch' || lower === 'apps') {
      setInput(''); setOverlay('launcher'); setLaunchQuery(''); setLaunchSel(0); return;
    } else if (lower === 'date') {
      out = [<span className="dim">{now.toString()}</span>];
    } else {
      out = [<span><span className="err">zsh:</span> command not found: {cmd} <span className="dim">— try </span><span className="fn">help</span></span>];
    }
    setTranscript((t) => [...t, { cmd: cmd, out }]);
    setInput('');
  }, [theme, setTweak, now]);

  // ── action dispatch (menus, fkeys, launcher) ──
  const doAction = useCallback((action) => {
    if (!action || action === 'noop') return;
    if (action.startsWith('wall:')) { setTweak('wallpaper', action.slice(5)); return; }
    if (action.startsWith('dens:')) { setTweak('density', action.slice(5)); return; }
    switch (action) {
      case 'help': setOverlay('help'); break;
      case 'whichkey': setOverlay('whichkey'); break;
      case 'launcher': setOverlay('launcher'); setLaunchQuery(''); setLaunchSel(0); break;
      case 'theme': toggleTheme(); break;
      case 'wall-cycle': {
        const i = WALLPAPERS.indexOf(tweaks.wallpaper);
        setTweak('wallpaper', WALLPAPERS[(i + 1) % WALLPAPERS.length]);
        break;
      }
      case 'focus-term': setFocus('term'); setOverlay(null); break;
      case 'focus-cmdr': setFocus('cmdr'); setOverlay(null); break;
      case 'focus-mon': setFocus('mon'); setOverlay(null); break;
      case 'focus-now': setFocus('now'); setOverlay(null); break;
      case 'focus-next': {
        setFocus((f) => WINDOWS[(WINDOWS.indexOf(f) + 1) % WINDOWS.length]);
        break;
      }
      case 'reload': pushToast('config', 'reloaded ~/.config/desktop'); break;
      case 'lock': pushToast('session', 'lock is a no-op in the demo'); break;
      case 'quit': pushToast('quit', 'returned to console (demo)'); break;
      default: break;
    }
  }, [toggleTheme, tweaks.wallpaper, setTweak, pushToast]);

  // ── filtered launcher items ──
  const launchItems = useMemo(() => {
    const q = launchQuery.trim().toLowerCase();
    if (!q) return LAUNCH_ITEMS;
    return LAUNCH_ITEMS.filter((it) =>
      it.label.toLowerCase().includes(q) || it.desc.toLowerCase().includes(q) || it.kind.includes(q));
  }, [launchQuery]);
  useEffect(() => { setLaunchSel((s) => Math.min(s, Math.max(0, launchItems.length - 1))); }, [launchItems.length]);

  // ── terminal suggestions ──
  const suggestions = useMemo(() => {
    const q = input.trim().toLowerCase();
    if (!q) return null;
    return COMMANDS.filter((c) => c.k.startsWith(q)).slice(0, 4);
  }, [input]);

  // ── flash a function key when its action fires ──
  const flashFkey = useCallback((n) => {
    setArmedFkey(n);
    setTimeout(() => setArmedFkey((cur) => (cur === n ? null : cur)), 180);
  }, []);

  // ── global keyboard ──
  useEffect(() => {
    const onKey = (e) => {
      const tag = (e.target && e.target.tagName) || '';
      const inField = tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT';

      // Function keys are always live
      const fmatch = /^F(\d{1,2})$/.exec(e.key);
      if (fmatch) {
        const n = parseInt(fmatch[1], 10);
        const map = { 1: 'help', 2: 'whichkey', 3: 'focus-cmdr', 4: 'focus-cmdr', 5: 'launcher', 6: 'theme', 7: 'focus-cmdr', 8: 'focus-mon', 9: 'focus-term', 10: 'quit' };
        if (map[n]) { e.preventDefault(); flashFkey(n); doAction(map[n]); }
        return;
      }

      // Overlay handling
      if (overlay) {
        if (e.key === 'Escape') { e.preventDefault(); setOverlay(null); return; }
        if (overlay === 'launcher') {
          if (e.key === 'ArrowDown') { e.preventDefault(); setLaunchSel((s) => Math.min(launchItems.length - 1, s + 1)); }
          else if (e.key === 'ArrowUp') { e.preventDefault(); setLaunchSel((s) => Math.max(0, s - 1)); }
          else if (e.key === 'Enter') { e.preventDefault(); const it = launchItems[launchSel]; setOverlay(null); if (it) doAction(it.action); }
          else if (e.key === 'Backspace') { e.preventDefault(); setLaunchQuery((q) => q.slice(0, -1)); }
          else if (e.key.length === 1 && !e.metaKey && !e.ctrlKey) { e.preventDefault(); setLaunchQuery((q) => q + e.key); setLaunchSel(0); }
        }
        return;
      }

      if (openMenu && e.key === 'Escape') { setOpenMenu(null); return; }
      if (inField) return;

      // Terminal focused → typing goes to the shell
      if (focus === 'term') {
        if (e.key === 'Enter') { e.preventDefault(); runCommand(input); return; }
        if (e.key === 'Backspace') { e.preventDefault(); setInput((s) => s.slice(0, -1)); return; }
        if (e.key === 'Escape') { e.preventDefault(); setInput(''); return; }
        if (e.key === 'ArrowLeft') { e.preventDefault(); setFocus('cmdr'); return; }
        if (e.key === 'ArrowRight') { e.preventDefault(); setFocus('mon'); return; }
        if (e.key === 'Tab') { e.preventDefault(); doAction('focus-next'); return; }
        if (e.key.length === 1 && !e.metaKey && !e.ctrlKey && !e.altKey) { e.preventDefault(); setInput((s) => s + e.key); return; }
        return;
      }

      // Other windows focused → vim/arrow navigation + chords
      const dirKey = { h: 'h', j: 'j', k: 'k', l: 'l', ArrowLeft: 'h', ArrowDown: 'j', ArrowUp: 'k', ArrowRight: 'l' }[e.key];
      if (dirKey) {
        e.preventDefault();
        const nxt = NEIGHBORS[focus] && NEIGHBORS[focus][dirKey];
        if (nxt) setFocus(nxt);
        return;
      }
      if (e.key === 'Tab') { e.preventDefault(); doAction('focus-next'); return; }
      if (NUM_TO_WIN[e.key]) { e.preventDefault(); setFocus(NUM_TO_WIN[e.key]); return; }
      if (e.key === ' ') { e.preventDefault(); setOverlay('whichkey'); return; }
      if (e.key === ':' || e.key === '/') { e.preventDefault(); setFocus('term'); return; }
      if (e.key === '?') { e.preventDefault(); setOverlay('help'); return; }
      if (e.key === 't' || e.key === 'T') { e.preventDefault(); toggleTheme(); return; }
      if (e.key === 'w') { e.preventDefault(); doAction('wall-cycle'); return; }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [overlay, openMenu, focus, input, launchItems, launchSel, runCommand, doAction, toggleTheme, flashFkey]);

  // ── window definitions ──
  const wide = tweaks.centerWide;
  const fieldStyle = {
    '--col-l': wide ? '5fr' : '6fr',
    '--col-c': wide ? '7.5fr' : '6fr',
    '--col-r': '4fr',
  };

  return (
    <div className="viewport">
      <div className="scaler" style={{ width: Math.round(1920 * scale), height: Math.round(1080 * scale) }}>
        <div
          className={`screen ${tweaks.density === 'compact' ? 'compact' : ''}`}
          style={{ transform: `scale(${scale})` }}
          data-screen-label="tui-desktop"
        >
          <MenuBar
            openMenu={openMenu}
            onOpenMenu={setOpenMenu}
            onAction={doAction}
            time={timeStr}
            date={dateStr}
            theme={theme}
            onToggleTheme={toggleTheme}
            cpu={cpu}
            mem={mem}
          />

          <div className="desktop" onClick={() => setOpenMenu(null)}>
            <div className={`wall ${tweaks.wallpaper}`} />
            <div className="field" style={fieldStyle}>
              <Frame
                title="commander" tag="~/projects/jylhis"
                hint={focus === 'cmdr' ? 'F3 view · F4 edit' : '2'}
                focused={focus === 'cmdr'}
                gridStyle={{ gridColumn: 1, gridRow: '1 / span 2' }}
                onClick={() => setFocus('cmdr')}
              >
                <Commander cursor={1} />
              </Frame>

              <Frame
                title="terminal" tag="zsh"
                hint={focus === 'term' ? 'type · ⏎ run · F1 help' : 'F9'}
                focused={focus === 'term'}
                gridStyle={{ gridColumn: 2, gridRow: '1 / span 2' }}
                onClick={() => setFocus('term')}
              >
                <Terminal transcript={transcript} input={input} focused={focus === 'term'} suggestions={suggestions} />
              </Frame>

              <Frame
                title="monitor" tag="btop"
                hint={focus === 'mon' ? 'live' : '3'}
                focused={focus === 'mon'}
                gridStyle={{ gridColumn: 3, gridRow: 1 }}
                onClick={() => setFocus('mon')}
              >
                <Monitor cpu={cpu} mem={mem} />
              </Frame>

              <Frame
                title="now" tag="music · agenda"
                hint={focus === 'now' ? '♪' : '4'}
                focused={focus === 'now'}
                gridStyle={{ gridColumn: 3, gridRow: 2 }}
                onClick={() => setFocus('now')}
              >
                <NowPanel />
              </Frame>
            </div>

            {toasts.length > 0 && (
              <div className="toasts">
                {toasts.map((t) => (
                  <div key={t.id} className="toast"><div className="t">{t.t}</div><div className="b">{t.b}</div></div>
                ))}
              </div>
            )}

            {overlay === 'help' && <Help onClose={() => setOverlay(null)} />}
            {overlay === 'whichkey' && <WhichKey onClose={() => setOverlay(null)} />}
            {overlay === 'launcher' && (
              <Launcher query={launchQuery} items={launchItems} selected={launchSel} onClose={() => setOverlay(null)} />
            )}
          </div>

          <FKeyBar onAction={(a) => doAction(a)} armed={armedFkey} />
        </div>
      </div>

      <TweaksPanel title="Tweaks">
        <TweakSection label="theme">
          <TweakRadio label="mode" value={tweaks.theme} onChange={(v) => setTweak('theme', v)} options={[
            { value: 'light', label: 'sheet' },
            { value: 'dark', label: 'field' },
          ]} />
          <TweakSelect label="wallpaper" value={tweaks.wallpaper} onChange={(v) => setTweak('wallpaper', v)} options={[
            { value: 'hatch', label: 'hatch ╱╱' },
            { value: 'dots', label: 'dot grid' },
            { value: 'scan', label: 'scanline' },
            { value: 'none', label: 'none' },
          ]} />
        </TweakSection>

        <TweakSection label="layout">
          <TweakRadio label="density" value={tweaks.density} onChange={(v) => setTweak('density', v)} options={[
            { value: 'comfortable', label: 'comfortable' },
            { value: 'compact', label: 'compact' },
          ]} />
          <TweakToggle label="wide terminal" value={tweaks.centerWide} onChange={(v) => setTweak('centerWide', v)} />
        </TweakSection>

        <TweakSection label="type">
          <TweakSelect label="mono" value={tweaks.fontMono} onChange={(v) => setTweak('fontMono', v)} options={[
            { value: 'IBM Plex Mono', label: 'IBM Plex Mono' },
            { value: 'JetBrains Mono', label: 'JetBrains Mono' },
            { value: 'Fira Code', label: 'Fira Code' },
          ]} />
          <TweakSelect label="body" value={tweaks.fontBody} onChange={(v) => setTweak('fontBody', v)} options={[
            { value: 'Hanken Grotesk', label: 'Hanken Grotesk' },
            { value: 'Inter', label: 'Inter' },
            { value: 'system-ui', label: 'system-ui' },
          ]} />
        </TweakSection>

        <TweakSection label="discover">
          <div style={{ fontSize: 11.5, color: 'var(--color-text-muted)', lineHeight: 1.5 }}>
            <div><span style={{ color: 'var(--color-accent)' }}>F1</span> help · <span style={{ color: 'var(--color-accent)' }}>Space</span> which-key</div>
            <div><span style={{ color: 'var(--color-accent)' }}>hjkl</span> move focus · <span style={{ color: 'var(--color-accent)' }}>:</span> command</div>
            <div>focus the terminal and just type — try <span style={{ color: 'var(--color-accent)' }}>help</span></div>
          </div>
        </TweakSection>
      </TweaksPanel>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
