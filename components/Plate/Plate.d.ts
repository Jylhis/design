import * as React from "react";

export interface PlateProps {
  /** Top-left coordinate/label corner, mono caps */
  corner?: React.ReactNode;
  /** Top-right readout corner */
  cornerRight?: React.ReactNode;
  /** Scale-bar caption; omit to hide the scale bar */
  scale?: React.ReactNode;
  children?: React.ReactNode;
}

/** The signature container — surface-raised inside an inset map margin, with coordinate corners and an optional scale bar. */
export declare function Plate(props: PlateProps): React.JSX.Element;
