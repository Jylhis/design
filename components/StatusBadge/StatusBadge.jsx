const GLYPHS = { active: "✓", archived: "▪", experimental: "△", contributed: "⑂" };

export function StatusBadge({ status = "active", children }) {
  // Alert's glyph convention: glyph is aria-hidden; the visible word always carries the meaning.
  const glyph = GLYPHS[status] ?? GLYPHS.active;
  return (
    <span className={"ds-status ds-status--" + status}>
      <span className="ds-status__glyph" aria-hidden="true">{glyph}</span>
      {children || status}
    </span>
  );
}
