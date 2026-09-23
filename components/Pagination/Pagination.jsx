function pageWindow(page, pageCount, siblings) {
  const items = [];
  for (let n = 1; n <= pageCount; n++) {
    const near = n >= page - siblings && n <= page + siblings;
    if (n === 1 || n === pageCount || near) items.push(n);
    else if (items[items.length - 1] !== "gap") items.push("gap");
  }
  return items;
}

export function Pagination({
  page,
  pageCount,
  hrefFor = (n) => `#page-${n}`,
  siblings = 1,
  "aria-label": ariaLabel = "pagination",
  ...rest
}) {
  const prev = page > 1;
  const next = page < pageCount;
  return (
    <nav className="ds-pager" aria-label={ariaLabel} {...rest}>
      {prev ? (
        <a href={hrefFor(page - 1)} className="ds-pager__arrow" aria-label="previous page">◂</a>
      ) : (
        <span className="ds-pager__arrow ds-pager__gap" aria-hidden="true">◂</span>
      )}
      {pageWindow(page, pageCount, siblings).map((item, i) =>
        item === "gap" ? (
          <span key={`gap-${i}`} className="ds-pager__gap" aria-hidden="true">…</span>
        ) : item === page ? (
          <span key={item} aria-current="page">{item}</span>
        ) : (
          <a key={item} href={hrefFor(item)} aria-label={`page ${item}`}>{item}</a>
        ),
      )}
      {next ? (
        <a href={hrefFor(page + 1)} className="ds-pager__arrow" aria-label="next page">▸</a>
      ) : (
        <span className="ds-pager__arrow ds-pager__gap" aria-hidden="true">▸</span>
      )}
    </nav>
  );
}
