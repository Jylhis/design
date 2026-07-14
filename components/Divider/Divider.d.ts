import * as React from "react";

export interface DividerProps {
  /** Lowercase mono label set between two hairlines — e.g. "experience", "skills" */
  label?: React.ReactNode;
  children?: React.ReactNode;
}

/** Labeled section divider — mono caps between two hairlines (.ds-divider-label). */
export declare function Divider(props: DividerProps): React.JSX.Element;
