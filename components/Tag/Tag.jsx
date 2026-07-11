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
