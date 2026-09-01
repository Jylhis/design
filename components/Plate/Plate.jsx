export function Plate({ corner, cornerRight, scale, children }) {
  return (
    <div className="ds-plate">
      {corner ? <span className="ds-plate__corner ds-plate__corner--tl">{corner}</span> : null}
      {cornerRight ? <span className="ds-plate__corner ds-plate__corner--tr">{cornerRight}</span> : null}
      <div className="ds-plate__body">{children}</div>
      {scale ? (
        <div className="ds-plate__scale">
          <div className="ds-plate__bar" aria-hidden="true"><span></span><span></span><span></span><span></span></div>
          <div className="ds-plate__scale-label">{scale}</div>
        </div>
      ) : null}
    </div>
  );
}
