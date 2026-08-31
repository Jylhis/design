export function CvEntry({ role, company, date, location, description, highlights = [], skills }) {
  const rows = [];
  const push = (key, body) => rows.push({ key, body });

  if (role) push("role", <div className="ds-cv__body ds-cv__role">{role}</div>);
  if (company || date || location)
    push(
      "meta",
      <div className="ds-cv__body">
        {company ? <span className="ds-cv__company">{company}</span> : null}
        {date ? (
          <span className="ds-cv__date">
            {company ? " · " : ""}
            {date}
          </span>
        ) : null}
        {location ? (
          <span className="ds-cv__date">
            {company || date ? " · " : ""}
            {location}
          </span>
        ) : null}
      </div>
    );
  if (description) push("desc", <div className="ds-cv__body ds-cv__desc">{description}</div>);
  highlights.forEach((hl) => push("hl:" + hl, <div className="ds-cv__body ds-cv__hl">· {hl}</div>));
  if (skills) {
    if (rows.length) push("blank", <div className="ds-cv__body ds-cv__blank"></div>);
    Object.entries(skills).forEach(([key, values]) =>
      push(
        "skills:" + key,
        <div className="ds-cv__body ds-cv__skills">
          <span className="ds-cv__skill-key">{key}</span>
          <span className="ds-cv__skill-bracket">: [</span>
          {values.map((v, i) => (
            <span key={v}>
              <span className="ds-cv__skill-value">{v}</span>
              {i < values.length - 1 ? <span className="ds-cv__skill-sep">, </span> : null}
            </span>
          ))}
          <span className="ds-cv__skill-bracket">]</span>
        </div>
      )
    );
  }

  return (
    <div className="ds-cv">
      {rows.map((row) => (
        <div key={row.key} className="ds-cv__row">
          <span className="ds-cv__num"></span>
          {row.body}
        </div>
      ))}
    </div>
  );
}
