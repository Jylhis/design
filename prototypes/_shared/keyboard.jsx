/* global React */
// keyboard.jsx — keyboard-first navigation layer for the exploration canvas.
//
//   ?         toggle this cheatsheet
//   j / ↓     next artboard
//   k / ↑     previous artboard
//   J / K     next / previous section
//   g 1..9    jump to section N
//   f         focus current artboard fullscreen (dispatches dblclick)
//   t         toggle paper / roast theme
//   h         cycle brand hue
//   /         focus first input on the visible artboard
//   Esc       close overlays / clear focus
//
// The hint chip in the bottom-left always says "? for keys" so the
// affordance is permanently discoverable without printing the full list.
//
// Exports KeyboardLayer({ onTheme, onHue }) and pushes it on window.

const KB_STYLE = `
  /* desktop: always-visible legend in the bottom-left.
     mobile (<=640px): hide the legend, show the compact ? chip instead. */
  .kb-legend{position:fixed;left:14px;bottom:14px;z-index:2147483645;
    background:var(--color-surface-raised);color:var(--color-text);
    border:1.5px solid var(--color-text-heading);border-radius:3px;
    box-shadow:3px 3px 0 0 var(--color-text-heading),
               inset 1px 1px 0 0 color-mix(in oklab,#fff 70%,transparent);
    padding:10px 12px;font-family:var(--font-body);min-width:230px;
    transition:transform 180ms cubic-bezier(.2,.7,.3,1),
               opacity 180ms,box-shadow 180ms}
  .kb-legend.is-collapsed{transform:translate(-2px,2px);
    box-shadow:1px 1px 0 0 var(--color-text-heading)}
  .kb-legend-head{display:flex;align-items:center;justify-content:space-between;
    gap:10px;font:700 .68rem/1 var(--font-mono,ui-monospace,monospace);
    letter-spacing:.1em;text-transform:uppercase;color:var(--color-brand);
    padding-bottom:6px;border-bottom:1px dashed var(--color-decorator);
    margin-bottom:8px}
  .kb-legend-head button{appearance:none;border:0;background:transparent;
    color:var(--color-text-muted);cursor:pointer;font:inherit;
    padding:2px 4px;border-radius:2px}
  .kb-legend-head button:hover{color:var(--color-text-heading)}
  .kb-legend-head button:focus-visible{outline:2px solid var(--color-accent);outline-offset:2px}
  .kb-legend ul{list-style:none;margin:0;padding:0;display:grid;
    grid-template-columns:auto 1fr;gap:6px 12px;align-items:center}
  .kb-legend ul li{display:contents}
  .kb-legend ul li .keys{font-family:var(--font-mono,ui-monospace,monospace);
    white-space:nowrap;color:var(--color-text-heading)}
  .kb-legend ul li .desc{font-size:.78rem;color:var(--color-text-muted);
    line-height:1.35}
  .kb-legend kbd{font:inherit;font-size:.7rem;background:var(--color-bg-subtle);
    border:1.5px solid var(--color-text-heading);border-radius:2px;
    padding:1px 5px;color:var(--color-text-heading);
    box-shadow:1.5px 1.5px 0 0 var(--color-text-heading);
    display:inline-block;margin:0 1px}
  .kb-legend-foot{margin-top:8px;padding-top:6px;
    border-top:1px dashed var(--color-decorator);
    font:.68rem/1.3 var(--font-mono,ui-monospace,monospace);
    letter-spacing:.06em;text-transform:uppercase;color:var(--color-text-muted)}
  .kb-legend-foot a{color:var(--color-brand);text-decoration:none}
  .kb-legend-foot a:hover{text-decoration:underline}

  /* mobile chip — only shown when legend is hidden */
  .kb-hint{position:fixed;left:14px;bottom:14px;z-index:2147483645;
    display:none;align-items:center;gap:8px;
    font:600 11px/1 var(--font-mono,ui-monospace,monospace);
    letter-spacing:.06em;text-transform:uppercase;
    padding:10px 12px;background:var(--color-surface-raised);
    color:var(--color-text-heading);min-height:44px;
    border:1.5px solid var(--color-text-heading);border-radius:3px;
    box-shadow:2px 2px 0 0 var(--color-text-heading);cursor:pointer}
  .kb-hint:focus-visible{outline:2px solid var(--color-accent);outline-offset:2px}
  .kb-hint kbd{font:inherit;background:var(--color-bg-subtle);
    border:1px solid var(--color-border-strong);border-radius:2px;
    padding:1px 5px;color:var(--color-text-heading)}

  @media (max-width:640px){
    .kb-legend{display:none}
    .kb-hint{display:inline-flex}
  }

  .kb-scrim{position:fixed;inset:0;z-index:2147483646;
    background:color-mix(in oklab,var(--color-bg) 70%,transparent);
    -webkit-backdrop-filter:blur(2px);backdrop-filter:blur(2px);
    display:flex;align-items:center;justify-content:center;padding:24px}
  .kb-sheet{width:min(640px,100%);max-height:80vh;overflow:auto;
    background:var(--color-surface-raised);color:var(--color-text);
    border:2px solid var(--color-text-heading);border-radius:3px;
    box-shadow:6px 6px 0 0 var(--color-brand),
               inset 1px 1px 0 0 color-mix(in oklab,#fff 70%,transparent);
    padding:22px 24px;font-family:var(--font-body)}
  .kb-sheet h2{margin:0 0 4px;font:700 1.1rem/1.2 var(--font-mono);
    color:var(--color-text-heading);letter-spacing:.02em}
  .kb-sheet .kb-sub{font:11px/1.4 var(--font-mono);
    letter-spacing:.08em;text-transform:uppercase;color:var(--color-brand);
    margin-bottom:14px}
  .kb-sheet dl{display:grid;grid-template-columns:auto 1fr;
    gap:10px 18px;margin:0;align-items:baseline}
  .kb-sheet dt{font-family:var(--font-mono);font-size:.82rem;
    color:var(--color-text-heading);white-space:nowrap}
  .kb-sheet dd{margin:0;font-size:.92rem;color:var(--color-text)}
  .kb-sheet dt kbd{font-family:inherit;font-size:.78rem;
    background:var(--color-bg-subtle);
    border:1.5px solid var(--color-text-heading);
    border-radius:2px;padding:2px 7px;
    box-shadow:1.5px 1.5px 0 0 var(--color-text-heading);
    margin-right:4px;display:inline-block}
  .kb-sheet .kb-foot{margin-top:18px;padding-top:12px;
    border-top:1px dashed var(--color-decorator);
    font:11px/1.5 var(--font-mono);letter-spacing:.04em;
    color:var(--color-text-muted);text-transform:uppercase}
  .kb-sheet section + section{margin-top:14px}
  .kb-sheet section h3{margin:0 0 8px;font:700 .72rem/1 var(--font-mono);
    letter-spacing:.1em;text-transform:uppercase;color:var(--color-text-muted)}

  /* skip link — hidden until tabbed */
  .kb-skip{position:fixed;top:-100px;left:14px;z-index:2147483647;
    padding:10px 14px;background:var(--color-brand);color:var(--color-bg);
    font:700 .82rem/1 var(--font-mono);letter-spacing:.04em;
    border:2px solid var(--color-text-heading);border-radius:3px;
    box-shadow:3px 3px 0 0 var(--color-text-heading);text-decoration:none;
    transition:top 150ms}
  .kb-skip:focus{top:14px;outline:none}

  /* ring for currently-keyboard-active artboard */
  [data-kb-active="true"]{outline:2px solid var(--color-brand);outline-offset:4px}
`;

