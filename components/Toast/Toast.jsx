const TOAST_GLYPHS = { info: "i", ok: "\u2713", warn: "!", err: "\u2717" };
const TOAST_WORDS = { info: "note", ok: "done", warn: "warning", err: "failed" };

export function Toast({ kind = "info", children, onDismiss }) {
  // A toast reports; it never asks. Anything needing a decision is a Modal.
  const safe = TOAST_GLYPHS[kind] ? kind : "info";
  const live = safe === "err" ? { role: "alert" } : { role: "status", "aria-live": "polite" };
  return (
    <div className={"ds-toast ds-toast--" + safe} {...live}>
      <span className="ds-toast__glyph" aria-hidden="true">{TOAST_GLYPHS[safe]}</span>
      <span className="ds-toast__word">{TOAST_WORDS[safe]}</span>
      <span className="ds-toast__body">{children}</span>
      {onDismiss ? (
        <button type="button" className="ds-toast__dismiss" onClick={onDismiss} aria-label="dismiss">
          \u2715
        </button>
      ) : null}
    </div>
  );
}

export function ToastStack({ children, position = "bottom" }) {
  return <div className={"ds-toast-stack ds-toast-stack--" + position}>{children}</div>;
}
