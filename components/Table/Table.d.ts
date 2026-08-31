import * as React from "react";

export interface TableColumn {
  /** row-object key this column reads, and the React key for the cell */
  key: string;
  /** column header content */
  label: React.ReactNode;
  /** right-align numeric columns; left is the default */
  align?: "left" | "right";
  /** render cells in the mono/data ink (syntax-string) — hex, ids, code */
  mono?: boolean;
}

export interface TableProps extends React.TableHTMLAttributes<HTMLTableElement> {
  /** column definitions, in display order */
  columns?: TableColumn[];
  /** row objects keyed by column.key; an optional `key` overrides the index */
  rows?: Array<Record<string, React.ReactNode> & { key?: React.Key }>;
  /** rendered as the table's <caption> — the survey-label above the grid */
  caption?: React.ReactNode;
  /** zebra-stripe even rows with bg-subtle (on by default) */
  zebra?: boolean;
}

/** Presentational data table. Mono cells, hairline rows, zebra + hover; no sorting/paging state — the parent owns the data. */
export declare function Table(props: TableProps): React.JSX.Element;
