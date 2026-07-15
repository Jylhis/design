// Header.jsx — site header lockup: DS Mark + DS Breadcrumb + DS Button(search)
const Header = ({ crumbs = [{label: 'home', href: '/', current: true}], onNav, onSearch, theme, onToggleTheme }) => (
  <header className="site-header">
    <a className="site-wordmark-group" onClick={(e)=>{e.preventDefault(); onNav?.('/');}} href="/">
      <span className="makers-mark" style={{fontSize:'1.2rem'}}><Mark/></span>
      <span className="wordmark">your name</span>
    </a>
    <div className="header-right">
      <Breadcrumb
        items={crumbs.map(c => ({ label: c.label, href: c.current ? undefined : c.href }))}
        onNavigate={(href) => onNav?.(href)}
      />
      <Button variant="search" kbdHint="/" onClick={onSearch}>search</Button>
      <button className="theme-toggle" onClick={onToggleTheme} aria-label="Toggle theme">
        {theme === 'dark' ? '☀' : '☾'}
      </button>
    </div>
  </header>
);

window.Header = Header;
