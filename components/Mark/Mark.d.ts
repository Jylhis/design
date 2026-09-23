import * as React from "react";

export interface MarkProps {
  /** Append the blinking caret — max once per surface */
  live?: boolean;
  /** Mark text; defaults to "jy" */
  children?: React.ReactNode;
}

/** Personal brand mark — "jy ❯", pure type, chevron always bronze. */
export declare function Mark(props: MarkProps): React.JSX.Element;
