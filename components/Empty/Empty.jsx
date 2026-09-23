export function Empty({ children, action }) {
  // Annotated absence, in the system's own // voice. No illustration.
  return (
    <div className="ds-empty">
      <p className="ds-empty__note"><span aria-hidden="true">// </span>{children}</p>
      {action ? <div className="ds-empty__action">{action}</div> : null}
    </div>
  );
}
