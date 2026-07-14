export function Divider({ label, children }) {
  return (
    <div className="ds-divider-label" role="separator" aria-label={typeof label === "string" ? label : undefined}>
      {label || children}
    </div>
  );
}
