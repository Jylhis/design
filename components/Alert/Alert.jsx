const GLYPHS = { info: "i", ok: "✓", warn: "!", err: "✗" };
const LABELS = { info: "info", ok: "success", warn: "warning", err: "error" };

export function Alert({ kind = "info", title, children }) {
  const safeKind = GLYPHS[kind] ? kind : "info";
  // Per docs/ACCESSIBILITY.md: role="alert" only for blocking errors; other
  // kinds announce politely via aria-live instead of a status role.
  const live = safeKind === "err" ? { role: "alert" } : { "aria-live": "polite" };
  return (
    <div className={"ds-alert ds-alert--" + safeKind} {...live}>
      <div className="ds-alert__head">
        <span className="ds-alert__glyph" aria-hidden="true">{GLYPHS[safeKind]}</span>
        {title || LABELS[safeKind]}
      </div>
      <p>{children}</p>
    </div>
  );
}
