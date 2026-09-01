export function Legend({ title = "Legend", items = [], columns = 3 }) {
  return (
    <div className="ds-legend">
      <div className="ds-legend__head">{title}</div>
      <div className="ds-legend__grid" style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}>
        {items.map((it) => (
          <div className="ds-legend__row" key={it.name}>
            {it.glyph ? (
              <span className="ds-legend__glyph" style={{ color: it.color }} aria-hidden="true">{it.glyph}</span>
            ) : (
              <span className="ds-legend__swatch" style={{ background: it.color }} aria-hidden="true"></span>
            )}
            <span>
              <span className="ds-legend__name">{it.name}</span>
              <span className="ds-legend__value">{it.value ?? it.color}</span>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
