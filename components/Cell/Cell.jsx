export function Cell({ label, note, value, href, onClick, affordance = "\u203a", mono = false, numeric = false }) {
  // The affordance glyph is accent-coloured so a tappable row reads as operable
  // in grayscale as well as in colour; a static row omits it entirely.
  const interactive = Boolean(href || onClick);
  const Tag = href ? "a" : onClick ? "button" : "div";
  const valueClass =
    "ds-cell__value" + (numeric ? " ds-cell__value--numeric" : mono ? " ds-cell__value--mono" : "");
  return (
    <Tag
      className={"ds-cell" + (interactive ? " ds-cell--interactive" : "")}
      href={href}
      onClick={onClick}
      type={Tag === "button" ? "button" : undefined}
    >
      <span className="ds-cell__key">
        {label}
        {note ? <span className="ds-cell__note">{note}</span> : null}
      </span>
      {value != null ? <span className={valueClass}>{value}</span> : null}
      {interactive ? <span className="ds-cell__affordance" aria-hidden="true">{affordance}</span> : null}
    </Tag>
  );
}
