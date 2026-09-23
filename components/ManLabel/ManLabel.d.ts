import * as React from "react";

export interface ManLabelProps {
  /** Page name — uppercased automatically, e.g. "notes" → NOTES(7) */
  title?: string;
  /** Man-page section number */
  section?: number;
}

/** Man-page style header label — NAME(section) in mono (.ds-man-label). */
export declare function ManLabel(props: ManLabelProps): React.JSX.Element;
