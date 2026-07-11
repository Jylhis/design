import * as React from "react";

export interface TagProps {
  /** When set, renders as a link chip with hover accent */
  href?: string;
  children?: React.ReactNode;
}

/** Topic chip — lowercase mono, subtle background, 1px border. */
export declare function Tag(props: TagProps): React.JSX.Element;
