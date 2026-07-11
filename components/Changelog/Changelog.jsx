export function Changelog({ entries = [] }) {
  return (
    <div className="ds-log">
      {entries.map((entry) => (
        <div key={`${entry.date}|${entry.ref ?? ""}`} className="ds-log__entry">
          <span className="ds-log__date">{entry.date}</span>
          <span className="ds-log__gutter" aria-hidden="true">
            <span className="ds-log__node">*</span>
          </span>
          <div className="ds-log__body">
            <p className="ds-log__what">{entry.what}</p>
            {entry.ref ? <span className="ds-log__ref">{entry.ref}</span> : null}
          </div>
        </div>
      ))}
    </div>
  );
}
