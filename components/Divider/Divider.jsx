export function Divider({ label, children, headingLevel }) {
  const Tag = headingLevel ? `h${headingLevel}` : "div";
  return (
    <Tag
      className="ds-divider-label"
      role={headingLevel ? undefined : "separator"}
      aria-label={!headingLevel && typeof label === "string" ? label : undefined}
    >
      {label || children}
    </Tag>
  );
}
