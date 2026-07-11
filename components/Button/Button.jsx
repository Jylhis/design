export function Button({ variant = "ghost", kbdHint, loading = false, children, ...rest }) {
  const busy = loading ? { "aria-busy": "true", disabled: true } : null;
  if (variant === "search") {
    return (
      <button type="button" className="ds-btn ds-btn--search" {...busy} {...rest}>
        <span>{children}</span>
        {kbdHint ? <kbd className="ds-kbd">{kbdHint}</kbd> : null}
      </button>
    );
  }
  return (
    <button type="button" className={"ds-btn ds-btn--" + variant} {...busy} {...rest}>
      {children}
    </button>
  );
}
