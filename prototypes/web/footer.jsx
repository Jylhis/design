// Footer.jsx
const Footer = ({ onNav }) => (
  <footer className="site-footer">
    <div className="footer-rule" aria-hidden="true">────────────────────────────────────────────────────────────────────────</div>
    <nav className="footer-nav">
      {[
        ['home', [['about','/'], ['currently','/#currently'], ['docs','https://docs.example.com']]],
        ['resume', [['experience','/resume/'], ['skills','/resume/'], ['education','/resume/']]],
        ['projects', [['workstation','/projects/workstation/'], ['editor','/projects/editor/'], ['all projects','/projects/']]],
        ['notes', [['latest','/notes/'], ['tags','/tags/'], ['rss feed','/rss.xml']]],
      ].map(([title, links]) => (
        <div className="nav-col" key={title}>
          <span className="nav-heading">{title}</span>
          <ul>
            {links.map(([label, href]) => (
              <li key={label}>
                <a href={href} onClick={(e)=>{ if (!href.startsWith('http')) { e.preventDefault(); onNav?.(href); } }}>{label}</a>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </nav>
    <div className="footer-identity">
      <span className="dash">───</span>
      <span className="rune"><Mark/></span>
      <span className="identity-text">your name · your role</span>
      <span className="dash">───</span>
    </div>
    <div className="footer-social">
      <a href="https://github.com/your-org">github</a>
      <a href="https://linkedin.com/in/your-handle">linkedin</a>
      <a href="mailto:hello@example.com">email</a>
    </div>
    <div className="footer-colophon">set in literata &amp; jetbrains mono · built with astro · hosted on cloudflare</div>
    <div className="footer-rule" aria-hidden="true">────────────────────────────────────────────────────────────────────────</div>
  </footer>
);

window.Footer = Footer;
