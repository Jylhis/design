<!-- GENERATED from components/Pagination/ by scripts/generate.mjs. Do not edit by hand. -->
# Pagination

Numbered pager. Presentational — the parent owns the current page; ellipsis gaps and the current marker are aria-correct, arrows carry labels.

```jsx
import { Pagination } from "../../components/Pagination/Pagination.jsx";
```

## Anatomy

- current = 4 · gaps · aria-current
- first page · prev disabled

## Props — `PaginationProps`

Extends `Omit<React.HTMLAttributes<HTMLElement>, "aria-label">`.

| prop | type | required | description |
|------|------|----------|-------------|
| `page` | `number` | yes | current page, 1-based |
| `pageCount` | `number` | yes | total number of pages |
| `hrefFor` | `(page: number) => string` |  | builds the href for a page number; defaults to `#page-<n>` |
| `siblings` | `number` |  | how many page numbers to show either side of the current one (default 1) |
| `aria-label` | `string` |  | accessible name for the nav landmark (default "pagination") |

## See also

- Specimen: [`components/Pagination/card.html`](../../components/Pagination/card.html)
- Principles: [`docs/PRINCIPLES.md`](../PRINCIPLES.md) · Accessibility: [`docs/ACCESSIBILITY.md`](ACCESSIBILITY.md)
