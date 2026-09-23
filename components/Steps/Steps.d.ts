import * as React from "react";

export interface Step { title: React.ReactNode; note?: React.ReactNode }

export interface StepsProps {
  /** Plain strings, or {title,note} objects */
  steps?: (string | Step)[];
  /** Zero-based index of the current step */
  current?: number;
  orientation?: "vertical" | "horizontal";
}

/** Ordered progress. State carries a glyph and a word, so it reads without colour. */
export declare function Steps(props: StepsProps): React.JSX.Element;
