import * as React from "react";

export interface DividerProps {
  /** Lowercase mono label set between two hairlines — e.g. "experience", "skills" */
  label?: React.ReactNode;
  children?: React.ReactNode;
  /** Render the label as a heading (h2–h6) so it joins the document outline;
   *  omit for the non-semantic role="separator" default. */
  headingLevel?: 2 | 3 | 4 | 5 | 6;
}

/** Labeled section divider — mono caps between two hairlines (.ds-divider-label). */
export declare function Divider(props: DividerProps): React.JSX.Element;
