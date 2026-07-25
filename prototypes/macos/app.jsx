/* global React, ReactDOM, MenuBar, Dock, Spotlight, SPOT_RESULTS, ControlCenter, NotificationCenter, Finder, Notes, useTweaks, TweaksPanel, TweakSection, TweakRadio, TweakSelect, TweakToggle */

const { useState, useEffect, useLayoutEffect, useMemo, useCallback } = React;

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "theme": "light",
  "wallpaper": "rings",
  "menubarMusic": true,
  "fontMono": "IBM Plex Mono",
  "fontBody": "Hanken Grotesk"
}/*EDITMODE-END*/;

// window geometry on the 1600×1000 canvas
const WIN_POS = {
  finder: { left: 232, top: 92, width: 904, height: 566 },
  notes:  { left: 804, top: 338, width: 556, height: 540 },
};

function App() {
  const [tweaks, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const theme = tweaks.theme === 'dark' ? 'dark' : 'light';

  const [focus, setFocus] = useState('finder');
  const [open, setOpen] = useState({ finder: true, notes: true });
  const [openMenu, setOpenMenu] = useState(null);
  const [ccOpen, setCcOpen] = useState(false);
  const [ncOpen, setNcOpen] = useState(false);
  const [spotOpen, setSpotOpen] = useState(false);
  const [spotQuery, setSpotQuery] = useState('');
  const [spotSel, setSpotSel] = useState(1);
  const [bouncing, setBouncing] = useState(null);

  // ── theme ──
  useEffect(() => { document.documentElement.setAttribute('data-theme', theme); }, [theme]);
  const setTheme = useCallback((t) => setTweak('theme', t), [setTweak]);
  const toggleTheme = useCallback(() => setTweak('theme', theme === 'dark' ? 'light' : 'dark'), [theme, setTweak]);

  // ── fonts ──
  useEffect(() => {
    document.documentElement.style.setProperty('--font-mono', `"${tweaks.fontMono}", "IBM Plex Mono", monospace`);
    document.documentElement.style.setProperty('--font-body', `"${tweaks.fontBody}", Inter, system-ui, sans-serif`);
  }, [tweaks.fontMono, tweaks.fontBody]);

  // ── clock ──
  const [now, setNow] = useState(() => new Date());
  useEffect(() => { const t = setInterval(() => setNow(new Date()), 1000 * 20); return () => clearInterval(t); }, []);
  const hh = String(now.getHours()).padStart(2, '0');
  const mm = String(now.getMinutes()).padStart(2, '0');
  const timeStr = `${hh}:${mm}`;
  const dateShort = now.toLocaleDateString('en-GB', { weekday: 'short', day: '2-digit', month: 'short' });
  const calDow = now.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase();
  const calDay = String(now.getDate()).padStart(2, '0');
  const calMo = now.toLocaleDateString('en-US', { month: 'long' });

  // ── scaler ──
  const [scale, setScale] = useState(() => Math.min(window.innerWidth / 1600, window.innerHeight / 1000));
  useLayoutEffect(() => {
    const fit = () => {
      const w = document.documentElement.clientWidth || window.innerWidth;
      const h = document.documentElement.clientHeight || window.innerHeight;
      setScale(Math.min(w / 1600, h / 1000));
    };
    fit();
    window.addEventListener('resize', fit);
    window.addEventListener('orientationchange', fit);
    return () => { window.removeEventListener('resize', fit); window.removeEventListener('orientationchange', fit); };
  }, []);

  // ── helpers ──
  const closeAllPanels = useCallback(() => { setOpenMenu(null); setCcOpen(false); setNcOpen(false); }, []);
  const focusWin = useCallback((id) => { setFocus(id); closeAllPanels(); }, [closeAllPanels]);
  const closeWin = useCallback((id) => {
    setOpen((o) => ({ ...o, [id]: false }));
    setFocus((f) => (f === id ? null : f));
  }, []);
  const bounce = useCallback((id) => {
    setBouncing(id);
    setTimeout(() => setBouncing((b) => (b === id ? null : b)), 1150);
  }, []);

  const openSpotlight = useCallback(() => { closeAllPanels(); setSpotQuery(''); setSpotSel(1); setSpotOpen(true); }, [closeAllPanels]);

  // ── dock app handling ──
  const onApp = useCallback((a) => {
    closeAllPanels();
    if (a.action === 'spotlight' || a.id === 'spotlight') { openSpotlight(); return; }
    if (a.action === 'theme') { toggleTheme(); return; }
    if (a.id === 'finder' || a.action === 'finder') { setOpen((o) => ({ ...o, finder: true })); focusWin('finder'); bounce('finder'); return; }
    if (a.id === 'notes' || a.action === 'notes') { setOpen((o) => ({ ...o, notes: true })); focusWin('notes'); bounce('notes'); return; }
    bounce(a.id);
  }, [closeAllPanels, openSpotlight, toggleTheme, focusWin, bounce]);

  // ── spotlight results (filtered) ──
  const spotResults = useMemo(() => {
    const q = spotQuery.trim().toLowerCase();
    if (!q) return SPOT_RESULTS;
    const out = [];
    SPOT_RESULTS.forEach((r) => {
      if (r.grp) { out.push(r); return; }
      if (r.t.toLowerCase().includes(q) || (r.d && r.d.toLowerCase().includes(q)) || (r.kind && r.kind.toLowerCase().includes(q))) out.push(r);
    });
    // drop group heads with no following items
    return out.filter((r, i) => !r.grp || (out[i + 1] && !out[i + 1].grp));
  }, [spotQuery]);
  const selectable = useMemo(() => spotResults.map((r, i) => (r.grp ? -1 : i)).filter((i) => i >= 0), [spotResults]);
  useEffect(() => { if (!selectable.includes(spotSel)) setSpotSel(selectable[0] ?? -1); }, [selectable, spotSel]);

  const onSpotPick = useCallback((r) => {
    setSpotOpen(false);
    if (!r) return;
    if (r.action === 'theme') { toggleTheme(); return; }
    if (r.action === 'finder') { setOpen((o) => ({ ...o, finder: true })); focusWin('finder'); bounce('finder'); }
    else if (r.action === 'notes') { setOpen((o) => ({ ...o, notes: true })); focusWin('notes'); bounce('notes'); }
  }, [toggleTheme, focusWin, bounce]);

  // ── keyboard ──
  useEffect(() => {
    const onKey = (e) => {
      const tag = (e.target && e.target.tagName) || '';
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;

      if (spotOpen) {
        if (e.key === 'Escape') { e.preventDefault(); setSpotOpen(false); return; }
        if (e.key === 'ArrowDown') { e.preventDefault(); const at = selectable.indexOf(spotSel); setSpotSel(selectable[Math.min(selectable.length - 1, at + 1)]); return; }
        if (e.key === 'ArrowUp') { e.preventDefault(); const at = selectable.indexOf(spotSel); setSpotSel(selectable[Math.max(0, at - 1)]); return; }
        if (e.key === 'Enter') { e.preventDefault(); onSpotPick(spotResults[spotSel]); return; }
        if (e.key === 'Backspace') { e.preventDefault(); setSpotQuery((q) => q.slice(0, -1)); return; }
        if (e.key.length === 1 && !e.metaKey && !e.ctrlKey) { e.preventDefault(); setSpotQuery((q) => q + e.key); return; }
        return;
      }
      if (e.key === 'Escape') { closeAllPanels(); return; }
      if ((e.metaKey && e.key === ' ') || e.key === '/') { e.preventDefault(); openSpotlight(); return; }
      if (e.key === 't' || e.key === 'T') { e.preventDefault(); toggleTheme(); return; }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [spotOpen, spotResults, spotSel, selectable, onSpotPick, closeAllPanels, openSpotlight, toggleTheme]);

  const winStyle = (id) => ({ ...WIN_POS[id] });

  return (
    <div className="viewport">
      <div className="scaler" style={{ width: Math.round(1600 * scale), height: Math.round(1000 * scale) }}>
        <div className="screen" style={{ transform: `scale(${scale})` }} data-screen-label="macos-desktop">

          <div className={`wallpaper wall-${tweaks.wallpaper}`} onMouseDown={closeAllPanels}>
            <div className="motif"></div>
          </div>
          <div className="desk-sig">
            <div><span className="mk">▞</span> jylhis · {theme === 'dark' ? 'field' : 'sheet'}</div>
            <div>macOS, themed — one accent, no gloss</div>
          </div>

          {/* windows */}
          {open.finder && <Finder id="finder" focused={focus === 'finder'} style={winStyle('finder')} onFocus={focusWin} onClose={closeWin} onOpenSearch={openSpotlight} />}
          {open.notes && <Notes id="notes" focused={focus === 'notes'} style={winStyle('notes')} onFocus={focusWin} onClose={closeWin} />}

          {/* menu bar */}
          <MenuBar
            openMenu={openMenu}
            onOpenMenu={(m) => { setOpenMenu(m); setCcOpen(false); setNcOpen(false); }}
            time={timeStr}
            date={dateShort}
            theme={theme}
            ccOpen={ccOpen}
            ncOpen={ncOpen}
            onToggleCC={() => { setCcOpen((v) => !v); setNcOpen(false); setOpenMenu(null); }}
            onToggleNC={() => { setNcOpen((v) => !v); setCcOpen(false); setOpenMenu(null); }}
            onOpenSpotlight={openSpotlight}
            nowPlaying={tweaks.menubarMusic}
          />

          {ccOpen && <ControlCenter theme={theme} onToggleTheme={setTheme} onClose={() => setCcOpen(false)} />}
          {ncOpen && <NotificationCenter date={{ dow: calDow, day: calDay, mo: calMo }} />}

          {/* dock */}
          <Dock onApp={onApp} bouncing={bouncing} calDay={calDay} calDow={calDow} />

          {/* spotlight */}
          {spotOpen && (
            <Spotlight query={spotQuery} results={spotResults} selected={spotSel} onPick={onSpotPick} onClose={() => setSpotOpen(false)} />
          )}
        </div>
      </div>

      <TweaksPanel title="Tweaks">
        <TweakSection label="appearance">
          <TweakRadio label="theme" value={tweaks.theme} onChange={(v) => setTweak('theme', v)} options={[
            { value: 'light', label: 'sheet' },
            { value: 'dark', label: 'field' },
          ]} />
          <TweakSelect label="wallpaper" value={tweaks.wallpaper} onChange={(v) => setTweak('wallpaper', v)} options={[
            { value: 'rings', label: 'rings ◎' },
            { value: 'dots', label: 'dot grid' },
            { value: 'hatch', label: 'hatch ╱╱' },
            { value: 'grid', label: 'grid ▦' },
            { value: 'plain', label: 'plain sheet' },
          ]} />
        </TweakSection>

        <TweakSection label="menu bar">
          <TweakToggle label="now playing" value={tweaks.menubarMusic} onChange={(v) => setTweak('menubarMusic', v)} />
        </TweakSection>

        <TweakSection label="type">
          <TweakSelect label="chrome (mono)" value={tweaks.fontMono} onChange={(v) => setTweak('fontMono', v)} options={[
            { value: 'IBM Plex Mono', label: 'IBM Plex Mono' },
            { value: 'JetBrains Mono', label: 'JetBrains Mono' },
            { value: 'Fira Code', label: 'Fira Code' },
          ]} />
          <TweakSelect label="prose (grotesk)" value={tweaks.fontBody} onChange={(v) => setTweak('fontBody', v)} options={[
            { value: 'Hanken Grotesk', label: 'Hanken Grotesk' },
            { value: 'Inter', label: 'Inter' },
            { value: 'system-ui', label: 'system-ui' },
          ]} />
        </TweakSection>

        <TweakSection label="try">
          <div style={{ fontSize: 11.5, color: 'var(--color-text-muted)', lineHeight: 1.6 }}>
            <div>click the <span style={{ color: 'var(--color-accent)' }}>▞</span> menu, the clock, or the control-centre glyph</div>
            <div><span style={{ color: 'var(--color-accent)' }}>/</span> or <span style={{ color: 'var(--color-accent)' }}>⌘Space</span> — Spotlight · <span style={{ color: 'var(--color-accent)' }}>T</span> — toggle theme</div>
            <div>click a window to give it the bronze focus border</div>
          </div>
        </TweakSection>
      </TweaksPanel>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
