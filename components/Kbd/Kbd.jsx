export function Kbd({ keys, accent = false, children }) {
  const cls = "ds-kbd" + (accent ? " ds-kbd--accent" : "");
  if (keys && keys.length) {
    return (
      <span className="ds-kbd-chord">
        {keys.map((k, i) => (
          <kbd key={i} className={cls}>{k}</kbd>
        ))}
      </span>
    );
  }
  return <kbd className={cls}>{children}</kbd>;
}
