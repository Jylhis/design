export function EntryGrid({ items = [], columns = 4 }) {
  // The Chinese mini-program entry grid, rebuilt on the icon set this system
  // actually has: Unicode glyphs, hairlines, no illustration.
  return (
    <ul className="ds-entrygrid" style={{ "--ds-entry-cols": columns }}>
      {items.map((it, i) => (
        <li className="ds-entrygrid__cell" key={i}>
          <a className="ds-entrygrid__link" href={it.href || "#"}>
            <span className="ds-entrygrid__glyph" aria-hidden="true">{it.glyph}</span>
            <span className="ds-entrygrid__label">{it.label}</span>
            {it.badge != null ? <span className="ds-entrygrid__badge">{it.badge}</span> : null}
          </a>
        </li>
      ))}
    </ul>
  );
}
