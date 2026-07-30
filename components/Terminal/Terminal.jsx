export function Terminal({ title, caret, children }) {
  return (
    <div className="ds-term">
      {title ? <div className="ds-term__title">{title}</div> : null}
      <div className="ds-term__body">
        {children}
        {caret ? (
          <div className="ds-term__line">
            <span className="ds-term__chev" aria-hidden="true">❯</span>
            <span className="ds-caret" aria-hidden="true"></span>
          </div>
        ) : null}
      </div>
    </div>
  );
}

export function TerminalLine({ cmd, cwd, children }) {
  return (
    <div className="ds-term__entry">
      <div className="ds-term__line">
        {cwd ? <span className="ds-term__cwd">{cwd} </span> : null}
        <span className="ds-term__chev" aria-hidden="true">❯</span>
        {cmd ? <span className="ds-term__cmd"> {cmd}</span> : null}
      </div>
      {children ? <pre className="ds-term__out">{children}</pre> : null}
    </div>
  );
}
