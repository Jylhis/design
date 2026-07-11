import * as React from "react";

export interface CalloutProps {
  /** Mono lowercase label, rendered with a leading "//" — e.g. "currently", "colophon" */
  label?: string;
  /** List items, each rendered with a copper "›" marker */
  items?: React.ReactNode[];
  /** Free-form body used when `items` is not given */
  children?: React.ReactNode;
}

/** Copper left-border callout — the "// currently" pattern from the homepage. */
export declare function Callout(props: CalloutProps): React.JSX.Element;
