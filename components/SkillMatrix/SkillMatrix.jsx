export function SkillMatrix({ groups, syntax = true }) {
  const rows = Array.isArray(groups)
    ? groups
    : Object.entries(groups || {}).map(([label, items]) => ({ label, items }));

  return (
    <dl className={"ds-skills" + (syntax ? " ds-skills--syntax" : "")}>
      {rows.map(({ label, items }) => (
        <div key={label} className="ds-skills__row">
          <dt className="ds-skills__key">{label}</dt>
          <dd className="ds-skills__values">
            {items.map((v, i) => (
              <span key={v}>
                <span className="ds-skills__value">{v}</span>
                {i < items.length - 1 ? <span className="ds-skills__sep">, </span> : null}
              </span>
            ))}
          </dd>
        </div>
      ))}
    </dl>
  );
}
