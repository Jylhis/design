// Header.jsx — site header lockup with maker's mark + breadcrumb
const Rune = ({ size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="square">
    <line x1="16" y1="2" x2="16" y2="30"/>
    <line x1="16" y1="6" x2="26" y2="14"/>
    <line x1="16" y1="6" x2="6" y2="14"/>
    <line x1="6" y1="14" x2="16" y2="22" strokeWidth="2"/>
    <line x1="26" y1="14" x2="16" y2="22" strokeWidth="2"/>
    <line x1="8" y1="22" x2="16" y2="14" strokeWidth="1.5"/>
    <line x1="24" y1="22" x2="16" y2="14" strokeWidth="1.5"/>
  </svg>
);

const Header = ({ crumbs = [{label: 'home', href: '/', current: true}], onNav, onSearch, theme, onToggleTheme }) => (
  <header className="site-header">
    <a className="site-wordmark-group" onClick={(e)=>{e.preventDefault(); onNav && onNav('/');}} href="/">
      <span className="makers-mark"><Rune size={28}/></span>
      <span className="wordmark">your name</span>
    </a>
    <div className="header-right">
      <nav className="ds-breadcrumb" aria-label="Breadcrumb">
        {crumbs.map((c, i) => (
          <React.Fragment key={i}>
            {i > 0 && <span className="ds-breadcrumb__sep" aria-hidden="true">›</span>}
            {c.current
              ? <span className="ds-breadcrumb__current" aria-current="page">{c.label}</span>
              : <a href={c.href} onClick={(e)=>{e.preventDefault(); onNav && onNav(c.href);}}>{c.label}</a>}
          </React.Fragment>
        ))}
      </nav>
      <button type="button" className="ds-btn ds-btn--search" onClick={onSearch}>
        <span>search</span>
        <kbd className="ds-kbd">/</kbd>
      </button>
      <button className="theme-toggle" onClick={onToggleTheme} aria-label="Toggle theme">
        {theme === 'dark' ? '☀' : '☾'}
      </button>
    </div>
  </header>
);

window.Rune = Rune;
window.Header = Header;
