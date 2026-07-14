import * as React from "react";

export interface FieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  /** Lowercase mono label above the input */
  label: string;
  /** Muted helper line under the input — linked to the input via aria-describedby */
  help?: string;
  /** Error message — replaces help, colors it status-err, sets aria-invalid, and is linked via aria-describedby */
  error?: string;
  /** Render a textarea instead of an input */
  textarea?: boolean;
}

/** Labeled form field — mono label, 1px border input, copper focus ring. */
export declare function Field(props: FieldProps): React.JSX.Element;
