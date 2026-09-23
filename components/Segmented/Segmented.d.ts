import * as React from "react";

export interface SegmentedOption { value: string; label: React.ReactNode }

export interface SegmentedProps {
  /** Plain strings, or {value,label} pairs */
  options?: (string | SegmentedOption)[];
  value?: string;
  onChange?: (value: string) => void;
  /** Accessible name for the radiogroup */
  label?: string;
}

/** Two to four mutually exclusive choices in one row. Selection is a rule plus weight, never a fill alone. */
export declare function Segmented(props: SegmentedProps): React.JSX.Element;
