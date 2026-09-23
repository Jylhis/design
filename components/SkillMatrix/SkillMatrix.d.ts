import * as React from "react";

export interface SkillGroup {
  /** e.g. "languages" */
  label: string;
  items: string[];
}

export interface SkillMatrixProps {
  /** Either an ordered list of groups, or an object like { languages: ["go","rust"] } */
  groups: SkillGroup[] | Record<string, string[]>;
  /** Colour keys and values with the syntax palette (paired with its weight/style tokens, so it survives grayscale). Default true. */
  syntax?: boolean;
}

/** A CV's skills block — key/value rows, keys and values distinguished by weight as well as hue. */
export declare function SkillMatrix(props: SkillMatrixProps): React.JSX.Element;
