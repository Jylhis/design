import * as React from "react";

export interface CellGroupProps {
  /** Mono uppercase section label sitting above the rail */
  label?: React.ReactNode;
  /** Cell rows */
  children?: React.ReactNode;
}

/** A titled run of Cell rows on the graticule rail. */
export declare function CellGroup(props: CellGroupProps): React.JSX.Element;
