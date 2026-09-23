import * as React from "react";

export interface KbdProps {
  /** Multiple keys render as a chord: ["⌘","K"] or ["g","t"] */
  keys?: string[];
  /** Accent variant — for the canonical shortcut on the page only */
  accent?: boolean;
  /** Single key label when `keys` is not given */
  children?: React.ReactNode;
}

/** Keyboard chip — 1px border, 2px bottom edge for the typewriter feel. */
export declare function Kbd(props: KbdProps): React.JSX.Element;
