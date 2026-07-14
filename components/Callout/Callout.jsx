export function Callout({ label = "currently", items, children, headingLevel = 3, ...rest }) {
  const Heading = `h${headingLevel}`;
  return (
    <div className="ds-callout" {...rest}>
      <Heading className="ds-callout__label">{label}</Heading>
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
