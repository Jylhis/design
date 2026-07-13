import * as React from "react";

export interface CalloutProps {
  /** Mono lowercase label, rendered with a leading "//" — e.g. "currently", "colophon" */
  label?: string;
  /** List items, each rendered with a copper "›" marker */
  items?: React.ReactNode[];
  /** Free-form body used when `items` is not given */
  children?: React.ReactNode;
  /** Heading level for the label — set to place it correctly in the document
   *  outline (avoid skipping levels). Defaults to 3. */
  headingLevel?: 2 | 3 | 4 | 5 | 6;
}

/** Copper left-border callout — the "// currently" pattern from the homepage. */
export declare function Callout(props: CalloutProps): React.JSX.Element;
