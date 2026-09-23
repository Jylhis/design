export function Segmented({ options = [], value, onChange, label }) {
  // Roving selection with a real radiogroup so arrow keys and screen readers
  // behave; the marker is a bottom rule, not a fill, so it survives grayscale.
  return (
    <div className="ds-segmented" role="radiogroup" aria-label={label}>
      {options.map((opt) => {
        const val = typeof opt === "string" ? opt : opt.value;
        const text = typeof opt === "string" ? opt : opt.label;
        const selected = val === value;
        return (
          <button
            type="button"
            key={val}
            role="radio"
            aria-checked={selected}
            tabIndex={selected ? 0 : -1}
            className={"ds-segmented__option" + (selected ? " is-selected" : "")}
            onClick={() => onChange && onChange(val)}
          >
            {text}
          </button>
        );
      })}
    </div>
  );
}
