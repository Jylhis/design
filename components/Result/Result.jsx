const RESULT_GLYPHS = { ok: "\u2713", err: "\u2717", warn: "!", info: "i" };
const RESULT_WORDS = { ok: "success", err: "error", warn: "warning", info: "note" };

export function Result({ kind = "ok", code, title, children, action }) {
  const safe = RESULT_GLYPHS[kind] ? kind : "ok";
  return (
    <div className={"ds-result ds-result--" + safe}>
      <p className="ds-result__label">
        <span className="ds-result__glyph" aria-hidden="true">{RESULT_GLYPHS[safe]}</span>
        {code ? <span className="ds-result__code">{code}</span> : null}
        <span>{RESULT_WORDS[safe]}</span>
      </p>
      <h2 className="ds-result__title">{title}</h2>
      {children ? <p className="ds-result__body">{children}</p> : null}
      {action ? <div className="ds-result__action">{action}</div> : null}
    </div>
  );
}
