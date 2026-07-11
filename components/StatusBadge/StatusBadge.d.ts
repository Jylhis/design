import * as React from "react";

export interface StatusBadgeProps {
  /** Project lifecycle state. Colors come from status tokens (with glyph-free uppercase label). */
  status?: "active" | "archived" | "experimental" | "contributed";
  /** Custom label; defaults to the status name */
  children?: React.ReactNode;
}

/** Uppercase project-status badge. */
export declare function StatusBadge(props: StatusBadgeProps): React.JSX.Element;
