import * as React from "react";

export interface TerminalProps {
  /** Title bar text, e.g. "user@host — zsh". Omit for a bare frame. */
  title?: string;
  /** Show a blinking copper caret on a trailing empty prompt line */
  caret?: boolean;
  /** TerminalLine elements, or any pre-styled mono content */
  children?: React.ReactNode;
}

/** Terminal session frame — the codeblock idiom with a title bar and prompt lines. The prompt chevron is always brand copper (ANSI 11 rule); output colors come from Modus/status tokens, never the accent. */
export declare function Terminal(props: TerminalProps): React.JSX.Element;

export interface TerminalLineProps {
  /** The command as typed after the ❯ prompt */
  cmd?: string;
  /** Optional prompt context before the chevron, e.g. "~/code/jylhis" */
  cwd?: string;
  /** Output block below the command — plain text or spans colored with --color-syntax-* / --color-status-* tokens */
  children?: React.ReactNode;
}

/** One prompt line inside a Terminal: copper ❯ + command, with optional output block. */
export declare function TerminalLine(props: TerminalLineProps): React.JSX.Element;
