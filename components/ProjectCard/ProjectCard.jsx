import { Tag } from "../Tag/Tag.jsx";
import { StatusBadge } from "../StatusBadge/StatusBadge.jsx";

export function ProjectCard({ title, description, tags = [], status, subtle = false, href }) {
  const TitleTag = href ? "a" : "span";
  return (
    <div className={"ds-card" + (subtle ? " ds-card--subtle" : "")}>
      <div className="ds-card__head">
        <h3 className="ds-card__title">
          <TitleTag href={href}>
            {title}
          </TitleTag>
        </h3>
        {status ? <StatusBadge status={status} /> : null}
      </div>
      {description ? <p className="ds-card__desc">{description}</p> : null}
      {tags.length ? (
        <div className="ds-card__tags">
          {tags.map((t) => (
            <Tag key={t}>{t}</Tag>
          ))}
        </div>
      ) : null}
    </div>
  );
}
