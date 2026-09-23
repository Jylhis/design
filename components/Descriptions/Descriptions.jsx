export function Descriptions({ title, items = [], columns = 1 }) {
  return (
    <div className="ds-descriptions" style={{ "--ds-desc-cols": columns }}>
      {title ? <h3 className="ds-descriptions__title">{title}</h3> : null}
      <dl className="ds-descriptions__list">
        {items.map((it, i) => (
          <div className="ds-descriptions__item" key={i} style={it.span ? { gridColumn: "span " + it.span } : undefined}>
            <dt className="ds-descriptions__term">{it.term}</dt>
            <dd className={"ds-descriptions__desc" + (it.numeric ? " ds-descriptions__desc--numeric" : "")}>
              {it.value}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
