export function ManLabel({ title = "", section = 7 }) {
  return (
    <span className="ds-man-label">{String(title).toUpperCase()}({section})</span>
  );
}
