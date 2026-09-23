import * as React from "react";

export interface ResultProps {
  kind?: "ok" | "err" | "warn" | "info";
  /** errno-style code, e.g. E404 */
  code?: string;
  title?: React.ReactNode;
  children?: React.ReactNode;
  action?: React.ReactNode;
}

/** Whole-page outcome: code, fact, pointer. Larger than an Alert and terminal to a flow. */
export declare function Result(props: ResultProps): React.JSX.Element;
