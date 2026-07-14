/* global React, ReactDOM, Terminal, Btop, Yazi, Aerc, Emacs, Browser, Slack, AIPanel, useTweaks, TweaksPanel, TweakSection, TweakSlider, TweakToggle, TweakRadio, TweakSelect */

const { useState, useEffect, useMemo, useRef } = React;

// ── Scenes (a "day with the tablet") ──
const SCENES = [
  {
    id: 'split-edit',
    title: '09:14 — split · editor + terminal',
    body: 'Folio keyboard attached. Emacs left, Ghostty right. Super+← / Super+→ snap any app to a half. The divider is draggable with the touchpad too.',
    layout: 'split',
    left: 'emacs', right: 'term',
    overlay: null,
  },
  {
    id: 'drawer',
    title: '09:21 — Super (alone) · app drawer',
    body: 'Tap Super by itself for the drawer; type-to-search, single letters select. Same chord opens rofi on the desktop — same muscle memory.',
    layout: 'split',
    left: 'emacs', right: 'term',
    overlay: 'drawer',
  },
  {
    id: 'shade',
    title: '11:02 — Super+N · notification shade',
    body: 'Quick settings + notifications drop in from the top-right (or two-finger swipe). Tiles match desktop toggles; Wi-Fi, Bluetooth, dark mode, focus.',
    layout: 'split',
    left: 'slack', right: 'aerc',
    overlay: 'shade',
  },
  {
    id: 'recents',
    title: '13:40 — Super+Tab · overview',
    body: 'Recents are app cards, ordered by last-used. Arrow keys move; ↵ opens; X dismisses. The same Super+Tab works on desktop.',
    layout: 'split',
    left: 'emacs', right: 'ai-selection',
    overlay: 'recents',
  },
  {
    id: 'ai-pair',
    title: '14:06 — Super+; · ask Claude',
    body: 'Selection in Emacs becomes context. Claude opens as the right pane (split). No app switching, no lost cursor.',
    layout: 'split',
    left: 'emacs', right: 'ai-selection',
    overlay: null,
  },
  {
    id: 'browse',
    title: '15:28 — research · qutebrowser + Claude',
    body: 'Browser left, Claude right. Press f for link hints — every link gets a 2-letter overlay. Touchpad scroll works too.',
    layout: 'split',
    left: 'browser', right: 'ai',
    overlay: null,
    browserHints: true,
  },
  {
    id: 'solo-files',
    title: '16:11 — Super+↑ · maximize yazi',
    body: 'Solo a pane with Super+↑. Yazi (file manager) takes the whole screen. Super+↓ restores the split.',
    layout: 'solo',
    left: 'yazi', right: null,
    overlay: null,
  },
  {
    id: 'volume',
    title: '17:03 — hardware key feedback',
    body: 'Hardware volume / brightness keys show a roast-toned chip in the center. The sleep stays out of the way.',
    layout: 'split',
    left: 'browser', right: 'ai',
    overlay: 'hw-toast',
    toast: { kind: 'volume', label: 'volume', value: 62, glyph: '♪' },
  },
  {
    id: 'roast',
    title: '21:48 — Super+Shift+T · roast',
    body: 'One bind flips paper to roast across system, status bar, and every app. Same key on desktop, tablet, and phone.',
    layout: 'split',
    left: 'emacs', right: 'term',
    overlay: null,
    forceTheme: 'dark',
  },
];

// ── Apps for the drawer ──
const APPS = [
  { id: 'emacs',   name: 'emacs',     icon: 'E', key: 'e' },
  { id: 'term',    name: 'ghostty',   icon: 'G', key: '↵' },
  { id: 'browser', name: 'qutebrowser', icon: 'q', key: 'b' },
  { id: 'slack',   name: 'slack',     icon: '#', key: 's' },
  { id: 'aerc',    name: 'aerc',      icon: '@', key: 'm' },
  { id: 'yazi',    name: 'yazi',      icon: 'F', key: 'f' },
  { id: 'btop',    name: 'btop',      icon: '▮', key: 't' },
  { id: 'ai',      name: 'claude',    icon: '◆', key: ';' },
  { id: 'spotty',  name: 'spotify',   icon: '♪', key: 'p' },
  { id: 'maps',    name: 'maps',      icon: '◎', key: 'g' },
  { id: 'cal',     name: 'calendar',  icon: '▦', key: 'c' },
  { id: 'photos',  name: 'photos',    icon: '◧', key: 'h' },
];

