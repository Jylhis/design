import * as React from "react";

export interface EmptyProps {
  /** The comment text, without the leading // */
  children?: React.ReactNode;
  /** Optional single control */
  action?: React.ReactNode;
}

/** Empty state as a source comment. Never an illustration, never "check back soon". */
export declare function Empty(props: EmptyProps): React.JSX.Element;
