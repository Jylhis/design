/* global React, DCArtboard */
const { useState } = React;

// ───────────────────────────────────────────── Header strip
function FrameHeader({ family, summary }) {
  return (
    <div style={{
      fontFamily: 'var(--font-mono)',
      fontSize: '0.7rem',
      letterSpacing: '0.08em',
      textTransform: 'uppercase',
      color: 'var(--color-text-muted)',
      marginBottom: '14px',
      display: 'flex', alignItems: 'baseline', gap: '10px',
    }}>
      <span style={{ color: 'var(--color-brand)', fontWeight: 700 }}>[{family}]</span>
      <span>{summary}</span>
    </div>
  );
}

// ───────────────────────────────────────────── BUTTONS
function ButtonsBoard({ family }) {
  const cls = family;
  const summary = ({
    paper:    'flat baseline · 1px border · color shift on hover',
    br:       'brutal stamp · 2px ink border · solid offset block',
    nu:       'letterpress · inset valleys + ridges, no blur',
    hy:       'hybrid · ink stamp + paper press, copper on focus',
  })[family];
  return (
    <div style={{ padding: 28, fontFamily: 'var(--font-body)' }}>
      <FrameHeader family={family} summary={summary} />
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 22, fontWeight: 700, marginBottom: 18, color: 'var(--color-text-heading)' }}>Buttons</div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14, alignItems: 'center' }}>
        {family === 'paper' ? (
          <>
            <button className="paper-btn">submit</button>
            <button className="paper-btn is-copper">submit</button>
            <button className="paper-btn is-ghost">cancel</button>
          </>
        ) : (
          <>
            <button className={`${cls}-btn`}>submit</button>
            <button className={`${cls}-btn is-copper`}>submit</button>
            <button className={`${cls}-btn`} disabled style={{ opacity: 0.55 }}>disabled</button>
          </>
        )}
      </div>
      <div style={{ marginTop: 22, display: 'flex', gap: 14, flexWrap: 'wrap' }}>
        <span className={family === 'paper' ? 'paper-tag' : `${cls}-tag`}>active</span>
        <span className={family === 'paper' ? 'paper-tag' : `${cls}-tag is-copper`}>shipping</span>
        <span className={family === 'paper' ? 'paper-tag' : `${cls}-tag`}>v0.4</span>
      </div>
    </div>
  );
}

// ───────────────────────────────────────────── CARDS
function CardsBoard({ family }) {
  const cls = family;
  const summary = ({
    paper: 'flat surface · border + bg step',
    br:    'offset shadow card, no radius, copper variant',
    nu:    'embossed paper · ridge / valley insets',
    hy:    'copper-stamped + linen-press card with corner tag',
  })[family];

  const Card = ({ extra, children }) => (
    <div className={family === 'paper' ? `paper-card ${extra || ''}` : `${cls}-card ${extra || ''}`} style={{ flex: 1, minWidth: 220, position: 'relative' }}>
      {children}
    </div>
  );

  return (
    <div style={{ padding: 28, fontFamily: 'var(--font-body)' }}>
      <FrameHeader family={family} summary={summary} />
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 22, fontWeight: 700, marginBottom: 18, color: 'var(--color-text-heading)' }}>Cards</div>
      <div style={{ display: 'flex', gap: 18, flexWrap: 'wrap' }}>
        <Card>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--color-text-muted)' }}>note · oct 19</div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 17, fontWeight: 700, marginTop: 6, color: 'var(--color-text-heading)' }}>Modern unix tools</div>
          <div style={{ fontSize: 14, marginTop: 10, color: 'var(--color-text)', lineHeight: 1.55 }}>Replacements for ls, cat, grep, du — all rust, all sane defaults.</div>
        </Card>
        <Card extra={family === 'br' ? 'is-copper' : ''}>
          {family === 'hy' && <span className="hy-corner-tag">live</span>}
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--color-text-muted)' }}>project · drwxr-xr-x</div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 17, fontWeight: 700, marginTop: 6, color: 'var(--color-text-heading)' }}>marchyo</div>
          <div style={{ fontSize: 14, marginTop: 10, color: 'var(--color-text)', lineHeight: 1.55 }}>Personal spin of Omarchy with NixOS.</div>
          <div style={{ marginTop: 14, display: 'flex', gap: 8, fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--color-text-muted)' }}>
            <span>★ 142</span><span>⑂ 9</span>
          </div>
        </Card>
        <Card extra={family === 'nu' ? 'is-pressed' : ''}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--color-brand)' }}>// currently</div>
          <ul style={{ paddingLeft: 16, marginTop: 8, fontSize: 14, color: 'var(--color-text)', lineHeight: 1.7, listStyle: 'none' }}>
            <li>› shipping a design system at work</li>
            <li>› reading <em>The Pragmatic Engineer</em></li>
            <li>› sourdough on saturday mornings</li>
          </ul>
        </Card>
      </div>
    </div>
  );
}

