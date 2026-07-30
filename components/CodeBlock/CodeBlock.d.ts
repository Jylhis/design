import * as React from "react";

export interface CodeBlockProps {
  /** File tab above the block, e.g. "config/devenv.nix" */
  filename?: string;
  /** Code content — plain text, or spans colored with the --color-syntax-* tokens (Modus palette) */
  children?: React.ReactNode;
}

/** Fenced code block with optional filename tab. Syntax colors come from Modus tokens, never the bronze accent. */
export declare function CodeBlock(props: CodeBlockProps): React.JSX.Element;
