import * as React from "react";

export interface PaginationProps extends Omit<React.HTMLAttributes<HTMLElement>, "aria-label"> {
  /** current page, 1-based */
  page: number;
  /** total number of pages */
  pageCount: number;
  /** builds the href for a page number; defaults to `#page-<n>` */
  hrefFor?: (page: number) => string;
  /** how many page numbers to show either side of the current one (default 1) */
  siblings?: number;
  /** accessible name for the nav landmark (default "pagination") */
  "aria-label"?: string;
}

/** Numbered pager. Presentational — the parent owns the current page; ellipsis gaps and the current marker are aria-correct, arrows carry labels. */
export declare function Pagination(props: PaginationProps): React.JSX.Element;
