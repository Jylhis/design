import * as React from "react";

export interface CvEntryProps {
  role: string;
  company?: string;
  /** Makes the company name a link */
  companyHref?: string;
  /** "2025" or "2025-05" — drives both the displayed range and the duration */
  start?: string;
  /** "2025-05", or "present" for an ongoing role */
  end?: string | "present";
  /** Pre-formatted range, e.g. "May 2025 — present". Overrides start/end and suppresses the duration. */
  date?: string;
  /** e.g. "Zürich" */
  location?: string;
  /** Show the computed duration ("2y 4m") next to the range. Default true. */
  showDuration?: boolean;
  /** One-line serif summary */
  description?: string;
  /** Achievements, rendered as a real list */
  highlights?: React.ReactNode[];
  /** Heading level for the role, so entries nest correctly in a page outline. Default 3. */
  headingLevel?: 1 | 2 | 3 | 4 | 5 | 6;
}

/** One role on a CV — semantic article + heading + list, with the date range right-aligned. */
export declare function CvEntry(props: CvEntryProps): React.JSX.Element;
