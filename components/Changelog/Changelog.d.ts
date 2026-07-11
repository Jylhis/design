import * as React from "react";

export interface ChangelogEntry {
  /** ISO-ish date shown in the left gutter, e.g. "2026-07-08" */
  date: string;
  /** What changed — a sentence, may contain links */
  what: React.ReactNode;
  /** Mono footnote, e.g. "writing · 2,400 words" */
  ref?: string;
}

export interface ChangelogProps {
  entries: ChangelogEntry[];
}

/** Commit-log changelog — copper nodes on a 1px trunk, dates in the gutter.
 *  The content's real structure (a history) becomes the visual structure. */
export declare function Changelog(props: ChangelogProps): React.JSX.Element;