const DOCK_APPS = ['emacs', 'term', 'browser', 'slack', 'ai', 'yazi'];

// ── App router (reuse existing components) ──
function AppContent({ app, scene }) {
  switch (app) {
    case 'emacs': return <Emacs />;
    case 'term': return <Terminal />;
    case 'btop': return <Btop />;
    case 'browser': return <Browser showHints={scene?.browserHints} />;
    case 'slack': return <Slack />;
    case 'ai': return <AIPanel mode="panel" />;
    case 'ai-selection': return <AIPanel mode="panel" withSelection />;
    case 'yazi': return <Yazi />;
    case 'aerc': return <Aerc />;
    default: return <div className="tui">empty</div>;
  }
}

const APP_TITLES = {
  emacs: { title: 'emacs · astro.config.mjs', path: '~/projects/jylhis-site' },
  term: { title: 'ghostty · npm run dev', path: 'tmux: jylhis [1]' },
  btop: { title: 'ghostty · btop', path: 'tmux: sys [1]' },
  browser: { title: 'qutebrowser', path: '4 tabs · docs.astro.build' },
  slack: { title: 'slack · #desktop-env', path: 'jylhis · 4 members' },
  ai: { title: 'claude · panel', path: 'sonnet 4.5' },
  'ai-selection': { title: 'claude · with selection', path: 'L10–L13 · astro.config.mjs' },
  yazi: { title: 'yazi · ~/projects/jylhis-site/src', path: '142 KB' },
  aerc: { title: 'aerc · INBOX', path: 'imap · 472 messages' },
};

// ── Status bar ──
function StatusBar({ scene, time, theme, onToggleShade, onToggleTheme }) {
  return (
    <div className="status-bar">
      <div className="left">
        <span className="ws-chip">▦ split · {scene.id}</span>
        <span className="pill ok"><span className="glyph">⎇</span><span>main</span> <span style={{ color: 'var(--color-accent)' }}>!2</span></span>
        <span className="pill"><span className="glyph">▮</span><span>34%</span></span>
        <span className="pill"><span className="glyph">▤</span><span>58%</span></span>
      </div>
      <div className="right">
        <span className="pill"><span className="glyph">⌨</span><span>folio · en-us</span></span>
        <span className="pill"><span className="glyph">↕</span><span>wlan0</span></span>
        <span className="pill"><span className="glyph">▼</span><span>bt</span></span>
        <span className="icon-btn" onClick={onToggleTheme} title="toggle theme">{theme === 'dark' ? '☾' : '☀'}</span>
        <span className="icon-btn" onClick={onToggleShade} title="notifications">▼</span>
        <span className="battery">
          <div className="bar-track"><div className="bar-fill" style={{ width: '70%' }} /></div>
          <span>70%</span>
        </span>
        <span className="clock">{time}</span>
      </div>
    </div>
  );
}

// ── Pane (one app window) ──
function Pane({ app, scene, focused, onClose, onMaximize, onSplit }) {
  if (!app) return <div className="pane" />;
  const meta = APP_TITLES[app] || { title: app, path: '' };
  return (
    <div className={`pane ${focused ? 'focused' : ''}`}>
      <div className="pane-header">
        <div className="label">
          <span className="dot"></span>
          <span>{meta.title}</span>
          <span className="path">· {meta.path}</span>
        </div>
        <div className="right">
          {focused && <span style={{ fontSize: 10.5, color: 'var(--color-text-faint)' }}><kbd className="ds-kbd">Super</kbd>+<kbd className="ds-kbd">q</kbd> close</span>}
          <span className="pane-btn" title="split" onClick={onSplit}>◫</span>
          <span className="pane-btn" title="maximize" onClick={onMaximize}>□</span>
          <span className="pane-btn" title="close" onClick={onClose}>×</span>
        </div>
      </div>
      <div className="pane-body">
        <AppContent app={app} scene={scene} />
      </div>
    </div>
  );
}

