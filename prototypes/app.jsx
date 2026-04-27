/* global React, ReactDOM, Bar, Whisper, Palette, Cheatsheet, Walkthrough, Toasts, Terminal, Btop, Yazi, Aerc, Spotty, Emacs, Browser, Slack, AIPanel, useTweaks, TweaksPanel, TweakSection, TweakSlider, TweakToggle, TweakRadio, TweakSelect */

const { useState, useEffect, useMemo, useRef } = React;

// ── Scenarios — a "day in the life" walkthrough ──
// Each scene defines: workspace, layout (windows + positions), overlays, narration.
const SCENES = [
  {
    id: 'morning',
    title: '08:42 — morning · site',
    body: 'Workspace 1 "site". Emacs on the left edits astro.config.mjs. Ghostty runs the dev server. Tiling is split-vertical.',
    ws: 'site',
    music: { title: 'Vespers', by: '— Strands · Anatole', playing: true },
    lastCmd: 'npm run dev',
    aiSuggestion: 'idle',
    layout: 'site-split',
    overlay: null,
  },
  {
    id: 'palette',
    title: '08:48 — Super+Space · command palette',
    body: 'One unified palette: apps, open windows, files, workspaces, AI prompts, web search, system actions. Tab cycles the kind filter.',
    ws: 'site',
    music: { title: 'Vespers', by: '— Strands · Anatole', playing: true },
    lastCmd: 'npm run dev',
    aiSuggestion: 'idle',
    layout: 'site-split',
    overlay: 'palette',
    paletteQuery: 'note',
  },
  {
    id: 'leader',
    title: '08:51 — Super held · which-key',
    body: 'Hold Super (the leader). A bottom-anchored cheatsheet appears with apps, windows, workspaces, AI, system. The same keymap drives Emacs (SPC), Hyprland (Super) and rofi.',
    ws: 'site',
    music: { title: 'Vespers', by: '— Strands · Anatole', playing: true },
    lastCmd: 'npm run dev',
    aiSuggestion: 'idle',
    layout: 'site-split',
    overlay: 'cheatsheet',
  },
  {
    id: 'ai-inline',
    title: '09:03 — Super+; · ask Claude',
    body: 'Selection in Emacs is captured. AI summons as a side-panel docked to the right, citing the exact lines. No copy-paste, no context loss.',
    ws: 'site',
    music: { title: 'Vespers', by: '— Strands · Anatole', playing: true },
    lastCmd: 'npm run dev',
    aiSuggestion: 'drafting answer · 12s',
    layout: 'site-ai',
    overlay: null,
  },
  {
    id: 'comms',
    title: '10:30 — Super+2 · comms',
    body: 'Slide-fade to workspace 2 "comms". Slack and Aerc are pre-tiled. Notifications collected here, never on workspace 1.',
    ws: 'comms',
    music: { title: 'Glassworks I', by: '— Glassworks · P. Glass', playing: true },
    lastCmd: 'mbsync --all',
    aiSuggestion: 'idle',
    layout: 'comms-tile',
    overlay: null,
    toasts: [
      { kind: 'info', title: 'github · pr review', body: 'Anna requested your review on PR #42' },
      { kind: 'ok', title: 'cloudflare', body: 'Build succeeded for jylhis.com' },
    ],
  },
  {
    id: 'browse',
    title: '11:14 — Super+3 · research',
    body: 'Workspace 3 "research". Chromeless qutebrowser. Press f and link hints appear — every clickable link gets a 2-letter overlay.',
    ws: 'research',
    music: { title: 'Glassworks I', by: '— Glassworks · P. Glass', playing: true },
    lastCmd: 'qutebrowser',
    aiSuggestion: 'idle',
    layout: 'research',
    overlay: null,
    browserHints: true,
  },
  {
    id: 'system',
    title: '13:18 — Super+4 · system',
    body: 'Workspace 4 "system". btop + yazi + spotify-tui side-by-side. Everything runs in Ghostty splits — no GUI panels, just keys.',
    ws: 'system',
    music: { title: 'Karst', by: '— Strands · Anatole', playing: true },
    lastCmd: 'systemctl --user status',
    aiSuggestion: 'idle',
    layout: 'system',
    overlay: null,
  },
  {
    id: 'theme',
    title: '17:50 — Super+Shift+T · roast',
    body: 'One bind flips paper to roast. Hyprland, Waybar, Emacs, Ghostty, GTK, every TUI — all switch in 250ms. The accent stays copper; only the surface changes.',
    ws: 'site',
    music: { title: 'Underwater', by: '— Helios', playing: true },
    lastCmd: 'jylhis-toggle-theme',
    aiSuggestion: 'idle',
    layout: 'site-ai',
    overlay: null,
    forceTheme: 'dark',
  },
];

