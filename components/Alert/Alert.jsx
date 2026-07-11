const GLYPHS = { info: "i", ok: "✓", warn: "!", err: "✗" };
const LABELS = { info: "info", ok: "success", warn: "warning", err: "error" };

export function Alert({ kind = "info", title, children }) {
  return (
    <div className={"ds-alert ds-alert--" + kind} role={kind === "err" ? "alert" : "status"}>
      <div className="ds-alert__head">
        <span className="ds-alert__glyph" aria-hidden="true">{GLYPHS[kind]}</span>
        {title || LABELS[kind]}
      </div>
      <p>{children}</p>
    </div>
  );
}
