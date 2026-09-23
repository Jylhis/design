export function Modal({ open, onClose, title, actions, children, ...rest }) {
  const ref = React.useRef(null);
  const titleId = React.useId();

  // Sync the `open` prop to the native <dialog>. showModal() gives us the
  // focus trap, ESC handling, and inert backdrop for free — no library.
  React.useEffect(() => {
    const dlg = ref.current;
    if (!dlg) return;
    if (open && !dlg.open) dlg.showModal();
    else if (!open && dlg.open) dlg.close();
  }, [open]);

  // The native 'close' event fires for ESC, the close button, and backdrop
  // dismissal. Only notify the parent when it still thinks we're open, so the
  // effect-driven close() above doesn't loop back.
  const handleClose = () => {
    if (open && onClose) onClose();
  };

  return (
    <dialog ref={ref} className="ds-modal" aria-labelledby={titleId} onClose={handleClose} {...rest}>
      <div className="ds-modal__head">
        <h2 className="ds-modal__title" id={titleId}>{title}</h2>
        <button type="button" className="ds-modal__close" aria-label="dismiss" onClick={() => ref.current && ref.current.close()}>×</button>
      </div>
      <div className="ds-modal__body">{children}</div>
      {actions ? <div className="ds-modal__actions">{actions}</div> : null}
    </dialog>
  );
}
