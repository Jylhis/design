export function Callout({ label = "currently", items, children }) {
  return (
    <div className="ds-callout">
      <h3 className="ds-callout__label">{label}</h3>
      {items && items.length ? (
        <ul>
          {items.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
      ) : (
        children
      )}
    </div>
  );
}