const SHORTCUTS = [
  ['Navigate', [
    [['?'],          'show / hide this sheet'],
    [['j', '↓'],     'next artboard'],
    [['k', '↑'],     'previous artboard'],
    [['shift', 'J'], 'next section'],
    [['shift', 'K'], 'previous section'],
    [['g', '1-9'],   'jump to section number'],
    [['Home'],       'first artboard'],
    [['End'],        'last artboard'],
  ]],
  ['Act', [
    [['Enter', 'f'], 'focus current artboard fullscreen'],
    [['/'],          'focus first input on current artboard'],
    [['Esc'],        'close overlay / clear focus'],
  ]],
  ['Theme', [
    [['t'],          'toggle paper / roast'],
    [['h'],          'cycle brand hue'],
  ]],
];

function KeyboardSheet({ onClose }) {
  React.useEffect(() => {
    const prev = document.activeElement;
    const ref = document.querySelector('.kb-sheet');
    if (ref) ref.focus();
    return () => { if (prev && prev.focus) prev.focus(); };
  }, []);
  return (
    <div className="kb-scrim" role="dialog" aria-modal="true" aria-label="Keyboard shortcuts"
         onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="kb-sheet" tabIndex={-1}>
        <div className="kb-sub">// shortcuts</div>
        <h2>Keyboard navigation</h2>
        {SHORTCUTS.map(([name, rows]) => (
          <section key={name}>
            <h3>{name}</h3>
            <dl>
              {rows.map(([keys, desc], i) => (
                <React.Fragment key={i}>
                  <dt>{keys.map((k, j) => <React.Fragment key={j}>{j > 0 && <span style={{ color: 'var(--color-text-faint)' }}> / </span>}<kbd>{k}</kbd></React.Fragment>)}</dt>
                  <dd>{desc}</dd>
                </React.Fragment>
              ))}
            </dl>
          </section>
        ))}
        <div className="kb-foot">press <kbd style={{ padding: '1px 5px', border: '1px solid var(--color-border-strong)', borderRadius: 2, fontFamily: 'inherit' }}>esc</kbd> to close · press <kbd style={{ padding: '1px 5px', border: '1px solid var(--color-border-strong)', borderRadius: 2, fontFamily: 'inherit' }}>?</kbd> any time to reopen</div>
      </div>
    </div>
  );
}

