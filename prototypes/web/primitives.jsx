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

// `level` (2–6) opts the label into the heading outline (renders h2–h6);
// omit it to keep the non-semantic default so it stays out of the outline.
const DividerLabeled = ({ label, level }) => {
  const Tag = level ? `h${level}` : "div";
  return <Tag className="ds-divider-label">{label}</Tag>;
};

const ManHeader = ({ title, section = 7, level }) => {
  const Tag = level ? `h${level}` : "div";
  return (
    <Tag className="man-header">
      <span className="ds-man-label">{`${title.toUpperCase()}(${section})`}</span>
    </Tag>
  );
};

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
  const push = (key, body) => rows.push({ key, body });

  if (role) push("role", <div className="ds-cv__body ds-cv__role">{role}</div>);
  if (company || date || location)
    push(
      "meta",
      <div className="ds-cv__body">
        {company ? <span className="ds-cv__company">{company}</span> : null}
        {date ? <span className="ds-cv__date"> · {date}</span> : null}
        {location ? <span className="ds-cv__date"> · {location}</span> : null}
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
      {rows.map((row) => (
        <div key={row.key} className="ds-cv__row">
          <span className="ds-cv__num"></span>
          {row.body}
        </div>
      ))}
    </div>
  );
};

Object.assign(window, { Tag, TagList, StatusBadge, DividerLabeled, ManHeader, FormattedDate, CodeBlock, CvEntry });
