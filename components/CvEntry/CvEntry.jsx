const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

function parseMonth(v) {
  if (!v) return null;
  const m = /^(\d{4})(?:-(\d{1,2}))?/.exec(String(v).trim());
  if (!m) return null;
  return { y: +m[1], m: m[2] ? +m[2] - 1 : 0, hasMonth: !!m[2] };
}

function fmtMonth(p) {
  return p.hasMonth ? MONTHS[p.m] + " " + p.y : String(p.y);
}

function fmtDuration(start, end) {
  const months = (end.y - start.y) * 12 + (end.m - start.m) + 1;
  if (months < 1) return null;
  const y = Math.floor(months / 12);
  const mo = months % 12;
  if (y && mo) return y + "y " + mo + "m";
  if (y) return y + "y";
  return mo + "m";
}

export function CvEntry({
  role,
  company,
  companyHref,
  start,
  end,
  date,
  location,
  showDuration = true,
  description,
  highlights = [],
  headingLevel = 3
}) {
  const s = parseMonth(start);
  const e = end === "present" || end === true ? "present" : parseMonth(end);
  let range = date;
  let duration = null;
  if (!range && s) {
    range = fmtMonth(s) + " — " + (e === "present" ? "present" : e ? fmtMonth(e) : "");
    if (showDuration) duration = fmtDuration(s, e === "present" || !e ? monthNow() : e);
  }

  const H = "h" + Math.min(6, Math.max(1, headingLevel));
  const companyEl = companyHref
    ? <a className="ds-cv__company" href={companyHref}>{company}</a>
    : <span className="ds-cv__company">{company}</span>;

  return (
    <article className="ds-cv">
      <div className="ds-cv__head">
        <H className="ds-cv__role">{role}</H>
        {range ? (
          <p className="ds-cv__when">
            <time className="ds-cv__range">{range}</time>
            {duration ? <span className="ds-cv__duration">{duration}</span> : null}
          </p>
        ) : null}
      </div>
      {company || location ? (
        <p className="ds-cv__meta">
          {company ? companyEl : null}
          {company && location ? <span className="ds-cv__sep"> · </span> : null}
          {location ? <span className="ds-cv__location">{location}</span> : null}
        </p>
      ) : null}
      {description ? <p className="ds-cv__desc">{description}</p> : null}
      {highlights.length ? (
        <ul className="ds-cv__highlights">
          {highlights.map((hl) => (
            <li key={typeof hl === "string" ? hl : hl.key} className="ds-cv__hl">{hl}</li>
          ))}
        </ul>
      ) : null}
    </article>
  );
}

function monthNow() {
  const d = new Date();
  return { y: d.getFullYear(), m: d.getMonth(), hasMonth: true };
}
