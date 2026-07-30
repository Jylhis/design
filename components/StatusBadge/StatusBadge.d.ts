import * as React from "react";

export interface StatusBadgeProps {
  /** Project lifecycle state. Colors come from status tokens; each state renders an aria-hidden glyph (✓ ▪ △ ⑂) before the uppercase label. */
  status?: "active" | "archived" | "experimental" | "contributed";
  /** Custom label; defaults to the status name */
  children?: React.ReactNode;
}

/** Uppercase project-status badge — status glyph + word, per the Alert glyph convention. */
export declare function StatusBadge(props: StatusBadgeProps): React.JSX.Element;
