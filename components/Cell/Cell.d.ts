import * as React from "react";

export interface CellProps {
  /** The record's name — set in mono, in a fixed column */
  label: React.ReactNode;
  /** Optional second line under the label */
  note?: React.ReactNode;
  /** The record's value */
  value?: React.ReactNode;
  /** Renders as a link */
  href?: string;
  /** Renders as a button */
  onClick?: React.MouseEventHandler;
  /** Affordance glyph on an interactive row; accent-coloured */
  affordance?: string;
  /** Set the value in IBM Plex Mono */
  mono?: boolean;
  /** Set the value in the condensed numeric face, tabular */
  numeric?: boolean;
}

/**
 * One record per row: label, value, affordance. Use Cell for a list of records
 * and Table for multi-column tabular data — the split is the column count, not
 * the viewport. Rows are --cell-h tall and follow the density scope.
 */
export declare function Cell(props: CellProps): React.JSX.Element;
