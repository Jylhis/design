export function Field({ label, help, error, id, type = "text", textarea = false, ...rest }) {
  const inputId = id || "ds-field-" + String(label || "").toLowerCase().replace(/[^a-z0-9]+/g, "-");
  const helpText = error || help;
  const InputTag = textarea ? "textarea" : "input";
  return (
    <div className="ds-field">
      <label className="ds-field__label" htmlFor={inputId}>{label}</label>
      <InputTag
        className="ds-field__input"
        id={inputId}
        type={textarea ? undefined : type}
        aria-invalid={error ? "true" : undefined}
        {...rest}
      ></InputTag>
      {helpText ? (
        <span className={"ds-field__help" + (error ? " ds-field__help--error" : "")}>{helpText}</span>
      ) : null}
    </div>
  );
}
