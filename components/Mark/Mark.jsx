export function Mark({ live = false, children = "jy" }) {
  return (
    <span className="ds-mark">
      {children}
      {"\u2009"}
      <span className="ds-mark__chevron" aria-hidden="true">❯</span>
      {live ? <span className="ds-caret" aria-hidden="true"></span> : null}
    </span>
  );
}
