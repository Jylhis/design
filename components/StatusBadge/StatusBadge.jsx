export function StatusBadge({ status = "active", children }) {
  return (
    <span className={"ds-status ds-status--" + status}>
      {children || status}
    </span>
  );
}
