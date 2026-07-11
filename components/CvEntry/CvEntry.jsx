export function CvEntry({ role, company, date, location, description, highlights = [], skills }) {
  const rows = [];
  const push = (body) => rows.push(body);

  if (role) push(<div className="ds-cv__body ds-cv__role">{role}</div>);
  if (company || date || location)
    push(
      <div className="ds-cv__body">
        {company ? <span className="ds-cv__company">{company}</span> : null}
        {date ? <span className="ds-cv__date"> · {date}</span> : null}
        {location ? <span className="ds-cv__date"> · {location}</span> : null}
      </div>
    );
  if (description) push(<div className="ds-cv__body ds-cv__desc">{description}</div>);
  highlights.forEach((hl) => push(<div className="ds-cv__body ds-cv__hl">· {hl}</div>));
  if (skills) {
    if (rows.length) push(<div className="ds-cv__body ds-cv__blank"></div>);
    Object.entries(skills).forEach(([key, values]) =>
      push(
        <div className="ds-cv__body ds-cv__skills">
          <span className="k">{key}</span>
          <span className="b">: [</span>
          {values.map((v, i) => (
            <span key={v}>
              <span className="v">{v}</span>
              {i < values.length - 1 ? <span className="c">, </span> : null}
            </span>
          ))}
          <span className="b">]</span>
        </div>
      )
    );
  }

  return (
    <div className="ds-cv">
      {rows.map((body, i) => (
        <div key={i} className="ds-cv__row">
          <span className="ds-cv__num"></span>
          {body}
        </div>
      ))}
    </div>
  );
}
