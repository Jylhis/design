export function Steps({ steps = [], current = 0, orientation = "vertical" }) {
  return (
    <ol className={"ds-steps ds-steps--" + orientation}>
      {steps.map((s, i) => {
        const state = i < current ? "done" : i === current ? "current" : "todo";
        const glyph = state === "done" ? "\u2713" : state === "current" ? "\u25b8" : "\u00b7";
        const title = typeof s === "string" ? s : s.title;
        const note = typeof s === "string" ? null : s.note;
        return (
          <li className={"ds-steps__step is-" + state} key={i} aria-current={state === "current" ? "step" : undefined}>
            <span className="ds-steps__glyph" aria-hidden="true">{glyph}</span>
            <span className="ds-steps__index">{String(i + 1).padStart(2, "0")}</span>
            <span className="ds-steps__body">
              <span className="ds-steps__title">{title}</span>
              {note ? <span className="ds-steps__note">{note}</span> : null}
            </span>
            <span className="sr-only">{state}</span>
          </li>
        );
      })}
    </ol>
  );
}
