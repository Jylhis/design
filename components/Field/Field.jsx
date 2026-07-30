export function Field({ label, help, error, id, type = "text", textarea = false, children, ...rest }) {
  // useId keeps label/input pairing unique when several unlabelled fields
  // share a page; `children` is dropped so it never reaches the void <input>.
  const reactId = React.useId();
  const inputId = id || reactId;
  const helpText = error || help;
  // aria-describedby links the help/error text to the input so screen
  // readers announce it — aria-invalid alone only says "invalid".
  const helpId = `${inputId}-help`;
  const InputTag = textarea ? "textarea" : "input";
  return (
    <div className="ds-field">
      <label className="ds-field__label" htmlFor={inputId}>{label}</label>
      <InputTag
        className="ds-field__input"
        id={inputId}
        type={textarea ? undefined : type}
        aria-invalid={error ? "true" : undefined}
        aria-describedby={helpText ? helpId : undefined}
        {...rest}
      ></InputTag>
      {helpText ? (
        <span id={helpId} className={"ds-field__help" + (error ? " ds-field__help--error" : "")}>{helpText}</span>
      ) : null}
    </div>
  );
}
