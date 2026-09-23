import * as React from "react";

export interface ModalProps extends Omit<React.DialogHTMLAttributes<HTMLDialogElement>, "title"> {
  /** controlled visibility — true calls the native dialog.showModal() */
  open: boolean;
  /** fires on ESC, the close button, or backdrop dismissal (parent sets open=false) */
  onClose?: () => void;
  /** dialog title; wired as the accessible name via aria-labelledby */
  title: React.ReactNode;
  /** footer actions (buttons), right-aligned; omit for a message-only dialog */
  actions?: React.ReactNode;
  children?: React.ReactNode;
}

/** Modal dialog on the native <dialog> element — focus trap, ESC, and inert backdrop come from the platform, not a dependency. Flat: raised surface + hairline, scrim backdrop, no shadow. */
export declare function Modal(props: ModalProps): React.JSX.Element;
