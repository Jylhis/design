export function Breadcrumb({ items = [] }) {
  return (
    <nav className="ds-breadcrumb" aria-label="Breadcrumb">
      {items.map((item, i) => {
        const last = i === items.length - 1;
        return (
          <span key={i} style={{ display: "contents" }}>
            {last || !item.href ? (
              <span className={last ? "ds-breadcrumb__current" : undefined} aria-current={last ? "page" : undefined}>
                {item.label}
              </span>
            ) : (
              <a href={item.href}>{item.label}</a>
            )}
            {!last ? <span className="ds-breadcrumb__sep" aria-hidden="true">›</span> : null}
          </span>
        );
      })}
    </nav>
  );
}
