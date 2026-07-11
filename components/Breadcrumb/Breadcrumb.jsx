export function Breadcrumb({ items }) {
  const safeItems = items || [];
  return (
    <nav className="ds-breadcrumb" aria-label="Breadcrumb">
      {safeItems.map((item, i) => {
        const last = i === safeItems.length - 1;
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