const LEGEND_ROWS = [
  [['j', 'k'],         'next / prev artboard'],
  [['J', 'K'],         'next / prev section'],
  [['g', '1-9'],       'jump to section'],
  [['f'],              'focus fullscreen'],
  [['t', 'h'],         'theme · hue'],
];

function KeyboardLayer({ onTheme, onHue }) {
  const [open, setOpen] = React.useState(false);
  const [collapsed, setCollapsed] = React.useState(() => {
    try { return localStorage.getItem('kb-legend-collapsed') === '1'; } catch { return false; }
  });
  const activeIdxRef = React.useRef(0);
  const gPendingRef = React.useRef(false);

  const toggleCollapsed = () => {
    setCollapsed((c) => {
      const v = !c;
      try { localStorage.setItem('kb-legend-collapsed', v ? '1' : '0'); } catch {}
      return v;
    });
  };

  // inject style once
  React.useEffect(() => {
    if (document.getElementById('kb-style')) return;
    const s = document.createElement('style');
    s.id = 'kb-style';
    s.textContent = KB_STYLE;
    document.head.appendChild(s);
  }, []);

  // walk artboards + sections from the canvas DOM
  const getArtboards = () => Array.from(document.querySelectorAll('[data-dc-slot]'));
  const getSections  = () => Array.from(document.querySelectorAll('[data-dc-section]'));

  // fallback selectors if the canvas uses a different attribute
  const artboardEls = () => getArtboards();
  const sectionEls  = () => getSections();

  const focusArtboard = (idx) => {
    const els = artboardEls();
    if (!els.length) return;
    const i = ((idx % els.length) + els.length) % els.length;
    activeIdxRef.current = i;
    els.forEach((el, j) => el.dataset.kbActive = j === i ? 'true' : 'false');
    els[i].scrollIntoView({ block: 'center', inline: 'center', behavior: 'smooth' });
    // make it tab-focusable + focus it
    els[i].setAttribute('tabindex', '-1');
    els[i].focus({ preventScroll: true });
  };

  const focusSection = (delta) => {
    const secs = sectionEls();
    if (!secs.length) return;
    // determine current section by viewport center
    const cy = window.innerHeight / 2;
    let cur = 0, best = Infinity;
    secs.forEach((s, i) => {
      const r = s.getBoundingClientRect();
      const d = Math.abs((r.top + r.bottom) / 2 - cy);
      if (d < best) { best = d; cur = i; }
    });
    const next = Math.max(0, Math.min(secs.length - 1, cur + delta));
    secs[next].scrollIntoView({ block: 'start', behavior: 'smooth' });
  };

  const jumpSection = (n) => {
    const secs = sectionEls();
    if (n < 1 || n > secs.length) return;
    secs[n - 1].scrollIntoView({ block: 'start', behavior: 'smooth' });
  };

  React.useEffect(() => {
    const onKey = (e) => {
      // never swallow keys while user is typing
      const t = e.target;
      const typing = t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.isContentEditable);

      if (e.key === 'Escape') {
        if (open) { setOpen(false); e.preventDefault(); return; }
        if (document.activeElement && document.activeElement.blur) document.activeElement.blur();
        return;
      }

      if (typing && e.key !== 'Escape') return;

      // ? — toggle help
      if (e.key === '?' || (e.key === '/' && e.shiftKey)) {
        setOpen((v) => !v);
        e.preventDefault();
        return;
      }

      // g 1..9 — jump to section
      if (gPendingRef.current && /^[1-9]$/.test(e.key)) {
        jumpSection(parseInt(e.key, 10));
        gPendingRef.current = false;
        e.preventDefault();
        return;
      }
      if (e.key === 'g' && !e.shiftKey && !e.metaKey && !e.ctrlKey) {
        gPendingRef.current = true;
        setTimeout(() => { gPendingRef.current = false; }, 1000);
        e.preventDefault();
        return;
      }

      switch (e.key) {
        case 'j':
        case 'ArrowDown':
          focusArtboard(activeIdxRef.current + 1); e.preventDefault(); break;
        case 'k':
        case 'ArrowUp':
          focusArtboard(activeIdxRef.current - 1); e.preventDefault(); break;
        case 'J':
          focusSection(+1); e.preventDefault(); break;
        case 'K':
          focusSection(-1); e.preventDefault(); break;
        case 'Home':
          focusArtboard(0); e.preventDefault(); break;
        case 'End':
          focusArtboard(artboardEls().length - 1); e.preventDefault(); break;
        case 'Enter':
        case 'f':
          {
            const els = artboardEls();
            const el = els[activeIdxRef.current];
            if (el) el.dispatchEvent(new MouseEvent('dblclick', { bubbles: true }));
            e.preventDefault();
          }
          break;
        case '/':
          {
            const els = artboardEls();
            const el = els[activeIdxRef.current];
            const inp = el && el.querySelector('input, textarea');
            if (inp) { inp.focus(); e.preventDefault(); }
          }
          break;
        case 't':
          if (onTheme) { onTheme(); e.preventDefault(); }
          break;
        case 'h':
          if (onHue) { onHue(); e.preventDefault(); }
          break;
        default:
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onTheme, onHue]);

  return (
    <>
      <a className="kb-skip" href="#dc-canvas-root">skip to canvas</a>

      {/* desktop: always-visible legend */}
      <aside className={`kb-legend${collapsed ? ' is-collapsed' : ''}`}
             aria-label="Keyboard shortcuts">
        <div className="kb-legend-head">
          <span>// keys</span>
          <span style={{ display: 'flex', gap: 2 }}>
            <button onClick={() => setOpen(true)} title="Show all shortcuts (?)" aria-label="Show all shortcuts">all</button>
            <button onClick={toggleCollapsed} title={collapsed ? 'Expand' : 'Collapse'} aria-label={collapsed ? 'Expand legend' : 'Collapse legend'}>{collapsed ? '+' : '–'}</button>
          </span>
        </div>
        {!collapsed && (
          <>
            <ul>
              {LEGEND_ROWS.map(([keys, desc], i) => (
                <li key={i}>
                  <span className="keys">
                    {keys.map((k, j) => (
                      <React.Fragment key={j}>
                        {j > 0 && <span style={{ color: 'var(--color-text-faint)' }}> · </span>}
                        <kbd>{k}</kbd>
                      </React.Fragment>
                    ))}
                  </span>
                  <span className="desc">{desc}</span>
                </li>
              ))}
            </ul>
            <div className="kb-legend-foot">
              press <kbd>?</kbd> for full list · <a href="#" onClick={(e) => { e.preventDefault(); setOpen(true); }}>open</a>
            </div>
          </>
        )}
      </aside>

      {/* mobile chip — hidden on desktop */}
      <button className="kb-hint" onClick={() => setOpen(true)}
              aria-label="Show keyboard shortcuts" title="Keyboard shortcuts">
        <kbd>?</kbd> <span>keys</span>
      </button>

      {open && <KeyboardSheet onClose={() => setOpen(false)} />}
    </>
  );
}

window.KeyboardLayer = KeyboardLayer;