// ── Notification shade (Quick Settings + notifications) ──
function Shade({ time, onClose }) {
  const tiles = [
    { label: 'wi-fi', sub: 'jylhis_5g', glyph: '↕', on: true },
    { label: 'bluetooth', sub: 'folio · pen', glyph: '▼', on: true },
    { label: 'do not disturb', sub: 'off', glyph: '◉', on: false },
    { label: 'dark mode', sub: 'paper', glyph: '☀', on: false },
    { label: 'airplane', sub: 'off', glyph: '✈', on: false },
    { label: 'hotspot', sub: 'off', glyph: '☉', on: false },
    { label: 'rotation', sub: 'locked', glyph: '↻', on: true },
    { label: 'cast', sub: '—', glyph: '◇', on: false },
  ];
  return (
    <>
      <div className="shade-overlay" onClick={onClose} />
      <div className="shade">
        <div className="shade-head">
          <span className="clock">{time}</span>
          <span className="date">mon · 27 apr</span>
          <span className="charge">▮ 70% · 4h 12m</span>
        </div>
        <div className="qs-grid">
          {tiles.map((t, i) => (
            <div key={i} className={`qs-tile ${t.on ? 'on' : ''}`}>
              <span className="glyph">{t.glyph}</span>
              <span className="label">{t.label}</span>
              <span className="sub">{t.sub}</span>
            </div>
          ))}
        </div>
        <div className="brightness-row">
          <span style={{ color: 'var(--color-accent)' }}>☼</span>
          <div className="track"><div className="fill" /></div>
          <span style={{ color: 'var(--color-text)' }}>65%</span>
        </div>
        <div className="notif-list">
          <div className="notif-group-h">priority · 2</div>
          <div className="notif urgent">
            <div className="av">GH</div>
            <div>
              <div className="src">github · pull request</div>
              <div className="title">Anna requested your review on PR #42</div>
              <div className="body">scrolling workspace metaphor — 14 files, +482 / −118</div>
            </div>
            <div className="when">2m</div>
          </div>
          <div className="notif">
            <div className="av">SL</div>
            <div>
              <div className="src">slack · #desktop-env</div>
              <div className="title">tomas l.: "is whisper bar persistent or contextual?"</div>
              <div className="body">3 unread in #desktop-env · 1 in DM tomas l.</div>
            </div>
            <div className="when">7m</div>
          </div>
          <div className="notif-group-h">silent · 3</div>
          <div className="notif">
            <div className="av">CF</div>
            <div>
              <div className="src">cloudflare</div>
              <div className="title">build succeeded for jylhis.com</div>
              <div className="body">deployed to production · commit 8af2c1</div>
            </div>
            <div className="when">14m</div>
          </div>
          <div className="notif">
            <div className="av">CL</div>
            <div>
              <div className="src">claude · finished</div>
              <div className="title">draft answer for "shikiConfig dark mode"</div>
              <div className="body">2 options proposed · open the panel to review</div>
            </div>
            <div className="when">22m</div>
          </div>
          <div className="notif">
            <div className="av">SP</div>
            <div>
              <div className="src">spotify</div>
              <div className="title">now playing — Vespers · Strands</div>
              <div className="body">queued: Glassworks I, Karst, Underwater</div>
            </div>
            <div className="when">1h</div>
          </div>
        </div>
      </div>
    </>
  );
}

