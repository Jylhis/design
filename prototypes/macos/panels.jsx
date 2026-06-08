/* global React */
/* panels.jsx — Control Center + Notification Center, reskinned.
 * Flat tiles, hairline borders, copper accent for "on" states. The theme
 * module here drives the same paper/roast toggle as the Tweaks panel.
 */

function ControlCenter({ theme, onToggleTheme, onClose }) {
  return (
    <div className="panel cc" onMouseDown={(e) => e.stopPropagation()}>
      <div className="cc-grid">
        {/* connectivity */}
        <div className="cc-tile wide cc-conn">
          <div className="item on">
            <span className="knob">↕</span>
            <span className="lb"><span className="t">Wi-Fi</span><span className="s">jylhis-net</span></span>
          </div>
          <div className="item on">
            <span className="knob">∗</span>
            <span className="lb"><span className="t">Bluetooth</span><span className="s">On</span></span>
          </div>
          <div className="item">
            <span className="knob">◌</span>
            <span className="lb"><span className="t">AirDrop</span><span className="s">Off</span></span>
          </div>
        </div>

        {/* focus + stage */}
        <div className="cc-tile">
          <div className="ttl"><span className="gl">☾</span> Focus</div>
          <div style={{ fontSize: 13, color: 'var(--color-accent)' }}>Do Not Disturb</div>
          <div style={{ fontSize: 11, color: 'var(--color-text-faint)', marginTop: 2 }}>until 18:00</div>
        </div>
        <div className="cc-tile">
          <div className="ttl"><span className="gl">▤</span> Stage</div>
          <div style={{ fontSize: 13, color: 'var(--color-text-muted)' }}>Off</div>
          <div style={{ fontSize: 11, color: 'var(--color-text-faint)', marginTop: 2 }}>tile windows</div>
        </div>

        {/* brightness */}
        <div className="cc-tile wide">
          <div className="ttl"><span className="gl">☀</span> Display</div>
          <div className="slider"><i style={{ width: '72%' }}></i><span className="gl">☀</span></div>
        </div>

        {/* sound */}
        <div className="cc-tile wide">
          <div className="ttl"><span className="gl">♪</span> Sound</div>
          <div className="slider"><i style={{ width: '45%' }}></i><span className="gl">♪</span></div>
        </div>

        {/* theme — drives paper/roast */}
        <div className="cc-tile wide">
          <div className="ttl"><span className="gl">◐</span> Appearance</div>
          <div className="cc-theme">
            <button className={theme === 'light' ? 'on' : ''} onClick={() => onToggleTheme('light')}>
              <span className="sw paper"></span><span className="nm">Paper</span>
            </button>
            <button className={theme === 'dark' ? 'on' : ''} onClick={() => onToggleTheme('dark')}>
              <span className="sw roast"></span><span className="nm">Roast</span>
            </button>
          </div>
        </div>

        {/* now playing */}
        <div className="cc-tile wide">
          <div className="np">
            <span className="art">♪</span>
            <span className="meta">
              <span className="t">Vespers</span>
              <span className="by">Strands — Anatole</span>
            </span>
            <span className="ctrl"><span>◁◁</span><span className="play">❚❚</span><span>▷▷</span></span>
          </div>
        </div>
      </div>
    </div>
  );
}

function NotificationCenter({ date }) {
  const events = [
    { t: 'Design review · desktop theming', when: '11:00 – 11:45', dim: false },
    { t: 'Pairing · token refactor', when: '13:30 – 14:30', dim: false },
    { t: 'Standup', when: '09:15', dim: true },
  ];
  return (
    <div className="panel nc" onMouseDown={(e) => e.stopPropagation()}>
      {/* notification */}
      <div className="nc-card">
        <div className="nc-note">
          <span className="app">⊞</span>
          <div className="body">
            <div className="top"><span className="nm">Finder</span><span className="ago">2m ago</span></div>
            <div className="msg">“jylhis-paper.ase” finished exporting to ~/Downloads — 14 swatches.</div>
          </div>
        </div>
      </div>

      <div className="nc-card">
        <div className="nc-note">
          <span className="app">⎇</span>
          <div className="body">
            <div className="top"><span className="nm">Git</span><span className="ago">8m ago</span></div>
            <div className="msg">main · validate.yml passed — 5 checks green. Pages deploy queued.</div>
          </div>
        </div>
      </div>

      {/* calendar widget */}
      <div className="nc-card">
        <div className="wdg-head">
          <span className="dow">{date.dow}</span>
          <span className="day">{date.day}</span>
          <span className="mo">{date.mo}</span>
        </div>
        {events.map((e, i) => (
          <div key={i} className={`wdg-ev ${e.dim ? 'dim' : ''}`}>
            <span className="bar"></span>
            <span className="info"><span className="t">{e.t}</span><br /><span className="when">{e.when}</span></span>
          </div>
        ))}
      </div>

      {/* weather widget */}
      <div className="nc-card">
        <div className="wdg-weather">
          <div>
            <div className="loc">Helsinki</div>
            <div className="temp">3°</div>
            <div className="wx">Partly clear · feels −1°</div>
          </div>
          <span className="glyph">☁</span>
        </div>
      </div>

      {/* now playing widget */}
      <div className="nc-card">
        <div className="wdg-label">now playing</div>
        <div className="np">
          <span className="art">♪</span>
          <span className="meta"><span className="t">Vespers</span><span className="by">Strands — Anatole</span></span>
          <span className="ctrl"><span>◁◁</span><span className="play">❚❚</span><span>▷▷</span></span>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { ControlCenter, NotificationCenter });