// ───────────────────────────────────────────── INPUTS
function InputsBoard({ family }) {
  const cls = family;
  const summary = ({
    paper: 'flat field · 1px border, accent on focus',
    br:    'block-shadow stamp on focus, copper border',
    nu:    'pressed valley field · concave inset',
    hy:    'pressed valley + copper stamp on focus',
  })[family];
  const inputCls = family === 'paper' ? 'paper-input' : `${cls}-input`;
  const [val, setVal] = useState('markus@jylhis.com');
  return (
    <div style={{ padding: 28, fontFamily: 'var(--font-body)' }}>
      <FrameHeader family={family} summary={summary} />
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 22, fontWeight: 700, marginBottom: 18, color: 'var(--color-text-heading)' }}>Form fields</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14, maxWidth: 360 }}>
        <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, letterSpacing: '0.04em', color: 'var(--color-text-muted)' }}>email</span>
          <input className={inputCls} value={val} onChange={(e) => setVal(e.target.value)} />
        </label>
        <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, letterSpacing: '0.04em', color: 'var(--color-text-muted)' }}>note</span>
          <textarea className={inputCls} rows={3} defaultValue="A line of warm paper goes here." />
        </label>
        <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
          {family === 'paper' ? (
            <button className="paper-btn is-copper">save</button>
          ) : (
            <button className={`${cls}-btn is-copper`}>save</button>
          )}
          {family === 'paper' ? (
            <button className="paper-btn">cancel</button>
          ) : (
            <button className={`${cls}-btn`}>cancel</button>
          )}
        </div>
      </div>
    </div>
  );
}

// ───────────────────────────────────────────── CURRENTLY
function CurrentlyBoard({ family }) {
  const summary = ({
    paper: 'baseline · 3px copper left border, no shadow',
    br:    'block-stamped · 2px ink border + copper offset',
    nu:    'embossed paper · letterpress recess',
    hy:    'house style · copper edge + ink stamp',
  })[family];
  const map = { paper: 'paper-currently', br: 'br-card is-copper', nu: 'nu-card is-pressed', hy: 'hy-currently' };
  return (
    <div style={{ padding: 28, fontFamily: 'var(--font-body)' }}>
      <FrameHeader family={family} summary={summary} />
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 22, fontWeight: 700, marginBottom: 18, color: 'var(--color-text-heading)' }}>Currently — hero block</div>
      <div className={map[family]} style={{ maxWidth: 480 }}>
        <div className={family === 'hy' ? 'label' : ''} style={{
          fontFamily: 'var(--font-mono)', fontSize: 12, fontWeight: 700,
          textTransform: 'uppercase', letterSpacing: '0.1em',
          color: 'var(--color-brand)', marginBottom: 8,
        }}>// currently</div>
        <ul style={{ paddingLeft: 0, listStyle: 'none', margin: 0, fontSize: 15, lineHeight: 1.75, color: 'var(--color-text)' }}>
          <li>› senior software engineer · Zürich, CH</li>
          <li>› shipping a design system on warm paper</li>
          <li>› chasing fewer hours, better work</li>
        </ul>
      </div>
    </div>
  );
}

// ───────────────────────────────────────────── STATUS / ALERTS
function StatusBoard() {
  return (
    <div style={{ padding: 28, fontFamily: 'var(--font-body)' }}>
      <FrameHeader family="hybrid" summary="status pills · letterpressed dots, mono labels" />
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 22, fontWeight: 700, marginBottom: 18, color: 'var(--color-text-heading)' }}>Status</div>
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        <span className="nu-status is-ok">deploy ok</span>
        <span className="nu-status is-warn">cache stale</span>
        <span className="nu-status is-err">build failed</span>
        <span className="nu-status is-info">draft</span>
      </div>
      <div style={{ marginTop: 26, display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 460 }}>
        <div className="hy-card" style={{ borderLeft: '4px solid var(--color-status-ok)' }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--color-status-ok)' }}>ok · 17:42</div>
          <div style={{ fontSize: 14, marginTop: 6 }}>Cloudflare build succeeded · 2.3s</div>
        </div>
        <div className="hy-card" style={{ borderLeft: '4px solid var(--color-status-warn)' }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--color-status-warn)' }}>warn · 17:38</div>
          <div style={{ fontSize: 14, marginTop: 6 }}>Token contrast for syn-number is 4.51 (AA, near floor).</div>
        </div>
      </div>
    </div>
  );
}

// ───────────────────────────────────────────── COMPARE — recommendation
function CompareBoard() {
  return (
    <div style={{ padding: 28, fontFamily: 'var(--font-body)' }}>
      <FrameHeader family="recommendation" summary="three side by side, same content" />
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 22, fontWeight: 700, marginBottom: 18, color: 'var(--color-text-heading)' }}>Same card, three voices</div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 22 }}>
        {['br', 'nu', 'hy'].map((fam) => (
          <div key={fam}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--color-text-muted)', marginBottom: 8 }}>
              {({ br: 'brutalist', nu: 'neumorphic', hy: 'hybrid (recommended)' })[fam]}
            </div>
            <div className={`${fam}-card`} style={{ position: 'relative' }}>
              {fam === 'hy' && <span className="hy-corner-tag">house</span>}
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--color-text-muted)' }}>note · oct 19</div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 16, fontWeight: 700, marginTop: 4, color: 'var(--color-text-heading)' }}>Build more, work less</div>
              <div style={{ fontSize: 13, marginTop: 8, color: 'var(--color-text)', lineHeight: 1.55 }}>I don't have enough hours in the day to build everything I want — and neither do you.</div>
              <div style={{ marginTop: 14 }}>
                <button className={`${fam}-btn is-copper`}>read</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ───────────────────────────────────────────── EXPOSE
Object.assign(window, {
  ButtonsBoard, CardsBoard, InputsBoard, CurrentlyBoard, StatusBoard, CompareBoard,
});
