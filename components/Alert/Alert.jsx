const GLYPHS = { info: "i", ok: "✓", warn: "!", err: "✗" };
const LABELS = { info: "info", ok: "success", warn: "warning", err: "error" };

export function Alert({ kind = "info", title, children }) {
  const safeKind = GLYPHS[kind] ? kind : "info";
  return (
    <div className={"ds-alert ds-alert--" + safeKind} role={safeKind === "err" ? "alert" : "status"}>
      <div className="ds-alert__head">
        <span className="ds-alert__glyph" aria-hidden="true">{GLYPHS[safeKind]}</span>
        {title || LABELS[safeKind]}
      </div>
      <p>{children}</p>
    </div>
  );
}