// ── Layouts: where each window goes per scene ──
// Coordinates in design-px (1920x1080), bar adds offset.
function getLayout(name, barTop, barBottom) {
  const W = 1920, H = 1080;
  const top = barTop;
  const bot = barBottom;
  const usableH = H - top - bot - 22; // 22 for whisper bar
  const gap = 8;

  const inner = { x: 0, y: top, w: W, h: usableH };

  switch (name) {
    case 'site-split': {
      const half = (inner.w - gap * 3) / 2;
      return [
        { id: 'emacs', x: gap, y: inner.y + gap, w: half, h: inner.h - gap * 2, app: 'emacs', title: 'emacs · astro.config.mjs', path: '~/projects/jylhis-site' },
        { id: 'term', x: gap * 2 + half, y: inner.y + gap, w: half, h: (inner.h - gap * 3) / 2, app: 'term', title: 'ghostty · npm run dev', path: 'tmux: jylhis [1]' },
        { id: 'btop', x: gap * 2 + half, y: inner.y + gap * 2 + (inner.h - gap * 3) / 2, w: half, h: (inner.h - gap * 3) / 2, app: 'btop', title: 'ghostty · btop', path: 'tmux: jylhis [2]' },
      ];
    }
    case 'site-ai': {
      const colA = (inner.w - gap * 4) * 0.38;
      const colB = (inner.w - gap * 4) * 0.32;
      const colC = (inner.w - gap * 4) * 0.30;
      return [
        { id: 'emacs', x: gap, y: inner.y + gap, w: colA, h: inner.h - gap * 2, app: 'emacs', title: 'emacs · astro.config.mjs', path: '~/projects/jylhis-site', focused: true },
        { id: 'term', x: gap * 2 + colA, y: inner.y + gap, w: colB, h: inner.h - gap * 2, app: 'term', title: 'ghostty · npm run dev', path: 'tmux: jylhis' },
        { id: 'ai', x: gap * 3 + colA + colB, y: inner.y + gap, w: colC, h: inner.h - gap * 2, app: 'ai-selection', title: 'claude · with selection', path: 'L10–L13 · astro.config.mjs' },
      ];
    }
    case 'comms-tile': {
      const half = (inner.w - gap * 3) / 2;
      return [
        { id: 'slack', x: gap, y: inner.y + gap, w: half, h: inner.h - gap * 2, app: 'slack', title: 'slack · #desktop-env', path: 'jylhis · 4 members', focused: true },
        { id: 'aerc', x: gap * 2 + half, y: inner.y + gap, w: half, h: inner.h - gap * 2, app: 'aerc', title: 'aerc · INBOX', path: 'imap · 472 messages' },
      ];
    }
    case 'research': {
      return [
        { id: 'browser', x: gap, y: inner.y + gap, w: inner.w * 0.66 - gap, h: inner.h - gap * 2, app: 'browser', title: 'qutebrowser', path: '4 tabs', focused: true },
        { id: 'ai', x: inner.w * 0.66 + gap, y: inner.y + gap, w: inner.w * 0.34 - gap * 2, h: inner.h - gap * 2, app: 'ai', title: 'claude · research panel', path: 'context: tab 1' },
      ];
    }
    case 'system': {
      const third = (inner.w - gap * 4) / 3;
      return [
        { id: 'btop', x: gap, y: inner.y + gap, w: third, h: inner.h - gap * 2, app: 'btop', title: 'ghostty · btop', path: 'tmux: sys [1]' },
        { id: 'yazi', x: gap * 2 + third, y: inner.y + gap, w: third, h: inner.h - gap * 2, app: 'yazi', title: 'ghostty · yazi', path: 'tmux: sys [2]', focused: true },
        { id: 'spotty', x: gap * 3 + third * 2, y: inner.y + gap, w: third, h: inner.h - gap * 2, app: 'spotty', title: 'ghostty · spotify-tui', path: 'tmux: sys [3]' },
      ];
    }
    default: return [];
  }
}

