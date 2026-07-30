<!-- GENERATED from components/Table/ by scripts/generate.mjs. Do not edit by hand. -->
# Table

Presentational data table. Mono cells, hairline rows, zebra + hover; no sorting/paging state — the parent owns the data.

```jsx
import { Table } from "../../components/Table/Table.jsx";
```

## Anatomy

- data table · mono cells · zebra · hover

## Props — `TableProps`

Extends `React.TableHTMLAttributes<HTMLTableElement>`.

| prop | type | required | description |
|------|------|----------|-------------|
| `columns` | `TableColumn[]` |  | column definitions, in display order |
| `rows` | `Array<Record<string, React.ReactNode> & { key?: React.Key }>` |  | row objects keyed by column.key; an optional `key` overrides the index |
| `caption` | `React.ReactNode` |  | rendered as the table's <caption> — the survey-label above the grid |
| `zebra` | `boolean` |  | zebra-stripe even rows with bg-subtle (on by default) |

## Props — `TableColumn`

| prop | type | required | description |
|------|------|----------|-------------|
| `key` | `string` | yes | row-object key this column reads, and the React key for the cell |
| `label` | `React.ReactNode` | yes | column header content |
| `align` | `"left" \| "right"` |  | right-align numeric columns; left is the default |
| `mono` | `boolean` |  | render cells in the mono/data ink (syntax-string) — hex, ids, code |

## See also

- Specimen: [`components/Table/card.html`](../../components/Table/card.html)
- Principles: [`docs/PRINCIPLES.md`](../PRINCIPLES.md) · Accessibility: [`docs/ACCESSIBILITY.md`](ACCESSIBILITY.md)
