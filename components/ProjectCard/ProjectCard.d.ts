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
}

/** Flat project card — 1px border, no shadow, mono title, serif description. */
export declare function ProjectCard(props: ProjectCardProps): React.JSX.Element;
