import * as React from "react";

export interface TagProps {
  /** When set, renders as a link chip with hover accent */
  href?: string;
  children?: React.ReactNode;
}

/** Topic chip — lowercase mono, subtle background, 1px border. */
export declare function Tag(props: TagProps): React.JSX.Element;

export interface TagListProps {
  /** Tag labels, rendered as a wrapping row of chips */
  tags?: string[];
  /** When given, each chip links to hrefFor(tag) */
  hrefFor?: (tag: string) => string;
}

/** Wrapping row of Tag chips — the canonical tag layout (ul.ds-tag-list). */
export declare function TagList(props: TagListProps): React.JSX.Element;
