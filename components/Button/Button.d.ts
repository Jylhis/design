import * as React from "react";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** primary = copper fill; ghost = 1px border; link = bare accent text; search = search-trigger with kbd hint */
  variant?: "primary" | "ghost" | "link" | "search";
  /** Shortcut hint shown inside the search variant, e.g. "/" */
  kbdHint?: string;
  /** Sets aria-busy + disabled and appends a mono ellipsis — the system's spinner-free loading state */
  loading?: boolean;
  children?: React.ReactNode;
}

/** Monospace button. Ghost is the default — copper fill is reserved for the one primary action on a page. */
export declare function Button(props: ButtonProps): React.JSX.Element;
