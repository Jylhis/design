export function CodeBlock({ filename, children }) {
  return (
    <div className={"ds-codeblock" + (filename ? "" : " ds-codeblock--plain")}>
      {filename ? <div className="ds-codeblock__filename">{filename}</div> : null}
      <pre>{children}</pre>
    </div>
  );
}
