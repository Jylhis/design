export function Table({ columns = [], rows = [], caption, zebra = true, ...rest }) {
  const cls = "ds-table" + (zebra ? " ds-table--zebra" : "");
  return (
    <table className={cls} {...rest}>
      {caption ? <caption>{caption}</caption> : null}
      <thead>
        <tr>
          {columns.map((col) => (
            <th key={col.key} scope="col" data-align={col.align || undefined}>
              {col.label}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, i) => (
          <tr key={row.key ?? i}>
            {columns.map((col) => (
              <td key={col.key} data-align={col.align || undefined} data-mono={col.mono ? "" : undefined}>
                {row[col.key]}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
