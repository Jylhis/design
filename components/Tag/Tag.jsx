export function Tag({ href, children, ...rest }) {
  if (href) {
    return (
      <a className="ds-tag" href={href} {...rest}>
        {children}
      </a>
    );
  }
  return (
    <span className="ds-tag" {...rest}>
      {children}
    </span>
  );
}

export function TagList({ tags = [], hrefFor }) {
  if (!tags.length) return null;
  return (
    <ul className="ds-tag-list">
      {tags.map((t) => (
        <li key={t}>
          <Tag href={hrefFor ? hrefFor(t) : undefined}>{t}</Tag>
        </li>
      ))}
    </ul>
  );
}
