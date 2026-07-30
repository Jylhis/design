import * as React from "react";

/**
 * Intersection (not interface-extends) so textarea-specific attributes such as
 * `rows`/`cols` type-check when `textarea` is set — extending both attribute
 * interfaces directly is rejected by TypeScript for non-identical members.
 */
export type FieldProps = React.InputHTMLAttributes<HTMLInputElement> &
  React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
    /** Lowercase mono label above the input */
    label: string;
    /** Muted helper line under the input — linked to the input via aria-describedby */
    help?: string;
    /** Error message — replaces help, colors it status-err, sets aria-invalid, and is linked via aria-describedby */
    error?: string;
    /** Render a textarea instead of an input */
    textarea?: boolean;
  };

/** Labeled form field — mono label, 1px border input, bronze focus ring. */
export declare function Field(props: FieldProps): React.JSX.Element;
