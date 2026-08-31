import * as React from "react";

export interface ProjectCardProps {
  title: string;
  description?: string;
  /** Topic chips, lowercase: ["nix", "flakes"] */
  tags?: string[];
  /** Optional lifecycle badge in the top-right */
  status?: "active" | "archived" | "experimental" | "contributed";
  /** Subtle variant — bg-subtle fill for secondary items */
  subtle?: boolean;
  /** Makes the title a link */
  href?: string;
  /** Heading level for the card title — set to keep the document outline
   *  contiguous (avoid skipping levels). Defaults to 3. */
  headingLevel?: 2 | 3 | 4 | 5 | 6;
}

/** Flat project card — 1px border, no shadow, mono title, serif description. */
export declare function ProjectCard(props: ProjectCardProps): React.JSX.Element;
