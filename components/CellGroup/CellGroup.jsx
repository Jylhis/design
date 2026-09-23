export function CellGroup({ label, children }) {
  return (
    <section className="ds-cellgroup">
      {label ? <h3 className="ds-cellgroup__label">{label}</h3> : null}
      <div className="ds-cellgroup__list">{children}</div>
    </section>
  );
}