// ── App router ──
function AppContent({ app, scene }) {
  switch (app) {
    case 'emacs': return <Emacs />;
    case 'term': return <Terminal />;
    case 'btop': return <Btop />;
    case 'browser': return <Browser showHints={scene.browserHints} />;
    case 'slack': return <Slack />;
    case 'ai': return <AIPanel mode="panel" />;
    case 'ai-selection': return <AIPanel mode="panel" withSelection />;
    case 'yazi': return <Yazi />;
    case 'aerc': return <Aerc />;
    case 'spotty': return <Spotty />;
    default: return <div className="tui">empty</div>;
  }
}

// ── EXPERIMENT: Magnet rooms — named layout templates ──
const ROOMS = [
  { id: 'forge', name: 'forge',   key: 'f', glyph: '⚒', desc: 'editor + terminal + monitor', layout: 'site-split' },
  { id: 'pair',  name: 'pair',    key: 'p', glyph: '◆', desc: 'editor + AI side-dock',       layout: 'site-ai' },
  { id: 'talk',  name: 'talk',    key: 't', glyph: '✎', desc: 'slack + mail',                 layout: 'comms-tile' },
  { id: 'read',  name: 'read',    key: 'r', glyph: '☰', desc: 'browser + AI research',        layout: 'research' },
  { id: 'tend',  name: 'tend',    key: 's', glyph: '◉', desc: 'btop + files + music',         layout: 'system' },
];

// ── EXPERIMENT: Prose ticker — system state as a sentence ──
function proseFor(scene, music, room) {
  const phrases = {
    'morning':   <>You're in <span className="em">forge</span>; <span className="accent">{music?.title}</span> is playing, and <span className="em">vite</span> reports the dev server is healthy on <span className="num-prose">:4321</span>.</>,
    'palette':   <>The <span className="accent">command palette</span> is open — <span className="em">{19}</span> matches across apps, windows, files, AI and the web.</>,
    'leader':    <>Holding <span className="accent">Super</span>; the leader cheatsheet is the same map Emacs and rofi already speak.</>,
    'ai-inline': <>Claude is <span className="accent">drafting</span> against your selection in <span className="em">astro.config.mjs</span>; the buffer scrolls with you.</>,
    'comms':     <>You stepped into <span className="em">talk</span>; <span className="accent">2 unread</span> in #desktop-env, and Anna left a review on <span className="em">PR #42</span>.</>,
    'browse':    <>You're <span className="em">reading</span> the Astro docs; press <span className="accent">f</span> and every link gains a 2-letter handle.</>,
    'system':    <>The machine is at <span className="num-prose">34%</span> CPU, <span className="num-prose">58%</span> memory; <span className="accent">{music?.title}</span> is keeping you company.</>,
    'theme':     <>You flipped the world to <span className="accent">roast</span> with one bind — every surface followed in a quarter-second.</>,
  };
  return phrases[scene.id] || <>jylhis · desktop</>;
}

