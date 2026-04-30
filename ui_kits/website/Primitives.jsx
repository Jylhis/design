// Primitives.jsx — tags, status badges, dividers, code block
const TagList = ({ tags = [] }) => tags.length ? (
  <ul className="tag-list">{tags.map(t => <li key={t}><span className="tag">{t}</span></li>)}</ul>
) : null;

const StatusBadge = ({ status }) => (
  <span className={`project-status project-status--${status}`}>{status}</span>
);

const DividerLabeled = ({ label }) => (
  <div className="divider-labeled">{label}</div>
);

const ManHeader = ({ title, section = 7 }) => (
  <div className="man-header">
    <span className="man-label">{`${title.toUpperCase()}(${section})`}</span>
  </div>
);

const FormattedDate = ({ date }) => {
  const d = new Date(date);
  const fmt = d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  return <time dateTime={d.toISOString()}>{fmt}</time>;
};

const CodeBlock = ({ filename, children }) => (
  <div className="code-block-wrap">
    {filename && <div className="code-filename">{filename}</div>}
    <pre><code>{children}</code></pre>
  </div>
);

Object.assign(window, { TagList, StatusBadge, DividerLabeled, ManHeader, FormattedDate, CodeBlock });
