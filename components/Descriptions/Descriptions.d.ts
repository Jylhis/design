import * as React from "react";

export interface DescriptionItem {
  term: React.ReactNode;
  value: React.ReactNode;
  /** Set the value in the condensed numeric face, tabular */
  numeric?: boolean;
  /** Column span within the grid */
  span?: number;
}

export interface DescriptionsProps {
  title?: React.ReactNode;
  items?: DescriptionItem[];
  /** Grid columns; collapses to one below the sm breakpoint */
  columns?: number;
}

/** Read-only key/value detail block — the annotated face of a record. */
export declare function Descriptions(props: DescriptionsProps): React.JSX.Element;
