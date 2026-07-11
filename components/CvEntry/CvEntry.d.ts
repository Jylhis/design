import * as React from "react";

export interface CvEntryProps {
  role: string;
  company: string;
  /** e.g. "May 2025 — present" */
  date?: string;
  /** e.g. "Zürich" */
  location?: string;
  /** One-line serif summary */
  description?: string;
  /** Bullet highlights, each prefixed "·" */
  highlights?: string[];
  /** Rendered as syntax-colored key: [values] lines, e.g. { languages: ["go","rust"] } */
  skills?: Record<string, string[]>;
}

/** Code-editor CV entry — line numbers in the gutter, role/company/skills as source lines. */
export declare function CvEntry(props: CvEntryProps): React.JSX.Element;
