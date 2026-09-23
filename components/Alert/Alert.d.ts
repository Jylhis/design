import * as React from "react";

export interface AlertProps {
  /** Status kind — each pairs a color with a glyph, so color is never the only signal */
  kind?: "info" | "ok" | "warn" | "err";
  /** Head label; defaults to info/success/warning/error */
  title?: string;
  children?: React.ReactNode;
}

/** Status alert — 3px left border, mono uppercase head with glyph, serif body. */
export declare function Alert(props: AlertProps): React.JSX.Element;