// ── EXPERIMENT: Annotation layer — ephemeral ink ──
function InkLayer({ active, scene }) {
  if (!active) return null;
  // Annotations keyed to scene
  const data = {
    'ai-inline': {
      arrow: { from: { x: 480, y: 480 }, to: { x: 1380, y: 380 } },
      note:  { x: 1100, y: 470, who: 'self · 2m ago', text: '"shikiConfig should listen to data-theme — see Claude\'s suggestion" — pin to revisit' }
    },
    'comms': {
      arrow: { from: { x: 1100, y: 280 }, to: { x: 1530, y: 220 } },
      note:  { x: 1180, y: 320, who: 'self · 11m ago', text: 'Anna\'s review touches the same lines — reply after lunch' }
    },
    'morning': {
      arrow: { from: { x: 540, y: 470 }, to: { x: 1050, y: 380 } },
      note:  { x: 660, y: 520, who: 'self · 14:03', text: 'these two themes share token names — single source of truth, easy to extend' }
    },
  }[scene.id];

  if (!data) {
    return (
      <div className="ink-layer">
        <div className="ink-note" style={{ left: 880, top: 60 }}>
          <div className="meta"><span className="accent">ink mode</span><span>super+a draws · super+n note · esc clears</span></div>
          ephemeral annotations live here; they decay in 30s unless pinned.
        </div>
      </div>
    );
  }

  const { arrow, note } = data;
  const dx = arrow.to.x - arrow.from.x;
  const dy = arrow.to.y - arrow.from.y;
  const cx = arrow.from.x + dx * 0.4;
  const cy = arrow.from.y + dy * 0.2 - 60;
  const angle = Math.atan2(arrow.to.y - cy, arrow.to.x - cx) * 180 / Math.PI;

  return (
    <div className="ink-layer">
      <svg viewBox="0 0 1920 1080" preserveAspectRatio="none">
        <g className="ink-arrow">
          <path d={`M ${arrow.from.x} ${arrow.from.y} Q ${cx} ${cy} ${arrow.to.x} ${arrow.to.y}`} />
          <polygon className="head" points="-10,-5 0,0 -10,5" transform={`translate(${arrow.to.x} ${arrow.to.y}) rotate(${angle})`} />
        </g>
      </svg>
      <div className="ink-note" style={{ left: note.x, top: note.y }}>
        <div className="pin">★</div>
        <div className="meta"><span className="accent">{note.who}</span></div>
        {note.text}
      </div>
    </div>
  );
}

// ── EXPERIMENT: niri-style scrolling strip ──
// Each scene declares a "strip" — a list of columns wider than the viewport,
// plus which one has focus. We translate the strip so the focused column centers.
// Width presets: third / half / two-thirds / full of the viewport.
const STRIP_SCENES = {
  'site-split': {
    cols: [
      { id: 'notes',  app: 'aerc',    title: 'aerc · drafts',      width: 'third',     focused: false },
      { id: 'emacs',  app: 'emacs',   title: 'emacs · astro.config.mjs', path: '~/projects/jylhis-site', width: 'half',      focused: false },
      { id: 'term',   app: 'term',    title: 'ghostty · npm run dev',    path: 'tmux: jylhis [1]',     width: 'third',     focused: true },
      { id: 'btop',   app: 'btop',    title: 'ghostty · btop',           path: 'tmux: jylhis [2]',     width: 'third',     focused: false },
      { id: 'browse', app: 'browser', title: 'qutebrowser',              path: '4 tabs',               width: 'half',      focused: false },
    ],
    focusIdx: 2,
  },
  'site-ai': {
    cols: [
      { id: 'emacs',  app: 'emacs',         title: 'emacs · astro.config.mjs', path: '~/projects/jylhis-site', width: 'half',  focused: true },
      { id: 'term',   app: 'term',          title: 'ghostty · npm run dev',    path: 'tmux: jylhis',         width: 'third', focused: false },
      { id: 'ai',     app: 'ai-selection',  title: 'claude · with selection',  path: 'L10–L13',              width: 'third', focused: false },
      { id: 'browse', app: 'browser',       title: 'qutebrowser',              path: '4 tabs',               width: 'half',  focused: false },
    ],
    focusIdx: 0,
  },
  'system': {
    cols: [
      { id: 'btop',   app: 'btop',   title: 'ghostty · btop',         path: 'tmux: sys [1]', width: 'third',     focused: false },
      { id: 'yazi',   app: 'yazi',   title: 'ghostty · yazi',         path: 'tmux: sys [2]', width: 'half',      focused: true },
      { id: 'spotty', app: 'spotty', title: 'ghostty · spotify-tui',  path: 'tmux: sys [3]', width: 'third',     focused: false },
    ],
    focusIdx: 1,
  },
  'comms-tile': {
    cols: [
      { id: 'slack', app: 'slack', title: 'slack · #desktop-env', path: 'jylhis · 4 members', width: 'half', focused: true },
      { id: 'aerc',  app: 'aerc',  title: 'aerc · INBOX',         path: 'imap · 472 msgs',    width: 'half', focused: false },
    ],
    focusIdx: 0,
  },
  'research': {
    cols: [
      { id: 'browser', app: 'browser', title: 'qutebrowser', path: '4 tabs', width: 'two-thirds', focused: true },
      { id: 'ai',      app: 'ai',      title: 'claude · research',   path: 'context: tab 1', width: 'third', focused: false },
    ],
    focusIdx: 0,
  },
};

