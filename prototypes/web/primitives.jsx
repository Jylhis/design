// primitives.jsx — thin bridges to Jylhis design-system components.
// Markup mirrors components/<Name>/<Name>.jsx exactly (same ds-* class
// contract, styled by components/components.css). Keep in sync with the
// component sources; do not restyle here.

const Tag = ({ href, children }) => href
  ? <a className="ds-tag" href={href}>{children}</a>
  : <span className="ds-tag">{children}</span>;

const TagList = ({ tags = [] }) => tags.length ? (
  <ul className="tag-list">{tags.map(t => <li key={t}><Tag>{t}</Tag></li>)}</ul>
) : null;

// Mirrors components/StatusBadge/StatusBadge.jsx
const StatusBadge = ({ status = 'active', children }) => (
  <span className={`ds-status ds-status--${status}`}>{children || status}</span>
);

const DividerLabeled = ({ label }) => (
  <div className="ds-divider-label">{label}</div>
);

const ManHeader = ({ title, section = 7 }) => (
  <div className="man-header">
    <span className="ds-man-label">{`${title.toUpperCase()}(${section})`}</span>
  </div>
);

const FormattedDate = ({ date }) => {
  const d = new Date(date);
  const fmt = d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  return <time dateTime={d.toISOString()}>{fmt}</time>;
};

// Mirrors components/CodeBlock/CodeBlock.jsx
const CodeBlock = ({ filename, children }) => (
  <div className={'ds-codeblock' + (filename ? '' : ' ds-codeblock--plain')}>
    {filename ? <div className="ds-codeblock__filename">{filename}</div> : null}
    <pre>{children}</pre>
  </div>
);

// Mirrors components/CvEntry/CvEntry.jsx
const CvEntry = ({ role, company, date, location, description, highlights = [], skills }) => {
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
};

Object.assign(window, { Tag, TagList, StatusBadge, DividerLabeled, ManHeader, FormattedDate, CodeBlock, CvEntry });