// ── App drawer (Super alone) ──
function Drawer({ onClose }) {
  const [selected, setSelected] = useState(0);
  return (
    <div className="drawer-overlay" onClick={onClose}>
      <div className="drawer" onClick={(e) => e.stopPropagation()}>
        <div className="drawer-search">
          <span className="glyph">{'>'}</span>
          <span className="input">
            <span className="placeholder">type to search apps · or press a letter to launch…</span>
            <span className="cursor" style={{ marginLeft: 1 }}></span>
          </span>
        </div>
        <div className="drawer-hints">
          <span><span className="key">a–z</span> launch</span>
          <span><span className="key">↑↓←→</span> navigate</span>
          <span><span className="key">↵</span> open</span>
          <span><span className="key">⇧↵</span> open in split</span>
          <span style={{ marginLeft: 'auto' }}>{APPS.length} apps</span>
        </div>
        <div className="drawer-grid">
          {APPS.map((a, i) => (
            <div
              key={a.id}
              className={`drawer-tile ${i === selected ? 'selected' : ''}`}
              onMouseEnter={() => setSelected(i)}
            >
              <div className="icon-box">{a.icon}</div>
              <div className="name">{a.name}</div>
              <div className="key">⌘ {a.key}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Recents / overview ──
function Recents({ onClose }) {
  const cards = [
    { app: 'emacs', focused: true, stub: `▸ astro.config.mjs

import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';

// jylhis.com — personal site config.
export default defineConfig({
  site: 'https://jylhis.com',
  output: 'static',
  integrations: [mdx({
    syntaxHighlight: 'shiki',` },
    { app: 'term', stub: `~/projects/jylhis-site
❯ npm run dev

▲ Astro v5.4.2

┃  Local    http://localhost:4321/
┃  Network  use --host to expose

14:02:14 [vite] hmr update
14:02:18 [vite] hmr update` },
    { app: 'browser', stub: `qutebrowser · 4 tabs

▸ Astro Docs · Content Collections
   github · PR #42
   news.ycombinator.com
   claude.ai · brainstorm

# Content Collections
Type-safe content with frontmatter
validation. Build-time errors.` },
    { app: 'slack', stub: `# desktop-env · 4 members

anna k.   13:48
have you tried scrolling-strip
workspaces? niri's metaphor is
really clicking…

markus    13:51
yeah, mocking it up. main thing
i miss is named context.

tomas l.  13:55` },
    { app: 'ai', stub: `claude · sonnet 4.5

▸ shiki resolves the theme at
  build time, not at request
  time — so a single string
  locks you to one palette.

  Two ways out:
  1. Pass both themes…
  2. Render twice…` },
    { app: 'aerc', stub: `INBOX · 472

▸ GitHub                    14:02
  PR #42 ready for review

  Cloudflare                13:48
  Build succeeded for jylhis…

  Anna Kuusisto             11:23
  re: notes on the desktop env` },
  ];
  return (
    <div className="recents-overlay" onClick={onClose}>
      <div className="recents">
        {cards.map((c, i) => {
          const meta = APP_TITLES[c.app] || { title: c.app, path: '' };
          return (
            <div key={i} className={`recents-card ${c.focused ? 'focused' : ''}`} onClick={(e) => e.stopPropagation()}>
              <div className="rc-head">
                <span className="dot"></span>
                <span>{meta.title}</span>
                <span className="x">×</span>
              </div>
              <div className="rc-preview">
                <div className="stub">{c.stub}</div>
              </div>
              <div className="rc-foot">
                <span className="key">↵</span> focus
                <span style={{ marginLeft: 'auto' }}>{c.focused ? 'last used' : `${i * 12 + 4}m ago`}</span>
              </div>
            </div>
          );
        })}
      </div>
      <div className="recents-hint">
        <kbd className="ds-kbd">↹</kbd> next · <kbd className="ds-kbd">⇧↹</kbd> prev · <kbd className="ds-kbd">↵</kbd> focus · <kbd className="ds-kbd">X</kbd> dismiss · <kbd className="ds-kbd">esc</kbd> back
      </div>
    </div>
  );
}

// ── Hardware-key toast (volume / brightness) ──
function HwToast({ toast }) {
  return (
    <div className="hw-toast">
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <span className="glyph">{toast.glyph}</span>
        <span style={{ flex: 1 }}>{toast.label}</span>
        <span style={{ color: '#e89b5e', fontWeight: 600 }}>{toast.value}%</span>
      </div>
      <div className="track"><div className="fill" style={{ width: `${toast.value}%` }} /></div>
      <span style={{ fontSize: 10, color: 'rgba(240,234,224,0.5)' }}>F2 / F3 to adjust · Fn+M mute</span>
    </div>
  );
}

// ── Walkthrough chip ──
function Walkthrough({ step, total, scenario, onPrev, onNext }) {
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

// ── Dock ──
function Dock({ activeApp, onPick }) {
  const items = DOCK_APPS.map(id => APPS.find(a => a.id === id)).filter(Boolean);
  return (
    <div className="dock">
      {items.map(a => (
        <span
          key={a.id}
          className={`dock app ${activeApp === a.id ? 'active' : ''}`}
          onClick={() => onPick(a.id)}
          title={a.name}
        >
          <span className="glyph">{a.icon}</span>
          <span>{a.name}</span>
          <span className="key">·{a.key}</span>
        </span>
      ))}
      <span className="dock-sep" />
      <span className="dock app" title="more apps (Super)"><span className="glyph">▦</span><span>all</span><span className="key">·super</span></span>
    </div>
  );
}

// ── Tweaks defaults ──
const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "theme": "light",
  "splitRatio": "even",
  "showKbdStrip": true,
  "showWalkthrough": true,
  "fontMono": "IBM Plex Mono",
  "fontBody": "Source Serif 4"
}/*EDITMODE-END*/;

function App() {
  const [tweaks, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const [sceneIdx, setSceneIdx] = useState(0);
  const scene = SCENES[sceneIdx];

  // Theme
  const effectiveTheme = scene.forceTheme || tweaks.theme;
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', effectiveTheme === 'dark' ? 'dark' : 'light');
  }, [effectiveTheme]);

  // Fonts
  useEffect(() => {
    document.documentElement.style.setProperty('--font-mono', `"${tweaks.fontMono}", "JetBrains Mono", "Cascadia Code", monospace`);
    document.documentElement.style.setProperty('--font-body', `"${tweaks.fontBody}", Charter, Georgia, serif`);
  }, [tweaks.fontMono, tweaks.fontBody]);

  // Stage scaling — fit 1920x1080 to viewport. On narrow portrait viewports,
  // fit to height only and let the user pan horizontally so the canvas stays legible.
  const [scale, setScale] = useState(1);
  const [panMode, setPanMode] = useState(false);
  const [panBannerDismissed, setPanBannerDismissed] = useState(() => {
    try { return localStorage.getItem('jylhis-pan-banner') === 'dismissed'; } catch { return false; }
  });
  useEffect(() => {
    const fit = () => {
      const w = window.innerWidth, h = window.innerHeight;
      const portraitNarrow = w < 700 && h > w;
      if (portraitNarrow) {
        setScale(h / 1080);
        setPanMode(true);
      } else {
        setScale(Math.min(w / 1920, h / 1080));
        setPanMode(false);
      }
    };
    fit();
    window.addEventListener('resize', fit);
    return () => window.removeEventListener('resize', fit);
  }, []);
  const dismissPanBanner = () => {
    setPanBannerDismissed(true);
    try { localStorage.setItem('jylhis-pan-banner', 'dismissed'); } catch {}
  };

  // Time
  const [time, setTime] = useState('14:02');
  useEffect(() => {
    const m = scene.title.match(/(\d{2}:\d{2})/);
    if (m) setTime(m[1]);
  }, [sceneIdx]);

  // Manual shade toggle (overrides scene if user clicks)
  const [shadeOpen, setShadeOpen] = useState(false);
  useEffect(() => { setShadeOpen(false); }, [sceneIdx]);

  const showShade = scene.overlay === 'shade' || shadeOpen;
  const showDrawer = scene.overlay === 'drawer';
  const showRecents = scene.overlay === 'recents';
  const showHwToast = scene.overlay === 'hw-toast';

  // Split layout
  const splitClass = scene.layout === 'solo'
    ? 'solo'
    : tweaks.splitRatio === 'narrow'
      ? 'dual-narrow'
      : tweaks.splitRatio === 'wide'
        ? 'dual-wide'
        : 'dual';

  // Active dock app — left pane
  const activeApp = scene.left;

  return (
    <div className="stage" data-pan={panMode ? '1' : undefined}>
      {panMode && !panBannerDismissed && (
        <button type="button" className="pan-banner" onClick={dismissPanBanner}
                aria-label="Dismiss desktop-only notice">
          <span aria-hidden="true">›</span> Designed for desktop · scroll to pan
          <span className="pan-banner-x" aria-hidden="true">✕</span>
        </button>
      )}
      <div
        className="stage-canvas"
        style={panMode ? { width: Math.round(1920 * scale), height: Math.round(1080 * scale) } : undefined}
      >
      <div
        className="stage-inner"
        style={{ transform: `scale(${scale})`, fontFamily: 'var(--font-mono)' }}
        data-screen-label={`${String(sceneIdx + 1).padStart(2, '0')} ${scene.id}`}
      >
        <div className="tablet">
          <div className="tablet-cam" />
          <div className="tablet-screen">
            <StatusBar
              scene={scene}
              time={time}
              theme={effectiveTheme}
              onToggleShade={() => setShadeOpen(s => !s)}
              onToggleTheme={() => setTweak('theme', effectiveTheme === 'dark' ? 'light' : 'dark')}
            />

            <div className="body-area">
              <div className="wallpaper" />

              <div className={`split ${splitClass}`}>
                <Pane app={scene.left} scene={scene} focused={true} />
                {scene.layout === 'split' && (
                  <>
                    <div className="split-divider" />
                    <Pane app={scene.right} scene={scene} focused={false} />
                  </>
                )}
              </div>

              {tweaks.showKbdStrip && (
                <div className="kbd-strip">
                  <span className="seg"><span className="key">Super</span><span>app drawer</span></span>
                  <span className="seg"><span className="key">Super+↹</span><span>recents</span></span>
                  <span className="seg"><span className="key">Super+←/→</span><span>snap pane</span></span>
                  <span className="seg"><span className="key">Super+↑</span><span>maximize</span></span>
                  <span className="seg"><span className="key">Super+;</span><span>ask claude</span></span>
                  <span className="seg"><span className="key">Super+N</span><span>shade</span></span>
                  <span className="right">folio · keyboard attached · two-finger swipe ↓ for shade</span>
                </div>
              )}

              {showShade && <Shade time={time} onClose={() => setShadeOpen(false)} />}
              {showDrawer && <Drawer onClose={() => setSceneIdx(0)} />}
              {showRecents && <Recents onClose={() => setSceneIdx(0)} />}
              {showHwToast && scene.toast && <HwToast toast={scene.toast} />}
            </div>

            <div className="system-row">
              <div className="nav-side">
                <span className="nav-btn" title="back">‹</span>
                <span className="nav-btn" title="home">●</span>
              </div>
              <Dock activeApp={activeApp} onPick={() => {}} />
              <div className="nav-side right">
                <span className="nav-btn" title="recents">◫</span>
                <span className="nav-btn" title="ime">⌨</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      </div>

      {tweaks.showWalkthrough && (
        <Walkthrough
          step={sceneIdx}
          total={SCENES.length}
          scenario={scene}
          onPrev={() => setSceneIdx(i => Math.max(0, i - 1))}
          onNext={() => setSceneIdx(i => Math.min(SCENES.length - 1, i + 1))}
        />
      )}

      <TweaksPanel title="Tweaks">
        <TweakSection title="theme">
          <TweakRadio label="mode" value={tweaks.theme} onChange={(v) => setTweak('theme', v)} options={[
            { value: 'light', label: 'paper' },
            { value: 'dark', label: 'roast' },
          ]} />
        </TweakSection>

        <TweakSection title="layout">
          <TweakRadio label="split" value={tweaks.splitRatio} onChange={(v) => setTweak('splitRatio', v)} options={[
            { value: 'narrow', label: '⅔ · ⅓' },
            { value: 'even',   label: '½ · ½' },
            { value: 'wide',   label: '⅓ · ⅔' },
          ]} />
          <TweakToggle label="keyboard hint strip" value={tweaks.showKbdStrip} onChange={(v) => setTweak('showKbdStrip', v)} />
          <TweakToggle label="walkthrough chip" value={tweaks.showWalkthrough} onChange={(v) => setTweak('showWalkthrough', v)} />
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

        <TweakSection title="walkthrough">
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