const WIDTH_FRAC = { 'third': 1/3, 'half': 1/2, 'two-thirds': 2/3, 'full': 1 };
const WIDTH_LABEL = { 'third': '⅓', 'half': '½', 'two-thirds': '⅔', 'full': '1' };

function StripWorkspace({ scene, barTop, barBottom, gap }) {
  const def = STRIP_SCENES[scene.layout];
  if (!def) return null;
  const W = 1920;
  const usableH = 1080 - barTop - barBottom - 22;
  const cols = def.cols;

  // Compute pixel widths
  const colWidths = cols.map(c => Math.round(W * WIDTH_FRAC[c.width] - gap));

  // Compute strip-relative x positions of each column center
  let cursor = gap;
  const centers = colWidths.map((w) => {
    const cx = cursor + w / 2;
    cursor += w + gap;
    return cx;
  });
  const totalStripW = cursor;

  // Translate strip so focused column centers in viewport
  const focusCenter = centers[def.focusIdx];
  const offset = W / 2 - focusCenter;

  const focused = cols[def.focusIdx];
  const prev = def.focusIdx > 0 ? cols[def.focusIdx - 1] : null;
  const next = def.focusIdx < cols.length - 1 ? cols[def.focusIdx + 1] : null;

  return (
    <div className="strip-stage" style={{ top: barTop, bottom: barBottom + 22 }}>
      <div className="strip" style={{ transform: `translateX(${offset}px)`, width: totalStripW }}>
        {cols.map((c, i) => (
          <div
            key={c.id}
            className={`strip-col ${c.focused ? 'focused' : ''}`}
            style={{ width: colWidths[i] }}
          >
            <div className={`win ${c.focused ? 'focused' : 'dim'}`} style={{ position: 'relative', flex: 1, left: 0, top: 0, width: '100%', height: '100%' }}>
              <div className="win-header">
                <div className="label">
                  <span className="dot"></span>
                  <span>{c.title}</span>
                  {c.path && <span className="path">· {c.path}</span>}
                </div>
                <div className="right">
                  {c.focused && <span className="kbd-hint">focused · <kbd>Super</kbd>+<kbd>r</kbd> width</span>}
                </div>
              </div>
              <div className="win-body">
                <AppContent app={c.app} scene={scene} />
              </div>
            </div>
            <div className="strip-width-hint">{WIDTH_LABEL[c.width]}</div>
          </div>
        ))}
      </div>

      {prev && (
        <div className="strip-peek-left">
          <span className="key">⇠ Super+,</span>
          <span>{prev.title.split('·')[0].trim()}</span>
        </div>
      )}
      {next && (
        <div className="strip-peek-right">
          <span>{next.title.split('·')[0].trim()}</span>
          <span className="key">Super+. ⇢</span>
        </div>
      )}

      <div className="strip-minimap">
        {cols.map((c, i) => (
          <div key={c.id} className={`dot ${i === def.focusIdx ? 'active' : ''}`} />
        ))}
      </div>
    </div>
  );
}

