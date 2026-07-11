export function Kbd({ keys, accent = false, children }) {
  const cls = "ds-kbd" + (accent ? " ds-kbd--accent" : "");
  if (Array.isArray(keys) && keys.length) {
    return (
      <span className="ds-kbd-chord">
        {React.Children.toArray(keys.map((k) => <kbd className={cls}>{k}</kbd>))}
      </span>
    );
  }
  return <kbd className={cls}>{children}</kbd>;
}
