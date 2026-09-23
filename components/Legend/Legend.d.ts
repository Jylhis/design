import * as React from "react";

export interface LegendItem {
  /** Role name, e.g. "contour blue" */
  name: string;
  /** CSS color for the swatch or glyph */
  color: string;
  /** Reading printed under the name; defaults to the color */
  value?: string;
  /** Unicode glyph shown instead of a swatch (status rows) */
  glyph?: string;
}

export interface LegendProps {
  title?: React.ReactNode;
  items?: LegendItem[];
  /** Grid columns, default 3 */
  columns?: number;
}

/** The map key — palette roles as swatch + name + reading, ruled like survey linework. */
export declare function Legend(props: LegendProps): React.JSX.Element;
