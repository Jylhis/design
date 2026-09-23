export function Breadcrumb({ items, onNavigate }) {
  const safeItems = items || [];
  return (
    <nav className="ds-breadcrumb" aria-label="Breadcrumb">
      {safeItems.map((item, i) => {
        const last = i === safeItems.length - 1;
        return (
          <span key={`${item.href ?? ""}|${item.label}`} style={{ display: "contents" }}>
            {last || !item.href ? (
              <span className={last ? "ds-breadcrumb__current" : undefined} aria-current={last ? "page" : undefined}>
                {item.label}
              </span>
            ) : (
              <a
                href={item.href}
                onClick={onNavigate ? (e) => { e.preventDefault(); onNavigate(item.href, item, e); } : undefined}
              >{item.label}</a>
            )}
            {!last ? <span className="ds-breadcrumb__sep" aria-hidden="true">›</span> : null}
          </span>
        );
      })}
    </nav>
  );
}
