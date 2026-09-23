import * as React from "react";

export interface EntryGridItem {
  /** A Unicode glyph — the system has no icon font */
  glyph: string;
  label: React.ReactNode;
  href?: string;
  /** Small count in the corner */
  badge?: React.ReactNode;
}

export interface EntryGridProps {
  items?: EntryGridItem[];
  columns?: number;
}

/** Glyph-and-label launcher grid. Targets hold the density scope's touch floor. */
export declare function EntryGrid(props: EntryGridProps): React.JSX.Element;