// ── Workspaces (named, scrolling-style)
const WORKSPACES = [
  { id: 'site', name: 'site', windows: 3 },
  { id: 'comms', name: 'comms', windows: 2 },
  { id: 'research', name: 'research', windows: 2 },
  { id: 'system', name: 'system', windows: 3 },
  { id: 'notes', name: 'notes', windows: 0 },
];

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "theme": "light",
  "wallpaper": "paper",
  "barPosition": "top",
  "density": "comfortable",
  "accent": "normal",
  "gap": 4,
  "fontMono": "JetBrains Mono",
  "fontBody": "Source Serif 4",
  "showWhisper": true,
  "playing": true,
  "experiment": "none"
}/*EDITMODE-END*/;

function App() {
  const [tweaks, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const [sceneIdx, setSceneIdx] = useState(0);
  const scene = SCENES[sceneIdx];

  // Allow scene to override theme (theme demo scene)
  const effectiveTheme = scene.forceTheme || tweaks.theme;
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', effectiveTheme === 'dark' ? 'dark' : 'light');
  }, [effectiveTheme]);

  // CSS variable swaps for fonts
  useEffect(() => {
    document.documentElement.style.setProperty('--font-mono', `"${tweaks.fontMono}", "JetBrains Mono", "Cascadia Code", monospace`);
    document.documentElement.style.setProperty('--font-body', `"${tweaks.fontBody}", Charter, Georgia, serif`);
  }, [tweaks.fontMono, tweaks.fontBody]);

  // Stage scaling — fit 1920x1080 to viewport
  const [scale, setScale] = useState(1);
  useEffect(() => {
    const fit = () => {
      const sx = window.innerWidth / 1920;
      const sy = window.innerHeight / 1080;
      setScale(Math.min(sx, sy));
    };
    fit();
    window.addEventListener('resize', fit);
    return () => window.removeEventListener('resize', fit);
  }, []);

  // Time ticker
  const [time, setTime] = useState('14:02');
  useEffect(() => {
    // Use the scene's narrative time when present
    const m = scene.title.match(/(\d{2}:\d{2})/);
    if (m) setTime(m[1]);
  }, [sceneIdx]);

  // Bar offsets
  const barTop = tweaks.barPosition === 'top' ? 32 : 0;
  const barBottom = tweaks.barPosition === 'bottom' ? 32 : 0;
  const layout = getLayout(scene.layout, barTop, barBottom);

  // Apply gap by remapping layout if user changed gap (simplified — only visual)
  const adjustedLayout = useMemo(() => {
    return layout.map(w => {
      const dx = (tweaks.gap - 8);
      return { ...w, x: w.x + (w.x > 8 ? dx : 0), w: w.w - (dx > 0 ? dx : 0) };
    });
  }, [layout, tweaks.gap]);

  // Auto-advance walkthrough toggleable
  const [auto, setAuto] = useState(false);
  useEffect(() => {
    if (!auto) return;
    const id = setInterval(() => setSceneIdx(i => (i + 1) % SCENES.length), 6000);
    return () => clearInterval(id);
  }, [auto]);

  // Density class
  const densityClass = tweaks.density === 'compact' ? 'density-compact' : '';
  const accentClass = tweaks.accent === 'soft' ? 'accent-soft' : tweaks.accent === 'bold' ? 'accent-bold' : '';

  const useProse = tweaks.experiment === 'prose' || tweaks.experiment === 'all';
  const useRooms = tweaks.experiment === 'rooms' || tweaks.experiment === 'all';
  const useInk   = tweaks.experiment === 'ink'   || tweaks.experiment === 'all';
  const useStrip = tweaks.experiment === 'strip' || tweaks.experiment === 'all';
  const activeRoom = ROOMS.find(r => r.layout === scene.layout) || ROOMS[0];

  return (
    <div className="stage">
      <div
        className={`stage-inner ${densityClass} ${accentClass}`}
        style={{ transform: `scale(${scale})`, fontFamily: 'var(--font-mono)' }}
        data-screen-label={`${String(sceneIdx + 1).padStart(2, '0')} ${scene.id}`}
      >
        <div className={`wallpaper ${tweaks.wallpaper}`} />

        {tweaks.barPosition !== 'none' && (
          <Bar
            position={tweaks.barPosition}
            activeWs={scene.ws}
            workspaces={WORKSPACES}
            onSelectWs={(id) => {
              const idx = SCENES.findIndex(s => s.ws === id);
              if (idx >= 0) setSceneIdx(idx);
            }}
            mode="NORMAL"
            time={time}
            music={scene.music}
            theme={effectiveTheme}
            onToggleTheme={() => setTweak('theme', effectiveTheme === 'dark' ? 'light' : 'dark')}
            proseTicker={useProse ? proseFor(scene, scene.music, activeRoom) : null}
            rooms={useRooms ? ROOMS : null}
            activeRoom={activeRoom}
            onSelectRoom={(roomId) => {
              const r = ROOMS.find(x => x.id === roomId);
              if (!r) return;
              const idx = SCENES.findIndex(s => s.layout === r.layout);
              if (idx >= 0) setSceneIdx(idx);
            }}
            inkActive={useInk}
          />
        )}

        <div className="windows-layer">
          {useStrip && STRIP_SCENES[scene.layout] ? (
            <StripWorkspace scene={scene} barTop={barTop} barBottom={barBottom} gap={tweaks.gap} />
          ) : adjustedLayout.map(w => (
            <div
              key={w.id}
              className={`win ${w.focused ? 'focused' : 'dim'}`}
              style={{ left: w.x, top: w.y, width: w.w, height: w.h }}
            >
              <div className="win-header">
                <div className="label">
                  <span className="dot"></span>
                  <span>{w.title}</span>
                  <span className="path">· {w.path}</span>
                </div>
                <div className="right">
                  {w.focused && <span className="kbd-hint">focused · <kbd>Super</kbd>+<kbd>q</kbd> close</span>}
                </div>
              </div>
              <div className="win-body">
                <AppContent app={w.app} scene={scene} />
              </div>
            </div>
          ))}
        </div>

        {scene.overlay === 'palette' && <Palette query={scene.paletteQuery || ''} selected={1} onClose={() => setSceneIdx(0)} />}
        {scene.overlay === 'cheatsheet' && <Cheatsheet onClose={() => setSceneIdx(0)} />}

        {scene.toasts && <Toasts list={scene.toasts} />}

        <InkLayer active={useInk} scene={scene} />

        {tweaks.showWhisper && (
          <Whisper
            music={scene.music}
            lastCmd={scene.lastCmd}
            aiSuggestion={scene.aiSuggestion}
          />
        )}
      </div>

      <Walkthrough
        step={sceneIdx}
        total={SCENES.length}
        scenario={scene}
        onPrev={() => setSceneIdx(i => Math.max(0, i - 1))}
        onNext={() => setSceneIdx(i => Math.min(SCENES.length - 1, i + 1))}
      />

      <TweaksPanel title="Tweaks">
        <TweakSection title="theme">
          <TweakRadio label="mode" value={tweaks.theme} onChange={(v) => setTweak('theme', v)} options={[
            { value: 'light', label: 'paper' },
            { value: 'dark', label: 'roast' },
          ]} />
          <TweakRadio label="accent" value={tweaks.accent} onChange={(v) => setTweak('accent', v)} options={[
            { value: 'soft', label: 'soft' },
            { value: 'normal', label: 'normal' },
            { value: 'bold', label: 'bold' },
          ]} />
          <TweakSelect label="wallpaper" value={tweaks.wallpaper} onChange={(v) => setTweak('wallpaper', v)} options={[
            { value: 'paper', label: 'paper (subtle warm)' },
            { value: 'solid', label: 'solid' },
            { value: 'dotgrid', label: 'dot grid' },
          ]} />
        </TweakSection>

        <TweakSection title="layout">
          <TweakRadio label="bar" value={tweaks.barPosition} onChange={(v) => setTweak('barPosition', v)} options={[
            { value: 'top', label: 'top' },
            { value: 'bottom', label: 'bottom' },
            { value: 'none', label: 'none' },
          ]} />
          <TweakRadio label="density" value={tweaks.density} onChange={(v) => setTweak('density', v)} options={[
            { value: 'comfortable', label: 'comfortable' },
            { value: 'compact', label: 'compact' },
          ]} />
          <TweakSlider label="gap" value={tweaks.gap} onChange={(v) => setTweak('gap', v)} min={0} max={20} step={1} />
          <TweakToggle label="whisper bar" value={tweaks.showWhisper} onChange={(v) => setTweak('showWhisper', v)} />
        </TweakSection>

        <TweakSection title="type">
          <TweakSelect label="mono" value={tweaks.fontMono} onChange={(v) => setTweak('fontMono', v)} options={[
            { value: 'IBM Plex Mono', label: 'IBM Plex Mono' },
            { value: 'JetBrains Mono', label: 'JetBrains Mono' },
            { value: 'Iosevka', label: 'Iosevka' },
            { value: 'Fira Code', label: 'Fira Code' },
          ]} />
          <TweakSelect label="body" value={tweaks.fontBody} onChange={(v) => setTweak('fontBody', v)} options={[
            { value: 'Source Serif 4', label: 'Source Serif 4' },
            { value: 'Literata', label: 'Literata' },
            { value: 'Charter', label: 'Charter' },
            { value: 'Georgia', label: 'Georgia' },
          ]} />
        </TweakSection>

        <TweakSection title="experiments">
          <TweakRadio label="mode" value={tweaks.experiment} onChange={(v) => setTweak('experiment', v)} options={[
            { value: 'none', label: 'off' },
            { value: 'rooms', label: 'rooms' },
            { value: 'strip', label: 'strip' },
            { value: 'all', label: 'all' },
          ]} />
          <div style={{ fontSize: 11, color: 'var(--color-text-muted)', lineHeight: 1.4, marginTop: 6 }}>
            <div><span style={{ color: 'var(--color-accent)' }}>rooms</span> — named layout templates ("forge", "pair", "talk")</div>
            <div><span style={{ color: 'var(--color-accent)' }}>strip</span> — niri-style scrolling columns; widths cycle ⅓ ½ ⅔ 1; off-screen neighbors peek</div>
          </div>
        </TweakSection>

        <TweakSection title="walkthrough">
          <TweakToggle label="auto-advance (6s)" value={auto} onChange={setAuto} />
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 6 }}>
            {SCENES.map((s, i) => (
              <button
                key={s.id}
                onClick={() => setSceneIdx(i)}
                style={{
                  fontFamily: 'inherit',
                  fontSize: 11,
                  padding: '3px 7px',
                  borderRadius: 3,
                  border: `1px solid ${i === sceneIdx ? 'var(--color-accent)' : 'var(--color-border-strong)'}`,
                  background: i === sceneIdx ? 'var(--color-accent-subtle)' : 'transparent',
                  color: i === sceneIdx ? 'var(--color-accent)' : 'var(--color-text-muted)',
                  cursor: 'pointer',
                }}
              >{i + 1}. {s.id}</button>
            ))}
          </div>
        </TweakSection>
      </TweaksPanel>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
