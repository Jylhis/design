import * as React from "react";

export interface ToastProps {
  /** Each kind pairs a glyph and a word with its colour */
  kind?: "info" | "ok" | "warn" | "err";
  children?: React.ReactNode;
  /** Adds a dismiss control; omit for auto-expiring toasts */
  onDismiss?: () => void;
}

export interface ToastStackProps {
  children?: React.ReactNode;
  position?: "bottom" | "top";
}

/** Transient report. It never asks a question — that is a Modal. Floats, so it carries --shadow-float. */
export declare function Toast(props: ToastProps): React.JSX.Element;
/** Fixed container stacking toasts at one screen edge. */
export declare function ToastStack(props: ToastStackProps): React.JSX.Element;
