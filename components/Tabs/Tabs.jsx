export function Tabs({ tabs = [], defaultValue, value, onChange, variant = "folder", ...rest }) {
  const isControlled = value !== undefined;
  const [internal, setInternal] = React.useState(defaultValue ?? (tabs[0] && tabs[0].id));
  const active = isControlled ? value : internal;
  const baseId = React.useId();
  const tabId = (id) => `${baseId}-tab-${id}`;
  const panelId = (id) => `${baseId}-panel-${id}`;

  const select = (id) => {
    if (!isControlled) setInternal(id);
    if (onChange) onChange(id);
  };

  // Roving tabindex per platforms/KEYBOARD.md — arrows move + activate, focus
  // follows selection (automatic-activation tablist, WAI-APG).
  const onKeyDown = (e) => {
    const idx = tabs.findIndex((t) => t.id === active);
    let next = idx;
    if (e.key === "ArrowRight") next = (idx + 1) % tabs.length;
    else if (e.key === "ArrowLeft") next = (idx - 1 + tabs.length) % tabs.length;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = tabs.length - 1;
    else return;
    e.preventDefault();
    const id = tabs[next].id;
    select(id);
    const el = e.currentTarget.querySelector(`#${CSS.escape(tabId(id))}`);
    if (el) el.focus();
  };

  const activeTab = tabs.find((t) => t.id === active);
  return (
    <div className={"ds-tabs" + (variant === "rail" ? " ds-tabs--rail" : "")} {...rest}>
      <div role="tablist" className="ds-tabs__list" onKeyDown={onKeyDown}>
        {tabs.map((t) => {
          const selected = t.id === active;
          return (
            <button
              key={t.id}
              id={tabId(t.id)}
              type="button"
              role="tab"
              className="ds-tabs__tab"
              aria-selected={selected ? "true" : "false"}
              aria-controls={panelId(t.id)}
              tabIndex={selected ? 0 : -1}
              onClick={() => select(t.id)}
            >
              {t.label}
            </button>
          );
        })}
      </div>
      {activeTab ? (
        <div
          role="tabpanel"
          id={panelId(activeTab.id)}
          aria-labelledby={tabId(activeTab.id)}
          className="ds-tabs__panel"
          tabIndex={0}
        >
          {activeTab.panel}
        </div>
      ) : null}
    </div>
  );
}
