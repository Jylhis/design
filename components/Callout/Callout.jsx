export function Callout({ label = "currently", items, children }) {
  return (
    <div className="ds-callout">
      <h3 className="ds-callout__label">{label}</h3>
      {items?.length ? (
        <ul>
          {React.Children.toArray(items.map((item) => <li>{item}</li>))}
        </ul>
      ) : (
        children
      )}
    </div>
  );
}
